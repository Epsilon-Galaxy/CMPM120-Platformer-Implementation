class Load extends Phaser.Scene{
    constructor() {
        super("loadScene");
    }

    preload(){
        this.load.setPath("./assets/");

        this.load.image("onebittilemap_packed", "monochrome_tilemap_packed.png");
        this.load.tilemapTiledJSON("levelOneMap", "levelOneMap.json");

        this.load.spritesheet("onebittilemap_sheet", "monochrome_tilemap_packed.png", {
            frameWidth: 16,
            frameHeight: 16
        });
    }
    
    create() {
        this.scene.start("levelOneScene");
    }

    update(){

    }
}