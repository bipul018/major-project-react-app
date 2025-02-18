import React, {
  forwardRef,
  useEffect,
  useRef,
  useImperativeHandle,
  useCallback,
} from 'react';

interface VideoDrawerProps {
  srcVideoRef: React.RefObject<HTMLVideoElement>;
  //updateInterval?: number;
  //width?: number;
  //height?: number;
}

export interface VideoDrawerHandle {
  drawLine: (
    start: { x: number; y: number },
    end: { x: number; y: number },
    color?: string,
    width?: number
  ) => void;
  clearCanvas: () => void; // also updates the canvas
  getCanvas: () => HTMLCanvasElement | null;
}

const VideoDrawer = forwardRef<VideoDrawerHandle, VideoDrawerProps>(
  (
    { srcVideoRef/*, updateInterval = 100*//*, width = 640, height = 480*/ },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);

    // Initialize video and canvas
    useEffect(() => {
      const video = srcVideoRef.current;
      const canvas = canvasRef.current;
      
      if (!video || !canvas) return;

      console.log(`Made the canvas with width ${video.videoWidth} and height ${video.videoHeight}`);

      // Set up canvas context
      contextRef.current = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      //video.play().catch(error => {
      //  console.error('Error playing video:', error);
      //});
    }, [srcVideoRef/*, width, height*/]);

    // Update canvas from video at intervals
    /*useEffect(() => {
      const video = srcVideoRef.current;
      const canvas = canvasRef.current;
      const ctx = contextRef.current;
      
      if (!video || !canvas || !ctx) return;

      const interval = setInterval(() => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }, updateInterval);

      return () => clearInterval(interval);
      }, [updateInterval]);*/

    // Drawing methods
    const drawLine = useCallback(
      (
        start: { x: number; y: number },
        end: { x: number; y: number },
        color = '#ff0000',
        width = 2
      ) => {
        const ctx = contextRef.current;
        if (!ctx) return;

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();
      },
      []
    );

    const clearCanvas = useCallback(() => {
      const ctx = contextRef.current;
      const canvas = canvasRef.current;
      if (!ctx || !canvas) return;

      const video = srcVideoRef.current;
      if(!video){
	console.log("The canvas was cleared with blank color");
	ctx.clearRect(0, 0, canvas.width, canvas.height);	
      }
      else {
	//console.log(`The canvas was cleared with image with width ${video.videoWidth} and height ${video.videoHeight}`);
	canvas.width = video.videoWidth;
	canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);	
      }
      //const interval = setInterval(() => {
      //  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      //}, updateInterval);
    }, [srcVideoRef, canvasRef]);

    const getCanvas = useCallback(() => canvasRef.current, []);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      drawLine,
      clearCanvas,
      getCanvas,
    }));


    // return (
    //   <div style={{ position: 'relative' }}>
    //     {/*<video
    //       ref={videoRef}
    //       style={{ display: 'none' }}
    //       muted
    //       playsInline
    //       />*/}
    return (
        <canvas
          ref={canvasRef}
          style={{ border: '1px solid #ccc' }}
        />

    );
  }
);



export default VideoDrawer;
