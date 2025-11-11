import { db } from "./index";
import { user } from "./schema/auth";
import { ranks } from "./schema";
import { eq } from "drizzle-orm";

/**
 * Seed the database with initial data
 * Run with: pnpm db:seed
 */
async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // 1. Seed Ranks
    console.log("Creating ranks...");

    // Check if ranks already exist
    const existingRanks = await db.select().from(ranks);

    if (existingRanks.length === 0) {
      const ranksData = await db.insert(ranks).values([
        {
          name: "Newbie",
          minElo: 0,
          maxElo: 1099,
          color: "#94a3b8",
          badgeIcon: "user"
        },
        {
          name: "Ball Chaser",
          minElo: 1100,
          maxElo: 1299,
          color: "#60a5fa",
          badgeIcon: "target"
        },
        {
          name: "Spin Doctor",
          minElo: 1300,
          maxElo: 1499,
          color: "#a78bfa",
          badgeIcon: "zap"
        },
        {
          name: "Smash Master",
          minElo: 1500,
          maxElo: 1699,
          color: "#fb923c",
          badgeIcon: "flame"
        },
        {
          name: "Table Legend",
          minElo: 1700,
          maxElo: null,
          color: "#f59e0b",
          badgeIcon: "trophy"
        },
      ]).returning();
      console.log(`✓ Created ${ranksData.length} ranks`);
    } else {
      console.log(`✓ Ranks already exist (${existingRanks.length} ranks)`);
    }

    // 2. Create admin user if specified in env
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      console.log("Checking for admin user...");

      const existingAdmin = await db
        .select()
        .from(user)
        .where(eq(user.email, process.env.ADMIN_EMAIL as string));

      if (existingAdmin.length === 0) {
        console.log("⚠️  Note: Admin user must be created through signup flow");
        console.log(`   Go to http://localhost:3000/login and sign up with:`);
        console.log(`   Email: ${process.env.ADMIN_EMAIL}`);
        console.log(`   Then update the user's isAdmin field in the database`);
      } else {
        console.log(`✓ Admin user already exists`);
      }
    }

    console.log("\n✅ Database seeded successfully!");
    console.log("\nNext steps:");
    console.log("1. Go to http://localhost:3000/login");
    console.log("2. Sign up to create your first user");
    console.log("3. Create at least 2 users to test match creation");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log("\n✅ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Failed:", error);
    process.exit(1);
  });
