import React, { useState } from 'react';
import './SearchBar.module.css';

function SearchBar({handleSearch}){
    const [searchText, setSearchText] = useState('');

    const handleSubmit = (e) =>{
        e.preventDefault();
        handleSearch(searchText);
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" name="searchInput" onChange={(e) => setSearchText(e.target.value)}/> 
                <input type="submit" value="Search" />
            </form>
        </div>
    );
}

export default SearchBar;