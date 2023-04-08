/*
  Warnings:

  - A unique constraint covering the columns `[doctorId,patientId]` on the table `DoctorPatient` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DoctorPatient_doctorId_patientId_key" ON "DoctorPatient"("doctorId", "patientId");
