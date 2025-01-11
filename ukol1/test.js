import fs from 'fs';

fs.readFile('data2.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
    }
    else {
        console.log(data);
    }
});