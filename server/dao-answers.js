'use strict'

const sqlite = require('sqlite3');

const db = new sqlite.Database('surveys.db', (err) => {
    if (err) throw err;
});

exports.fillSurvey = (answer) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO answers(username, id_survey, answers) VALUES (?, ?, ?)';
        db.run(sql, [answer.username, answer.id_survey, answer.answers], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        })
    })
}

exports.getFilledAnswersByIdSurvey = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM answers WHERE id_survey = ?'
        db.all(sql, [id], (err, rows) => {
            if(err) {
                reject(err);
                return;
            }
            if(rows === undefined) {
                resolve({error: "Answers not found"});
            }
            else {
                const filledAnswers = rows.map((row) => ({id: row.id, username: row.username, id_survey: row.id_survey, answers: JSON.parse(row.answers)}));
                resolve(filledAnswers);
            }
        })
    })
}