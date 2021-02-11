import logo from './logo.svg';
import './App.css';
import SignUpForm from './components/signup-form';
import LoginForm from './components/login-form';
import HomePage from './components/home-page';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
function App() {
  return (
    
    <Router>
      <Switch>
        <Route path="/" exact component={LoginForm}/>
        <Route path="/home" component={HomePage}/>
        <Route path="/signup" component={SignUpForm}/>
      </Switch>
    </Router>

  );
}

export default App;
