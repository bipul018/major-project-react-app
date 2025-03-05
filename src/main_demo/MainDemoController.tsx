import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { taskItems } from '../main_demo/taskItems';
import { TaskListWithDropdown } from '../main_demo/ChooseTask';
import { StreamDemo } from '../main_demo/Streamer';

// Root component managing URL and mode toggling
export const MainDemoController = () => {
  const [url, setUrl] = useState("http://localhost:8080/");
  const [mode, setMode] = useState<'task' | 'stream'>('stream');

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <TextField
              fullWidth
              label="API URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <Button 
              variant="contained" 
              fullWidth
              onClick={() => setMode(m => m === 'task' ? 'stream' : 'task')}
            >
              {mode === 'task' ? 'Switch to Stream Mode' : 'Switch to Task Mode'}
            </Button>
          </Grid>
        </Grid>
      </Box>

      {mode === 'task' ? (
        <TaskListWithDropdown 
          taskItems={taskItems}
          apiUrl={url}
        />
      ) : (
        <StreamDemo 
          apiUrl={url}
        />
      )}
    </Box>
  );
};

export default MainDemoController;
