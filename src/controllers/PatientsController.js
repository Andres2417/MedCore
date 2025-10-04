import { PrismaClient } from "@prisma/client";
import csv from "csv-parser";
import fs from "fs";

const prisma = new PrismaClient();

export const createPatient = async (req, res) => {
  try {
    const { fullname, birthdate, email } = req.body;

    // Calcular edad
    const age = new Date().getFullYear() - new Date(birthdate).getFullYear();

    const patient = await prisma.patients.create({
      data: { fullname, birthdate: new Date(birthdate), email, age }
    });

    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPatients = async (req, res) => {
  try {
    const patients = await prisma.patients.findMany();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Carga masiva CSV
export const uploadPatientsCsv = async (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (row) => {
      results.push(row);
    })
    .on("end", async () => {
      try {
        await prisma.patients.createMany({
          data: results.map(r => ({
            fullname: r.fullname,
            birthdate: new Date(r.birthdate),
            email: r.email,
            phone: r.phone,
          })),
          skipDuplicates: true
        });
        res.json({ message: "Carga masiva completada", count: results.length });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
};
