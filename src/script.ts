import { PrismaClient, User } from "@prisma/client";
import { error } from "console";
const prisma = new PrismaClient();
const express = require('express');

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 9000

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

app.get('/', (req: any, res: any) => { 
    res.send(`Our Cancer Registry Server is running successfully on port ${PORT}`)
})

// Create a new user with POST request
app.post(`/createUser`, async (req: { body: any }, res: { json: any }) => {
    try {
        const result = await prisma.user.create({
                data: {
                ...req.body
                },
        })
        res.json(result)
    }
    catch (error: any) {
        res.json({ message: error.message })
        // console.log(error)     
    }
})

// Get all users with GET request
app.get(`/getUsers`, async (req: any, res: { json: any }) => { 
    try {
        const result = await prisma.user.findMany()
        res.json(result)
    }
    catch (error: any) {
        res.json({ message: error.message })
        // console.log(error)     
    }
})

// Get all the users with role as 'PATIENT' with GET request
app.get(`/getPatients`, async (req: any, res: { json: any }) => { 
    try {
        const result = await prisma.user.findMany({
            where: {
                role: 'PATIENT'
            }
        })
        res.json(result)
    }
    catch (error: any) {
        res.json({ message: error.message })
        // console.log(error)     
    }
})

// Get all the users with role as 'DOCTOR' with GET request
app.get(`/getDoctors`, async (req: any, res: { json: any }) => { 
    try {
        const result = await prisma.user.findMany({
            where: {
                role: 'DOCTOR'
            }
        })
        res.json(result)
    }
    catch (error: any) {
        res.json({ message: error.message })
        // console.log(error)     
    }
})

// Get a user with GET request
// Send the id of the user in the body of the request
app.get(`/getUser`, async (req: { body: any }, res: { json: any }) => { 
    try {
        const { id } = req.body
        if (!id) {
            res.json({ message: 'Please provide the id of the user' })
        } else {
            const result = await prisma.user.findUnique({
                where: {
                    id
                }
            })
            res.json(result)
        }
    }
    catch (error: any) {
        res.json({ message: error.message })
        // console.log(error)     
    }
})

// Update any field of a user with PUT request
// Send the id of the user to be updated in the body of the request along with the field and the data of the field to be updated
// It is not possible to update the email, createdAt and updatedAt fields of the user
app.put(`/updateUser`, async (req: { body: any }, res: { json: any }) => {
    try {
        const { id } = req.body
        if (!id) {
            res.json({ message: 'Please provide the id of the user to be updated' })
        } else if (req.body.email) {
            res.json({ message: 'You cannot update the email of the user' })
        } else if (req.body.updatedAt) {
            res.json({ message: 'You cannot update the updatedAt field of the user' })
        } else if (req.body.createdAt) { 
            res.json({ message: 'You cannot update the createdAt field of the user' })
        } 
        const result = await prisma.user.update({
                where: { id },
                data: {
                ...req.body
                },
        })
        res.json(result)
    }
    catch (error: any) {
        res.json({ message: error.message })
        // console.log(error)     
    }
})

// Delete a user with DELETE request
// Send the id of the user to be deleted in the body of the request
app.delete(`/deleteUser`, async (req: { body: { id: any; }; }, res: { json: any }) => {
    try {
        const { id } = req.body
        if (!id) {
            res.json({ message: 'Please provide the id of the user to be deleted' })
        } else {
            const result = await prisma.user.delete({
                    where: { id },
            })
            res.json(result)
        }
    }
    catch (error: any) {
        res.json({ message: error.message })
        // console.log(error)     
    }
})

// Connect Doctor and Patient with POST request
// Send the id of the doctor and the patient in the body of the request
app.post(`/connectDoctorPatient`, async (req: { body: any }, res: { json: any }) => { 
    try {
        const { doctorId, patientId } = req.body
        if (!doctorId || !patientId) {
            res.json({ message: 'Please provide the id of the doctor and the patient' })
        } else {
            const result = await prisma.doctorPatient.create({
                data: {
                    doctorId,
                    patientId
                }
            })
            res.json(result)
        }
    }
    catch (error: any) {
        res.json({ message: error.message })
        // console.log(error)     
    }
})

// Get all the patients of a doctor with GET request
// Send the id of the doctor in the body of the request
app.get(`/getPatientsOfDoctor`, async (req: { body: any }, res: { json: any }) => { 
    try {
        const { doctorId } = req.body
        if (!doctorId) {
            res.json({ message: 'Please provide the id of the doctor' })
        } else {
            const result = await prisma.doctorPatient.findMany({
                where: {
                    doctorId
                },
                select: {
                    patient: true
                },
            })
            
            res.json(result)
        }
    }
    catch (error: any) {
        res.json({ message: error.message })
        // console.log(error)     
    }
})

// Get all the doctors of a patient with GET request
// Send the id of the patient in the body of the request
app.get(`/getDoctorsOfPatient`, async (req: { body: any }, res: { json: any }) => { 
    try {
        const { patientId } = req.body
        if (!patientId) {
            res.json({ message: 'Please provide the id of the patient' })
        } else {
            const result = await prisma.doctorPatient.findMany({
                where: {
                    patientId
                },
                select: {
                    doctor: true
                },
            })
            
            res.json(result)
        }
    }
    catch (error: any) {
        res.json({ message: error.message })
        // console.log(error)     
    }
})

