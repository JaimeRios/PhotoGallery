//main file
//Module require
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const  methodOverride = require('method-override');
const  session = require('express-session');

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
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'condorLabsTest',
    resave: true,
    saveUninitialized: true
}));

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

