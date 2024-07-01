import React, { useState } from "react";
import Main from "./components/Main/Main";
import Sidebar from "./components/Sidebar/Sidebar";
import "./App.css";

function App() {
  const [speakerEnabled, setSpeakerEnabled] = useState(
    localStorage.getItem("speakerEnabled") === "true"
  );
  const [gemini, setGemini] = useState(false);
  const [showGeneratePPT, setShowGeneratePPT] = useState(false);
  const [showGenerateDoc, setShowGenerateDoc] = useState(false);
  const [showGenerateCsv, setShowGenerateCsv] = useState(false);
  const [showGeneratePdf, setShowGeneratePdf] = useState(false);

  // Function to toggle the speaker setting
  const toggleSpeakerSetting = () => {
    const currentSetting = localStorage.getItem("speakerEnabled") === "true";
    const newSetting = !currentSetting;
    localStorage.setItem("speakerEnabled", newSetting); // Update localStorage
    setSpeakerEnabled(newSetting); // Update state
  };

  return (
    <div className="App">
      <div className="sidebar">
        <Sidebar
          speakerEnabled={speakerEnabled}
          setGemini={setGemini}
          toggleSpeakerSetting={toggleSpeakerSetting}
          setShowGeneratePPT={setShowGeneratePPT}
          setShowGenerateDoc={setShowGenerateDoc}
          setShowGenerateCsv={setShowGenerateCsv}
          setShowGeneratePdf={setShowGeneratePdf}
        />
      </div>
      <div className="main">
        <Main
          speakerEnabled={speakerEnabled}
          gemini={gemini}
          showGeneratePPT={showGeneratePPT}
          showGenerateDoc={showGenerateDoc}
          showGenerateCsv={showGenerateCsv}
          showGeneratePdf={showGeneratePdf}
        />
      </div>
    </div>
  );
}

export default App;
