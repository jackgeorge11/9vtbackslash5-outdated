const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Subscription = require('./models/mailing-list');
const Manuscript = require('./models/triple-entendre.js');
const Sketch = require('./models/moods.js');
require('dotenv').config();

const dbUrl = process.env.MONGODB_CONNECTION_STRING
mongoose.connect(dbUrl, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();


app.set('view engine', 'ejs');
app.use("/styles",express.static(__dirname + "/styles"));
app.use("/functions",express.static(__dirname + "/functions"));
app.use("/images",express.static(__dirname + "/images"));
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000
app.listen(port, () => {
	console.log('listening')
});

app.get('/', (req, res) => {
	res.render('home')
});

app.get('/submissions', (req, res) => {
	res.render('submissions')
});

app.get('/inquiries', (req, res) => { 
	res.render('inquiries', {subscribeText: 0});
});

app.post('/inquiries', async (req, res) => {
	const entry = req.body;
	const realEntry = await Subscription.find(entry).then(data => {return data[0]});
	let emailChecker = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	if (realEntry == undefined) {
		const subscription = new Subscription(req.body)
		await subscription.save();
		res.render('inquiries', {subscribeText: 1});
	} else if (!realEntry.email.match(emailChecker)) {
		res.render('inquiries', {subscribeText: 3});
	} else {
		res.render('inquiries', {subscribeText: 2, email: entry.email});
	}
});

app.get('/about-us', (req, res) => {
	res.render('about-us')
});

// app.get('/catalogue', async (req, res) => {
// 	const ids = ['608ecb375efe9cd7185c2298', '608ecb395efe9cd7185c229c', '608ecb395efe9cd7185c229d', '608ecb395efe9cd7185c229e', '608ecb3a5efe9cd7185c229f', '608ecb3a5efe9cd7185c22a0'];
// 	let collection = await Sketch.find({_id: {$in:ids}});
// 	const sketch = collection[Math.floor(Math.random() * 6)]
// 	res.render('catalogue', {image: sketch.img1});
// });

app.get('/catalogue', async (req, res) => {
	const ids = ['608ecb375efe9cd7185c2298', '608ecb395efe9cd7185c229c', '608ecb395efe9cd7185c229d', '608ecb395efe9cd7185c229e', '608ecb3a5efe9cd7185c229f', '608ecb3a5efe9cd7185c22a0'];
	const index = ids[Math.floor(Math.random() * 6)]
	let sketch = await Sketch.find({_id: index}).then(data => {return data[0]});
	console.log(sketch)
	res.render('catalogue', {image: sketch.img1})
});

app.get('/triple-entendre', (req, res) => {
	res.render('catalogue/triple-entendre/details', { generated: false});
});

app.post('/triple-entendre', async (req, res) => {
	const manuscript = await Manuscript.find({title: 'triple-entendre'}).then(data => {return data[0]});
	const generateSection = Math.floor(Math.random() * 8);
	const randomSection = String(manuscript.sections[generateSection]);
	const randomSectionLength = randomSection.length;
	const randomNumber = Math.floor(Math.random() * (randomSectionLength - 1001));
	const randomExcerpt = randomSection.slice(randomNumber, (randomNumber + 1001));
	res.render('catalogue/triple-entendre/details', {manuscript, randomExcerpt, generated: true})
});

app.get('/triple-entendre/buy', (req, res) => {
	res.render('catalogue/triple-entendre/buy', { country: 'none'});
});

app.post('/triple-entendre/buy', (req, res) => {
	res.render('catalogue/triple-entendre/buy', { country: req.body.action});
});

app.get('/moods', async (req, res) => {
	let collection = await Sketch.find();
	const sold = collection.filter(sketch => !sketch.sold);
	collection = collection.filter(sketch => sketch.sold);
	function shuffle(array) {
		let currentIndex = array.length, temporaryValue, randomIndex;
	  
		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
	  
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
		
			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
	  
		return array;
	}
	shuffle(collection);
	collection.unshift(...sold)
	console.log(collection)
	res.render('catalogue/moods/collection', {collection: collection});
});

app.get('/moods/:sketch', async (req, res) => {
	try {
		const mood = await Sketch.findById(req.params.sketch);
		res.render(`catalogue/moods/details`, { sketch: mood, imgA: false, imgB: false })
	} catch (e) {
		res.status(404).render('error');
	}
});

app.post('/moods/:sketch', async (req, res) => {
	try {
		const mood = await Sketch.findById(req.params.sketch);
		if (req.body.img === 'imgA') {
			res.render(`catalogue/moods/details`, { sketch: mood, imgA: true, imgB: false })
		}
		else if (req.body.img === 'imgB') {
			res.render(`catalogue/moods/details`, { sketch: mood, imgA: false, imgB: true })
		}
		else {
			res.render(`catalogue/moods/details`, { sketch: mood, imgA: false, imgB: false })
		}
	}
	catch {
		res.status(404).render('error');
	}
});

app.get('/moods/:sketch/buy', async (req, res) => {
	try {
		const mood = await Sketch.findById(req.params.sketch);
		res.render(`catalogue/moods/buy`, { sketch: mood, imgA: false, imgB: false, country: 'none' })
	} catch (e) {
		res.status(404).render('error');
	}
});

app.post('/moods/:sketch/buy', async (req, res) => {
	const mood = await Sketch.findById(req.params.sketch);
	console.log(req.body)
	if (req.body.customer) {
		await Sketch.findByIdAndUpdate(req.params.sketch, { description: [req.body.customer], sold: true })
		res.render('catalogue/moods/buy', { sketch: mood, country: 'purchased'});
	} else {
		res.render('catalogue/moods/buy', { sketch: mood, country: req.body.action});
	}
});

app.get('/frustrations', async (req, res) => {
	res.render(`catalogue/frustrations/details`, { phase: 1 })
});

app.post('/frustrations', async (req, res) => {
	if (req.body.email && (req.body.email === 'your email' || req.body.email === 'your email below' || req.body.email === 'your email below.')) {
		res.render(`catalogue/frustrations/details`, { phase: 'email' })
	} else if (req.body.captcha && (req.body.captcha === 'the following captcha' || req.body.captcha === 'the following captcha below' || req.body.captcha === 'the following captcha below.')) {
		res.render(`catalogue/frustrations/details`, { phase: 'captcha' })
	} else if (req.body.email) {
		let email = req.body.email
		let phase = parseInt(req.body.phase)
		let emailLength = email.length
		let emailIndex = Math.floor(Math.random() * emailLength) - 1
		phase ++
		email = email.slice(0, emailIndex) + email.slice(emailIndex + 1);
		res.render(`catalogue/frustrations/details`, { phase: phase, email: email })
	} else if (req.body.captcha) {
		let phase = parseInt(req.body.phase)
		phase ++
		res.render(`catalogue/frustrations/details`, { phase: phase })
	}
});

app.get('*', (req, res) => {
  res.status(404).render('error');
});