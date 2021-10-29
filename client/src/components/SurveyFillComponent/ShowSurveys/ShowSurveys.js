import { Table, Alert } from "react-bootstrap"
import { Link } from "react-router-dom";
import './ShowSurveys.css'

function ShowSurveys(props) {
    return (
        <>
            <div className="show-title">
                <h1 className="title-font">Hello!</h1>
                <h4>Your opinion is important. Be free to fill out one of our survey!</h4>
            </div>
            {props.message && <Alert className="table-group-show" variant={props.message.type}>{props.message.msg}</Alert>}

            <Table borderless hover responsive striped className="table-group-show">
                
                <thead>
                    <tr>
                        <th>Survey</th>
                        <th>Num. Questions</th>
                        <th>Fill Out</th>
                    </tr>
                </thead>
                <tbody>
                    {props.surveys.map((survey) =>
                        <tr key={survey.id}>
                            <td>{survey.name}</td>
                            <td>{survey.questions.length}</td>
                            <td><Link to={`/surveys/${survey.id}`}><i className="fas fa-file-signature"></i></Link></td>
                        </tr>)}
                </tbody>
            </Table>
            
        </>
    );
}

export default ShowSurveys;