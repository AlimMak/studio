import React, { useCallback } from 'react';

const handleProceedToHostIntro = useCallback(() => {
  setGamePhase('HOST_INTRODUCTION');
  prevGamePhaseRef.current = 'TITLE_SCREEN';

}, [backgroundMusicAudioRef]);

const handleProceedToSetup = useCallback(() => {
  if (gamePhase === 'TITLE_SCREEN' || gamePhase === 'SETUP' || gamePhase === 'RULES') {
    // Play (and restart) for specified menu phases
    if (backgroundMusicAudioRef.current.paused) {
      backgroundMusicAudioRef.current.loop = true; // Ensure looping
      backgroundMusicAudioRef.current.currentTime = 0; // Rewind to start
      backgroundMusicAudioRef.current.play().catch(error => {
        console.error(`Background music playback failed for game phase ${gamePhase}:`, error);
      });
    }
  } else if (gamePhase === 'HOST_INTRODUCTION' || gamePhase === 'PLAYING' || gamePhase === 'GAME_OVER' || gamePhase === 'SCOREBOARD') {
    // Pause for host introduction, questions, game over, and scoreboard
    if (!backgroundMusicAudioRef.current.paused) {
      backgroundMusicAudioRef.current.pause();
      backgroundMusicAudioRef.current.currentTime = 0; // Rewind
    }
  }
}, [gamePhase, isBackgroundAudioInitialized]); 