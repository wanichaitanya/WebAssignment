import React, {Component} from 'react';
import '../style.css'

class PostFeed extends Component
{
    constructor (props)
    {
        super (props);
        this.state = 
        {
            content: '',
            userId: 'bf0b0d35-b9b7-448f-b204-6fb7b8d34acf',
            location: '',
            isLocationDataLoaded: false,
        }
    }

    componentDidMount ()
    {
        // const url = "http://ip-api.com/json/";
        // fetch(url)
        // .then((response) => response.json())
        // .then ((data) =>
        // {
        //     this.setState(
        //         {
        //             location:data.country,
        //             isLocationDataLoaded: true
        //         }
        //     );
        // })
        // .catch ((error) =>
        // {
        //     console.log(error);
        // });
    }

    handleOnChangeEvent = (event) =>
    {
        document.getElementById('server-response').innerHTML = "";
        this.setState (
            {
                content: event.target.value
            }
        );
    }

    handleOnSubmitEvent = (event) =>
    {
        event.preventDefault ();
        if (this.state.content === '')
        {
            document.getElementById('server-response').innerHTML = "Mandatory fields are missing!";
            return;
        }
        
        const url = "http://localhost:3001/feeds/create-feed";
        var user_info =
        {  
            "content": this.state.content,
            "location": this.state.location,
            "userId": this.state.userId
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
            if (resp.status === 409)
                document.getElementById('server-response').innerHTML = "Invalid User ID!";
            else if (resp.status === 422)
                document.getElementById('server-response').innerHTML = "Mandatory fields are missing!";
            return resp.json();
        })
        .then ((data) =>
        {
            this.setState (
            {
                serverResponse: data
            });
            console.log(data);
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
                <div className="new-feed-div">
                    <input 
                        type="text"
                        placeholder="Post a feed"
                        onChange = {this.handleOnChangeEvent}
                        required/>
                    <br/>
                    <button
                        type="submit"
                        className="submit"
                    >
                        Post
                    </button>
                    <p id="server-response">
                    </p>
                    <br/>
                </div>
                </form>
            </React.Fragment>
        );
    }
}

export default PostFeed