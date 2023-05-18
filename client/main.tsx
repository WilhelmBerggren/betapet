import React from "react";
import ReactDOM from "react-dom/client";

import { Game } from "./game";

import { videoCall } from "./videoCall";

const socket = new WebSocket("ws://localhost:8080");

socket.addEventListener("open", () => {
  console.log("connected!");
  videoCall(socket);
});

const VideoCall = () => {
  return (
    <div style={{ position: "absolute", width: "100%", display: "flex", justifyContent: "space-between" }}>
      <video height="100px" id="localVideo" playsInline autoPlay muted></video>
      <div>
        <button id="startButton">Start</button>
        <button id="hangupButton">Hang Up</button>
      </div>
      <video height="100px" id="remoteVideo" playsInline autoPlay></video>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Game />
    <VideoCall />
  </React.StrictMode>
);
