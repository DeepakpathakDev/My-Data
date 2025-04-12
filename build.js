const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

// Copy files
const filesToCopy = [
    'app.js',
    'package.json',
    '.env',
    'public',
    'routes'
];

filesToCopy.forEach(file => {
    try {
        const source = path.join(__dirname, file);
        const destination = path.join(distDir, file);
        
        if (!fs.existsSync(source)) {
            console.warn(`Warning: ${file} does not exist, skipping...`);
            return;
        }
        
        if (fs.lstatSync(source).isDirectory()) {
            // Copy directory recursively
            copyDir(source, destination);
            console.log(`Copied directory: ${file}`);
        } else {
            // Copy file
            fs.copyFileSync(source, destination);
            console.log(`Copied file: ${file}`);
        }
    } catch (error) {
        console.error(`Error copying ${file}:`, error.message);
    }
});

// Install production dependencies
try {
    console.log('Installing production dependencies...');
    process.chdir(distDir);
    execSync('npm install --production', { stdio: 'inherit' });
    console.log('Build completed successfully!');
} catch (error) {
    console.error('Error installing dependencies:', error.message);
    process.exit(1);
}

function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
} 