import { getConfig } from "./firebaseConfig.js";

// initializing database
const firebaseConfig = getConfig();
firebase.initializeApp(firebaseConfig);

const signupBtn = document.getElementById('signup_btn');

signupBtn.addEventListener('click', (event)=> {
    // preventing the default action
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const fullName = document.getElementById('fullName').value;
    const type = document.querySelector('.form-select').value;
    const newUserRef = firebase.database().ref('users/' + username);
    const usersRef = firebase.database().ref('users');
    usersRef.once('value', (sanp)=>{
        const users = sanp.val();        
        const alert = document.getElementById("alert");
        if (users[username] != null){
            alert.innerHTML = `
            <div style="color:red;">
                This username already used by another account. Please try another username
            </div><br>`;
        } else {            
            const data = {
                username: username,
                password : password,
                fullName: fullName,
                type : type
            }
            newUserRef.set(data);
            resetForm();
            alert.innerHTML =  `
            <div style="color:green;">
                You account has been created succefully. <a href="/">login here</a>
            </div><br>`;
        }
        
    });
});

function resetForm(){
    const form = document.querySelector('form');
    form.reset();
}