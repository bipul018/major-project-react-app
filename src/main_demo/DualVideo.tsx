
import React, { useState, useRef, forwardRef, Ref, useImperativeHandle } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import Streamer from "./Streamer.tsx";

export interface DualVideoProps {
  title: string;
  onVideo1Change?: (file: File | null) => Promise<void>;
  height?: string | null;
}

export interface DualVideoRef {
  getVideoData: () => { src1: string | null; src2: string | null };
  setVideo1: (data_url: string | null) => void;
  setVideo2: (data_url: string | null) => void;
}

export const DualVideo = forwardRef(
  (props: DualVideoProps, ref: Ref<DualVideoRef>) => {
    const [videoSrc1, setVideoSrc1] = useState<string | null>(null);
    const [videoSrc2, setVideoSrc2] = useState<string | null>(null);

    const videoRef1 = useRef<HTMLVideoElement>(null);
    const videoRef2 = useRef<HTMLVideoElement>(null);
    
    const fileInputRef1 = useRef<HTMLInputElement>(null);
    const fileInputRef2 = useRef<HTMLInputElement>(null);
    
    const handleFileSelect1 = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (props.onVideo1Change) {
          props.onVideo1Change(file);
        }
        setVideoSrc1(URL.createObjectURL(file));
      }

  //useEffect(() => {
  //  return () => {
  //    if (videoSrc1) URL.revokeObjectURL(videoSrc1);
  //    if (videoSrc2) URL.revokeObjectURL(videoSrc2);
  //  };
  //}, [videoSrc1, videoSrc2]);
    };

    const handleFileSelect2 = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setVideoSrc2(URL.createObjectURL(file));
      }
    };

    useImperativeHandle(ref, () => ({
      getVideoData: () => {
        return {
          src1: videoSrc1,
          src2: videoSrc2,
        };
      },
      setVideo1: (data_url: string | null) => {
        setVideoSrc1(data_url);
      },
      setVideo2: (data_url: string | null) => {
        setVideoSrc2(data_url);
      },
    }));

    const handlePlayPause = () => {
      const videos = [videoRef1.current, videoRef2.current];
      const arePaused = videos.every((video) => (video ? video.paused : true));

      if (arePaused) {
        videos.forEach((video) => video && video.play());
      } else {
        videos.forEach((video) => video && video.pause());
      }
    };

    const handleReset = () => {
      if (videoRef1.current) {
        videoRef1.current.currentTime = 0;
        videoRef1.current.pause();
      }
      if (videoRef2.current) {
        videoRef2.current.currentTime = 0;
        videoRef2.current.pause();
      }
    };

    return (
      <Box sx={{ height: props.height ?? "auto" }}>
        <Typography variant="h6" gutterBottom>
          {props.title}
        </Typography>
        <Box mb={2}>
          <Button variant="contained" onClick={handlePlayPause} sx={{ mr: 2 }}>
            Play/Pause
          </Button>
          <Button variant="contained" onClick={handleReset}>
            Reset
          </Button>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <video controls ref={videoRef1} style={{ width: "100%" }} src={videoSrc1 ?? ""} />
          </Grid>
          <Grid item xs={12} md={6}>
            <video controls ref={videoRef2} style={{ width: "100%" }} src={videoSrc2 ?? ""} />
          </Grid>
        </Grid>
        <Box mt={2}>
	  {/* Styled File Input for Video 1 */}
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
            Upload Video 1
          </Button>

          {/* Styled File Input for Video 2 */}
          <input
            type="file"
            accept="video/*"
            onChange={handleFileSelect2}
            ref={fileInputRef2}
            style={{ display: "none" }}
          />
          <Button
            variant="outlined"
            onClick={() => {
	      if (fileInputRef2.current) {
		fileInputRef2.current.click();
	      }
	    }}
          >
            Upload Video 2
          </Button>
	  <Streamer videoRef={videoRef1}/>
        </Box>
      </Box>
    );
  }
); 
export default DualVideo;
