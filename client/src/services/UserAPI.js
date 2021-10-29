function loadSurveys() {
    return new Promise((resolve, reject) => {
        fetch('/api/surveys').then((response) => {
            if (response.ok) {
                response.json().then((surveys) => {
                    const loadedSurveys = surveys.map((survey) => ({
                        id: survey.id,
                        name: survey.name,
                        questions: survey.questions,
                        tot_answers: survey.tot_answers
                    }));
                    resolve(loadedSurveys);
                }).catch(() => { reject({ error: "Cannot parse server response." }) });
            }
            else {
                response.json().then((err) => {
                    reject(err);
                }).catch(() => { reject({ error: "Cannot parse server response." }) });
            }
        }).catch(() => { reject({ error: "Cannot comunicate with server" }) });
    })
}

function FillSurvey(answer, tot_answers) {
    const answerToSend = {
        username: answer.userName,
        id_survey: answer.id_survey,
        tot_answers: tot_answers,
        answers: JSON.stringify(answer.answers),
    }
    return new Promise((resolve, reject) => {
        fetch('/api/answers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(answerToSend)
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            }
            else {
                response.json().then((err) => {
                    reject(err);
                }).catch(() => { reject({ error: "Cannot parse server response." }) });
            }
        }).catch(() => { reject({ error: "Cannot comunicate with server." }) });
    })
}

const UserAPI = { loadSurveys, FillSurvey };

export default UserAPI;