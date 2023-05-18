export const videoCall = (socket: WebSocket) => {
  const startButton = document.getElementById("startButton") as HTMLButtonElement;
  const hangupButton = document.getElementById("hangupButton") as HTMLButtonElement;
  hangupButton.disabled = true;

  const localVideo = document.getElementById("localVideo") as HTMLVideoElement;
  const remoteVideo = document.getElementById("remoteVideo") as HTMLVideoElement;

  let pc: RTCPeerConnection | undefined;
  let localStream: MediaStream | undefined;

  socket.addEventListener("message", (event) => {
    const e = { data: JSON.parse(event.data) };

    if (!localStream) {
      console.log("not ready yet");
      return;
    }
    switch (e.data.type) {
      case "offer":
        handleOffer(e.data);
        break;
      case "answer":
        handleAnswer(e.data);
        break;
      case "candidate":
        handleCandidate(e.data);
        break;
      case "ready":
        if (pc) {
          console.log("already in call, ignoring");
          return;
        }
        makeCall();
        break;
      case "bye":
        if (pc) {
          hangup();
        }
        break;
      default:
        console.log("unhandled", e);
        break;
    }
  });

  startButton.onclick = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    localVideo.srcObject = localStream;

    startButton.disabled = true;
    hangupButton.disabled = false;

    socket.send(JSON.stringify({ type: "ready" }));
  };

  hangupButton.onclick = async () => {
    hangup();
    socket.send(JSON.stringify({ type: "bye" }));
  };

  async function hangup() {
    if (pc) {
      pc.close();
      pc = undefined;
    }
    localStream!.getTracks().forEach((track) => track.stop());
    localStream = undefined;
    startButton.disabled = false;
    hangupButton.disabled = true;
  }

  type Message = {
    type: string;
    candidate: string | null;
    sdp?: string | null;
    sdpMid?: string | null;
    sdpMLineIndex?: number | null;
  };
  function createPeerConnection() {
    pc = new RTCPeerConnection();
    pc.onicecandidate = (e) => {
      const message: Message = {
        type: "candidate",
        candidate: null,
      };
      if (e.candidate) {
        message.candidate = e.candidate.candidate;
        message.sdpMid = e.candidate.sdpMid;
        message.sdpMLineIndex = e.candidate.sdpMLineIndex;
      }
      socket.send(JSON.stringify(message));
    };
    pc.ontrack = (e) => (remoteVideo.srcObject = e.streams[0]);
    localStream!.getTracks().forEach((track) => pc!.addTrack(track, localStream!));
  }

  async function makeCall() {
    createPeerConnection();

    const offer = await pc!.createOffer();
    socket.send(JSON.stringify({ type: "offer", sdp: offer.sdp }));
    await pc!.setLocalDescription(offer);
  }

  async function handleOffer(offer: RTCSessionDescriptionInit) {
    if (pc) {
      console.error("existing peerconnection");
      return;
    }
    createPeerConnection();
    await pc!.setRemoteDescription(offer);

    const answer = await pc!.createAnswer();
    socket.send(JSON.stringify({ type: "answer", sdp: answer.sdp }));
    await pc!.setLocalDescription(answer);
  }

  async function handleAnswer(answer: RTCSessionDescriptionInit) {
    if (!pc) {
      console.error("no peerconnection");
      return;
    }
    await pc.setRemoteDescription(answer);
  }

  async function handleCandidate(candidate: RTCIceCandidateInit) {
    if (!pc) {
      console.error("no peerconnection");
      return;
    }
    if (!candidate.candidate) {
      await pc.addIceCandidate(undefined);
    } else {
      await pc.addIceCandidate(candidate);
    }
  }
};
