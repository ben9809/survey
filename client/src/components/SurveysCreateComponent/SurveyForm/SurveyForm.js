import { Form, Button, Col, Row } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import './SurveyForm.css'
import { useState } from 'react';
import { Redirect, Link } from 'react-router-dom';



function SurveyForm(props) {

    const [surveyName, setSurveyName] = useState('');
    const [errorSurveyName, setErrorSurveyName] = useState(false);
    const [showAddQuestion, setShowAddQuestion] = useState(false)
    const [questions, setQuestions] = useState([])
    const [errorQuestions, setErrorQuestions] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSurveyName = (value) => {
        if (value.length > 0) {
            setSurveyName(value);
            setErrorSurveyName(false);
        }
        else {
            setSurveyName('');
            setErrorSurveyName(true);
        }
    }

    const handleShowAddQuestion = () => {
        setErrorQuestions(false);
        setShowAddQuestion(true);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (surveyName.length === 0) {
            setErrorSurveyName(true);
        }

        if (questions.length === 0) {
            setErrorQuestions(true);
        }

        if (surveyName.length > 0 && questions.length > 0) {
            let survey = {}
            survey.name = surveyName;
            survey.questions = questions
            setSubmitted(true);
            props.addSurvey(survey);
        }


    }
    const addNewQuestion = (q) => {
        setQuestions((oldQuestions) => [...oldQuestions, q])
    }

    const moveUp = (index) => {
        if (index - 1 < 0)
            return;
        else {
            let tmpQuestions = [...questions];
            let tmp = tmpQuestions[index - 1]
            tmp.id = index;
            tmpQuestions[index - 1] = tmpQuestions[index];
            tmpQuestions[index].id = index - 1;
            tmpQuestions[index] = tmp;
            setQuestions(tmpQuestions);
        }
    }

    const moveDown = (index) => {
        if (index + 1 >= questions.length) {
            return;
        }
        let tmpQuestions = [...questions];
        const tmp = tmpQuestions[index + 1]
        tmp.id = index;
        tmpQuestions[index + 1] = tmpQuestions[index];
        tmpQuestions[index].id = index + 1;
        tmpQuestions[index] = tmp;
        setQuestions(tmpQuestions);

    }
    const deleteQuestion = (qstIndex) => {

        setQuestions((oldQuestions) =>
            oldQuestions.filter((q, index) => index !== qstIndex)
        )
    }

    return (
        <>
            {submitted ? <Redirect to='/admin/surveys' /> :
                <div className="form-survey-container">
                    <div className="form-survey-page">
                        <h1>New Survey</h1>
                        <Form.Group controlId="formBasicDescr" className="form-position">
                            <Form.Label><strong>Survey Name:</strong></Form.Label>
                            <Form.Control type="description" value={surveyName} onChange={(ev) => handleSurveyName(ev.target.value)} placeholder="Enter survey name" />
                        </Form.Group>
                        {errorSurveyName ? <><Form.Text className="surveyname-control-feedback">Please insert a survey name.</Form.Text> </> : ''}

                        {[questions.map((question, index) => {
                            return <QuestionPreview key={index} question={question} index={index} moveUp={moveUp} moveDown={moveDown} deleteQuestion={deleteQuestion}></QuestionPreview>
                        })]}
                        {errorQuestions ? <Form.Text className="surveyname-control-feedback">Please add at least one question.</Form.Text> : ''}

                        {showAddQuestion ? <AddQuestion setShowAddQuestion={setShowAddQuestion} addNewQuestion={addNewQuestion} idQuestion={questions.length} /> : ''}
                        {!showAddQuestion && <Button size='sm' id='button-add' className='button-survey' variant="outline-secondary" onClick={() => handleShowAddQuestion()}><i className="fas fa-plus icon" /> Add Question</Button>}
                        <div className="fixed-right-bottom">
                            <Link to='/admin/surveys'><Button variant='danger'><i className="fas fa-times"></i> Close Survey</Button></Link>&nbsp;
                            <Button disabled={showAddQuestion} variant='success' onClick={(ev) => handleSubmit(ev)}><i className="fas fa-check"></i> Submit Survey</Button>
                        </div>

                    </div>
                </div>
            }
        </>
    );
};

