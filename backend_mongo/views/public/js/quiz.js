class Question {
  constructor(text, options, correctAnswer) {
    this.text = text;
    this.options = options;
    this.correctAnswer = correctAnswer;
  }

  checkAnswer(userChoice) {
    return userChoice === this.correctAnswer;
  }
}

class Quiz {
  constructor(questions) {
    this.questions = questions; 
    this.score = 0;
    this.currentQuestionIndex = 0;
    this.category = "";
    this.userAnswers = [];
  }

  getCurrentQuestion() {
    return this.questions[this.currentQuestionIndex];
  }

  submitAnswer(userChoice) {
    const currentQ = this.getCurrentQuestion();
    this.userAnswers.push(userChoice);
    
    if (currentQ.checkAnswer(userChoice)) this.score++;
    this.currentQuestionIndex++;
  }

  isFinished() {
    return this.currentQuestionIndex === this.questions.length;
  }
}

// ========== API BASE (MOST IMPORTANT!) ==========
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://quizit-25r8.onrender.com";

// DOM Elements
const categoryTitleEl = document.getElementById('quiz-category-title');
const scoreDisplayEl = document.getElementById('quiz-score-display');
const questionTextEl = document.getElementById('quiz-question-text');
const optionsFormEl = document.getElementById('quiz-options-form');
const progressTextEl = document.getElementById('quiz-progress-text');
const timerEl = document.getElementById('quiz-timer');
const skipBtn = document.getElementById('skip-btn');
const submitBtn = document.getElementById('submit-btn');

const resultsContainer = document.getElementById('results-container');
const finalScoreEl = document.getElementById('final-score');
const totalQuestionsEl = document.getElementById('total-questions');

let myQuiz;
let timerInterval;

async function startQuiz() {
  try {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');

    if (!category) throw new Error("No category selected!");

    // Load questions from DATA folder
    const response = await fetch(`/data/${category.toLowerCase()}.json`);
    const questionData = await response.json();

    const questions = questionData.map(q => new Question(q.text, q.options, q.correctAnswer));

    myQuiz = new Quiz(questions);
    myQuiz.category = category;

    updateUIForNewQuestion();
    startTimer(60);

    submitBtn.addEventListener('click', handleSubmit);
    skipBtn.addEventListener('click', handleSkip);

  } catch (err) {
    console.error(err);
    questionTextEl.innerText = err.message;
  }
}

function updateUIForNewQuestion() {
  if (myQuiz.isFinished()) {
    showResults();
    return;
  }

  const q = myQuiz.getCurrentQuestion();

  categoryTitleEl.innerText = `${myQuiz.category} Quiz`;
  scoreDisplayEl.innerText = `Score : ${myQuiz.score}`;
  questionTextEl.innerText = q.text;
  progressTextEl.innerText = `Question ${myQuiz.currentQuestionIndex + 1} of ${myQuiz.questions.length}`;

  optionsFormEl.innerHTML = "";

  q.options.forEach((option, i) => {
    const label = document.createElement("label");
    label.className = "quiz-option-label";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "quiz-option";
    input.value = option;
    input.className = "quiz-radio";

    label.appendChild(input);
    label.append(`${String.fromCharCode(65 + i)}. ${option}`);

    optionsFormEl.appendChild(label);
  });

  submitBtn.innerText = "Submit";
  skipBtn.disabled = false;
}

function handleSubmit() {
  if (submitBtn.innerText === "Next") {
    updateUIForNewQuestion();
    return;
  }

  const selected = optionsFormEl.querySelector('input[name="quiz-option"]:checked');
  if (!selected) {
    alert("Please select an answer!");
    return;
  }

  const userChoice = selected.value;
  const currentQ = myQuiz.getCurrentQuestion();

  // Disable options
  optionsFormEl.querySelectorAll(".quiz-radio").forEach(r => r.disabled = true);

  // Mark answers
  const selectedLabel = selected.closest(".quiz-option-label");

  if (currentQ.checkAnswer(userChoice)) {
    selectedLabel.classList.add("correct");
  } else {
    selectedLabel.classList.add("wrong");
    [...optionsFormEl.children].forEach(label => {
      if (label.querySelector("input").value === currentQ.correctAnswer) {
        label.classList.add("correct");
      }
    });
  }

  myQuiz.submitAnswer(userChoice);
  submitBtn.innerText = "Next";
  skipBtn.disabled = true;
}

function handleSkip() {
  myQuiz.userAnswers.push(null);
  myQuiz.currentQuestionIndex++;
  updateUIForNewQuestion();
}

// ========== SEND QUIZ RESULT TO SERVER ==========
async function submitResult(score, total) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  await fetch(`${API_BASE}/api/quiz/attempt`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({
      userId: user.id,
      username: user.username,
      score,
      total,
      category: myQuiz.category,
      answers: myQuiz.userAnswers,
      attemptedAt: new Date()
    })
  });
}

async function showResults() {
  clearInterval(timerInterval);

  try {
    await submitResult(myQuiz.score, myQuiz.questions.length);
  } catch (err) {
    console.error("submitResult failed", err);
  }

  const reportData = {
    category: myQuiz.category,
    score: myQuiz.score,
    total: myQuiz.questions.length,
    questions: myQuiz.questions.map(q => q.text),
    correctAnswers: myQuiz.questions.map(q => q.correctAnswer),
    userAnswers: myQuiz.userAnswers,
    date: new Date().toISOString()
  };

  sessionStorage.setItem("quizReportData", JSON.stringify(reportData));
  window.location.href = "/report";
}

function startTimer(duration) {
  let timeLeft = duration;

  timerInterval = setInterval(() => {
    let min = Math.floor(timeLeft / 60);
    let sec = timeLeft % 60;
    sec = sec < 10 ? "0" + sec : sec;

    timerEl.innerText = `Time: ${min}:${sec}`;
    timeLeft--;

    if (timeLeft < 0) {
      clearInterval(timerInterval);
      timerEl.innerText = "Time's up!";
      showResults();
    }
  }, 1000);
}

document.addEventListener("DOMContentLoaded", startQuiz);
