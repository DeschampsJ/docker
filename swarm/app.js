// app.js

const express = require('express');
const redis = require('redis');
const os = require('os');

const app = express();
const client = redis.createClient({
  host: 'redis',
  port: 6379,
});

app.get('/', (req, res) => {
  client.incr('visits', (err, visits) => {
    const hostInfo = `Host: ${os.hostname()}`;
    const containerInfo = `Container: ${process.env.HOSTNAME}`;
    const visitInfo = `Visits: ${visits}`;
    const message = `${hostInfo}\n${containerInfo}\n${visitInfo}`;
    res.send(`Hello, Docker Swarm!\n${message}`);
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Node.js app listening on port ${port}`);
});
