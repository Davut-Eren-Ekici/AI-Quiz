const startQuiz = document.querySelector("#startQuiz");
const topicInput = document.querySelector("#topic");
const questionCountInput = document.querySelector("#questionCount");
const difficultySelect = document.querySelector("#difficulty");



startQuiz.addEventListener("click",function(){
    console.log("Quiz Başlatıldı!");

    const topic = topicInput.value;
    const questionCount = questionCountInput.value;
    const difficulty = difficultySelect.value;

    const quizSettings = {
      topic,
      questionCount,
      difficulty
    };


    const quizJSON = JSON.stringify(quizSettings);
    const quizObject = JSON.parse(quizJSON);
    console.log(quizObject);
    console.log(quizJSON);
   
});