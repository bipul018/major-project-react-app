import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  TextField,
  ToggleButton, ToggleButtonGroup,
} from "@mui/material";

import VideoDrawer, { VideoDrawerHandle } from './VideoDrawer';
// @ts-ignore
import GradioMeshIntegrator from './GradioMeshIntegrator';

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
          //console.log(`Received data from server: ${JSON.stringify(event.data)}`);
	  if (on_receive != null){
	    on_receive(event.data);
	  }
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

export const StreamDemo: React.FC<{
  // TODO:: Determine the type of this thing and use it
  apiUrl: string;
}> = ({apiUrl}) => {
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const [videoSrc1, setVideoSrc1] = useState<string | null>(null);
  const fileInputRef1 = useRef<HTMLInputElement>(null);

  // Webcam stuff
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);

  // Setup the canvas stuff
  const video_canvas_ref = useRef<VideoDrawerHandle>(null);
  const capture_canvas = () => {
    //console.log("Now going to clear the canvas");
    video_canvas_ref.current?.clearCanvas();
    //console.log("hi, shouldve cleared canvsd");
  };
  const make_line = () => {
    const vcanv = video_canvas_ref.current;
    if(vcanv){
      vcanv.drawLine(
	{x: 100, y: 100},
	{x: 200, y: 200},
	'#0000ff',
      );
    }
  };

  // Cleanup webcam on unmount
  useEffect(() => {
    return () => {
      webcamStream?.getTracks().forEach(track => track.stop());
    };
  }, [webcamStream]);

  const turn_off_webcam = async() => {
    webcamStream?.getTracks().forEach(track => track.stop());
    setWebcamStream(null);
    setIsWebcamActive(false);
    if (videoRef1.current) {
      videoRef1.current.srcObject = null;
    }
  };
  const turn_on_webcam = async() => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef1.current) {
        videoRef1.current.srcObject = stream;
      }
      setWebcamStream(stream);
      setIsWebcamActive(true);
      setVideoSrc1(null); // Clear any uploaded video
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  };
  
  // Gradio communication stuff
  const [gradio_api_url, set_gradio_api_url] = useState('');
  const gradio_mesh_integrator_ref = useRef<any>();


  const handleWebcamToggle = async () => {
    if (!isWebcamActive) {
      turn_on_webcam();
    } else {
      turn_off_webcam();
    }
  };



  const handleFileSelect1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      turn_off_webcam();
      setVideoSrc1(URL.createObjectURL(file));
    }
  };


  useEffect(() => {
    return () => {
      if (videoSrc1) URL.revokeObjectURL(videoSrc1);
    };
  }, [videoSrc1]);

  const ms_gap = 100;

  // TODO:: Make a state machine like thing, or at least make it type specific
  const additional_args = useRef<any>(null);
  
  const filter_args = (metadata: any, frameBuffer: any) => {
    //console.log(`is_first is ${JSON.stringify(is_first)}`);
    if(additional_args.current !== null){
      metadata = {...metadata, ...additional_args.current};
      //metadata['fps'] = 1000/ms_gap;
      console.log(`Printing metadata : ${JSON.stringify(metadata)}`);
      //set_is_first(false);
      //is_first.current = false;
      additional_args.current = null;
    }
    //console.log(`Printing metadata : ${JSON.stringify(metadata)}`);
    return {metadata, frameBuffer};
  };

  const handle_receive = async (data: any) => {
    //console.log(`The data was :\n${data}`);
    //const json_data = typeof data === "string" ? JSON.parse(data) : data;
    const json_data = JSON.parse(data);
    //console.log(`Json data was :${json_data}`);
    const {timestamp, message, ...rest} = json_data;

    // Calculate latency,
    const curr_time = Date.now();
    const rtt = curr_time - timestamp;

    //console.log(`Message [${timestamp}] RTT = ${rtt/1000}`);


    // Get the type of data maybe
    // TODO:: Implement this later (when you start actually giving a fk), with types
    if(message.toLowerCase().includes('yoga state changed')){
      // Has from, to, and frame_duration message
      // @ts-ignore
      const {from, to, frame_duration, ...__remaining} = rest;
      console.log(`Yoga state ${from}, lasted for ${frame_duration} and changed to ${to}`);
    }
    else if(message.toLowerCase().includes('yoga predicted')){
      // has poses, confidences, text_suggestion for now
      // @ts-ignore
      const {poses, confidences, ...__remaining} = rest;
      console.log(`Yoga was predicted.\nSome top predictions were ${poses}\nThe confidences are ${confidences}'`);

      // Also trigger gradio api running by just toggling the `signal`
      //set_capture_gradio_signal(!capture_gradio_signal);
      if(gradio_mesh_integrator_ref.current){
	gradio_mesh_integrator_ref.current.run_gradio_inference();
      }
    }
    else if(message.toLowerCase().includes('yoga text feedback')){
      console.log(`Message [${timestamp}] RTT = ${rtt/1000}`);
      // @ts-ignore
      const {text_suggestion, ...__remaining} = rest;
      console.log(`You should be doing this: '${text_suggestion}'`);
    }
    else if(message.toLowerCase().includes('yoga voice feedback')){
      console.log(`Message [${timestamp}] RTT = ${rtt/1000}`);
      // @ts-ignore
      const {voice_suggestion, ...__remaining} = rest;
      console.log(`The length of voice suggestion was ${voice_suggestion.length}`);
      // Decode base64 audio
      const audioSrc = `data:audio/wav;base64,${voice_suggestion}`;
      
      // Create an audio element and play it
      const audio = new Audio(audioSrc);
      audio.play();
    }
    else if(message.toLowerCase().includes('clip count')){
      // has just clip_count
      // @ts-ignore
      const {clip_count, ...__remaining} = rest;
      console.log(`There are currently ${clip_count} clips.`)
    }
    else if(message.toLowerCase().includes('draw line landmarks')){
    // @ts-ignore
      const {landmark_type, landmarks, ...__remaining} = rest;
      // TODO:: validate the `landmarks` being of proper shape maybe
      // console.log(`The landmarks were received of type "${landmark_type}", type of landmarks object is "${typeof landmarks}"`);
      capture_canvas();
      landmarks.forEach(([start, end]: [any, any]) => {
	const [sx, sy] = start;
	const [ex, ey] = end;
	const vcanv = video_canvas_ref.current;
	if(vcanv){
	  vcanv.drawLine(
	    {x: sx, y: sy},
	    {x: ex, y: ey},
	    '#0000ff',
	  );
	}
      });
    }
    else {
      console.log(`An unknown message of type "${message}" was received`);
    }
  };


  const [streamer, setStreamer] = useState<ReturnType<typeof make_video_stream>>({startStreaming:()=>{}, stopStreaming:()=>{}});

  // Might need to reload this after video src changes
  useEffect(() => {
    if(videoRef1.current){
      setStreamer(make_video_stream({
	endpoint: `${apiUrl}wsprocess_frame`,
	video_ref: videoRef1,
	rate_ms:ms_gap,
	on_send:filter_args,
	on_receive:handle_receive,
      }));
    }
    return () => {
      stop_streaming();
    };
  }, [videoRef1, apiUrl]);
  
  const start_streaming = () => {
    //set_is_first(true);
    //is_first.current = true;
    additional_args.current = { 'fps': 1000/ms_gap };
    streamer.startStreaming();
  };
  const stop_streaming = () => {
    streamer.stopStreaming();
  };

  // Setup for features
  const [clipNumber, setClipNumber] = useState(0);

  const [view, setView] = useState('videoDrawer');

  const handleViewChange = (_event: any, newView: any) => {
    if (newView !== null) {
      setView(newView);
    }
  };
  
  return (
    <div>
	      <TextField
  label="Enter Gradio API Url"
  type="string"
  value={gradio_api_url}
  onChange={(e) => set_gradio_api_url(e.target.value)}
  variant="outlined"
  sx={{ mr: 2 }}
	      />
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={handleViewChange}
        aria-label="View Toggle"
      >
        <ToggleButton value="videoDrawer" aria-label="Video Drawer">
          Mediapipe Skeleton
        </ToggleButton>
        <ToggleButton value="gradioMeshIntegrator" aria-label="Gradio Mesh Integrator">
          Gradio Mesh
        </ToggleButton>
      </ToggleButtonGroup>
      <div style={{ display: 'flex' , width: '100%'}}>
	<video controls ref={videoRef1} src={videoSrc1 ?? ""} style={{ flex: 1 }} />
	      {view === 'videoDrawer' ? (
		<VideoDrawer ref={video_canvas_ref} srcVideoRef={videoRef1} style={{flex:1}} />
	      ) : (
		<GradioMeshIntegrator
		  style={{flex:1}}
		  ref={gradio_mesh_integrator_ref}
		  gradio_url={gradio_api_url}
		  video_elem_ref={videoRef1}
		/>
	      )}
      </div>

      <input
        type="file"
        accept="video/*"
        onChange={handleFileSelect1}
        ref={fileInputRef1}
        style={{ display: "none" }}
      />
      
      <Button
        variant="outlined"
        onClick={ () => {
	  if (fileInputRef1.current) {
	    fileInputRef1.current.click();
	  }
	}}
        sx={{ mr: 2 }}
      >
        Upload Video
      </Button>
      

      <Button
	variant="outlined"
	onClick={handleWebcamToggle}
	sx={{ mr: 2 }}
      >
	{isWebcamActive ? 'Stop Webcam' : 'Use Webcam'}
      </Button>

      <Button
        variant="outlined"
        onClick={start_streaming}
        sx={{ mr: 2 }}
      >
        Start Streaming
      </Button>
      <Button
        variant="outlined"
        onClick={() => { additional_args.current = { 'reset': '' }; }}
        sx={{ mr: 2 }}
      >
        Reset Streaming
      </Button>

      <Button
        variant="outlined"
        onClick={stop_streaming}
        sx={{ mr: 2 }}
      >
        Stop Streaming
      </Button>

      {/*

      <Button
        variant="outlined"
        onClick={capture_canvas}
        sx={{ mr: 2 }}
      >
        Capture Into Canvas
      </Button>
      
      <Button
        variant="outlined"
        onClick={make_line}
        sx={{ mr: 2 }}
      >
        Draw Line on Canvas
      </Button>

      <Button
        variant="outlined"
        onClick={() => {
	  additional_args.current = {
	    'clip_here': ''
	  };
	}}
        sx={{ mr: 2 }}
      >
        Clip Here
      </Button>
      <Button
        variant="outlined"
        onClick={() => {
	  additional_args.current = {
	    'clip_count': ''
	  };
	}}
        sx={{ mr: 2 }}
      >
        Get Clips Count
      </Button>
	    <div>
	      <TextField
  label="Enter Clip Number"
  type="number"
  value={clipNumber}
  onChange={(e) => setClipNumber(parseInt(e.target.value))}
  variant="outlined"
  sx={{ mr: 2 }}
	      />
	      <Button
  variant="outlined"
  onClick={()=>{additional_args.current= { 'get_clip' : clipNumber  };}}
  sx={{ mr: 2 }}
	      >
  Get Clip
	      </Button>
	    </div>
	*/}
    </div>
  );
};

interface VideoStreamer {
  h: number,
};

export default VideoStreamer;
