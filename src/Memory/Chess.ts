import { ChessGame, Coordinates } from '../Chess_Game/ChessGame';
import { redis } from './Redis';

export class ChessService {
  private static GAME_KEY_PREFIX = 'game:';

  public async createGame(): Promise<string> {
    const gameId = Math.random().toString(36).substr(2, 9);
    const game = new ChessGame();
    await redis.set(`${ChessService.GAME_KEY_PREFIX}${gameId}`, JSON.stringify(game.getGameState()));
    return gameId;
  }

  public async getGame(gameId: string): Promise<ChessGame | null> {
    const gameStateJson = await redis.get(`${ChessService.GAME_KEY_PREFIX}${gameId}`);
    if (!gameStateJson) return null;
  
    const gameState = JSON.parse(gameStateJson);
    const game = new ChessGame();
    game.updateGameState(gameState);
    return game;
  }

  public async selectPiece(gameId: string, pieceId: string): Promise<boolean> {
    const gameStateJson = await redis.get(`${ChessService.GAME_KEY_PREFIX}${gameId}`);
    if (!gameStateJson) return false;

    const gameState = JSON.parse(gameStateJson);

    const isValidPiece =
      gameState.boardLayout.some((row: string[]) => row.includes(pieceId)) &&
      gameState.currentPlayer === (pieceId.startsWith('W') ? 'white' : 'black');

    if (!isValidPiece) return false;

    gameState.chosenPiece = pieceId;
    await redis.set(`${ChessService.GAME_KEY_PREFIX}${gameId}`, JSON.stringify(gameState));
    return true;
  }

  public async makeMove(gameId: string, toPosition: Coordinates): Promise<boolean> {
    const gameStateJson = await redis.get(`${ChessService.GAME_KEY_PREFIX}${gameId}`);
    if (!gameStateJson) return false;

    const gameState = JSON.parse(gameStateJson);
    const pieceId = gameState.chosenPiece;
    if (!pieceId) return false;

    const validMoves = gameState.validMoves[pieceId] || [];
    if (!validMoves.some((pos: Coordinates) => pos.col === toPosition.col && pos.row === toPosition.row)) {
      return false;
    }

    const fromPosition = this.getPiecePosition(gameState.boardLayout, pieceId);
    if (!fromPosition) return false;

    const targetPiece = gameState.boardLayout[toPosition.row][toPosition.col];
    if (targetPiece) {
      gameState.capturedPieces.push(targetPiece);
    }

    gameState.boardLayout[toPosition.row][toPosition.col] = pieceId;
    gameState.boardLayout[fromPosition.row][fromPosition.col] = '';
    gameState.chosenPiece = undefined;
    gameState.currentPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white';

    const game = new ChessGame();
    game.updateGameState(gameState);
    game.refreshValidMoves();
    gameState.validMoves = game.getGameState().validMoves;

    await redis.set(`${ChessService.GAME_KEY_PREFIX}${gameId}`, JSON.stringify(gameState));
    return true;
  }

  private getPiecePosition(board: string[][], pieceId: string): Coordinates | null {
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === pieceId) {
          return { col, row };
        }
      }
    }
    return null;
  }
}
