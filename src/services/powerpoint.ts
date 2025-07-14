import officegen from 'officegen';
import fs from 'fs-extra';
import path from 'path';

export interface Slide {
  title: string;
  content?: string;
  layout?: 'title' | 'title-content' | 'content-only';
  bullets?: string[];
}

export interface CreatePresentationArgs {
  title: string;
  author?: string;
  slides: Slide[];
  outputPath: string;
}

export interface AddSlideArgs {
  presentationPath: string;
  slide: Slide;
  outputPath: string;
}

export interface PresentationResult {
  outputPath: string;
  title: string;
  slideCount: number;
  fileSize: number;
}

export interface AddSlideResult {
  outputPath: string;
  slideTitle: string;
  totalSlides: number;
}

export class PowerPointService {
  
  async createPresentation(args: CreatePresentationArgs): Promise<PresentationResult> {
    const { title, author, slides, outputPath } = args;

    // Validate output path
    if (!outputPath.endsWith('.pptx')) {
      throw new Error('Output path must end with .pptx');
    }

    // Ensure output directory exists
    await fs.ensureDir(path.dirname(outputPath));

    return new Promise((resolve, reject) => {
      try {
        // Create PowerPoint document
        const pptx = officegen('pptx');

        // Set document properties
        pptx.setDocTitle(title);
        
        // Add slides
        slides.forEach((slideData) => {
          const slide = pptx.makeNewSlide();
          this.addContentToSlide(slide, slideData);
        });

        // Generate the PowerPoint file
        const output = fs.createWriteStream(outputPath);
        
        output.on('error', (err: Error) => {
          reject(new Error(`Failed to write file: ${err.message}`));
        });

        pptx.generate(output, {
          'finalize': async (written: number) => {
            try {
              // Wait a bit for the file to be fully written
              await new Promise(resolve => setTimeout(resolve, 100));
              
              const stats = await fs.stat(outputPath);
              resolve({
                outputPath,
                title,
                slideCount: slides.length,
                fileSize: stats.size
              });
            } catch (error) {
              reject(error);
            }
          },
          'error': (err: Error) => {
            reject(new Error(`Failed to generate PowerPoint: ${err.message}`));
          }
        });

      } catch (error) {
        reject(new Error(`Failed to create presentation: ${error instanceof Error ? error.message : String(error)}`));
      }
    });
  }

  async addSlideToPresentation(args: AddSlideArgs): Promise<AddSlideResult> {
    const { presentationPath, slide, outputPath } = args;

    // For now, we'll create a new presentation with the existing concept
    // In a real implementation, you'd need a library that can read and modify existing PPTX files
    throw new Error('Adding slides to existing presentations is not yet implemented. Please create a new presentation instead.');
  }

  private addContentToSlide(slide: any, slideData: Slide): void {
    const { title, content, layout = 'title-content', bullets } = slideData;

    switch (layout) {
      case 'title':
        // Title slide layout
        slide.addText(title, {
          x: 'c',
          y: 'c',
          font_size: 44,
          font_face: 'Arial',
          color: '363636',
          bold: true,
          align: 'center'
        });
        break;

      case 'title-content':
        // Title and content layout
        slide.addText(title, {
          x: 0.5,
          y: 0.5,
          cx: 9,
          cy: 1,
          font_size: 32,
          font_face: 'Arial',
          color: '363636',
          bold: true
        });

        if (content) {
          slide.addText(content, {
            x: 0.5,
            y: 2,
            cx: 9,
            cy: 4,
            font_size: 18,
            font_face: 'Arial',
            color: '363636'
          });
        }

        if (bullets && bullets.length > 0) {
          const bulletText = bullets.map(bullet => `• ${bullet}`).join('\n');
          slide.addText(bulletText, {
            x: 0.5,
            y: content ? 4 : 2,
            cx: 9,
            cy: 3,
            font_size: 16,
            font_face: 'Arial',
            color: '363636'
          });
        }
        break;

      case 'content-only':
        // Content only layout
        if (content) {
          slide.addText(content, {
            x: 0.5,
            y: 0.5,
            cx: 9,
            cy: 6,
            font_size: 18,
            font_face: 'Arial',
            color: '363636'
          });
        }

        if (bullets && bullets.length > 0) {
          const bulletText = bullets.map(bullet => `• ${bullet}`).join('\n');
          slide.addText(bulletText, {
            x: 0.5,
            y: content ? 4 : 0.5,
            cx: 9,
            cy: 4,
            font_size: 16,
            font_face: 'Arial',
            color: '363636'
          });
        }
        break;
    }
  }
}
