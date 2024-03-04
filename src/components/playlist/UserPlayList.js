import React from "react";
import styles from './UserPlayList.module.css';

function UserPlayList({userPlayList, setSelectedPlayList, showNewPlaylistForm}){

    return(
        <div className={styles.resultContainer}>
            <h3 className={styles.title }>User PlayLists: {userPlayList.length}</h3>
            <button onClick={showNewPlaylistForm}>+ Create New Playlist</button>
            {
                userPlayList && userPlayList.map((playlist, index) => {
                    return (
                        <div className={styles.item} key={index}>
                            <button className={styles.playList} onClick={() => setSelectedPlayList(playlist)}>{playlist.name}</button> <br/>
                            <span className={styles.tracksTotal}>Total Tracks: {playlist.tracks.total}</span><br />
                            <span className="">Owner: {playlist.owner.display_name}</span>
                        </div>
                    )
                })
                
            }
        </div>
    );
}

export default UserPlayList;