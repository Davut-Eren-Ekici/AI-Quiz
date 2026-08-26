const express = require("express");

const app = express();

app.use(express.json());


app.post("/generate-quiz", function(req,res) {
    console.log(req.body);

    res.json({
        message: "Quiz ayarları backend'e ulaştı!",
        quizSettings: req.body
    });
});

app.get("/" , function(req, res) {
    res.send("AI Quiz Backend çalışıyor!");
});

app.listen(3000, function(){
    console.log("Server çalışıyor : http://localhost:3000");
});