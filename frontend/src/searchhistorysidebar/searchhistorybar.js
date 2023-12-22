import React, { useState, useEffect } from 'react';
import './searchbarhistory.css';
import AddFavoriteButton from './addfavoritebutton/addfavorite';

function SearchHistorybut({ item, buttonClicked, histDeleted }) {
    if (item) {
        return (
        <div className="theButtons">
        <button className="searchhistoryitem" onClick={buttonClicked}>{item}</button>
        <button className="deletebut" onClick={histDeleted}>X</button>
        </div>
        );
    }
    else {
        return null;
    }
}
  
  function Favoritebut({ item, buttonClicked, favDeleted }) {
    if (item) {
    return (
        <div className="theButtons">
        <button className="searchhistoryitem" onClick={buttonClicked}>{item}</button>
        <button className="deletebut" onClick={favDeleted}>X</button>
        </div>
    );
    }
    else {
        return null;
    }   
}

function SearchHistory({ user_id, setSearchFromHistory, searchHistory }) {
    const [isContainerOpen, setIsContainerOpen] = useState(false);
    const [favoriteitems, setFavoriteItems] = useState(['Item 1', 'Item 2', 'Item 3']);
    const [historyitems, setHistoryItems] = useState(['Item 1', 'Item 2', 'Item 3']);
    const [caret, setCaretDirection] = useState('▶');

    
    useEffect(() => {
        const searchhistory = async () => {
            try {
                if (user_id === undefined) return;
                const result = await fetch("http://localhost:5000/searchhistory", {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ user_id }),
                });
         
              if (!result.ok) {
                throw new Error(`HTTP error! Status: ${result.status}`);
              }
         
              const response = await result.json();
              setHistoryItems(response);
              favorites();
            }
            catch (error) {
                console.error("Error during fetch:", error);
                console.log("historyfail")
                setHistoryItems([]);
            }
        }
        
            if (user_id !== undefined) {
                searchhistory();
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [user_id, searchHistory]);

        const favorites = async () => {
            try {
                const result = await fetch("http://localhost:5000/favorites", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_id }),
                });
            
                if (!result.ok) {
                throw new Error(`HTTP error! Status: ${result.status}`);
                }
            
                const response = await result.json();
                setFavoriteItems(response);
            }
            catch (error) {
                console.error("Error during fetch:", error);
                console.log("favoritefail")
                setFavoriteItems([]);
            }
        }

    const toggleContainer = () => {
        setIsContainerOpen(!isContainerOpen);
        if (caret === '▶') {
            setCaretDirection('◀')
        }
        else {
            setCaretDirection('▶')
        }
    };
    
    const handleClick = async (item) => {
        setSearchFromHistory(item);
    }

    const handleFavoriteUpdate = () => {
        favorites();
    }

    const favDelete = async (item) => {
        //Make fetch to delete item
        try {
            const result = await fetch("http://localhost:5000/deletefav", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ item, user_id }),
            });
        
            if (!result.ok) {
            throw new Error(`HTTP error! Status: ${result.status}`);
            }
        
            const response = await result.json();
            console.log(response)
            setFavoriteItems(favoriteitems.filter(favItem => favItem !== item));
        }
        catch (error) {
            console.error("Error during fetch:", error);
        }
    }
    

    const histDelete = async (item) => {
        //Make fetch to delete item
        try {
            const result = await fetch("http://localhost:5000/deletehist", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ item, user_id }),
            });
        
            if (!result.ok) {
            throw new Error(`HTTP error! Status: ${result.status}`);
            }
        
            const response = await result.json();
            console.log(response)
            setHistoryItems(historyitems.filter(historyItem => historyItem !== item));
        }
        catch (error) {
            console.error("Error during fetch:", error);
        }
    }
    

    return (
        <div className="daddycontainer">
            <div className= {`container ${isContainerOpen ? 'open' : ''}`}>
                <h3 className="titletop">Favorites</h3>
                {favoriteitems.map((item, index) => (
                    <Favoritebut key={index} item={item} buttonClicked={() => handleClick(item)} favDeleted={() => favDelete(item)}/>
                ))}
                <AddFavoriteButton user_id={user_id} updatefavorites={ handleFavoriteUpdate }/>
                <h3 className="title">Search History</h3>
                {historyitems.map((item, index) => (
                    <SearchHistorybut key={index} item={item} buttonClicked={() => handleClick(item)} histDeleted={() => histDelete(item)}/>
                ))}
            </div>
            <button className={`caret-btn ${caret === '▶' ? '' : 'left'}`} onClick={ toggleContainer }>{caret}</button>
        </div>
    );
}

export default SearchHistory