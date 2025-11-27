class Menu extends Phaser.Scene{
    constructor(){
        super('Menu');
    }

    create(){
        const title = this.add.text(
            this.sys.game.config.width / 2,
            150,
            'DODGE & SURVIVE',
            {
                fontFamily: 'Arial Black',
                fontSize: '48px',
                fill: '#000000',
            }
        ).setOrigin(0.5);

        const button = this.add.rectangle(
            this.sys.game.config.width / 2,
            300,
            200,
            60,
            0x000000
        );

        const buttonText = this.add.text(
            this.sys.game.config.width / 2,
            300,
            'JOUER',
            {
                fontFamily: 'Arial',
                fontSize: '24px',
                fill: '#ffffff'
            }
        ).setOrigin(0.5);

        button.setInteractive()
            .on('pointerover', () => button.setFillStyle(0x8888ff))
            .on('pointerout', () => button.setFillStyle(0x000000))
            .on('pointerdown', () => this.scene.start('Game'));
    }

    update(){

    }
}

export default Menu;