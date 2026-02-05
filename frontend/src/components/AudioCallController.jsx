import { useEffect, useRef } from "react";

import { useAuthStore } from "../store/useAuthStore";

import { useCallStore } from "../store/useCallStore";

const AudioCallController = () => {
  const { socket } = useAuthStore();

  const {
    caller,

    callState,

    incomingCall,

    incomingOffer,

    acceptCall,

    remoteEndCall,
  } = useCallStore();

  const pcRef = useRef(null);

  const localStreamRef = useRef(null);

  const answeredRef = useRef(false);

  const audioRef = useRef(new Audio());

  //Queue to store candidates that arrive too early

  const iceQueue = useRef([]);

  //helper function to process the queue

  const processIceQueue = async () => {
    if(!pcRef.current || !pcRef.current.remoteDescription) return
    while (iceQueue.current.length > 0) {
      const candidate = iceQueue.current.shift();

      try {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.log("Error adding queued ICE candidate", e);
      }
    }
  };

  /* --------------------------------------------------

* 1. Create PeerConnection

* -------------------------------------------------- */

  useEffect(() => {
    if (!socket || !caller) return;

    if (pcRef.current) return;

    if (!["calling", "ringing", "in-call"].includes(callState)) return;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pcRef.current = pc;

    // ICE → signaling server → other peer

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("call:ice", {
          receiverId: caller._id || caller,

          candidate: event.candidate,
        });
      }
    };

    // Play remote audio

    pc.ontrack = (event) => {
      const remoteStream = new MediaStream();
      remoteStream.addTrack(event.track);
      audioRef.current.srcObject = remoteStream;

      audioRef.current.autoplay = true;
      console.log("Track kind:", event.track.kind);

      if (!document.body.contains(audioRef.current)) {
        audioRef.current.style.display = "none";
        document.body.appendChild(audioRef.current);
      }

      audioRef.current.play().catch((e) => console.log("Play error", e));
    };
  }, [socket, caller, callState]);

  /* --------------------------------------------------

* 2. Caller creates OFFER

* -------------------------------------------------- */

  useEffect(() => {
    if (callState !== "calling") return;

    if (!pcRef.current) return;

    const createOffer = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,

          noiseSuppression: true,

          autoGainControl: true,
        },
      });

      localStreamRef.current = stream;

      stream.getTracks().forEach((t) => pcRef.current.addTrack(t, stream));

      console.log("local tracks", stream.getTracks());

      const offer = await pcRef.current.createOffer();

      await pcRef.current.setLocalDescription(offer);

      socket.emit("call:offer", {
        receiverId: caller._id || caller,

        offer,
      });
    };

    createOffer();
  }, [callState]);

  /* --------------------------------------------------

* 3. Signaling listeners

* -------------------------------------------------- */

  useEffect(() => {
    if (!socket) return;

    // Receiver gets offer → UI only

    socket.on("call:incoming", ({ callerUser, offer }) => {
      incomingCall({ callerUser, offer });
    });

    // Caller receives answer

    socket.on("call:accepted", async ({ answer, acceptCallUser }) => {
      acceptCall(acceptCallUser);

      if (pcRef.current) {
        await pcRef.current.setRemoteDescription(
          new RTCSessionDescription(answer),
        );

        await processIceQueue();
      }
    });

    socket.on("call:ended", remoteEndCall);

    return () => {
      socket.off("call:incoming");

      socket.off("call:accepted");

      socket.off("call:ended");
    };
  }, [socket]);

  /* --------------------------------------------------

* 4. Receiver answers AFTER clicking Accept

* -------------------------------------------------- */

  useEffect(() => {
    if (callState !== "in-call") return;

    if (!pcRef.current) return;

    if (!incomingOffer) return;

    if (answeredRef.current) return;

    answeredRef.current = true;

    const answerCall = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,

          noiseSuppression: true,

          autoGainControl: true,
        },
      });

      localStreamRef.current = stream;

      stream.getTracks().forEach((t) => pcRef.current.addTrack(t, stream));

      await pcRef.current.setRemoteDescription(
        new RTCSessionDescription(incomingOffer),
      );

      await processIceQueue();

      const answer = await pcRef.current.createAnswer();

      await pcRef.current.setLocalDescription(answer);

      socket.emit("call:answer", {
        receiverId: caller._id || caller,

        answer,
      });
    };

    answerCall();
  }, [callState]);

  /* --------------------------------------------------

* 5. Receive ICE candidates

* -------------------------------------------------- */

  useEffect(() => {
    if (!socket) return;

    socket.on("call:ice", async ({ candidate }) => {
      if (pcRef.current && candidate) {
        if (!pcRef.current.remoteDescription) {
          iceQueue.current.push(candidate);
        } else {
          try {
            await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (error) {
            console.log("Error adding candidate", error);
          }
        }
      }
    });

    return () => socket.off("call:ice");
  }, [socket]);

  /* --------------------------------------------------

* 6. Cleanup when call ends

* -------------------------------------------------- */

  useEffect(() => {
    if (callState !== "idle") return;

    pcRef.current?.close();

    pcRef.current = null;

    localStreamRef.current?.getTracks().forEach((t) => t.stop());

    localStreamRef.current = null;

    answeredRef.current = false;
    iceQueue.current = [];
    if (document.body.contains(audioRef.current)) {
      document.body.removeChild(audioRef.current);
    }

  }, [callState]);

  return null;
};

export default AudioCallController;
