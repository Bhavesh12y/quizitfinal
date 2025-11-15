
document.addEventListener('DOMContentLoaded', () => {
    
   
    const searchBar = document.getElementById('categorySearch');
    const categoryItems = document.querySelectorAll('.category-item');

   
    searchBar.addEventListener('input', () => {
      
        const searchTerm = searchBar.value.toLowerCase();

        categoryItems.forEach(item => {
           
            const categoryName = item.querySelector('.category-name').textContent.toLowerCase();

            
            if (categoryName.includes(searchTerm)) {
               
                item.style.display = 'flex'; 
            } else {
                
                item.style.display = 'none';
            }
        });
    });
});
async function loadDashboard(){
    const user = JSON.parse(localStorage.getItem('user'));
    if(!user) return;

    // Load leaderboard
    const lb = await fetch('http://localhost:5000/api/leaderboard/top?limit=10');
    const lbData = await lb.json();
    console.log("Leaderboard:", lbData);

    // Load recent attempts
    const ra = await fetch('http://localhost:5000/api/quiz/attempts/' + user.id);
    const raData = await ra.json();
    console.log("Recent Attempts:", raData);
}
loadDashboard();


async function loadRecentQuizzes() {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) return;

        const res = await fetch(`http://localhost:5000/api/quiz/attempts/${user.id}`);
        const data = await res.json();

        console.log("Recent Quiz Data:", data);

        const recentList = document.querySelector(".quiz-scroll-list");
        recentList.innerHTML = ""; 

        if (data.length === 0) {
            recentList.innerHTML = `<p style="color:white; text-align:center;">No quizzes attempted yet.</p>`;
            return;
        }

        data.forEach((attempt) => {

            //⭐⭐ Correct field from database
            const rawDate = attempt.attemptedAt;   
            const dateObj = new Date(rawDate);

            // formatted date
            const date = dateObj.toLocaleDateString("en-GB", {
                day: "2-digit", month: "short", year: "2-digit"
            });

            // formatted time
            const time = dateObj.toLocaleTimeString("en-GB", {
                hour: "2-digit", minute: "2-digit"
            });

            const category = attempt.category ?? attempt.quizCategory ?? attempt.type ?? attempt.topic ?? "General";
            const score = attempt.score;

            const btn = document.createElement("button");
            btn.className = "quiz-row";
            btn.innerHTML = `
                <span>${date}</span>
                <span>${time}</span>
                <span>${category}</span>
                <span>${score} <img src="trophy.png" class="quiz-trophy"></span>
            `;

            // Save attempt for report page
            btn.onclick = () => {
                localStorage.setItem("reportAttempt", JSON.stringify(attempt));
                window.location.href = "/report";
            };

            recentList.appendChild(btn);
        });

    } catch (err) {
        console.error("Error loading recent quizzes:", err);
    }
}

loadRecentQuizzes();


