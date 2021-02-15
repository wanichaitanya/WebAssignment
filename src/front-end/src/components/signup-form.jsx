import React, {Component} from 'react';
import InputValidation from '../utils/helper';
import '../style.css';

class SignUpForm extends Component
{
    constructor (props)
    {
        super (props)
        this.state = 
        {
            emailId: '',
            userName: '',
            password: '',
            confirmPassword: '',
            responseStatus: 0
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

    handleLoginIdChange = (event) =>
    {
        this.setState (
            {
                userName: event.target.value
            }
        );
    }

    handlePasswordChange = (event) =>
    {
        this.setState (
            {
                password:event.target.value
            }
        );
    }

    handleConfirmPasswordChange = (event) =>
    {
        this.setState (
            {
                confirmPassword:event.target.value
            }
        );
    }

    handleOnSubmitEvent = (event) =>
    {
        event.preventDefault ();
        document.getElementById('server-response').innerHTML = "";
        const validationMessage = 
        InputValidation.validateEmailIdAndPassword(this.state.emailId,
                                                    this.state.password, 
                                                    this.state.confirmPassword);
        if (validationMessage.length > 0)
        {
            document.getElementById('server-response').innerHTML = validationMessage;
            return;
        }

        const url = "http://localhost:3001/users/sign-up";
        var user_info =
        {  
            "emailId": this.state.emailId,
            "userName": this.state.userName,
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
            this.setState (
                {
                    responseStatus: resp.status
                }
            );
            if (resp.status === 200)
                document.getElementById('server-response').innerHTML = "Signup sucessful!";
            else if (resp.status === 409)
                document.getElementById('server-response').innerHTML = "User already registered with same email!";
            return resp.json();
        })
        .then ((data) =>
        {
            this.setState (
            {
                serverResponse: data
            });
        })
        .catch ((error) =>
        {
            console.log(`Error from server: ${error}`);
            
        });
    }

    render ()
    {
        return (
            <React.Fragment>
                <form onSubmit = {this.handleOnSubmitEvent}>
                <label>Email:</label><br/>
                <input 
                    type="text" 
                    value = {this.state.emailId}
                    onChange = {this.handleEmailIdChange}
                    required
                />
                <br/>
                <label>Username:</label><br/>
                <input 
                    type="text" 
                    value = {this.state.loginId}
                    onChange = {this.handleLoginIdChange}
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
                <label>Confirm Password:</label>
                <br/>
                <input 
                    type="password"
                    value = {this.state.confirmPassword}
                    onChange = {this.handleConfirmPasswordChange} 
                    required
                />
                <br/>
                <button
                    type="submit"
                    className="submit"
                >
                    Sign Up
                </button>
                <p id="server-response"></p>
                </form>
            </React.Fragment>
        );
    }
}

export default SignUpForm;