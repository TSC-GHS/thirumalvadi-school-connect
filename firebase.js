import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAXgMgL1QprcJekpmb1EhFAPaCS_VTmx3c",
  authDomain: "thirumalvadi-school-connect.firebaseapp.com",
  projectId: "thirumalvadi-school-connect",
  storageBucket: "thirumalvadi-school-connect.firebasestorage.app",
  messagingSenderId: "349192871905",
  appId: "1:349192871905:web:b3f68263f48becfa813ca0"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };