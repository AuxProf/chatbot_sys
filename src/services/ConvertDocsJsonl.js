// import Papa from 'papaparse';
// import * as XLSX from 'xlsx';
// import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
// import mammoth from 'mammoth';

// export async function processFiles(file) {
//     const extension = file.name.split('.').pop().toLowerCase();
    
//     try {
//       switch (extension) {
//         case 'txt':
//           processTxt(file);
//           break;
//         case 'csv':
//           processCsv(file);
//           break;
//         case 'xlsx':
//           await processXlsx(file);
//           break;
//         case 'pdf':
//           await processPdf(file);
//           break;
//         case 'docx':
//           await processDocx(file);
//           break;
//         default:
//           console.log(`Extensão de arquivo não suportada: ${extension}`);
//       }
//     } catch (err) {
//       console.error(`Erro ao processar arquivo ${file.name}: ${err}`);
//     }
//   }
  
//   function processTxt(file) {
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const lines = event.target.result.split('\n');
//       lines.forEach((line) => {
//         console.log({ content: line });  // Você pode substituir isso para salvar os dados em um formato JSONL
//       });
//     };
//     reader.readAsText(file);
//   }
  
//   function processCsv(file) {
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const csvData = event.target.result;
//       // Você pode usar uma biblioteca como "papaparse" para processar CSV no navegador
//       const parsedData = Papa.parse(csvData, { header: true }).data;
//       parsedData.forEach((row) => {
//         console.log(row);  // Substitua para salvar em JSONL
//       });
//     };
//     reader.readAsText(file);
//   }
  
//   async function processXlsx(file) {
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const data = new Uint8Array(event.target.result);
//       const workbook = XLSX.read(data, { type: 'array' });
//       workbook.SheetNames.forEach((sheetName) => {
//         const worksheet = workbook.Sheets[sheetName];
//         const json = XLSX.utils.sheet_to_json(worksheet);
//         json.forEach((row) => {
//           console.log(row);  // Substitua para salvar em JSONL
//         });
//       });
//     };
//     reader.readAsArrayBuffer(file);
//   }
  
//   async function processPdf(file) {
//     return new Promise((resolve, reject) => {
//       // Definir a localização do worker
//       GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/files/pdf.worker.js`;
  
//       const reader = new FileReader();
      
//       reader.onload = async (event) => {
//         try {
//           const pdfData = new Uint8Array(event.target.result);
//           const pdf = await getDocument({ data: pdfData }).promise;
  
//           const jsonLines = [];
  
//           // Itera sobre as páginas
//           for (let i = 1; i <= pdf.numPages; i++) {
//             const page = await pdf.getPage(i);
//             const content = await page.getTextContent();
//             const pageText = content.items.map(item => item.str).join(' ');
  
//             // Cria um objeto JSON para cada página
//             const jsonLine = { page: i, content: pageText };
//             jsonLines.push(jsonLine); // Adiciona ao array
//           }
  
//           // Retorna o array de objetos JSON
//           resolve(jsonLines);
//         } catch (error) {
//           reject('Erro ao processar PDF: ' + error);
//         }
//       };
  
//       // Lê o arquivo como ArrayBuffer
//       reader.readAsArrayBuffer(file);
//     });
//   }
  
//   async function processDocx(file) {
//     const reader = new FileReader();
//     reader.onload = async (event) => {
//       const arrayBuffer = event.target.result;
//       const result = await mammoth.extractRawText({ arrayBuffer });
//       console.log({ content: result.value });  // Substitua para salvar em JSONL
//     };
//     reader.readAsArrayBuffer(file);
//   }
  