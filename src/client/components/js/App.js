import React, { Component } from 'react';
import axios from 'axios';

import Header from './Header';
import Sidenav from './Sidenav';
import Main from './Main';
import Footer from './Footer';
import NewTask from './NewTask';
import EditTask from './EditTask';

import '../css/App.css';
import { tasks } from '../../data.json'; // that's the data warehouse. 'tasks' will be passed to Sidenav where the filtering happens. Sidenav will then set the filtered tasks as the state for App. The filtered tasks will be passed as array to Main where the identification of the category happens for rendering.

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      /* filteredTasks will change depending on the filters set in Sidenav once implemented */
      filteredTasks: [],
      newTaskPopup: false,
      newTask: {},
      editTaskPopup: false,
      editTask: {},
      filters: {},
    };
  }

  componentDidMount() {
    // read filter settings from DB
    // if no filters available then initialize them in DB
    // const { filters } = this.state;
    axios.get('/api/getFilters')
      .then((res) => {
        this.setState({
          filters: res.data[0],
        });
        return res.data[0];
      })
      .then((filters) => {
        axios.get(`/api/tasks?showCompleted=${filters.showCompleted}`)
          .then((res) => {
            this.setState({
              filteredTasks: res.data,
            });
          });
      })
      .catch((err) => {
        console.log(err);
      });

    // read initial data from DB
    // console.log(this.state.filters.showCompleted);
    axios.get('/api/tasks')
      .then((res) => {
        this.setState({
          filteredTasks: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  toggleNewTaskPopup = () => {
    // callback is comparable to newTaskPopup: !this.state.newTaskPopup
    this.setState(prevState => ({ newTaskPopup: !prevState.newTaskPopup }));
  }

  toggleEditTaskPopup = () => {
    const { editTaskPopup } = this.state;
    // check if popup is already open and if yes then close it and reset editTask
    if (editTaskPopup) {
      this.setState({
        editTaskPopup: !editTaskPopup,
        editTask: {},
      });
    } else {
      this.setState({
        editTaskPopup: !editTaskPopup,
      });
    }
    // this.setState(prevState => ({ editTaskPopup: !prevState.editTaskPopup }));
  };

  populateEditTask = (data) => {
    // open popup
    this.toggleEditTaskPopup();
    console.log(`data: ${data.description} ${data.completed}`);
    // populate editTask based on data of double clicked task
    this.setState({
      editTask: {
        _id: data._id,
        rank: data.rank,
        category: data.category,
        title: data.title,
        description: data.description,
        completed: data.completed,
      },
    });
  }

  // add new task to data warehouse on submit
  handleNewTaskFormSubmit = (event) => {
    event.preventDefault();

    const { newTask, filteredTasks } = this.state;
    const filteredTasksLength = filteredTasks.length;

    // POST new task and update state afterwards
    axios.post('/api/newTask', newTask)
      .then((res) => {
        // retrieve _id and rank from posted newTask
        const newTaskID = res.data._id;
        const newTaskRank = res.data.rank;

        // Instead of using a GET for all tasks just add the new task to the filteredTasks array.
        // _id and rank updated manually.
        filteredTasks.push(newTask);
        filteredTasks[filteredTasksLength]._id = newTaskID;
        filteredTasks[filteredTasksLength].rank = newTaskRank;

        // update state including the new task for re-render
        this.setState({
          filteredTasks,
        });

        // reset newTask
        this.setState({
          newTask: {},
        });
      })
      .catch((err) => {
        console.log(err);
      });

    // close the popup after submit
    this.toggleNewTaskPopup();
  }

  // update newTask object based on form input in NewTask component:
  handleNewTaskFormChange = (event) => {
    const { newTask } = this.state;
    if (event.target.name === 'completed') {
      newTask[event.target.name] = event.target.checked;
    } else {
      newTask[event.target.name] = event.target.value;
    }

    // reflect form changes in newTask
    this.setState({
      newTask,
    });
  }

  handleEditTaskFormSubmit = (event) => {
    event.preventDefault();

    const { editTask, filteredTasks } = this.state;

    // save changes to the DB
    axios.put(`/api/editTask/${editTask._id}`, editTask)
      .catch((err) => {
        console.log(err);
      });

    // save changes in filteredTasks array as well to avoid additional GET of all tasks
    // find index of task to update:
    const editTaskIndex = filteredTasks.findIndex(task => task._id === editTask._id);
    // update filteredTasks array
    filteredTasks[editTaskIndex] = editTask;

    // reset editTask
    this.setState({
      editTask: {},
    });

    // close the popup after submit
    this.toggleEditTaskPopup();
  }

  // update editTask object based on form input in EditTask component:
  handleEditTaskFormChange = (event) => {
    const { editTask } = this.state;
    if (event.target.name === 'completed') {
      editTask[event.target.name] = event.target.checked;
    } else {
      editTask[event.target.name] = event.target.value;
    }

    // reflect form changes in editTask
    this.setState({
      editTask,
    });
  };

  //
  handleDeleteTask = () => {
    const { editTask, filteredTasks } = this.state;

    axios.delete(`/api/deleteTask/${editTask._id}`)
      .catch((err) => {
        console.log(err);
      });

    // remove deleted task from filteredTasks array
    const deleteTaskIndex = filteredTasks.findIndex(task => task._id === editTask._id);
    filteredTasks.splice(deleteTaskIndex, 1);

    // reset editTask
    this.setState({
      editTask: {},
    });

    // close the popup after submit
    this.toggleEditTaskPopup();
  };

  // handle filter to show/hide completed tasks
  handleFilterCompleted = (event) => {
    const { filters } = this.state;
    filters.showCompleted = event.target.value;
    this.setState({
      filters,
    });
  }

  render() {
    const {
      filters,
      filteredTasks,
      newTaskPopup,
      newTask,
      editTaskPopup,
      editTask,
    } = this.state;
    const { title, description } = newTask;

    return (
      <div className="grid-container">
        <Header />
        <Sidenav
          tasks={tasks}
          toggleNewTaskPopup={this.toggleNewTaskPopup}
          filters={filters}
          handleFilterCompleted={this.handleFilterCompleted}
        />
        <Main
          filteredTasks={filteredTasks}
          populateEditTask={this.populateEditTask}
        />
        <Footer />
        {newTaskPopup
          && (
          <NewTask
            toggleNewTaskPopup={this.toggleNewTaskPopup}
            defineNewTask={this.handleNewTaskFormChange}
            submitNewTask={this.handleNewTaskFormSubmit}
            title={title}
            description={description}
          />
          )
        }
        {editTaskPopup
          && (
            <EditTask
              toggleEditTaskPopup={this.toggleEditTaskPopup}
              editTask={editTask}
              defineEditTask={this.handleEditTaskFormChange}
              submitEditTask={this.handleEditTaskFormSubmit}
              handleDeleteTask={this.handleDeleteTask}
            />
          )
        }
      </div>
    );
  }
}

export default App;
