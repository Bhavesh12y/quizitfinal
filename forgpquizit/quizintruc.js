
document.addEventListener('DOMContentLoaded', () => {


    const params = new URLSearchParams(window.location.search);
    
    
    const category = params.get('category');


    const categorySpan = document.getElementById('quiz-category');
    const startButton = document.getElementById('start-quiz-btn');

    
    if (category) {
       
        categorySpan.innerText = category;

      
        startButton.onclick = () => {
            
            window.location.href = `quiz.html?category=${category}`;
        };

    } else {
        
        categorySpan.innerText = "No Category Selected";
        startButton.innerText = "Error";
        startButton.disabled = true;
    }

});