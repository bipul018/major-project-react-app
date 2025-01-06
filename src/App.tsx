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

  
  return (
    <>
      <TaskListWithDropdown taskItems={taskItems}/>
      
    </>
  )
}

export default App
