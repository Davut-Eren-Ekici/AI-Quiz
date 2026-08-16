const startQuiz = document.querySelector("#startQuiz");
const topicInput = document.querySelector("#topic");
const questionCountInput = document.querySelector("#questionCount");
const difficultySelect = document.querySelector("#difficulty");


startQuiz.addEventListener("click",function(){
    console.log("Quiz Başlatıldı!");

    const topic = topicInput.value;
    const questionCount = questionCountInput.value;
    const difficulty = difficultySelect.value;

    console.log(topic);
    console.log(questionCount);
    console.log(difficulty);
});