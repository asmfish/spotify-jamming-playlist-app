const Spotify = {
    CLIENT_ID: '',
    userID: null,
    accessToken: '',
 
     getSpotifyAccessToken () {
         if (this.accessToken) {
             return this.accessToken;
         }
 
         //Check in the localStorage
         
 
         const newAccessToken = window.location.href.match(/access_token=([^&]*)/);
         const newExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
         if (newAccessToken && newExpiresIn) {
             //localStorage.setItem("tokenData", JSON.stringify({access_token: newAccessToken, expires_in: newExpiresIn}));
             this.accessToken = newAccessToken[1];
             const expiresIn = Number(newExpiresIn[1]);
             window.setTimeout(() => (this.accessToken = ''), expiresIn * 1000);
             window.history.pushState('Access Token', null, '/');
             return this.accessToken;
         } 
 
         return null;
     },
 
     isAccessTokenValid () {
         if(this.getSpotifyAccessToken())
             return true
         else
             return false;
     },
 
     redirectToSpotifyAuth () {
         const scopes = [
             'playlist-read-private',
             'playlist-modify-private',
             'playlist-modify-public'
         ];
     
         let url = 'https://accounts.spotify.com/authorize';
         let redirect_uri = "http://localhost:3000/";//uncomment this when you are working in localhost
         //let redirect_uri = "http://asmo-jammingspotify-app.surge.sh/";//uncomment this when deploying to surge.sh
         //let redirect_uri = "http://jamming-spotify-playlist.netlify.app/";//uncomment this code when deploying to Netfliy
     
         url += "?client_id=" + this.CLIENT_ID;
         url += "&response_type=token";
         url += "&redirect_uri=" + encodeURI(redirect_uri);
         url += "&show_dialog=true";
         url += "&scope=" + scopes.join('%20');
     
         window.location = url;
     },
 
     async getSpotifyUserID () {
         if (this.userID) {
             return this.userID;
         }
 
         const headers = {
             Authorization: `Bearer ${this.getSpotifyAccessToken()}`
         };
 
         //1. Get spotify userid
         await fetch('https://api.spotify.com/v1/me', { headers: headers })
             .then(
                 (response) => {
                     if (response.ok) {
                         return response.json();
                     }
                     throw new Error('Request failed! m');
                 },
                 (networkError) => {
                     console.log(networkError.message);
                 }
             )
             .then((jsonResponse) => this.userID = jsonResponse.id);
 
         return this.userID;
     },
 
     async search(searchText) {
         if(searchText === ''){
           return [];
         }
 
         const searchParameters = {
           method: 'GET',
           headers: {
             'Content-Type': 'application/json',
             'Authorization': 'Bearer ' + this.getSpotifyAccessToken()
           }
         }
     
         return await fetch(
           "https://api.spotify.com/v1/search?q=" + searchText + "&type=track&limit=20", searchParameters)
           .then((response) => response.json())
           .then((data) => data.tracks.items)
           .catch(() => [])
     },
 
     async savePlaylist(playlistName, trackURIs) {
         if (playlistName.trim().length === 0 || trackURIs.length === 0) {
             return 'Please check playlist name or tracks are added.';
         }
 
         const headers = {
             Authorization: `Bearer ${this.getSpotifyAccessToken()}`
         };
 
         let userID;
         let playlistID;
 
         //1. Get spotify userid
         userID = await this.getSpotifyUserID();
 
         //2. get id of the created playlist
         await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                 method: 'POST',
                 headers: headers,
                 body: JSON.stringify({ name: playlistName })
             })
             .then(
                 (response) => {
                     if (response.ok) {
                         return response.json();
                     }
                     throw new Error('Request failed!');
                 },
                 (networkError) => {
                     console.log(networkError.message);
                 }
             )
             .then((jsonResponse) => playlistID = jsonResponse.id);
         
         //3. add the tracks to the new playlist
         return await fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
                 method: 'POST',
                 headers: headers,
                 body: JSON.stringify({ uris: trackURIs })
             })
             .then(
                 (response) => {
                     if (response.ok) {
                         return response.json();
                     }
                     throw new Error('Request failed!');
                 },
                 (networkError) => {
                     console.log(networkError.message);
                 }
             )
             .then((jsonResponse) => jsonResponse);
     },
 
     async getUserPlayLists () {
         const headers = {
             'Content-Type': 'application/json',
             'Authorization': 'Bearer ' + this.getSpotifyAccessToken()
         };
         
         let userID;
 
         //1. Get spotify userid
         userID = await this.getSpotifyUserID();
         
         //2. get id of the created playlist
         const requestParameters = {
             method: 'GET',
             headers: headers
           }
 
           return await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, requestParameters)
             .then((response) => response.json())
             .then((data) => data.items)
             .catch(() => [])
     },
 
     async updatePlayList (playListName, selectedPlayList, existingPlayListTracks, newPlayListTracks) {
         const removedTracksURIs = existingPlayListTracks.filter((elem) => !newPlayListTracks.find(({ id }) => elem.id === id)).map(track => "spotify:track:" + track.id);
         const newAddedTracksURIs = newPlayListTracks.filter((elem) => !existingPlayListTracks.find(({ id }) => elem.id === id)).map(track => "spotify:track:" + track.id);
         
         const headers = {
             'Content-Type': 'application/json',
             'Authorization': `Bearer ${this.getSpotifyAccessToken()}`
         };
         
         //let userID;
         let playListId = selectedPlayList.id;
 
         //1. Get spotify userid
         //userID = await this.getSpotifyUserID();
 
         //Check if playList name changed
         if(selectedPlayList.name !== playListName){
             //2. Update name of the selected playlist
             const requestOptions = {
             method: 'PUT',
             headers: headers,
             body: JSON.stringify({ name: playListName })
             };
 
             await fetch(`https://api.spotify.com/v1/playlists/${playListId}`, requestOptions)
             .then(response => {
                 return response
             });
         }
 
         //Check if new tracks are added
         if(newAddedTracksURIs.length > 0){
             const requestBody = {
                 uris: newAddedTracksURIs,
                 position: 0
             }
 
             const requestOptions = {
             method: 'POST',
             headers: headers,
             body: JSON.stringify(requestBody)
             };
 
             await fetch(`https://api.spotify.com/v1/playlists/${playListId}/tracks`, requestOptions)
             .then(response => {
                 return response
             })
         }
 
         //Check if existing tracks are removed
         if(removedTracksURIs.length > 0){
             const requestBody = {
                 tracks: removedTracksURIs.map(trackUri => ({uri: trackUri})),
                 snapshot_id: selectedPlayList.snapshot_id
             }
             
             const requestOptions = {
             method: 'DELETE',
             headers: headers,
             body: JSON.stringify(requestBody)
             };
 
             await fetch(`https://api.spotify.com/v1/playlists/${playListId}/tracks`, requestOptions)
             .then(response => {
                 return response
             })
         }
     },
 
     async getPlayListTracks (playlist_id) {
         const headers = {
             'Content-Type': 'application/json',
             'Authorization': 'Bearer ' + this.getSpotifyAccessToken()
         };
         
         //Get all tracks based on playlist id
         const requestParameters = {
             method: 'GET',
             headers: headers
           }
 
           return await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, requestParameters)
             .then((response) => response.json())
             .then((data) => data.items)
             .catch(() => [])
     }
 }
 
 export default Spotify;