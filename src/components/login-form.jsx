import React, {Component} from 'react';
import InputValidation from '../utils/helper';
import '../style.css';
import { Link } from 'react-router-dom';

class LoginForm extends Component
{
    constructor (props)
    {
        super ( );

        this.state = 
        {
            emailId: '',
            password: '',
            loggedIn: false,
            userId: ''
        }
    }

    handleEmailIdChange = (event) =>
    {
        this.setState (
            {
                emailId: event.target.value
            }
        );
    }

    handlePasswordChange = (event) =>
    {
        this.setState (
            {
                password: event.target.value
            }
        );
    }

    handleOnSubmitEvent  = (event) =>
    {
        event.preventDefault ();
        document.getElementById('output').innerHTML = "";
        const validationMessage = 
        InputValidation.validateEmailIdAndPassword(this.state.emailId, this.state.password, null);
        if (validationMessage.length > 0)
        {
            document.getElementById('output').innerHTML = validationMessage;
            return;
        }

        const url = "http://localhost:3001/users/login";
        var user_info =
        {  
            "emailId": this.state.emailId,
            "password": this.state.password,
        }
        
        var options =
        {
            method: 'POST',
            headers:
            {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(user_info)
        }
    
        fetch(url, options)
        .then ((resp) => 
        {
            if (resp.status === 200)
            {
                this.setState (
                    {
                        loggedIn: true
                    }
                );    
            }
            else
                document.getElementById('output').innerHTML = "Invalid Credentials!";
            return resp.json();
        })
        .then (data =>
            {
                if (this.state.loggedIn)
                {
                    this.setState (
                        {
                            userId: data.userId
                        }
                    );
                    this.props.history.push('/home');
                }
            })
        .catch ((error) =>
        {
            console.log(`Error from server: ${error}`);
            
        });
        console.log(this.props);
    }

    render ()
    {
        return (
            <React.Fragment>
                <div>
                    <form onSubmit = {this.handleOnSubmitEvent}>
                    <label>Email:</label><br/>
                    <input 
                        type="text" 
                        value = {this.state.emailId}
                        onChange = {this.handleEmailIdChange}
                        required
                    />
                    <br/>
                    <label>Password:</label>
                    <br/>
                    <input 
                        type="password" 
                        value = {this.state.password}
                        onChange = {this.handlePasswordChange} 
                        required
                    />
                    <br/>
                    <button
                        type="submit"
                        className="submit"
                    >
                        Login
                    </button>
                    <p id="output"></p>
                    <p>No account?
                        <Link to='/signup'>
                            Create one
                        </Link>
                    </p>  
                    </form>
                </div>
            </React.Fragment>
        );
    }
}

export default LoginForm;