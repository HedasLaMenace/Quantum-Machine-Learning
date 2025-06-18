const fs = require('fs');
const path = require('path');

const commandsDir = path.join(__dirname, 'src', 'commands');

function updateImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Exemple basique : remplacer require('./sendlog') par require('../sendlog') si besoin
  // Tu peux ajouter plus de règles ici selon ta structure

  content = content.replace(/require\(['"]\.\/sendlog['"]\)/g, "require('../sendlog')");
  content = content.replace(/require\(['"]\.\/modules\//g, "require('../modules/");

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated imports in ${filePath}`);
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith('.js')) {
      updateImports(fullPath);
    }
  }
}

walk(commandsDir);