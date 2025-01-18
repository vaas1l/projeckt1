import express from 'express'
import publicRouter from './routes/public.js'
import contactRouter from './routes/contact.js'

const port = 3000

const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.json()); // Parse JSON data

// get - HTTP metoda GET (může být i .post .patch .put .delete nebo univerzální .use)
// / - url pro kterou se zavolá callback

app.use('/', publicRouter);
app.use('/contact', contactRouter);

app.get('/jsonn', (req, res) => {
  // Express automaticky nastavi spravne content-type a serialzuje objekt do JSONu
  res.send({ firstName: 'Franta', lastName: 'Sádlo' })
})

// :name reprezentuje dynamický parametr
// /hello/Franta - projde
// /hello/Lojza - projde
// /hello - neprojde
// /hello/Pepa/Zdepa - neprojde
app.get('/hello/:name', (req, res) => {
  const name = req.params.name

  res.send(`<h1>Hello, ${name}!</h1>`)
})

// Univerzální handler který zachytí všechny požadavky,
// které nezachytili handlery výše a zobrazí 404
app.use((req, res) => {

  res.status(404)
  res.send('404 - Not found')
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})