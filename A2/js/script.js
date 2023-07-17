//target all elements to save to constants
const page1btn=document.querySelector("#page1btn");
const page2btn=document.querySelector("#page2btn");
const page3btn=document.querySelector("#page3btn");
var allpages=document.querySelectorAll(".page");
//select all subtopic pages

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


//TEMP
class Pixel {
    constructor(r, g, b){
        this.r =r;
        this.g =g;
        this.b =b; 
    }
}
const allcube=document.querySelectorAll(".cube")
const allpixel = [];

/*
for (let cube of allcube){
    cube.addEventListener("click",lighten);
    
}
*/
for (var i = 0; i < allcube.length; ++i){
    allcube[i].addEventListener("click",lighten);
    allpixel[i] = new Pixel(0,0,0);
}

var cube_color = 0;
function lighten(index){
    var gradient = 16;

    allpixel[index].r += gradient;
    allpixel[index].g += gradient;
    allpixel[index].b += gradient;
    color_r = allpixel[index].r;
    color_g = allpixel[index].g;
    color_b = allpixel[index].b;
    

    //cube_color += gradient;
    //var text = `rgb(${cube_color},${cube_color},${cube_color})`;
    var text = `rgb(${color_r},${color_g},${color_b})`;

    allcube[index].style.background =text;
}