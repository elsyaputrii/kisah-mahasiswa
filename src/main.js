
import Phaser from 'phaser';
import './style.css';

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    // =========================
    // DATA PERMAINAN
    // =========================
    this.money = 50000;
    this.energy = 100;
    this.missionCompleted = false;

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

    // Bangku
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
    // NPC Hafidz
    // =========================
    this.npc = this.add.rectangle(
      550, 300, 25, 30, 0xe58b55
    );

    this.npcHead = this.add.circle(
      550, 278, 11, 0xffd1a4
    );

    this.npcName = this.add.text(
      550, 250, 'Hafidz', {
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
        type: 'mission',
        message: 'Kamu berhasil mengikuti kelas pagi!'
      },
      {
        x: 240,
        y: 315,
        name: 'BANGKU TAMAN',
        type: 'normal',
        message: 'Kamu sedang menikmati suasana kampus.'
      },
      {
        x: 550,
        y: 300,
        name: 'HAFIDZ',
        type: 'normal',
        message: 'Hafidz: Hai! Semangat kuliahnya, ya! Jangan sampai terlambat masuk kelas!'
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

    this.moneyText = this.add.text(600, 15, '', {
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold'
    });

    this.energyText = this.add.text(600, 40, '', {
      fontSize: '16px',
      color: '#ffffff'
    });

    this.updateStatus();

    // =========================
    // PANEL MISI
    // =========================
    this.add.rectangle(
      145, 125, 250, 85, 0x385d37, 0.95
    ).setStrokeStyle(2, 0xf4e5bd);

    this.add.text(35, 93, 'MISI HARI INI', {
      fontSize: '16px',
      color: '#ffe6a8',
      fontStyle: 'bold'
    });

    this.missionText = this.add.text(
      35, 120,
      '1. Mengikuti kelas pagi\nStatus: Belum selesai', {
        fontSize: '13px',
        color: '#ffffff',
        lineSpacing: 6
      }
    );

    // =========================
    // KOTAK INFORMASI
    // =========================
    this.infoText = this.add.text(
      400, 560,
      'Selamat datang! Ayo mulai kehidupan kampusmu.', {
        fontSize: '15px',
        color: '#ffffff',
        backgroundColor: '#385d37',
        padding: { x: 12, y: 8 },
        wordWrap: { width: 680 }
      }
    ).setOrigin(0.5);

    this.hintText = this.add.text(
      400, 510, '', {
        fontSize: '14px',
        color: '#ffffff',
        backgroundColor: '#385d37',
        padding: { x: 8, y: 5 }
      }
    ).setOrigin(0.5);
  }

  // =========================
  // POHON
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
  // UPDATE STATUS
  // =========================
  updateStatus() {
    this.moneyText.setText(
      `Uang: Rp${this.money.toLocaleString('id-ID')}`
    );

    this.energyText.setText(
      `Energi: ${this.energy}%`
    );
  }

  // =========================
  // MENYELESAIKAN MISI
  // =========================
  completeMission() {
    if (this.missionCompleted) {
      this.infoText.setText(
        'Kamu sudah menyelesaikan kelas pagi hari ini!'
      );
      return;
    }

    this.missionCompleted = true;
    this.money += 10000;

    this.missionText.setText(
      '1. Mengikuti kelas pagi\nStatus: SELESAI ✓'
    );

    this.missionText.setColor('#a8f0a0');

    this.updateStatus();

    this.infoText.setText(
      'SELAMAT! Kamu berhasil mengikuti kelas pagi. Hadiah: Rp10.000!'
    );
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

    // Batas permainan
    this.player.x = Phaser.Math.Clamp(
      this.player.x + dx, 20, 780
    );

    this.player.y = Phaser.Math.Clamp(
      this.player.y + dy, 90, 570
    );

    // Posisi kepala
    this.head.x = this.player.x;
    this.head.y = this.player.y - 22;

    // Posisi nama NPC
    this.npcName.setPosition(
      this.npc.x,
      this.npc.y - 48
    );

    // Deteksi objek terdekat
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

      if (
        Phaser.Input.Keyboard.JustDown(this.interactKey)
      ) {
        if (nearby.type === 'mission') {
          this.completeMission();
        } else {
          this.infoText.setText(nearby.message);
        }
      }
    } else {
      this.hintText.setText('');
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
