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

let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0; 

startQuiz.addEventListener("click", async function() {
    const topic = topicInput.value;
    const questionCount = questionCountInput.value;
    const difficulty = difficultySelect.value;

    if (!topic) {
        alert("Lütfen bir konu girin!");
        return;
    }

    startQuiz.innerText = "Sorular Hazırlanıyor...";
    startQuiz.disabled = true;

    const quizSettings = { topic, questionCount, difficulty };

    try {
        const response = await fetch("http://localhost:3000/generate-quiz", {
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
        startQuiz.innerText = "Quiz Başlat";
        startQuiz.disabled = false;
    }
});

function showQuestion() {
    optionsContainer.innerHTML = "";
    optionsContainer.classList.remove("options-disabled"); 

    const currentQuestion = quizQuestions[currentQuestionIndex];
    questionText.innerText = `${currentQuestionIndex + 1}. ${currentQuestion.question}`;

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

    scoreText.innerText = `${totalQuestions} sorudan ${score} tanesini doğru bildiniz.`;
    scorePercentage.innerText = `%${percentage} Başarı Oranı`;
}


restartQuiz.addEventListener("click", function() {
    resultContainer.classList.add("hidden");
    quizSetup.classList.remove("hidden");
});