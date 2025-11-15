// This is the full report.js file
document.addEventListener('DOMContentLoaded', () => {

    // 1. Get the data from session storage
    const reportDataString = sessionStorage.getItem('quizReportData');
    
    // If no data is found, show an error
    if (!reportDataString) {
        document.body.innerHTML = "<h1>Error: No report data found. Please take a quiz first.</h1>";
        return;
    }
    
    // 2. Parse the string data back into a JavaScript object
    const data = JSON.parse(reportDataString);

    // 3. Get all the HTML elements to fill
    const reportDateEl = document.getElementById('report-date');
    const reportTimeEl = document.getElementById('report-time');
    const reportCategoryEl = document.getElementById('report-category');
    const reportScoreEl = document.getElementById('report-score');
    const solutionsListEl = document.getElementById('solutions-list');
    
    // Get the new stat elements
    const correctCountEl = document.getElementById('correct-count');
    const wrongCountEl = document.getElementById('wrong-count');
    const skippedCountEl = document.getElementById('skipped-count');

    // 4. Calculate Stats
    let correctCount = data.score;
    let wrongCount = 0;
    let skippedCount = 0;

    data.userAnswers.forEach((answer, index) => {
        if (answer === null) {
            skippedCount++;
        } else if (answer !== data.correctAnswers[index]) {
            wrongCount++;
        }
    });
    
    // 5. Populate the Meta Row
    const quizDate = new Date(data.date);
    reportDateEl.innerText = quizDate.toLocaleDateString(); // e.g., "10/24/2025"
    reportTimeEl.innerText = quizDate.toLocaleTimeString(); // e.g., "5:30:00 PM"
    reportCategoryEl.innerText = data.category;
    reportScoreEl.innerHTML = `${data.score} <img src="trophy.png" class="report-trophy">`;

    // 6. Populate the Stats Block (This replaces the pie chart logic)
    correctCountEl.innerText = correctCount;
    wrongCountEl.innerText = wrongCount;
    skippedCountEl.innerText = skippedCount;

    // 7. Populate the Solutions List
    solutionsListEl.innerHTML = ''; // Clear any existing content
    
    data.questions.forEach((question, index) => {
        const userAnswer = data.userAnswers[index];
        const correctAnswer = data.correctAnswers[index];
        
        let answerText = '';
        let scoreText = '';
        let scoreColor = '#ffc107'; // Default for skipped
        
        if (userAnswer === null) {
            // SKIPPED
            scoreText = 'Score: 0';
            answerText = `Ans : ${correctAnswer} <span style="color: #ffc107;">(You skipped)</span>`;
            scoreColor = '#ffc107';
        } else if (userAnswer === correctAnswer) {
            // CORRECT
            scoreText = 'Score: +1';
            answerText = `Ans : ${correctAnswer}`;
            scoreColor = '#009688'; // Green
        } else {
            // WRONG
            scoreText = 'Score: 0';
            answerText = `Your Ans: ${userAnswer} <br> Correct Ans : ${correctAnswer}`;
            scoreColor = '#e53935'; // Red
        }

        // Create the HTML for the solution item
        const solutionItem = `
            <div class="report-solution-item">
                <div class="report-question">${index + 1}. ${question}</div>
                <div class="report-answer">${answerText}</div>
                <div class="report-score" style="color: ${scoreColor};">
                    ${scoreText}
                </div>
            </div>
        `;
        
        // Add the new item to the list
        solutionsListEl.innerHTML += solutionItem;
    });
    
    // Optional: Clear the session storage so the report can't be seen again by mistake
    // sessionStorage.removeItem('quizReportData');

});