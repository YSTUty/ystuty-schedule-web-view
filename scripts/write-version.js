const fs = require('fs');
const packageJson = require('../package.json');

function bootstrap() {
    fs.writeFileSync('./public/version.json', JSON.stringify({ v: packageJson.version }));
}

bootstrap();
