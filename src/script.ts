import { PrismaClient, User } from "@prisma/client";
const { processDocument, parseHematologyReport } = require('../src/dataProcess.ts');
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
// Send the user details in the body of the request, name, email
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
             
    }
})

// Create a new test with POST request
// Send the name of the test in the body of the request
app.post(`/createMedicalTest`, async (req: { body: any }, res: { json: any }) => { 
    try {
        const { name } = req.body
        if (!name) {
            res.json({ message: 'Please provide the name of the test' })
        } else {
            const result = await prisma.medicalTest.create({
                data: {
                    name
                }
            })
            res.json(result)
        }
    }
    catch (error: any) {
        res.json({ message: error.message })
             
    }
})

// Get all the tests with GET request
app.get(`/getMedicalTests`, async (req: any, res: { json: any }) => {
    try {
        const result = await prisma.medicalTest.findMany()
        res.json(result)
    }
    catch (error: any) {
        res.json({ message: error.message })
             
    }
})
 
// Create a new medical report with POST request
// Send the id of the patient, the id of the test, the link of the image of the test report in the body of the request
app.post(`/createMedicalReport`, async (req: { body: { patientId: string, testId: string, imageUrl: string } }, res: { json: any }) => { 
    try {
        const { patientId, testId, imageUrl } = req.body
        console.log(patientId, testId, imageUrl)
        if (!patientId || !testId || !imageUrl) {
            res.json({ message: 'Please provide the id of the patient, the id of the test and the image of the test report' })
        } else {
            await processDocument(imageUrl).then(async (data: any) => {
                const { ocr_text, pdf_url } = data || {};
                console.log(ocr_text)
                const extractedDataFromReport = parseHematologyReport(ocr_text);
                const result = await prisma.medicalReport.create({
                    data: {
                        patientId,
                        testId,
                        data: {
                            reportData: extractedDataFromReport,
                            pdf_url,
                        },
                    }
                })
                res.json(result)
            });
        }
    }
    catch (error: any) {
        res.json({ message: error.message })
    }
})

// Create malignancy with POST request
// Send the name of the malignancy in the body of the request
app.post(`/createMalignancy`, async (req: { body: any }, res: { json: any }) => { 
    try {
        const { name } = req.body
        if (!name) {
            res.json({ message: 'Please provide the name of the malignancy' })
        } else {
            const result = await prisma.malignancy.create({
                data: {
                    name
                }
            })
            res.json(result)
        }
    }
    catch (error: any) {
        res.json({ message: error.message })
             
    }
})

// Get all the malignancies with GET request
app.get(`/getMalignancies`, async (req: any, res: { json: any }) => { 
    try {
        const result = await prisma.malignancy.findMany()
        res.json(result)
    }
    catch (error: any) {
        res.json({ message: error.message })
             
    }
})

// Create relationship between a patient and a malignancy with POST request
// Send the id of the patient and the id of the malignancy in the body of the request
app.post(`/connectPatientMalignancy`, async (req: { body: any }, res: { json: any }) => { 
    try {
        const { patientId, malignancyId } = req.body
        if (!patientId || !malignancyId) {
            res.json({ message: 'Please provide the id of the patient and the id of the malignancy' })
        } else {
            const result = await prisma.patientMalignancy.create({
                data: {
                    patientId,
                    malignancyId
                }
            })
            res.json(result)
        }
    }
    catch (error: any) {
        res.json({ message: error.message })
             
    }
})


/* 
image link1: https://i.ibb.co/grvcjDr/hematology-report-1.jpg
image link2: https://i.ibb.co/mqqZdpn/hematology-report-2.jpg

*/

