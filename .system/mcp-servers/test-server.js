// Simple test script to verify MCP server can start
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Testing MCP server startup...');

const server = spawn('node', [join(__dirname, 'component-registry.js')], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let output = '';
let errorOutput = '';

server.stdout.on('data', (data) => {
  output += data.toString();
  console.log('STDOUT:', data.toString());
});

server.stderr.on('data', (data) => {
  errorOutput += data.toString();
  console.log('STDERR:', data.toString());
});

// Send MCP initialize request
setTimeout(() => {
  console.log('\nSending initialize request...');
  const initRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'test-client',
        version: '1.0.0'
      }
    }
  };

  server.stdin.write(JSON.stringify(initRequest) + '\n');
}, 500);

// Send list tools request
setTimeout(() => {
  console.log('\nSending tools/list request...');
  const listToolsRequest = {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list',
    params: {}
  };

  server.stdin.write(JSON.stringify(listToolsRequest) + '\n');
}, 1500);

// Cleanup after 3 seconds
setTimeout(() => {
  console.log('\n\nTest complete. Killing server...');
  server.kill();

  if (output.includes('"method"') || output.includes('component-registry')) {
    console.log('\n✅ Server appears to be working!');
  } else {
    console.log('\n❌ Server may have issues');
    console.log('Output:', output);
    console.log('Errors:', errorOutput);
  }

  process.exit(0);
}, 3000);

server.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
