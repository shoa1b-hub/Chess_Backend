export type Color = 'white' | 'black';

export interface Coordinates {
  row: number;
  col: number;
}

export interface ChessState {
  boardLayout: string[][]; 
  currentPlayer: Color; 
  checkStatus: boolean;  
  gameFinished: boolean; 
  validMoves: Record<string, Coordinates[]>; 
  chosenPiece?: string;
  capturedPieces: string[];
}

export class ChessGame {
  private gameStatus: ChessState;

  constructor() {
    this.gameStatus = this.setupGame();
  }

  private setupGame(): ChessState {
    const board: string[][] = Array(8)
      .fill(null)
      .map(() => Array(8).fill(''));
    board[0] = ['B00r', 'B01n', 'B02b', 'B03q', 'B04k', 'B05b', 'B06n', 'B07r'];
    board[1] = Array(8).fill(null).map((_, i) => `B1${i}p`);
    board[7] = ['W70r', 'W71n', 'W72b', 'W73q', 'W74k', 'W75b', 'W76n', 'W77r'];
    board[6] = Array(8).fill(null).map((_, i) => `W6${i}p`);

    return {
      boardLayout: board,
      currentPlayer: 'white',
      checkStatus: false,
      gameFinished: false,
      validMoves: {},
      capturedPieces: []
    };
  }

  public getGameState(): ChessState {
    return this.gameStatus;
  }

  public updateGameState(newState: Partial<ChessState>): void {
    this.gameStatus = { ...this.gameStatus, ...newState };
  }

  public refreshValidMoves(): void {
    this.gameStatus.validMoves = this.computeValidMoves(this.gameStatus.boardLayout, this.gameStatus.currentPlayer);
  }

  private computeValidMoves(board: string[][], player: Color): Record<string, Coordinates[]> {
    const moves: Record<string, Coordinates[]> = {};

    board.forEach((row, rowIdx) => {
      row.forEach((piece, colIdx) => {
        if (piece && ((player === 'white' && piece.startsWith('W')) || (player === 'black' && piece.startsWith('B')))) {
          const possibleMoves = this.getPieceMoves({ row: rowIdx, col: colIdx }, piece, board);
          if (possibleMoves.length > 0) {
            moves[piece] = possibleMoves;
          }
        }
      });
    });

    return moves;
  }

  private getPieceMoves(from: Coordinates, piece: string, board: string[][]): Coordinates[] {
    const [color, , , type] = piece.split('');
    const moves: Coordinates[] = [];

    if (type === 'p') {
      const direction = color === 'W' ? -1 : 1;
      const nextRow = from.row + direction;
      if (board[nextRow] && board[nextRow][from.col] === '') {
        moves.push({ col: from.col, row: nextRow });
      }
      if (board[nextRow]) {
        if (board[nextRow][from.col - 1]?.startsWith(color === 'W' ? 'B' : 'W')) {
          moves.push({ col: from.col - 1, row: nextRow });
        }
        if (board[nextRow][from.col + 1]?.startsWith(color === 'W' ? 'B' : 'W')) {
          moves.push({ col: from.col + 1, row: nextRow });
        }
      }
    }
    return moves;
  }
}
