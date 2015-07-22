var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var path = require('path');
var jade = require('jade');
var bodyParser = require('body-parser');
var slug = require('slug');

var app = express();
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(morgan());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/bloggerDB');
var Blog = mongoose.model('Blog', {
	title: String,
	content: String,
	category: String,
	slug: String
});

// REST
// resource blog
	// all blogs /blog
	// particular blog /blog/:slug
	// post blog /blog
// new blog form /blog/new


// GET all blogs
app.get('/blog', function(req, res) {
	Blog.find({}, function(err, data) {
		if(err) {
			console.log(err);
			return;
		}
		res.render('blog', {blogs: data});
	});
});

// POST blog
app.post('/blog', function(req, res) {
	var data = {
		title: req.body.title,
		content: req.body.content,
		category: req.body.category,
		slug: slug(req.body.title).toLowerCase()
	}

	Blog(data).save(function(err) {
		if(err) {
			console.log(err);
			return
		}
		res.send(201);
	});
});

// GET new blog templates
app.get('/blog/new', function(req, res) {
	res.render('new');
});

// GET particular blog
app.get('/blog/:slug', function(req, res) {
	var slug = req.params.slug;

	Blog.find({slug: slug}, function(err, data) {
		if(err) {
			console.log(err);
			return;
		}
		res.render('blog', {blogs: data});
	});
});


// CLEAR DB
app.get('/db/clear', function(req, res) {
	Blog.remove({}, function(err) {
		if(err)
			console.log(err)
		res.send(200)
	})
})

app.listen(app.get('port'));
