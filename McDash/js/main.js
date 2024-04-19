import { Customer } from './customer.js?v=1.0';
import { ImageButton } from './button.js?v=1.0';

//TASK DONE

// 15/4/2024
// 1. Scale Screen to fit while preserving Aspect Ratio
// 2. Take Input from touch
// 3. Detect Orientation


var isClicking = false; 
var swipeDirection;
var mousePosX;
var mousePosY;
var mousePosXprev;
var mousePosYprev;


//boolean that checks every frame if device is in correct orientation
var isGameLandscape = false;
var game_width;
var game_height;

var background;
var tray;
var trayIsDown = false;

// //Referenced aspect ratio calculated using referenced width n height
// var standard_game_width = 400;
// var standard_game_height = 300;
// var aspect_ratio = standard_game_width / standard_game_height;
// var game_scale_ratio = window.innerHeight / standard_game_height;

var controller;

//Application data
var closest_aspect_ratio;
var horizontal_half_length;
var visual_scale_ratio;

//Important Game Data
let currentOrder = [];
let trayItems = [];
const itemsPerRow = 3;
let patienceTimer = null;
let currentCustomer;
let lives = 3;
const maxLives = 3;

// const items = [
//     { name: 'mcspicy', src: 'image/mcspicy.png', x: 400, y: 450, width: 100, height: 100 },
//     { name: 'fries', src: 'image/fries.png', x: 600, y: 450, width: 100, height: 100 },
//     { name: 'drink', src: 'image/drink.png', x: 400, y: 300, width: 100, height: 100 },
//     { name: 'icecream', src: 'image/icecream.png', x: 600, y: 300, width: 100, height: 100 },
//   ];

var currentCustomerSprite;

class Example extends Phaser.Scene
{
    preload ()
    {
        //this.load.image('bg', 'public/assets/img/background.png');
        this.load.image(bg_image.name, bg_image.path);
        this.load.image(tray_image.name, tray_image.path);

        //Load all customer images
        for (const type in Customer.types) {
            const customerType = Customer.types[type];
            console.log(customerType.ID, customerType.imageSrc)
            this.load.image(customerType.ID, customerType.imageSrc);
        }
        //Load all food images
        for (const type in items.types) {
            const foodType = items.types[type];

            // const customerType = Customer.types[type];
            // console.log(customerType.ID, customerType.imageSrc)
            this.load.image(foodType.name, foodType.path);
        }
    }

    create ()
    {      
        visual_scale_ratio = game_height / reference_resolution_height; //Cache this value to use for scaling & position

        //Create background
        background = this.add.image(window.innerWidth * 0.5, window.innerHeight * 0.5, bg_image.name);
        background.scale = visual_scale_ratio; //scale should follow height since game is landscape

        //Create Tray
        const left_border_offset = 200; //600:800 ref
        const height_offset = 100; //600:800 ref
        //tray = this.add.image(window.innerWidth * 0.5 - horizontal_half_length + left_border_offset * visual_scale_ratio, window.innerHeight * 0.5 + height_offset * visual_scale_ratio, tray_image.name);
        tray = new ImageButton(this, window.innerWidth * 0.5 - horizontal_half_length + left_border_offset * visual_scale_ratio, window.innerHeight * 0.5 + height_offset * visual_scale_ratio, tray_image.name, 0, trayPointerUp);
        tray.scale = visual_scale_ratio; //scale should follow height since game is landscape
        tray.setDownCallback(trayPointerDown); //set downcallback

        //Create FOOD UI BUTTONS
        const right_border_spacing = 100; //600:800 ref
        const top_spacing = 100; //600:800 ref
        var food_button;
        const food_ui_rows = 2; const food_ui_columns = 3;
        //ROWS
        for (var i = 0; i < food_ui_rows; ++i){
            //COLUMNS
            for (var j = 0; j < food_ui_columns; ++j){
                var food_current = (i)*food_ui_columns+j;
                food_button = new ImageButton(this, window.innerWidth * 0.5 + horizontal_half_length - right_border_spacing * visual_scale_ratio * (j+1), window.innerHeight * 0.5 + top_spacing * visual_scale_ratio * (i+1), items[food_current].name, 0, placeFood(food_current));
                food_button.scale = visual_scale_ratio; //scale should follow height since game is landscape
            }
        }
        


        //LOAD CUSTOMER
        //selectRandomCustomer(this);
        const customerTypes = Object.keys(Customer.types);
        const randomType = customerTypes[Math.floor(Math.random() * customerTypes.length)];
        //loadCustomer(Phaser.Utils.String.Format("%1", [randomType]));
        loadCustomer(this, randomType);


        // handles everything to do with user input:
        controller = {
            // buttons:[
            //     //new ImageButton(this, 160, 160, 'assets/img/customers/child.png', 0, HandleScreenOrientation),
            //     background = new ImageButton(this, 500, 160, 'child', 0, HandleScreenOrientation),
            //     //new Phaser.GameObjects.image(this, 160, 160, 'assets/img/customers/child.png', 0),
            // ],
    
       
        };

        const debug_line = true;
        //Draw 4 lines to show what the aspect ratio is
        if (debug_line){
            var line;
            //Vertical lines
            line = this.add.line(0,0, 0.5 * window.innerWidth - horizontal_half_length,0, 0.5 * window.innerWidth - horizontal_half_length,window.innerHeight,  0xffffff).setOrigin(0);
            line.setLineWidth(5 * window.innerHeight / reference_resolution_height);
            line = this.add.line(0,0, 0.5 * window.innerWidth + horizontal_half_length,0, 0.5 * window.innerWidth + horizontal_half_length,window.innerHeight,  0xffffff).setOrigin(0);
            line.setLineWidth(5 * window.innerHeight / reference_resolution_height);
            //Horizontal lines
            line = this.add.line(0,0, 0.5 *window.innerWidth - horizontal_half_length,0, 0.5 * window.innerWidth + horizontal_half_length,0,  0xffffff).setOrigin(0);
            line.setLineWidth(5 * window.innerHeight / reference_resolution_height);
            line = this.add.line(0,0, 0.5 * window.innerWidth - horizontal_half_length,window.innerHeight, 0.5 * window.innerWidth + horizontal_half_length,window.innerHeight,  0xffffff).setOrigin(0);
            line.setLineWidth(5 * window.innerHeight / reference_resolution_height);
        }
    }

