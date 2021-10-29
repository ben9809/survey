import { Table, Alert } from 'react-bootstrap';
import { Link } from "react-router-dom";
import './SurveyGroup.css'


function SurveyGroup(props) {

    return (
        <div className='survey-align'>
            <h1 className="h1-font">Your Surveys</h1>
            {props.message && <Alert variant={props.message.type}>{props.message.msg}</Alert>}
            <Table borderless hover responsive striped>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Num. Answers</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {props.surveys.map((survey) => 
                    <tr key={survey.id}>
                        <td>{survey.id}</td>
                        <td>{survey.name}</td>
                        <td>{survey.tot_answers}</td>
                        <td><Link to={`surveys/${survey.id}`}><i className="fas fa-eye"/></Link></td>
                    </tr>)}
                </tbody>
            </Table>
        </div>
    );
}

export default SurveyGroup;