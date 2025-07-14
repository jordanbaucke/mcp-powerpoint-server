import { PowerPointService } from "./services/powerpoint.js";

const powerpointService = new PowerPointService();

export const PowerPointTools = [
  {
    name: "create_presentation",
    description: "Create a new PowerPoint presentation with slides. Provide a title, optional author, and an array of slides with their content.",
    inputSchema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Title of the presentation"
        },
        author: {
          type: "string",
          description: "Author of the presentation (optional)"
        },
        slides: {
          type: "array",
          description: "Array of slides to include in the presentation",
          items: {
            type: "object",
            properties: {
              title: {
                type: "string",
                description: "Title of the slide"
              },
              content: {
                type: "string",
                description: "Content/text for the slide (optional)"
              },
              layout: {
                type: "string",
                enum: ["title", "title-content", "content-only"],
                description: "Layout type for the slide",
                default: "title-content"
              },
              bullets: {
                type: "array",
                description: "Array of bullet points for the slide (optional)",
                items: {
                  type: "string"
                }
              }
            },
            required: ["title"]
          }
        },
        outputPath: {
          type: "string",
          description: "Output file path for the PowerPoint file (must end with .pptx)"
        }
      },
      required: ["title", "slides", "outputPath"]
    },
    outputSchema: {
      type: "object",
      properties: {
        content: {
          type: "array",
          items: { type: "string" },
        },
      },
      required: ["content"],
    },
    async execute({ title, author, slides, outputPath }: { 
      title: string; 
      author?: string; 
      slides: any[]; 
      outputPath: string 
    }) {
      const result = await powerpointService.createPresentation({
        title,
        author,
        slides,
        outputPath
      });
      
      return {
        content: [
          `PowerPoint presentation created successfully!`,
          `File: ${result.outputPath}`,
          `Title: ${result.title}`,
          `Slides: ${result.slideCount}`,
          `Size: ${result.fileSize} bytes`
        ],
      };
    },
  },
  {
    name: "add_slide_template",
    description: "Get a template for adding slides to understand the slide structure and available layouts.",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
    outputSchema: {
      type: "object",
      properties: {
        content: {
          type: "array",
          items: { type: "string" },
        },
      },
      required: ["content"],
    },
    async execute() {
      return {
        content: [
          "Slide Template Structure:",
          "",
          "Basic slide structure:",
          "{",
          '  "title": "Slide Title (required)",',
          '  "content": "Main content text (optional)",',
          '  "layout": "title-content", // Options: title, title-content, content-only',
          '  "bullets": ["Bullet 1", "Bullet 2"] // Optional array of bullet points',
          "}",
          "",
          "Layout Options:",
          '- "title": Title-only slide (good for section breaks)',
          '- "title-content": Title with content text and/or bullets (most common)',
          '- "content-only": Content and bullets without prominent title',
          "",
          "Example slide:",
          "{",
          '  "title": "Project Overview",',
          '  "content": "This project demonstrates PowerPoint generation capabilities.",',
          '  "layout": "title-content",',
          '  "bullets": [',
          '    "Automated presentation creation",',
          '    "Multiple slide layouts",',
          '    "Bullet point support"',
          '  ]',
          "}"
        ],
      };
    },
  }
];
