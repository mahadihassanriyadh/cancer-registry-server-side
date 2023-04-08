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

