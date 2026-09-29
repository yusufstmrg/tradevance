const fs = require('fs');
const path = require('path');
const walk = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
        }
    });
    return results;
};
walk('src').forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    let imports = [];
    content = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"];?/g, (match, p1) => {
        imports = p1.split(',').map(s => s.trim()).filter(Boolean);
        return 'import * as LucideIcons from "lucide-react";';
    });
    if (imports.length > 0) {
        imports.forEach(imp => {
            const regex = new RegExp('\\b' + imp + '\\b', 'g');
            content = content.replace(regex, 'LucideIcons.' + imp);
        });
        content = content.replace(/LucideIcons\.LucideIcons\./g, 'LucideIcons.');
        fs.writeFileSync(f, content);
    }
});
