import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'

//import {RequestFormField} from './RequestMaker.tsx';
import {FormComponent} from './RequestMaker.tsx';
//import {sendPostRequest, FormComponent} from './RequestMaker.tsx';
import {taskItems} from './taskItems.ts';
import {TaskListWithDropdown} from './ChooseTask.tsx';

function App() {
  return (
    <>
      <TaskListWithDropdown taskItems={taskItems}/>
      
      <div>
	The request form field is :
	<p/>
	{
	  taskItems.map((it: any) => (
	    <div>
	      <span> {it.endpoint} </span>
	      <FormComponent endpoint = {it.endpoint} fields = {it.request_fields} />
	    </div>
	  ))
	} 
	
      </div>
      
    </>
  )
}

export default App
