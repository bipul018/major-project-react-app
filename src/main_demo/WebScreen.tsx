import React, { useState } from 'react';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { taskItems, RequestUnitType } from './taskItems';

const WebScreen: React.FC<{ title: string }> = ({ title }) => {
  const [currentTask, setCurrentTask] = useState(taskItems[4]);
  const [responseText, setResponseText] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const { control, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    const url = `http://${data.hostname}:${data.port || ''}`;
    const endpoint = `${url}/${currentTask.endpoint}`;

    const formData = new FormData();
    currentTask.request_fields.forEach((field) => {
      if (field.type === RequestUnitType.Video && data[field.field_name]) {
	formData.append(field.field_name, data[field.field_name]);
      } else if (data[field.field_name]) {
	formData.append(field.field_name, data[field.field_name]);
      }
    });

    try {
      const response = await axios.post(endpoint, formData, {
	headers: { 'Content-Type': 'multipart/form-data' },
      });
      const jsonresp = response.data;

      if (jsonresp.status.toLowerCase() === 'error') {
	alert('The task resulted in an error!!');
      } else {
	alert('The task was completed successfully!!');
      }

      if (jsonresp.value && jsonresp.value.type === 'video/mp4') {
	const videoBytes = atob(jsonresp.value.bytes);
	const videoBlob = new Blob([new Uint8Array(videoBytes.length).map((_, i) => videoBytes.charCodeAt(i))], { type: 'video/mp4' });
	setVideoUrl(URL.createObjectURL(videoBlob));
      } else {
	setResponseText(JSON.stringify(jsonresp.value));
      }
    } catch (error) {
      console.error('Error submitting task:', error);
    }
  };

  return (
    <div>
	    <h1>{title}</h1>
	    <form onSubmit={handleSubmit(onSubmit)}>
  <Controller
    name="hostname"
    control={control}
    defaultValue=""
    render={({ field }) => <input {...field} placeholder="Hostname/IP/URL" />}
  />
  <Controller
    name="port"
    control={control}
    defaultValue=""
    render={({ field }) => <input {...field} placeholder="Port (optional)" />}
  />
  <select
    value={currentTask.endpoint}
    onChange={(e) => {
      const selectedTask = taskItems.find((task) => task.endpoint === e.target.value);
      if (selectedTask) setCurrentTask(selectedTask);
    }}
  >
		    {taskItems.map((task) => (
		      <option key={task.endpoint} value={task.endpoint}>
			    {task.endpoint}
		      </option>
		    ))}
  </select>
  {currentTask.request_fields.map((field) => (
    <Controller
      key={field.field_name}
      name={field.field_name}
      control={control}
      defaultValue=""
      render={({ field: controllerField }) => (
	<div>
	  <label>{field.field_name}</label>
	  {field.type === RequestUnitType.Video ? (
	    <input
	      type="file"
	      accept="video/*"
	      onChange={(e) => controllerField.onChange(e.target.files?.[0])}
	    />
	  ) : (
	    <input
	      type={field.type === RequestUnitType.Integer ? 'number' : 'text'}
	      {...controllerField}
	    />
	  )}
			    </div>
      )}
    />
  ))}
  <button type="submit">Send Request</button>
	    </form>
	    {videoUrl ? (
	      <video controls src={videoUrl} />
	    ) : (
	      <pre>{responseText}</pre>
	    )}
    </div>
  );
};

export default WebScreen;
