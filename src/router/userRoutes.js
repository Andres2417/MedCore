const express = require("express");
const router = express.Router();
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
// Configurar multer (archivos temporales en /uploads)
const upload = multer({ dest: "uploads/" });

// Función para normalizar roles
function normalizeRole(role) {
  if (!role) return "PACIENTE"; // default

  const r = role.toString().trim().toLowerCase();

  if (r.includes("admin")) return "ADMINISTRADOR";
  if (r.includes("medic")) return "MEDICO";
  if (r.includes("enfermer")) return "ENFERMERO";
  if (r.includes("pacient")) return "PACIENTE";

  // fallback role
  return "PACIENTE";
}

// Endpoint para cargue masivo de usuarios
// El archivo CSV debe tener las columnas: 
// email, fullname, role, current_password, status, specialization, department, license_number, phone, date_of_birth
router.post("/upload-users", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No se subió ningún archivo" });
  }

const filePath = req.file.path;
const results = [];
try {
  const raw = fs.readFileSync(filePath, "utf8");

// Limpia las comillas del principio y final de cada línea
const cleaned = raw
  .split("\n")
  .map(line => line.trim().replace(/^"|"$/g, ""))
  .join("\n");

// Guarda el archivo limpio temporalmente
fs.writeFileSync(filePath, cleaned);

fs.createReadStream(filePath)
  .pipe(csv({ separator: ',' }))
  .on("data", (data) => {
    if (!data.email || !data.fullname) {
      console.warn("Registro inválido, se omitió:", data);
      return;
    }
    results.push(data);
  })
  .on("end", async () => {
    try {
      for (const user of results) {
        await prisma.users.create({
          data: {
            email: user.email,
            fullname: user.fullname,
            role: normalizeRole(user.role),
            current_password: user.current_password,
            status: user.status || "PENDING",
            specialization: user.specialization || null,
            department: user.department || null,
            license_number: user.license_number || null,
            phone: user.phone || null,
            date_of_birth: user.date_of_birth ? new Date(user.date_of_birth) : null,
          },
        });
      }

      fs.unlinkSync(filePath);
      res.json({
        message: "Usuarios cargados correctamente",
        count: results.length,
      });
    } catch (err) {
      console.error("Error al guardar usuarios:", err);
      res.status(500).json({ message: "Error al guardar los usuarios" });
    }
  });

  } catch (error) {
    console.error("Error al procesar el archivo:", error);
    res.status(500).json({ message: "Error al procesar el archivo" });
  }
});
// Obtener todos los usuarios
router.get("/all", async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        fullname: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        date_of_birth: true,
        specialization: true,
        department: true,
        license_number: true,
      },
    });

    res.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
});


module.exports = router;
