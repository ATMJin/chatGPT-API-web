import markDown from 'markdown-it';


export function RenderMarkdown(text: string) {
  const md = markDown();
  return md.render(text);
}