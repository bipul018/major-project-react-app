import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  MenuItem,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem,
} from "@mui/material";
import { sendPostRequest, FormComponent } from "./RequestMaker.tsx";
import { taskItems as gTaskItems, RequestInputType } from "./taskItems.ts";
import { DualVideo } from "./DualVideo.tsx";


interface BackendResponse{
    type: "string" | "list" | "map" | "none";
    data: any;
}

const renderResponseDetails = (responseDetails: BackendResponse) => {
  switch (responseDetails.type) {
    case "string":
      return (
        <Typography variant="body1" sx={{ mt: 2 }}>
          <strong>Response:</strong> {responseDetails.data}
        </Typography>
      );
    case "list":
      return (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            <strong>Response:</strong>
          </Typography>
          <List>
            {responseDetails.data.map((item: any, index: number) => (
	      <ListItem key={index}>{item}</ListItem>
            ))}
          </List>
        </Box>
      );
    case "map":
      return (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            <strong>Response:</strong>
          </Typography>
          <TableContainer component={Paper}>
            <Table>
	      <TableHead>
                <TableRow>
                  <TableCell>Key</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
	      </TableHead>
	      <TableBody>
                {Object.entries(responseDetails.data).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell>{key}</TableCell>
                    <TableCell>{String(value)}</TableCell>
                  </TableRow>
                ))}
	      </TableBody>
            </Table>
          </TableContainer>
        </Box>
      );
    case "none":
    default:
      return null;
  }
};

// Convert Blob/URL to File object
const convertToFile = async (src: any, defaultName = "video.mp4") => {
  try {
    // If src is already a File, return it
    if (src instanceof File) return src;
    // If src is a Blob URL
    if (src.startsWith("blob:")) {
      const response = await fetch(src);
      const blob = await response.blob();
      return new File([blob], defaultName, { type: blob.type });
    }
    // If src is a base64 data URL
    if (src.startsWith("data:")) {
      const [header, data] = src.split(",");
      const type = header.split(";")[0].split(":")[1];
      const binary = atob(data);
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }
      return new File([array], defaultName, { type });
    }
    throw new Error("Unsupported source format");
  } catch (error) {
    console.error("Error converting to File:", error);
    return null;
  }
};


export const TaskListWithDropdown: React.FC<{
  taskItems: Array<{ endpoint: string; request_fields: RequestInputType[] }>;
}> = ({ taskItems }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>(taskItems[0].endpoint);
  const [url, setUrl] = useState<string>("http://localhost:8080/");
  const videoComponentRef = useRef<any>(null);

  const [responseDetails, setResponseDetails] = useState<BackendResponse>({ type: "none", data: null });


  const handleVideo1Change = async (file: File | null) => {
    if (file) {
      const result = await sendPostRequest(
	// TODO:: Does this url is always the uptodate thing or does it lag by the last state update ?
        gTaskItems.find((it) => it.endpoint == "task/save_video")?.request_fields as RequestInputType[],
        { video: file },
        url + "task/save_video"
      );
      handleTaskResponse(result);
    }
  };

  const handleExchangeVideos = async () => {
    if (videoComponentRef.current) {
      const data = videoComponentRef.current.getVideoData();
      videoComponentRef.current.setVideo1(data.src2);
      videoComponentRef.current.setVideo2(data.src1);

      if (data.src2) {
        handleVideo1Change(await convertToFile(data.src2));
      }
    }
  };

  const handleTaskResponse = (response: { status: "Success" | "Error"; value: any }) => {
    if (response.status === "Success") {
      if (response.value && typeof response.value === "object" && response.value.bytes) {
	console.log(`Success: Bytes length is ${response.value.bytes.length}`);
	// TODO:: Remove this redundant code
	const data = response.value.bytes;

	const videoUrl = `data:${response.value.type};base64,${data}`;
	console.log(`The video url is : ${videoUrl}`);
	if (videoComponentRef.current) {
          videoComponentRef.current.setVideo2(videoUrl);
	}
      } else {
	// Determine the type of response value
	if (typeof response.value === "string") {
          setResponseDetails({ type: "string", data: response.value });
	} else if (Array.isArray(response.value)) {
          setResponseDetails({ type: "list", data: response.value });
	} else if (typeof response.value === "object") {
	  // TODO:: Detect cases where some typed value was still returned
          setResponseDetails({ type: "map", data: response.value });
	} else {
          setResponseDetails({ type: "none", data: null });
	}
	
	handleGetVideo();
	console.log(`Success: ${response.value}`);
      }
    } else if (response.status === "Error") {
      setResponseDetails({ type: "none", data: null });
      console.error(`Error: ${response.value}`);
    }
  };


  const handleGetVideo = async () => {
    const response = await sendPostRequest(
      gTaskItems.find((it) => it.endpoint == "task/get_video")?.request_fields as RequestInputType[],
      {},
      // TODO:: Does this url is always the uptodate thing or does it lag by the last state update ?
      url + "task/get_video"
    );
    if (response.status === "Success" && response.value.bytes) {
      const data = response.value.bytes;

      const videoUrl = `data:${response.value.type};base64,${data}`;
      //console.log(`The video url is : ${videoUrl}`);
      if (videoComponentRef.current) {
        videoComponentRef.current.setVideo2(videoUrl);
      }
    }
  };

  const handleDropdownChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedEndpoint(e.target.value as string);
  };

  const selectedTask = taskItems.find((it) => it.endpoint === selectedEndpoint);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        The request form field is:
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Select an endpoint"
            value={selectedEndpoint || ""}
            onChange={handleDropdownChange}
          >
            {taskItems.map((it) => (
              <MenuItem key={it.endpoint} value={it.endpoint}>
                {it.endpoint}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </Grid>
      </Grid>

      {selectedTask && (
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Endpoint: {selectedTask.endpoint}
          </Typography>
          <FormComponent
            endpoint={selectedTask.endpoint}
            fields={selectedTask.request_fields}
            onResponse={handleTaskResponse}
            overrides={{
              url: () => url,
              ...(selectedTask.request_fields
                .filter((field) => field.type === "video" && field.nullable)
                .reduce((acc, field) => {
                  acc[field.field_name] = null;
                  return acc;
                }, {} as Record<string, null>)),
            }}
          />
	  {renderResponseDetails(responseDetails)}
          <DualVideo
            ref={videoComponentRef}
            title="Source and Processed Videos"
            onVideo1Change={handleVideo1Change}
          />
          <Button variant="contained" onClick={handleExchangeVideos} sx={{ mt: 2 }}>
            Exchange Videos
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TaskListWithDropdown;
