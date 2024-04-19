////////////////////////
//SUPPORTED ASPECT RATIOS
////////////////////////
const aspect_ratios = [
    { aspect_ratio: 1.33, difference: 0 }, //4:3
    { aspect_ratio: 1.6, difference: 0 }, //16:10
    { aspect_ratio: 1.78, difference: 0 }, //16:9
    { aspect_ratio: 2.17, difference: 0 }, //19.5:9
    // Add more aspect ratios as needed
];

// Resolution height
var reference_resolution_height = 600;

//REFERENCE RESOLUTION : 600:800
//ALL OBJECTS 
const bg_image = {
    name: 'bg',
    path: 'assets/img/background.png',
    width: 800,
    height: 600,
}
const tray_image = {
    name: 'tray',
    path: 'assets/img/tray.png',
    width: 300,
    height: 170,
}
const items = [
    { name: 'mealset', path: 'assets/img/food/setmeal.png'},
    { name: 'nuggets', path: 'assets/img/food/setmeal.png'},
    { name: 'icecream', path: 'assets/img/food/setmeal.png'},
    { name: 'happymeal', path: 'assets/img/food/setmeal.png'},
    { name: 'hotcakes', path: 'assets/img/food/setmeal.png'},
    { name: 'mccafe', path: 'assets/img/food/setmeal.png'},
];

// //FOOD TYPES
// const items = [
//     { name: 'mcspicy', src: 'image/mcspicy.png', x: 400, y: 450, width: 100, height: 100 },
//     { name: 'fries', src: 'image/fries.png', x: 600, y: 450, width: 100, height: 100 },
//     { name: 'drink', src: 'image/drink.png', x: 400, y: 300, width: 100, height: 100 },
//     { name: 'icecream', src: 'image/icecream.png', x: 600, y: 300, width: 100, height: 100 },
//   ];
  