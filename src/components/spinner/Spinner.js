import React from 'react';
import {Circles} from 'react-loader-spinner';

function Spinner () {

    const style = {
        margin: 'auto'
    }

    return (
        <div style={style}>
            <Circles color="#00BFFF" height={50} width={50}/>
        </div>
    )
}

export default Spinner;