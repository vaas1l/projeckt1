const readline =require('readline');


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function calculator() {
    rl.question('Enter first number: ', (num1) => {
        rl.question('Enter second number: ', (num2) => {
            console.log(`Sum: ${parseFloat(num1) + parseFloat(num2)}`);
            rl.close();
        });
    });
}