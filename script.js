let credits = 100;
let isGenerating = false;

// Elements
const promptEl = document.getElementById("prompt");
const modelEl = document.getElementById("model");
const styleEl = document.getElementById("style");
const durationEl = document.getElementById("duration");
const resolutionEl = document.getElementById("resolution");

const generateBtn = document.getElementById("generateBtn");
const progressBar = document.getElementById("progressBar");
const stageText = document.getElementById("generationStage");
const timeText = document.getElementById("estimatedTime");

const creditsEl = document.getElementById("credits");
const resultCard = document.getElementById("resultCard");
const resultPrompt = document.getElementById("resultPrompt");

const historyList = document.getElementById("historyList");
const themeBtn = document.getElementById("themeBtn");
const downloadBtn = document.getElementById("downloadBtn");

const queueStatus = document.getElementById("queueStatus");

// Load saved data
let history = JSON.parse(localStorage.getItem("nv_history")) || [];
let theme = localStorage.getItem("nv_theme") || "dark";

applyTheme(theme);
renderHistory();
updateCreditsDisplay();

// -------------------- THEME --------------------
themeBtn.onclick = () => {
    theme = theme === "dark" ? "light" : "dark";
    applyTheme(theme);
    localStorage.setItem("nv_theme", theme);
};

function applyTheme(mode) {
    if (mode === "light") {
        document.body.classList.add("light");
        themeBtn.innerText = "🌙 Dark Mode";
    } else {
        document.body.classList.remove("light");
        themeBtn.innerText = "☀️ Light Mode";
    }
}

// -------------------- GENERATION --------------------
generateBtn.onclick = () => {
    if (isGenerating) return;

    const prompt = promptEl.value.trim();
    const cost = parseInt(modelEl.value);

    if (!prompt) {
        alert("Please enter a prompt.");
        return;
    }

    if (credits < cost) {
        alert("Insufficient credits!");
        return;
    }

    credits -= cost;
    updateCreditsDisplay();

    startQueue(prompt, cost);
};

function startQueue(prompt, cost) {
    isGenerating = true;

    let queuePos = Math.floor(Math.random() * 3) + 1;
    queueStatus.innerText = `Position in Queue: ${queuePos}`;

    let queueInterval = setInterval(() => {
        queuePos--;

        if (queuePos > 0) {
            queueStatus.innerText = `Position in Queue: ${queuePos}`;
        } else {
            clearInterval(queueInterval);
            queueStatus.innerText = "Processing...";
            runGeneration(prompt, cost);
        }
    }, 1000);
}

function runGeneration(prompt, cost) {
    resultCard.style.display = "none";

    let progress = 0;

    const stages = [
        "Analyzing Prompt...",
        "Building Scene...",
        "Generating Frames...",
        "Applying Effects...",
        "Rendering Video...",
        "Finalizing..."
    ];

    let stageIndex = 0;

    const durationMap = {
        "5 Seconds": 5,
        "10 Seconds": 10,
        "20 Seconds": 20,
        "60 Seconds": 60
    };

    const duration = durationMap[durationEl.value];
    document.getElementById("videoDuration").innerText = `00:${duration}`;

    timeText.innerText = `Estimated Time: ${duration * 2} sec`;

    let interval = setInterval(() => {

        progress += Math.floor(Math.random() * 8) + 2;

        if (progress > 100) progress = 100;

        progressBar.style.width = progress + "%";

        if (stageIndex < stages.length - 1 &&
            progress > (stageIndex + 1) * 15) {
            stageIndex++;
        }

        stageText.innerText = stages[stageIndex];

        if (progress === 100) {
            clearInterval(interval);
            finishGeneration(prompt);
        }

    }, 300);
}

// -------------------- FINISH --------------------
function finishGeneration(prompt) {
    isGenerating = false;

    stageText.innerText = "Completed!";
    queueStatus.innerText = "Waiting...";

    resultCard.style.display = "block";
    resultPrompt.innerText = prompt;

    saveHistory(prompt);
    renderHistory();
}

// -------------------- HISTORY --------------------
function saveHistory(prompt) {
    history.unshift({
        text: prompt,
        time: new Date().toLocaleTimeString()
    });

    if (history.length > 10) history.pop();

    localStorage.setItem("nv_history", JSON.stringify(history));
}

function renderHistory() {
    if (history.length === 0) {
        historyList.innerHTML =
            `<div class="history-empty">No videos generated yet</div>`;
        return;
    }

    historyList.innerHTML = "";

    history.forEach(item => {
        let div = document.createElement("div");
        div.className = "history-item";
        div.innerHTML = `
            <strong>${item.text}</strong>
            <br>
            <small>${item.time}</small>
        `;
        historyList.appendChild(div);
    });
}

// -------------------- CREDITS --------------------
function updateCreditsDisplay() {
    creditsEl.innerText = credits;
}

// -------------------- DOWNLOAD (FAKE) --------------------
downloadBtn.onclick = () => {
    const text = "NovaVision AI Generated Video File\nPrompt: " +
        resultPrompt.innerText;

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "novavision_video.txt";
    a.click();

    URL.revokeObjectURL(url);
};

// -------------------- FAKE LIVE STATS --------------------
setInterval(() => {
    document.getElementById("videoCount").innerText =
        1200 + Math.floor(Math.random() * 100);

    document.getElementById("activeUsers").innerText =
        300 + Math.floor(Math.random() * 50);

    document.getElementById("gpuUsage").innerText =
        85 + Math.floor(Math.random() * 15) + "%";
}, 3000);
