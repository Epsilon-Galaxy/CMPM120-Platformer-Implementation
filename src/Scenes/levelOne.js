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


}