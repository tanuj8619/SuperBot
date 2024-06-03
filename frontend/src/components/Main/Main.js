import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Main.css";
import axios from "axios";
import ModalPop from "../ModalPop/ModalPop";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useSpeechSynthesis } from "react-speech-kit";
import attachBtn from "../../assets/paperclip.svg";
import sendBtn from "../../assets/send.svg";
import userIcon from "../../assets/user-icon1.png";
import gptLogo from "../../assets/cglogo.png";
import voiceOn from "../../assets/mic-fill.svg";
import voiceOff from "../../assets/mic.svg";
import stopIcon from "../../assets/volume-up-fill.svg";
import speakIcon from "../../assets/volume-off-fill.svg";

const Main = ({ speakerEnabled, gemini, showGeneratePPT, showGenerateDoc }) => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      content: "Hi, I am Capgemini SuperBot. How can I help you today?",
    },
  ]);
  //for file
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [tokenUsed, setTokenUsed] = useState("");
  const [fileLoading, setFileLoading] = useState(false);

  //for ppt
  const [loading, setLoading] = useState(false);
  const [presentationPath, setPresentationPath] = useState("");

  //doc
  const [docLoading, setDocLoading] = useState(false);
  const [docPath, setDocPath] = useState("");

  //for voice
  const [listening, setListening] = useState(false);
  const { transcript, resetTranscript } = useSpeechRecognition();
  //for speaker
  const { speak, cancel } = useSpeechSynthesis();

  // for textarea to expands
  const textareaRef = useRef(null);
  const chatsRef = useRef(null);

  //for modal
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalClick = () => {
    setModalOpen(false);
  };

  const [audioSrc, setAudioSrc] = useState(null);
  const audioRef = useRef(null);

  const base64ToArrayBuffer = (base64) => {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };
  useEffect(() => {
    if (audioSrc && audioRef.current) {
      audioRef.current.play();
    }
  }, [audioSrc]);

  // const [audioVisible, setAudioVisible] = useState(false);

  // Function to toggle audio visibility
  // const toggleAudioVisibility = () => {
  //   setAudioVisible(!audioVisible);
  // };

  // useEffect(() => {
  //   if (textareaRef.current) {
  //     textareaRef.current.style.height = "auto"; // Set height to auto to adjust initially
  //     textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Adjust height based on scroll height
  //   }
  // }, [textareaRef]);

  const handleChange = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height to auto
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Adjust height based on scroll height
    }
  };

  //for chatref
  useEffect(() => {
    chatsRef.current?.scrollIntoView();
  }, [chatHistory]);

  const handleUserInput = (event) => {
    handleChange();
    setUserInput(event.target.value);
  };

  //handle attach
  const handleAttach = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.docx,.txt";
    input.click();
    input.onchange = async (event) => {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
      //setUserInput(selectedFile.name);

      try {
        setFileLoading(true);
        const formData = new FormData();

        if (selectedFile) {
          formData.append("file", selectedFile);
        }
        const response = await axios.post(
          "http://127.0.0.1:8000/api/chat",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            // body: JSON.stringify({ user_input: userInput }),
          }
        );
        console.log(response.data.extracted_text);
        setExtractedText(response.data.extracted_text);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setFileLoading(false);
      }
      console.log("file attached");
    };
  };

  //for handling voice
  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
    setListening((prevState) => !prevState);
  };

  useEffect(() => {
    setUserInput(transcript);
  }, [transcript]);

  const handleVoiceChange = (event) => {
    setUserInput(event.target.value);
  };
  const removeFile = () => {
    setFile(null);
    setFileName("");
  };

  //to handle speaker
  const handleSpeech = (index, resultText) => {
    if (chatHistory[index].speaking) {
      cancel(); // Stops speaking if it's currently speaking
      setChatHistory((prevResult) => {
        const updatedResult = [...prevResult];
        updatedResult[index] = { ...updatedResult[index], speaking: false };
        return updatedResult;
      });
    } else {
      speak({ text: resultText }); // Starts speaking the provided text
      setChatHistory((prevResult) => {
        const updatedResult = [...prevResult];
        updatedResult[index] = { ...updatedResult[index], speaking: true };
        return updatedResult;
      });
    }
  };

  const handleGeneratePPT = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("topic", userInput);
      const response = await axios.post("http://127.0.0.1:8000/ppt", formData, {
        headers: {
          Accept: "application/json",
        },
        responseType: "blob",
      });

      // Create a blob URL for the response data
      const blob = new Blob([response.data]);
      const downloadLink = URL.createObjectURL(blob);

      // Create a temporary link element to trigger the download
      const a = document.createElement("a");
      a.href = downloadLink;
      a.download = `${userInput}_presentation.pptx`; // Set the file name
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a); // Remove the temporary link element

      //const downloadLink = encodeURIComponent(response.data.file_path);
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { role: "user", content: userInput },
        {
          role: "assistant",
          content: (
            <div>
              <p>{userInput} Presentation generated!</p>
            </div>
          ),
        },
      ]);
      setPresentationPath(response.data.file_path);
      setUserInput("");
      resetTranscript(null);
    } catch (error) {
      console.error("Error generating presentation:", error);
    }
    setLoading(false);
  };

  const handleGenerateDoc = async () => {
    setDocLoading(true);
    try {
      const formData = new FormData();
      formData.append("topic", userInput);
      const response = await axios.post("http://127.0.0.1:8000/doc", formData, {
        headers: {
          Accept: "application/json",
        },
        responseType: "blob",
      });

      // Create a blob URL for the response data
      const blob = new Blob([response.data]);
      const downloadLink = URL.createObjectURL(blob);

      // Create a temporary link element to trigger the download
      const a = document.createElement("a");
      a.href = downloadLink;
      a.download = `${userInput}_document.docx`; // Set the file name
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a); // Remove the temporary link element

      //const downloadLink = encodeURIComponent(response.data.file_path);
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { role: "user", content: userInput },
        {
          role: "assistant",
          content: (
            <div>
              <p>{userInput} Document generated!</p>
            </div>
          ),
        },
      ]);
      setDocPath(response.data.file_path);
      setUserInput("");
      resetTranscript(null);
    } catch (error) {
      console.error("Error generating documentation:", error);
    }
    setDocLoading(false);
  };

  const sendMessage = async () => {
    console.log(gemini);
    try {
      const formData = new FormData();
      formData.append("user_input", userInput);
      formData.append("gemini", gemini);
      if (file) {
        formData.append("file", file);
      }
      const response = await axios.post(
        "http://127.0.0.1:8000/api/chat",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          // body: JSON.stringify({ user_input: userInput }),
        }
      );
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { role: "user", content: userInput },
        { role: "assistant", content: response.data.response },
      ]);
      // console.log(response.data.extracted_text);
      // console.log(response.data.token_used);
      setExtractedText(response.data.extracted_text);
      setTokenUsed(response.data.token_used);
      console.log(tokenUsed);
      const audio = response.data.audio;

      // const responseData = await response.json();

      setUserInput("");
      resetTranscript(null);
      if (audio) {
        const audioBlob = new Blob([base64ToArrayBuffer(audio)], {
          type: "audio/mpeg",
        });
        console.log("Generated audio blob:", audioBlob);

        const audioUrl = URL.createObjectURL(audioBlob);
        console.log("Generated audio URL:", audioUrl);

        setAudioSrc(audioUrl);
      }
      // setFile(null);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const downloadFile = (content, format) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: `text/${format}` });
    element.href = URL.createObjectURL(file);
    element.download = `download.${format}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleRefresh = () => {
    window.location.href = "http://localhost:3000";
  };

  return (
    <div style={{ height: "100%" }}>
      <div
        className="mainTop"
        style={{ display: "flex", alignItems: "center" }}
      >
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a style={{ marginRight: "auto" }}>
          <i className="bi bi-stars"></i>
          <span
            style={{
              fontWeight: "bold",
              fontSize: "1.1rem",
              fontFamily: "cursive",
            }}
          >
            {gemini ? (
              <> Response from Gemini AI</>
            ) : (
              <> Response from OpenAI</>
            )}
          </span>
          <br />
          <span style={{ fontSize: "0.9rem" }}>
            {gemini ? (
              <>AI model trained on a vast dataset.</>
            ) : (
              <>AI model that provides personalized responses.</>
            )}
          </span>
        </a>
        <button
          className="refreshBtn"
          onClick={handleRefresh}
          style={{ marginLeft: "auto" }}
        >
          <span>
            {" "}
            <i className="bi bi-plus-circle-dotted"></i> New Chat
          </span>
        </button>
      </div>

      <div className="main">
        <div className="chats">
          {chatHistory.map((message, i) => (
            <div
              key={i}
              className={
                message.role === "assistant" ? "bot-wrapper" : "chat-wrapper"
              }
            >
              <div
                key={i}
                className={message.role === "assistant" ? "chat bot" : "chat"}
              >
                <img
                  className="chatImg"
                  src={message.role === "assistant" ? gptLogo : userIcon}
                  alt=""
                />
                {speakerEnabled && (
                  <button
                    className="speaker"
                    onClick={() => {
                      handleSpeech(i, message.content); // Pass index to handleSpeech
                    }}
                  >
                    <img
                      src={message.speaking ? stopIcon : speakIcon}
                      alt="Speak"
                      className={
                        message.content.isBot
                          ? "speakerIconWhite"
                          : "speakerIconBlack"
                      }
                    />
                  </button>
                )}

                {message.content ? (
                  <p className="txt">{message.content}</p>
                ) : (
                  <p className="txt">File is attached</p>
                )}
                {/* Add download button for each response */}
                {message.role === "assistant" &&
                  i !== 0 &&
                  !showGeneratePPT && (
                    <div className="dropdown">
                      <button
                        className="dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{
                          color: "white",
                          background: "none",
                          border: "none",
                          marginLeft: "5px", // Adjust margin as needed
                          padding: "5px", // Adjust padding as needed
                        }}
                      >
                        {/* <i className="bi bi-three-dots-vertical"></i> */}
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                          <a
                            className="dropdown-item"
                            onClick={() => downloadFile(message.content, "txt")}
                            href="#"
                          >
                            Download as text
                          </a>
                        </li>
                        <li>
                          {i === chatHistory.length - 1 && (
                            <div>
                              <audio
                                controls
                                ref={audioRef}
                                src={audioSrc}
                                autoPlay
                              />
                            </div>
                          )}
                        </li>
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          ))}
          <div ref={chatsRef} />
        </div>
        <div className="chatFooter">
          <div className="inp">
            <button
              onClick={toggleListening}
              onChange={handleVoiceChange}
              className="voice"
            >
              <img src={listening ? voiceOn : voiceOff} alt="" />
            </button>
            <textarea
              type="text"
              ref={textareaRef}
              placeholder="Send a message"
              value={userInput}
              onChange={handleUserInput}
            />

            {showGeneratePPT && (
              <button
                className="generatePPT"
                onClick={handleGeneratePPT}
                disabled={!userInput}
              >
                {loading ? "Generating..." : "Generate Presentation"}
                {/* Generate PPT */}
              </button>
            )}

            {showGenerateDoc && (
              <button
                className="generatePPT"
                onClick={handleGenerateDoc}
                disabled={!userInput}
              >
                {docLoading ? "Generating..." : "Generate Document"}
                {/* Generate PPT */}
              </button>
            )}

            {!showGeneratePPT && !showGenerateDoc && (
              <label htmlFor="file-upload" className="custom-file-upload">
                <img src={attachBtn} alt="Attach" onClick={handleAttach} />
              </label>
            )}
            {!showGeneratePPT && !showGenerateDoc && (
              <button
                className="send"
                onClick={sendMessage}
                disabled={!userInput && !file}
                // disabled={userInput.trim().length === 0}
              >
                <img src={sendBtn} alt="Send" />
              </button>
            )}
          </div>
          {file && (
            <div className="file-content-wrapper">
              <button
                className="ExtractedFile"
                onClick={() => setModalOpen(true)}
              >
                File Attached: {fileName}
              </button>
              <button className="removeFileBtn btn-danger" onClick={removeFile}>
                Remove
              </button>
            </div>
          )}
          {modalOpen && (
            <ModalPop
              onClose={handleModalClick}
              SentFile={extractedText}
              fileLoading={fileLoading}
            />
          )}
          {/* <div>
            <div className="footer">Token Used till now : {tokenUsed}</div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Main;
