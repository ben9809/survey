import { Form, Button, Alert, Image } from 'react-bootstrap';
import { useState } from 'react';
import './Login.css'
import loginLogo from './logo/loginLogo.svg'

function LoginForm(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errorUsername, setErrorUsername] = useState('');
    const [errorPassword, setErrorPassword] = useState('');

    const handleUsername = (event) => {
        const value = event.target.value;
        if (value === null || value === '') {
            setErrorUsername('Username cannot be empty');
            setUsername('');
        }
        else {
            setUsername(value);
            setErrorUsername('');
        }
    }

    const handlePassword = (event) => {
        const value = event.target.value;
        if (value === null || value === '') {
            setErrorPassword('Password cannot be empty');
            setPassword('');
        }
        else {
            setPassword(value);
            setErrorPassword('');
        }

        if (value.length < 6 && value.length > 0) {
            setErrorPassword('Password must contain at least 6 characters');
        }

    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');

        if (!errorPassword && !errorUsername) {
            const credentials = { username: username, password: password };
            props.login(credentials).catch((err) => {
                setErrorMessage(err);
            });
        }
        else {
            setErrorMessage('Unable to login');
        }
    };

    return (
        <div className="below-nav center-login">
            <Form className="form-show">
                <Image className="login-image" src={loginLogo} roundedCircle />
                {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
                <Form.Group controlId='username' className="form-group-login">
                    <Form.Label className='form-label-login'>User Email</Form.Label>
                    <Form.Control type='email' value={username} onChange={(ev) => handleUsername(ev)} />
                </Form.Group>
                {errorUsername ? <span className="form-control-feedback">{errorUsername}</span> : ''}
                <Form.Group controlId='password'>
                    <Form.Label className='form-label-login'>Password</Form.Label>
                    <Form.Control type='password' value={password} onChange={(ev) => handlePassword(ev)} />
                </Form.Group>
                {errorPassword ? <span className="form-control-feedback">{errorPassword}</span> : ''}
                <br />
                <Button variant='success' onClick={handleSubmit}>Login</Button>
            </Form>
        </div>
    )

}

export default LoginForm;