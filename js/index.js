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
