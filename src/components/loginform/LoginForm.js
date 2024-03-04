import React, { useState } from "react";
import Spotify from "../../utils/spotify";
import styles from './LoginForm.module.css';

const LoginForm = () =>{
    const [clientId, setClientId] = useState(Spotify.CLIENT_ID);
    const [clientSecret, setClientSecret] = useState(Spotify.CLIENT_SECRET);

    const handleSubmit = (e) =>{
        e.preventDefault();

        //Set the spotify client_id and client_secret
        Spotify.CLIENT_ID = clientId;
        Spotify.clientSecret = clientSecret;

        const accessToken = Spotify.getSpotifyAccessToken();
        console.log('access_toke:' + accessToken);
        if(accessToken){
            //save it to parent state or local storage
        }
        else{
            Spotify.redirectToSpotifyAuth();
        }
    }
    

    return (
        <>
            <form onSubmit={handleSubmit} className={styles.loginForm} >
                <label htmlFor="clientId" className={styles.inputLabel}>User Name:</label>
                <input 
                    type="text" 
                    name="clientId" 
                    id="clientId"
                    value={clientId} 
                    onChange={(e) => setClientId(e.target.value)} 
                    className={styles.inputText}
                /> <br />
                <label htmlFor="clientSecret" className={styles.inputLabel}>User Pass:</label> 
                <input 
                    type="text" 
                    name="clientSecret" 
                    id="clientSecret"
                    value={clientSecret} 
                    onChange={(e) => setClientSecret(e.target.value)} 
                    className={styles.inputText}
                /> <br />
                <input type="submit" value="Login" className={styles.btnLogin}/>
            </form>
        </>
    );
}

export default LoginForm;