function QuestionPreview(props) {
    return (
        <div className="show-question form-position ">
            <Row>
                <Col sm={10}>
                    <p>{props.index + 1}. {props.question.question_text} {props.question.property.mandatory ? <Form.Text style={{ color: 'red' }}>*</Form.Text> : props.question.property.min > 0 ? <Form.Text style={{ color: 'red' }}>*</Form.Text> : ''}</p>
                </Col>
                <Col sm={2}>
                    <span onClick={() => props.moveUp(props.index)}><i className="fas fa-angle-up icon" />    </span>
                    <span onClick={() => props.moveDown(props.index)}><i className="fas fa-angle-down icon" />  </span>
                    <span onClick={() => props.deleteQuestion(props.index)}><i className="fas fa-trash-alt icon" />   </span>
                </Col>
            </Row>


            {props.question.property.type === 'open-ended' ?
                <OpenQuestion question={props.question}></OpenQuestion>
                :
                <CloseQuestion question={props.question}></CloseQuestion>
            }

        </div>
    )

}

function OpenQuestion(props) {
    return (
        <>
            <Form.Control as="textarea" disabled rows={1} />
            <Form.Text className="text-muted">Write an answer less than 200 characters.</Form.Text>
        </>
    )
}

function CloseQuestion(props) {
    return (
        <>
            <Form.Group controlId="type" className="form-position">
                {props.question.property.options.map((opt, index) => {
                    return (
                        <Form key={index}>
                            <Form.Check>
                                <Form.Check.Input disabled></Form.Check.Input>
                                <Form.Check.Label>{opt}</Form.Check.Label>
                            </Form.Check>
                        </Form>
                    )
                })
                }
            </Form.Group>
            {
                props.question.property.min > 0 ?
                    <Form.Text className="text-muted">Select min {props.question.property.min} {props.question.property.min > 1 ? 'answers' : 'answer'} {props.question.property.max > 0 ? ('and max ' + props.question.property.max) + (props.question.property.max > 1 ? ' answers' : ' answer') : ''}.</Form.Text>
                    :
                    props.question.property.max > 0 ?
                        <Form.Text className="text-muted">Select max {props.question.property.max} {props.question.property.max > 1 ? 'answers' : 'answer'}.</Form.Text>
                        :
                        ''
            }
        </>
    )
}


