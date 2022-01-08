import 'phaser';

// Note: At higher scales, the aliasing causes extra pixels to appear in the sprites. This is not an
// issue with the spritesheet itself.
const debugScale = 1;

enum PlayerAnimationKeys {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
  UpWalking = 'up-walking',
  DownWalking = 'down-walking',
  LeftWalking = 'left-walking',
  RightWalking = 'right-walking'
}

export default class Beginning extends Phaser.Scene
{
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor () {
    super('beginning');
  }

  preload() {
    this.load.image('town', 'assets/LittlerootTown.png');
    const spriteConfig: Phaser.Types.Loader.FileTypes.ImageFrameConfig = {
      frameWidth: 64,
      frameHeight: 64
    };
    this.load.spritesheet('player', 'assets/LPC_Sara/SaraFullSheet.png', spriteConfig);
  }

  create() {
    const townBg = this.add.image(160 * debugScale, 160 * debugScale, 'town'); 
    townBg.scale = debugScale;
    
    this.player = this.physics.add
      .sprite(160 * debugScale, 160 * debugScale, 'player', 130 /* Default (Down) */)
      .setScale(debugScale)
      .setCollideWorldBounds(true);

    this.createPlayerAnimations();
    this.createPlayerControls();
  }

  update() {
  }

  private createPlayerAnimations() {
    this.anims.create({
      key: PlayerAnimationKeys.Down,
      frames: [ { key: 'player', frame: 130 } ],
      frameRate: 1,
      repeat: -1
    });
    this.anims.create({
      key: PlayerAnimationKeys.DownWalking,
      frames: this.anims.generateFrameNumbers('player', {start: 130, end: 138}),
      frameRate: 9,
      repeat: -1
    });

    // Up walk animation needs cleanup: head should bob while walking
    this.anims.create({
      key: PlayerAnimationKeys.Up,
      frames: [ { key: 'player', frame: 104 } ],
      frameRate: 1,
      repeat: -1
    });
    this.anims.create({
      key: PlayerAnimationKeys.UpWalking,
      frames: this.anims.generateFrameNumbers('player', {start: 104, end: 112}),
      frameRate: 9,
      repeat: -1
    });

    // Left and right walk animations need cleanup: arm swings are messy
    this.anims.create({
      key: PlayerAnimationKeys.Left,
      frames: [ { key: 'player', frame: 117 } ],
      frameRate: 1,
      repeat: -1
    });
    this.anims.create({
      key: PlayerAnimationKeys.LeftWalking,
      frames: this.anims.generateFrameNumbers('player', {start: 117, end: 126}),
      frameRate: 9,
      repeat: -1
    });

    this.anims.create({
      key: PlayerAnimationKeys.Right,
      frames: [ { key: 'player', frame: 143 } ],
      frameRate: 1,
      repeat: -1
    });
    this.anims.create({
      key: PlayerAnimationKeys.RightWalking,
      frames: this.anims.generateFrameNumbers('player', {start: 143, end: 151}),
      frameRate: 9,
      repeat: -1
    });
  }

  private createPlayerControls() {
    this.cursors = this.input.keyboard.createCursorKeys();

    const pixelsPerSec = 40 * debugScale;
    const keydownHandler = (key: PlayerAnimationKeys, flipX: boolean, xVelocity: number, yVelocity: number) => {
      this.player.flipX = flipX;
      this.player.anims.play(key, true);
      this.player.setVelocity(xVelocity, yVelocity);
    };
    const keyupHandler = (conditionKey: PlayerAnimationKeys, conditionFlipX: boolean, standingKey: PlayerAnimationKeys) => {
      if (this.player.anims.isPlaying && this.player.anims.currentAnim.key === conditionKey && this.player.flipX === conditionFlipX) {
        this.player.anims.play(standingKey);
        this.player.setVelocity(0, 0);
      }
    };

    this.input.keyboard.on('keydown-DOWN', keydownHandler.bind(this, PlayerAnimationKeys.DownWalking, false, 0, pixelsPerSec));
    this.input.keyboard.on('keyup-DOWN', keyupHandler.bind(this, PlayerAnimationKeys.DownWalking, false, PlayerAnimationKeys.Down));
    this.input.keyboard.on('keydown-UP', keydownHandler.bind(this, PlayerAnimationKeys.UpWalking, false, 0, -pixelsPerSec));
    this.input.keyboard.on('keyup-UP', keyupHandler.bind(this, PlayerAnimationKeys.UpWalking, false, PlayerAnimationKeys.Up));
    this.input.keyboard.on('keydown-LEFT', keydownHandler.bind(this, PlayerAnimationKeys.LeftWalking, false, -pixelsPerSec, 0));
    this.input.keyboard.on('keyup-LEFT', keyupHandler.bind(this, PlayerAnimationKeys.LeftWalking, false, PlayerAnimationKeys.Left));
    this.input.keyboard.on('keydown-RIGHT', keydownHandler.bind(this, PlayerAnimationKeys.RightWalking, false, pixelsPerSec, 0));
    this.input.keyboard.on('keyup-RIGHT', keyupHandler.bind(this, PlayerAnimationKeys.RightWalking, false, PlayerAnimationKeys.Right));
  }
}

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#125555',
  width: 320 * debugScale, 
  height: 320 * debugScale,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: Beginning
};

const game = new Phaser.Game(config);
