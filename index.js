const fs = require("fs").promises;
const express = require("express");
const app = express();
const gc = require("./gradeControl")
const port = 3000;
const grades = require("./routes/grades.js");

app.use(express.json());
app.use("/grades", grades);

app.get("/student/avg", (req, res) => {
	let params = req.body;
	if(params.hasOwnProperty("student") && params.hasOwnProperty("subject")){
		gc.getGrades().then(grd => {
			var soma = grd.grades.reduce((acc, grade) => {
				if(grade.student == params.student && grade.subject == params.subject){
					return acc + grade.value;
				}

				return acc;
			},0);
			res.send(JSON.stringify({"total": soma}));
		});
	} else {
		res.status(400).send(JSON.stringify({"message": "Parâmetros insuficientes"}));
	}
});

app.get("/subject/avg", (req, res) => {
	let params = req.body;
	if(params.hasOwnProperty("type") && params.hasOwnProperty("subject")){
		gc.getGrades().then(grd => {
			var qtd = 0
			var soma = grd.grades.reduce((acc, grade) => {
				if(grade.type == params.type && grade.subject == params.subject){
					qtd++;
					return acc + grade.value;
				}

				return acc;
			},0);
			let media = qtd > 0 ? soma/qtd : 0
			res.send(JSON.stringify({"total": media}));
		});
	} else {
		res.status(400).send(JSON.stringify({"message": "Parâmetros insuficientes"}));
	}
});


app.listen(port, () =>{
	gc.hasGrade().catch(err => {console.log(err)});
});