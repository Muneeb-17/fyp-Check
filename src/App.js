import React from 'react';
import { BrowserRouter as Router, Switch,Route } from 'react-router-dom';
import './App.css';
import Login from './login.js';
import signUp from './signUp.js';
import HomePage from './home.js';
import rideDetails from './rideDetails';
import Ads from './ads';
import logout from './logout';
import About from './about';
import myRide from './myRide';
import AdsLogin from './AdsLogin';
import Update from './update';





function App(){
  
  return (
   
    <Router>
  <div>
          <Switch>
            <Route path="/home" exact component={HomePage}/>
            <Route path="/login" exact component={Login}/>
            <Route path ="/SignUp" exact component={signUp}/>
            <Route path ="/rideDetails" exact component={rideDetails}/>
            <Route path ="/ads" exact component ={Ads} />
            <Route path = '/logout' exact component ={logout}/>
            <Route path = '/about' exact component = {About} />
            <Route path = '/myRide' exact component = {myRide} />
            <Route path = '/adsLogin' exact component = {AdsLogin} />
            <Route path = '/update' exact component = {Update} />
           
            
            
          </Switch>
          </div>
          </Router>
  );
  
}

export default App;
