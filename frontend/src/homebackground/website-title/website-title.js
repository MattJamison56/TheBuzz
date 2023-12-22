import React, { useState, useRef, useEffect } from 'react';
import title from '../images/thebuzztitlewithbee.png'
import './website-title.css';
import audio1 from './buzzsounds/buzzsound1.mp3'
import audio2 from './buzzsounds/buzzsound2.mp3'
import audio3 from './buzzsounds/buzzsound3.mp3'

const WebsiteTitle = ({ visibility }) => {
  const audioFiles = [audio1, audio2, audio3];
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const audioRef = useRef(new Audio());

  const playAudio = () => {
    const audio = audioRef.current;
    if (audio.src !== audioFiles[currentAudioIndex]) {
      audio.src = audioFiles[currentAudioIndex];
    }

    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
      audio.currentTime = 0;
    }

    // Update the index for next click
    const nextIndex = (currentAudioIndex + 1) % audioFiles.length;
    setCurrentAudioIndex(nextIndex);
  };

  // Clean up audio on unmount
  useEffect(() => {
    const audio = audioRef.current;
    return () => audio.pause();
  }, []);

  return <button onClick={ playAudio } className={`image-button ${visibility ? 'fade' : 'fade-in'}`}><img src={title} className="website-title" alt="The Buzz" /></button>
};

export default WebsiteTitle;
