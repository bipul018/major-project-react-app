//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'


import {FormComponent} from './RequestMaker.tsx';
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
	      <FormComponent endpoint = {it.endpoint} fields = {it.request_fields}
  onResponse = {(r: any) => {console.log("Response was" + r);}}/>
	    </div>
	  ))
	} 
	
      </div>
      
    </>
  )
}

export default App
