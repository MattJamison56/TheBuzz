import React, { useState, useEffect } from 'react';
import './loading.css';
import loadingGif from '../images/loading.gif';


const LoadingSymbol=({ loadingState }) => {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (loadingState == "loading") {
            startLoading();
        }
        else {
            killLoading();
        }
        }, [loadingState]);

    const startLoading = () => {
        setIsLoading(true);
      };
    
    const killLoading = () => {
        setIsLoading(false)
    }

    return (
        <div className="loadingstuff">
            <img src={loadingGif} alt="Loading..." className={`loading ${isLoading ? 'fadein':'fade'}`} />
        </div>
    )};

export default LoadingSymbol;