const Bull = require('bull');
const redisClient = require('../config/redis');
const winston = require('winston');

const taskQueue = new Bull('taskQueue', { redis: redisClient });

const logger = winston.createLogger({
  transports: [new winston.transports.File({ filename: './logs/task_logs.log' })]
});

const RATE_LIMIT_PER_SECOND = 1;
const RATE_LIMIT_PER_MINUTE = 20;

const userTaskCounts = {};

async function addTask(user_id) {
  await taskQueue.add({ user_id });
}

taskQueue.process(async (job, done) => {
  const { user_id } = job.data;
  const currentTime = Date.now();

  if (!userTaskCounts[user_id]) {
    userTaskCounts[user_id] = { lastTaskTime: 0, taskCountMinute: 0, taskTimestamps: [] };
  }

  const userLimits = userTaskCounts[user_id];
  userLimits.taskTimestamps = userLimits.taskTimestamps.filter(
    (timestamp) => currentTime - timestamp <= 60000
  );

  if (userLimits.taskCountMinute >= RATE_LIMIT_PER_MINUTE) {
    setTimeout(() => processJob(job), 60000);
    return done(new Error('Rate limit exceeded, retrying after 1 minute'));
  }

  if (currentTime - userLimits.lastTaskTime < 1000) {
    setTimeout(() => processJob(job), 1000);
    return done(new Error('Rate limit exceeded, retrying after 1 second'));
  }

  await processJob(job);
  userLimits.lastTaskTime = currentTime;
  userLimits.taskCountMinute++;
  userLimits.taskTimestamps.push(currentTime);
  done();
});

async function processJob(job) {
  const { user_id } = job.data;
  const logEntry = `${user_id}-task completed at-${Date.now()}`;
  logger.info(logEntry);
  console.log(logEntry);
}

module.exports = { addTask };
