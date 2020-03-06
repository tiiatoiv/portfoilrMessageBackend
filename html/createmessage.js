'use strict';

const url = 'http://localhost:5500'; // change url when uploading to server
//const url = '/app/';

const ul = document.getElementById('doglist');  //select ul element in index.html
const receiverList = document.querySelectorAll('.receiver-list');
const userList = document.querySelectorAll('.users-list');
const size = document.getElementById('size');
const addMessageForm = document.getElementById('addMessageForm');
const sendmessage = document.getElementById('sendmessage');

//create options to select the receiver user on the form
const createRecUserOptions = (users) => {
    receiverList.forEach((list) => {
        // clear list
        list.innerHTML = '';
        users.forEach((user) => {
            // create options with DOM methods
            const option = document.createElement('option');
            option.innerHTML = user.username;
            option.classList.add('light-border');
            list.appendChild(option);
        });
    });
};

// get all the users for form options from the database
const getRecUsers = async () => {
    try {
        const options = {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        try {
            const response = await fetch(url + '/user/all', options);
            const users = await response.json();
            createRecUserOptions(users);
        } catch (e) {
            console.log(e.message);
        }
        ;

    } catch (e) {
        console.log(e.message);
    }
};
getRecUsers();

//create options to select the user on the form => only option is the currently logged in user
const createUserOptions = (user) => {
    userList.forEach((list) => {
    // clear list
    list.innerHTML = '';
    // create options with DOM methods
    const option = document.createElement('option');
    option.innerHTML = user.username;
    option.classList.add('light-border');
    list.appendChild(option);
    });
};

// set/fetch the only possible owner option on the form to be the currently logged in user
const getUsers = async () => {
    try {
        const options = {
        headers: {
           'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
        };
        try {
            const response = await fetch(url + '/user', options);
            const user = await response.json();
            createUserOptions(user);
        } catch (e) {
            console.log(e.message);
        }
    } catch (e) {
        console.log(e.message);
    }};
getUsers();

//SEND MESSAGE: add event listener to the form > post message to the database when submitted
addMessageForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
   // const fd = new FormData(addMessageForm);
    const data = serializeJson(addMessageForm);
    console.log('This is about to be sent: ', data);
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: JSON.stringify(data),
    };
    const response = await fetch(url + '/message', fetchOptions);
    const json = await response.json();
    console.log('addmessage response', json);
    window.alert('Message sent.');
    window.location.replace('userpage.html');
});