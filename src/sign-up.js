import { getConfig } from "./firebaseConfig.js";

// initializing database
const firebaseConfig = getConfig();
firebase.initializeApp(firebaseConfig);

const signupBtn = document.getElementById('signup_btn');
const img = document.querySelector('.profile-img img');
const spinner = document.querySelector('.spinner-border');
const fileDom = document.querySelector('.profile-img input');
let imgUrl = undefined;

// when clicking the images click the input file dom element which is collapsed
img.addEventListener('click', () => { fileDom.click(); });

// upload proccess
fileDom.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const storageRef = firebase.storage().ref('profileImages/' + file.name);
    storageRef.put(file).on('state_changed', function (snapshot) {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        spinner.style.display = "block";
        if (progress == 100) {
            storageRef.getDownloadURL().then(function (url) {
                img.src = url;
                imgUrl = url;
                setTimeout(() => {
                    img.style.border = "solid 2px lightgray";
                    spinner.style.display = "none";
                }, 500);
            });
        }
    });
});

signupBtn.addEventListener('click', (event) => {
    // preventing the default action
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const fullName = document.getElementById('fullName').value;
    const type = document.querySelector('.form-select').value;
    const birthday = document.getElementById('birthday').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const newUserRef = firebase.database().ref('users/' + username);
    const usersRef = firebase.database().ref('users');
    usersRef.once('value', (sanp) => {
        const users = sanp.val();
        const alert = document.getElementById("alert");
        if (users[username] != null) {
            alert.innerHTML = `
            <div style="color:red;">
                This username already used by another account. Please try another username
            </div><br>`;
        } else {
            if (imgUrl == undefined) imgUrl = "https://bit.ly/3fjmmL9"; 
            const data = {
                username: username,
                password: password,
                fullName: fullName,
                type: type,
                img: imgUrl,
                birthday: birthday,
                email: email,
                phone: phone
            }
            newUserRef.set(data);
            resetForm();
            alert.innerHTML = `
            <div style="color:green;">
                You account has been created succefully. <a href="/">login here</a>
            </div><br>`;
        }

    });
});

function resetForm() {
    const form = document.querySelector('form');
    form.reset();
}