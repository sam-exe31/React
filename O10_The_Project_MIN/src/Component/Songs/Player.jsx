import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';


function Player({ currentSong }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);


useEffect(() => {
    if (currentSong && audioRef.current) {
    audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(error => console.log("Audio play error:", error));
    }
}, [currentSong]);


const togglePlay = () => {
    if (!currentSong) return;
    if (isPlaying) {
    audioRef.current.pause();
    } else {
    audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
};


const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setProgress((current / total) * 100 || 0); 
    }
  };

  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setProgress(e.target.value);
  };

  const handleVolume = (e) => {
    const newVolume = e.target.value;
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  if (!currentSong) return null;

  return (
    <div className="player-container" style={{
      position: 'fixed', bottom: 0, left: 0, width: '100%',
      backgroundColor: '#181818', borderTop: '1px solid #282828',
      padding: '15px 30px', display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', color: 'white', zIndex: 1000, boxSizing: 'border-box'
    }}>
      

    <audio 
        ref={audioRef} 
        src={currentSong.url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)} // Pause icon shows when song finishes
    />

      {/* Left Side: Song Info */}
    <div style={{ width: '30%' }}>
        <h4 style={{ margin: 0, fontSize: '1rem' }}>{currentSong.title}</h4>
        <p style={{ margin: 0, color: '#b3b3b3', fontSize: '0.8rem' }}>{currentSong.artist}</p>
    </div>

      {/* Middle Side: Playback Controls */}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40%' }}>
        <button 
        onClick={togglePlay}
        style={{
            backgroundColor: 'white', color: 'black', border: 'none',
            borderRadius: '50%', width: '40px', height: '40px',
            cursor: 'pointer', marginBottom: '8px',
            display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          {/* Using your new Lucide Icons! */}
        {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" />}
        </button>
        
        <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
        <input 
            type="range" min="0" max="100" value={progress} onChange={handleSeek}
            style={{ width: '100%', cursor: 'pointer', accentColor: '#1db954' }}
        />
        </div>
    </div>


        <div style={{ width: '30%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
        <Volume2 size={20} color="#b3b3b3" /> 
        <input 
        type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolume}
        style={{ width: '80px', cursor: 'pointer', accentColor: '#1db954' }}
        />
    </div>
    
    </div>
);
}

export default Player;