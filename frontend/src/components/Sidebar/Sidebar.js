import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import gptLogo from "../../assets/cglogo.png";
import "./Sidebar.css";

function Sidebar({
  speakerEnabled,
  toggleSpeakerSetting,
  setGemini,
  setShowGeneratePPT,
  setShowGenerateDoc,
}) {
  const [focusedButton, setFocusedButton] = useState("OpenAI");
  const [isGeneratePPTSelected, setIsGeneratePPTSelected] = useState(false);
  const [isGenerateDocSelected, setIsGenerateDocSelected] = useState(false);

  const handleSpeakerToggle = (event) => {
    event.stopPropagation();
    toggleSpeakerSetting();
  };

  const handleGemini = (event) => {
    event.stopPropagation();
    setGemini(true);
    setFocusedButton("Gemini");
  };

  const handleOpenAI = (event) => {
    event.stopPropagation();
    setGemini(false);
    setFocusedButton("OpenAI");
  };

  const handleGeneratePPTClick = () => {
    setIsGeneratePPTSelected(!isGeneratePPTSelected);
    setShowGeneratePPT(!isGeneratePPTSelected); // Toggle showGeneratePPT state in the parent component
    console.log(isGeneratePPTSelected);
    setIsGenerateDocSelected(false);
    setShowGenerateDoc(false);
  };

  const handleGenerateDocClick = () => {
    setIsGenerateDocSelected(!isGenerateDocSelected);
    setShowGenerateDoc(!isGenerateDocSelected); // Toggle showGeneratePPT state in the parent component
    console.log(isGenerateDocSelected);
    setIsGeneratePPTSelected(false);
    setShowGeneratePPT(false);
  };

  return (
    <div>
      <div className="sidebar">
        <div className="upperPart">
          <div className="upperPartTop">
            <img src={gptLogo} alt="" className="logo" />
            <span className="brand">SuperBot</span>
            {/* <i className="bi bi-list ms-3"></i> */}
          </div>
          <hr className="text-white d-none d-sm-block"></hr>
          <div>
            <div>
              <ul
                className="nav nav-pills flex-column mt-2 mt-sm-0"
                id="parentM"
              >
                <li className="nav-item my-1 py-2 py-sm-0">
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a
                    href="#submenuAI"
                    className="nav-link text-white text-center text-sm-start"
                    data-bs-toggle="collapse"
                    aria-current="page"
                  >
                    <i className="bi bi-sliders"></i>
                    <span className="ms-2 d-none d-sm-inline">AI</span>
                    <i className="bi bi-arrow-down-short ms-3"></i>
                  </a>
                  <ul
                    className="nav collapse ms-2 flex-column"
                    id="submenuAI"
                    data-bs-parent="#parentAI"
                  >
                    <li className="nav-item ">
                      <label className="nav-link text-white ">
                        <input
                          type="radio"
                          name="aiType"
                          className={
                            focusedButton === "Gemini" ? "focused" : ""
                          }
                          onClick={(e) => handleGemini(e)}
                        />{" "}
                        Gemini AI
                      </label>
                    </li>
                    <li className="nav-item">
                      <label className="nav-link text-white">
                        <input
                          type="radio"
                          name="aiType"
                          className={
                            focusedButton === "OpenAI" ? "focused" : ""
                          }
                          onClick={(e) => handleOpenAI(e)}
                          defaultChecked={focusedButton === "OpenAI"} // Add checked attribute here
                        />{" "}
                        Open AI
                      </label>
                    </li>
                  </ul>
                </li>

                <li className="nav-item my-1 py-2 py-sm-0">
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a
                    href="#submenuFiles"
                    className="nav-link text-white text-center text-sm-start"
                    data-bs-toggle="collapse"
                    aria-current="page"
                  >
                    <i className="bi bi-files"></i>
                    <span className="ms-2 d-none d-sm-inline">
                      Generate Files
                    </span>
                    <i className="bi bi-arrow-down-short ms-3"></i>
                  </a>
                  <ul
                    className="nav collapse ms-2 flex-column"
                    id="submenuFiles"
                    data-bs-parent="#parentFiles"
                  >
                    <li className="nav-item my-1 py-2 py-sm-0">
                      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                      <a
                        href="#"
                        className={`nav-link text-white text-center text-sm-start ${
                          isGeneratePPTSelected ? "ppt" : ""
                        }`}
                        aria-current="page"
                        onClick={handleGeneratePPTClick}
                      >
                        <i className="bi bi-file-ppt"></i>
                        <span
                          className="ms-2 d-none d-sm-inline"
                          style={{ marginRight: "2rem" }}
                        >
                          PPT
                        </span>
                      </a>
                    </li>
                    <li className="nav-item my-1 py-2 py-sm-0">
                      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                      <a
                        href="#"
                        className={`nav-link text-white text-center text-sm-start ${
                          isGenerateDocSelected ? "doc" : ""
                        }`}
                        aria-current="page"
                        onClick={handleGenerateDocClick}
                      >
                        <i className="bi bi-file-word"></i>
                        <span
                          className="ms-2 d-none d-sm-inline"
                          style={{ marginRight: "2rem" }}
                        >
                          Word doc
                        </span>
                      </a>
                    </li>
                  </ul>
                </li>

                <li className="nav-item my-1 py-2 py-sm-0">
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a
                    href="#"
                    className="nav-link text-white text-center text-sm-start"
                    aria-current="page"
                    onClick={handleSpeakerToggle}
                  >
                    <i className="bi bi-speaker"></i>
                    <span className="ms-2 d-none d-sm-inline">
                      {speakerEnabled ? "Disable" : "Enable"} Speaker
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
