import React, { useState, useEffect } from "react";
import SearchBar from "../searchbar/SearchBar";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import SearchResults from "../searchresults/SearchResults";
import NewPlayList from "../playlist/NewPlayList";
import UserPlayList from "../playlist/UserPlayList";
import LoginForm from "../loginform/LoginForm";
import appStyles from './App.module.css';
import Spotify from "../../utils/spotify";
import Spinner from "../../components/spinner/Spinner";

function App() {
  const [searchData, setSearchData] = useState([]);
  const [newPlayListTracks, setNewPlayListTracks] = useState([]);
  const [userPlayList, setUserPlayList] = useState([]);
  const [isLoading, setIsLoading] = useState('');
  const [selectedPlayList, setSelectedPlayList] = useState(null);
  const [existingPlayListTracks, setExistingPlayListTracks] = useState([]);

  useEffect(() =>{
    if(Spotify.isAccessTokenValid()){
      setIsLoading('UserPlayList');
      Spotify.getUserPlayLists()
      .then((data) => {
        setIsLoading('');
        setUserPlayList(data)
      })
      .catch((error) => {
        console.log('Error:', error);
        setIsLoading('');
      });;
    }
  }, []);

  useEffect(() => {
      if(selectedPlayList){
        Spotify.getPlayListTracks(selectedPlayList.id)
        .then((data) => {
          console.log('Tracks:', data);
          setNewPlayListTracks(data.map(tData => tData.track));
          setExistingPlayListTracks(data.map(tData => tData.track));
        })
        .catch((error) => {
          console.log('Error:', error);
        });
      }
  }, [selectedPlayList]);

  const addToPlayList = (trackId) =>{
    //Here we need to find the item from search data and add it to the playlist array
    const song = searchData.find(track => track.id === trackId);

    //Check if song is already inside playlist, check for undefined cz all items might have been removed
    if(newPlayListTracks !== undefined && newPlayListTracks.indexOf(song) === -1){
      setNewPlayListTracks((prev) => setNewPlayListTracks([...prev, song]));
    }
  }

  const removeFromPlayList = (songIdToRemove) =>{
    setNewPlayListTracks((prev) => prev.filter(
      (song) => song.id !== songIdToRemove
    ));
  }

  const handleSearch = async (searchText) =>{
    if(searchText === ''){
      setSearchData([]);
      return;
    }

    setIsLoading('SearchResults');
    await Spotify.search(searchText)
    .then(data => {
      console.log('search:', data)
      setSearchData(data);
      setIsLoading('');
    })
    .catch((error) => {
      console.log('Error:', error);
      setIsLoading('');
    });
  }

  const createPlaylist = async (playlistName) => {
    const trackURIs = newPlayListTracks.map(track => track.uri);
    
    setIsLoading('NewPlayList');
    Spotify.savePlaylist(playlistName, trackURIs)
    .then(data => {
      //console.log(data);
      //setIsLoading('UserPlayList');
      Spotify.getUserPlayLists()
      .then((data) => {
        //setIsLoading('');
        setUserPlayList(data);
      });
      setIsLoading('');
      setNewPlayListTracks([]);
    })
    .catch((error) => {
      console.log('Error:', error);
      setIsLoading('');
    });
	}

  const updatePlayList = (playListName) =>{
   
    Spotify.updatePlayList(playListName, selectedPlayList, existingPlayListTracks, newPlayListTracks)
    .then((data) => {
      setIsLoading('UserPlayList');
      Spotify.getUserPlayLists()
      .then((data) => {
        setIsLoading('');
        setUserPlayList(data);
      })
      .catch((error) => {
        console.log('Error:', error);
        setIsLoading('');
      });
    })

    showNewPlaylistForm();
  }

  const showNewPlaylistForm = () =>{
    setSelectedPlayList(null);
    setNewPlayListTracks([]);
    setExistingPlayListTracks([]);
  }


  return (
    <div className={appStyles.app}>
      <Header />
      {!Spotify.isAccessTokenValid() && <LoginForm />}
      { Spotify.isAccessTokenValid() && <div>
        
        <div className={appStyles.flexContainer}>
          <div className={appStyles.flexItem} id="userPlayList">
            { isLoading === 'UserPlayList'? <Spinner />
              : 
              <UserPlayList 
                userPlayList={userPlayList} 
                setSelectedPlayList={setSelectedPlayList}
                showNewPlaylistForm={showNewPlaylistForm}
              />
            }
          </div>
          <div className={appStyles.flexItem}>
            { isLoading === 'NewPlayList'? <Spinner />
              : 
              <NewPlayList 
                newPlayListTracks={newPlayListTracks} 
                removeFromPlayList={removeFromPlayList} 
                createPlaylist={createPlaylist} 
                updatePlayList={updatePlayList}
                selectedPlayList={selectedPlayList}
                existingPlayListTracks={existingPlayListTracks}
              />
            }
          </div>
          <div className={appStyles.flexItem}>
          <SearchBar handleSearch={handleSearch} />
            { isLoading === 'SearchResults'? <Spinner />
            : <SearchResults searchData={searchData} addToPlayList={addToPlayList} />
            }
          </div>
        </div>
      </div>
      }
      <Footer />
    </div>
  );
}

export default App;
