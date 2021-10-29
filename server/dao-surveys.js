'use strict'

const sqlite = require('sqlite3');

const db = new sqlite.Database('surveys.db', (err) => {
    if (err) throw err;
});

//get all surveys
exports.listSurveys = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM surveys';
        db.all(sql, [], (err, rows) => {
            if(err) {
                reject(err);
                return;
            }
            
            const surveys = rows.map((survey) => ({
                id: survey.id,
                name: survey.name,
                questions: JSON.parse(survey.questions),
                tot_answers: survey.tot_answers
            }))
            resolve(surveys);
        })
    })
}

exports.createSurvey = (survey, id_admin) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO surveys(name, questions, id_admin) VALUES (?, ?, ?)';
        db.run(sql,[survey.name, survey.questions, id_admin], function (err) {
            if(err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        })
    })
}

exports.getSurveyById = (id, id_admin) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM surveys WHERE id = ? AND id_admin = ?';
        db.get(sql, [id, id_admin], (err, row) => {
            if(err) {
                reject(err);
                return;
            }
            if(row === undefined) {
                resolve({error: 'Survey not found.'})
            }
            else {
                const survey = {id: row.id, name: row.name, questions: JSON.parse(row.questions)};
                resolve(survey);
            }
        })
    })
}

exports.setTotAnswers = (id, tot_answers) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE surveys SET tot_answers = ? WHERE id = ?'
        db.run(sql, [tot_answers, id], function(err) {
            if(err) {
                reject(err);
                return;
            }
            if (this.changes) {
                resolve(id);
            }
            else {
                resolve({error: "Survey to update not found."});
            }
        })
    })
}

exports.getSurveysByIdAdmin = (id_admin) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM surveys WHERE id_admin = ?';
        db.all(sql, [id_admin], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            const surveys = rows.map((survey) => ({
                id: survey.id,
                name: survey.name,
                tot_answers: survey.tot_answers
            }))
            resolve(surveys);
        })
    })
}