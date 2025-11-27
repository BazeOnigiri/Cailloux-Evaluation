class End extends Phaser.Scene {
    constructor() {
        super("End");
    }
    
    init(data) {
        this.tempsSurvie = data.tempsSurvie || 0;
    }
    
    create() {
        const title = this.add.text(
            this.sys.game.config.width / 2,
            100,
            'LOOOOOOOOSER !',
            {
                fontFamily: 'Arial Black',
                fontSize: '48px',
                fill: '#ff0000',
            }
        ).setOrigin(0.5);

        // Format the survival time
        const minutes = Math.floor(this.tempsSurvie / 60);
        const seconds = this.tempsSurvie % 60;
        const tempsString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        // Display survival time
        const survivalText = this.add.text(
            this.sys.game.config.width / 2,
            200,
            `Temps de survie: ${tempsString}`,
            {
                fontFamily: 'Arial',
                fontSize: '32px',
                fill: '#000000',
            }
        ).setOrigin(0.5);

        const button = this.add.rectangle(
            this.sys.game.config.width / 2,
            320,
            200,
            60,
            0x000000
        );
        
        const buttonText = this.add.text(
            this.sys.game.config.width / 2,
            320,
            'REJOUER',
            {
                fontFamily: 'Arial',
                fontSize: '24px',
                fill: '#ffffff'
            }
        ).setOrigin(0.5);

        button.setInteractive()
            .on('pointerover', () => button.setFillStyle(0xff0000))
            .on('pointerout', () => button.setFillStyle(0x000000))
            .on('pointerdown', () => this.scene.start('Game'));
    }
}

export default End;