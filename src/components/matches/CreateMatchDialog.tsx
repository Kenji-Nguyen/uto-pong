"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

type Player = {
  id: string;
  name: string;
};

type GameScore = {
  player1Score: number;
  player2Score: number;
};

type CreateMatchDialogProps = {
  players: Player[];
  currentUserId: string;
  onMatchCreated?: () => void;
};

export function CreateMatchDialog({
  players,
  currentUserId,
  onMatchCreated,
}: CreateMatchDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [player1Id, setPlayer1Id] = useState("");
  const [player2Id, setPlayer2Id] = useState("");
  const [playMode, setPlayMode] = useState<"best_of_3" | "best_of_5" | "single">("best_of_3");
  const [gameScores, setGameScores] = useState<GameScore[]>([
    { player1Score: 11, player2Score: 0 },
  ]);

  const maxGames = playMode === "best_of_5" ? 5 : playMode === "best_of_3" ? 3 : 1;

  const handleAddGame = () => {
    if (gameScores.length < maxGames) {
      setGameScores([...gameScores, { player1Score: 11, player2Score: 0 }]);
    }
  };

  const handleRemoveGame = (index: number) => {
    if (gameScores.length > 1) {
      setGameScores(gameScores.filter((_, i) => i !== index));
    }
  };

  const handleScoreChange = (
    index: number,
    player: "player1Score" | "player2Score",
    value: string
  ) => {
    const score = parseInt(value) || 0;
    const newScores = [...gameScores];
    newScores[index][player] = score;
    setGameScores(newScores);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          player1Id,
          player2Id,
          playMode,
          gameScores,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create match");
      }

      // Reset form
      setPlayer1Id("");
      setPlayer2Id("");
      setPlayMode("best_of_3");
      setGameScores([{ player1Score: 11, player2Score: 0 }]);
      setOpen(false);

      // Callback
      onMatchCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create match");
    } finally {
      setLoading(false);
    }
  };

  const player1Name = players.find((p) => p.id === player1Id)?.name || "Player 1";
  const player2Name = players.find((p) => p.id === player2Id)?.name || "Player 2";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Record Match
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Record a Match</DialogTitle>
            <DialogDescription>
              Enter the match details. Your opponent will need to confirm the match.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Player Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="player1">Player 1</Label>
                <Select value={player1Id} onValueChange={setPlayer1Id} required>
                  <SelectTrigger id="player1">
                    <SelectValue placeholder="Select player" />
                  </SelectTrigger>
                  <SelectContent>
                    {players.map((player) => (
                      <SelectItem key={player.id} value={player.id}>
                        {player.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="player2">Player 2</Label>
                <Select value={player2Id} onValueChange={setPlayer2Id} required>
                  <SelectTrigger id="player2">
                    <SelectValue placeholder="Select player" />
                  </SelectTrigger>
                  <SelectContent>
                    {players.map((player) => (
                      <SelectItem key={player.id} value={player.id}>
                        {player.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Play Mode */}
            <div className="space-y-2">
              <Label htmlFor="playMode">Play Mode</Label>
              <Select
                value={playMode}
                onValueChange={(value) => {
                  setPlayMode(value as typeof playMode);
                  // Reset game scores when play mode changes
                  setGameScores([{ player1Score: 11, player2Score: 0 }]);
                }}
              >
                <SelectTrigger id="playMode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="best_of_3">Best of 3</SelectItem>
                  <SelectItem value="best_of_5">Best of 5</SelectItem>
                  <SelectItem value="single">Single Game</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Game Scores */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Game Scores</Label>
                {playMode !== "single" && gameScores.length < maxGames && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddGame}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Game
                  </Button>
                )}
              </div>

              {gameScores.map((score, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 border rounded-md"
                >
                  <span className="text-sm font-medium w-16">
                    Game {index + 1}
                  </span>

                  <div className="flex items-center gap-2 flex-1">
                    <div className="flex-1">
                      <Label htmlFor={`p1-game-${index}`} className="text-xs">
                        {player1Name}
                      </Label>
                      <Input
                        id={`p1-game-${index}`}
                        type="number"
                        min="0"
                        value={score.player1Score}
                        onChange={(e) =>
                          handleScoreChange(index, "player1Score", e.target.value)
                        }
                        required
                      />
                    </div>

                    <span className="text-lg font-bold pt-5">-</span>

                    <div className="flex-1">
                      <Label htmlFor={`p2-game-${index}`} className="text-xs">
                        {player2Name}
                      </Label>
                      <Input
                        id={`p2-game-${index}`}
                        type="number"
                        min="0"
                        value={score.player2Score}
                        onChange={(e) =>
                          handleScoreChange(index, "player2Score", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  {gameScores.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveGame(index)}
                      className="mt-5"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {error && (
              <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !player1Id || !player2Id}>
              {loading ? "Creating..." : "Create Match"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
