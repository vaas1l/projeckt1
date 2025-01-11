

function asyncAdd(a, b) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (isNaN(a) || isNaN(b)) {
                reject(new Error('One of the arguments is not a number'))
            }
            resolve(a + b)
        }, 1000)
    })
}

const result = asyncAdd(1, "a")

result.then((value) => {
    console.log(value) // 3
}).catch((error) => {
    console.error(error)
})

const result2 = await asyncAdd(2, 3)
console.log(result2) // 5
// result.then((value) => {
//     console.log(value) // 3
// })