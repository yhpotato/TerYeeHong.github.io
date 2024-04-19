export class ImageButton extends Phaser.GameObjects.Image {
  constructor(scene, x, y, textureKey, frame, callback) {
    super(scene, x, y, textureKey, frame);

    scene.add.existing(this);

    this.setInteractive({ useHandCursor: true })
      .on('pointerover', () => this.enterButtonHoverState() )
      .on('pointerout', () => this.enterButtonRestState() )
      .on('pointerdown', () => this.enterButtonActiveState() )
      .on('pointerup', () => {
        this.enterButtonHoverState();
        callback();
      });

    // Initialize other callback functions to null
    this.hoverCallback = null;
    this.outCallback = null;
    this.downCallback = null;
  }

  // Method to manually assign callback function for pointerover event
  setHoverCallback(callback) {
    this.hoverCallback = callback;
  }
  // Method to manually assign callback function for pointerout event
  setOutCallback(callback) {
    this.outCallback = callback;
  }
  // Method to manually assign callback function for pointerdown event
  setDownCallback(callback) {
    this.downCallback = callback;
  }

  

  enterButtonHoverState() {
    if (this.hoverCallback) {
      this.hoverCallback();
    }
  }

  enterButtonRestState() {
    if (this.outCallback) {
      this.outCallback();
    }
  }

  enterButtonActiveState() {
    if (this.downCallback) {
      this.downCallback();
    }
  }
}
