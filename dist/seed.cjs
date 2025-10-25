"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// scripts/seed-services.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const servicesData = [
    {
        name: "Hotel / Restaurant Staff",
        description: "Professional hospitality staff for hotels and restaurants including servers, housekeeping, kitchen staff, and management personnel.",
        category: "hospitality",
        basePrice: 600,
        serviceCharge: 108,
        duration: "8 hours",
        image: "/images/services/hotel-staff.png",
        tags: ["hotel", "restaurant", "hospitality", "service staff", "kitchen"],
        seoKeywords: ["hotel staff", "restaurant staff", "hospitality workers", "service personnel", "hotel management"],
        popularity: 85,
        featured: true,
        isActive: true
    },
    {
        name: "Transport Staff",
        description: "Skilled transport and logistics personnel including drivers, delivery executives, and transport management staff.",
        category: "transportation",
        basePrice: 550,
        serviceCharge: 99,
        duration: "8 hours",
        image: "/images/services/transport-staff.png",
        tags: ["transport", "logistics", "drivers", "delivery", "shipping"],
        seoKeywords: ["transport staff", "logistics workers", "delivery personnel", "drivers", "transport management"],
        popularity: 80,
        featured: true,
        isActive: true
    },
    {
        name: "Hospital Staff",
        description: "Medical and healthcare support staff including nursing assistants, ward boys, pharmacy helpers, and hospital support personnel.",
        category: "healthcare",
        basePrice: 650,
        serviceCharge: 117,
        duration: "8 hours",
        image: "/images/services/hospital-staff.png",
        tags: ["hospital", "healthcare", "medical", "nursing", "support staff"],
        seoKeywords: ["hospital staff", "medical workers", "healthcare support", "nursing assistants", "hospital helpers"],
        popularity: 90,
        featured: true,
        isActive: true
    },
    {
        name: "Retail & Warehouse",
        description: "Retail store assistants and warehouse workers for inventory management, customer service, and logistics operations.",
        category: "retail",
        basePrice: 500,
        serviceCharge: 90,
        duration: "8 hours",
        image: "/images/services/retail-warehouse.png",
        tags: ["retail", "warehouse", "inventory", "store assistant", "logistics"],
        seoKeywords: ["retail staff", "warehouse workers", "store assistants", "inventory management", "retail support"],
        popularity: 75,
        featured: false,
        isActive: true
    },
    {
        name: "Factory Helper",
        description: "Industrial factory helpers and production assistants for manufacturing units, assembly lines, and industrial operations.",
        category: "industrial",
        basePrice: 450,
        serviceCharge: 81,
        duration: "8 hours",
        image: "/images/services/factory-helper.png",
        tags: ["factory", "manufacturing", "industrial", "production", "assembly"],
        seoKeywords: ["factory helpers", "manufacturing workers", "industrial staff", "production assistants", "factory labor"],
        popularity: 70,
        featured: false,
        isActive: true
    }
];
async function seedServices() {
    try {
        console.log('🌱 Seeding services...');
        for (const serviceData of servicesData) {
            await prisma.service.upsert({
                where: { name: serviceData.name },
                update: serviceData,
                create: serviceData
            });
            console.log(`✅ Seeded service: ${serviceData.name}`);
        }
        console.log('🎉 Services seeding completed!');
    }
    catch (error) {
        console.error('❌ Error seeding services:', error);
        process.exit(1);
    }
    finally {
        await prisma.$disconnect();
    }
}
seedServices();
