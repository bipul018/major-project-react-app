import React, { useState, useRef, useEffect } from "react";
import {
  Button,
} from "@mui/material";

export const VideoStreamer: React.FC<{
  videoRef: React.RefObject<HTMLVideoElement>; 
}> = ({videoRef})  => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [intervalId, setIntervalId] = useState<ReturnType<typeof setInterval> | null>(null);
  const socket = useRef<WebSocket | null>(null);
// fkit just a simple fxn that returns some other fxns
export const make_video_stream = ({video_ref, endpoint='localhost:8080/wsprocess_frame', on_receive=null, on_send=null, rate_ms=100} : {
  video_ref: React.RefObject<HTMLVideoElement>;
  endpoint?: String;
  on_receive?: any; // TODO:: Find the signature and write it here
  on_send?: any; // TODO:: Find this also
  rate_ms?: number;
  //on_open?: any;
  // for on_close, just do it just before calling stop fxn
}) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  const streamFunc = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
  // const [socket, setSocket] = useState<WebSocket | null>(null);
  let socket: WebSocket|null = null;
  let intervalId : ReturnType<typeof setInterval> | null = null;

    if (video && canvas) {
      const context = canvas.getContext("2d");
  const streamFunc = async () => {
    if(video_ref && video_ref.current){
      const video = video_ref.current;
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);


        // Convert the canvas to a blob
	const image_mime = "image/jpeg";
        canvas.toBlob(
          async (blob) => {
	    //console.log(`Converted some data to blob, blob = ${blob}, socket = ${socket.current}, readystate = ${(socket.current)?socket.current.readyState:"wahwahwah"}`)
	    if (blob && socket.current && socket.current.readyState == WebSocket.OPEN){
	      //console.log("Sending some data to server backend")

	      // Example metadata to send with the frame
              const metadata = { timestamp: Date.now(), frameType: image_mime };

	      // Convert JSON and binary frame to ArrayBuffer
	      const frameBuffer = await blob.arrayBuffer();
	      const metadataBuffer = new TextEncoder().encode(JSON.stringify(metadata)); // JSON metadata as Uint8Array
	      const combinedBuffer = new Uint8Array(metadataBuffer.byteLength + frameBuffer.byteLength);

	      combinedBuffer.set(metadataBuffer, 0);
	      combinedBuffer.set(new Uint8Array(frameBuffer), metadataBuffer.byteLength);

	      // Send combined data
	      socket.current.send(combinedBuffer);

              // Send BSON data over WebSocket
              //socket.current.send(bsonData);

	      //socket.current.send(blob);
            }
          },
          image_mime,
          0.8 // Compression quality (optional)
        );
      }
    }
  };

  const stopStreaming = () => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
      //setIntervalId(null);
    }
    if (socket !== null) {
      socket.close();
      socket = null;
      //setSocket(null);
    }
  };
  const startStreaming = () => {
    if (videoRef.current && canvasRef.current) {

      if(socket.current === null){
	const ws = new WebSocket("ws://localhost:8080/wsprocess_frame");

	ws.onmessage = (event: MessageEvent) => {
	  console.log(`Received data from server : ${JSON.stringify(event.data)}`);
	};
	ws.onerror = (event: Event) => {
	  console.log(`WebSocket Error : ${event}`);
	  stopStreaming();
	};
	ws.onclose = () => {
	  console.log(`WebSocket connection terminated.`);
	  stopStreaming();
	};

	// Set the WebSocket state
	socket.current = ws;

	ws.onopen = () => {
          console.log("WebSocket connection established.");

	  console.log(`Saved WebSocket value is ${socket}, and ws is ${ws}`);
	  
	  if(intervalId !== null){
	    clearInterval(intervalId);
	  }
          const iid = setInterval(streamFunc, 100); // Adjust interval for frame rate
          setIntervalId(iid);
	};
    if (video_ref.current) {
      if (socket === null) {
        const ws = new WebSocket('ws://' + endpoint);

        ws.onmessage = (event: MessageEvent) => {
          console.log(`Received data from server: ${JSON.stringify(event.data)}`);
	  on_receive(JSON.stringify(event.data));
        };
        ws.onerror = (event: Event) => {
          console.log(`WebSocket Error: ${event}`);
          stopStreaming();
        };
        ws.onclose = () => {
          console.log('WebSocket connection terminated.');
          stopStreaming();
        };

	//setSocket(ws);
	socket = ws;
        ws.onopen = () => {
          console.log('WebSocket connection established.');

          if (intervalId !== null) {
            clearInterval(intervalId);
          }
          const iid = setInterval(streamFunc, rate_ms);
	  intervalId = iid;
          //setIntervalId(iid);
        };
      }
    }
  };
  
  return {
    startStreaming,
    stopStreaming,
  };
}

  // Stop capturing frames from the video
  const stopStreaming = () => {
    //setIsStreaming(false);
    // Delete interval
    if(intervalId !== null){
      clearInterval(intervalId);
      setIntervalId(null);
    }
    if (socket.current){
      socket.current.close();
      socket.current = null;
    }
  };

  useEffect(() => {
    return () => stopStreaming(); // Cleanup
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      <Button variant="contained" onClick={startStreaming} sx={{ mt: 2 }}>
        Start Streaming
      </Button>
      <Button variant="contained" onClick={stopStreaming} sx={{ mt: 2 }}>
        Stop Streaming
      </Button>
      <Button variant="contained" onClick={()=>{stopStreaming(); startStreaming(); }} sx={{ mt: 2 }}>
        Restart Streaming
      </Button>
    </div>
);

interface VideoStreamer {
  h: number,
};

export default VideoStreamer;
