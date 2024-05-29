class levelOne extends Phaser.Scene{
    constructor(){
        super("levelOneScene");
    }

    init() {
        this.ACCELERATION = 400;
        this.DRAG = 500;
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -600;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;

    }
    
    create(){
        this.map = this.add.tilemap("levelOneMap", 16, 16, 48, 25);
        
        this.tileset = this.map.addTilesetImage("onebittilemap_packed", "kenny_onebittilemap_packed");

        this.groundLayer = this.map.createLayer("GroundLayer", this.tileset, 0, 0);

        my.sprite.player = this.physics.add.sprite(50, 50, "platformer_characters", "tile_0000.png");
        my.sprite.player.setCollideWorldBounds(true);


        this.groundLayer.setCollisionByProperty({
            collides: true
        });
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);
    }

    update(){
        
    }
}