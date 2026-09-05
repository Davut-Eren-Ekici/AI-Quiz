const startQuiz = document.querySelector("#startQuiz");
const topicInput = document.querySelector("#topic");
const questionCountInput = document.querySelector("#questionCount");
const difficultySelect = document.querySelector("#difficulty");
const quizSetup = document.querySelector("#quiz-setup");
const questionContainer = document.querySelector("#question-container");
const questionText = document.querySelector("#question-text");
const optionsContainer = document.querySelector("#options-container");
const resultContainer = document.querySelector("#result-container");
const scoreText = document.querySelector("#score-text");
const scorePercentage = document.querySelector("#score-percentage");
const restartQuiz = document.querySelector("#restartQuiz");
const progressBar = document.querySelector("#progress-bar");
const questionTracker = document.querySelector("#question-tracker");

let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0; 

startQuiz.addEventListener("click", async function() {
    const topic = topicInput.value.trim();
    const questionCount = questionCountInput.value;
    const difficulty = difficultySelect.value;

    if (!topic) {
        alert("Lütfen bir test konusu girin!");
        return;
    }

    startQuiz.innerHTML = "<span>Sorular Oluşturuluyor...</span>";
    startQuiz.disabled = true;

    const quizSettings = { topic, questionCount, difficulty };

    try {
        const response = await fetch("https://ai-quiz-au71.onrender.com/generate-quiz", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(quizSettings)
        });

        const data = await response.json();

        if (data.success) {
            quizQuestions = data.quiz;
            currentQuestionIndex = 0;
            score = 0; 

            quizSetup.classList.add("hidden");
            resultContainer.classList.add("hidden");
            questionContainer.classList.remove("hidden");

            showQuestion();
        } else {
            alert("Hata: " + data.error);
        }
    } catch (err) {
        console.error("Hata:", err);
        alert("Sunucuya bağlanılamadı!");
    } finally {
        startQuiz.innerHTML = `<span>Testi Başlat</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
        startQuiz.disabled = false;
    }
});

function showQuestion() {
    optionsContainer.innerHTML = "";
    optionsContainer.classList.remove("options-disabled"); 

    const currentQuestion = quizQuestions[currentQuestionIndex];
    const totalQuestions = quizQuestions.length;

    // İlerleme çubuğu ve soru takip rozeti güncelleme
    questionTracker.innerText = `Soru ${currentQuestionIndex + 1} / ${totalQuestions}`;
    const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    progressBar.style.width = `${progressPercent}%`;

    questionText.innerText = currentQuestion.question;

    currentQuestion.options.forEach(option => {
        const btn = document.createElement("button");
        btn.innerText = option;
        btn.classList.add("option-btn");
        
        btn.addEventListener("click", function() {
            checkAnswer(btn, option, currentQuestion.answer);
        });

        optionsContainer.appendChild(btn);
    });
}

function checkAnswer(selectedBtn, selectedOption, correctAnswer) {
    optionsContainer.classList.add("options-disabled");

    const allButtons = optionsContainer.querySelectorAll(".option-btn");

    if (selectedOption === correctAnswer) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("incorrect");
      
        allButtons.forEach(btn => {
            if (btn.innerText === correctAnswer) {
                btn.classList.add("correct");
            }
        });
    }

    setTimeout(() => {
        currentQuestionIndex++;

        if (currentQuestionIndex < quizQuestions.length) {
            showQuestion();
        } else {
            showResults();
        }
    }, 1200);
}

function showResults() {
    questionContainer.classList.add("hidden");
    resultContainer.classList.remove("hidden");

    const totalQuestions = quizQuestions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    scoreText.innerText = `${totalQuestions} sorudan ${score} tanesini doğru yanıtladınız.`;
    scorePercentage.innerText = `%${percentage}`;
}

restartQuiz.addEventListener("click", function() {
    resultContainer.classList.add("hidden");
    quizSetup.classList.remove("hidden");
});



// Spider & Canvas Arka Plan Animasyonu

const canvas = document.querySelector("#canvas");
let w, h;
const ctx = canvas.getContext("2d");
const { sin, cos, PI, hypot, min, max } = Math;

function spawn() {
    const pts = many(333, () => {
        return {
            x: rnd(innerWidth),
            y: rnd(innerHeight),
            len: 0,
            r: 0
        };
    });

    const pts2 = many(9, (i) => {
        return {
            x: cos((i / 9) * PI * 2),
            y: sin((i / 9) * PI * 2)
        };
    });

    let seed = rnd(100);
    let tx = rnd(innerWidth);
    let ty = rnd(innerHeight);
    let x = rnd(innerWidth);
    let y = rnd(innerHeight);
    let kx = rnd(0.5, 0.5);
    let ky = rnd(0.5, 0.5);
    let walkRadius = pt(rnd(50, 50), rnd(50, 50));
    let r = innerWidth / rnd(100, 150);

    function paintPt(pt) {
        pts2.forEach((pt2) => {
            if (!pt.len) return;
            drawLine(
                lerp(x + pt2.x * r, pt.x, pt.len * pt.len),
                lerp(y + pt2.y * r, pt.y, pt.len * pt.len),
                x + pt2.x * r,
                y + pt2.y * r
            );
        });
        drawCircle(pt.x, pt.y, pt.r);
    }

    return {
        follow(x, y) {
            tx = x;
            ty = y;
        },

        tick(t) {
            const selfMoveX = cos(t * kx + seed) * walkRadius.x;
            const selfMoveY = sin(t * ky + seed) * walkRadius.y;
            let fx = tx + selfMoveX;
            let fy = ty + selfMoveY;

            x += min(innerWidth / 100, (fx - x) / 10);
            y += min(innerWidth / 100, (fy - y) / 10);

            let i = 0;
            pts.forEach((pt) => {
                const dx = pt.x - x,
                    dy = pt.y - y;
                const len = hypot(dx, dy);
                let r = min(2, innerWidth / len / 5);
                pt.t = 0;
                const increasing = len < innerWidth / 10 && (i++) < 8;
                let dir = increasing ? 0.1 : -0.1;
                if (increasing) {
                    r *= 1.5;
                }
                pt.r = r;
                pt.len = max(0, min(pt.len + dir, 1));
                paintPt(pt);
            });
        }
    };
}

const spiders = many(2, spawn);

addEventListener("pointermove", (e) => {
    spiders.forEach(spider => {
        spider.follow(e.clientX, e.clientY);
    });
});

requestAnimationFrame(function anim(t) {
    if (w !== innerWidth) w = canvas.width = innerWidth;
    if (h !== innerHeight) h = canvas.height = innerHeight;
    
    // Siyah doldurma yerine canvas ekranını temizliyoruz:
    ctx.clearRect(0, 0, w, h);
    
    // Örümceklerin çizim rengi (Koyu lacivert/siyah ton)
    ctx.fillStyle = ctx.strokeStyle = "#0f172a";
    
    t /= 1000;
    spiders.forEach(spider => spider.tick(t));
    requestAnimationFrame(anim);
});

function recalc(X, Y) {
    tx = X;
    ty = Y;
}

function rnd(x = 1, dx = 0) {
    return Math.random() * x + dx;
}

function drawCircle(x, y, r) {
    ctx.beginPath();
    ctx.ellipse(x, y, r, r, 0, 0, PI * 2);
    ctx.fill();
}

function drawLine(x0, y0, x1, y1) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);

    many(100, (i) => {
        i = (i + 1) / 100;
        let x = lerp(x0, x1, i);
        let y = lerp(y0, y1, i);
        let k = noise(x / 5 + x0, y / 5 + y0) * 2;
        ctx.lineTo(x + k, y + k);
    });

    ctx.stroke();
}

function many(n, f) {
    return [...Array(n)].map((_, i) => f(i));
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function noise(x, y, t = 101) {
    let w0 = sin(0.3 * x + 1.4 * t + 2.0 + 2.5 * sin(0.4 * y + -1.3 * t + 1.0));
    let w1 = sin(0.2 * y + 1.5 * t + 2.8 + 2.3 * sin(0.5 * x + -1.2 * t + 0.5));
    return w0 + w1;
}

function pt(x, y) {
    return { x, y };
}