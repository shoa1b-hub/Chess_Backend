import { Coordinates, ChessState } from '../Chess_Game/ChessGame';

export const isValidMove = (
    from: Coordinates,
    to: Coordinates,
    gameState: ChessState
  ): boolean => {
    const piece = gameState.boardLayout[from.row][from.col];
    if (!piece) return false;
  
    const [color, , , type] = piece.split('');
  
    const validMoves = gameState.validMoves[piece] || [];
    return validMoves.some((move) => move.col === to.col && move.row === to.row);
  };