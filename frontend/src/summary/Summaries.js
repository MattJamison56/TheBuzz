import React, { useState } from 'react';
import './Summaries.css';
import arrowleft from './arrowleft.png';
import arrowright from './arrowright.png';

function Summaries(props) {
    const summaryList = props.summaryList;
    const linkList = props.linkList;
    const [summaryIndex, setSummaryIndex] = useState(0);
    const [linkIndex, setLinkIndex] = useState(0);
    const [isReverse, setIsReverse] = useState(false);
    const [isVisible, toggleVisible] = useState(true);


    const nextSummary = () => {
        setSummaryIndex((summaryIndex + 1) % summaryList.length);
        setLinkIndex((linkIndex + 1) % linkList.length);
      };
    
    const prevSummary = () => {
    setSummaryIndex((summaryIndex - 1 + summaryList.length) % props.summaryList.length);
    setLinkIndex((linkIndex - 1 + linkList.length) % props.linkList.length);
    };

    const exitSummary = async () => {
        toggleVisible(false)
        await new Promise((resolve) => {
            toggleReverse(!isReverse, () => {
                // This callback is called when the state has been updated
                resolve();
            });
        });
        setIsReverse(false); 
        toggleVisible(true)
        props.clearSummaryList(); // clearSummaryList will now execute after the animation is done
    };
    
    const toggleReverse = (newIsReverse, callback) => {
        setIsReverse(newIsReverse);
        setTimeout(() => {
            if (typeof callback === 'function') {
                callback(); // Call the callback to signal that the animation is finished
            }
        }, 2000); // 2 seconds
    };

    if (!summaryList || summaryList.length === 0) {
        return null; // Return null when there are no summaries
    }
    return (
        <div className = "paper-container">
            <div className = {`paper ${isReverse ? 'reverse' : 'forwards'}`}>
                <div className = {`info ${isVisible ? 'visible' : 'invisible'}`}>
                <div className = "textspace">
                    <p className = "summarycontent">{ summaryList[summaryIndex] }</p>
                    <button className="exit-button" onClick={exitSummary}>X</button>
                </div>
                <button onClick={() => window.open(linkList[linkIndex], '_blank')} className="link">See the full article!</button>
                <button className="shifterleft" onClick={prevSummary}><img className="leftarrow" src={arrowleft} alt="leftarrow"/></button>
                <button className="shifterright" onClick={nextSummary}><img className="rightarrow" src={arrowright} alt="rightarrow"/></button>
                </div>
            </div>
        </div>
    );
}

export default Summaries