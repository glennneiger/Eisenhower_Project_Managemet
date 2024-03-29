import mongoose from 'mongoose';
import { TasksSchema, FiltersSchema } from '../models/model';

// create 'Tasks' collection by leveraging the TasksSchema
const Tasks = mongoose.model('Tasks', TasksSchema);
const Filters = mongoose.model('Filters', FiltersSchema);

// for POST endpoint to create new task
export const addNewTask = (req, res) => {
  const newTask = new Tasks(req.body);
  newTask.save((err, task) => {
    if (err) {
      res.send(err);
    }
    res.json(task);
  });
};

// for PUT endpoint to edit task
export const editTask = (req, res) => {
  Tasks.findOneAndUpdate({ _id: req.params.id }, req.body, { upsert: true }, (err) => {
    if (err) {
      res.send(err);
    }
    res.send(`Successfully updated task ${req.params.id}`);
  });
};

// for GET endpoint based on filter settings to retrieve tasks and filters
export const getInitialData = async (req, res) => {
  let filters;
  try {
    filters = await Filters.find({});
  } catch (err) {
    console.log(err);
  }
  switch (filters[0].showTasks) {
    case 'both':
      await Tasks.find({}, (err, tasks) => {
        if (err) {
          res.send(err);
        }
        res.json({
          tasks,
          filters,
        });
      });
      break;
    case 'open':
      await Tasks.find({ completed: false }, (err, tasks) => {
        if (err) {
          res.send(err);
        }
        res.json({
          tasks,
          filters,
        });
      });
      break;
    case 'completed':
      await Tasks.find({ completed: true }, (err, tasks) => {
        if (err) {
          res.send(err);
        }
        res.json({
          tasks,
          filters,
        });
      });
      break;
    default:
      res.send('No proper filter for tasks to show defined.');
  }
};

// for DELETE endpoint to delete a single task
export const deleteTask = (req, res) => {
  Tasks.findOneAndDelete({ _id: req.params.id }, (err) => {
    if (err) {
      res.send(err);
    }
    res.send(`Successfully removed task ${req.params.id}`);
  });
};


// for POST endpoint to initialize filters
export const setFilters = (req, res) => {
  const filters = new Filters(req.body);
  filters.save((err, filter) => {
    if (err) {
      res.send(err);
    }
    res.json(filter);
  });
};

// for PUT endpoint to update filters
export const updateFilters = async (req, res) => {
  // update filter settings
  await Filters.findOneAndUpdate({ userID: -999 }, req.body, (err) => {
    if (err) {
      res.send(err);
    }
  }).exec();

  // read data based on updated filter settings
  let filters;
  try {
    filters = await Filters.find({});
  } catch (err) {
    console.log(err);
  }
  switch (filters[0].showTasks) {
    case 'both':
      await Tasks.find({}, (err, tasks) => {
        if (err) {
          res.send(err);
        }
        res.json({
          tasks,
          filters,
        });
      });
      break;
    case 'open':
      await Tasks.find({ completed: false }, (err, tasks) => {
        if (err) {
          res.send(err);
        }
        res.json({
          tasks,
          filters,
        });
      });
      break;
    case 'completed':
      await Tasks.find({ completed: true }, (err, tasks) => {
        if (err) {
          res.send(err);
        }
        res.json({
          tasks,
          filters,
        });
      });
      break;
    default:
      res.send('No proper filter for tasks to show defined.');
  }
};

// for GET endpoint to get filter settings
export const getFilters = (req, res) => {
  Filters.find({}, (err, filters) => {
    if (err) {
      res.send(err);
    }
    res.json({
      filters,
    });
  });
};
