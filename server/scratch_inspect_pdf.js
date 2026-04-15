import { createRequire } from 'module';
const require = createRequire(import.meta.url);

async function test() {
    try {
        const pdf = require('pdf-parse');
        const dataBuffer = Buffer.from("%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<< /Size 1 >>\n%%EOF");
        
        const instance = new pdf.PDFParse(new Uint8Array(dataBuffer));
        const text = await instance.getText();
        console.log("Text returned by getText():", typeof text);
        console.log("Value:", text);
    } catch (error) {
        console.error("Error:", error);
    }
}

test();
 