import express from "express";
const router = express.Router()

router.get('/', (req, res) => {
    res.render('../views/contact/index', { title: 'Contact', description: 'Reach out to us for inquiries or support. Contact us via email or follow us on social media for further assistance', keywords: 'Minecraft, fun contact, support, inquiries, Minecraft Facts, customer service, email, social mediafacts, games, shop', result: null });
});

router.post('/', (req, res) => {
    const body = req.body;
    console.log(req.body);

    const successMessage = "Your message has been sent successfully!";
    res.render('contact/index', {
        title: 'Contact',
        description: 'Reach out to us for inquiries or support. Contact us via email or follow us on social media for further assistance',
        keywords: 'Minecraft, fun contact, support, inquiries, Minecraft Facts, customer service, email, social mediafacts, games, shop',
        result: successMessage,
    });
});


export default router