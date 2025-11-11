"use client";

import { useEffect, useState } from "react";
import { CreateMatchDialog } from "@/components/matches/CreateMatchDialog";
import { MatchCard } from "@/components/matches/MatchCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

type Game = {
  id: string;
  gameNumber: number;
  player1Score: number;
  player2Score: number;
  winnerId: string;
};

type Match = {
  id: string;
  player1Id: string;
  player2Id: string;
  winnerId: string | null;
  playMode: "best_of_3" | "best_of_5" | "single";
  status: "pending" | "confirmed" | "rejected";
  matchScore: string | null;
  playedAt: string;
  createdAt: string;
  createdBy: string;
  confirmedBy: string | null;
  games: Game[];
};

type Player = {
  id: string;
  name: string;
  email: string;
};

export default function MatchesPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed">("all");
  const [confirmingMatch, setConfirmingMatch] = useState<string | null>(null);
  const [rejectingMatch, setRejectingMatch] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  const fetchMatches = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== "all") {
        params.append("status", filter);
      }

      const response = await fetch(`/api/matches?${params}`);
      if (!response.ok) throw new Error("Failed to fetch matches");

      const data = await response.json();
      setMatches(data.matches || []);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await fetch("/api/players");
      if (!response.ok) throw new Error("Failed to fetch players");

      const data = await response.json();
      setPlayers(data || []);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchMatches(), fetchPlayers()]);
      setLoading(false);
    };

    if (session) {
      loadData();
    }
  }, [session, filter]);

  const handleConfirm = async (matchId: string) => {
    setConfirmingMatch(matchId);
    try {
      const response = await fetch(`/api/matches/${matchId}/confirm`, {
        method: "PATCH",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to confirm match");
      }

      // Refresh matches
      await fetchMatches();
    } catch (error) {
      console.error("Error confirming match:", error);
      alert(error instanceof Error ? error.message : "Failed to confirm match");
    } finally {
      setConfirmingMatch(null);
    }
  };

  const handleReject = async (matchId: string) => {
    setRejectingMatch(matchId);
    try {
      const response = await fetch(`/api/matches/${matchId}/reject`, {
        method: "PATCH",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to reject match");
      }

      // Refresh matches
      await fetchMatches();
    } catch (error) {
      console.error("Error rejecting match:", error);
      alert(error instanceof Error ? error.message : "Failed to reject match");
    } finally {
      setRejectingMatch(null);
    }
  };

  if (isPending || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const pendingCount = matches.filter((m) => m.status === "pending").length;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Matches</h1>
          <p className="text-muted-foreground">
            Record and view all ping pong matches
          </p>
        </div>
        <CreateMatchDialog
          players={players}
          currentUserId={session.user.id}
          onMatchCreated={fetchMatches}
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          All Matches
        </Button>
        <Button
          variant={filter === "pending" ? "default" : "outline"}
          onClick={() => setFilter("pending")}
        >
          Pending
          {pendingCount > 0 && (
            <Badge className="ml-2" variant="secondary">
              {pendingCount}
            </Badge>
          )}
        </Button>
        <Button
          variant={filter === "confirmed" ? "default" : "outline"}
          onClick={() => setFilter("confirmed")}
        >
          Confirmed
        </Button>
      </div>

      {/* Matches List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading matches...</p>
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No matches found. Create your first match!
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              players={players}
              currentUserId={session.user.id}
              onConfirm={handleConfirm}
              onReject={handleReject}
            />
          ))}
        </div>
      )}
    </div>
  );
}
