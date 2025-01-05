import { useState } from 'react';
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
