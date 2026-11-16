
import Phaser from 'phaser';
import './style.css';

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    // =========================
    // BACKGROUND KAMPUS
    // =========================
    this.add.rectangle(400, 300, 800, 600, 0x91bd78);

    // Jalan kampus
    this.add.rectangle(400, 430, 800, 100, 0xcdbb91);
    this.add.rectangle(400, 300, 100, 600, 0xcdbb91);

    // Gedung kampus
    this.add.rectangle(400, 125, 270, 145, 0xe8d5ad);
    this.add.rectangle(400, 65, 290, 30, 0x9a6847);
    this.add.rectangle(400, 180, 55, 85, 0x8c6047);
    this.add.rectangle(335, 115, 45, 40, 0x8ac6dc);
    this.add.rectangle(465, 115, 45, 40, 0x8ac6dc);

    this.add.text(325, 25, 'GEDUNG KAMPUS', {
      fontSize: '17px',
      color: '#493a2b',
      fontStyle: 'bold'
    });

    // Pohon
    this.createTree(120, 150);
    this.createTree(680, 150);
    this.createTree(120, 350);
    this.createTree(680, 350);
    this.createTree(220, 520);
    this.createTree(580, 520);

    // Bangku taman
    this.add.rectangle(240, 315, 65, 13, 0x80512f);
    this.add.rectangle(240, 330, 8, 18, 0x60402b);
    this.add.rectangle(270, 330, 8, 18, 0x60402b);

    // =========================
    // KARAKTER UTAMA
    // =========================
    this.player = this.add.rectangle(
      400, 370, 25, 30, 0x3978c5
    );

    this.head = this.add.circle(
      400, 348, 11, 0xffd1a4
    );

    // =========================
    // NPC: HADIDZ
    // =========================
    this.npc = this.add.rectangle(
      550, 300, 25, 30, 0xe58b55
    );

    this.npcHead = this.add.circle(
      550, 278, 11, 0xffd1a4
    );

    this.npcName = this.add.text(
      550, 250, 'Rani', {
        fontSize: '14px',
        color: '#ffffff',
        backgroundColor: '#385d37',
        padding: { x: 6, y: 4 }
      }
    ).setOrigin(0.5);

    // =========================
    // AREA INTERAKSI
    // =========================
    this.interactionZones = [
      {
        x: 400,
        y: 240,
        name: 'GEDUNG KAMPUS',
        message: 'Kamu berada di depan gedung kampus!'
      },
      {
        x: 240,
        y: 315,
        name: 'BANGKU TAMAN',
        message: 'Kamu sedang menikmati suasana kampus.'
      },
      {
        x: 550,
        y: 300,
        name: 'RANI',
        message: 'Rani: Hai! Kamu mahasiswa baru, ya? Selamat datang di kampus! 😊'
      }
    ];

    // =========================
    // KEYBOARD
    // =========================
    this.cursors = this.input.keyboard.createCursorKeys();

    this.keys = this.input.keyboard.addKeys({
      up: 'W',
      down: 'S',
      left: 'A',
      right: 'D'
    });

    this.interactKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.E
    );

    // =========================
    // HUD
    // =========================
    this.add.text(20, 15, 'KISAH MAHASISWA', {
      fontSize: '21px',
      color: '#ffffff',
      fontStyle: 'bold'
    });

    this.add.text(20, 45, 'Hari 1 | Senin', {
      fontSize: '14px',
      color: '#ffffff'
    });

    this.add.text(600, 15, 'Uang: Rp50.000', {
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold'
    });

    this.add.text(600, 40, 'Energi: 100%', {
      fontSize: '16px',
      color: '#ffffff'
    });

    // Kotak informasi
    this.infoText = this.add.text(
      400, 560, 'Selamat datang di Kisah Mahasiswa!', {
        fontSize: '16px',
        color: '#ffffff',
        backgroundColor: '#385d37',
        padding: { x: 12, y: 8 },
        wordWrap: { width: 680 }
      }
    ).setOrigin(0.5);

    // Petunjuk interaksi
    this.hintText = this.add.text(
      400, 510, '', {
        fontSize: '14px',
        color: '#ffffff',
        backgroundColor: '#385d37',
        padding: { x: 8, y: 5 }
      }
    ).setOrigin(0.5);

    // Mencegah dialog berubah berulang kali
    this.lastNearby = null;
  }

  // =========================
  // MEMBUAT POHON
  // =========================
  createTree(x, y) {
    this.add.rectangle(
      x, y + 22, 13, 35, 0x80512f
    );

    this.add.circle(x, y, 29, 0x397b43);
    this.add.circle(x - 15, y + 8, 17, 0x4e9850);
    this.add.circle(x + 15, y + 8, 17, 0x4e9850);
  }

  // =========================
  // UPDATE GAME
  // =========================
  update() {
    const speed = 3;

    let dx = 0;
    let dy = 0;

    // Gerakan karakter
    if (this.cursors.left.isDown || this.keys.left.isDown) dx -= speed;
    if (this.cursors.right.isDown || this.keys.right.isDown) dx += speed;
    if (this.cursors.up.isDown || this.keys.up.isDown) dy -= speed;
    if (this.cursors.down.isDown || this.keys.down.isDown) dy += speed;

    // Batas area permainan
    this.player.x = Phaser.Math.Clamp(
      this.player.x + dx, 20, 780
    );

    this.player.y = Phaser.Math.Clamp(
      this.player.y + dy, 90, 570
    );

    // Mengikuti posisi kepala karakter
    this.head.x = this.player.x;
    this.head.y = this.player.y - 22;

    // Posisi nama Rani
    this.npcName.setPosition(
      this.npc.x,
      this.npc.y - 48
    );

    // Mendeteksi objek terdekat
    const nearby = this.interactionZones.find(zone => {
      return Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        zone.x,
        zone.y
      ) < 65;
    });

    if (nearby) {
      this.hintText.setText(
        `Tekan E untuk berinteraksi: ${nearby.name}`
      );

      // Dialog muncul ketika tombol E ditekan
      if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
        this.infoText.setText(nearby.message);
        this.lastNearby = nearby.name;
      }
    } else {
      this.hintText.setText('');

      if (this.lastNearby !== null) {
        this.infoText.setText('Jelajahi kampus dan temukan teman baru!');
        this.lastNearby = null;
      }
    }
  }
}

// =========================
// MENJALANKAN GAME
// =========================
new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'app',
  scene: GameScene,
  pixelArt: true,
  backgroundColor: '#91bd78'
});
