import React from "react";
import { Route } from "react-router-dom";
import LandingPage from "./components/landingPage/landingPage";
import Home from "./components/home/home";
import Form from "./components/form/form"


const App = () => (
    <React.Fragment>
        <div className='App'>
            <Route exact path="/" component={LandingPage} />
            <Route path="/home" component={Home} />
            <Route path="/form" component={Form} />
        </div>
    </React.Fragment>
);

export default App;
