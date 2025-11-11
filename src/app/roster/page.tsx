"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Player {
  id: string;
  name: string;
  email: string | null;
  createdAt: Date;
  isAdmin: boolean;
}

export default function RosterPage() {
  const { data: session } = useSession();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/players");
      if (!response.ok) throw new Error("Failed to fetch players");

      const data = await response.json();
      setPlayers(data);
    } catch (err: any) {
      setError(err.message || "Failed to load players");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/">
            <h1 className="text-2xl font-bold cursor-pointer">🏓 Uto Pong</h1>
          </Link>
          <nav className="flex gap-2">
            {session ? (
              <>
                <Button asChild variant="ghost">
                  <Link href="/roster">Player Roster</Link>
                </Button>
                <Button onClick={handleSignOut} variant="outline">
                  Sign Out
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

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Player Roster</CardTitle>
              <CardDescription>
                View all registered players in the Uto Pong community
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex h-48 items-center justify-center">
                  <p className="text-muted-foreground">Loading players...</p>
                </div>
              ) : error ? (
                <div className="flex h-48 items-center justify-center">
                  <div className="rounded-md bg-destructive/10 p-4 text-destructive">
                    {error}
                  </div>
                </div>
              ) : players.length === 0 ? (
                <div className="flex h-48 flex-col items-center justify-center gap-4">
                  <p className="text-muted-foreground">No players registered yet</p>
                  {!session && (
                    <Button asChild>
                      <Link href="/login">Be the First to Join</Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Role</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {players.map((player) => (
                        <TableRow key={player.id}>
                          <TableCell className="font-medium">{player.name}</TableCell>
                          <TableCell>{player.email || "N/A"}</TableCell>
                          <TableCell>
                            {new Date(player.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </TableCell>
                          <TableCell>
                            {player.isAdmin ? (
                              <Badge>Admin</Badge>
                            ) : (
                              <Badge variant="secondary">Player</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
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
