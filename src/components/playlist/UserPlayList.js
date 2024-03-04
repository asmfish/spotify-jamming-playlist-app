import React from "react";
import styles from './UserPlayList.module.css';

function UserPlayList({userPlayList, setSelectedPlayList, showNewPlaylistForm}){

    return(
        <div className={styles.resultContainer}>
            <div className={styles.header}>
                <span className={styles.title }>User playLists: {userPlayList.length}</span>
                <button onClick={showNewPlaylistForm} className={styles.btnCreateNewPlaylist}>+ Create New</button>
            </div>
            <hr />
            {
                userPlayList && userPlayList.map((playlist, index) => {
                    return (
                        <div className={styles.item} key={index} onClick={() => setSelectedPlayList(playlist)}>
                            <span className={styles.playListName}>{playlist.name}</span><br/>
                            <span>Total Tracks: {playlist.tracks.total}</span><br />
                            <span>Owner: {playlist.owner.display_name}</span>
                        </div>
                    )
                })
                
            }
        </div>
    );
}

export default UserPlayList;