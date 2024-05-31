class Load extends Phaser.Scene{
    constructor() {
        super("loadScene");
    }

    preload(){
        this.load.setPath("./assets/");


        //tilemap for monochrome Kenny asset 2d 1bit platformer
        this.load.image("kenny_onebittilemap_packed", "monochrome_tilemap_packed.png");
        this.load.tilemapTiledJSON("levelOneMap", "levelOneMap.json");

        //Load the tilemap as a spritesheet
        this.load.spritesheet("onebittilemap_sheet", "monochrome_tilemap_packed.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        //Load particles as a multiatlas
        this.load.multiatlas("kenny-particles", "kenny-particles.json");

        //Load sounds
        //this.load.audio("hookSound", "highDown.ogg");
        //this.load.audio("catchSound", "pepSound3.ogg");
        //Play sounds using this.sound.play("hookSound");
    }
    
    create() {
        //Animations created for Idle, Walking, and Jumping
        this.anims.create({
            key: 'idle',
            defaultTextureKey: "onebittilemap_sheet",
            frames: [
                { frame: 260},
                { frame: 265}
            ],
            frameRate: 2,
            repeat: -1
        });

        this.anims.create({
            key: 'walk',
            defaultTextureKey: "onebittilemap_sheet",
            frames: [
                { frame: 261},
                { frame: 262},
                { frame: 263}
            ],
            frameRate: 15,
            repeat: -1
        })

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "onebittilemap_sheet",
            frames: [
                { frame: 264}
            ],
            repeat: -1
        })

        this.anims.create({
            key: 'slide',
            defaultTextureKey: "onebittilemap_sheet",
            frames: [
                { frame: 266}
            ],
            repeat: -1
        })

        //Start LevelOne Scene
        this.scene.start("levelOneScene");
    }

    update(){

    }
}