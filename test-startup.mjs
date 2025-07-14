#!/usr/bin/env node

console.log('Testing basic server startup...');

try {
  console.log('✓ Node.js is working');
  
  import('express').then(() => {
    console.log('✓ Express is available');
    
    import('@modelcontextprotocol/sdk/server/index.js').then(() => {
      console.log('✓ MCP SDK is available');
      
      // Test the actual server
      import('./build/index.js').then(() => {
        console.log('✓ Server started successfully');
      }).catch(err => {
        console.error('✗ Server startup failed:', err.message);
        console.error('Stack:', err.stack);
      });
    }).catch(err => {
      console.error('✗ MCP SDK import failed:', err.message);
    });
  }).catch(err => {
    console.error('✗ Express import failed:', err.message);
  });
} catch (err) {
  console.error('✗ Basic test failed:', err.message);
}
