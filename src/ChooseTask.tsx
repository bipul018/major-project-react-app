import {FormComponent} from './RequestMaker.tsx';
import {RequestInputType} from './taskItems.ts';

export const TaskListWithDropdown: React.FC<{ taskItems: Array<{ endpoint: string; request_fields: RequestInputType[] }> }> = ({ taskItems }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>(taskItems[0].endpoint);

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

      {selectedTask && (
        <div>
          <h4>Endpoint: {selectedTask.endpoint}</h4>
          <FormComponent endpoint={selectedTask.endpoint} fields={selectedTask.request_fields}
	    onResponse = {(r: any) => {console.log("Response was" +
	      JSON.stringify(r));}}/>
        </div>
      )}
    </div>
  );
};

export default TaskListWithDropdown;

//import React, { useState, useRef, forwardRef, Ref, useImperativeHandle, useEffect } from 'react';
import React, { useState, forwardRef, Ref, useImperativeHandle, useEffect } from 'react';

export interface VideoComponentProps {
  // Props can be added here later
  title: string
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
      setVideoSrc1(URL.createObjectURL(file));
    }
  };

  const handleFileSelect2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoSrc2(URL.createObjectURL(file));
    }
  };

  const exchangeVideos = () => {
    setVideoSrc1(videoSrc2);
    setVideoSrc2(videoSrc1);
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
      <button onClick={exchangeVideos}>Exchange Videos</button>
    </div>
  );
});



