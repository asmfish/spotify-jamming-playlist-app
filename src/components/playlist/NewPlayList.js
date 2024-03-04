import React, { useEffect, useState } from "react";
import styles from '../searchresults/SearchResults.module.css';

function NewPlayList({newPlayListTracks, removeFromPlayList, selectedPlayList, createPlaylist, updatePlayList}){
    const [playListName, setPlayListName] = useState('');

    useEffect(() =>{
        setPlayListName(selectedPlayList? selectedPlayList.name: 'New playList');
    }, [selectedPlayList]);

    const savePlayLisData = () =>{
        if(selectedPlayList){
            updatePlayList(playListName)
        }
        else{
            createPlaylist(playListName);
        }
    }

    const inputStyle = {
        width: '100%'
    }

    return(
        <div className={styles.resultContainer}>
            <h3 className={styles.title }>{selectedPlayList ? 'Selected playList: '+  selectedPlayList.name : 'New playList'}</h3>
            <div className={styles.item}>Playlist name: <input style={inputStyle} type="text" onChange={(e) => setPlayListName(e.target.value)} value={playListName}/></div>
            {
                newPlayListTracks && newPlayListTracks.map((track, index) => {
                    return (
                        <div className={styles.item} key={index}>
                            
                            <span key={index} className={styles.highlight}>{track.name}</span>
                            <span>{track.artists[0].name} | {track.album.name}</span>
                            <button className={styles.btnRemoveFromPlayList} onClick={() => removeFromPlayList(track.id)}>-</button>
                        </div>
                    )
                })
                
            }

            <button className={styles.btnSavePlayList} onClick={savePlayLisData} disabled={ (newPlayListTracks && newPlayListTracks.length > 0) || selectedPlayList ? false: true} >
                {selectedPlayList ? 'UPDATE PLAYLIST' : 'SAVE TO SPOTIFY'}
            </button>
        </div>
    );
}

export default NewPlayList;