import React, { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SearchResults from "./components/SearchResults";
import CustomPlayList from "./components/CustomPlayList";
import appStyles from './css/App.module.css';
import Spotify from "./utils/spotify";

const CLIENT_ID = 'f4017d8013bc4689b13730a6d0b6112d';
const CLIENT_SECRET = '0e3ab9dafecc4d26b32463644b307ee7';

function App() {
  const [searchData, setSearchData] = useState([]);
  const [customPlayList, setCustomPlayList] = useState([]);
  const [accessToken, setAccessToken] = useState('');

  /*useEffect(() =>{
    //API Access token
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials' + '&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }
    fetch('https://accounts.spotify.com/api/token', authParameters)
    .then(response => response.json())
    .then(data => setAccessToken(data.access_token))
  }, []);*/

  const handleSearch = async (searchText) =>{
    Spotify.handleSearch(searchText)
    .then(data => setSearchData(data));
  }

  const removeFromPlayList = (songIdToRemove) =>{
    setCustomPlayList((prev) => prev.filter(
      (song) => song.id !== songIdToRemove
    ));
  }

  const addToPlayList = (trackId) =>{
    //Here we need to find the item from search data and add it to the playlist array
    const song = searchData.find(track => track.id === trackId);

    //Check if song is already inside playlist, check for undefined cz all items might have been removed
    if(customPlayList !== undefined && customPlayList.indexOf(song) === -1){
      setCustomPlayList((prev) => setCustomPlayList([...prev, song]));
    }
  }

  const savePlayListToSpotify = async (playlistName) => {
    const trackURIs = customPlayList.map(track => track.uri);

    let userId;
    let playlistId;
    const headers = { Authorization: `Bearer ${accessToken}` };
        //console.log(trackURIs);
        console.log(accessToken);

        const userInfo = await  fetch('https://api.spotify.com/v1/me', { headers: headers }
        ).then(response => response.json()
        ).then(jsonResponse => userId = jsonResponse.id);

        const playLists = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ name: playlistName })
            }).then(response => response.json()
            ).then(jsonResponse => playlistId = jsonResponse.id);

            fetch(`­https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
            {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ uris: trackURIs }) 
            })





        return;

        const api = await  fetch('https://api.spotify.com/v1/me', { headers: headers }
        ).then(response => response.json()
        ).then(jsonResponse => {
            userId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ name: playlistName })
            }).then(response => response.json()
            ).then(jsonResponse => {
                const playlistId = jsonResponse.id;
                return fetch(`­https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
                    {
                        headers: headers,
                        method: 'POST',
                        body: JSON.stringify({ uris: trackURIs }) 
                    })
            })
        });

        return;



    if (playlistName && trackURIs.length) {
			/*const headers = {
				Authorization: `Bearer ${accessToken}`
			};*/

      const headers = {
        //'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
			let userID;
			let playlistID;

      //My Test
      const yy = await fetch('https://api.spotify.com/v1/me', { headers: headers })
      .then(response => response.json())
      .then(data => alert(data))

      return;

			const xx = await fetch('https://api.spotify.com/v1/me', { withCredentials: true, headers: headers })
				.then(
					(response) => {
						if (response.ok) {
              alert(response.json())
							return response.json();
						}
            console.log(response)
						//throw new Error('Request failed!');
					},
					(networkError) => {
						console.log('ERRO', networkError.message);
					}
				)
				.then((jsonResponse) => {
          console.log('XX:',jsonResponse)
					userID = jsonResponse.id;
          alert('userID', userID)
					return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
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
						.then((jsonResponse) => {
							playlistID = jsonResponse.id;
							return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
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
						});
				});
		} else {
			return;
		}
	}

  const logIn = () =>{
    Spotify.getAccessToken();
  }

  const logOut = () =>{
    setAccessToken('');
  }

  const getAccessToken = () =>{
    let url = 'https://accounts.spotify.com/api/token';
    let redirect_uri = "http://localhost:3000/";
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
    body += "&client_id=" + CLIENT_ID;
    body += "&client_secret=" + CLIENT_SECRET;
  
     //API Access token
     var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
      },
      body: body//'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }
    fetch(url, authParameters)
    .then(response => response.json())
    .then(data => setAccessToken(data.access_token))
  }

  async function savePlaylist2(playlistName) {
    
    const trackURIs = customPlayList.map(track => track.uri);
    /*let userId;
    let playlistId;
    const headers = { Authorization: `Bearer ${accessToken}` };
        //console.log(trackURIs);
        console.log(accessToken);

        const userInfo = await  fetch('https://api.spotify.com/v1/me', { headers: headers }
        ).then(response => response.json()
        ).then(jsonResponse => userId = jsonResponse.id);

        const playLists = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ name: playlistName })
            }).then(response => response.json()
            ).then(jsonResponse => console.log('PlayLists:', jsonResponse));*/

    //alert(JSON.stringify({ uris: trackURIs })); return;
    if (playlistName && trackURIs.length) {
			const headers = {
				Authorization: `Bearer ${accessToken}`
			};
			let userID;
			let playlistID;
			const tt = await fetch('https://api.spotify.com/v1/me', { headers: headers })
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
				.then((jsonResponse) => {
					userID = jsonResponse.id;
					return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
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
						.then((jsonResponse) => {
							playlistID = jsonResponse.id;
              //alert(playlistID)
							return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
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
						});
				});
		} else {
			return;
    }
		
	}

  async function savePlaylist(playlistName) {
    const trackURIs = customPlayList.map(track => track.uri);
    if (playlistName && trackURIs.length) {
			const headers = {
				Authorization: `Bearer ${accessToken}`
			};
			let userID;
			let playlistID;
			const userInfo = await fetch('https://api.spotify.com/v1/me', { headers: headers })
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
				.then((jsonResponse) => userID = jsonResponse.id);
        
       const playlists = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
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
						.then((jsonResponse) => {
              console.log('', jsonResponse);
              return playlistID = jsonResponse.id
            });
            
            console.log('UserID', userID);
            console.log('PlayListID:',playlistID);
            
            const svaeTracks = fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
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
								.then((jsonResponse) => console.log('Last:', jsonResponse));
		} else {
			return;
    }
		
	}




  return (
    <div className={appStyles.app}>
      <Header />
      <SearchBar handleSearch={handleSearch} />
      <div className={appStyles.flexContainer}>
        <div className={appStyles.flexItem}>
          <SearchResults searchData={searchData} addToPlayList={addToPlayList} />
        </div>
        <div className={appStyles.flexItem}>
          <CustomPlayList customPlayList={customPlayList} removeFromPlayList={removeFromPlayList} savePlayListToSpotify={savePlaylist}/>
        </div>
      </div>
      <button onClick={logIn}>Log IN</button><button onClick={logOut}>Log Out</button>
      <Footer />
    </div>
  );
}

export default App;