/* Maliangies
[
    {
        "id": "edb74a5b-39d5-4b16-865e-014654bfbad1",
        "name": "Bladder Cancer",
        "createdAt": "2023-04-08T20:41:28.253Z",
        "updatedAt": "2023-04-08T20:41:28.253Z"
    },
    {
        "id": "1692f0d9-d9aa-4074-92ab-3a48a4c4c1a6",
        "name": "Breast Cancer",
        "createdAt": "2023-04-08T20:42:08.645Z",
        "updatedAt": "2023-04-08T20:42:08.645Z"
    },
    {
        "id": "eb1875d6-e8db-411c-b4b0-2cd4a0cf0866",
        "name": "Kidney Cancer",
        "createdAt": "2023-04-08T20:42:31.178Z",
        "updatedAt": "2023-04-08T20:42:31.178Z"
    },
    {
        "id": "4c74268c-f432-457f-80c5-fb85a8dd5c7b",
        "name": "Colorectal Cancer",
        "createdAt": "2023-04-08T21:16:28.551Z",
        "updatedAt": "2023-04-08T21:16:28.551Z"
    },
    {
        "id": "ac5c793c-5ff0-40f4-80b4-e815078f6139",
        "name": "Kidney Cancer",
        "createdAt": "2023-04-08T21:16:49.851Z",
        "updatedAt": "2023-04-08T21:16:49.851Z"
    },
    {
        "id": "fceacb2e-1c87-47a9-b711-146efa5ed1f0",
        "name": "Lymphoma",
        "createdAt": "2023-04-08T21:17:00.368Z",
        "updatedAt": "2023-04-08T21:17:00.368Z"
    }
]
*/

/* MEDICAL TESTS
[
    {
        "id": "6006d34a-16cc-4cb8-8006-24e32e3eb2ed",
        "name": "Hematology Test",
        "createdAt": "2023-04-08T21:15:22.397Z",
        "updatedAt": "2023-04-08T21:15:22.397Z"
    },
    {
        "id": "dad6c029-eee2-40f6-87ff-1ee66504405c",
        "name": "Biochemistry Profiling Test",
        "createdAt": "2023-04-08T21:15:31.977Z",
        "updatedAt": "2023-04-08T21:15:31.977Z"
    }
]
*/

/* DOCTORS 
[
    {
        "id": "6ffded0a-3ce3-4c67-8155-0b2b302aa351",
        "name": "Mahim Ahmed",
        "email": "mahim@gmail.com",
        "dateOfBirth": null,
        "bloodGroup": null,
        "height": null,
        "weight": null,
        "contactNum": null,
        "address": null,
        "emergencyContact": null,
        "role": "DOCTOR",
        "createdAt": "2023-04-08T21:01:13.621Z",
        "updatedAt": "2023-04-08T21:01:13.621Z"
    },
    {
        "id": "9adf8625-fe5d-46fd-94c3-4d63c6dcbc35",
        "name": "Jimon Mosharrof",
        "email": "jimon@gmail.com",
        "dateOfBirth": null,
        "bloodGroup": null,
        "height": null,
        "weight": null,
        "contactNum": null,
        "address": null,
        "emergencyContact": null,
        "role": "DOCTOR",
        "createdAt": "2023-04-08T21:01:36.587Z",
        "updatedAt": "2023-04-08T21:01:36.587Z"
    },
    {
        "id": "bd42ad89-eb52-4a61-9261-29fb0cab082f",
        "name": "Dr. Mahmud Khan",
        "email": "dr.mahmud@gmail.com",
        "dateOfBirth": null,
        "bloodGroup": null,
        "height": null,
        "weight": null,
        "contactNum": null,
        "address": null,
        "emergencyContact": null,
        "role": "DOCTOR",
        "createdAt": "2023-04-08T21:01:58.161Z",
        "updatedAt": "2023-04-08T21:01:58.161Z"
    },
    {
        "id": "c968ba08-a431-4c9a-84f3-f6e3a9716f71",
        "name": "Shariar Emon Shaikat",
        "email": "shaikat@gmail.com",
        "dateOfBirth": null,
        "bloodGroup": null,
        "height": null,
        "weight": null,
        "contactNum": null,
        "address": null,
        "emergencyContact": null,
        "role": "DOCTOR",
        "createdAt": "2023-04-08T21:09:52.613Z",
        "updatedAt": "2023-04-08T21:09:52.613Z"
    }
]
*/
    
