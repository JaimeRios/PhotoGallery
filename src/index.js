//main file
//Module require
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const multer = require('multer');
const morgan = require('morgan');
const flash = require('connect-flash');
const { nextTick } = require('process');
const favicon = require('serve-favicon')

//enviroment variables
if(process.env.NODE_ENV !=='production'){
    require('dotenv').config();
}

const router = express.Router();

//Initializations
const app = express();
require('./database');

//Setting coffigurations
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));


//configure views extension
app.engine('.hbs', exphbs({
    defaultLayout:  'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));

//configure views engine
app.set('view engine','.hbs');

//Middlewares
//get data from view
app.use(morgan('dev'));

app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon2.ico')));
const storage =multer.diskStorage({
    destination: path.join(__dirname,'public/upload'),
    filename: (req, file,cb)=>{
        //Rename image with time and extension
        cb(null, new Date().getTime()+ path.extname(file.originalname));
    }
});

const upload = multer({
    storage : storage,
    dest: path.join(__dirname, 'public/upload'),
}).single('image');

app.use(upload);
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'condorLabsTest',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());


//global variables
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.idAlbum = req.flash('idAlbum');
    next();
})

//Routes
app.use(require('./routes/index'));
app.use(require('./routes/images'));
app.use(require('./routes/albums'));
app.use(require('./routes/users'));

//static Files
app.use(express.static(path.join(__dirname, 'public')));

//Server listening 
app.listen(app.get('port'), ()=>{
    console.log('Server is listening on port ', app.get('port'));
});

router.get('/', (req, res)=>{
    res.send('index');
});

