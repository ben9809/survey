import "../../SurveysCreateComponent/SurveyForm/SurveyForm.css"
import { Form, Button, Col, Row, Alert } from 'react-bootstrap'
import { useState, useEffect } from 'react';
import UserAPI from "../../../services/UserAPI.js"
import { Redirect, Link } from "react-router-dom";
import './SurveyFillOut.css'

function SurveyFillOut(props) {

    const [answers, setAnswers] = useState([]);
    const [userName, setUserName] = useState(undefined);
    const [errorUserName, setErrorUserName] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [trySubmit, setTrySubmit] = useState(false);
    const [message, setMessage] = useState('');
    const [mandatoryAnswers, setMandatoryAnswers] = useState(props.survey.questions.map((question) => {
        if (question.property.type === 'open-ended') {
            return question.property.mandatory;
        }
        else {
            return question.property.min > 0;
        }
    }
    ))

    useEffect(() => {
        if (message) {
            setTimeout(() => { setMessage('') }, 3000);
        }
    }, [message]);

    const handleErrors = (indexError, value) => {
        setMandatoryAnswers((oldMandatoryAnswers) => oldMandatoryAnswers.map((err, index) => {
            if (index === indexError) {
                return value;
            }
            else {
                return err;
            }
        }));
    }

    const addAnswer = (newAnswer) => {
        setAnswers((oldAnswers) => {
            let newAnswers = [...oldAnswers];
            const oldAnswer = newAnswers[newAnswer.id];
            if (oldAnswer) {
                newAnswers[newAnswer.id] = newAnswer;
                return newAnswers;
            }
            else {
                return [...newAnswers, newAnswer];
            }
        })
    }

    const handleUserName = (value) => {
        if (value) {
            setUserName(value);
            setErrorUserName(false);
        }
        else {
            setUserName(undefined)
            setErrorUserName(true)
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const errorsfound = mandatoryAnswers.filter((err) => err === true)
        if (errorsfound.length !== 0 || !userName) {
            if (!userName) {
                setErrorUserName(true)
            }
            setTrySubmit(true);
        }
        else {
            setTrySubmit(false);
            let answer = {};
            answer.id_survey = props.survey.id;
            answer.userName = userName;
            answer.answers = [...answers];
            const tot_answers = props.survey.tot_answers + 1;
            UserAPI.FillSurvey(answer, tot_answers)
                .then(() => {
                    setSubmitted(true);
                    props.setSurveysChanged(true);
                })
                .catch((err) => {
                    setMessage({ msg: err.error + ' Something went wrong. Please try again later.', type: 'danger' });
                });
        }
    }

    return (
        <>
            {submitted ? <Redirect to="/surveys" />
                :
                <div className="form-survey-container">
                    <div className="form-survey-page">
                        <h1 className="survey-title">{props.survey.name.toUpperCase()}</h1>
                        <Form.Label className="subtitle-survey">Please fill in the form correctly to submit your answers!</Form.Label>
                        {message && <Alert className="alert-danger-fill" variant={message.type}>{message.msg}</Alert>}
                        <Form.Group controlId="formBasicDescr" className="form-position">
                            <Form.Label><strong>Your Name:</strong></Form.Label>
                            <Form.Control type="description" onChange={(ev) => handleUserName(ev.target.value)} placeholder="Enter your name" />
                        </Form.Group>
                        {errorUserName ? <span className="form-control-feedback username-control-feedback"> Please insert your name</span> : ''}

                        {[props.survey.questions.map((question, index) => {

                            return (
                                <div key={index} className="show-question form-position">
                                    {question.property.type === 'open-ended' ?
                                        <OpenQuestion index={index} question={question} addAnswer={addAnswer} idAnswer={index} trySubmit={trySubmit} error={mandatoryAnswers[index]} handleError={handleErrors}></OpenQuestion>
                                        :
                                        <CloseQuestion index={index} question={question} addAnswer={addAnswer} idAnswer={index} trySubmit={trySubmit} error={mandatoryAnswers[index]} handleError={handleErrors}></CloseQuestion>
                                    }
                                </div>
                            )
                        })]}
                        <Link to="/surveys"><Button variant="danger"><i className="fas fa-times"></i> Close Survey</Button></Link>&nbsp;
                        <Button variant="success" onClick={(ev) => handleSubmit(ev)}><i className="fas fa-check"></i> Submit Answers</Button>
                    </div>
                </div>
            }
        </>

    )
}


function CloseQuestion(props) {
    const [checkedAnswers, setCheckedAnswers] = useState(props.question.property.options.map(() => false));
    const [errorMessage, setErrorMessage] = useState(false);

    useEffect(() => {
        if (props.trySubmit && props.error) {
            setErrorMessage(true);
        }

    }, [props.trySubmit, props.error])

    const handleAnswer = (value, indexAnswer) => {
        const newCheckedAnswers = checkedAnswers.map((checkedkAnswer, index) => {
            if (index === indexAnswer) {
                return value;
            }
            else {
                return checkedkAnswer;
            }

        })
        setCheckedAnswers([...newCheckedAnswers]);
        let newAnswer = {};
        newAnswer.id = props.idAnswer
        newAnswer.id_question = props.question.id;
        const numberOfselectedElement = newCheckedAnswers.filter((checkedAnswer) => checkedAnswer === true).length;

        if (numberOfselectedElement >= props.question.property.min) {
            let readyTosend = false;
            if (props.question.property.min === props.question.property.max) {
                readyTosend = true;
            }
            else if (numberOfselectedElement <= props.question.property.max) {
                readyTosend = true;
            }

            if (readyTosend) {
                newAnswer.selectedOptions = newCheckedAnswers;
                props.handleError(props.idAnswer, false);
                props.addAnswer(newAnswer);
                setErrorMessage(false);
            }
            else {
                props.handleError(props.idAnswer, true);
                setErrorMessage(true);
            }

        }
        else {
            props.handleError(props.idAnswer, true);
            setErrorMessage(true);
        }
    }

    return (
        <>
            <Row>
                <Col sm={10}>
                    <p>{props.index + 1}. {props.question.question_text} {props.question.property.min > 0 ? <Form.Text style={{ color: 'red' }}>*</Form.Text> : ''}</p>
                </Col>
            </Row>
            <Form.Group controlId="type" className="form-position">
                {props.question.property.options.map((opt, index) => {
                    return (
                        <Form key={index}>
                            <Form.Check>
                                <Form.Check.Input onChange={(ev) => handleAnswer(ev.target.checked, index)}></Form.Check.Input>
                                <Form.Check.Label>{opt}</Form.Check.Label>
                            </Form.Check>
                        </Form>
                    )
                })}
            </Form.Group>
            {
                props.question.property.min > 0 ?
                    <Form.Text className={(!errorMessage ? "text-muted" : "") + " form-control-feedback"}>Select min {props.question.property.min} {props.question.property.min > 1 ? 'answers' : 'answer'} {props.question.property.max > 0 ? ('and max ' + props.question.property.max) + (props.question.property.max > 1 ? ' answers' : ' answer') : ''}.</Form.Text>
                    :
                    props.question.property.max > 0 ?
                        <Form.Text className={(!errorMessage ? "text-muted" : "") + " form-control-feedback"}>Select max {props.question.property.max} {props.question.property.max > 1 ? 'answers' : 'answer'}.</Form.Text>
                        :
                        ''
            }
        </>
    )
}

function OpenQuestion(props) {
    const [errorMessage, setErrorMessage] = useState(false);

    useEffect(() => {
        if (props.trySubmit && props.error) {
            setErrorMessage(true);
        }

    }, [props.trySubmit, props.error])

    const handleAnswer = (value) => {
        let newAnswer = {};
        newAnswer.id = props.idAnswer;
        newAnswer.id_question = props.question.id;
        if (props.question.property.mandatory && value.length === 0) {
            setErrorMessage(true);
            props.handleError(props.idAnswer, true);
        }
        else {

            if (value.length <= 200) {

                newAnswer.answer_text = value;
                setErrorMessage(false);
                props.handleError(props.idAnswer, false);
                props.addAnswer(newAnswer);
            }
            else {
                setErrorMessage(true);
                props.handleError(props.idAnswer, true);
            }
        }
    }

    return (
        <>
            <Row>
                <Col sm={10}>
                    <p>{props.index + 1}. {props.question.question_text} {props.question.property.mandatory ? <Form.Text style={{ color: 'red' }}>*</Form.Text> : ''}</p>
                </Col>
            </Row>
            <Form.Control as="textarea" rows={1} onChange={(ev) => handleAnswer(ev.target.value)} />
            <Form.Text className={(!errorMessage ? "text-muted" : "") + " form-control-feedback"}>Write an answer less than 200 characters.</Form.Text>
        </>
    )
}

export default SurveyFillOut;