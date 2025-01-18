import express from "express";
const router = express.Router()

router.get('/', (req, res) => {
    res.render('index', { title: 'Minecraft', description: 'Learn fascinating facts about Minecraft. pishov nachuj', keywords: 'Minecraft, fun facts, games, shop' })
})

router.get('/Games', (req, res) => {
    res.render('games/index', { title: 'Games', description: 'Explore various Minecraft game modes, from Survival to Creative and Adventure, and enhance your gameplay experience.', keywords: 'Minecraft game modes, Survival mode, Creative mode, Adventure mode, Minecraft gameplay, gaming modes.' });
});

router.get('/shop', (req, res) => {
    res.render('shop/index', { title: 'shop', description: 'Shop Minecraft-themed products, including toys, apparel, and collectibles like plushes, t-shirts, and accessories.', keywords: 'Minecraft shop, Minecraft products, Minecraft merchandise, Minecraft toys, Minecraft collectibles, Minecraft apparel, Minecraft gifts.' });
});

router.get('/services', (req, res) => {
    res.render('services/index', { title: 'services', description: 'Explore Minecraft services like custom builds, server hosting, and tutorials to enhance your gaming.', keywords: 'Minecraft services, custom builds, server hosting, tutorials, Minecraft community.' });
});

router.get('/events', (req, res) => {
    res.render('events/index', { title: 'Events', description: 'Stay updated on exciting Minecraft events, including tournaments and fan meetups. Join the fun and register now!', keywords: 'Minecraft events, gaming tournaments, fan meetup, online events, Minecraft community.' });
});

router.get('/shopping-cart', (req, res) => {
    res.render('shopping-cart/index', { title: 'shopping', description: 'Review and manage the items in your shopping cart before proceeding to checkout.', keywords: 'shopping cart, Minecraft store, cart review, checkout, online shopping.' });
});

export default router