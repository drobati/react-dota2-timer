import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const useAudio = url => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing, audio]);

  useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, [audio]);

  return [playing, toggle];
};

function App() {
  const [timer, setTimer] = useState(0);
  const [playing, toggle] = useAudio("ding.mp3");

  const warningOffset = 10;

  const firstSpawn = 14 - warningOffset;
  const secondSpawn = 14 - warningOffset;

  useInterval(() => {
    // Your custom logic here
    setTimer(timer + 1);
    if (timer !== 0) {
      const leftoverSeconds = timer % 60;
      if (leftoverSeconds === firstSpawn || leftoverSeconds === secondSpawn) {
        toggle();
      }
    }
  }, 1000);

  return (
    <div className="main">
      <div className="timer">
        {new Date(timer * 1000).toISOString().substr(11, 8)}
      </div>
      <button onClick={() => setTimer(0)}>Reset Timer</button>
    </div>
  );
}

export default App;
