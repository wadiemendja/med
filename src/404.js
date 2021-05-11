import { getConfig } from "../src/firebaseConfig.js"

firebase.initializeApp(getConfig());

const usersRef = firebase.database().ref('users');
const body = document.body;
const pathName = location.pathname.replace('/', '');
let userNotFound = true;

usersRef.once('value', (snap) => {
    const users = snap.val();
    for (let i in users) {
        const username = users[i].username;
        if (username == pathName) {
            renderProfile(username);
            return;
        }
    }
    if (userNotFound) {
        document.title = "Login as"
        body.style.filter = "blur(0px)";
    }
});

function renderProfile(username) {
    const userRef = firebase.database().ref('users/' + username)
    userRef.once('value', (snap) => {
        const user = snap.val();
        document.title = username;
        body.innerHTML = `
        <div class="page-content page-container" id="page-content">
            <div class="padding">
                <div class="row container d-flex justify-content-center">
                    <div class="col-xl-6 col-md-12">
                        <div class="card user-card-full">
                            <div class="row m-l-0 m-r-0">
                                <div class="col-sm-4 bg-c-lite-green user-profile">
                                    <div class="card-block text-center text-white">
                                        <div class="m-b-25"> <img src="${user.img}" class="img-radius profile-img" alt="User-Profile-Image"> </div>
                                        <h6>${user.fullName}</h6>
                                        <h5>@${user.username}</h5>
                                        <p>Account type: ${user.type}</p> <i class=" mdi mdi-square-edit-outline feather icon-edit m-t-10 f-16"></i>
                                    </div>
                                </div>
                                <div class="col-sm-8">
                                    <div class="card-block">
                                        <h6 class="m-b-20 p-b-5 b-b-default f-w-600">Information</h6>
                                        <div class="row">
                                            <div class="col-sm-6">
                                                <p class="m-b-10 f-w-600">Email</p>
                                                <h6 class="text-muted f-w-400">${user.email}</h6>
                                            </div>
                                            <div class="col-sm-6">
                                                <p class="m-b-10 f-w-600">Phone</p>
                                                <h6 class="text-muted f-w-400">${user.phone}</h6>
                                            </div>
                                            <div class="col-sm-6">
                                                <p class="m-b-10 f-w-600">Date of birth</p>
                                                <h6 class="text-muted f-w-400">${user.birthday}</h6>
                                            </div>
                                        </div>                                
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        body.style.filter = "blur(0px)";
    });
}

