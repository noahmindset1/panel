const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const docker = require('dockerode')(); // Docker integration
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:'); // Using SQLite for simplicity

// Endpoint for executing commands in Docker container
app.post('/api/execute', async (req, res) => {
  const { command, containerId } = req.body;
  try {
    const container = docker.getContainer(containerId);
    const exec = await container.exec({
      Cmd: ['sh', '-c', command],
      AttachStdout: true,
      AttachStderr: true,
    });
    const stream = await exec.start();
    let output = '';
    stream.on('data', (chunk) => {
      output += chunk.toString();
    });
    stream.on('end', () => {
      res.json({ output });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Endpoint for listing files in a directory
app.get('/api/files', (req, res) => {
  const directory = req.query.directory || '/';
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while listing files' });
    } else {
      res.json({ files });
    }
  });
});

// Endpoint for renaming a file
app.put('/api/rename', (req, res) => {
  const { oldName, newName } = req.body;
  fs.rename(oldName, newName, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while renaming the file' });
    } else {
      res.json({ message: 'File renamed successfully' });
    }
  });
});

// Endpoint for deleting a file
app.delete('/api/delete', (req, res) => {
  const { fileName } = req.body;
  fs.unlink(fileName, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while deleting the file' });
    } else {
      res.json({ message: 'File deleted successfully' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
