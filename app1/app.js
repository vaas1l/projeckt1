import express from 'express'

const port = 3000

const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))
// get - HTTP metoda GET (může být i .post .patch .put .delete nebo univerzální .use)
// / - url pro kterou se zavolá callback
app.get('/', (req, res) => {
  // send automaticky nastaví Content-Type dle nejlepšího odhadu
  res.render('index', { title: 'Minecraft', description: 'Learn fascinating facts about Minecraft. pishov nachuj', keywords: 'Minecraft, fun facts, games, shop' })
})

app.get('/contact', (req, res) => {
    res.render('contact/index', { title: 'Contact', description: 'Reach out to us for inquiries or support. Contact us via email or follow us on social media for further assistance', keywords: 'Minecraft, fun contact, support, inquiries, Minecraft Facts, customer service, email, social mediafacts, games, shop' });
  });

app.get('/Games', (req, res) => {
    res.render('games/index', { title: 'Games', description: 'Explore various Minecraft game modes, from Survival to Creative and Adventure, and enhance your gameplay experience.', keywords: 'Minecraft game modes, Survival mode, Creative mode, Adventure mode, Minecraft gameplay, gaming modes.'}); 
  });

app.get('/shop', (req, res) => {
    res.render('shop/index', {title:'shop', description: 'Shop Minecraft-themed products, including toys, apparel, and collectibles like plushes, t-shirts, and accessories.', keywords: 'Minecraft shop, Minecraft products, Minecraft merchandise, Minecraft toys, Minecraft collectibles, Minecraft apparel, Minecraft gifts.'});
});

app.get('/services', (req, res) => {
    res.render('services/index', {title: 'services', description: 'Explore Minecraft services like custom builds, server hosting, and tutorials to enhance your gaming.', keywords:'Minecraft services, custom builds, server hosting, tutorials, Minecraft community.' });
});

app.get('/events', (req, res) => {
    res.render('events/index', { title: 'Events', description: 'Stay updated on exciting Minecraft events, including tournaments and fan meetups. Join the fun and register now!', keywords:'Minecraft events, gaming tournaments, fan meetup, online events, Minecraft community.'});
});

app.get('/shopping-cart', (req, res) => {
    res.render('shopping-cart/index', {title:'shopping', description: 'Review and manage the items in your shopping cart before proceeding to checkout.', keywords:'shopping cart, Minecraft store, cart review, checkout, online shopping.'});
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