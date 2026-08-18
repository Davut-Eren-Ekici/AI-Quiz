const startQuiz = document.querySelector("#startQuiz");
const topicInput = document.querySelector("#topic");
const questionCountInput = document.querySelector("#questionCount");
const difficultySelect = document.querySelector("#difficulty");



startQuiz.addEventListener("click", async function(){
    console.log("Quiz Başlatıldı!");

    const topic = topicInput.value;
    const questionCount = questionCountInput.value;
    const difficulty = difficultySelect.value;

    const quizSettings = {
      topic,
      questionCount,
      difficulty
    };

    const response = await fetch("https://jsonplaceholder.typicode.com/posts",{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quizSettings)
    });
      

    

    const quizJSON = JSON.stringify(quizSettings);
    const quizObject = JSON.parse(quizJSON);
    console.log(quizObject);
    console.log(quizJSON);
    console.log(response);
    const data = await response.json();
    console.log(data);
   
});

async function testAPI() {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  console.log(response);
  const data = await response.json();
  console.log(data);
  console.log(data.title);
}
testAPI();