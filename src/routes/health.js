const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const healthcheck = {
    status: 'UP',
    timestamp: new Date(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage()
  };
  
  res.json(healthcheck);
});

module.exports = router;