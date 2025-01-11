import fs from 'fs';

fs.readFile('ukol.txt', 'utf8', (err, ukol) => {
    if (err) {
        console.error(err);
    }
    else {
        console.log(ukol);
    }
});