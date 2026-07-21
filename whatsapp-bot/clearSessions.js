const { PrismaClient } = require('../prisma/generated/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Clearing unconnected sessions...");
    const result = await prisma.whatsAppSession.deleteMany({
        where: {
            isConnected: false
        }
    });
    console.log(`Deleted ${result.count} unconnected sessions.`);
    
    // Also delete any dangling auth state for these disconnected sessions so Baileys starts 100% fresh
    await prisma.whatsAppAuth.deleteMany();
    console.log("Cleared Auth state.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
