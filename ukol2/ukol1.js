// zadani prectu cislo se souboru a cislo sectu se x a x muyu zmenit ve kodu 
//завдання треба учинити функцію яка буде брати з текстового файлу цифру і додавати уту цифру до x потому виследек буде закидувати в инший файл який же ута функція і зробить 



import fs from 'fs/promises';
const x = 10;

const writeNewFile = (number, x) => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                await fs.writeFile('vysledek.txt', (parseFloat(number) + x).toString());
                resolve("OK")
            } catch (error) {
                reject(error)   
            }
        }, 1000)
    })
}

try {
    const number = await fs.readFile('ukol.txt', 'utf8');
    console.log(number)
    await writeNewFile(number, x);
    const result = await fs.readFile('vysledek.txt', 'utf8');
    console.log(result);
} catch (err) {
    console.error(err)
}
