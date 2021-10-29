import { ListGroup, Form, FormControl } from 'react-bootstrap'
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from "react";
import './SearchBar.css'



function SearchBar(props) {

    const [surveysSearched, setSurveysSearched] = useState([]);

    useEffect(() => { 
        setSurveysSearched(props.surveys);
    }, [props.surveys])

    const handleSearch = (value) => {
        
        if(value) {
            const search = surveysSearched.filter(survey => survey.name.includes(value));
            setSurveysSearched(search);
        }
        else {
            setSurveysSearched(props.surveys);
        }
    }

    return (
        <>
            <ListGroup as="aside" variant="flush">
                <Form inline>
                    <FormControl type="text" placeholder="Search survey" onInput={(ev) => handleSearch(ev.target.value)} className="mr-sm-2" />
                    {surveysSearched.map((survey, index) =>
                        <NavLink to={props.path ? `${props.path}/${survey.id}` : `${survey.id}`} key={index} className="list-group-item list-group-item-search">
                           <span className="dot"></span> {survey.name}
                        </NavLink>)}
                </Form>
            </ListGroup>
        </>
    );
}

export default SearchBar;