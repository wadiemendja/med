import { getConfig } from "./firebaseConfig.js";

// initializing database
const firebaseConfig = getConfig();
firebase.initializeApp(firebaseConfig);

const loginBtn = document.getElementById('login_btn');
const username = document.getElementById('username');
const frontPassword = document.getElementById('password');
const userType = getPath(location.href);
const alarm = document.getElementById('alarm');

// change image
const imgDiv = document.querySelector('.admin-img');
imgDiv.innerHTML = `<img src="./img/${userType}.png"/>`

// click listener 
loginBtn.addEventListener('click', (event) => {
    // preventing the default action
    event.preventDefault();
    // checking that the input fields are not empty
    if (username.value == "") {
        username.style.borderColor = "red";
        return;
    } else if (frontPassword.value == "") {
        frontPassword.style.borderColor = "red";
        return;
    }

    // removing red border when typing
    username.addEventListener('input', (event) => {
        event.target.style.borderColor = "";
        alarm.innerHTML = "";
    });

    frontPassword.addEventListener('input', (event) => {
        event.target.style.borderColor = "";
        alarm.innerHTML = "";
    });

    // loading effect for the login button
    loadingEffect();
    // appending data flow
    const newURL = new URL(location.href);
    newURL.searchParams.append('username', username.value);
    // login node 
    let loginRef = undefined;
    try {
        loginRef = firebase.database().ref('/users/' + username.value);
    } catch (e) {
        // invalid username
        console.log('something went wrong');
    }

    // getting all users
    loginRef.once('value', (snap) => {
        try {
            let password = snap.val().password;
            let type = snap.val().type;
            if (password == frontPassword.value) {
                if (type == userType) {
                    document.cookie = username.value;
                    location.href = "/" + userType;
                } else {
                    deleteLoadingEffect();
                    alarm.innerHTML = '<span style="color:orange">this accout does not have permission to this section please try to login as a ' + type +  ' <a href="/">here</a><br></span>';
                }
            } else {
                deleteLoadingEffect();
                alarm.innerHTML = '<span style="color:red">Invalid password</span>';
            }
        } catch {
            deleteLoadingEffect();
            alarm.innerHTML = '<span style="color:red">Invalid username</span>';
        }
    });
});

username.addEventListener('input', (event) => {
    event.target.style.borderColor = "";
});

frontPassword.addEventListener('input', (event) => {
    event.target.style.borderColor = "";
});

function getPath(string) {
    const index = string.indexOf('=');
    return string.substr(index + 1);
}

function loadingEffect() {
    // loading effect
    loginBtn.innerHTML = `
    <div class="spinner-grow" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
    `;
    // disabeling inputs
    frontPassword.disabled = username.disabled = loginBtn.disabled = true;
}

function deleteLoadingEffect() {
    loginBtn.innerHTML = "Login";
    frontPassword.disabled = username.disabled = loginBtn.disabled = false;
}