import NavbarComponent from './components/NavbarComponent/NavbarComponent.js'
import SurveysComponent from './components/SurveysCreateComponent/Surveys.js'
import './App.css';
import SurveyFill from './components/SurveyFillComponent/SurveyFill.js';
import LoginForm from './components/LoginComponent/Login.js'
import { useState, useEffect } from "react";
import AdminAPI from './services/AdminAPI.js'

import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

function App() {

  const [user, setUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await AdminAPI.getUserInfo();
        setUser(user);
        setLoggedIn(true);
      }
      catch (err) {
        setLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  const doLogIn = (credentials) => {
    return new Promise((resolve, reject) => {
      AdminAPI.logIn(credentials).then((user) => {
        setLoggedIn(true);
        setUser(user);
        resolve(null);
      }).catch((err) => { reject(err); });
    })

  }

  const doLogOut = async () => {
    await AdminAPI.logOut();
    setLoggedIn(false);
  }

  return (
    <div className="App">
      <Router>
        <NavbarComponent user={user} loggedIn={loggedIn} doLogOut={doLogOut}></NavbarComponent>

        <Switch>

          <Route path="/login" render={() =>
            <>{loggedIn ? <Redirect to="/admin/surveys" /> : <LoginForm login={doLogIn} />}</>
          } />

          <Route path="/admin/surveys" render={() =>
            <>
              {loggedIn ?
                <SurveysComponent></SurveysComponent>
                :
                <Redirect to="/login"></Redirect>
              }
            </>

          } />

          <Route path="/surveys" render={() =>
            <SurveyFill></SurveyFill>
          } />

          <Route path="/" render={() => <Redirect to="/surveys"></Redirect>} />

        </Switch>

      </Router>
    </div>
  );
}

export default App;
