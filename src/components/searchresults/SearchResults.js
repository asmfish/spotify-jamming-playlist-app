import React from "react";
import styles from './SearchResults.module.css';

function SearchResults ({searchData, addToPlayList}){
    
    return(
        <div className={styles.resultContainer}>
            <h3 className={styles.title}>Search Results: {searchData.length} tracks found</h3>
                {
                    searchData.map((track, index) => {
                        return (
                            <div className={styles.item} key={index}>
                                <span key={index} className={styles.highlight}>{track.name}</span><br/>
                                <span>{track.artists[0].name} | {track.album.name}</span>
                                <button className={styles.btnAddToPlayList} onClick={() => addToPlayList(track.id)}>+</button>
                            </div>
                        )
                    })
                 
                }
        </div>
    );
}

export default SearchResults;