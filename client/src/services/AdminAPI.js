//ADMIN API

function loadSurveysByIdAdmin() {
    return new Promise((resolve, reject) => {
        fetch('/api/admin/surveys').then((response) => {
            if (response.ok) {
                response.json().then((surveys) => {
                    const loadedSurveys = surveys.map((survey) => ({
                        id: survey.id,
                        name: survey.name,
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

function createSurvey(survey) {
    const surveyToSend = {
        name: survey.name,
        questions: JSON.stringify(survey.questions),
    }
    return new Promise((resolve, reject) => {
        fetch('/api/admin/surveys', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(surveyToSend)
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

function getSurvey(id) {
    return new Promise((resolve, reject) => {
        fetch('/api/admin/surveys/' + id).then((response) => {
            if (response.ok) {
                response.json().then((survey) => {
                    const returnedSurvey = {
                        id: survey.id,
                        name: survey.name,
                        questions: survey.questions
                    };
                    resolve(returnedSurvey);
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

function getFilledAnswersByIdSurvey(id) {
    return new Promise((resolve, reject) => {
        fetch('/api/survey/' + id + '/answers').then((response) => {
            if (response.ok) {
                response.json().then((answers) => {
                    const filledAnswers = answers.map((answersInfo) => ({
                        id: answersInfo.id,
                        username: answersInfo.username,
                        answers: answersInfo.answers
                    }));
                    resolve(filledAnswers);
                }).catch(() => { reject({ error: "Cannot parse server response." }) });
            }
            else {
                response.json().then((err) => {
                    reject(err);
                }).catch(() => { reject({ error: "Cannot parse server response." }) });
            }
        }).catch(() => { reject({ error: "Cannot comunicate with server" }) });
    });
}

async function logIn(credentials) {
    let response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user;
    }
    else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
        }
        catch (err) {
            throw err;
        }
    }
}

async function logOut() {
    await fetch('/api/sessions/current', { method: 'DELETE' });
}

async function getUserInfo() {
    const response = await fetch('/api/sessions/current');
    const userInfo = await response.json();
    if (response.ok) {
        return userInfo;
    } else {
        throw userInfo; // an object with the error coming from the server
    }
}


const AdminAPI = {createSurvey, getSurvey, getFilledAnswersByIdSurvey, logIn, logOut, getUserInfo, loadSurveysByIdAdmin};

export default AdminAPI;