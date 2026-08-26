const startQuiz = document.querySelector("#startQuiz");
const topicInput = document.querySelector("#topic");
const questionCountInput = document.querySelector("#questionCount");
const difficultySelect = document.querySelector("#difficulty");



startQuiz.addEventListener("click", async function() {
    console.log("Quiz Başlatıldı!");

    const topic = topicInput.value;
    const questionCount = questionCountInput.value;
    const difficulty = difficultySelect.value;

    const quizSettings = {
        topic,
        questionCount,
        difficulty
    };

    const response = await fetch("http://localhost:3000/generate-quiz", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(quizSettings)
    });

    const data = await response.json();
    console.log("Backend'den gelen cevap:", data);
});

async function testAPI() {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  console.log(response);
  const data = await response.json();
  console.log(data);
  console.log(data.title);
}
testAPI();