// requires
var
express      = require('express'),
morgan       = require('morgan'),
serveStatic  = require('serve-static'),
bodyParser   = require('body-parser');

var
app = express();

// settings
app.set('views', 'jade');
app.set('view engine', 'jade');

// middlewares
app.use(morgan('dev'));
app.use(serveStatic('static'));
app.use(bodyParser.json());

// routing
app.get('/', function (req, res) {
  res.render('index');
});

app.post('/save', require('./app/save.js'));

app.use(function (err, req, res, next) {
  if (err) {
    console.log('\u001b[41;30m Error \u001b[0m', err);
    res.status(500).json({
      ok: false,
    });
  }

  next();
});

// server
var
server = app.listen(3000);
console.log('http://localhost:3000');
