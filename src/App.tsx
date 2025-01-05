//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'

import {useState} from 'react';
import {FormComponent} from './RequestMaker.tsx';
import {taskItems} from './taskItems.ts';
import {TaskListWithDropdown} from './ChooseTask.tsx';

function App() {
  const [url, setUrl] = useState("http://localhost");
  
  
  return (
    <>
      <TaskListWithDropdown taskItems={taskItems}/>
      
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
