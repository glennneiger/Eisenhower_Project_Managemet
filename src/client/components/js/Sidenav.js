/*
This component serves as the section for setting filters to slice and dice the data/tasks
Filtered tasks will then be rendered in the Main component.
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../css/Sidenav.css';
// import { NewTask } from './NewTask'

class Sidenav extends Component {
  /*
  - implement filters
  - filters should update the task array and set it as state in the App
  */

  logTasks = () => {
    const { tasks } = this.props;
    console.log('All Tasks:', tasks);
  }

  render() {
    const { toggleNewTaskPopup } = this.props;
    return (
      <aside className="sidenav">
        <ul className="sidenav__list">
          <li className="sidenav__list-elem">Search field</li>
          <li className="sidenav__list-elem">
            <button type="button" onClick={toggleNewTaskPopup}>New Task</button>
          </li>
          <li className="sidenav__list-elem">
            <button type="button" onClick={this.logTasks}>Log Tasks</button>
          </li>
          <li className="sidenav__list-elem">Specify Filters (filter section below)</li>
        </ul>
      </aside>
    );
  }
}

Sidenav.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleNewTaskPopup: PropTypes.func.isRequired,
};

export default Sidenav;