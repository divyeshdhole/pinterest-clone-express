const express = require('express');
const bodyParser = require('body-parser');
const User= require('./models/user');
const Post = require('./models/post');
const session = require('express-session');
const passport = require('passport');
const connection = require('./config/connection');
const app = express();
const ejs = require('ejs');
const flash = require('connect-flash');

app.use(flash());
app.use(express.json());
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));

app.use(
  session({
    secret:'secret',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());

app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

app.get('/', function (req, res) {  
    res.render('register');
});

app.get('/login', function (req, res) {
    res.render('login', {error: req.flash('error')});
});

app.get("/feed", function (req, res) {
    res.render('feed');
});
app.get('/profile', function (req, res) {
    if(req.isAuthenticated()) {
        res.render('profile');
    }
    else {
        res.redirect('/login');
    }
});
app.post("/register", (req, res) => {
    User.register(new User({ username: req.body.username, fullname: req.body.fullname, email: req.body.email }), req.body.password, function(err, user) {
        if (err) {
            console.log(req.body);
            res.send(err.message);
        } else {
            passport.authenticate('local')(req, res, function() {
                res.redirect('/profile');
            });
        }
    });
});

app.post("/login", passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/failure',
    failureFlash: true  
}));
app.get("/failure", function(req, res) {
    res.send("user not found");
});

app.get('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/login');
    });
  });

app.get("/alluserspost", function(req, res) {
    User.findOne({_id: "668aa5e13f5a92c7630bb2b0"})
    .populate('posts')
    .then(function(user) {
        res.send(user);
    });

});
app.get("/createpost", (req, res) => {
    const post = new Post({
        content: "hello world",
        users: "668aa5e13f5a92c7630bb2b0"
    });

    post.save()
        .then((savedPost) => {
            return User.findOne({ _id: "668aa5e13f5a92c7630bb2b0" })
                .then((user) => {
                    if (!user) {
                        throw new Error('User not found');
                    }
                    user.posts.push(savedPost._id);
                    user.save();
                })
                .then(() => {
                    res.send(savedPost);
                });
        })
        .catch((error) => {
            res.status(500).send(error.message);
        });
});



app.listen(3000, function () {
    console.log('Server is running on port 3000');
});

  
