"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Player = "you" | "computer";
type Tile = { id: string; a: number; b: number };
type PlacedTile = Tile & { left: number; right: number };
type GameState = {
  you: Tile[];
  computer: Tile[];
  stock: Tile[];
  board: PlacedTile[];
  turn: Player;
  winner: Player | "draw" | null;
  message: string;
};
type Side = "left" | "right";

const pipRank = (tile: Tile) =>
  tile.a === tile.b ? 100 + tile.a : tile.a + tile.b;

const createGame = (): GameState => {
  const tiles: Tile[] = [];
  for (let a = 0; a <= 6; a += 1) {
    for (let b = a; b <= 6; b += 1) {
      tiles.push({ id: `${a}-${b}`, a, b });
    }
  }

  for (let index = tiles.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [tiles[index], tiles[swapIndex]] = [tiles[swapIndex], tiles[index]];
  }

  const you = tiles.slice(0, 7);
  const computer = tiles.slice(7, 14);
  const stock = tiles.slice(14);
  const topTile = [...you, ...computer].reduce((top, tile) =>
    pipRank(tile) > pipRank(top) ? tile : top,
  );
  const turn = you.some(tile => tile.id === topTile.id) ? "you" : "computer";

  return {
    you,
    computer,
    stock,
    board: [],
    turn,
    winner: null,
    message:
      turn === "you"
        ? "You have the strongest opening tile. Play it to start."
        : "The computer has the strongest opening tile and will start.",
  };
};

const openingTileId = (game: GameState) =>
  [...game.you, ...game.computer].reduce((top, tile) =>
    pipRank(tile) > pipRank(top) ? tile : top,
  ).id;

const playableSides = (tile: Tile, board: PlacedTile[]): Side[] => {
  if (board.length === 0) {
    return [];
  }
  const leftEnd = board[0].left;
  const rightEnd = board[board.length - 1].right;
  const sides: Side[] = [];
  if (tile.a === leftEnd || tile.b === leftEnd) sides.push("left");
  if (tile.a === rightEnd || tile.b === rightEnd) sides.push("right");
  return sides;
};

const canPlay = (game: GameState, tile: Tile) =>
  game.board.length === 0
    ? tile.id === openingTileId(game)
    : playableSides(tile, game.board).length > 0;

const scoreHand = (hand: Tile[]) =>
  hand.reduce((total, tile) => total + tile.a + tile.b, 0);

const finishBlockedGame = (game: GameState): GameState => {
  const youScore = scoreHand(game.you);
  const computerScore = scoreHand(game.computer);
  const winner =
    youScore === computerScore
      ? "draw"
      : youScore < computerScore
        ? "you"
        : "computer";
  return {
    ...game,
    winner,
    message:
      winner === "draw"
        ? `The game is blocked in a draw. Both players have ${youScore} pips.`
        : `The game is blocked. ${
            winner === "you" ? "You win" : "The computer wins"
          } with fewer pips (${Math.min(youScore, computerScore)} to ${Math.max(
            youScore,
            computerScore,
          )}).`,
  };
};

const passTurn = (game: GameState, player: Player): GameState => {
  const nextPlayer = player === "you" ? "computer" : "you";
  const nextHand = game[nextPlayer];
  if (
    game.stock.length === 0 &&
    !nextHand.some(tile => canPlay(game, tile))
  ) {
    return finishBlockedGame(game);
  }
  return {
    ...game,
    turn: nextPlayer,
    message: `${player === "you" ? "You" : "The computer"} passed. ${
      nextPlayer === "you" ? "Your turn." : "The computer is thinking..."
    }`,
  };
};

const playTile = (
  game: GameState,
  player: Player,
  tileId: string,
  side?: Side,
): GameState => {
  if (game.turn !== player || game.winner) return game;
  const hand = game[player];
  const tile = hand.find(candidate => candidate.id === tileId);
  if (!tile || !canPlay(game, tile)) return game;

  let board = game.board;
  if (board.length === 0) {
    board = [{ ...tile, left: tile.a, right: tile.b }];
  } else {
    if (!side || !playableSides(tile, board).includes(side)) return game;
    if (side === "left") {
      const openEnd = board[0].left;
      const placed =
        tile.a === openEnd
          ? { ...tile, left: tile.b, right: tile.a }
          : { ...tile, left: tile.a, right: tile.b };
      board = [placed, ...board];
    } else {
      const openEnd = board[board.length - 1].right;
      const placed =
        tile.a === openEnd
          ? { ...tile, left: tile.a, right: tile.b }
          : { ...tile, left: tile.b, right: tile.a };
      board = [...board, placed];
    }
  }

  const nextHand = hand.filter(candidate => candidate.id !== tileId);
  const updated = { ...game, [player]: nextHand, board };
  if (nextHand.length === 0) {
    return {
      ...updated,
      winner: player,
      message: player === "you" ? "You played your last tile. You win!" : "The computer played its last tile. You win next time!",
    };
  }

  const nextPlayer = player === "you" ? "computer" : "you";
  return {
    ...updated,
    turn: nextPlayer,
    message:
      nextPlayer === "you" ? "Your turn. Choose a matching tile." : "The computer is thinking...",
  };
};

