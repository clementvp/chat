const {
  passServer,
  clients
} = require('./env.js');
const port =  8080;
const express = require('express');
const password = process.argv[2];
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const session = require('express-session');
const appRoutes = require('./routes/appRoutes.js');
const socketManager = require('./socket-manager');
socketManager.setManager(io);
const bodyParser = require('body-parser');
const path = require('path');
const fich = require('./socket/socket');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// static routes
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'keyboard cat',resave: false,saveUninitialized: true}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use('', appRoutes);

http.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