    update(time, delta){
        //Handle Touch input, save positions
        if(!this.input.activePointer.isDown && isClicking == true) {
            isClicking = false;

            //Ignore all prev mouse inputs
            mousePosX = null;
            mousePosY = null;
            mousePosXprev = null;
            mousePosYprev = null;
        } else if(this.input.activePointer.isDown && isClicking == false) {
            isClicking = true;
        }

        if (isClicking){
            if (mousePosX != null) mousePosXprev = mousePosX;
            if (mousePosY != null) mousePosYprev = mousePosY;
            mousePosX = this.input.activePointer.position.x;
            mousePosY = this.input.activePointer.position.y;
            console.debug("IsClicking");
        }

        /*
        const portrait = window.matchMedia("(orientation: portrait)").matches;
        if (portrait){
            console.debug("Is in portrait");
        }

        
        if(Math.abs(plane.y - plane.getData("positionY")) <= 10) {
            plane.y = plane.getData("positionY");
        } else if(plane.y < plane.getData("positionY")) {
            plane.y += 5;
        } else if(plane.y > plane.getData("positionY")) {
            plane.y -= 5;
        }
        */


        //GAME LOOP STARTS HERE
        if (!isGameLandscape){
            return;
        }

        //Drag tray wif input
        if (trayIsDown){
            //TODO: MAKE SWIPING MORE NATURAL MAYBE?
            if (swipeDirection == "up"){

            }
            else if (swipeDirection == "down"){
                
            }

            trayDrag();
        }

    }
}


HandleScreenOrientation(); //Call this first to determine game width&height
const config = {
    type: Phaser.AUTO,
    width: game_width,
    height: game_height,
    scene: Example,
    physics: {
        default: 'arcade',
        arcade: {
            //gravity: { y: 200 }
        }
    }, 
    /*
    scale: {
        parent: 'yourgamediv',
        mode: Phaser.Scale.FIT,
        width: 800,
        height: 600,
    },
    */
};




//WHEN GAME LOADS, CHOOSE ONE ASPECT RATIO THAT IS CLOSEST AND ADJUST CANVAS
window.onload = function(){
    //Get the aspect ratio and find the cloest aspect ratio
    var current_aspect_ratio;
    if (!window.matchMedia("(orientation: portrait)").matches){
        current_aspect_ratio = window.innerWidth / window.innerHeight;
    }
    else{
        current_aspect_ratio = window.innerHeight / window.innerWidth;
    }

    //Find the difference between all aspects and choose the closest one
    aspect_ratios.forEach((aspect) => {
        aspect.difference = (current_aspect_ratio - aspect.aspect_ratio); //-negative ones wont be accepted
        console.debug("Aspect ratio + its difference:", aspect.aspect_ratio, aspect.difference);
    });

    //Find the closest aspect ratio by comparing the difference
    closest_aspect_ratio = null;
    for (let i = 0; i < aspect_ratios.length; i++) {
        //just take the first valid one
        if (closest_aspect_ratio == null && aspect_ratios[i].difference > 0){
            closest_aspect_ratio = i;
        }
        else if ((aspect_ratios[i].difference > 0)
        && (aspect_ratios[i].difference < aspect_ratios[closest_aspect_ratio].difference)){
            closest_aspect_ratio = i;
        }
    }

    //In case cant find the best fitting, just use the first one
    if (closest_aspect_ratio == null){
        closest_aspect_ratio = 0;
    }

    //Use aspect ratio to determine horizontal length
    horizontal_half_length = 0.5 * window.innerHeight * aspect_ratios[closest_aspect_ratio].aspect_ratio;

    // //Find the difference between all aspects and choose the closest one
    // aspect_ratios.forEach((aspect) => {
    //     aspect.difference = Math.abs(current_aspect_ratio - aspect.aspect_ratio);
    //     console.debug("Aspect ratio + its difference:", aspect.aspect_ratio, aspect.difference);
    // });

    // //Find the closest aspect ratio by comparing the difference
    // closest_aspect_ratio = 0;
    // for (let i = 1; i < aspect_ratios.length; i++) {
    //     if ((aspect_ratios[i].difference < aspect_ratios[closest_aspect_ratio].difference)
    //     && (aspect_ratios[i].aspect_ratio < current_aspect_ratio)){
    //         closest_aspect_ratio = i;
    //     }
    // }

    console.debug("Aspect ratio chosen:", aspect_ratios[closest_aspect_ratio].aspect_ratio);
}



