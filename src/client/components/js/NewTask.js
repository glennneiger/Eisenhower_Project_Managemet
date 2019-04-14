/*
This component should probably be a form so the user can input data.
The data that is submitted should be saved to the data warehouse.
Adding data to warehouse should trigger rendering
--> e.g. via sockets or via GET request in handle submit
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../css/NewTask.css';

class NewTask extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    /*
    If this function only calls the function from props then it's redundant.
    But I want to keep it for now for later validation purposes */
    const { defineNewTask } = this.props;
    defineNewTask(event);
  }

  /* ToDo:
    - perform validation on form
    - avoid multiple submits of the same task
      --> close popup after task was submitted
      --> for UX reasons there should be an option so the popup stays open after submit if selected
  */

  render() {
    const {
      title,
      description,
      submitNewTask,
      toggleNewTaskPopup,
    } = this.props;
    return (
      <div className="newTask-outer">
        <div className="newTask-inner">
          <form onSubmit={(event) => { event.preventDefault(); }}>
            {/* to avoid that 'Enter' submits the changes to the state */}
            <label>
              Title<br />
              <input type="text" name="title" value={title} onChange={this.handleChange} />
            </label>
            <br />
            <label>
              Description<br />
              <textarea type="text" name="description" value={description} onChange={this.handleChange} />
            </label><br />
            <label>
              Category<br />
              <input type="radio" name="category" value="A" onChange={this.handleChange} defaultChecked />A
              <input type="radio" name="category" value="B" onChange={this.handleChange} />B
              <input type="radio" name="category" value="C" onChange={this.handleChange} />C
              <input type="radio" name="category" value="D" onChange={this.handleChange} />D
            </label>
          </form>
          <button type="submit" onClick={(event) => { submitNewTask(event); }}>Add Task</button>
          <button type="button" onClick={toggleNewTaskPopup}>Close</button>
        </div>
      </div>
    );
  }
}

NewTask.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  defineNewTask: PropTypes.func.isRequired,
  submitNewTask: PropTypes.func.isRequired,
  toggleNewTaskPopup: PropTypes.func.isRequired,
};

export default NewTask;