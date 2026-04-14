import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { companies } from "./companies";

// npx vite-node prisma/seed.ts
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const db = new PrismaClient({ adapter });



async function main() {
  // Find the first team to attach companies to
  const team = await db.team.findFirst();

  if (!team) {
    console.error("❌ No team found. Register an account first so a team exists.");
    process.exit(1);
  }

  console.log(`\n🌹 Seeding companies for team: "${team.name}" (${team.id})\n`);

  let created = 0;
  let skipped = 0;

  for (const company of companies) {
    const existing = await db.company.findFirst({
      where: { email: company.email, teamId: team.id },
    });

    if (existing) {
      console.log(`  ⏭  Skipped "${company.name}" (already exists)`);
      skipped++;
      continue;
    }

    await db.company.create({
      data: {
        ...company,
        teamId: team.id,
      },
    });

    console.log(`  ✅ Created "${company.name}"`);
    created++;
  }

  console.log(`\n📊 Done! Created: ${created}, Skipped: ${skipped}\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
