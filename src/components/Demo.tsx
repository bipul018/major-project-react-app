// src/components/Demo.tsx
import React from "react";
import {FormComponent} from '../main_demo/RequestMaker.tsx';
import {taskItems} from '../main_demo/taskItems.ts';
import {TaskListWithDropdown} from '../main_demo/ChooseTask.tsx';
import {VideoComponent, VideoComponentRef} from '../main_demo/ChooseTask.tsx';

const Demo: React.FC = () => {
  return (
    <div id="demo" style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h2>Demo</h2>
      <p>
        Here is a live demo of our project. You can interact with the form, see results, and more.
      </p>
      {/* Your demo content (dropdown, form fields, etc.) */}
      <TaskListWithDropdown taskItems={taskItems}/>
    </div>
  );
};

export default Demo;
