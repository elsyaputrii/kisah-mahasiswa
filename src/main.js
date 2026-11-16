
import Phaser from 'phaser';
import './style.css';

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    // Background area permainan
    this.cameras.main.setBackgroundColor('#9acb8a');

    // Tanah
    this.add.rectangle(400, 300, 800, 600, 0x9acb8a);

    // Jalan
    this.add.rectangle(400, 300, 180, 600, 0xc9b58c);

    // Karakter mahasiswa
    this.player = this.add.rectangle(
      400, 300, 28, 36, 0x3978c5
    );

    // Kepala karakter
    this.head = this.add.circle(
      400, 277, 12, 0xffd1a4
    );

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,A,S,D');

    this.add.text(20, 20, 'PETUALANGAN MAHASISWA', {
      fontSize: '22px',
      color: '#ffffff',
      fontStyle: 'bold'
    });

    this.add.text(20, 50, 'Gunakan WASD atau tombol panah untuk bergerak', {
      fontSize: '13px',
      color: '#ffffff'
    });
  }

  update() {
    const speed = 3;
    let x = 0;
    let y = 0;

    if (this.cursors.left.isDown || this.wasd.A.isDown) x -= speed;
    if (this.cursors.right.isDown || this.wasd.D.isDown) x += speed;
    if (this.cursors.up.isDown || this.wasd.W.isDown) y -= speed;
    if (this.cursors.down.isDown || this.wasd.S.isDown) y += speed;

    this.player.x = Phaser.Math.Clamp(this.player.x + x, 15, 785);
    this.player.y = Phaser.Math.Clamp(this.player.y + y, 15, 585);

    this.head.x = this.player.x;
    this.head.y = this.player.y - 23;
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'app',
  scene: GameScene,
  pixelArt: true,
  backgroundColor: '#9acb8a'
});
