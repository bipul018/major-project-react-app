import React, { useState, useRef, useEffect } from "react";
import {
  Button,
} from "@mui/material";

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

  // const [socket, setSocket] = useState<WebSocket | null>(null);
  let socket: WebSocket|null = null;
  let intervalId : ReturnType<typeof setInterval> | null = null;

  const streamFunc = async () => {
    if(video_ref && video_ref.current){
      const video = video_ref.current;
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const image_mime = 'image/jpeg';
	//console.log(`The sizes are : ${canvas.width}x${canvas.height}`);
        canvas.toBlob(
          async (blob) => {
	    //console.log("Got the blob, now sending ...");
            if (blob && socket && socket.readyState === WebSocket.OPEN) {

	      const {metadata, frameBuffer} = await( async () => {
		const metadata = {
		  timestamp: Date.now(),
		  frame_type: image_mime,
		  width: canvas.width,
		  height: canvas.height,};
		const frameBuffer = await blob.arrayBuffer();
		if(on_send){
		  //TODO:: IT SEEMS LOGIC DOESNOT REACH THIS POINT, FIX THIS
		  return on_send(metadata, frameBuffer);
		}
		return {metadata, frameBuffer};
	      })();

	      const metadataBuffer = new TextEncoder().encode(JSON.stringify(metadata));
	      const combinedBuffer = new Uint8Array(metadataBuffer.byteLength + frameBuffer.byteLength);

	      combinedBuffer.set(metadataBuffer, 0);
	      combinedBuffer.set(new Uint8Array(frameBuffer), metadataBuffer.byteLength);

	      socket.send(combinedBuffer);
            }
          },
          image_mime,
          0.8
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
