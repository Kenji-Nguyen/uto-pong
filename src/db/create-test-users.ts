import { db } from "./index";
import { user } from "./schema/auth";

/**
 * Create test users for development
 * Run with: pnpm tsx --env-file=.env src/db/create-test-users.ts
 */
async function createTestUsers() {
  console.log("🌱 Creating test users...");

  try {
    // Create test users with better-auth compatible structure
    const testUsers = await db.insert(user).values([
      {
        id: crypto.randomUUID(),
        name: "Alice Chen",
        email: "alice@test.com",
        emailVerified: true,
        isAdmin: true,
      },
      {
        id: crypto.randomUUID(),
        name: "Bob Smith",
        email: "bob@test.com",
        emailVerified: true,
        isAdmin: false,
      },
      {
        id: crypto.randomUUID(),
        name: "Charlie Park",
        email: "charlie@test.com",
        emailVerified: true,
        isAdmin: false,
      },
      {
        id: crypto.randomUUID(),
        name: "Diana Lee",
        email: "diana@test.com",
        emailVerified: true,
        isAdmin: false,
      },
    ]).returning();

    console.log(`✅ Created ${testUsers.length} test users:`);
    testUsers.forEach(u => {
      console.log(`   - ${u.name} (${u.email})${u.isAdmin ? ' [Admin]' : ''}`);
    });

    console.log("\n📝 Note: These users don't have passwords set.");
    console.log("You'll need to use the signup flow to create users with passwords,");
    console.log("or use these for testing API endpoints directly.");
  } catch (error) {
    console.error("❌ Error creating test users:", error);
    throw error;
  }
}

createTestUsers()
  .then(() => {
    console.log("\n✅ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Failed:", error);
    process.exit(1);
  });