const drawForComputer = (game: GameState): GameState => {
  let next = game;
  while (
    next.stock.length > 0 &&
    !next.computer.some(tile => canPlay(next, tile))
  ) {
    const [tile, ...stock] = next.stock;
    next = { ...next, computer: [...next.computer, tile], stock };
  }
  return next;
};

const playComputerTurn = (game: GameState): GameState => {
  if (game.turn !== "computer" || game.winner) return game;

  const drawn = drawForComputer(game);
  const tile = drawn.computer
    .filter(candidate => canPlay(drawn, candidate))
    .sort((a, b) => pipRank(b) - pipRank(a))[0];

  if (!tile) return passTurn(drawn, "computer");
  if (drawn.board.length === 0) return playTile(drawn, "computer", tile.id);

  const sides = playableSides(tile, drawn.board);
  return playTile(
    drawn,
    "computer",
    tile.id,
    sides.includes("right") ? "right" : "left",
  );
};

const Pip = ({ value }: { value: number }) => (
  <span aria-hidden="true" className="grid grid-cols-3 grid-rows-3 gap-0.5 p-1">
    {Array.from({ length: 9 }, (_, index) => {
      const dots: Record<number, number[]> = {
        0: [],
        1: [4],
        2: [0, 8],
        3: [0, 4, 8],
        4: [0, 2, 6, 8],
        5: [0, 2, 4, 6, 8],
        6: [0, 2, 3, 5, 6, 8],
      };
      return (
        <span
          key={index}
          className={`h-1.5 w-1.5 rounded-full ${
            dots[value].includes(index) ? "bg-slate-900" : "bg-transparent"
          }`}
        />
      );
    })}
  </span>
);

const TileFace = ({
  tile,
  horizontal = false,
}: {
  tile: Pick<Tile, "a" | "b"> & Partial<Pick<PlacedTile, "left" | "right">>;
  horizontal?: boolean;
}) => {
  const firstValue = tile.left ?? tile.a;
  const secondValue = tile.right ?? tile.b;

  return (
    <span
      className={`inline-flex items-center rounded-lg border border-slate-300 bg-amber-50 p-1 shadow ${
        horizontal && firstValue !== secondValue ? "flex-row" : "flex-col"
      }`}
    >
      <Pip value={firstValue} />
      <span
        className={`bg-slate-300 ${
          horizontal && firstValue !== secondValue ? "h-10 w-px" : "h-px w-10"
        }`}
      />
      <Pip value={secondValue} />
    </span>
  );
};

