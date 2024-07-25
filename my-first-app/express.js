const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.get('/logs/:prNumber', (req, res) => {
  const logFile = path.join(__dirname, 'logs', `pr-${req.params.prNumber}.log`);
  fs.readFile(logFile, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Log not found');
    }
    res.send(data);
  });
});

app.listen(3000, () => {
  console.log('Log server running on port 3000');
});
