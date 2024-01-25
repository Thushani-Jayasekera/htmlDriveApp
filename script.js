import {signIn} from './util.js';

let client_id="978225651454-3rp3tki3fef9rpd2ccocnt1fep7881m6.apps.googleusercontent.com";
let redirect_uri = "http://127.0.0.1:5500/profile.html";
let scopes = "https://www.googleapis.com/auth/drive"

let button = document.getElementById('button')

button.onclick = signIn(client_id, redirect_uri,scopes)