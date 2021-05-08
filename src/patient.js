import { getConfig } from './firebaseConfig.js';

// loged in or jumped
if (document.cookie == "") {
    document.body.innerHTML = "";
    location.href = '/';
}

const username = document.cookie;

const firebaseConfig = getConfig();
firebase.initializeApp(firebaseConfig);
const userPostsRef = firebase.database().ref('users/' + username + '/posts');
const userRef = firebase.database().ref(username + '/');

const userImg = document.getElementById('userImg');
const usernameTag = document.getElementById('username');

const firebaseRef = firebase.database().ref('users/' + username);

// title
document.title = 'E-Learnin | ' + username;

// adding user details (profile img username...)
firebaseRef.once('value', (sanp) => {
    const userData = sanp.val();
    userImg.src = userData.img || "img/defualt-profile-img.png";
    usernameTag.innerText = username;
});

const shareClassBtn = document.getElementById('shareClassBtn');
const textAria = document.getElementById('text');
const uploadedImgAria = document.getElementById('uploadedImgs');
const uploadedVidAria = document.getElementById('uploadedVid');
const uploadedFilesAria = document.getElementById('uploadedFiles');
const uploadedAudioAria = document.getElementById('uploadedAudio');
const media = document.querySelector('.media');
const sharedDiv = document.getElementById('sharedAlert');
const postsDiv = document.getElementById('posts')

// share button
shareClassBtn.addEventListener('click', () => {
    if (textAria.value == "") {
        textAria.style.borderColor = 'red';
        return;
    }
    const text = addBreacks(textAria.value);
    const date = new Date();
    const postDate = date.getMonth() + 1 + "/" + date.getDate().toString() + "/" + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes();
    userPostsRef.push({
        postDate: postDate,
        text: text,
        imgs: uploadedImgAria.innerHTML,
        video: uploadedVidAria.innerHTML,
        audio: uploadedAudioAria.innerHTML,
        files: uploadedFilesAria.innerHTML,
        PostMedia: media.innerHTML
    });
    clearPostAria();
    sharedAlert();
});

// typing event
textAria.addEventListener('input', (event) => {
    event.target.style.borderColor = '';
    sharedDiv.innerHTML = '';

});

// img file input listener 
const fileInput = document.getElementById('fileInput');
const audioInput = document.getElementById('audioInput');
const vidInput = document.getElementById('vidInput');
const imgInput = document.getElementById('imgInput');

// upload images 
imgInput.addEventListener('change', (event) => {
    const progressBar = document.querySelector('.progress-bar');
    const file = event.target.files[0];
    const storageRef = firebase.storage().ref(username + '/' + file.name);
    storageRef.put(file).on('state_changed', function (snapshot) {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progressBar.style.width = progress + '%';
        if (progress == 100) {
            storageRef.getDownloadURL().then(function (url) {
                uploadedImgAria.innerHTML += `
                        <img src="${url}"/>  
                    `;
                setTimeout(() => {
                    progressBar.style.width = "0%";
                }, 500);
            });
        }
    });
});

// upload videos
vidInput.addEventListener('change', (event) => {
    const progressBar = document.querySelector('.progress-bar');
    const file = event.target.files[0];
    const storageRef = firebase.storage().ref(username + '/' + file.name);
    storageRef.put(file).on('state_changed', function (snapshot) {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progressBar.style.width = progress + '%';
        progressBar.innerHTML = getIntValue(progress) + '%'
        if (progress == 100) {
            storageRef.getDownloadURL().then(function (url) {
                uploadedVidAria.innerHTML += `
                        <video src="${url}" controls></video>  
                    `;
                setTimeout(() => {
                    progressBar.style.width = "0%";
                    progressBar.innerHTML = "";
                }, 500);
            });
        }
    });
});

// upload docs
fileInput.addEventListener('change', (event) => {
    const progressBar = document.querySelector('.progress-bar');
    const file = event.target.files[0];
    const storageRef = firebase.storage().ref(username + '/' + file.name);
    storageRef.put(file).on('state_changed', function (snapshot) {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progressBar.style.width = progress + '%';
        progressBar.innerHTML = getIntValue(progress) + '%'
        if (progress == 100) {
            storageRef.getDownloadURL().then(function (url) {
                uploadedFilesAria.innerHTML += `
                    <div>
                        <a href="${url}" target="_blank">${file.name}</a>
                        <img src="../img/doc.png" width="50" height="50" style="padding: 8px">
                    </div>    
                `;
                setTimeout(() => {
                    progressBar.style.width = "0%";
                    progressBar.innerHTML = "0%";
                }, 500);
            });
        }
    });
});

// upload audio
audioInput.addEventListener('change', (event) => {
    const progressBar = document.querySelector('.progress-bar');
    const file = event.target.files[0];
    const storageRef = firebase.storage().ref(username + '/' + file.name);
    storageRef.put(file).on('state_changed', function (snapshot) {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progressBar.style.width = progress + '%';
        progressBar.innerHTML = getIntValue(progress) + '%'
        if (progress == 100) {
            storageRef.getDownloadURL().then(function (url) {
                uploadedAudioAria.innerHTML += `
                        <audio src="${url}" controls></audio>  
                    `;
                setTimeout(() => {
                    progressBar.style.width = "0%";
                    progressBar.innerHTML = "";
                }, 500);
            });
        }
    });
});


// load posts 
userPostsRef.once('value', (snap) => {
    /*const postObj = snap.val();
    let post = {};
    const rev_posts = Object.keys(postObj).reverse();
    rev_posts.forEach((i) => { post[i] = postObj[i]; });
    for (let i in post) {
        postsDiv.innerHTML += `
        <div class="post">
            <div class="user">
                <img class="user-image" src="${post[i].profileImg}"/>
                <span class="info">
                    <div id="nameAsync">${post[i].name}</div>
                    <div id="tagAsync">${post[i].username}</div>
                    <div id="date">${post[i].date}</div>
                </span>
            </div>
            <div class="finalTweet">${post[i].tweet}</div>
            <div class="tweetImages">${post[i].images}</div>
        `;
    }*/
    // shwo number of posts
    let nbrOfPosts = 0;
    const data = snap.val();
    for (let i in data) nbrOfPosts++;
    document.getElementById('nbrOfPosts').innerHTML = nbrOfPosts;
});

// functions

function sharedAlert() {
    sharedDiv.innerHTML = `
    <div class="alert alert-success" role="alert">
        Your message has been sent successfuly! 
    </div>
    `;
}

function addBreacks(text) {
    let brockTweet = "";
    for (let i = 0; i < text.length; i++) {
        if (text[i] != '\n') {
            brockTweet += text[i];
        } else brockTweet += "</br>";
    }
    return brockTweet;
}

function getIntValue(value) {
    const stringValue = value.toString();
    const index = stringValue.indexOf('.');
    return stringValue.substr(0, index);
}

function clearPostAria() {
    media.innerHTML = "";
    textAria.value = "";
}