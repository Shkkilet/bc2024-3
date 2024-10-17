const fs = require('fs');
const path = require('path');
const { Command } = require('commander');

const program = new Command();

program
    .requiredOption('-i, --input <path>', 'шлях до файлу для читання (обовʼязковий параметр)')
    .option('-o, --output <path>', 'шлях до файлу для запису результату')
    .option('-d, --display', 'виведення результату в консоль');

program.parse(process.argv);

const options = program.opts();


function exitWithError(message) {
    console.error(message);
    process.exit(1);
}

const inputPath = path.resolve(options.input);
if (!fs.existsSync(inputPath)) {
    exitWithError("Cannot find input file");
}

try {
    const rawData = fs.readFileSync(inputPath, 'utf-8');
    const jsonData = JSON.parse(rawData);

    let minAsset = jsonData[0];
    jsonData.forEach(asset => {
        if (Number(asset.value) < Number(minAsset.value)) {
            minAsset = asset;
        }
    });

    const outputString = `${minAsset.txt}:${minAsset.value}`;

    if (options.output) {
        const outputPath = path.resolve(options.output);
        fs.writeFileSync(outputPath, outputString, 'utf-8');
    }

    if (options.display) {
        console.log(outputString);
    }

} catch (error) {
    exitWithError(`Error processing the file: ${error.message}`);
}