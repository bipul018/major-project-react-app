import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Button, Box, TextField, MenuItem, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';

export interface StreamEvent {
  timestamp: number;
  frameData: string;
  yogaPose?: { pose: string; confidence: number };
  yogaPoseDelay?: number;
  textFeedback?: string;
  textFeedbackDelay?: number;
  audioFeedback?: string;
  audioFeedbackDelay?: number;
  landmarks?: Array<[[number, number], [number, number]]>;
  gradioMesh?: any;
}

export interface StreamEventManagerHandle {
  addEvent: (timestamp: number, videoElement: HTMLVideoElement) => void;
  editEvent: <K extends keyof StreamEvent>(timestamp: number, key: K, value: StreamEvent[K]) => void;
  clearEvents: () => void;
}

interface StreamEventManagerProps {
  videoDrawerRef: React.RefObject<any>;
  gradioMeshRef: React.RefObject<any>;
}

const StreamEventManager = forwardRef<StreamEventManagerHandle, StreamEventManagerProps>(
  ({ videoDrawerRef, gradioMeshRef }, ref) => {
    const [events, setEvents] = useState<StreamEvent[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<StreamEvent | null>(null);

    useImperativeHandle(ref, () => ({
      addEvent: (timestamp, videoElement) => {
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        canvas.getContext('2d')?.drawImage(videoElement, 0, 0);
        
        setEvents(prev => [
          ...prev,
          {
            timestamp,
            frameData: canvas.toDataURL('image/jpeg'),
          }
        ]);
      },

      editEvent: (timestamp, key, value) => {
        setEvents(prev => prev.map(event => 
          event.timestamp === timestamp ? { ...event, [key]: value } : event
        ));
      },

      clearEvents: () => setEvents([])
    }));

    return (
      <Box sx={{ width: '100%' }}>
        <TextField
          select
          fullWidth
          label="Select Event"
          value={selectedEvent?.timestamp || ''}
          onChange={(e) => setSelectedEvent(
            events.find(ev => ev.timestamp === Number(e.target.value)) || null
	  )}
        >
          {events.map(event => (
            <MenuItem key={event.timestamp} value={event.timestamp}>
              {new Date(event.timestamp).toLocaleTimeString()} - 
              {event.yogaPose?.pose || 'Event'}
            </MenuItem>
          ))}
        </TextField>

        {selectedEvent && (
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            {/* Frame Preview */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">Captured Frame</Typography>
              <img 
                src={selectedEvent.frameData} 
                alt="Captured frame" 
                style={{ maxWidth: '100%' }}
              />
            </Box>

            {/* Event Details */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">Event Details</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    {selectedEvent.yogaPose && (
                      <TableRow>
                        <TableCell>Yoga Pose</TableCell>
                        <TableCell>
                          {selectedEvent.yogaPose.pose} ({selectedEvent.yogaPose.confidence.toFixed(2)})
                        </TableCell>
                      </TableRow>
                    )}

                    {selectedEvent.textFeedback && (
                      <TableRow>
                        <TableCell>Feedback</TableCell>
                        <TableCell>{selectedEvent.textFeedback}</TableCell>
                      </TableRow>
                    )}

		    {/* Audio Player: Render only if audioFeedback exists */}
		    {selectedEvent.audioFeedback && (
                      <Box sx={{ mt: 2 }}>
			<Typography variant="h6">Audio Feedback</Typography>
			<audio controls>
			  <source
			    src={`${selectedEvent.audioFeedback}`}
			    type="audio/wav"
			  />
			  Your browser does not support the audio element.
			</audio>
                      </Box>
		    )}		    
	
                    {selectedEvent.yogaPoseDelay && (
                      <TableRow>
                        <TableCell>Yoga Pose RTT</TableCell>
                        <TableCell>
			  {selectedEvent.yogaPoseDelay/1000} s
                        </TableCell>
                      </TableRow>
                    )}

		    {selectedEvent.textFeedbackDelay && (
                      <TableRow>
                        <TableCell>Text Feedback RTT</TableCell>
                        <TableCell>
			  {selectedEvent.textFeedbackDelay/1000} s
                        </TableCell>
                      </TableRow>
		    )}

		    {selectedEvent.audioFeedbackDelay && (
                      <TableRow>
                        <TableCell>Voice Feedback RTT</TableCell>
                        <TableCell>
			  {selectedEvent.audioFeedbackDelay/1000} s
                        </TableCell>
                      </TableRow>
		    )}

		    {selectedEvent.gradioMesh && (
                      <TableRow>
                        <TableCell>Human Mesh Model</TableCell>
                        <TableCell>
			  <Button variant="outlined"
  onClick={()=>{
    gradioMeshRef.current?.override_mesh_data(selectedEvent.gradioMesh);
  }}
  sx={{ mr: 2 }}>
  Show Mesh
</Button>

                        </TableCell>
                      </TableRow>
		    )}

                    {/* Add more rows for other data types */}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Add additional visualization components as needed */}
            </Box>
          </Box>
        )}
      </Box>
    );
  }
);

export default StreamEventManager;
