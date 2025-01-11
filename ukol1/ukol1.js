// zadani prectu cislo se souboru a cislo sectu se x a x muyu zmenit ve kodu 
//завдання треба учинити функцію яка буде брати з текстового файлу цифру і додавати уту цифру до x потому виследек буде закидувати в инший файл який же ута функція і зробить 



import fs from 'fs';
const x = 10;

fs.readFile('ukol.txt', 'utf8', (err, ukol) => {
    if (err) {
        console.error(err);
    }
    else {
        console.log(parseFloat(ukol) + x);
        fs.writeFile('vysledek.txt', (parseFloat(ukol) + x).toString(), err => {
            if (err) {
                console.error(err);
            }
        });
    }
});

