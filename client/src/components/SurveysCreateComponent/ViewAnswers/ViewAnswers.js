import { useState, useEffect } from 'react';
import { Form, Button, Col, Row, Pagination, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import AdminAPI from '../../../services/AdminAPI';
import '../SurveyForm/SurveyForm.css'
import './ViewAnswers.css'

function ViewAnswers(props) {
  
    const [answers, setAnswers] = useState([])
    const [questions, setQuestions] = useState([])
    const [surveyName, setSurveyName] = useState('')
    const [answerToShow, setAnswerToShow] = useState(0)
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState('');

    
    useEffect(() => {
        AdminAPI.getSurvey(props.surveyId)
            .then(survey => {
                setBusy(true);
                setQuestions(survey.questions);
                setSurveyName(survey.name)
                setAnswerToShow(0);
                setAnswers([]);
            })
            .catch(err => {
                setMessage({ msg: err.error + ' Something went wrong. Please try again later.', type: 'danger' });
                setBusy(true);
            })
    }, [props.surveyId])

    useEffect(() => {
        if(busy) {
             AdminAPI.getFilledAnswersByIdSurvey(props.surveyId)
            .then(answers => {
                setAnswers(answers);
                setLoading(false);
                setBusy(false);
            })
            .catch((err) => {
                setMessage({ msg: err.error + ' Something went wrong. Please try again later.', type: 'danger' });
                setBusy(true)
            })
        }
       
    }, [props.surveyId, busy]);

    return (
        <>
            {loading || busy ?
                <div className="form-survey-container">
                    {message ? <Alert variant={message.type}>{message.msg}</Alert> :
                    <div className="form-survey-page-clone"> 

                    
                    </div>
                }           
                </div>
                :
                answers.length === 0 ?
                    <span className="no-answer-font">No answers to visualise</span>
                    :                
                    <div className="form-survey-container">
                        <div className="form-survey-page">
                            <h1>{surveyName.toUpperCase()}</h1>
                            <Form.Group controlId="formBasicDescr" className="form-position">
                                <Form.Label><strong>User Name:</strong></Form.Label>
                                <Form.Control type="description" value={answers[answerToShow].username} disabled/>
                            </Form.Group>
                            {[questions.map((question, index) => {
                                return (
                                    <div key={index} className="show-question form-position">
                                        {question.property.type === 'open-ended' ?
                                            <OpenQuestion index={index} question={question} answer={answers[answerToShow].answers.find((answer) => answer.id_question === question.id)} ></OpenQuestion>
                                            :
                                            <CloseQuestion index={index} question={question} answer={answers[answerToShow].answers.find((answer) => answer.id_question === question.id)} ></CloseQuestion>
                                        }
                                    </div>
                                );
                            })]}
                        </div> 
                            
                        <Pagination className="justify-content-center pagination-position">
                            <Pagination.First onClick={() => setAnswerToShow(0)}/>
                            <Pagination.Prev disabled={(answerToShow -1) < 0} onClick={() => {setAnswerToShow(answerToShow-1)}}/>
                            {answers.slice(0, 5).map((answer, index) =>{
                                return <Pagination.Item id={index} key={index} active={index === (answerToShow)} onClick={(ev) => {setAnswerToShow(Number(ev.target.id))}}>{index +1}</Pagination.Item>
                            })}
                            {
                                answers.length > 5 ?
                                    <>
                                        < Pagination.Ellipsis />
                                        <Pagination.Item id={answers.length -1} key={answers.length} active={answers.length -1 === (answerToShow)} onClick={(ev) => { setAnswerToShow(Number(ev.target.id)) }}>{answers.length}</Pagination.Item>
                                    </>
                                :

                                ''
                            }
                            <Pagination.Next disabled={(answerToShow + 1) >= answers.length} onClick={() => { setAnswerToShow(answerToShow + 1) }}/>
                            <Pagination.Last onClick={() => { setAnswerToShow(answers.length -1)}}/>
                        </Pagination>
                    </div>
            }
            <Link to="/admin/surveys"><Button variant="success" className="fixed-right-home"> Your Surveys</Button></Link>
        </>
    )
}

function CloseQuestion(props) {
    return (
        <>
            <Row>
                <Col sm={10}>
                    <p>{props.index + 1}. {props.question.question_text}</p>
                </Col>
            </Row>
            <Form.Group controlId="type" className="form-position">
                {props.question.property.options.map((opt, index) => {
                    return (
                        <Form key={index}>
                            <Form.Check>
                                <Form.Check.Input checked={props.answer ? props.answer.selectedOptions[index] : ''} disabled></Form.Check.Input>
                                <Form.Check.Label>{opt}</Form.Check.Label>
                            </Form.Check>
                        </Form>
                    )
                })}
            </Form.Group>
        </>
    )

}

function OpenQuestion(props) {
    return (
        <>
            <Row>
                <Col sm={10}>
                    <p>{props.index + 1}. {props.question.question_text}</p>
                </Col>
            </Row>
            <Form.Control as="textarea" value={props.answer ? props.answer.answer_text : ''} disabled rows={1} />
            
        </>
    );
}
export default ViewAnswers;