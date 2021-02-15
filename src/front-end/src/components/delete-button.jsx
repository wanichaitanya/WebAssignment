import React, {Component} from 'react';
import '../style.css';

class DeleteButton extends Component
{
    handleOnClickEvent = async (event) =>
    {
        event.preventDefault ();
        const url = "http://localhost:3001/feeds/delete-feed";
        var user_info =
        {  
            "feedId": this.props.feedId
        }
        
        var options =
        {
            method: 'DELETE',
            headers:
            {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(user_info)
        }
    
        try
        {
            let response = await fetch(url, options);

            if (response.status === 204)
                document.getElementById('server-response').innerHTML = await response.json();
        }
        catch (error)
        {
            console.log(`Error from server: ${error}`);
            
        }
    }
    render ()
    {
        return (
            <React.Fragment>
                <button className="button" onClick = {this.handleOnClickEvent}>
                    {this.props.name}
                </button>
                <p id="server-response"/>
            </React.Fragment>
        );
    }
}

export default DeleteButton;