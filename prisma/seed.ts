import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

// npx vite-node prisma/seed.ts
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const db = new PrismaClient({ adapter });

const companies = [
  {
    name: "Brickell Financial Group",
    email: "info@brickellfinancial.com",
    phone: "+1 (305) 555-0101",
    address: "1001 Brickell Bay Dr, Suite 2700",
    city: "Miami",
    state: "FL",
    country: "US",
    website: "https://brickellfinancial.com",
  },
  {
    name: "Coral Gables Law Partners",
    email: "office@cglaw.com",
    phone: "+1 (305) 555-0202",
    address: "2525 Ponce de Leon Blvd, Floor 8",
    city: "Coral Gables",
    state: "FL",
    country: "US",
    website: "https://cglaw.com",
  },
  {
    name: "Wynwood Creative Agency",
    email: "hello@wynwoodcreative.co",
    phone: "+1 (786) 555-0303",
    address: "250 NW 23rd St",
    city: "Miami",
    state: "FL",
    country: "US",
    website: "https://wynwoodcreative.co",
  },
  {
    name: "South Beach Hospitality Group",
    email: "contact@sbhgroup.com",
    phone: "+1 (305) 555-0404",
    address: "1100 Collins Ave, Suite 400",
    city: "Miami Beach",
    state: "FL",
    country: "US",
    website: "https://sbhgroup.com",
  },
  {
    name: "Doral Tech Solutions",
    email: "info@doraltech.io",
    phone: "+1 (786) 555-0505",
    address: "8200 NW 41st St, Suite 300",
    city: "Doral",
    state: "FL",
    country: "US",
    website: "https://doraltech.io",
  },
  {
    name: "Coconut Grove Medical Center",
    email: "admin@cgmedical.org",
    phone: "+1 (305) 555-0606",
    address: "3100 SW 27th Ave",
    city: "Miami",
    state: "FL",
    country: "US",
    website: "https://cgmedical.org",
  },
  {
    name: "Aventura Real Estate Group",
    email: "sales@aventurarealty.com",
    phone: "+1 (305) 555-0707",
    address: "19501 Biscayne Blvd, Floor 12",
    city: "Aventura",
    state: "FL",
    country: "US",
    website: "https://aventurarealty.com",
  },
  {
    name: "Little Havana Imports Co.",
    email: "ventas@lhimports.com",
    phone: "+1 (786) 555-0808",
    address: "1500 SW 8th St",
    city: "Miami",
    state: "FL",
    country: "US",
    website: "https://lhimports.com",
  },
  {
    name: "Key Biscayne Wealth Advisors",
    email: "advisory@kbwealth.com",
    phone: "+1 (305) 555-0909",
    address: "328 Crandon Blvd, Suite 200",
    city: "Key Biscayne",
    state: "FL",
    country: "US",
    website: "https://kbwealth.com",
  },
  {
    name: "Midtown Marketing Co.",
    email: "team@midtownmktg.com",
    phone: "+1 (786) 555-1010",
    address: "3401 N Miami Ave, Floor 5",
    city: "Miami",
    state: "FL",
    country: "US",
    website: "https://midtownmktg.com",
  },
  {
    name: "Kendall Engineering Services",
    email: "projects@kendalleng.com",
    phone: "+1 (305) 555-1111",
    address: "12000 SW 88th St, Suite 150",
    city: "Miami",
    state: "FL",
    country: "US",
    website: "https://kendalleng.com",
  },
  {
    name: "Edgewater Architecture Studio",
    email: "studio@edgewaterarch.com",
    phone: "+1 (786) 555-1212",
    address: "1800 Biscayne Blvd, Floor 3",
    city: "Miami",
    state: "FL",
    country: "US",
    website: "https://edgewaterarch.com",
  },
];

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
