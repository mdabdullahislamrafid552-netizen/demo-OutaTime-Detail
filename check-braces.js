import fs from 'fs';

let content = fs.readFileSync('src/pages/Admin.tsx', 'utf-8');

let p = 0;
let b = 0;

const fs2 = fs;
const content3 = fs2.readFileSync('update-admin-full.js', 'utf-8');
const i1 = content3.indexOf('newRender = `') + 13;
const i2 = content3.lastIndexOf('`;');
const raw = content3.slice(i1, i2);
let lastP = [];
for (let i = 0; i < raw.length; i++) {
  if (raw[i] === '(') { p++; lastP.push(i); }
  if (raw[i] === ')') { p--; lastP.pop(); }
}
const fixEscapes = (file) => {
  let c = fs.readFileSync(file, 'utf-8');
  let original = c;
  c = c.replace(/\\`/g, '`');
  c = c.replace(/\\\$/g, '$');
  if (c !== original) {
    fs.writeFileSync(file, c);
    console.log("Fixed", file);
  }
};
fixEscapes('src/lib/cms.ts');
fixEscapes('src/pages/Admin.tsx');
