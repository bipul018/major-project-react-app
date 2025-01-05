//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'

import {useState} from 'react';
import {FormComponent} from './RequestMaker.tsx';
import {taskItems} from './taskItems.ts';
import {TaskListWithDropdown} from './ChooseTask.tsx';

import {VideoComponent, VideoComponentRef} from './ChooseTask.tsx';
import {useRef} from 'react';

function App() {
  const [url, setUrl] = useState("http://localhost/");

  const videoComponentRef = useRef<VideoComponentRef>(null);

  const handleButtonClick = () => {
    if (videoComponentRef.current) {
      const data = videoComponentRef.current.getVideoData();
      console.log('Video Data:', data);

      const src1 = data.src1;
      const src2 = data.src2;
      videoComponentRef.current.setVideo1(src2);
      videoComponentRef.current.setVideo2(src1);
    }
  };
  
  return (
    <>
      <TaskListWithDropdown taskItems={taskItems}/>
      
      <div>
	<VideoComponent ref={videoComponentRef} title="	This is a double video example."/>
	<button onClick={handleButtonClick}>Get and Set Video Data</button>
      </div>

      <div>
	The request form field is :
	<p/>
	<label> URL : </label>
	<input
          type="text"
	  id = "url_field"
	  value = {url}
	  onChange={(e) => {setUrl(e.target.value);}}
        />
	{
	  taskItems.map((it: any) => (
	    <div>
	      <span> {it.endpoint} </span>
	      <FormComponent endpoint = {it.endpoint} fields = {it.request_fields}
  onResponse = {(r: any) => {console.log("Response was" + r);}}
  overrides = {{"url":()=>url}}
	      />
	    </div>
	  ))
	} 
      </div>
      
    </>
  )
}

export default App
