import { PowerPointService } from '../src/services/powerpoint.js';
import path from 'path';
import fs from 'fs-extra';

// Example usage of the PowerPoint service
async function example() {
  const service = new PowerPointService();
  
  const presentation = {
    title: "Sample Presentation",
    author: "MCP PowerPoint Server",
    slides: [
      {
        title: "Welcome to Our Presentation",
        layout: "title" as const
      },
      {
        title: "Introduction",
        content: "This presentation was created using the MCP PowerPoint Server",
        layout: "title-content" as const,
        bullets: [
          "Automated presentation generation",
          "Multiple slide layouts supported",
          "Easy integration with MCP clients"
        ]
      },
      {
        title: "Features",
        layout: "title-content" as const,
        bullets: [
          "Create presentations programmatically",
          "Support for title, content, and bullet points",
          "Flexible slide layouts",
          "Export to standard PowerPoint format"
        ]
      },
      {
        title: "Thank You",
        content: "Questions?",
        layout: "title-content" as const
      }
    ],
    outputPath: "./example-output/sample-presentation.pptx"
  };

  try {
    console.log('Creating presentation...');
    const result = await service.createPresentation(presentation);
    console.log('Presentation created successfully!');
    console.log(`File: ${result.outputPath}`);
    console.log(`Slides: ${result.slideCount}`);
    console.log(`Size: ${result.fileSize} bytes`);
  } catch (error) {
    console.error('Error creating presentation:', error);
  }
}

// Run the example if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  example();
}
