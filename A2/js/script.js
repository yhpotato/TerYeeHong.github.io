//target all elements to save to constants
const page1btn=document.querySelector("#page1btn");
const page2btn=document.querySelector("#page2btn");
const page3btn=document.querySelector("#page3btn");
const page4btn=document.querySelector("#page4btn");
var allpages=document.querySelectorAll(".page");
//select all subtopic pages

//Do FADE IN EFFECT FOR HERO TEXT
const hero_banner = document.querySelector(".hero-banner");


//console.log(allpages); //debug
hideall();
function hideall(){ //function to hide all the pages
    for(let onepage of allpages){ //go through all subtopic pages
        onepage.style.display = "none"; //hide it
    }
}
function show(pgno){ //function to show selected page no
    hideall();
    //select the page based on the parameter passed in
    let onepage=document.querySelector("#page"+pgno);
    //show the page
    onepage.style.display="block";

    hero_banner.classList.remove("fade-in");
    hero_banner.classList.add("fade-in");
}

/*Listen for clicks on the buttons, assign anonymous
eventhandler functions to call show function */
page1btn.addEventListener("click", function(){
    show(1);
});
page2btn.addEventListener("click", function(){
    show(2);
});
page3btn.addEventListener("click", function(){
    show(3);
});
page4btn.addEventListener("click", function(){
    show(4);
});

//hamburger menu
//const hamBtn=document.querySelector("#hamIcon");
//hamBtn.addEventListener("click", toggleMenus);
const menuItemsList=document.querySelector("nav ul");


const hamBtn=document.querySelector("#hamburger");
hamBtn.addEventListener("click", toggleMenus);

function toggleMenus(){
    menuItemsList.classList.toggle("menuHide");

    hamBtn.classList.toggle("is-active");
    //if (menuItemsList.style.display=="block")
    //    menuItemsList.style.display="none";
    //else menuItemsList.style.display="block";
}


////////////////////
//PAGE 1
////////////////////

////////////////////////////
//Step by step interactivity
////////////////////////////

var process_step_num = 4; //start at the end then restart back
//Hide all steps first
var steps = document.querySelectorAll("#illustration_process_box > div > div.flex");
for (let step of steps){
    step.style.display = "none";
}

//called to show the first step
showNextStep();

//Hiding and unhiding of steps
function showNextStep(){
    steps[process_step_num].style.display="none";
    process_step_num += 1;

    //max only 5 steps
    if (process_step_num > 4){
        process_step_num = 0;
    }
    steps[process_step_num].style.display="flex";
}


//Get Progress bar
var id; //This is used to run the frame function
var width;
const progress_bar = document.querySelector("#illustration_process_box .progressbar_inner");
//Update the progress bar (When this functiin is called, process_step_num is already updated)
function updateProgressbar() {
    clearInterval(id); //clear first to prevent multiple running

    //Check if suppose to reset to 0
    if (process_step_num == 0){
        progress_bar.style.width='0%';
    }
    else {
        width = (process_step_num - 1) * 25;
        progress_bar.style.width = width.toString() + '%';
        //Animation over 1 second, loop 25 times hence use 0.04second
        id = setInterval(frame, 10); //once every 0.04 second 
    }
}

//Loop function
function frame() {
    if (width >= process_step_num * 25) {
        clearInterval(id);
    } else {
        width += 0.25;
        progress_bar.style.width = width + '%';
    }
}       

function onProcessButtonClick(){
    showNextStep();
    updateProgressbar();
}

//Find button to go to next
var stepbox_button = document.querySelector("#illustration_process_box button");
stepbox_button.addEventListener("click", onProcessButtonClick);


////////////////////////////
//Step by step interactivity END
////////////////////////////

////////////////////
//PAGE 2
////////////////////


////////////////////////////
//FLIP CARD ON CLICK
////////////////////////////

var cards = document.querySelectorAll('.flip-card');
for (let card of cards){
    card.addEventListener('click', function() {
        card.classList.toggle('is-flipped');
    });
}

////////////////////////////
//FLIP CARD ON CLICK END
////////////////////////////


////////////////////////////
//PIXEL PAINTING
////////////////////////////

//TEMP
class Pixel {
    constructor(r, g, b){
        this.r =r;
        this.g =g;
        this.b =b; 
    }
}
const allcube=document.querySelectorAll(".cube");
const allpixel = [];

//Declaring all colors
var gradient = 30;

const red = new Pixel(0, -gradient, -gradient);
const green = new Pixel(-gradient, 0, -gradient);
const blue = new Pixel(-gradient, -gradient, 0);
const darken = new Pixel(-gradient, -gradient, -gradient);
const white = new Pixel(gradient, gradient, gradient);

var colour_choice = darken;

const red_picker = document.querySelector("#red_colour_picker");
const green_picker = document.querySelector("#green_colour_picker");
const blue_picker = document.querySelector("#blue_colour_picker");
const darken_picker = document.querySelector("#darken_colour_picker");
const white_picker = document.querySelector("#white_colour_picker");

//Add listener
red_picker.addEventListener("click", function() { newColour(red); });
green_picker.addEventListener("click", function() { newColour(green); });
blue_picker.addEventListener("click", function() { newColour(blue); });
darken_picker.addEventListener("click", function() { newColour(darken); });
white_picker.addEventListener("click", function() { newColour(white); });

//When selecting new colour
function newColour(colour){
    colour_choice = colour;
}


//MAKE THEM CLICKABLE
for (var i = 0; i < allcube.length; ++i){
    const num = i; //FUNCTION WILL NOT TAKE IN NON-CONST

    allcube[i].addEventListener("click",function(){ paint(num, colour_choice); });
    allpixel[i] = new Pixel(255,255,255);
}

//PAINT FUNCTION
function paint(index, pixel_change) {
    //UPDATE THE RGB
    allpixel[index].r += parseInt(pixel_change.r);
    allpixel[index].g += parseInt(pixel_change.g);
    allpixel[index].b += parseInt(pixel_change.b);

    //CLAMP ALL VALUES
    if (allpixel[index].r > 255) allpixel[index].r = 255;
    else if (allpixel[index].r < 0) allpixel[index].r = 0;
    if (allpixel[index].g > 255) allpixel[index].g = 255;
    else if (allpixel[index].g < 0) allpixel[index].g = 0;
    if (allpixel[index].b > 255) allpixel[index].b = 255;
    else if (allpixel[index].b < 0) allpixel[index].b = 0;

    //GET RGB
    var colour_r = allpixel[index].r;
    var colour_g = allpixel[index].g;
    var colour_b = allpixel[index].b;

    var new_colour = `rgb(${colour_r},${colour_g},${colour_b})`;
    allcube[index].style.background = new_colour;
}

////////////////////////////
//PIXEL PAINTING END
////////////////////////////

//Show page 1 by default
show(1);



