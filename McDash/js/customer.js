// In customer.js
//REFERENCE RESOLUTION : 600:800
export class Customer {
    static types = {
        Child: { 
          minOrder: 1,
          maxOrder: 2,
          patience: 10,
          ID: "customerChild",
          imageSrc: 'assets/img/customers/child.png',
          imageScale: 0.45,
          imageHeightOffsetMultiplier: 0.24,
        },
        Youth: {
          minOrder: 1,
          maxOrder: 3,
          patience: 20,
          ID: "customerYouth",
          imageSrc: 'assets/img/customers/youth.png',
          imageScale: 0.23,
          imageHeightOffsetMultiplier: 0.255,
        },
        WorkingAdult: {
          minOrder: 2,
          maxOrder: 4,
          patience: 25,
          ID: "customerWorkingAdult",
          imageSrc: 'assets/img/customers/working_adult.png',
          imageScale: 1.0,
          imageHeightOffsetMultiplier: 0.24,
        },
        FamilyOf3: {
          minOrder: 3,
          maxOrder: 5,
          patience: 30,
          ID: "customerFamily",
          imageSrc: 'assets/img/customers/family.png',
          imageScale: 0.9,
          imageHeightOffsetMultiplier: 0.25,
        },
      };

    constructor(type) {
        const { minOrder, maxOrder, patience, ID, imageSrc, imageScale, imageHeightOffsetMultiplier } = Customer.types[type];

        this.type = type;
        this.patience = patience;
        this.orderSize = Math.floor(Math.random() * (maxOrder - minOrder + 1)) + minOrder;
        this.orderItems = [];
        this.ID = ID;
        this.imageSrc = imageSrc;
        this.imageScale = imageScale;
        this.imageHeightOffsetMultiplier = imageHeightOffsetMultiplier;
        // this.image = new Image();
    
        // if (this.imageSrc) {
        //     this.image.src = this.imageSrc;
        //     this.image.onload = () => console.log(`${this.type} image loaded successfully.`);
        //     this.image.onerror = () => {
        //         console.error(`Failed to load ${this.type} image.`);
        //         this.image = null; // Handle the error by setting the image to null
        //     };
        // }
    }
    

    generateOrder(items) {
        for (let i = 0; i < this.orderSize; i++) {
            this.orderItems.push(items[Math.floor(Math.random() * items.length)]);
        }
    }
}
