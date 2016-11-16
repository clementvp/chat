// /routes/appRoutes.js
const express = require('express');
const router = express.Router();
const {
  indexAction,
  chatAction,
  authAction
} = require('../controllers/chatController');

router.get('/',indexAction);
router.get('/chat',chatAction);
router.post('/',authAction);

// DO NOT FORGET
module.exports = router;
