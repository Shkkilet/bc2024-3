const fs = require('fs');
const path = require('path');
const { Command } = require('commander');

const program = new Command();

// Налаштування командного рядка
program
    .requiredOption('-i, --input <path>', 'шлях до файлу для читання (обовʼязковий параметр)')
    .option('-o, --output <path>', 'шлях до файлу для запису результату')
    .option('-d, --display', 'виведення результату в консоль');

program.parse(process.argv);

const options = program.opts();

// Функція для виведення повідомлень про помилки та завершення програми
function exitWithError(message) {
    console.error(message);
    process.exit(1);
}

// Перевірка, чи існує файл для читання
const inputPath = path.resolve(options.input);
if (!fs.existsSync(inputPath)) {
    exitWithError("Cannot find input file");
}

try {
    // Читання JSON-файлу
    const rawData = fs.readFileSync(inputPath, 'utf-8');
    const jsonData = JSON.parse(rawData);

    // Пошук активу з найменшим значенням
    let minAsset = jsonData[0];
    jsonData.forEach(asset => {
        if (Number(asset.value) < Number(minAsset.value)) {
            minAsset = asset;
        }
    });

    // Формування рядка для виводу
    const outputString = `${minAsset.txt}:${minAsset.value}`;

    // Обробка виводу залежно від параметрів командного рядка
    if (options.output) {
        const outputPath = path.resolve(options.output);
        fs.writeFileSync(outputPath, outputString, 'utf-8');
    }

    if (options.display) {
        console.log(outputString);
    }

    // Якщо жоден з необов'язкових параметрів не задано - нічого не виводимо
} catch (error) {
    exitWithError(`Error processing the file: ${error.message}`);
}
