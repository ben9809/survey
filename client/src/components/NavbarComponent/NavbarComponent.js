import { Navbar, Button, Container, Dropdown, ButtonGroup, ListGroup, Col, Row } from 'react-bootstrap';
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import surveyLogo from './logos/survey-logo.svg';
import userLogo from './logos/user-logo.svg'
import './NavbarComponent.css'


function NavbarComponent(props) {
    return (
        <Navbar className="navbar" variant="dark" expand="sm" bg="success" fixed="top">
            <Container fluid>
                <Navbar.Brand>
                    <img
                        src={surveyLogo}
                        width="30"
                        height="30"
                        alt=""
                    />{' '}
                    Surveys
                </Navbar.Brand>
                <Navbar.Brand>
                    <Link to="/surveys"><Button variant="success">Home</Button></Link>
                    {props.loggedIn ?
                        <>
                            <Link to="/admin/surveys"><Button variant="success">Your Surveys</Button></Link>
                            <Dropdown as={ButtonGroup}>
                                <Dropdown.Toggle type="button" variant="" id="dropdown-split-basic">
                                    <img
                                        src={userLogo}
                                        width="30"
                                        height="30"
                                        alt=""
                                    />
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="left-menu">
                                    <h4 className="text-center">Admin Profile</h4>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item className="float-left">
                                            <strong>Id: </strong>
                                            <span>{props.user.id}</span>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="float-left">
                                            <strong>Name: </strong>
                                            <span>{props.user.name}</span>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="float-left"><strong>Username: </strong>
                                            <span>{props.user.username}</span>
                                        </ListGroup.Item>
                                    </ListGroup>
                                    <Row>
                                        <Col>
                                            <Button variant="outline-success" className="button-margin" onClick={props.doLogOut}><i className="fas fa-sign-out-alt"></i> Logout</Button>
                                        </Col>
                                    </Row>

                                </Dropdown.Menu>
                            </Dropdown>
                        </>
                        :
                        <Link to="/login"><Button variant="success">Log In</Button></Link>
                    }
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
}

export default NavbarComponent;