import csv from "csv-parser";
import { Readable } from "stream";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🧩 Normalizar roles de usuario
function normalizeRole(role) {
  if (!role) return "PACIENTE";
  const r = role.toString().trim().toLowerCase();
  if (r.includes("admin")) return "ADMINISTRADOR";
  if (r.includes("medic")) return "MEDICO";
  if (r.includes("enfermer")) return "ENFERMERO";
  if (r.includes("pacient")) return "PACIENTE";
  return "PACIENTE";
}

export const uploadUsers = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No se subió ningún archivo." });
  }

  // Límite de tamaño (60 MB)
  if (req.file.size > 60 * 1024 * 1024) {
    return res.status(400).json({ message: "El archivo supera el límite de 60MB." });
  }

  try {
    const buffer = req.file.buffer; // viene de memoryStorage()
    const results = [];

    // Convertir el buffer en stream legible
    const stream = Readable.from(buffer.toString());

    stream
      .pipe(csv({ separator: "," }))
      .on("data", (data) => {
        if (!data.email || !data.fullname || !data.current_password) return;
        results.push(data);
      })
      .on("end", async () => {
        let inserted = 0;
        let duplicates = 0;
        let errors = 0;

        for (const user of results) {
          try {
            const email = user.email.toLowerCase().trim();

            // Verificar si ya existe el usuario
            const existing = await prisma.users.findUnique({
              where: { email },
            });

            if (existing) {
              duplicates++;
              continue;
            }

            const hashedPassword = await bcrypt.hash(user.current_password, 10);

            await prisma.users.create({
              data: {
                email,
                fullname: user.fullname.trim(),
                role: normalizeRole(user.role),
                current_password: hashedPassword,
                status: user.status?.trim() || "PENDING",
                specialization: user.specialization?.trim() || null,
                department: user.department?.trim() || null,
                license_number: user.license_number?.trim() || null,
                phone: user.phone?.trim() || null,
                date_of_birth: user.date_of_birth
                  ? new Date(user.date_of_birth)
                  : null,
              },
            });

            inserted++;
          } catch (err) {
            console.error(`Error con ${user.email}:`, err.message);
            errors++;
          }
        }

        return res.json({
          message: "Proceso completado",
          total: results.length,
          insertados: inserted,
          duplicados: duplicates,
          fallidos: errors,
        });
      });
  } catch (error) {
    console.error("Error al procesar el archivo:", error);
    return res.status(500).json({ message: "Error al procesar el archivo CSV." });
  }
};
