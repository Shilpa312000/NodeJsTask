# Node.js Task Queuing with Rate Limiting

## Overview
This project implements a Node.js API that handles user task queuing with rate limiting. The API allows users to submit tasks, which are processed according to defined rate limits to ensure fair usage. The tasks are logged with a timestamp and user ID, and the application is designed to be resilient to failures and edge cases.

## Features
- **Task Queuing**: Users can submit tasks that are queued and processed.
- **Rate Limiting**: Each user can submit a maximum of:
  - 1 task per second
  - 20 tasks per minute
- **Logging**: Task completions are logged to a file with user ID and timestamp.
- **Clustering**: The application runs with multiple worker processes for better performance.

## Technologies Used
- Node.js
- Express.js
- Bull (for job queuing)
- Redis (for storing job queues)
- Winston (for logging)

## Getting Started

### Prerequisites
- Node.js (version 14.x or higher)
- Redis server
- Git

