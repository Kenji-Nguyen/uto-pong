"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Check, X } from "lucide-react";

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
};

type MatchCardProps = {
  match: Match;
  players: Player[];
  currentUserId: string;
  onConfirm?: (matchId: string) => void;
  onReject?: (matchId: string) => void;
};

export function MatchCard({
  match,
  players,
  currentUserId,
  onConfirm,
  onReject,
}: MatchCardProps) {
  const player1 = players.find((p) => p.id === match.player1Id);
  const player2 = players.find((p) => p.id === match.player2Id);
  const winner = match.winnerId
    ? players.find((p) => p.id === match.winnerId)
    : null;

  const isCreator = match.createdBy === currentUserId;
  const canConfirm =
    !isCreator &&
    match.status === "pending" &&
    (match.player1Id === currentUserId || match.player2Id === currentUserId);

  const getStatusBadge = () => {
    switch (match.status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "confirmed":
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
    }
  };

  const getPlayModeLabel = () => {
    switch (match.playMode) {
      case "best_of_3":
        return "Best of 3";
      case "best_of_5":
        return "Best of 5";
      case "single":
        return "Single Game";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">
                {player1?.name || "Unknown"} vs {player2?.name || "Unknown"}
              </h3>
              {getStatusBadge()}
            </div>
            <p className="text-sm text-muted-foreground">
              {format(new Date(match.playedAt), "PPP")} • {getPlayModeLabel()}
            </p>
          </div>
          {winner && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Winner</p>
              <p className="font-semibold">{winner.name}</p>
              {match.matchScore && (
                <p className="text-sm text-muted-foreground">
                  {match.matchScore}
                </p>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Game Scores */}
        <div className="space-y-2 mb-4">
          {match.games.map((game) => {
            const gameWinner = players.find((p) => p.id === game.winnerId);
            return (
              <div
                key={game.id}
                className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded"
              >
                <span className="font-medium">Game {game.gameNumber}</span>
                <div className="flex items-center gap-4">
                  <span
                    className={
                      game.winnerId === match.player1Id ? "font-bold" : ""
                    }
                  >
                    {player1?.name}: {game.player1Score}
                  </span>
                  <span>-</span>
                  <span
                    className={
                      game.winnerId === match.player2Id ? "font-bold" : ""
                    }
                  >
                    {player2?.name}: {game.player2Score}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons for Pending Matches */}
        {canConfirm && (
          <div className="flex gap-2">
            <Button
              onClick={() => onConfirm?.(match.id)}
              className="flex-1"
              size="sm"
            >
              <Check className="h-4 w-4 mr-1" />
              Confirm
            </Button>
            <Button
              onClick={() => onReject?.(match.id)}
              variant="destructive"
              className="flex-1"
              size="sm"
            >
              <X className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </div>
        )}

        {/* Status Message */}
        {match.status === "pending" && isCreator && (
          <p className="text-sm text-muted-foreground text-center">
            Waiting for opponent confirmation
          </p>
        )}
      </CardContent>
    </Card>
  );
}
