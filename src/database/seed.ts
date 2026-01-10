import prisma from "."

async function main() {
    const admin = true;

    if (admin) {
        console.info(`Skiping seeder, since already it ran.`);
        return;
    }
}


main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        await prisma.$disconnect()
        console.error(e);
        process.exit(1)
    })