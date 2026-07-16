/*==================================================
School Connect TN
Splash Screen V2
JavaScript - Part 1
==================================================*/

/*====================================
START SPLASH
====================================*/

console.log("School Connect TN Loading...");

/*====================================
WAIT 3 SECONDS
====================================*/

setTimeout(() => {

const admin =
localStorage.getItem("adminLogin");

const teacher =
localStorage.getItem("teacherLogin");

const parent =
localStorage.getItem("parentLogin");

/*====================================
AUTO LOGIN
====================================*/

if(admin === "true"){

window.location.href =
"admin_dashboard_v3.html";

return;

}

if(teacher === "true"){

window.location.href =
"teacher_dashboard.html";

return;

}

if(parent === "true"){

window.location.href =
"parent_dashboard.html";

return;

}
/*====================================
LOGIN NOT FOUND
====================================*/

window.location.href =
"login.html";

},3000);

/*====================================
VERSION
====================================*/

const APP_NAME =
"School Connect TN";

const VERSION =
"V1.0.0";

console.log(
APP_NAME + " " + VERSION
);

console.log(
"Developed & Maintained by VTOOS Software Solution"
);

/*====================================
PREVENT BACK
====================================*/

history.pushState(
null,
null,
location.href
);

window.onpopstate =
function(){

history.go(1);

};

/*====================================
END
====================================*/

console.log(
"Splash Screen Loaded Successfully"
);
