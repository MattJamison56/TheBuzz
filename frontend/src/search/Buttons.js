import React, { useState, useEffect } from 'react';
import './Buttons.css';

function Categorybut({ category, buttonClicked }){
    if (category){
        return <button className="catbut" onClick={ buttonClicked }>{ category }</button>;
    }
    else
    {
        return null
    }
}

function Buttons(props){
    const initialCategories = ['General', 'Technology', '...'];
    const [uniqueCategories, setUniqueElements] = useState(initialCategories);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (props.searchBar) {
          setInputValue('');
        }
      }, [props.searchBar]);

    function handleClick(category) {
        const moreCategories = initialCategories.slice();
        if (category !== "..." && category !== "<")
        {
            sendCategoryToApp(category);
            return
        }
        if (category === "...") {
            moreCategories.splice(moreCategories.length-1);
            moreCategories.push("Business");
            moreCategories.push("Health");
            moreCategories.push("Science");
            moreCategories.push("Sports");
            moreCategories.push("Entertainment");
            moreCategories.push("<");
        }
        else if (category === "<") {
            moreCategories.splice(moreCategories.length-1);
            moreCategories.push('...');
        }
        setUniqueElements(moreCategories);
    }

    
    const sendCategoryToApp = async (category) => {
        const newData = category;
        props.setCategoryFromButtons(newData);
      } 
    
    const handleFormSubmit = async (category) => {
        props.setSearchFromButtons(category);
    }

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
        }


    return (
        <div className={`search-container ${props.searchBar ? 'fade' : 'fade-in'}`}>
            <form className="search-bar-form" onSubmit={(e) => { e.preventDefault(); handleFormSubmit(inputValue); }}>
                <input type="text" className="search-bar" placeholder="Enter a keyword..." onChange={handleInputChange} value={inputValue}/>
            </form>
            <div className="Buttons">
                {uniqueCategories.map((category, index) => (
                <Categorybut key={index} category={category} buttonClicked={() => handleClick(category)} />
            ))}
            </div>
        </div>
      );
    }
    
export default Buttons;
