const express = require("express");
const gc = require("./../gradeControl.js");
const router = express.Router();

router.get("/", (req, res) => {
	gc.getGrades().then(grades => {
		res.send(JSON.stringify(grades.grades));
	}).catch(err => {
		res.status(500).send(err);
	});
});

router.get("/get/:id", (req, res) => {
	let params = req.params;
	if(params.hasOwnProperty("id")){
		gc.getGrade(params.id).then(grade => {
			if(grade === undefined){
				res.status(404).send(JSON.stringify({"message": "Nota não encontrada"}));
			} else {
				res.send(JSON.stringify(grade));
			}
		}).catch(err => {
			console.log(err);
			res.status(500).send(JSON.stringify(err));
		})
	}
});

router.get("/best", (req, res) => {
	let params = req.body;
	if(params.hasOwnProperty("type") && params.hasOwnProperty("subject")){
		gc.getGrades().then(grd => {
			let retorno = [];
			let grades = grd.grades.filter(grade => {
				return grade.subject == params.subject && grade.type == params.type;
			});

			grades.sort((a,b) => {
				return b.value - a.value;
			});
			for(let i = 0; i < grades.length; i++){
				if(i < 3){
					retorno.push(grades[i]);
				} else {
					break;
				}
			}

			res.send(JSON.stringify(retorno));
		}).catch(err => {
			console.log(err);
			res.status(500).send(JSON.stringify({"message": err.message}));
		});
	} else {
		res.status(400).send(JSON.stringify({"message": "Parâmetros insuficientes"}));
	}
});

router.post("/save", (req, res) => {
	let params = req.body;
	if(params.hasOwnProperty("student") && params.hasOwnProperty("subject") && params.hasOwnProperty("type") && params.hasOwnProperty("value")){
		gc.saveGrade(params.student, params.subject, params.type, params.value)
			.then(grd => res.send(grd))
			.catch(err => {
				console.log(err);
				res.status(500).send(err);
			});
	} else {
		res.status(400).send({"message": "Parametros insuficientes"});
	}
});

router.put("/update", (req, res) => {
	let params = req.body;
	if(params.hasOwnProperty("id") && params.hasOwnProperty("student") && params.hasOwnProperty("subject") && params.hasOwnProperty("type") && params.hasOwnProperty("value")){
		gc.updateGrade(params.id, params.student, params.subject, params.type, params.value)
			.then(grd => {
				if(grd != null){
					res.send(grd);
				} else {
					res.status(404).send(JSON.stringify({"message": "Nota não encontrada"}));
				}
			})
			.catch(err => {
				console.log(err);
				res.status(500).send(err);
			}).finally(() => {
				res.end();
			});
	} else {
		res.status(400).send({"message": "Parametros insuficientes"});
	}
});

router.delete("/delete", (req, res) => {
	let params = req.body;
	if(params.hasOwnProperty("id")){
		gc.deleteGrade(params.id).then(grd => {
			res.send(JSON.stringify(grd));
		});
	} else {
		res.status(400).send({"message": "Parametros insuficientes"});
	}
});

module.exports = router;