MongoDB backend added (backend_mongo)

What I added:
- Express server (server.js) using mongoose
- Routes:
  - POST /api/auth/signup  { username, password, displayName }
  - POST /api/auth/signin  { username, password }
  - POST /api/quiz/attempt { userId, username, quizId, score, total, answers }  (Create)
  - GET  /api/quiz/attempts/:userId  (Read user's attempts)
  - PUT  /api/quiz/attempt/:id  (Update attempt)
  - DELETE /api/quiz/attempt/:id (Delete attempt)
  - POST /api/feedback  { userId, username, message, rating }  (Create)
  - GET  /api/feedback  (Read all feedbacks)
  - PUT  /api/feedback/:id
  - DELETE /api/feedback/:id
  - GET  /api/leaderboard/top?limit=10  (Top scoreboard)

How to run:
1) Go to backend_mongo folder
2) Create .env with:
   MONGO_URI=<your mongodb atlas connection string>
   JWT_SECRET=<your_jwt_secret>
3) npm init -y
4) npm install express mongoose bcryptjs jsonwebtoken cors dotenv
5) node server.js

Frontend integration:
- Use fetch/XHR from your existing frontend to call the endpoints above.
- For signup/signin, save token in localStorage and pass Authorization: "Bearer <token>" header for protected routes.
