import React, {Component} from 'react';
import '../style.css'
import DeleteButton from './delete-button';
import PostFeed from './post-feed';

class HomePage extends Component
{
    constructor (props)
    {
        super (props);
        this.state = 
        {
            userId: '34159033-8151-412a-b568-cba0db460fa3',
            location: '',
            feeds: [],
            responseStatus: 0,
            ipAddress: ''
        }
        this.getCountryName = this.getCountryName.bind (this);
        this.getFeeds = this.getFeeds.bind (this);
    }

    async getIpAddress ()
    {
        try
        {
            let response = await fetch ("https://api.ipify.org?format=json");
            if (response.ok)
            {
                let data = await response.json();
                if (data.ip !== undefined)
                {
                    this.setState (
                        {
                            ipAddress : data.ip
                        }
                    );
                }
            }
        }
        catch (error)
        {
            console.log(error);
        }
    }

    async getCountryName ()
    {
        let options = 
        {
            mode: 'cors'
        }
        let url = `https://api.ipgeolocationapi.com/geolocate/${this.state.ipAddress}?format=json`;
        //let response = await fetch ("http://ip-api.com/json/");
        let response = await fetch (url, options);
        try
        {
            if (response.ok)
            {
                let data = await response.json();
                let country = '';
                if (data.name !== undefined)
                    country = data.name;
                this.setState
                (
                    {
                        location: country
                    }
                );
                console.log(`getCountryName: server response = ${response.status}`);
            }
            else
            {
                console.log(response);
                console.log(`getCountryName: server response = ${response.status}`);
            }
        }
        catch (error)
        {
            console.log(error);
        }
    }

    async getFeeds ()
    {
        try
        {
            let response = await fetch("http://localhost:3001/feeds/get-feeds");
            if (response.ok)
            {
                let data = await response.json ();
                this.setState
                (
                    {
                        responseStatus: response.status
                    }
                );
                if (response.status === 500)
                    document.getElementById('output').innerHTML = "Internal server error!";
                
                this.setState 
                (
                    {
                        feeds: data.feeds,
                    }
                );
                console.log(`getFeeds: server response = ${response.status}`);
            }
        }
        catch (error)
        {
            console.log(error);
        }
    }

    async componentDidMount ()
    {
        try
        {
            await this.getIpAddress();
            await this.getFeeds ();
            await this.getCountryName ();
        }
        catch (error)
        {
            console.log(error);
        }
    }

    render ()
    {
        return (
            <React.Fragment>
                <div>
                    <div>
                        <PostFeed/>
                    </div>
                    {this.state.feeds.map (data =>
                        (
                            <div className="show_feed_div" key={data.feedId}>
                                <span className="location">
                                    {this.state.location}
                                </span>
                                
                                <span className="user_name">{data.content}</span>
                                {(data.userId === this.state.userId) ? 
                                 <DeleteButton style={{float:'right'}} name="Delete" feedId={data.feedId} onClick={this.componentDidCatch}/> :
                                 <span></span>}
                                 <br/>
                                 <hr/>
                            </div>
                        ))}
                </div>
                <p id="output">
                </p>
            </React.Fragment>    
        );
    }
}

export default HomePage