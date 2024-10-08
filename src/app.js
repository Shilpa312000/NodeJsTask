const express = require('express');
const taskController = require('./controllers/taskcontroller');

const app = express();
app.use(express.json());

// Task route
app.post('/task', taskController.handleTask);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Worker ${process.pid} listening on port ${PORT}`);
});
