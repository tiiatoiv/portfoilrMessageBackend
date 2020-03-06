'use strict';

const url = 'http://localhost:5500'; // change url when uploading to server
//const url = '/app/';

const ul = document.getElementById('doglist');  //select ul element in index.html
const breedList = document.querySelectorAll('.breed-list');
const breedSearch = document.getElementById('breedSearch');
const sizeSearch = document.getElementById('sizeSearch');
const locationSearch = document.getElementById('locationSearch');
const search = document.getElementById('searchForm');
const loginbutton = document.getElementById('loginbutton');
const logoutbutton = document.getElementById('logoutbutton');
const userpage = document.getElementById('userpage');

logoutbutton.style.display = 'none';
userpage.style.display= 'none';

//create option for search-select element
const createBreedOptions = (breeds) => {
  breedList.forEach((list) => {
    // clear list
    list.innerHTML = '';
    breeds.forEach((breed) => {
      // create options with DOM methods
      const option = document.createElement('option');
      option.innerHTML = breed.type;
      option.classList.add('light-border');
      list.appendChild(option);
    });
  });
};

// get breeds to form options in search part
const getBreeds = async () => {
    try {
      const response = await fetch(url + '/breed/');
      const breeds = await response.json();
      createBreedOptions(breeds);
    } catch (e) {
    console.log(e.message);
  }
};
getBreeds();

//build specific card for each dog
const getDog =  (dogs) => {
  // clear ul
  ul.innerHTML = '';
  dogs.forEach( async (dog) => {
    // create li with DOM methods
    const breed =  await getBreed(dog.breed);
    const img = document.createElement('img');
    img.src = url + '/thumbnails/' + dog.filename;
    img.alt = dog.name;
    img.classList.add('resp');  

    const figure = document.createElement('figure').appendChild(img);

    const h2 = document.createElement('h2');
    h2.innerHTML = dog.name;

    const p1 = document.createElement('p');
    p1.innerHTML = `Date: ${dog.dob}`;

    const p2 = document.createElement('p');
    p2.innerHTML = `Type: ${dog.breed}`;

    const p3 = document.createElement('p');
    p3.innerHTML = `Smthn: ${breed.size}`;

    const p4 = document.createElement('p');
    p4.innerHTML = `Host: ${dog.owner}`;

    const p5 = document.createElement('p');
    p5.innerHTML = `Location: ${dog.location}`;

    const viewButton = document.createElement('button');
    viewButton.innerHTML = 'View';
    viewButton.className = 'viewButton';
    viewButton.setAttribute ('class', 'viewButton');  //add style
    viewButton.addEventListener('click', () => {  //when clicked, redirect to its page
      const id = dog.id;
      try{
          window.location.assign('../html/dog.html?id=' + id);
      } catch (e) {
          console.log(e.message);
      }
    });

    const li = document.createElement('li');
    li.classList.add('light-border');
    li.setAttribute('class','dogItem');

    //append element
    li.appendChild(h2);
    li.appendChild(figure);
    li.appendChild(p1);
    li.appendChild(p2);
    li.appendChild(p3);
    li.appendChild(p4);
    li.appendChild(p5);
    li.appendChild(viewButton);
    ul.appendChild(li);
  });
};

//get all dogs in databse 
const getDogs = async () => {
  try {
    const response = await fetch(url + '/dog');
    const dogs = await response.json();
    getDog(dogs);
  }
  catch (e) {
    console.log(e.message);
  }
};
getDogs();
 
//get information of breed with name(id)
const getBreed = async (id) => {
  try {
    const response = await fetch(url + '/breed/' + id);
    const breed = await response.json();
    return breed;
  } catch (e){
    console.log(e.message);
  }
};

//show/hid logout/login button based on if user is logged in or not
logoutbutton.addEventListener('click', async (evt) => {
    evt.preventDefault();
    try {
        const options = {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        const response = await fetch(url + '/auth/logout', options);
        const json = await response.json();
        console.log(json);
        // remove token
        sessionStorage.removeItem('token');
        alert('You have been logged out. See you next time!');
        //show/hid logout/login button
        logoutbutton.style.display = 'none';
        loginbutton.style.display = 'block';
        window.location.replace('index.html');
    }
    catch (e) {
        console.log(e.message);
    }
});

//show/hid logout/login button based on if user is logged in or not
if (sessionStorage.getItem('token')) {
    loginbutton.style.display = 'none';
    logoutbutton.style.display = 'block';
    userpage.style.display= 'block';
}

search.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log("clcik");
  const breed = breedSearch.options[breedSearch.selectedIndex].text;
  const location = locationSearch.value;
  console.log(breed, location);
  try {
    const response = await fetch(url + '/dog/search/' + breed + '/'+ location);
    const dogs = await response.json();
    getDog(dogs);
  } catch (e) {
  console.log(e.message);
  }
});
