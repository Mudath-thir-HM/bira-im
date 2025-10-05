import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  //Create achievements
  const achievements = [
    {
      name: "First Steps",
      description: "Complete your first lesson.",
      icon: "trophy",
    },
    {
      name: "Math Whiz",
      description: "Complete all Mathematics lessons.",
      icon: "trophy",
    },
    {
      name: "Scientist",
      description: "Complete all Science lessons.",
      icon: "trophy",
    },
    {
      name: "Bookworm",
      description: "Complete all English lessons.",
      icon: "trophy",
    },
    {
      name: "Historian",
      description: "Complete all History lessons.",
      icon: "trophy",
    },
    {
      name: "Quiz Master",
      description: "Score 100% on any quiz.",
      icon: "trophy",
    },
    {
      name: "XP Collector",
      description: "Reach 1000 XP.",
      icon: "trophy",
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { name: achievement.name },
      update: {},
      create: achievement,
    });
  }

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error("Error seeding database: ", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
