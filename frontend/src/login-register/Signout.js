import React from 'react';
import './Signout.css';

function Signout(props) {
    
    const Logout = async () => {
        props.setLogout();
    }

    return (
        <div className="signoutcontainer">
            <button onClick={ Logout }className="signout">Log Out</button>
        </div>
    );
}

export default Signout