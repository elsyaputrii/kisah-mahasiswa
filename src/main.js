
import Phaser from 'phaser';
import './style.css';

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    // DATA PERMAINAN
    this.money = 50000;
    this.energy = 80;
    this.day = 1;
    this.hour = 7;
    this.minute = 0;

    this.weekdays = [
      'Senin', 'Selasa', 'Rabu', 'Kamis',
      'Jumat', 'Sabtu', 'Minggu'
    ];

    this.morningCompleted = false;
    this.afternoonCompleted = false;

    // BACKGROUND
    this.add.rectangle(400, 300, 800, 600, 0x91bd78);

    // JALAN
    this.add.rectangle(400, 430, 800, 100, 0xcdbb91);
    this.add.rectangle(400, 300, 100, 600, 0xcdbb91);

    // GEDUNG KAMPUS
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

    // POHON
    this.createTree(120, 150);
    this.createTree(680, 150);
    this.createTree(120, 350);
    this.createTree(680, 350);
    this.createTree(220, 520);
    this.createTree(580, 520);

    // BANGKU
    this.add.rectangle(240, 315, 65, 13, 0x80512f);
    this.add.rectangle(240, 330, 8, 18, 0x60402b);
    this.add.rectangle(270, 330, 8, 18, 0x60402b);

    // KANTIN
    this.add.rectangle(650, 435, 150, 105, 0xe8d5ad);
    this.add.rectangle(650, 382, 165, 18, 0x9a6847);
    this.add.rectangle(650, 415, 95, 30, 0x8ac6dc);
    this.add.rectangle(650, 472, 35, 31, 0x8c6047);

    this.add.text(605, 355, 'KANTIN', {
      fontSize: '18px',
      color: '#493a2b',
      fontStyle: 'bold'
    });

    // ASRAMA
    this.add.rectangle(160, 455, 135, 105, 0xe8d5ad);
    this.add.rectangle(160, 400, 150, 18, 0x9a6847);
    this.add.rectangle(125, 445, 28, 30, 0x8ac6dc);
    this.add.rectangle(195, 445, 28, 30, 0x8ac6dc);
    this.add.rectangle(160, 480, 30, 55, 0x8c6047);

    this.add.text(112, 370, 'ASRAMA', {
      fontSize: '17px',
      color: '#493a2b',
      fontStyle: 'bold'
    });

    // KARAKTER UTAMA
    this.player = this.add.rectangle(
      400, 370, 25, 30, 0x3978c5
    );

    this.head = this.add.circle(
      400, 348, 11, 0xffd1a4
    );

    // NPC HAFIDZ
    this.npc = this.add.rectangle(
      550, 300, 25, 30, 0xe58b55
    );

    this.npcHead = this.add.circle(
      550, 278, 11, 0xffd1a4
    );

    this.npcName = this.add.text(550, 250, 'Hafidz', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#385d37',
      padding: { x: 6, y: 4 }
    }).setOrigin(0.5);

    // AREA INTERAKSI
    this.interactionZones = [
      {
        x: 400, y: 240,
        name: 'GEDUNG KAMPUS',
        type: 'class'
      },
      {
        x: 240, y: 315,
        name: 'BANGKU TAMAN',
        type: 'normal',
        message: 'Kamu sedang menikmati suasana kampus.'
      },
      {
        x: 550, y: 300,
        name: 'HAFIDZ',
        type: 'npc'
      },
      {
        x: 650, y: 435,
        name: 'KANTIN',
        type: 'canteen'
      },
      {
        x: 160, y: 455,
        name: 'ASRAMA',
        type: 'sleep'
      }
    ];

    // KEYBOARD
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

    // HUD
    this.add.text(20, 15, 'KISAH MAHASISWA', {
      fontSize: '21px',
      color: '#ffffff',
      fontStyle: 'bold'
    });

    this.dayText = this.add.text(20, 45, '', {
      fontSize: '14px',
      color: '#ffffff'
    });

    this.clockText = this.add.text(20, 67, '', {
      fontSize: '14px',
      color: '#ffffff'
    });

    this.moneyText = this.add.text(570, 15, '', {
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold'
    });

    this.energyText = this.add.text(570, 40, '', {
      fontSize: '16px',
      color: '#ffffff'
    });

    this.updateStatus();

    // PANEL JADWAL
    this.add.rectangle(145, 145, 250, 115, 0x385d37, 0.95)
      .setStrokeStyle(2, 0xf4e5bd);

    this.add.text(35, 100, 'JADWAL KULIAH', {
      fontSize: '16px',
      color: '#ffe6a8',
      fontStyle: 'bold'
    });

    this.scheduleText = this.add.text(35, 125, '', {
      fontSize: '13px',
      color: '#ffffff',
      lineSpacing: 7
    });

    this.updateSchedule();

    // INFORMASI
    this.infoText = this.add.text(
      400, 560,
      'Selamat datang! Jalani kehidupan kampusmu.',
      {
        fontSize: '15px',
        color: '#ffffff',
        backgroundColor: '#385d37',
        padding: { x: 12, y: 8 },
        wordWrap: { width: 680 }
      }
    ).setOrigin(0.5);

    // PETUNJUK
    this.hintText = this.add.text(400, 510, '', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#385d37',
      padding: { x: 8, y: 5 }
    }).setOrigin(0.5);

    // WAKTU BERJALAN:
    // Setiap 5 detik = 15 menit dalam game
    this.clockTimer = this.time.addEvent({
      delay: 5000,
      loop: true,
      callback: this.advanceTime,
      callbackScope: this
    });
  }

  // MEMBUAT POHON
  createTree(x, y) {
    this.add.rectangle(x, y + 22, 13, 35, 0x80512f);
    this.add.circle(x, y, 29, 0x397b43);
    this.add.circle(x - 15, y + 8, 17, 0x4e9850);
    this.add.circle(x + 15, y + 8, 17, 0x4e9850);
  }

  // FORMAT JAM
  getClock() {
    return `${String(this.hour).padStart(2, '0')}:${String(this.minute).padStart(2, '0')}`;
  }

  // UPDATE STATUS
  updateStatus() {
    this.dayText.setText(
      `Hari ${this.day} | ${this.weekdays[(this.day - 1) % 7]}`
    );

    this.clockText.setText(`Jam: ${this.getClock()}`);

    this.moneyText.setText(
      `Uang: Rp${this.money.toLocaleString('id-ID')}`
    );

    this.energyText.setText(`Energi: ${this.energy}%`);
  }

  // UPDATE JADWAL
  updateSchedule() {
    const morning = this.morningCompleted
      ? 'SELESAI ✓'
      : 'Belum selesai';

    const afternoon = this.afternoonCompleted
      ? 'SELESAI ✓'
      : 'Belum selesai';

    this.scheduleText.setText(
      `08.00 - 09.00 Kelas Pagi\n${morning}\n\n13.00 - 14.00 Kelas Siang\n${afternoon}`
    );

    this.scheduleText.setColor('#ffffff');
  }

  // WAKTU BERJALAN
  advanceTime() {
    if (this.hour >= 23) return;

    this.minute += 15;

    if (this.minute >= 60) {
      this.minute = 0;
      this.hour++;
    }

    this.updateStatus();

    // PENGINGAT KELAS PAGI
    if (this.hour === 8 && this.minute === 0) {
      this.infoText.setText(
        'Sudah pukul 08.00! Ayo segera masuk kelas pagi.'
      );
    }

    // PENGINGAT KELAS SIANG
    if (this.hour === 13 && this.minute === 0) {
      this.infoText.setText(
        'Sudah pukul 13.00! Waktunya mengikuti kelas siang.'
      );
    }

    // KELAS PAGI TERLEWAT
    if (this.hour === 9 && this.minute === 0 &&
        !this.morningCompleted) {
      this.infoText.setText(
        'Kamu terlambat! Kelas pagi hari ini terlewat.'
      );
      this.morningCompleted = true;
      this.updateSchedule();
    }

    // KELAS SIANG TERLEWAT
    if (this.hour === 14 && this.minute === 0 &&
        !this.afternoonCompleted) {
      this.infoText.setText(
        'Kamu terlambat! Kelas siang hari ini terlewat.'
      );
      this.afternoonCompleted = true;
      this.updateSchedule();
    }

    // PENGINGAT TIDUR
    if (this.hour === 22 && this.minute === 0) {
      this.infoText.setText(
        'Sudah malam! Sebaiknya pulang ke asrama dan tidur.'
      );
    }
  }

  // INTERAKSI KELAS
  attendClass() {
    if (this.hour >= 8 && this.hour < 9 &&
        !this.morningCompleted) {

      this.morningCompleted = true;
      this.money += 10000;
      this.energy = Math.max(0, this.energy - 10);

      this.infoText.setText(
        'Hebat! Kamu berhasil mengikuti kelas pagi. Hadiah Rp10.000!'
      );

      this.updateStatus();
      this.updateSchedule();
      return;
    }

    if (this.hour >= 13 && this.hour < 14 &&
        !this.afternoonCompleted) {

      this.afternoonCompleted = true;
      this.money += 10000;
      this.energy = Math.max(0, this.energy - 10);

      this.infoText.setText(
        'Kamu berhasil mengikuti kelas siang! Hadiah Rp10.000!'
      );

      this.updateStatus();
      this.updateSchedule();
      return;
    }

    this.infoText.setText(
      'Belum waktunya kelas atau jadwal kelas sudah selesai. Periksa jadwal kuliahmu!'
    );
  }

  // MEMBELI MAKANAN
  buyFood() {
    if (this.money < 15000) {
      this.infoText.setText(
        'Uangmu tidak cukup untuk membeli nasi goreng!'
      );
      return;
    }

    if (this.energy >= 100) {
      this.infoText.setText(
        'Energi kamu masih penuh. Tidak perlu makan dulu!'
      );
      return;
    }

    this.money -= 15000;
    this.energy = Math.min(100, this.energy + 30);

    this.updateStatus();

    this.infoText.setText(
      `Yummy! Kamu membeli nasi goreng. Energi sekarang ${this.energy}%.`
    );
  }

  // DIALOG HAFIDZ
  talkToHafidz() {
    if (this.hour < 8) {
      this.infoText.setText(
        'Hafidz: Pagi! Jangan sampai terlambat masuk kelas, ya!'
      );
    } else if (this.hour < 12) {
      this.infoText.setText(
        'Hafidz: Semangat kuliahnya! Jangan lupa istirahat juga.'
      );
    } else if (this.hour < 17) {
      this.infoText.setText(
        'Hafidz: Sudah ikut kelas siang belum? Ayo semangat!'
      );
    } else if (this.hour < 22) {
      this.infoText.setText(
        'Hafidz: Hari ini melelahkan, ya? Jangan lupa makan dan istirahat.'
      );
    } else {
      this.infoText.setText(
        'Hafidz: Sudah malam! Ayo pulang ke asrama.'
      );
    }
  }

  // TIDUR DI ASRAMA
  sleepAtDorm() {
    if (this.hour < 18) {
      this.infoText.setText(
        'Masih terlalu awal untuk tidur. Ayo lanjutkan aktivitasmu!'
      );
      return;
    }

    this.clockTimer.paused = true;

    this.infoText.setText(
      'Kamu beristirahat di asrama. Selamat malam!'
    );

    this.time.delayedCall(2000, () => {
      this.day++;
      this.hour = 7;
      this.minute = 0;
      this.energy = 100;

      this.morningCompleted = false;
      this.afternoonCompleted = false;

      this.updateStatus();
      this.updateSchedule();

      this.clockTimer.paused = false;

      this.infoText.setText(
        `Selamat pagi! Hari ${this.day}, ${this.weekdays[(this.day - 1) % 7]}. Ayo jalani aktivitas baru!`
      );
    });
  }

  // UPDATE GAME
  update() {
    const speed = 3;

    let dx = 0;
    let dy = 0;

    if (this.cursors.left.isDown || this.keys.left.isDown) {
      dx -= speed;
    }

    if (this.cursors.right.isDown || this.keys.right.isDown) {
      dx += speed;
    }

    if (this.cursors.up.isDown || this.keys.up.isDown) {
      dy -= speed;
    }

    if (this.cursors.down.isDown || this.keys.down.isDown) {
      dy += speed;
    }

    this.player.x = Phaser.Math.Clamp(
      this.player.x + dx, 20, 780
    );

    this.player.y = Phaser.Math.Clamp(
      this.player.y + dy, 90, 570
    );

    this.head.x = this.player.x;
    this.head.y = this.player.y - 22;

    this.npcName.setPosition(
      this.npc.x,
      this.npc.y - 48
    );

    const nearby = this.interactionZones.find(zone => {
      return Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        zone.x,
        zone.y
      ) < 65;
    });

    if (nearby) {
      if (nearby.type === 'canteen') {
        this.hintText.setText(
          'Tekan E untuk membeli nasi goreng (Rp15.000)'
        );
      } else if (nearby.type === 'sleep') {
        this.hintText.setText(
          'Tekan E untuk tidur (mulai pukul 18.00)'
        );
      } else {
        this.hintText.setText(
          `Tekan E untuk berinteraksi: ${nearby.name}`
        );
      }

      if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
        if (nearby.type === 'class') {
          this.attendClass();
        } else if (nearby.type === 'canteen') {
          this.buyFood();
        } else if (nearby.type === 'sleep') {
          this.sleepAtDorm();
        } else if (nearby.type === 'npc') {
          this.talkToHafidz();
        } else {
          this.infoText.setText(nearby.message);
        }
      }
    } else {
      this.hintText.setText('');
    }
  }
}

// MENJALANKAN GAME
new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'app',
  scene: GameScene,
  pixelArt: true,
  backgroundColor: '#91bd78'
});
