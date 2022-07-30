const express = require('express');
const { engine } = require('express-handlebars')
const bodyParser = require('body-parser');
const myconnection = require('express-myconnection');
const mysql = require('mysql');
const tareasRoutes = require('./routes/tareas');
const session = require('express-session');


const app = express();

app.set('port',5000);

app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({
    extended: true
  }));

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.json());

app.engine('.hbs',engine({
    extname:".hbs"
}));

app.set('view engine', 'hbs');

app.listen(app.get('port'),()=>{
    console.log('Listening on port ',app.get('port'));
});

app.use(myconnection(mysql,{
    /*host:'us-cdbr-east-06.cleardb.net',
    user:'b4669df0bb5da0',
    password:'925c4333',
    port:3306,
    database:'heroku_dc38cc6e6a69140'*/
    host:'localhost',
    user:'jcardzte_root',
    password:'password',
    port:3306,
    database:'jcardzte_tareascrud'
}));

app.use('/',tareasRoutes);

app.get('/', (req, res) => {
	if (req.session.loggedin) {
		let name = req.session.name;

 		res.render('home', { name });
	} else {
		res.redirect('/tareas');
	}
});