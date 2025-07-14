declare module 'officegen' {
  interface SlideOptions {
    x?: number | string;
    y?: number | string;
    cx?: number;
    cy?: number;
    font_size?: number;
    font_face?: string;
    color?: string;
    bold?: boolean;
    align?: string;
  }

  interface Slide {
    addText(text: string, options?: SlideOptions): void;
  }

  interface OfficeGen {
    setDocTitle(title: string): void;
    setDocAuthor(author: string): void;
    setDocSubject(subject: string): void;
    makeNewSlide(): Slide;
    generate(stream: any, options?: {
      finalize?: (written: number) => void;
      error?: (err: Error) => void;
    }): void;
  }

  function officegen(type: 'pptx'): OfficeGen;
  export default officegen;
}
