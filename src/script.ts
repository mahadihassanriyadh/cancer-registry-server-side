import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const express = require('express');

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 9000

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

async function main() {
    const user = await prisma.user.create({
        data: {
            name: "Sally",
            email: "sally@gmail.com",
            malignancies: {
                create: {
                    name: "Breast Cancer",
                },
            }
        }
    });
    console.log(user);
}
main()
    .catch((e) => { 
        console.error(e.message);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 