export default function DominoesPage() {
  const [game, setGame] = useState(createGame);
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);

  useEffect(() => {
    if (game.turn !== "computer" || game.winner) return;
    const timer = window.setTimeout(() => {
      setGame(current => playComputerTurn(current));
    }, 750);
    return () => window.clearTimeout(timer);
  }, [game.turn, game.winner]);

  const selectedTile = useMemo(
    () => game.you.find(tile => tile.id === selectedTileId),
    [game.you, selectedTileId],
  );
  const selectedSides = selectedTile
    ? playableSides(selectedTile, game.board)
    : [];
  const canDraw =
    game.turn === "you" &&
    !game.winner &&
    !game.you.some(tile => canPlay(game, tile));
  const finished = game.winner !== null;

  const handlePlay = (side?: Side) => {
    if (!selectedTileId) return;
    setGame(current => playTile(current, "you", selectedTileId, side));
    setSelectedTileId(null);
  };

  const handleDraw = () => {
    setSelectedTileId(null);
    setGame(current => {
      if (
        current.turn !== "you" ||
        current.winner ||
        current.you.some(tile => canPlay(current, tile)) ||
        current.stock.length === 0
      ) {
        return current;
      }
      const [tile, ...stock] = current.stock;
      return {
        ...current,
        you: [...current.you, tile],
        stock,
        message: "You drew a tile. Play it if it matches, or draw again.",
      };
    });
  };

  const handlePass = () => {
    setGame(current => {
      if (
        current.turn !== "you" ||
        current.winner ||
        current.stock.length > 0 ||
        current.you.some(tile => canPlay(current, tile))
      ) {
        return current;
      }
      return passTurn(current, "you");
    });
  };

  const startNewGame = () => {
    setSelectedTileId(null);
    setGame(createGame());
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-emerald-950 to-slate-950 px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-screen-2xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/#games"
            className="text-sm font-medium text-emerald-200 transition-colors hover:text-white"
          >
            ← Back to Games
          </Link>
          <button
            type="button"
            onClick={startNewGame}
            className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold transition-colors hover:bg-white/10"
          >
            New game
          </button>
        </header>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl sm:p-8">
          <div className="mb-8 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
              Classic draw dominoes
            </p>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              Dominoes
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Match a tile to either open end. If you cannot play, draw until
              you find a match. Empty your hand first to win.
            </p>
          </div>

          <div
            role="status"
            aria-live="polite"
            className={`mb-6 rounded-2xl border px-4 py-3 text-center text-sm font-medium sm:text-base ${
              finished
                ? "border-amber-300/40 bg-amber-300/10 text-amber-100"
                : "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
            }`}
          >
            {game.message}
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
              <p className="text-sm text-slate-300">Computer</p>
              <p className="mt-1 text-2xl font-bold">{game.computer.length}</p>
              <p className="text-xs text-slate-400">tiles</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
              <p className="text-sm text-slate-300">Boneyard</p>
              <p className="mt-1 text-2xl font-bold">{game.stock.length}</p>
              <p className="text-xs text-slate-400">tiles left</p>
            </div>
          </div>

          <div className="mb-6 flex min-h-52 w-full items-center justify-center overflow-x-auto rounded-2xl border border-emerald-100/10 bg-emerald-900/50 px-4 py-8">
            {game.board.length === 0 ? (
              <p className="text-sm text-emerald-100/70">
                The table is clear. The strongest tile opens the game.
              </p>
            ) : (
              <div className="flex min-w-max items-center gap-1">
                <span className="mr-3 text-sm font-bold text-amber-200">
                  {game.board[0].left}
                </span>
                {game.board.map((tile, index) => (
                  <TileFace key={`${tile.id}-${index}`} tile={tile} horizontal />
                ))}
                <span className="ml-3 text-sm font-bold text-amber-200">
                  {game.board[game.board.length - 1].right}
                </span>
              </div>
            )}
          </div>

          <div className="mb-7 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleDraw}
              disabled={!canDraw || game.stock.length === 0}
              className="rounded-full bg-emerald-300 px-5 py-2.5 text-sm font-bold text-emerald-950 transition-colors hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Draw tile ({game.stock.length})
            </button>
            <button
              type="button"
              onClick={handlePass}
              disabled={!canDraw || game.stock.length !== 0}
              className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Pass turn
            </button>
          </div>

          <div className="border-t border-white/10 pt-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl font-bold">Your hand</h2>
              <span className="text-sm text-slate-300">
                {game.you.length} {game.you.length === 1 ? "tile" : "tiles"}
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {game.you.map(tile => {
                const playable = canPlay(game, tile);
                const selected = selectedTileId === tile.id;
                return (
                  <button
                    key={tile.id}
                    type="button"
                    onClick={() => setSelectedTileId(selected ? null : tile.id)}
                    disabled={game.turn !== "you" || finished || !playable}
                    aria-label={`Select domino ${tile.a} and ${tile.b}${
                      playable ? ", playable" : ", cannot play"
                    }`}
                    aria-pressed={selected}
                    className={`rounded-xl p-1 transition-transform ${
                      selected
                        ? "-translate-y-2 ring-2 ring-emerald-300"
                        : "hover:-translate-y-1"
                    } disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0`}
                  >
                    <TileFace tile={tile} />
                  </button>
                );
              })}
            </div>

            {selectedTile && game.turn === "you" && !finished && (
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                {game.board.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => handlePlay()}
                    className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-slate-900 hover:bg-emerald-100"
                  >
                    Play opening tile
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handlePlay("left")}
                      disabled={!selectedSides.includes("left")}
                      className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-slate-900 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Play to left ({game.board[0].left})
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePlay("right")}
                      disabled={!selectedSides.includes("right")}
                      className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-slate-900 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Play to right (
                      {game.board[game.board.length - 1].right})
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </section>
        <p className="mt-5 text-center text-xs leading-5 text-slate-400">
          Double-six set · Seven tiles each · Highest double opens the game.
          When the boneyard is empty, a player who cannot move must pass.
        </p>
      </div>
    </main>
  );
}
