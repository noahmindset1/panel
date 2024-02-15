import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FileManager = () => {
  const [files, setFiles] = useState([]);

  // Function to list files
  const listFiles = async () => {
    try {
      const response = await axios.get('/api/files');
      setFiles(response.data.files);
    } catch (error) {
      console.error('Error listing files:', error);
    }
  };

  // Function to rename a file
  const renameFile = async (oldName, newName) => {
    try {
      await axios.put('/api/rename', { oldName, newName });
      listFiles();
    } catch (error) {
      console.error('Error renaming file:', error);
    }
  };

  // Function to delete a file
  const deleteFile = async (fileName) => {
    try {
      await axios.delete('/api/delete', { data: { fileName } });
      listFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  useEffect(() => {
    listFiles();
  }, []);

  return (
    <div>
      <h2>File Manager</h2>
      <ul>
        {files.map((file, index) => (
          <li key={index}>
            {file}
            <button onClick={() => deleteFile(file)}>Delete</button>
            <input type="text" onChange={(e) => renameFile(file, e.target.value)} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileManager;
