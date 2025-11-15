document.addEventListener('DOMContentLoaded', () => {

    const reportDataString = sessionStorage.getItem('quizReportData');
    if (!reportDataString) {
        document.body.innerHTML = "<h1>Error: No report data found. Please take a quiz first.</h1>";
        return;
    }

    const data = JSON.parse(reportDataString);

    const reportDateEl = document.getElementById('report-date');
    const reportTimeEl = document.getElementById('report-time');
    const reportCategoryEl = document.getElementById('report-category');
    const reportScoreEl = document.getElementById('report-score');
    const solutionsListEl = document.getElementById('solutions-list');

    const correctCountEl = document.getElementById('correct-count');
    const wrongCountEl = document.getElementById('wrong-count');
    const skippedCountEl = document.getElementById('skipped-count');

    let correctCount = data.score;
    let wrongCount = 0;
    let skippedCount = 0;

    data.userAnswers.forEach((answer, i) => {
        if (answer === null) skippedCount++;
        else if (answer !== data.correctAnswers[i]) wrongCount++;
    });

    const quizDate = new Date(data.date);
    reportDateEl.innerText = quizDate.toLocaleDateString();
    reportTimeEl.innerText = quizDate.toLocaleTimeString();
    reportCategoryEl.innerText = data.category;

    // ⭐ FIXED TROPHY PATH
    reportScoreEl.innerHTML = `${data.score} <img src="/images/trophy.png" class="report-trophy">`;

    correctCountEl.innerText = correctCount;
    wrongCountEl.innerText = wrongCount;
    skippedCountEl.innerText = skippedCount;

    solutionsListEl.innerHTML = "";

    data.questions.forEach((question, index) => {
        const userAnswer = data.userAnswers[index];
        const correctAnswer = data.correctAnswers[index];

        let answerText = '';
        let scoreText = '';
        let scoreColor = '#ffc107';

        if (userAnswer === null) {
            scoreText = 'Score: 0';
            answerText = `Ans : ${correctAnswer} <span style="color: #ffc107;">(You skipped)</span>`;
        } else if (userAnswer === correctAnswer) {
            scoreText = 'Score: +1';
            answerText = `Ans : ${correctAnswer}`;
            scoreColor = '#009688';
        } else {
            scoreText = 'Score: 0';
            answerText = `Your Ans: ${userAnswer} <br> Correct Ans : ${correctAnswer}`;
            scoreColor = '#e53935';
        }

        solutionsListEl.innerHTML += `
            <div class="report-solution-item">
                <div class="report-question">${index + 1}. ${question}</div>
                <div class="report-answer">${answerText}</div>
                <div class="report-score" style="color:${scoreColor}">${scoreText}</div>
            </div>
        `;
    });

});
