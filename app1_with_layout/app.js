import express from 'express'

const port = 3000

const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))
// get - HTTP metoda GET (může být i .post .patch .put .delete nebo univerzální .use)
// / - url pro kterou se zavolá callback
app.get('/', (req, res) => {
  // send automaticky nastaví Content-Type dle nejlepšího odhadu
  res.render('index', { title: 'Minecraft', description: 'Learn fascinating facts about Minecraft.', keywords: 'Minecraft, fun facts, games, shop' })
})

app.get('/contact', (req, res) => {
    res.render('contact/index');
  });

app.get('/Games', (req, res) => {
    res.render('games/index'); 
  });

app.get('/shop', (req, res) => {
    res.render('shop/index');
});

app.get('/services', (req, res) => {
    res.render('services/index');
});

app.get('/events', (req, res) => {
    res.render('events/index');
});

app.get('/shopping-cart', (req, res) => {
    res.render('shopping-cart/index');
} );





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