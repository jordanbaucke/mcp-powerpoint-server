#!/usr/bin/env node

import { PowerPointService } from './services/powerpoint.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testPowerPointService() {
  console.log('Testing PowerPoint Service...');
  
  const service = new PowerPointService();
  
  const testPresentation = {
    title: "Test Presentation",
    author: "MCP Test",
    slides: [
      {
        title: "Welcome",
        layout: "title" as const
      },
      {
        title: "Test Slide",
        content: "This is a test slide created by the MCP PowerPoint server.",
        layout: "title-content" as const,
        bullets: [
          "First test point",
          "Second test point",
          "Third test point"
        ]
      }
    ],
    outputPath: path.join(__dirname, '../test-output/test-presentation.pptx')
  };

  try {
    const result = await service.createPresentation(testPresentation);
    console.log('✅ Test passed!');
    console.log(`Created: ${result.outputPath}`);
    console.log(`Slides: ${result.slideCount}`);
    console.log(`Size: ${result.fileSize} bytes`);
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testPowerPointService()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}
