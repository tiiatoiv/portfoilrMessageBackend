'use strict';
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const messageController = require('../controllers/messageController');

router.get('/', messageController.message_list_get);  //get all messages

router.get('/:id', messageController.message_get);     //get specific message


router.post('/', messageController.message_create_post); //send messages

router.delete('/:id', messageController.message_delete);  //delete message

module.exports = router;