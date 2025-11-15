 

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
    
    if (currentQ.checkAnswer(userChoice)) {
      this.score++;
    }
    this.currentQuestionIndex++; 
  }


  isFinished() {
    return this.currentQuestionIndex === this.questions.length;
  }
}



let myQuiz; 
let timerInterval; 


const categoryTitleEl = document.getElementById('quiz-category-title');
const scoreDisplayEl = document.getElementById('quiz-score-display');
const questionTextEl = document.getElementById('quiz-question-text');
const optionsFormEl = document.getElementById('quiz-options-form');
const progressTextEl = document.getElementById('quiz-progress-text');
const timerEl = document.getElementById('quiz-timer');
const skipBtn = document.getElementById('skip-btn');
const submitBtn = document.getElementById('submit-btn');


const quizMainContent = document.getElementById('quiz-main-content');
const quizQuestionContainer = document.getElementById('quiz-question-container');
const quizBottomBar = document.getElementById('quiz-bottom-bar');
const quizActionButtons = document.getElementById('quiz-action-buttons');
const resultsContainer = document.getElementById('results-container');
const finalScoreEl = document.getElementById('final-score');
const totalQuestionsEl = document.getElementById('total-questions');


async function startQuiz() {
  try {
    
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category'); 

    if (!category) {
      throw new Error('No category selected! Please go back and pick one.');
    }

   //  


    const response = await fetch(`${category.toLowerCase()}.json`); 
    if (!response.ok) {
      throw new Error(`Could not find quiz data for ${category}.`);
    }
    const questionData = await response.json();


    const questions = questionData.map(q => {
      return new Question(q.text, q.options, q.correctAnswer);
    });

    
    myQuiz = new Quiz(questions);
    myQuiz.category = category; 

    updateUIForNewQuestion();
    startTimer(60); 


    submitBtn.addEventListener('click', handleSubmit);
    skipBtn.addEventListener('click', handleSkip);

  } catch (error) {
    questionTextEl.innerText = error.message;
    console.error(error);
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
  

  optionsFormEl.innerHTML = '';

 
  q.options.forEach((option, index) => {
    const label = document.createElement('label');
    label.className = 'quiz-option-label';
    
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'quiz-option';
    input.value = option;
    input.className = 'quiz-radio';
    
    const prefix = document.createTextNode(`${String.fromCharCode(65 + index)}. `);
    
    label.appendChild(input);
    label.appendChild(prefix);
    label.appendChild(document.createTextNode(option));
    
    optionsFormEl.appendChild(label);
  });
  

  submitBtn.innerText = 'Submit';
  submitBtn.disabled = false;
  skipBtn.disabled = false;
}

function handleSubmit() {

  if (submitBtn.innerText === "Next") {
    updateUIForNewQuestion();
    return;
  }
  

  const selectedOption = optionsFormEl.querySelector('input[name="quiz-option"]:checked');
 
  if (!selectedOption) {
    alert('Please select an answer!');
    return;
  }
  

  const userChoice = selectedOption.value;
  const currentQ = myQuiz.getCurrentQuestion();

  optionsFormEl.querySelectorAll('.quiz-radio').forEach(radio => {
    radio.disabled = true;
  });


  const selectedLabel = selectedOption.closest('.quiz-option-label');
  

  if (currentQ.checkAnswer(userChoice)) {
    selectedLabel.classList.add('correct');
  } else {
    selectedLabel.classList.add('wrong');
 
    Array.from(optionsFormEl.children).forEach(label => {
      const input = label.querySelector('input');
      if (input.value === currentQ.correctAnswer) {
        label.classList.add('correct');
      }
    });
  }


  myQuiz.submitAnswer(userChoice);


  submitBtn.innerText = 'Next';
  skipBtn.disabled = true;
}


function handleSkip() {
  myQuiz.userAnswers.push(null); 
  myQuiz.currentQuestionIndex++;
  updateUIForNewQuestion();
}


async function showResults() {

  clearInterval(timerInterval);

  try{ await submitResult(myQuiz.score, myQuiz.questions.length, myQuiz.userAnswers); }catch(e){ console.error('submitResult failed', e); }

  const reportData = {
    category: myQuiz.category,
    score: myQuiz.score,
    total: myQuiz.questions.length,
  
    questions: myQuiz.questions.map(q => q.text),
    correctAnswers: myQuiz.questions.map(q => q.correctAnswer),
    userAnswers: myQuiz.userAnswers,
    date: new Date().toISOString() 
  };

 
  sessionStorage.setItem('quizReportData', JSON.stringify(reportData));
 
  window.location.href = 'report.html';
}

/**
 * Starts a countdown timer
 * @param {number} durat99ion - The quiz duration in seconds
 */
function startTimer(duration) {
  let timeLeft = duration;
  
  timerInterval = setInterval(() => {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

 
    seconds = seconds < 10 ? '0' + seconds : seconds;
    
    timerEl.innerText = `Time: ${minutes}:${seconds}`;
    
    timeLeft--;
    

    if (timeLeft < 0) {
      clearInterval(timerInterval);
      timerEl.innerText = "Time's up!";
      showResults(); 
    }
  }, 1000); 
}



document.addEventListener('DOMContentLoaded', startQuiz);
async function submitResult(score, total) {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    await fetch('http://localhost:5000/api/quiz/attempt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            userId: user.id,
            username: user.username,
            score,
            total,
            category: myQuiz.category,   // ⭐ ADD THIS
            answers: myQuiz.userAnswers,  // optional, but better
            attemptedAt: new Date()       // ⭐ ensures timestamp stored
        })
    });
}
