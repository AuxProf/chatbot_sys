import React from 'react';
import Latex from 'react-latex-next';
import { marked } from 'marked';
import 'katex/dist/katex.min.css'; // Certifique-se de ter a CSS do KaTeX importada


function MarkdownWithMath({ text }) {
    // Primeiro, formata o texto LaTeX dentro do Markdown
    const formattedText =  marked(text);//markdownToHtml(text);
    return (
        <div>
            {/* <Latex>{text}</Latex> */}
            <Latex>{formattedText}</Latex>
        </div>
    );
}

export default MarkdownWithMath;

