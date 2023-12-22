import React, { useState, useEffect } from 'react';
import './App.css';
import Buttons from './search/Buttons.js';
import Summaries from './summary/Summaries.js';
import Signin from './login-register/Signin.js';
import Signout from './login-register/Signout.js';
import SearchHistory from './searchhistorysidebar/searchhistorybar.js'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WebsiteTitle from './homebackground/website-title/website-title.js';
import LoadingSymbol from './homebackground/loadingsymbol/loading.js';

function App() {
  const [summaryList, setSummaryList] = useState("");
  const [linkList, setLinkList] = useState("");
  const [searchBarVisibility, setSearchBarVisibility] = useState(false);
  const [user_ID, setUserID] = useState("");
  const [searchHistory, setSearchHistory] = useState(true);
  const [loadingState, setLoadingState] = useState("notloading");

  const toastConfig = {
    position: "top-center", // Set the position to top-center
    autoClose: 2000, // Adjust the duration as needed
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

  const handleError = (error) => {
    toast.error(String(error));
  }

  useEffect(() => {
    // This will run every time user_ID changes
    console.log("UserID: " + user_ID);
  }, [user_ID]);


  const handleNotification = (message) => toast(message);

  const handleLogin = (user_id) => {
    setUserID(user_id);
    toast.success("Logged In")
  };

  const handleLogout = () => {
    setUserID("")
    toast.success("Logged Out")
  };

  const searchFailed = () => {
    handleError("Search Failed")
    setSearchBarVisibility(false);
  }

  const handleCategory = (buttonsData) => {
    search("none", buttonsData, user_ID);
    setSearchBarVisibility(true);
  };

  const handleSearch = (searchbarData) => {
    search(searchbarData, "none", user_ID);
    setSearchBarVisibility(true);
  }

  const clearSummaries = () => {
    setSummaryList(null);
    setSearchBarVisibility(false);
  };

  const updateSearchHistory = () => {
    setSearchHistory(!searchHistory);
  }


  const search = async (keyword, category, user_id) => {
    try {
      setLoadingState("loading");
      const result = await fetch("http://localhost:5000/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword, category, user_id }),
      });
 
      if (!result.ok) {
        setLoadingState("noloading");
        throw new Error(`HTTP error! Status: ${result.status}`);
      }
 
      const response = await result.json();
      setLoadingState("noloading")
      console.log("Full Reponse:", response)
      setTimeout(() => {
        setSummaryList(response.summaries);
        setLinkList(response.links)
        updateSearchHistory();
      }, 300);
    } catch (error) {
      console.error("Error during fetch:", error);
      searchFailed();
    }
 };

  return (
    <div className="App">
      <div className="outer-border">
        <div className="main-page">
          <LoadingSymbol loadingState = { loadingState }/>
          <WebsiteTitle visibility = { searchBarVisibility }/>
          <Buttons setCategoryFromButtons={ handleCategory } setSearchFromButtons={ handleSearch } searchBar = { searchBarVisibility }/>
          <Summaries summaryList = { summaryList } linkList = { linkList } clearSummaryList = { clearSummaries }/>
          {user_ID === "" && <Signin setError={ handleError } setUserID={ handleLogin } setNotification={ handleNotification }/>}
          {user_ID !== "" && <Signout setLogout={ handleLogout } />}
          {user_ID !== "" && <SearchHistory user_id = { user_ID } searchHistory={ searchHistory } setSearchFromHistory={ handleSearch } />}
          <ToastContainer {...toastConfig} />
        </div>
      </div>
    </div>
  );
}

export default App;
