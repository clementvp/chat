const session = require('express-session');
const jwt = require('jsonwebtoken');
const {
  passServer,
  clients
} = require('../env.js');

const indexAction = (req, res)=>{
  res.render('login');
};

const chatAction = (req, res)=>{
  if (req.session.token)
  {
    try {
      var decoded = jwt.verify(req.session.token, passServer+'uyzeghsdskqsoiizeuffh');
      res.render('chat',{name: decoded.username, jwt: req.session.token});
    } catch(err) {
      res.redirect('/');
    }
  }
  else
  {
    res.redirect('/');
  }
};

const authAction = (req, res)=>{
  const username = req.body.username;
  const password = req.body.password;
  if (!username || username === "" || password != passServer)
  {
    res.render('login', {error: "Bad password or empty name."});
  }
  else
  {
    if (Object.keys(clients).length === 0)
    {
      var token = jwt.sign({ username: username }, passServer+'uyzeghsdskqsoiizeuffh');
      req.session.token = token;
      res.redirect('/chat');
    }
    else
    {
      for (var keys in clients)
      {
        if(clients[keys] === username)
        {
          res.render('login', {error: "This username is already taken"});
        }
        else
        {
          var token = jwt.sign({ username: username }, passServer+'uyzeghsdskqsoiizeuffh');
          req.session.token = token;
          return res.redirect('/chat');
        }
      }
    }
  }
};

module.exports = {
  indexAction,
  chatAction,
  authAction
};
