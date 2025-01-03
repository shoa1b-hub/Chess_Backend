# Chess_Backend
Lets Create Backend for a chess board. First lets start with setup.
In this project, I developed a backend for a multiplayer chess game with features such as game state management, piece selection, and move validation. I used Redis for fast, in-memory storage and WebSocket for real-time updates. The backend supports creating games, selecting and moving pieces, and tracking game status. Comprehensive testing with Jest and Supertest ensures its reliability.

To use the project, I set up Redis locally, compiled TypeScript using npx tsc, and tested it with npm test. The server is run with npx ts-node src/index.ts. 

I tested the following APIs: creating a new game, fetching the game state, selecting a piece, and making a move. These APIs validate game creation, retrieve game details, allow piece selection for movement, and enable players to move pieces on the board. Additionally, I tested an edge case where an invalid move was attempted, ensuring that the system properly responds with an error message when the move is not allowed. This ensures robustness in handling invalid game actions.