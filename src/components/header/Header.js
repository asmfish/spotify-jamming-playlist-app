import React from 'react';
import styles from './Header.module.css';

function Header(){

    return (
        <div>
            <h1 className={styles.mainTitle}>Jamming Spotify Playlist APP</h1>
            <p className={styles.info } >You can search for any song and add it to a new or existing playlist.</p>
        </div>
    );
}

export default Header;