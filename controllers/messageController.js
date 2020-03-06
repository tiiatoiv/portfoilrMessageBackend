'use strict';

const messageModel = require('../models/messageModel');


//get all list to the main page
const message_list_get = async (req, res) => {  
    const messages = await messageModel.getAllMessages();
    await res.json(messages);
};

//create message from input body
const message_create_post = async (req, res) => {
    try {
        const params = [
            req.body.sender,
            req.body.receiver,
            req.body.message,
        ];
        console.log('Herere these: ', params);
        const response = await messageModel.addMessage(params);
        await res.json(response);
    } catch (e) {
        console.log('exif error controller issues wtf wtf', e);
        res.status(400).json({message: 'error wtf controller issues'});
    }
};

// get message from user's input id
const message_get = async (req, res) => {  
    const params = [req.params.id];
    const message = await messageModel.getMessage(params);
    await res.json(message[0]);
};

//delete message from input body id 
const message_delete = async (req, res) => {   
    if(req.user === undefined){
        window.location.replace('login.html');
    } else {
        const params = [req.params.id];
        const message = await messageModel.deleteMessage(params);
        await res.json(message);
    }
};


module.exports = {
    message_list_get,
    //dog_mylist_get,
    message_create_post,
    message_get,
    message_delete,
    //dog_update_put
};