function AddQuestion(props) {
    const [questionText, setQuestionText] = useState('')
    const [errorQuestionText, setErrorQuestionText] = useState(false);
    const [questionType, setQuestionType] = useState('no-choise');
    const [errorQuestionType, setErrorQuestionType] = useState(false);
    const [mandatory, setMandatory] = useState(false);
    const [options, setOptions] = useState([""]);
    const [errorOptions, setErrorOptions] = useState(false);
    const [answersNumber, setAnswersNumber] = useState({ min: 0, max: 0 });
    const [errorMaxMinOptions, setErrorMaxMinOptions] = useState(false);

    const handleQuestionType = (value) => {
        setQuestionType(value);
        setErrorQuestionType(false);
    }

    const handleQuestionText = (value) => {
        if (value.length > 0) {
            setQuestionText(value);
            setErrorQuestionText(false);
        }
        else {
            setQuestionText('');
            setErrorQuestionText(true);
        }
    }

    const handleOption = (index, value) => {
        const tmpOptions = [...options];
        tmpOptions[index] = value;
        setOptions(tmpOptions);
    }

    const handleMin = (value) => {

        if (Number(value) < 10) {
            setAnswersNumber({ min: Number(value), max: Number(value) > answersNumber.max ? Number(value) : answersNumber.max });

        }
    }

    const handleMax = (value) => {

        if (Number(value) <= 10) {
            setAnswersNumber({ min: answersNumber.min, max: Number(value) ? Number(value) : 0 });
        }
    }

    const handleSave = (event) => {
        event.preventDefault();

        if (questionText.length === 0) {
            setErrorQuestionText(true);
        }

        if (questionType === 'no-choise') {
            setErrorQuestionType(true);
        }

        const numberOfOptionsEmpty = options.filter(option => option === "").length
        const errorMaxMinOptionsGiven = options.length < answersNumber.max || options.length < answersNumber.min;
        if (questionType === 'closed-answer') {

            if (errorMaxMinOptionsGiven) {
                setErrorMaxMinOptions(true);
            }
            else {
                setErrorMaxMinOptions(false);
            }

            if (numberOfOptionsEmpty > 0) {
                setErrorOptions(true);
            }
            else {
                setErrorOptions(false);
            }
        }

        if (questionText.length > 0 && questionType !== 'no-choise') {
            let newQuestion = {};
            newQuestion.question_text = questionText;

            if (questionType === 'open-ended') {
                newQuestion.property = {};
                newQuestion.id = props.idQuestion;
                newQuestion.property.type = 'open-ended';
                newQuestion.property.mandatory = mandatory;
                props.addNewQuestion(newQuestion);
                props.setShowAddQuestion(false);
            }
            else if (questionType === 'closed-answer' && numberOfOptionsEmpty === 0 && !errorMaxMinOptionsGiven) {
                newQuestion.property = {};
                newQuestion.id = props.idQuestion;
                newQuestion.property.type = 'closed-answer';
                newQuestion.property.min = answersNumber.min;
                newQuestion.property.max = answersNumber.max;
                newQuestion.property.options = [...options];
                props.addNewQuestion(newQuestion);
                props.setShowAddQuestion(false);
            }
        }

    }

    return (
        <div className="form-add-question">
            <Form.Group controlId="type" className="form-position">
                <Form.Label><strong>Question Text:</strong></Form.Label>
                <Form.Control type="description" placeholder="Enter question text" onChange={(ev) => handleQuestionText(ev.target.value)} />
                {errorQuestionText ? <Form.Text className="form-control-feedback">Please write the new question.</Form.Text> : ''}
                <br />
                <Form.Label><strong>Question Type:</strong></Form.Label>
                <br />
                <Form.Control as="select" defaultValue={questionType} onChange={(ev) => handleQuestionType(ev.target.value)}>
                    <option value='no-choise' disabled> -- click to select an option -- </option>
                    <option value='open-ended'>Open Ended</option>
                    <option value='closed-answer'>Closed Answer</option>
                </Form.Control>
                {errorQuestionType ? <Form.Text className="form-control-feedback">Please select an option.</Form.Text> : ''}
                <br />

                {questionType === 'open-ended' ?
                    <Form.Check>
                        <Form.Check.Input checked={mandatory} onChange={(ev) => setMandatory(ev.target.checked)}></Form.Check.Input>
                        <Form.Check.Label>Mandatory</Form.Check.Label>
                    </Form.Check>
                    :
                    questionType === 'closed-answer' ?
                        <>
                            <Row>
                                <Col sm={6}>
                                    <Form.Label><strong>Min Answers To Be Given:</strong></Form.Label>
                                    <input type='number' className='form-control' value={answersNumber.min} min={0} max={9} onChange={(ev) => handleMin(ev.target.value)}></input>
                                </Col>

                                <Col sm={6}>
                                    <Form.Label><strong>Max Answers To Be Given:</strong></Form.Label>
                                    <input type='number' className='form-control' value={answersNumber.max} min={answersNumber.min} max={10} onChange={(ev) => handleMax(ev.target.value)}></input>
                                </Col>
                            </Row>


                            <br />
                            <Form.Label><strong>Options:</strong></Form.Label>
                            {options ?
                                options.map((option, index) => {
                                    return (
                                        <Form.Check key={index}>
                                            <Form.Check.Input className='pointer'></Form.Check.Input>
                                            <Form.Control type="input" className="form-add-input" value={option} onChange={(ev) => handleOption(index, ev.target.value)} />
                                        </Form.Check>
                                    )
                                })

                                :
                                ''
                            }
                            {options.length < 10 ?
                                <Form.Label style={{ color: '#198754' }} type="button" onClick={() => setOptions((oldOptions) => [...oldOptions, ""])}><i className="fas fa-plus icon" /> Add Option</Form.Label>
                                :
                                ''
                            }
                            {errorOptions ? <Form.Text className="form-control-feedback">Please fill out all the options.</Form.Text> : ''}
                            {errorMaxMinOptions ? <Form.Text className="form-control-feedback">Please add more options, the answers to be given are min {answersNumber.min} and max {answersNumber.max}.</Form.Text> : ''}
                            <br />
                        </>

                        :
                        ''
                }

                <br></br>

                <Button size='sm' variant="outline-danger" onClick={() => props.setShowAddQuestion(false)}><i className="fas fa-times"></i> Close Question</Button>&nbsp;
                <Button size='sm' variant="outline-success" onClick={(ev) => handleSave(ev)}><i className="fas fa-save"></i> Save Question</Button>

            </Form.Group>

        </div>
    )

}

export default SurveyForm;