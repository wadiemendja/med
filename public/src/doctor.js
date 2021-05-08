import { getConfig } from './firebaseConfig.js';

// loged in or jumped
if (document.cookie == "") {
    document.body.innerHTML = "";
    location.href = '/';
}

const firebaseConfig = getConfig();
firebase.initializeApp(firebaseConfig);

const username = document.cookie;
const userImg = document.getElementById('userImg');
const usernameTag = document.getElementById('username');
const loader = document.getElementById('loader');
const postsDiv = document.getElementById('posts');

const firebaseRef = firebase.database().ref('users/' + username);
const usersRef = firebase.database().ref('users/');

// title
document.title = 'E-Learnin | ' + username;

// adding user details (profile img username...)
firebaseRef.once('value', (sanp) => {
    const userData = sanp.val();
    userImg.src = userData.img;
    usernameTag.innerText = username;
});

// show posts
usersRef.once('value', (sanp) => {
    const users = sanp.val();
    for (let i in users) {
        const posts = users[i].posts;
        const fullName = users[i].fullName;
        const userImg = users[i].img;
        const userUsername = users[i].username;
        for (let j in posts){            
            console.log(posts[j])
            postsDiv.innerHTML += `
            <div class="post" style="border:solid gray 2px; border-radius: 10px;">
                <div class="user">
                    <img class="user-image" src="${userImg}"/>
                    <span class="info">
                        <div id="nameAsync"><b>${fullName}</b></div>
                        <div id="tagAsync">@${userUsername}</div>
                        <div id="date">${posts[j].postDate}</div>
                    </span>
                </div>
                <div>
                    <div style="padding:10px 0">${posts[j].text}</div>
                    <div class="postmedia">${posts[j].PostMedia}</div>
                </div>
            </div>
            `;
        }
    }
    postsDiv.style.display = "block";
    loader.style.display = "none";
});