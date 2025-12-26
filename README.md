
# QuizIt - Interactive Quiz Platform

> **Live Demo:** [https://quizit-25r8.onrender.com/]

QuizIt is a robust full-stack web application that allows users to test their knowledge across various categories. Users can register, take quizzes, view their scores, and compete on a global leaderboard. The application is built with a **Node.js/Express** backend and uses **MongoDB** for data persistence.

## Features

* **User Authentication:** Secure Signup and Login functionality using **JWT** (JSON Web Tokens) and **Bcrypt.js** for password hashing.
* **Dynamic Quizzes:** Users can select quizzes from different categories.
* **Scoring System:** Automated score calculation upon quiz completion.
* **Leaderboard:** Displays top performers and ranks.
* **RESTful API:** Structured backend routes for handling data requests.
* **Server-Side Rendering:** Uses **EJS** for dynamic view rendering.

## Tech Stack

* **Runtime:** [Node.js](https://nodejs.org/)
* **Framework:** [Express.js](https://expressjs.com/)
* **Database:** [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
* **Templating:** EJS
* **Authentication:** JSON Web Token (JWT) & Bcrypt.js
* **Tools:** Postman (for API testing), Dotenv

##  Project Structure

Based on your repository structure:

```bash
QUIZITFINAL/
├── backend_mongo/        # Main Backend Logic
│   ├── models/           # Database Schemas (User, Quiz, Score)
│   ├── routes/           # API Endpoints (Auth, Quiz, Leaderboard)
│   ├── views/            # EJS Templates for frontend
│   ├── public/           # Static files (CSS, Images, JS)
│   ├── utils/            # Helper functions
│   ├── server.js         # Entry point
│   └── .env              # Environment variables
└── package.json          # Dependencies

```

##  Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/quizit.git
cd quizit-backend-mongo

```


2. **Install Dependencies**
```bash
npm install

```


3. **Environment Configuration**
Create a `.env` file in the root directory and add the following variables:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

```


4. **Start the Server**
```bash
npm start

```


The server will run on `http://localhost:3000`.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