// Delete the connection between a doctor and a patient with DELETE request
// Send the id of the doctor and the patient in the body of the request
app.delete(`/deleteDoctorPatient`, async (req: { body: any }, res: { json: any }) => { 
    try {
        const { doctorId, patientId } = req.body
        if (!doctorId || !patientId) {
            res.json({ message: 'Please provide the id of the doctor and the patient' })
        } else {
            const result = await prisma.doctorPatient.deleteMany({
                where: {
                    doctorId,
                    patientId
                }
            })
            res.json(result)
        }
    }
    catch (error: any) {
        res.json({ message: error.message })
        // console.log(error)     
    }
})

/* 
[
    {
        "id": "c11d9976-2fd7-47d5-86b5-85c678436468",
        "name": "Alice",
        "email": "alice@gmail.com",
        "dateOfBirth": null,
        "bloodGroup": null,
        "height": null,
        "weight": null,
        "contactNum": null,
        "address": null,
        "emergencyContact": null,
        "role": "PATIENT",
        "createdAt": "2023-04-08T07:51:14.799Z",
        "updatedAt": "2023-04-08T07:51:14.799Z"
    },
    {
        "id": "d04adbb5-ff6a-41af-8423-f65609e7fa37",
        "name": "Sally",
        "email": "sally@gmail.com",
        "dateOfBirth": null,
        "bloodGroup": null,
        "height": null,
        "weight": null,
        "contactNum": null,
        "address": null,
        "emergencyContact": null,
        "role": "PATIENT",
        "createdAt": "2023-04-08T07:54:31.113Z",
        "updatedAt": "2023-04-08T07:54:31.113Z"
    },
    {
        "id": "cc49e85a-0490-4df7-844b-d2eac089d81c",
        "name": "Simon Green",
        "email": "simon@gmail.com",
        "dateOfBirth": null,
        "bloodGroup": null,
        "height": null,
        "weight": null,
        "contactNum": null,
        "address": null,
        "emergencyContact": null,
        "role": "DOCTOR",
        "createdAt": "2023-04-08T10:33:49.633Z",
        "updatedAt": "2023-04-08T10:47:20.944Z"
    },
    {
        "id": "cb5f847a-1f2f-42e7-a9ed-6cbcc049d3a5",
        "name": "Siddik",
        "email": "siddik@gmail.com",
        "dateOfBirth": null,
        "bloodGroup": null,
        "height": null,
        "weight": null,
        "contactNum": null,
        "address": null,
        "emergencyContact": null,
        "role": "PATIENT",
        "createdAt": "2023-04-08T10:55:06.268Z",
        "updatedAt": "2023-04-08T10:55:06.268Z"
    },
    {
        "id": "20b7ae4e-19fc-442a-9660-a73b3c363f30",
        "name": "Rafi",
        "email": "rafi@gmail.com",
        "dateOfBirth": null,
        "bloodGroup": null,
        "height": null,
        "weight": null,
        "contactNum": null,
        "address": null,
        "emergencyContact": null,
        "role": "DOCTOR",
        "createdAt": "2023-04-08T10:57:59.080Z",
        "updatedAt": "2023-04-08T10:57:59.080Z"
    },
    {
        "id": "40a4987a-b79d-40f1-976e-01fccf02e158",
        "name": "Imrul",
        "email": "imrul@gmail.com",
        "dateOfBirth": null,
        "bloodGroup": null,
        "height": null,
        "weight": null,
        "contactNum": null,
        "address": null,
        "emergencyContact": null,
        "role": "PATIENT",
        "createdAt": "2023-04-08T10:58:16.674Z",
        "updatedAt": "2023-04-08T10:58:16.674Z"
    },
    {
        "id": "038dfae9-aa47-4473-9474-4f692b6f74ae",
        "name": "Jimon",
        "email": "jimon@gmail.com",
        "dateOfBirth": null,
        "bloodGroup": null,
        "height": null,
        "weight": null,
        "contactNum": null,
        "address": null,
        "emergencyContact": null,
        "role": "PATIENT",
        "createdAt": "2023-04-08T10:58:29.180Z",
        "updatedAt": "2023-04-08T10:58:29.180Z"
    },
    {
        "id": "d4dc2358-4b4c-47ef-bd64-5bd9e58cc6a8",
        "name": "Piyal",
        "email": "piyal@gmail.com",
        "dateOfBirth": null,
        "bloodGroup": null,
        "height": null,
        "weight": null,
        "contactNum": null,
        "address": null,
        "emergencyContact": null,
        "role": "PATIENT",
        "createdAt": "2023-04-08T10:58:43.527Z",
        "updatedAt": "2023-04-08T10:58:43.527Z"
    },
    {
        "id": "c43a259e-c001-425b-bfab-14737f84d43a",
        "name": "Mahim",
        "email": "mahim@gmail.com",
        "dateOfBirth": null,
        "bloodGroup": null,
        "height": null,
        "weight": null,
        "contactNum": null,
        "address": null,
        "emergencyContact": null,
        "role": "DOCTOR",
        "createdAt": "2023-04-08T10:58:58.978Z",
        "updatedAt": "2023-04-08T10:58:58.978Z"
    }
]

*/