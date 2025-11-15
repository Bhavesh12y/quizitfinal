console.log("Frontend Leaderboard JS Loaded!");

// Auto-detect environment
const API_BASE =
    window.location.hostname === "localhost"
        ? "http://localhost:5000"
        : "https://quizit-25r8.onrender.com";

async function loadLeaderboard() {
    try {
        const res = await fetch(`${API_BASE}/api/leaderboard/top`);
        const data = await res.json();
        console.log("Leaderboard data:", data);

        const list = document.querySelector(".leaderboard-scroll-list");
        list.innerHTML = "";

        data.forEach((item, i) => {
            const row = document.createElement("div");
            row.className = "leaderboard-row";

            row.innerHTML = `
                <span>${i + 1}. ${item.displayName || item.username}</span>
                <span>${item.region || "India"}</span>
                <span>${item.quizCount}</span>
                <span>${item.bestScore} <img src="/images/trophy.png" class="score-trophy"></span>
                <span>All</span>
            `;

            list.appendChild(row);
        });

    } catch (err) {
        console.error("Error loading leaderboard:", err);
    }
}

document.addEventListener("DOMContentLoaded", loadLeaderboard);
