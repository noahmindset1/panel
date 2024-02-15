import React, { useEffect, useRef } from 'react';
import { Terminal as XTerminal } from 'xterm';
import 'xterm/css/xterm.css';
import axios from 'axios';

const Terminal = () => {
  const terminalRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const terminal = new XTerminal();
    terminal.open(terminalRef.current);

    // Create a WebSocket connection
    socketRef.current = new WebSocket('ws://localhost:3001');

    // Attach terminal to WebSocket connection
    socketRef.current.addEventListener('open', () => {
      terminal.attach(socketRef.current);
    });

    return () => {
      terminal.dispose();
      socketRef.current.close();
    };
  }, []);

  // Function to handle command execution
  const executeCommand = async (command) => {
    try {
      const response = await axios.post('/api/execute', { command });
      console.log(response.data.output);
    } catch (error) {
      console.error('Error executing command:', error);
    }
  };

  return <div ref={terminalRef} />;
};

export default Terminal;
