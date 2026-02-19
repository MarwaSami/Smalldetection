let violations = 0;
let timeLeft = 3600; // 1 hour in seconds
const violationDisplay = document.getElementById('violation-count');
const timerDisplay = document.getElementById('timer');
const logList = document.getElementById('log-list');
const modalOverlay = document.getElementById('modal-overlay');
const alarm = document.getElementById('alarm');

// Initialize Timer
const timerInterval = setInterval(updateTimer, 1000);

function updateTimer() {
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        autoSubmit("Time has expired.");
        return;
    }
    timeLeft--;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    if (timerDisplay) {
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    // Visual warning when time is low
    if (timeLeft < 300 && timerDisplay) { // Less than 5 minutes
        timerDisplay.parentElement.style.color = 'var(--warning)';
    }
}

// Detect tab switch
document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
        violations++;
        updateViolationUI();

        const timestamp = new Date().toLocaleTimeString();
        addLogEntry(`Tab switched detected`, timestamp, 'warning');

        // Play alarm
        if (alarm) {
            alarm.play().catch(e => console.error("Error playing alarm:", e));
        }

        showModal("Warning! You switched tab during the exam. This violation has been recorded in your activity log.");
    }
});

function updateViolationUI() {
    if (violationDisplay) {
        violationDisplay.textContent = violations;
    }
}

function addLogEntry(message, time, type = '') {
    if (logList) {
        const li = document.createElement('li');
        li.className = 'log-item';
        li.innerHTML = `
            <span class="log-message ${type}">${message}</span>
            <span class="log-time">${time}</span>
        `;
        logList.prepend(li);
    }
}

function showModal(message) {
    if (modalOverlay) {
        document.getElementById('modal-body').textContent = message;
        modalOverlay.classList.add('active');
    }
}

function closeModal() {
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
    }
}

function autoSubmit(reason = "multiple violations") {
    addLogEntry(`Exam terminated: ${reason}`, new Date().toLocaleTimeString(), 'warning');
    showModal(`Exam Ended: ${reason}. You will be redirected shortly.`);
    setTimeout(() => {
        window.location.href = "exam-ended.html";
    }, 3000);
}
