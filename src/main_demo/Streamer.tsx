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

  const streamFunc = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const context = canvas.getContext("2d");
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

  // Start capturing frames from the video
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

      }
    }
  };

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
};

export default VideoStreamer;
