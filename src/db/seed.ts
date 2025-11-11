import { db } from "./index";
import { sql } from "drizzle-orm";
import {
  users,
  ranks,
  userStats,
  matches,
  games,
  eloHistory
} from "./schema";

async function clearDatabase() {
  console.log("🧹 Clearing existing data...");

  // Delete in order to respect foreign key constraints
  await db.delete(eloHistory);
  await db.delete(games);
  await db.delete(matches);
  await db.delete(userStats);
  await db.delete(users);
  await db.delete(ranks);

  console.log("✓ Database cleared");
}

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing data first
  await clearDatabase();

  // 1. Seed Ranks
  console.log("Creating ranks...");
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

  // 2. Seed Users
  console.log("Creating users...");
  const usersData = await db.insert(users).values([
    {
      name: "Alice Chen",
      email: "alice@example.com",
      isAdmin: true
    },
    {
      name: "Bob Smith",
      email: "bob@example.com",
      isAdmin: false
    },
    {
      name: "Charlie Park",
      email: "charlie@example.com",
      isAdmin: false
    },
    {
      name: "Diana Lee",
      email: "diana@example.com",
      isAdmin: false
    },
    {
      name: "Ethan Wong",
      email: "ethan@example.com",
      isAdmin: false
    },
    {
      name: "Fiona Kim",
      email: "fiona@example.com",
      isAdmin: false
    },
  ]).returning();
  console.log(`✓ Created ${usersData.length} users`);

  const [alice, bob, charlie, diana, ethan, fiona] = usersData;

  // 3. Seed User Stats (initial)
  console.log("Creating user stats...");
  const userStatsData = await db.insert(userStats).values([
    {
      userId: alice.id,
      currentElo: 1450,
      matchesPlayed: 12,
      matchesWon: 8,
      matchesLost: 4,
      isProvisional: false,
      currentStreak: 2,
      bestWinStreak: 4,
      worstLossStreak: -2,
      lastMatchDate: new Date('2025-11-10'),
    },
    {
      userId: bob.id,
      currentElo: 1280,
      matchesPlayed: 10,
      matchesWon: 5,
      matchesLost: 5,
      isProvisional: false,
      currentStreak: 1,
      bestWinStreak: 3,
      worstLossStreak: -3,
      lastMatchDate: new Date('2025-11-10'),
    },
    {
      userId: charlie.id,
      currentElo: 1150,
      matchesPlayed: 8,
      matchesWon: 4,
      matchesLost: 4,
      isProvisional: false,
      currentStreak: -1,
      bestWinStreak: 2,
      worstLossStreak: -2,
      lastMatchDate: new Date('2025-11-09'),
    },
    {
      userId: diana.id,
      currentElo: 1550,
      matchesPlayed: 15,
      matchesWon: 11,
      matchesLost: 4,
      isProvisional: false,
      currentStreak: 5,
      bestWinStreak: 5,
      worstLossStreak: -2,
      lastMatchDate: new Date('2025-11-10'),
    },
    {
      userId: ethan.id,
      currentElo: 980,
      matchesPlayed: 6,
      matchesWon: 2,
      matchesLost: 4,
      isProvisional: false,
      currentStreak: -2,
      bestWinStreak: 2,
      worstLossStreak: -3,
      lastMatchDate: new Date('2025-11-09'),
    },
    {
      userId: fiona.id,
      currentElo: 1000,
      matchesPlayed: 3,
      matchesWon: 1,
      matchesLost: 2,
      isProvisional: true,
      currentStreak: 1,
      bestWinStreak: 1,
      worstLossStreak: -2,
      lastMatchDate: new Date('2025-11-08'),
    },
  ]).returning();
  console.log(`✓ Created ${userStatsData.length} user stats`);

  // 4. Seed Matches (confirmed matches)
  console.log("Creating matches...");
  const matchesData = await db.insert(matches).values([
    {
      player1Id: alice.id,
      player2Id: bob.id,
      winnerId: alice.id,
      playMode: "best_of_3",
      status: "confirmed",
      matchScore: "2-1",
      playedAt: new Date('2025-11-10T14:00:00Z'),
      createdBy: alice.id,
      confirmedBy: bob.id,
      confirmedAt: new Date('2025-11-10T14:30:00Z'),
    },
    {
      player1Id: diana.id,
      player2Id: charlie.id,
      winnerId: diana.id,
      playMode: "best_of_3",
      status: "confirmed",
      matchScore: "2-0",
      playedAt: new Date('2025-11-10T15:00:00Z'),
      createdBy: diana.id,
      confirmedBy: charlie.id,
      confirmedAt: new Date('2025-11-10T15:30:00Z'),
    },
    {
      player1Id: bob.id,
      player2Id: charlie.id,
      winnerId: bob.id,
      playMode: "best_of_3",
      status: "confirmed",
      matchScore: "2-1",
      playedAt: new Date('2025-11-09T16:00:00Z'),
      createdBy: bob.id,
      confirmedBy: charlie.id,
      confirmedAt: new Date('2025-11-09T16:30:00Z'),
    },
    {
      player1Id: ethan.id,
      player2Id: fiona.id,
      winnerId: fiona.id,
      playMode: "best_of_3",
      status: "confirmed",
      matchScore: "2-0",
      playedAt: new Date('2025-11-08T10:00:00Z'),
      createdBy: ethan.id,
      confirmedBy: fiona.id,
      confirmedAt: new Date('2025-11-08T10:30:00Z'),
    },
    {
      player1Id: alice.id,
      player2Id: diana.id,
      winnerId: diana.id,
      playMode: "best_of_5",
      status: "confirmed",
      matchScore: "3-2",
      playedAt: new Date('2025-11-09T14:00:00Z'),
      createdBy: alice.id,
      confirmedBy: diana.id,
      confirmedAt: new Date('2025-11-09T15:00:00Z'),
    },
  ]).returning();
  console.log(`✓ Created ${matchesData.length} matches`);

  // 5. Seed Games (individual game scores)
  console.log("Creating games...");
  const gamesData = [];

  // Match 1: Alice vs Bob (2-1)
  gamesData.push(...await db.insert(games).values([
    { matchId: matchesData[0].id, gameNumber: 1, player1Score: 11, player2Score: 8, winnerId: alice.id },
    { matchId: matchesData[0].id, gameNumber: 2, player1Score: 9, player2Score: 11, winnerId: bob.id },
    { matchId: matchesData[0].id, gameNumber: 3, player1Score: 11, player2Score: 6, winnerId: alice.id },
  ]).returning());

  // Match 2: Diana vs Charlie (2-0)
  gamesData.push(...await db.insert(games).values([
    { matchId: matchesData[1].id, gameNumber: 1, player1Score: 11, player2Score: 7, winnerId: diana.id },
    { matchId: matchesData[1].id, gameNumber: 2, player1Score: 11, player2Score: 9, winnerId: diana.id },
  ]).returning());

  // Match 3: Bob vs Charlie (2-1)
  gamesData.push(...await db.insert(games).values([
    { matchId: matchesData[2].id, gameNumber: 1, player1Score: 11, player2Score: 9, winnerId: bob.id },
    { matchId: matchesData[2].id, gameNumber: 2, player1Score: 8, player2Score: 11, winnerId: charlie.id },
    { matchId: matchesData[2].id, gameNumber: 3, player1Score: 11, player2Score: 5, winnerId: bob.id },
  ]).returning());

  // Match 4: Ethan vs Fiona (0-2)
  gamesData.push(...await db.insert(games).values([
    { matchId: matchesData[3].id, gameNumber: 1, player1Score: 9, player2Score: 11, winnerId: fiona.id },
    { matchId: matchesData[3].id, gameNumber: 2, player1Score: 7, player2Score: 11, winnerId: fiona.id },
  ]).returning());

  // Match 5: Alice vs Diana (2-3)
  gamesData.push(...await db.insert(games).values([
    { matchId: matchesData[4].id, gameNumber: 1, player1Score: 11, player2Score: 9, winnerId: alice.id },
    { matchId: matchesData[4].id, gameNumber: 2, player1Score: 9, player2Score: 11, winnerId: diana.id },
    { matchId: matchesData[4].id, gameNumber: 3, player1Score: 11, player2Score: 8, winnerId: alice.id },
    { matchId: matchesData[4].id, gameNumber: 4, player1Score: 6, player2Score: 11, winnerId: diana.id },
    { matchId: matchesData[4].id, gameNumber: 5, player1Score: 10, player2Score: 12, winnerId: diana.id },
  ]).returning());

  console.log(`✓ Created ${gamesData.length} games`);

  // 6. Seed ELO History
  console.log("Creating ELO history...");
  const eloHistoryData = await db.insert(eloHistory).values([
    // Match 1: Alice vs Bob
    {
      userId: alice.id,
      matchId: matchesData[0].id,
      eloBefore: 1420,
      eloAfter: 1440,
      eloChange: 20,
      kFactor: 24,
      diminishingFactor: "1.00",
      isProvisional: false,
    },
    {
      userId: bob.id,
      matchId: matchesData[0].id,
      eloBefore: 1300,
      eloAfter: 1280,
      eloChange: -20,
      kFactor: 24,
      diminishingFactor: "1.00",
      isProvisional: false,
    },
    // Match 2: Diana vs Charlie
    {
      userId: diana.id,
      matchId: matchesData[1].id,
      eloBefore: 1520,
      eloAfter: 1545,
      eloChange: 25,
      kFactor: 24,
      diminishingFactor: "1.00",
      isProvisional: false,
    },
    {
      userId: charlie.id,
      matchId: matchesData[1].id,
      eloBefore: 1175,
      eloAfter: 1150,
      eloChange: -25,
      kFactor: 24,
      diminishingFactor: "1.00",
      isProvisional: false,
    },
    // Match 3: Bob vs Charlie
    {
      userId: bob.id,
      matchId: matchesData[2].id,
      eloBefore: 1260,
      eloAfter: 1280,
      eloChange: 20,
      kFactor: 24,
      diminishingFactor: "0.80",
      isProvisional: false,
    },
    {
      userId: charlie.id,
      matchId: matchesData[2].id,
      eloBefore: 1170,
      eloAfter: 1150,
      eloChange: -20,
      kFactor: 24,
      diminishingFactor: "0.80",
      isProvisional: false,
    },
    // Match 4: Ethan vs Fiona
    {
      userId: ethan.id,
      matchId: matchesData[3].id,
      eloBefore: 1000,
      eloAfter: 980,
      eloChange: -20,
      kFactor: 24,
      diminishingFactor: "1.00",
      isProvisional: false,
    },
    {
      userId: fiona.id,
      matchId: matchesData[3].id,
      eloBefore: 980,
      eloAfter: 1000,
      eloChange: 20,
      kFactor: 48,
      diminishingFactor: "1.00",
      isProvisional: true,
    },
    // Match 5: Alice vs Diana
    {
      userId: alice.id,
      matchId: matchesData[4].id,
      eloBefore: 1470,
      eloAfter: 1450,
      eloChange: -20,
      kFactor: 24,
      diminishingFactor: "1.00",
      isProvisional: false,
    },
    {
      userId: diana.id,
      matchId: matchesData[4].id,
      eloBefore: 1530,
      eloAfter: 1550,
      eloChange: 20,
      kFactor: 24,
      diminishingFactor: "1.00",
      isProvisional: false,
    },
  ]).returning();
  console.log(`✓ Created ${eloHistoryData.length} ELO history entries`);

  console.log("\n✅ Database seeded successfully!");
  console.log("\nSummary:");
  console.log(`- ${ranksData.length} ranks`);
  console.log(`- ${usersData.length} users`);
  console.log(`- ${userStatsData.length} user stats`);
  console.log(`- ${matchesData.length} matches`);
  console.log(`- ${gamesData.length} games`);
  console.log(`- ${eloHistoryData.length} ELO history entries`);
}

seed()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