var game = new Phaser.Game(config);

// Selects a random customer and generates their order
function selectRandomCustomer(scene) {
    const customerTypes = Object.keys(Customer.types);
    const randomType = customerTypes[Math.floor(Math.random() * customerTypes.length)];
    loadCustomer(scene, randomType);

    // currentCustomer = new Customer(randomType);
    // currentCustomer.generateOrder(items);
    // currentOrder = currentCustomer.orderItems.map(item => item.name);
    // startPatienceTimer();

    // if (currentCustomer.imageSrc) {
    //     //currentCustomer.image.onload = drawItems;
    //     //currentCustomer.image.onerror = () => {
    //     //console.error('Failed to load customer image.');
    //     //drawItems();
    //    // };
    // }
}

function loadCustomer(scene, type){
    currentCustomer = new Customer(type);
    var customer_scale_height_ratio = window.innerHeight / reference_resolution_height; //Cache this value to use for scaling & position
    currentCustomerSprite = scene.add.sprite(window.innerWidth * 0.5, window.innerHeight * 0.5 - window.innerHeight * Customer.types[type].imageHeightOffsetMultiplier, Customer.types[type].ID);
    currentCustomerSprite.scale = customer_scale_height_ratio * Customer.types[type].imageScale; //scale should follow height since game is landscape\
    
    //currentCustomerSprite.setOrigin(0, 0);

    // currentCustomer.generateOrder(items);
    // currentOrder = currentCustomer.orderItems.map(item => item.name);
    // startPatienceTimer();
}

// Starts the patience timer for the current customer
function startPatienceTimer() {
    if (patienceTimer !== null) {
      clearInterval(patienceTimer);
    }
  
    patienceTimer = setInterval(() => {
      currentCustomer.patience -= 1;
  
      if (currentCustomer.patience <= 0) {
        clearInterval(patienceTimer);
        //alert('Time out! You did not complete the order in time.');
        loseLife();
      }
  
      //drawItems();
    }, 1000);
} 

//FOOD BUTTON
function placeFood(foodType){
    // switch (foodType){
    //     case 0:
    //         break;
    //         case 1:
    //             break;

    // }

    console.debug(foodType);
}

//Tray pointer up n down
function trayPointerDown(){
    trayIsDown = true;
}
function trayDrag(){
    tray.setY(mousePosY);

    //Note that y++ is going down, and y-- is going up
    const serve_position = window.innerHeight * 0.5 + 0 * visual_scale_ratio; //600:800 ref   
    const clear_position = window.innerHeight * 0.5 + 200 * visual_scale_ratio; //600:800 ref    
    if (mousePosY < serve_position){
        ServeTray();
    }
    else if (mousePosY > clear_position) {
        ClearTray();
    }
}
function trayPointerUp(){
    trayIsDown = false;
    const left_border_offset = 200; //600:800 ref
    const height_offset = 100; //600:800 ref    
    tray.setPosition(window.innerWidth * 0.5 - horizontal_half_length + left_border_offset * visual_scale_ratio, window.innerHeight * 0.5 + height_offset * visual_scale_ratio, tray_image.name);
}

//TODO
function ServeTray(){
    trayPointerUp();
}
function ClearTray(){
    trayPointerUp();
}


////////////////////////
//ALL EVENT LISTENERS
////////////////////////

function HandleScreenOrientation(){
    console.debug("Handling screen Orientation");
    var turnImage = document.getElementById("turn");

    isGameLandscape = !window.matchMedia("(orientation: portrait)").matches;
    if (isGameLandscape){
        turnImage.style.display="none";

        game_width = window.innerWidth;
        game_height = window.innerHeight;
    }
    else{
        turnImage.style.display="block";
        turnImage.style.width= window.innerWidth;
        turnImage.style.height= window.innerHeight;
        //turnImage.style.height= 100;

        game_width = window.innerHeight;
        game_height = window.innerWidth;
    }
}

//STILL HAVE TO TEST IF FLIPPING PHONE ORIENTATION THIS CALLS THE RESIZE
//IF NOT
//FOR ACTUAL DEPLOYMENT OF GAME, WE DO NOT NEED THIS LISTENER, AFFECT PERFORMANCE
//AS MOBILE USERS IN THE APP WONT BE ABLE TO RESIZE
window.addEventListener('resize', HandleScreenOrientation, true);