import prisma from "../src/utils/prisma.js"; // Adjust path based on your project
import { hashPassword } from "../src/helpers/bcrypt.js"; // Adjust path

const seedUsers = async () => {
    try {
        console.log("🌱 Seeding database...");

        // 🔹 Create sample users
        const users = [
            {
                email: "admin@example.com",
                password: await hashPassword("Admin@123"),
                role: "admin",
                isVerified: false, // Admin needs email verification
            },
            {
                email: "kakadedhananjay59@gmail.com",
                password: await hashPassword("Admin@123"),
                role: "admin",
                isVerified: false, // Admin needs email verification
            },
            {
                email: "teacher@example.com",
                password: await hashPassword("Teacher@123"),
                role: "teacher",
                isVerified: true,
            },
            {
                email: "student@example.com",
                password: await hashPassword("Student@123"),
                role: "student",
                isVerified: true,
            },
        ];

        // 🔹 Insert users into the database
        for (const user of users) {
            await prisma.user.upsert({
                where: { email: user.email },
                update: {},
                create: user,
            });
        }

        console.log("✅ Seeding completed!");
    } catch (error) {
        console.error("❌ Seeding failed:", error);
    } finally {
        await prisma.$disconnect();
    }
};

// Run the seed function
seedUsers();
