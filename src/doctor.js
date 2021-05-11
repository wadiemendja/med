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

// edditing title
document.title = 'Doctor | ' + username;

// adding user details (profile img username...)
firebaseRef.once('value', (sanp) => {
    const userData = sanp.val();
    userImg.src = userData.img;
    usernameTag.innerText = username;
});

// on click usernameTag => go to profile
usernameTag.addEventListener('click', () => {
    location.href = "/" + username;
});
// on click user image => go to profile
userImg.addEventListener('click', () => {
    location.href = "/" + username;
});

// profile-dropped-btn
const droppedProfileBtn = document.querySelector('.profile-dropped-btn');
droppedProfileBtn.addEventListener('click', () => {
    location.href = "/" + username;
});

// show posts
usersRef.once('value', (sanp) => {
    const users = sanp.val();
    for (let i in users) {
        const posts = users[i].posts;
        const fullName = users[i].fullName;
        const userImg = users[i].img;
        const userUsername = users[i].username;
        for (let j in posts) {
            postsDiv.innerHTML += `
            <div class="post" style="border:solid gray 2px; border-radius: 10px;">
                <div class="user">
                    <img class="user-image" src="${userImg}"/>
                    <span class="info">
                        <div id="nameAsync" class="full-name"><b>${fullName}</b></div>
                        <div id="tagAsync" class="patient-username">@${userUsername}</div>
                        <div id="date">${posts[j].postDate}</div>
                    </span>
                </div>
                <div>
                    <div style="padding:10px 0" class="post-txt">${posts[j].text}</div>
                    <div class="postmedia">${posts[j].PostMedia}</div>
                </div>
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text">Reply to ${userUsername}</span>
                    </div>
                    <input type="text" class="form-control" placeholder="Write a comment.." aria-describedby="basic-addon1">
                    <button type="button" class="btn btn-secondary comment">Post</button>
                </div>
                <button type="button" class="btn btn-secondary audio-btn">Reply with an audio
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-mic-fill" viewBox="0 0 16 16">
                        <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z"/>
                        <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
                    </svg>
                </button>
                <button type="button" class="btn btn-secondary video-btn">Reply with a video
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-btn-fill" viewBox="0 0 16 16">
                        <path d="M0 12V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm6.79-6.907A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"/>
                    </svg>
                </button>
                <span class="spinner-border" id="spinner2" role="status"></span>
                <input type="file" accept="audio/*" style="width:0px" class="audioInput"/>
                <input type="file" accept="video/*" style="width:0px" class="videoInput"/>
                <div class="replies">${renderReplies(posts[j].replies)}</div>
            </div>
            `;
        }
    }
    function renderReplies(replies) {
        let string = "";
        for (let i in replies) {
            string += `<div class="alert alert-dark" role="alert" style="margin: 10px 0">
                            ${replies[i]}
                        </div>`
        }
        return string;
    }
    postsDiv.style.display = "block";
    loader.style.display = "none";
    const commentBtns = document.querySelectorAll('.comment');
    commentBtns.forEach(element => {
        element.addEventListener('click', (event) => {
            const el = event.target;
            const reply = el.parentNode.querySelector('input').value;
            const parentNode2 = el.parentNode.parentNode;
            const patientUsername = parentNode2.querySelector('.patient-username').innerText.substr(1);
            const postText = parentNode2.querySelector('.post-txt').innerHTML.replaceAll("<br>", "</br>");
            const userRef = firebase.database().ref('users/' + patientUsername + "/posts");
            if (reply == "") return;
            userRef.once('value', (snap) => {
                const posts = snap.val();
                const PostKeys = Object.keys(posts);
                for (let i = 0; i < PostKeys.length; i++) {
                    if (posts[PostKeys[i]].text == postText) {
                        const repliesRef = firebase.database().ref('users/' + patientUsername + '/posts/' + PostKeys[i] + '/replies');
                        repliesRef.push(reply);
                        parentNode2.querySelector('.replies').innerHTML +=
                            `<div class="alert alert-dark" role="alert" style="margin: 10px 0">
                            ${reply}
                        </div>`
                        return;
                    }
                }
            });
        });
    });
    // upload audio and videos
    const audiInputs = document.querySelectorAll('.audioInput');
    const videoInputs = document.querySelectorAll('.videoInput');
    const videoBtns = document.querySelectorAll('.video-btn');
    const audioBtns = document.querySelectorAll('.audio-btn');
    const spinner = document.getElementById('spinner2');

    videoBtns.forEach((element) => {
        element.addEventListener('click', (event) => {
            const vidBtn = event.target;
            const parentNode = vidBtn.parentNode;
            parentNode.querySelector('.videoInput').click();
        });
    });

    audioBtns.forEach((element) => {
        element.addEventListener('click', (event) => {
            const audioBtn = event.target;
            const parentNode = audioBtn.parentNode;
            parentNode.querySelector('.audioInput').click();
        });
    });

    audiInputs.forEach((element) => {
        element.addEventListener('change', (event) => {
            const parentNode = event.target.parentNode;
            const input = parentNode.querySelector('.input-group input');
            const postBtn = parentNode.querySelector('.input-group button');
            const file = event.target.files[0];
            const storageRef = firebase.storage().ref('audio/' + file.name);
            storageRef.put(file).on('state_changed', function (snapshot) {
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                spinner.style.display = "block";
                if (progress == 100) {
                    storageRef.getDownloadURL().then(function (url) {
                        input.value = `<audio src="${url}" controls></audio>`;
                        postBtn.click();
                        setTimeout(() => {
                            input.value = "";
                            spinner.style.display = "none";
                        }, 500);
                    });
                }
            });
        });
    });

    videoInputs.forEach((element) => {
        element.addEventListener('change', (event) => {
            const parentNode = event.target.parentNode;
            const input = parentNode.querySelector('.input-group input');
            const postBtn = parentNode.querySelector('.input-group button');
            const file = event.target.files[0];
            const storageRef = firebase.storage().ref('video/' + file.name);
            storageRef.put(file).on('state_changed', function (snapshot) {
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                spinner.style.display = "block";
                if (progress == 100) {
                    storageRef.getDownloadURL().then(function (url) {
                        input.value = `<video src="${url}" controls></video>`;
                        postBtn.click();
                        setTimeout(() => {
                            input.value = "";
                            spinner.style.display = "none";
                        }, 500);
                    });
                }
            });
        });
    });

    const fullNames = document.querySelectorAll('.full-name');
    const userImages = document.querySelectorAll('.user-image');

    fullNames.forEach((element) => {
        element.addEventListener('click', (event) => {
            const parentNode = event.target.parentNode.parentNode;
            const username = parentNode.querySelector('.patient-username').innerText.replace('@', '');
            console.log(username)
            location.href = "/" + username;
        });
    });

    userImages.forEach((element) => {
        element.addEventListener('click', (event) => {
            const parentNode = event.target.parentNode;
            const username = parentNode.querySelector('.patient-username').innerText.replace('@', '');
            location.href = "/" + username;
        });
    });

});



