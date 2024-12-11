import request from 'supertest';
import app from '../index'; 
import { redis } from '../Memory/Redis';

afterAll(async () => {
  await redis.quit();
});

describe('Chess Game REST APIs', () => {
  let gameId: string;

  it('POST /game - should create a new game', async () => {
    const response = await request(app).post('/game');
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('gameId');
    gameId = response.body.gameId; 
  });

  it('GET /game/:id - should fetch the game state', async () => {
    const response = await request(app).get(`/game/${gameId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.game).toHaveProperty('boardLayout');
  });

  it('POST /game/:id/select - should not select an invalid piece', async () => {
    const response = await request(app)
      .post(`/game/${gameId}/select`)
      .send({ pieceId: 'W50p' }); // Invalid piece ID (no piece at this position)
  
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body.error).toBe('Invalid piece selection');
  });
  
  it('POST /game/:id/move - should not make an invalid move', async () => {
    const response = await request(app)
      .post(`/game/${gameId}/move`)
      .send({ toPosition: { x: 5, y: 5 } }); // Invalid move for a white pawn
  
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body.error).toBe('Invalid move');
  });  
});
