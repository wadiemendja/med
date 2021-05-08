import { getConfig } from "./firebaseConfig.js";

// initializing database
const firebaseConfig = getConfig();
firebase.initializeApp(firebaseConfig);

const signupBtn = document.getElementById('signup_btn');

signupBtn.addEventListener('click', ()=> {
    const username = document.getElementById('username').value;
    const frontPassword = document.getElementById('password').value;
    const fullName = document.getElementById('fullName').value;
    const type = document.querySelector('.form-select').value;
    const newUserRef = firebase.database().ref('users/' + username);
    const data = {
        username: username,
        password : password,
        fullName: fullName,
        type : type
    }
    newUserRef.set(data);
});