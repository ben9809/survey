import { Route, Switch, Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap"
import SearchBar from "../SearchBarComponent/SearchBar.js";
import SurveyGroup from './SurveyGroup/SurveyGroup.js'
import SurveyForm from "./SurveyForm/SurveyForm.js";
import { useEffect, useState } from "react";
import AdminAPI from "../../services/AdminAPI.js";
import ViewAnswers from './ViewAnswers/ViewAnswers.js'

function SurveysComponent(props) {
    const [surveys, setSurveys] = useState([]);
    const [surveysChanged, setSurveysChanged] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (message) {
            setTimeout(() => { setMessage('') }, 3000);
        }
    }, [message]);

    useEffect(() => {
        if (surveysChanged) {
            AdminAPI.loadSurveysByIdAdmin()
                .then((loadesSurveys) => {
                    setSurveys(loadesSurveys);
                    setSurveysChanged(false);
                })
                .catch((err) => {
                    setMessage({ msg: err.error + ' Something went wrong. Please try again later.', type: 'danger' });
                })
        }
    }, [surveysChanged])

    const addSurvey = (survey) => {
        AdminAPI.createSurvey(survey)
            .then(() => {
                setSurveysChanged(true);
            })
            .catch((err) => {
                setMessage({ msg: err.error + ' Something went wrong. Please try again later.', type: 'danger' });
            });
    }


    return (
        <Container fluid>
            <Row className="vheight-100 below-nav">

                <Switch>
                    <Route exact path="/admin/surveys" render={() =>
                        <>
                            <Col
                                sm={2}
                                className="collapse d-sm-block bg-light"
                                id="left-sidebar"
                            >
                                <SearchBar surveys={surveys} path="surveys"></SearchBar>

                            </Col>

                            <Col sm={10}>

                                <SurveyGroup surveys={surveys} message={message}></SurveyGroup>
                                <Link to='/admin/surveys/add'><Button variant='success'><i className="fas fa-plus icon" /> Create New Survey</Button></Link>
                            </Col>
                        </>

                    }></Route>

                    <Route exact path="/admin/surveys/add" render={() =>
                        <Col sm={12} id="">
                            <SurveyForm surveys={surveys} addSurvey={addSurvey}></SurveyForm>
                        </Col>

                    }></Route>

                    <Route exact path="/admin/surveys/:id" render={({ match }) =>
                        <>
                            <Col
                                sm={2}
                                className="collapse d-sm-block bg-light"
                                id="left-sidebar"
                            >
                                <SearchBar surveys={surveys}></SearchBar>
                            </Col>

                            <Col sm={10}>
                                <ViewAnswers surveyId={match.params.id}></ViewAnswers>
                            </Col>
                        </>
                    }></Route>
                </Switch>
            </Row>
        </Container>
    );
}

export default SurveysComponent;