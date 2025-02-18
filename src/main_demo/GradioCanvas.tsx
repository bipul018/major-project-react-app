import React, { useEffect, useState, useRef } from 'react';
import { Client } from '@gradio/client';

interface GradioCanvasProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  timerInterval: number;
  gradioUrl: string;
}

const GradioCanvas: React.FC<GradioCanvasProps> = ({
  videoRef,
  timerInterval,
  gradioUrl
}) => {
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gradioClient = useRef<Client | null>(null);

  // Initialize Gradio client
  useEffect(() => {
    Client.connect(gradioUrl)
      .then(client => {
        gradioClient.current = client;
      })
      .catch(err => {
        setError('Failed to connect to Gradio API');
        console.error('Gradio connection error:', err);
      });
  }, [gradioUrl]);

  // Capture and process frames
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video || !gradioClient.current) return;

    const captureAndProcessFrame = async () => {
      if (isProcessing || video.paused || video.ended) return;

      try {
        setIsProcessing(true);
        
        // Capture frame from video
        const context = canvas.getContext('2d');
        if (!context) return;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to base64 image
        const imageData = canvas.toDataURL('image/jpeg');

        // Send to Gradio API
	console.log("Going to predict through gradio....")
        const result = await gradioClient.current!.predict("/predict", [imageData]);
        const [processedImage] = result.data;
        
	console.log(`... and we've predicted as a type ${typeof result}=> ${typeof processedImage}`);

        setProcessedImage(processedImage);
        setError(null);
      } catch (err) {
        setError('Error processing frame');
        console.error('Processing error:', err);
      } finally {
        setIsProcessing(false);
      }
    };

    intervalId = setInterval(captureAndProcessFrame, timerInterval);

    return () => clearInterval(intervalId);
  }, [timerInterval, videoRef, isProcessing]);

  return (
    <div className="video-processor">
      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Status indicators */}
      {error && <div className="error">{error}</div>}
      {isProcessing && <div className="status">Processing frame...</div>}

      {/* Results display */}
      {processedImage && (
        <div className="results">
          <h3>Processed Frame</h3>
          <img 
            src={processedImage} 
            alt="Processed frame" 
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
      )}
    </div>
  );
};

export default GradioCanvas;
