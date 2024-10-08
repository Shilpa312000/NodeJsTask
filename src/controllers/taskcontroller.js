const taskQueue = require('../jobs/taskQueue');

// Controller for handling the task request
exports.handleTask = async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).send({ error: 'User ID is required' });
  }

  try {
    await taskQueue.addTask(user_id);
    res.status(202).send({ message: 'Task added to the queue' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Error adding task to queue' });
  }
};
