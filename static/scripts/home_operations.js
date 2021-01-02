async function onLoadPerformTasks (userid)
{
    const url = "http://127.0.0.1:5000/get_data";
    let user_info =
    {  
        "user_id": userid
    }
    
    let options =
    {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(user_info)
    }

    let response = await fetch(url, options);
    
    if (response.ok)
    { 
        let json_data = await response.text();
        data = JSON.parse (json_data)
        var div = document.createElement('div');
        var home_form = document.getElementById('home_form');
        div.id = 'show_feed_div';
        div.innerHTML = data['Key'];
        div.className = 'border pad';
        home_form.appendChild (div);
    }
}

/*========================================================================================*/
