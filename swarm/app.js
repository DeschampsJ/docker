// app.js

const express = require('express');
const redis = require('redis');

const app = express();
const client = redis.createClient({
  host: 'redis',
  port: 6379,
});

app.get('/', (req, res) => {
  client.incr('visits', (err, visits) => {
    res.send(`Hello, Docker Swarm! Visits: ${visits}`);
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Node.js app listening on port ${port}`);
});
