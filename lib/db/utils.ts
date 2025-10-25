import prisma from "./index";

// Add this function for business users
export async function findorCreateBusiness(phone: string, name: string, email: string, companyName: string, location: string) {
    try {
        let business = await prisma.businessUser.findUnique({
            where: { phone }
        })

        if (!business) {
            business = await prisma.businessUser.create({
                data: {
                    phone: phone,
                    name: name,
                    email: email,
                    companyName: companyName,
                    location: location,
                    role: 'BUSINESS'
                }
            })
            console.log(`Business user created successfully, ${phone}`);
        } else {
            console.log(`Business user already exist, ${phone}`);
        }
        return business;
    } catch (error) {
        console.error("Error in creating or Finding Business User", error);
        throw error;
    }
};

export async function findorCreateWorker(phone: string, name?: string, services: string[] = []) {
    try {
        let worker = await prisma.worker.findUnique({
            where: { phone }
        })

        if (!worker) {
            worker = await prisma.worker.create({
                data: {
                    phone: phone,
                    name: name || `WORKER ${phone}`,
                    role: 'WORKER',
                    services: services,
                    isActive: true,
                    isVerified: false
                }
            })
            console.log(`Worker created successfully with services:`, services);
        } else {
            console.log(`Worker already exists: ${phone}`);

            // Update worker services if provided
            if (services.length > 0) {
                worker = await prisma.worker.update({
                    where: { phone },
                    data: {
                        services,
                        ...(name && { name }) // Update name if provided
                    }
                });
                console.log(`Worker services updated: ${services.join(', ')}`);
            }
        }

        return worker
    } catch (error) {
        console.error("Error in creating worker", error);
        throw error;
    }
}

export async function storeOTP(phone: string, code: string, userType: 'BUSINESS' | 'WORKER') {
    try {
        await prisma.verificationCode.deleteMany({
            where: { phone, userType }
        })
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000)
        const verificationCode = await prisma.verificationCode.create({
            data: {
                phone: phone,
                code,
                expiresAt,
                userType
            }
        })
        console.log(`Stored verification code for: ${phone}`)
        return verificationCode
    } catch (error) {
        console.error('Error in storing verification code:', error)
        throw error
    }
}

export async function verifyCode(phone: string, userType: 'BUSINESS' | 'WORKER', code: string) {
    try {
        console.log(`=== OTP VERIFICATION DEBUG ===`);
        console.log(`Input - Phone: ${phone}, UserType: ${userType}, Code: ${code}`);
        console.log(`Current time: ${new Date()}`);

        const verificationcode = await prisma.verificationCode.findFirst({
            where: {
                phone,
                code,
                userType,
                used: false,
                expiresAt: { gt: new Date() }
            }
        })

        console.log(`Database query result:`, verificationcode);

        if (verificationcode) {
            console.log(`OTP found! Expires at: ${verificationcode.expiresAt}`);
            await prisma.verificationCode.update({
                where: { id: verificationcode.id },
                data: { used: true }
            })
            console.log(`Code verified for: ${phone}`)
            console.log(`=== OTP VERIFICATION SUCCESS ===`);
            return true
        }

        console.log(`Invalid code for: ${phone}`);
        console.log(`=== OTP VERIFICATION FAILED ===`);
        return false

    } catch (error) {
        console.error('Error in verifying code:', error)
        throw error
    }
}