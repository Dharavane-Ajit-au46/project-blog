var bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    express             = require("express"),
    app                 = express(),
    methodOverride      = require("method-override"),
    expressSanitizer    = require("express-sanitizer"),
    flash               = require("connect-flash"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    Blog                = require("./models/blog"),
    Comment             = require("./models/comment"),
    User                = require("./models/user");
   
//Require Route Root
var authRoutes = require("./routes/auth");
var blogRoutes = require("./routes/blogs");
var commentRoutes = require("./routes/comments");
    


//mongodb+srv://nikita:nikita1177@cluster0.btpf57w.mongodb.net/test
mongoose.set('strictQuery', false)
mongoose.connect("mongodb+srv://ajit:12345@cluster0.awuxtuk.mongodb.net/test",function(err){
    if(err) console.log(err);
    console.log('MongoDB Connected');
});
// mongoose.connect("mongodb+srv://ajit:12345@cluster0.awuxtuk.mongodb.net/test");

mongoose.Promise = global.Promise;
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(expressSanitizer()); 
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());

//Passport Config
app.use(require("express-session")({
    secret: "shhh, its our secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//This is middleware
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(authRoutes);
app.use("/blogs", blogRoutes);
app.use("/blogs/:id/comments", commentRoutes);

app.get("/", function(req, res){
    res.redirect("blogs");
});

const PORT = process.env.PORT || 8897

 app.listen(PORT, function(){
  console.log("SERVER IS STARTED");
 })
