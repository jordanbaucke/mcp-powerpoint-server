#!/usr/bin/env node

/**
 * Demo script showing how to interact with the MCP PowerPoint Server
 * This simulates how an MCP client would call the server's tools
 */

import { PowerPointService } from './dist/services/powerpoint.js';

async function demonstratePowerPointMCP() {
  console.log('🎯 MCP PowerPoint Server Demonstration\n');
  
  const service = new PowerPointService();

  // Example 1: Simple presentation
  console.log('📊 Creating a simple business presentation...');
  
  const businessPresentation = {
    title: "Q3 Business Review",
    author: "Business Team",
    slides: [
      {
        title: "Q3 Business Review",
        layout: "title"
      },
      {
        title: "Agenda",
        layout: "title-content",
        bullets: [
          "Financial Performance",
          "Key Achievements", 
          "Challenges & Solutions",
          "Q4 Outlook",
          "Questions & Discussion"
        ]
      },
      {
        title: "Financial Performance",
        content: "Strong growth across all metrics this quarter",
        layout: "title-content",
        bullets: [
          "Revenue: $2.5M (+15% YoY)",
          "Profit Margin: 23% (+3% from Q2)",
          "Customer Acquisition: 250 new clients",
          "Customer Retention: 95%"
        ]
      },
      {
        title: "Key Achievements",
        layout: "title-content",
        bullets: [
          "Launched new product line",
          "Expanded to 3 new markets",
          "Implemented automation system",
          "Achieved ISO certification",
          "Built strategic partnerships"
        ]
      },
      {
        title: "Thank You",
        content: "Questions?",
        layout: "title-content"
      }
    ],
    outputPath: "./demo-output/business-review.pptx"
  };

  try {
    const result1 = await service.createPresentation(businessPresentation);
    console.log(`✅ Created: ${result1.outputPath}`);
    console.log(`   Slides: ${result1.slideCount}, Size: ${result1.fileSize} bytes\n`);
  } catch (error) {
    console.error('❌ Error creating business presentation:', error);
  }

  // Example 2: Technical presentation
  console.log('🔧 Creating a technical presentation...');
  
  const techPresentation = {
    title: "MCP PowerPoint Server Architecture",
    author: "Development Team",
    slides: [
      {
        title: "MCP PowerPoint Server",
        content: "Architecture Overview",
        layout: "title-content"
      },
      {
        title: "System Components",
        layout: "title-content",
        bullets: [
          "MCP Server Framework",
          "PowerPoint Generation Service",
          "TypeScript Type System",
          "File System Management",
          "Error Handling & Validation"
        ]
      },
      {
        title: "Key Features",
        layout: "title-content",
        bullets: [
          "Create presentations programmatically",
          "Multiple slide layouts",
          "Bullet point support",
          "Metadata handling",
          "Cross-platform compatibility"
        ]
      },
      {
        title: "Technical Stack",
        content: "Built with modern technologies",
        layout: "title-content",
        bullets: [
          "Node.js & TypeScript",
          "MCP SDK (@modelcontextprotocol/sdk)",
          "officegen library",
          "fs-extra for file operations"
        ]
      }
    ],
    outputPath: "./demo-output/technical-overview.pptx"
  };

  try {
    const result2 = await service.createPresentation(techPresentation);
    console.log(`✅ Created: ${result2.outputPath}`);
    console.log(`   Slides: ${result2.slideCount}, Size: ${result2.fileSize} bytes\n`);
  } catch (error) {
    console.error('❌ Error creating technical presentation:', error);
  }

  console.log('🎉 Demo completed! Check the demo-output folder for generated presentations.');
  console.log('\n📋 MCP Server Tools Available:');
  console.log('   • create_presentation - Create new PowerPoint presentations');
  console.log('   • add_slide_to_presentation - Add slides to existing presentations (planned)');
  console.log('\n🚀 To use this server with an MCP client:');
  console.log('   1. Start the server: npm start');
  console.log('   2. Configure your MCP client to connect via stdio');
  console.log('   3. Call the tools with appropriate arguments');
}

// Run demo
demonstratePowerPointMCP().catch(console.error);
