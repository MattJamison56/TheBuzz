import React, { useState, useRef, useEffect } from 'react';
import './addfavorite.css'

const AddFavoriteButton = ({ user_id, updatefavorites }) => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const formRef = useRef(null);

    const handleClickOutside = (event) => {
        if (formRef.current && !formRef.current.contains(event.target)) {
            setIsFormVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const addfavorite = async (word, user_id) => {
        try {
            const result = await fetch("http://localhost:5000/addfavorite", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ word, user_id }),
            });
        
            if (!result.ok) {
            throw new Error(`HTTP error! Status: ${result.status}`);
            }
        
            const response = await result.json();
            console.log(response)
            updatefavorites();
        } catch (error) {
            console.error("Error during fetch:", error);
        }
        };

        const handleSubmit = (event) => {
            event.preventDefault();
            const word = event.target.elements[0].value;
            setIsFormVisible(false);
            addfavorite(word, user_id);
        };


    return (
        <div ref={formRef}>
            {isFormVisible ? (
                    <form className="favoriteform" onSubmit={handleSubmit}>
                        <input type="text" placeholder="Enter Favorite..." />
                        <button className='submitbut' type="submit">Add Favorite</button>
                    </form>
            ) : (
                <button className="additem" onClick={() => setIsFormVisible(true)}>+</button>
            )}
        </div>
    );
};

export default AddFavoriteButton;
