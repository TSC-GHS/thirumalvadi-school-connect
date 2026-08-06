//======================================
// School Connect TN
// Premium Homepage
//======================================

// Smooth Button Animation

document.querySelectorAll("button,a").forEach(btn=>{

btn.addEventListener("mouseenter",()=>{

btn.style.transform="translateY(-3px)";

});

btn.addEventListener("mouseleave",()=>{

btn.style.transform="translateY(0px)";

});

});

//======================================
// Counter Animation
//======================================

const counters=document.querySelectorAll(".statCard h2");

counters.forEach(counter=>{

const text=counter.innerText;

const target=parseInt(text);

if(isNaN(target)) return;

let count=0;

const speed=25;

const update=()=>{

count+=Math.ceil(target/40);

if(count>=target){

counter.innerText=text;

}else{

counter.innerText=count+"+";

setTimeout(update,speed);

}

};

update();

});

//======================================
// Fade Animation
//======================================

const observer=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

});

document.querySelectorAll(

".loginCard,.featureCard,.statCard,.aboutBox,.quoteCard"

).forEach(el=>{

observer.observe(el);

});

//======================================
// Hero Button Effect
//======================================

document.querySelectorAll(".primaryBtn,.secondaryBtn")
.forEach(btn=>{

btn.addEventListener("click",()=>{

btn.classList.add("clicked");

setTimeout(()=>{

btn.classList.remove("clicked");

},300);

});

});

//======================================
// Header Shadow
//======================================

window.addEventListener("scroll",()=>{

const header=document.querySelector(".header");

if(window.scrollY>20){

header.style.boxShadow="0 10px 25px rgba(0,0,0,.35)";

}else{

header.style.boxShadow="none";

}

});

//======================================
// Welcome Console
//======================================

console.log(
"School Connect TN Loaded Successfully"
);
//======================================
// Scroll Reveal Animation
//======================================

const revealElements = document.querySelectorAll(

".hero,.loginCard,.featureCard,.statCard,.aboutBox,.quoteCard,.whyCard,.statusCard"

);

const revealOnScroll = ()=>{

const windowHeight = window.innerHeight;

revealElements.forEach(el=>{

const top = el.getBoundingClientRect().top;

if(top < windowHeight - 100){

el.classList.add("show");

}

});

};

window.addEventListener("scroll",revealOnScroll);

revealOnScroll();

//======================================
// Active Navigation Button
//======================================

document.querySelectorAll("a").forEach(link=>{

link.addEventListener("click",()=>{

document.querySelectorAll("a").forEach(a=>{

a.classList.remove("activeLink");

});

link.classList.add("activeLink");

});

});

//======================================
// Hero Parallax
//======================================

window.addEventListener("mousemove",(e)=>{

const heroImage=document.querySelector(".heroCenter img");

if(heroImage){

const x=(window.innerWidth/2-e.pageX)/40;

const y=(window.innerHeight/2-e.pageY)/40;

heroImage.style.transform=

`translate(${x}px,${y}px)`;

}

});

//======================================
// Current Year
//======================================

const year=document.getElementById("year");

if(year){

year.innerHTML=new Date().getFullYear();

}

console.log("Index JS Part 2 Loaded");
//======================================
// Premium Loading Screen
//======================================

window.addEventListener("load",()=>{

const loader=document.querySelector(".loader");

if(loader){

loader.style.opacity="0";

setTimeout(()=>{

loader.style.display="none";

},600);

}

});

//======================================
// Live Date & Time
//======================================

function updateDateTime(){

const now=new Date();

const options={

weekday:"long",

day:"2-digit",

month:"long",

year:"numeric"

};

const date=document.getElementById("liveDate");

const time=document.getElementById("liveTime");

if(date){

date.innerHTML=

now.toLocaleDateString("en-IN",options);

}

if(time){

time.innerHTML=

now.toLocaleTimeString("en-IN");

}

}

setInterval(updateDateTime,1000);

updateDateTime();

//======================================
// Scroll Progress Bar
//======================================

window.addEventListener("scroll",()=>{

const scrollTop=

document.documentElement.scrollTop;

const scrollHeight=

document.documentElement.scrollHeight-

document.documentElement.clientHeight;

const progress=

(scrollTop/scrollHeight)*100;

const bar=

document.getElementById("progressBar");

if(bar){

bar.style.width=progress+"%";

}

});

//======================================
// Auto Change Quote
//======================================

const quotes=[

"Education is the key to success.",

"Learning Never Stops.",

"Technology Empowers Education.",

"Together We Build Better Schools."

];

let quoteIndex=0;

setInterval(()=>{

const quote=

document.getElementById("quoteText");

if(quote){

quote.innerHTML=

quotes[quoteIndex];

quoteIndex++;

if(quoteIndex>=quotes.length){

quoteIndex=0;

}

}

},4000);

//======================================
// Welcome
//======================================

console.log("School Connect TN Premium Loaded");
//======================================
// Floating Background Animation
//======================================

const circles =
document.querySelectorAll(".circle");

window.addEventListener("mousemove",(e)=>{

const x=e.clientX/window.innerWidth;
const y=e.clientY/window.innerHeight;

circles.forEach((circle,index)=>{

const speed=(index+1)*18;

circle.style.transform=

`translate(${x*speed}px,${y*speed}px)`;

});

});

//======================================
// Hero Image Glow
//======================================

const heroImage =
document.querySelector(".heroCenter img");

if(heroImage){

setInterval(()=>{

heroImage.classList.toggle("heroGlow");

},2500);

}

//======================================
// Login Card Hover Sound Effect Ready
//======================================

document.querySelectorAll(".loginCard").forEach(card=>{

card.addEventListener("mouseenter",()=>{

card.style.borderColor="#4FC3F7";

});

card.addEventListener("mouseleave",()=>{

card.style.borderColor="rgba(255,255,255,.15)";

});

});

//======================================
// Feature Card Animation
//======================================

document.querySelectorAll(".featureCard").forEach((card,index)=>{

card.style.animationDelay=

(index*0.15)+"s";

});

//======================================
// Welcome Message
//======================================

const greetings=[

"Welcome 👋",

"Vanakkam 🙏",

"School Connect TN",

"Powered by VTOOS"

];

let greet=0;

setInterval(()=>{

const badge=document.querySelector(".badge");

if(badge){

badge.innerHTML=greetings[greet];

greet++;

if(greet>=greetings.length){

greet=0;

}

}

},3500);

console.log("Premium Animation Loaded");