/* PATIENTS
 [
    {
        "id": "4612c735-c73f-4f44-9830-933081b7cbfb",
        "name": "Meherul Hassan",
        "email": "meherul@gmail.com",
        "dateOfBirth": null,
        "bloodGroup": null,
        "height": null,
        "weight": null,
        "contactNum": null,
        "address": null,
        "emergencyContact": null,
        "role": "PATIENT",
        "createdAt": "2023-04-08T21:02:16.100Z",
        "updatedAt": "2023-04-08T21:02:16.100Z"
    },
    {
        "id": "07a5d7a4-15b5-414c-97f4-00cd327414cc",
        "name": "Razzak Mia",
        "email": "razzak@gmail.com",
        "dateOfBirth": null,
        "bloodGroup": null,
        "height": null,
        "weight": null,
        "contactNum": null,
        "address": null,
        "emergencyContact": null,
        "role": "PATIENT",
        "createdAt": "2023-04-08T21:02:28.791Z",
        "updatedAt": "2023-04-08T21:02:28.791Z"
    },
    {
        "id": "fc1abdfc-2805-4920-9a11-8f10beee51ee",
        "name": "Imrul Islam",
        "email": "imrul@gmail.com",
        "dateOfBirth": null,
        "bloodGroup": null,
        "height": null,
        "weight": null,
        "contactNum": null,
        "address": null,
        "emergencyContact": null,
        "role": "PATIENT",
        "createdAt": "2023-04-08T21:03:01.938Z",
        "updatedAt": "2023-04-08T21:06:16.442Z"
    },
    {
        "id": "4313bcee-da0f-460d-9cb0-3185af8682b3",
        "name": "Alex Hormonzi",
        "email": "alex@gmail.com",
        "dateOfBirth": null,
        "bloodGroup": null,
        "height": null,
        "weight": null,
        "contactNum": null,
        "address": null,
        "emergencyContact": null,
        "role": "PATIENT",
        "createdAt": "2023-04-08T21:02:53.739Z",
        "updatedAt": "2023-04-08T21:06:31.830Z"
    },
    {
        "id": "e1456203-d3ee-466d-8187-2390128409d5",
        "name": "Nipa Khan",
        "email": "nipa@gmail.com",
        "dateOfBirth": null,
        "bloodGroup": null,
        "height": null,
        "weight": null,
        "contactNum": null,
        "address": null,
        "emergencyContact": null,
        "role": "PATIENT",
        "createdAt": "2023-04-08T21:02:48.237Z",
        "updatedAt": "2023-04-08T21:06:52.881Z"
    },
    {
        "id": "a96db201-1b9f-4c0e-b96c-6fd1dc92cb20",
        "name": "Minu Roy",
        "email": "mina@gmail.com",
        "dateOfBirth": null,
        "bloodGroup": null,
        "height": null,
        "weight": null,
        "contactNum": null,
        "address": null,
        "emergencyContact": null,
        "role": "PATIENT",
        "createdAt": "2023-04-08T21:02:40.133Z",
        "updatedAt": "2023-04-08T21:07:06.145Z"
    },
    {
        "id": "7808b7a5-6b6b-44d5-a51d-397c512e5f3e",
        "name": "Nidhi",
        "email": "nidhi@gmail.com",
        "dateOfBirth": null,
        "bloodGroup": null,
        "height": null,
        "weight": null,
        "contactNum": null,
        "address": null,
        "emergencyContact": null,
        "role": "PATIENT",
        "createdAt": "2023-04-08T21:10:15.599Z",
        "updatedAt": "2023-04-08T21:10:15.599Z"
    }
]

*/