import { Container, Row, Col } from "react-bootstrap"
import { Route, Switch, Redirect } from "react-router-dom";
import { useEffect, useState } from "react";
import UserAPI from "../../services/UserAPI";
import ShowSurveys from "./ShowSurveys/ShowSurveys.js";
import SurveyFillOut from "./SurveyFillOut/SurveyFillOut.js"

function SurveyFill(props) {
    

    const [surveys, setSurveys] = useState([]);
    const [surveysChanged, setSurveysChanged] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (message) {
            setTimeout(() => { setMessage('') }, 3000);
        }
    }, [message]);

    useEffect(() => {
        if(surveysChanged) {
             UserAPI.loadSurveys()
            .then((loadesSurveys) => {
                setSurveys(loadesSurveys);
                setSurveysChanged(false);
            })
            .catch((err) => {
                setMessage({ msg: err.error + ' Something went wrong. Please try again later.', type: 'danger' });
                setSurveys([]);
            })
        }
    }, [surveysChanged])
    

    return (
        <Container fluid>
            <Row className="vheight-100 below-nav">

                <Switch>
                    <Route exact path="/surveys" render={() =>
                        <>
                            
                            <Col sm={12}>
                                <ShowSurveys surveys={surveys} message={message}></ShowSurveys>
                            </Col>
                        </>

                    }></Route>

                    <Route exact path="/surveys/:id" render={({ match }) =>
                        <>  
                            {surveys.length === 0 ? <Redirect to="/surveys"/> : 
                                <Col sm={12}>
                                    <SurveyFillOut survey={surveys.find((survey) => survey.id === Number(match.params.id))} setSurveysChanged={setSurveysChanged}></SurveyFillOut>
                                </Col>
                            }
                        </>
                    }></Route>
                </Switch>
            </Row>
        </Container>
    )
}

export default SurveyFill;