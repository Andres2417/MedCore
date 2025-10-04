const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
//Permite encriptar la contraseña
const bcrypt = require ("bcrypt");
//permite crear y verificar si los tokens al momento de iniciar sesion
const jwt = require("jsonwebtoken");
// para envio de correos electronicos
const nodemailer= require("nodemailer");
const { generateVerificationCode, sendVerificationEmail } = require("../config/emailConfig");

const signup = async (req, res) =>{
    let {email, current_password, fullname } = req.body;
    console.log(req.body);
    if (!email || !current_password || !fullname){
        return res.status(400).json({message: "Faltan datos obligatorios"});
    }

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (email) email = email.toLowerCase().trim();
    console.log(email);
    if (!emailRegex.test(email)){
        return res
        .status(400)
        .json({messge: "Formato de correo electronico es incorrecto"})
    }
    if (current_password.length < 6 ){
        return res
        .status(400)
        .json({messge: "La contraseña debe tener al menos 6 caracteres"})
    }
    const passwordRegex= /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(current_password)){
        return res
        .status(400)
        .json({messge: "La contraseña debe tener al menos un número"})
    }
    //Validar que el correo no exista en la BD
    let userExists = await prisma.users.findUnique({where: {email}});
    console.log(userExists);
    if (userExists) {
        return res.status(400).json({message: "El usuario ya está registrado"})
    }
    //incluye el codigo de verificacion  - 15min
    const verificationCode = generateVerificationCode();
    const verificationExpires = new Date();
    verificationExpires.setMinutes(verificationExpires.getMinutes() + 15);

    //crear usuario con estado PENDING
    const createUser = await prisma.users.create({
        data: {
            email,
            current_password : await bcrypt.hash(current_password, 10),
            fullname,
            status : "PENDING",
            verificationCode,
            verificationExpires: verificationExpires,
        },
    });
    console.log(createUser);
    const emailResult = await sendVerificationEmail(email, fullname, verificationCode);
    if (!emailResult.success){
        //si falla el envio, eliminar el usuario creado
        await prisma.users.delete({
            where: {id: createUser.id}});
        return res.status(500).json({
            message: "error enviando el email de verificacion. Intenta nuevamente."
        });
    }
    return res.status(201).json(createUser);
};

const verifyEmail = async (req, res) =>{
    try {
        const {email, verificationCode} = req.body;
        if (!email || !verificationCode){
            return res.status(400).json({
                message:"Email y codigo de verificacion son requeridos"
            });
        }//buscar usuario por email
        const user = await prisma.users.findUnique({
            where: {email:email.toLowerCase().trim()},
        });
        if (!user){
            return res.status(404).json({message: "usuario no encontrado"});
        }
        if (user.status === "ACTIVE"){
            return res.status(400).json({message: "La cuenta ya esta verificada"});
        }
        //verificar si el codigo ha expirado
        if (new Date() > user.verificationExpires){
            return res.status(400).json({
                message: "codigo de verificacion incorrecto",
            });

        }
        //activa la cuenta
        const updateUser = await prisma.users.update({
            where:{id : user.id},
            data:{
                status: "ACTIVE",
                verificationCode: null,
                verificationExpires: null,
            },
        });
        return res.status(200).json({
            message: "email verificado correctamente. Tu cuenta ahora está activa.",
            user:{
                id: updateUser.id,
                email: updateUser.email,
                fullname: updateUser.fullname,
                status: updateUser.status,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: "error interno del servidor"
        })
    }
}
const resendVerificationCode = async (req, res) =>{
    try{
        const {email} = req.body;
        if (!email){
            return res.status(400).json({message: "email es requerido"});
        }
        if(user.status==="ACTIVE"){
            return res.status(400).json({message: "la cuenta ya esta verificada"});

        }
        //generar nuevo codigo
        const verificationCode = generateVerificationCode();
        const verificationExpires = new Date();
        verificationExpires.setMinutes(verificationExpires.getMinutes() + 15);
        //Actualizar usuario con nuevo codigo
        await prisma.users.update({
            where: { id: user.id},
            data:{
                verificationCode,
                verificationExpires: verificationExpires,
            },
        });

    //enviar nuevo email
    const emailResult = await sendVerificationEmail(
        email,
        user.fullname,
        verificationCode,
    );
    if (!emailResult.success) {
        return res.status(500).json({
            message: "Error enviando email de verificacion",
        });
    }
        return res.status(200).json({
        message:"nuevo codigo de verificacion enviado a tu email",
    });
    }catch(error){
        console.error("error en resendVerificationCode: ", error);
        return res.status(500).json({
            message:"error interno del servidor",
        });
    }
};




const login = async (req, res) => {
  try {
    let { email, current_password } = req.body;

    if (!email || !current_password) {
      return res.status(400).json({ message: "Email y contraseña son requeridos" });
    }

    // Normalizar email
    email = email.toLowerCase().trim();

    // Buscar usuario
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar si la cuenta está activa
    if (user.status !== "ACTIVE") {
      return res.status(403).json({ message: "La cuenta no está verificada o activa" });
    }

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(current_password, user.current_password);
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Generar JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "1h" }
    );

    // Respuesta exitosa
    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        status: user.status,
      },
    });

  } catch (error) {
    console.error("Error en signin: ", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = { login, signup, resendVerificationCode, verifyEmail };
