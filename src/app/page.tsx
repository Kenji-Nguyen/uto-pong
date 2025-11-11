"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold">🏓 Uto Pong</h1>
          <nav className="flex gap-2">
            {session ? (
              <>
                <Button asChild variant="ghost">
                  <Link href="/matches">Matches</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link href="/roster">Player Roster</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/api/auth/sign-out">Sign Out</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/login">Get Started</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-5xl font-bold tracking-tight">
            Welcome to Uto Pong
          </h2>
          <p className="mb-8 text-xl text-muted-foreground">
            Track your ping pong matches, compete with friends, and climb the leaderboard!
          </p>

          <div className="mb-12 flex justify-center gap-4">
            {session ? (
              <>
                <Button asChild size="lg">
                  <Link href="/matches">View Matches</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/roster">View Players</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="lg">
                  <Link href="/login">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/roster">Browse Players</Link>
                </Button>
              </>
            )}
          </div>

          {/* Features */}
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Track Matches</CardTitle>
                <CardDescription>
                  Record and track all your ping pong matches with detailed scores
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>ELO Rankings</CardTitle>
                <CardDescription>
                  Compete and climb the ranks with our ELO-based ranking system
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Player Stats</CardTitle>
                <CardDescription>
                  View detailed statistics and performance metrics for every player
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Uto Pong - Your Ping Pong Tracking Platform</p>
        </div>
      </footer>
    </div>
  );
}
