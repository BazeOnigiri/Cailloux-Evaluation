class Game extends Phaser.Scene {
    constructor() {
        super("Game");
        this.player = null;
        this.cursors = null;
        this.healthBar = null;
        this.stroke = null;
        this.health = null;
        this.tempsSurvie = 0;
        this.timerText = null;
    }

    preload() {
        this.load.spritesheet('dude', 'dist/assets/img/dude.png', {frameWidth: 32, frameHeight: 48});
        this.load.spritesheet('boom', 'dist/assets/img/explosion.png', {frameWidth: 30, frameHeight: 32});
        this.load.tilemapTiledJSON('map', 'dist/assets/map.json');
        this.load.image('tiles', 'dist/assets/img/TileSet.png'); 
        this.load.image('projectile', 'dist/assets/img/caillou.png'); // LE CAAAAAAAILLLLLLLLOOOOOOUUUUUUUUU
        this.load.image('gros_projectile', 'dist/assets/img/gros_caillou.png'); 
        this.load.image('heal', 'dist/assets/img/heal.png'); 
        this.load.audio('music', 'dist/assets/sounds/music.mp3');
    }

    create() {
        //map
        const map = this.make.tilemap({key: 'map'});
        const tileset = map.addTilesetImage('TileSet', 'tiles');
        map.createLayer('Background', tileset, 0, 0);
        const groundLayer = map.createLayer('Collision', tileset, 0, 0);
        map.createLayer('Backgroud2', tileset, 0, 0);

        //player
        this.player = this.physics.add.sprite(window.config.width/2, window.config.width/2.5, 'dude');
        this.player.body.setGravityY(300);
        this.player.setBounce(0.05);
        this.player.setCollideWorldBounds(true);

        //overlaps et collisions
        groundLayer.setCollisionBetween(911, 922);
        this.physics.add.collider(this.player, groundLayer);

        this.physics.world.bounds.width = groundLayer.width;

        this.health = 100;
        this.tempsSurvie = 0;

        //cursor
        this.cursors = this.input.keyboard.createCursorKeys();

        //animations
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: this.anims.generateFrameNumbers('dude', {start: 4, end: 4}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'boom',
            frames: this.anims.generateFrameNumbers('boom', { start: 0, end: 4 }),
            frameRate: 15,
        });

        //barre de vie
        this.healthBar = this.add.rectangle(40, 7, 200, 20, 0xff0000).setOrigin(0, 0);
        this.stroke = this.add.rectangle(40, 7, 200, 20).setOrigin(0, 0);
        this.stroke.setStrokeStyle(2, 0x000000);
        this.stroke.setScrollFactor(0);
        this.healthBar.setScrollFactor(0);

        //el famoso timer
        this.timerText = this.add.text(
            this.scale.width - 80,
            7,
            '0:00',
            {
                fontFamily: 'Arial',
                fontSize: '24px',
                fill: '#ffffff',
            }
        ).setOrigin(1, 0);
        this.timerText.setScrollFactor(0);

        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.tempsSurvie++;
                this.updateTimerDisplay();
            },
            callbackScope: this,
            loop: true
        });

        //projectiles
        this.projectiles = this.physics.add.group();

        this.time.addEvent({
            delay: 80,
            callback: this.spawnProjectile,
            callbackScope: this,
            loop: true
        });

        this.physics.add.overlap(this.player, this.projectiles, this.hitProjectile, null, this);
        this.physics.add.collider(this.projectiles, groundLayer, this.destroyProjectile, null, this);

        this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);

        //les bigs ahh projectiles

        this.bigProjectiles = this.physics.add.group();

        this.time.addEvent({
            delay: 3000,
            callback: this.spawnBigProjectile,
            callbackScope: this,
            loop: true
        });

        this.physics.add.overlap(this.player, this.bigProjectiles, this.hitBigProjectile, null, this);
        this.physics.add.collider(this.bigProjectiles, groundLayer, this.destroyBigProjectile, null, this);

        this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);

        //heal

        this.healItems = this.physics.add.group();

        this.time.addEvent({
            delay: 15000,
            callback: this.spawnHealItem,
            callbackScope: this,
            loop: true
        });

        this.physics.add.overlap(this.player, this.healItems, this.getHealed, null, this);
        this.physics.add.collider(this.healItems, groundLayer, null, null, this);

        this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);

        //musique
        const music = this.sound.add('music', { loop: true, volume: 1 });
        music.play();
    }

    update() {
        if(this.cursors.up.isDown && this.player.body.onFloor()){
            this.player.setVelocityY(-400);
        }
        if(this.cursors.left.isDown){
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        }
        else if(this.cursors.right.isDown){
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        }
        else if(this.cursors.down.isDown){
            this.player.setVelocityY(300);
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }
        else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }
    }

    spawnProjectile() {
        const x = Phaser.Math.Between(50, this.scale.width - 50); 
        const projectile = this.projectiles.create(x, 5, 'projectile');
        projectile.setVelocityY(450);
        projectile.setCollideWorldBounds(false);
    }

    spawnBigProjectile() {
        const x = Phaser.Math.Between(75, this.scale.width - 75); 
        const bigProjectile = this.bigProjectiles.create(x, 5, 'gros_projectile');
        bigProjectile.setVelocityY(600);
        bigProjectile.setCollideWorldBounds(false);
    }

    spawnHealItem() {
        const x = Phaser.Math.Between(50, this.scale.width - 50); 
        const healItem = this.healItems.create(x, 5, 'heal');
        healItem.setVelocityY(1000);
        healItem.setCollideWorldBounds(false);
    }

    spawnVitesseItem() {
        const x = Phaser.Math.Between(50, this.scale.width - 50); 
        const vitesseItem = this.vitesseItems.create(x, 5, 'boots');
        vitesseItem.setVelocityY(1000);
        vitesseItem.setCollideWorldBounds(false);
    }

    getHealed(player, healItem) {
        healItem.destroy(); 
        if (this.health != 100) {
            this.health += 20;
        }
    }

    hitProjectile(player, projectile) {
        const x = projectile.x;
        const y = projectile.y + 30;
        
        projectile.destroy();
        this.createExplosion(x, y);

        this.player.setTint(0xff0000);
        this.time.delayedCall(200, () => {
            this.player.clearTint();
        });

        this.health -= 20; 
        this.healthBar.width = (this.health / 100) * 200; 

        if (this.health <= 0) {
            this.health = 0;
            this.physics.pause();
            this.player.anims.play('turn');

            this.time.delayedCall(1000, () => {
                this.scene.start('End', { tempsSurvie: this.tempsSurvie }); 
            });
        }
    }

    hitBigProjectile(player, bigProjectile) {
        const x = bigProjectile.x;
        const y = bigProjectile.y + 30;
        
        bigProjectile.destroy();
        this.createExplosion(x, y);

        this.player.setTint(0xff0000);
        this.time.delayedCall(200, () => {
            this.player.clearTint();
        });

        this.health -= 40; 
        this.healthBar.width = (this.health / 100) * 200; 

        if (this.health <= 0) {
            this.health = 0;
            this.physics.pause();
            this.player.anims.play('turn');

            this.time.delayedCall(1000, () => {
                this.scene.start('End', { tempsSurvie: this.tempsSurvie }); 
            });
        }
    }

    destroyProjectile(projectile, groundLayer) {
        const x = projectile.x;
        const y = projectile.y;
        
        projectile.destroy();
        this.createExplosion(x, y);
    }

    createExplosion(x, y) {
        const explosion = this.add.sprite(x, y, 'boom');
        explosion.setDepth(1000); 
        explosion.play('boom');
        explosion.on('animationcomplete', () => {
            explosion.destroy();
        });
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.tempsSurvie / 60);
        const seconds = this.tempsSurvie % 60;

        const tempsString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        this.timerText.setText(tempsString);
    }

}

export default Game;