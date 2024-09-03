import React from 'react';
import Latex from 'react-latex-next';
import { marked } from 'marked';
import 'katex/dist/katex.min.css'; // Certifique-se de ter a CSS do KaTeX importada

function formatMathString(inputString) {
    // Substitui expressões LaTeX dentro de \\[ \\] e \\( \\) para $ $ para inline e $$ $$ para block
    return inputString
        .replace(/\\\[(.*?)\\\]/g, '$$$$1$$$') // Blocos de LaTeX
        .replace(/\\\((.*?)\\\)/g, '$$1$$');   // Inline LaTeX
}

function markdownToHtml(markdownString) {
    // Converte quebras de linha duplas em parágrafos
    const paragraphs = markdownString.split(/\n\s*\n/).map(paragraph => {
        // Converte cabeçalhos
        paragraph = paragraph.replace(/^###### (.+)$/gm, '<h6>$1</h6>');
        paragraph = paragraph.replace(/^##### (.+)$/gm, '<h5>$1</h5>');
        paragraph = paragraph.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
        paragraph = paragraph.replace(/^### (.+)$/gm, '<h3>$1</h3>');
        paragraph = paragraph.replace(/^## (.+)$/gm, '<h2>$1</h2>');
        paragraph = paragraph.replace(/^# (.+)$/gm, '<h1>$1</h1>');

        // Converte listas ordenadas e não ordenadas
        paragraph = paragraph
            .replace(/^\d+\.\s(.+)$/gm, (match, p1) => `<ol><li>${p1}</li></ol>`)
            .replace(/^\* (.+)$/gm, (match, p1) => `<ul><li>${p1}</li></ul>`)
            .replace(/^\- (.+)$/gm, (match, p1) => `<ul><li>${p1}</li></ul>`);

        // Converte listas de operações matemáticas
        paragraph = paragraph.replace(/`([\s\S]+?)`/g, (match, p1) => {
            const lines = p1.split('\n').map(line => `<li>${line.trim()}</li>`).join('');
            return `<ul>${lines}</ul>`;
        });

        // Converte texto em negrito
        paragraph = paragraph.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        paragraph = paragraph.replace(/__(.+?)__/g, '<strong>$1</strong>');

        // Converte texto em itálico
        paragraph = paragraph.replace(/\*(.+?)\*/g, '<em>$1</em>');
        paragraph = paragraph.replace(/_(.+?)_/g, '<em>$1</em>');

        // Converte links
        paragraph = paragraph.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');

        // Converte imagens
        paragraph = paragraph.replace(/!\[(.*?)\]\((.+?)\)/g, '<img src="$2" alt="$1" />');

        // Converte código em linha
        paragraph = paragraph.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Converte blocos de código
        paragraph = paragraph.replace(/```([^\n]+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');

        // Converte tabelas
        paragraph = paragraph.replace(/^\|(.+?)\|$/gm, (match, p1) => {
            const rows = p1.split(/\n\|/).map(row => `<tr>${row.split('|').map(cell => `<td>${cell.trim()}</td>`).join('')}</tr>`);
            const header = rows.shift();
            return `<table><thead><tr>${header}</tr></thead><tbody>${rows.join('')}</tbody></table>`;
        });

        return paragraph;
    });

    // Junta os parágrafos convertidos em HTML
    return paragraphs.join('\n');
}

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

