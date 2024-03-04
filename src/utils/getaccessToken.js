function getAccessToken() {
    alert('token')
    let url = 'https://accounts.spotify.com/api/token';
    let redirect_uri = "http://localhost:3000/";
    let token = '';

    //after getting the authorization code then we can get the access token
    let code = null;
    let queryStr = window.location.search;
    if(queryStr.length > 0){
        const urlParams = new URLSearchParams(queryStr);
        code = urlParams.get("code");
    }

    let body = "grant_type=authorization_code";
    body += "&code=" + code;
    body += "&redirect_uri=" + encodeURI(redirect_uri);
    body += "&client_id=" + this.CLIENT_ID;
    body += "&client_secret=" + this.CLIENT_SECRET;

    //API Access token
    var authParameters = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(this.CLIENT_ID + ':' + this.CLIENT_SECRET)
    },
    body: body
    }

    return  fetch(url, authParameters)
    .then(response => response.json())
    .then(data => data);
}