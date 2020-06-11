const gradeControl = {
	fs: require("fs").promises,
	hasGrade: async function() {
		return await this.fs.readFile("grades.json", "utf8").catch(async err => {
			await this.fs.copyFile("./default/grades.json", "./grades.json").catch(cpErr => {
				console.log(cpErr);
				throw cpErr;
			});
		});
	},
	getGrades: async function(){
		let fileContent = await this.fs.readFile("grades.json", "Utf8").catch(err => {throw err});
		return JSON.parse(fileContent);
	},
	writeGrades: async function(fileContents){
		return await this.fs.writeFile("grades.json", JSON.stringify(fileContents)).catch(err => {
			throw err;
		});
	},
	getGrade: async function(id){
		let grades = await this.getGrades().catch(err => {throw err;});
		return grades.grades.find(grd => grd.id == id);

	},
	saveGrade: async function(student, subject, type, value){
		let grades = await this.getGrades().catch(err => {throw err; return err;});
		grades.grades.push({id:grades.nextId, timestamp: new Date(), student, subject, type, value});
		grades.nextId++;
		await this.writeGrades(grades).catch(err => {
			console.log(err);
			throw err;
		});

		return grades.grades;
	},
	updateGrade: async function(id, student, subject, type, value){
		let grades = await this.getGrades().catch(err => {throw err});
		let index = grades.grades.findIndex(grade => grade.id == id);

		if(index < 0){
			return null;
		}
		let grade = grades.grades[index];
		grade.student = student;
		grade.subject = subject;
		grade.type = type;
		grade.value = value;

		grades.grades[index] = grade;
		await this.writeGrades(grades).catch(err => {
			console.log(err);
			throw err;
		});

		return grade;
	},
	deleteGrade: async function(id){
		let grades = await this.getGrades().catch(err => {throw err});
		let deleted = 0;
		let newGrades = grades.grades.filter((grade) => {
			return grade.id != id;
		});
		grades.grades = newGrades;
		await this.writeGrades(grades).catch(err => { throw err; });

		return grades.grades;
	}
}

module.exports = gradeControl;