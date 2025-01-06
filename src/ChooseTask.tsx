import React, { useState, useRef, forwardRef, Ref, useImperativeHandle } from 'react';
import {sendPostRequest, FormComponent} from './RequestMaker.tsx';
import {taskItems as gTaskItems, RequestInputType} from './taskItems.ts';

export const TaskListWithDropdown: React.FC<{ taskItems: Array<{ endpoint: string; request_fields: RequestInputType[] }> }> = ({ taskItems }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>(taskItems[0].endpoint);
  const [url, setUrl] = useState<string>("http://localhost:8080/");
  const videoComponentRef = useRef<any>(null);

  const handleVideo1Change = async (file: File | null) => {
    if (file) {
      const result = await sendPostRequest(
	gTaskItems.find(it => it.endpoint == "task/save_video")?.request_fields as RequestInputType[],
	{"video": file},
	url + "task/save_video");
      // TODO:: Does this url is always the uptodate thing or does it lag by the last state update ?
      handleTaskResponse(result);
    }
  };

  const handleExchangeVideos = async () => {
    if (videoComponentRef.current) {
      const data = videoComponentRef.current.getVideoData();
      videoComponentRef.current.setVideo1(data.src2);
      videoComponentRef.current.setVideo2(data.src1);

      if (data.src2) {
        //handleVideo1Change(new File({fileName : data.src2}));
	handleVideo1Change(await convertToFile(data.src2));
      }
    }
  };

  // TODO:: Instead of printing in console, print somewhere in HTML
  const handleTaskResponse = (response: { status: 'Success' | 'Error'; value: any }) => {
    if (response.status === 'Success') {
      if (response.value && typeof response.value === 'object' && response.value.bytes) {
        console.log(`Success: Bytes length is ${response.value.bytes.length}`);
      } else {
        console.log(`Success: ${response.value}`);
      }
      handleGetVideo();
    } else if (response.status === 'Error') {
      console.error(`Error: ${response.value}`);
    }
  };

  // Convert Blob/URL to File object
  const convertToFile = async (src: any, defaultName = 'video.mp4') => {
    try {
      // If src is already a File, return it
      if (src instanceof File) return src;

      // If src is a Blob URL
      if (src.startsWith('blob:')) {
        const response = await fetch(src);
        const blob = await response.blob();
        return new File([blob], defaultName, { type: blob.type });
      }

      // If src is a base64 data URL
      if (src.startsWith('data:')) {
        const [header, data] = src.split(',');
        const type = header.split(';')[0].split(':')[1];
        const binary = atob(data);
        const array = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          array[i] = binary.charCodeAt(i);
        }
        return new File([array], defaultName, { type });
      }

      throw new Error('Unsupported source format');
    } catch (error) {
      console.error('Error converting to File:', error);
      return null;
    }
  };

  const handleGetVideo = async () => {
    const result = await sendPostRequest(
      gTaskItems.find(it => it.endpoint == "task/get_video")?.request_fields as RequestInputType[],
      {},
      url + "task/get_video");
    // TODO:: Does this url is always the uptodate thing or does it lag by the last state update ?
    if (result.status === 'Success' && result.value.bytes) {

      const data = result.value.bytes;
      const counteq = (data.match(/=+/g) || []).length;
      const sdata = data.replace(/=+$/, '');

      console.log(`The video had ${counteq} = at end`);
      //const videoBytes = atob(result.value.bytes);
      //const videoBlob = new Blob([new Uint8Array(videoBytes.length).map((_, i) => videoBytes.charCodeAt(i))], { type: result.value.type});
      //const videoUrl = URL.createObjectURL(videoBlob);
      const videoUrl = `data:${result.value.type};base64,${sdata}`;
      //const videoUrl = `data:${result.value.type};base64,${data}`;
      console.log(`The video url is : ${videoUrl}`);
      if (videoComponentRef.current) {
        videoComponentRef.current.setVideo2(videoUrl);
      }
    }
  };


  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEndpoint(e.target.value);
  };

  const selectedTask = taskItems.find((it) => it.endpoint === selectedEndpoint);

  return (
    <div>
      <h3>The request form field is:</h3>
      <div>
        <label htmlFor="task-dropdown">Select an endpoint: </label>
        <select id="task-dropdown" onChange={handleDropdownChange} value={selectedEndpoint || ''}>
          <option value="" disabled>
            Choose an endpoint
          </option>
          {taskItems.map((it) => (
            <option key={it.endpoint} value={it.endpoint}>
              {it.endpoint}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>URL: </label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      
      {selectedTask && (
        <div>
          <h4>Endpoint: {selectedTask.endpoint}</h4>
          <FormComponent endpoint={selectedTask.endpoint} fields={selectedTask.request_fields}
            onResponse={handleTaskResponse}
	    overrides={{
              url: () => url,
              ...(selectedTask.request_fields
                .filter((field) => field.type === 'video' && field.nullable)
                .reduce((acc, field) => {
                  acc[field.field_name] = null;
                  return acc;
                }, {} as Record<string, null>)),
            }}
	  />
	  
	  <VideoComponent
            ref={videoComponentRef}
            title="This is a double video example."
            onVideo1Change={handleVideo1Change}
	  />
	  <button onClick={handleExchangeVideos}>Exchange Videos</button>
        </div>
      )}
    </div>
  );
};

export default TaskListWithDropdown;

//import React, { useState, useRef, forwardRef, Ref, useImperativeHandle, useEffect } from 'react';
//import React, { useState, forwardRef, Ref, useImperativeHandle, useEffect } from 'react';

export interface VideoComponentProps {
  // Props can be added here later
  title: string,
  onVideo1Change?: (file: File | null) => Promise<void>,
}

export interface VideoComponentRef {
  getVideoData: () => { src1: string | null; src2: string | null };
  setVideo1: (data_url: string|null) => void;
  setVideo2: (data_url: string|null) => void;
}

export const VideoComponent = forwardRef((props: VideoComponentProps, ref: Ref<VideoComponentRef>) => {
  const [videoSrc1, setVideoSrc1] = useState<string | null>(null);
  const [videoSrc2, setVideoSrc2] = useState<string | null>(null);

  const handleFileSelect1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if(props.onVideo1Change){
	props.onVideo1Change(file);
      }
      setVideoSrc1(URL.createObjectURL(file));
    }
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
    setVideo1: (data_url: string|null) => {
      setVideoSrc1(data_url);
    },
    setVideo2: (data_url: string|null) => {
      setVideoSrc2(data_url);
    },
  }));

  //useEffect(() => {
  //  return () => {
  //    if (videoSrc1) URL.revokeObjectURL(videoSrc1);
  //    if (videoSrc2) URL.revokeObjectURL(videoSrc2);
  //  };
  //}, [videoSrc1, videoSrc2]);

  return (
    <div>
      <h2> {props.title} </h2>
      <div style={{ display: 'flex' }}>
        <video controls style={{ width: '50%' }} src={videoSrc1??""} />
        <video controls style={{ width: '50%' }} src={videoSrc2??""} />
      </div>
      <div>
        <input type="file" accept="video/*" onChange={handleFileSelect1} />
        <input type="file" accept="video/*" onChange={handleFileSelect2} />
      </div>
    </div>
  );
});



