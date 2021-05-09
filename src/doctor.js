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
document.title = 'Doctor | ' + username;

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
            console.log(Object.keys(posts))
            postsDiv.innerHTML += `
            <div class="post" style="border:solid gray 2px; border-radius: 10px;">
                <div class="user">
                    <img class="user-image" src="${userImg}"/>
                    <span class="info">
                        <div id="nameAsync"><b>${fullName}</b></div>
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
                <div class="replies">${renderReplies(posts[j].replies)}</div>
            </div>
            `;
        }
    }
    function renderReplies(replies){
        let string = "";
        for(let i in replies){
            string +=   `<div class="alert alert-dark" role="alert" style="margin: 10px 0">
                            ${replies[i]}
                        </div>`
        }
        return string;
    }
    postsDiv.style.display = "block";
    loader.style.display = "none";
    const commentBtns = document.querySelectorAll('.comment');
    commentBtns.forEach(element => {
        element.addEventListener('click', (event)=> {
            const el = event.target;
            const reply = el.parentNode.querySelector('input').value;
            const parentNode2 = el.parentNode.parentNode;
            const patientUsername = parentNode2.querySelector('.patient-username').innerText.substr(1);
            const postText = parentNode2.querySelector('.post-txt').innerHTML.replaceAll("<br>", "</br>");
            const userRef = firebase.database().ref('users/'+ patientUsername + "/posts");
            userRef.once('value', (snap)=> {
                const posts = snap.val();
                const PostKeys = Object.keys(posts);
                for(let i =0 ; i< PostKeys.length ; i++){
                    console.log(postText);
                    console.log(posts[PostKeys[i]].text)
                    if (posts[PostKeys[i]].text == postText){
                        const repliesRef = firebase.database().ref('users/'+ patientUsername + '/posts/'+PostKeys[i]+'/replies');
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
});