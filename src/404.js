import { getConfig } from "../src/firebaseConfig.js"

firebase.initializeApp(getConfig());

const usersRef = firebase.database().ref('users');
const body = document.body;
const pathName = location.pathname;

console.log(pathname);
//if ()

function renderUserProfile(){
    usersRef.once('value', (snap)=>{
        const users = snap.val();
        for (let i in users) {

        }
    });
}

