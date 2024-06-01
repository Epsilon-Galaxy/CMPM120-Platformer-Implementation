class levelOne extends Phaser.Scene{
    constructor(){
        super("levelOneScene");
    }

    init() {
        this.ACCELERATION = 300;
        this.DRAG = 1200;
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -600;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;
        this.MAX_SPEED = 500;

        //If player is standing on ICe player will be slippery
        this.onIcyFloor = false;

        //global variable to know if the player has the key to unlock the door or not
        this.hasKey = false;
        
        //If player is currently IDLE
        this.idle = true;

        //Main Score for the game
        this.score = 0;

        this.currentSpawnX = 0;
        this.currentSpawnY = 0;

        this.gameOver = false;

        this.soundCounter = 0;
        this.soundTimer = 5;

    }
    
    create(){


        /*
        THINGS TO FINISH
        ADD PARTICLES AND EFFECTS
        ADD MUSIC
        ADD WIN CONDITION
        DESIGN LEVEL

        AFTER EFFECTS
        ADD UI 
        ADD DANGER ELEMENTS
        ADD ANIMATIONS
        */
       
        // Create MAP and TILESET
        this.map = this.add.tilemap("levelOneMap", 16, 16, 148, 25);
        this.tileset = this.map.addTilesetImage("onebittilemap_packed", "kenny_onebittilemap_packed");

        // Create LAYERS
        this.groundLayer = this.map.createLayer("GroundLayer", this.tileset, 0, 0);
        this.detailLayer = this.map.createLayer("details", this.tileset, 0, 0);

        // Create PLAYER and update player PHYSICS and BOUNDS
        my.sprite.player = this.physics.add.sprite(this.currentSpawnX, this.currentSpawnY, "onebittilemap_sheet", 261);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        my.sprite.player.setCollideWorldBounds(true);
        my.sprite.player.body.setMaxSpeed(this.MAX_SPEED);

        
        // Create OBJECTS from OBJECT LAYER

        // OBJECT SPIKE
        this.spike = this.map.createFromObjects("Objects", {
            name: "spike",
            key: "onebittilemap_sheet",
            frame: 183
        })
        this.physics.world.enable(this.spike, Phaser.Physics.Arcade.STATIC_BODY);
        this.spikeGroup = this.add.group(this.spike);

        // OBJECT TREASURE
        this.treasure = this.map.createFromObjects("Objects", {
            name: "treasure",
            key: "onebittilemap_sheet",
            frame: 389
        })
        this.physics.world.enable(this.treasure, Phaser.Physics.Arcade.STATIC_BODY);
        this.treasureGroup = this.add.group(this.treasure);

        // OBJECT SPAWN
        this.spawn = this.map.createFromObjects("Objects", {
            name: "spawnPoint",
            key: "onebittilemap_sheet",
            frame: 185
        })
        this.physics.world.enable(this.spawn, Phaser.Physics.Arcade.STATIC_BODY);
        this.spawnGroup = this.add.group(this.spawn);
        
        // OBJECT LOCKED DOOR
        this.lockedDoor = this.map.createFromObjects("Objects", {
            name: "lockedDoor",
            key: "onebittilemap_sheet",
            frame: 56
        })
        this.physics.world.enable(this.lockedDoor, Phaser.Physics.Arcade.STATIC_BODY);
        this.lockedDoorGroup = this.add.group(this.lockedDoor);

        // OBJECT COIN
        this.coin = this.map.createFromObjects("Objects", {
            name: "coin",
            key: "onebittilemap_sheet",
            frame: 2
        })
        this.physics.world.enable(this.coin, Phaser.Physics.Arcade.STATIC_BODY);
        this.coinGroup = this.add.group(this.coin);

        // OBJECT KEY
        this.keyUnlock = this.map.createFromObjects("Objects", {
            name: "key",
            key: "onebittilemap_sheet",
            frame: 96
        })
        this.physics.world.enable(this.keyUnlock, Phaser.Physics.Arcade.STATIC_BODY);
        this.keyGroup = this.add.group(this.keyUnlock);

        // OBJECT ICY TILES
        this.icy = this.map.createFromObjects("Objects", {
            name: "icyTile",
            key: "onebittilemap_sheet",
            frame: 276
        });
        this.physics.world.enable(this.icy, Phaser.Physics.Arcade.STATIC_BODY);
        this.icyFloorGroup = this.add.group(this.icy);


        // Create COLLISIONS AND OVERLAPS

        // COLLISION spike
        this.physics.add.overlap(my.sprite.player, this.spikeGroup, (obj1, obj2) =>{
            this.add.particles(obj2.x, obj2.y, "kenny-particles", {
                frame: ["slash_01.png", "slash_02.png", "slash_03.png", "slash_04.png"],
                random: true,
                scale: {start: 0.5, end: 0.05},
                maxAliveParticles: 3,
                lifespan: 300,
                duration: 300
            });
            this.respawn();
            this.sound.play("deathSound");
        })

        // COLLISION treasure
        this.physics.add.overlap(my.sprite.player, this.treasureGroup, (obj1, obj2) =>{
            console.log("gameOver");
            this.gameOver = true;
            obj2.destroy();
        })

        // COLLISION checkpoint
        this.physics.add.overlap(my.sprite.player, this.spawnGroup, (obj1, obj2) =>{
            this.currentSpawnX = obj2.x;
            this.currentSpawnY = obj2.y;
        })

        // COLLISION lockedDoor
        this.physics.add.overlap(my.sprite.player, this.lockedDoorGroup, (obj1, obj2) => {
            if(this.hasKey == true){
                this.add.particles(obj2.x, obj2.y, "kenny-particles", {
                    frame: ["circle_01.png", "circle_02.png", "circle_03.png", "circle_04.png"],
                    random: true,
                    scale: {start: 0.5, end: 0.05},
                    maxAliveParticles: 3,
                    lifespan: 200,
                    duration: 200
                });
                
                obj2.destroy();
                console.log("door opened");
                this.sound.play("coinSound");
            }
        })
        this.physics.add.collider(my.sprite.player, this.lockedDoorGroup);

        // COLLISION coin
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            this.add.particles(obj2.x, obj2.y, "kenny-particles", {
                frame: ["magic_03.png", "magic_04.png", "magic_05.png"],
                random: true,
                scale: {start: 0.03, end: 0.05},
                maxAliveParticles: 8,
                lifespan: 350,
                duration: 500
            });
            this.score += 100;

            obj2.destroy();
            console.log("Score is now: ", this.score);
            this.sound.play("coinSound");
        })

        // COLLISION key
        this.physics.add.overlap(my.sprite.player, this.keyGroup, (obj1, obj2) =>{
            this.hasKey = true;
            console.log("key collected");
            this.add.particles(obj2.x, obj2.y, "kenny-particles", {
                frame: ["magic_03.png", "magic_04.png", "magic_05.png"],
                random: true,
                scale: {start: 0.03, end: 0.05},
                maxAliveParticles: 8,
                lifespan: 350,
                duration: 500
            });
            this.sound.play("coinSound");
            obj2.destroy();
        })

        // COLLISION icyTile
        this.physics.add.overlap(my.sprite.player, this.icyFloorGroup, (obj1, obj2) => {
            this.add.particles(obj2.x, obj2.y, "kenny-particles", {
                frame: ['window_03.png'],
                // TODO: Try: add random: true
                random: true,
                scale: {start: 0.03, end: 0.25},
                // TODO: Try: maxAliveParticles: 8,
                maxAliveParticles: 3,
                lifespan: 100,
                quantity: 2,
                frequency: 100,
                gravityY: 300,
                duration: 100
            });
            my.sprite.player.anims.play("slide");
            this.onIcyFloor = true;
            
        });    

        // Create collision with Ground LAYER
        this.groundLayer.setCollisionByProperty({
            collides: true
        });
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        // Create WALKING VFX
        my.vfx.walkingRight = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_07.png', 'smoke_08.png', 'smoke_09.png', 'smoke_10.png'],
            random: true,
            scale: {start: 0.03, end: 0.05},
            maxAliveParticles: 3,
            lifespan: 200,
            gravityY: -1000,
            gravityX: -1000,
            alpha: {start: 0.7, end: 0.1}, 
        });
        my.vfx.walkingRight.stop();

        my.vfx.walkingLeft = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_07.png', 'smoke_08.png', 'smoke_09.png', 'smoke_10.png'],
            random: true,
            scale: {start: 0.03, end: 0.05},
            maxAliveParticles: 3,
            lifespan: 200,
            gravityY: -1000,
            gravityX: 1000,
            alpha: {start: 0.7, end: 0.1}, 
        });
        my.vfx.walkingLeft.stop();




        // Create CAMERA 
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 70);
        this.cameras.main.setZoom(this.SCALE);


      // set up Phaser-provided cursor key input
      cursors = this.input.keyboard.createCursorKeys();
      this.rKey = this.input.keyboard.addKey('R');



      // debug key listener (assigned to D key)
      this.input.keyboard.on('keydown-D', () => {
          this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
          this.physics.world.debugGraphic.clear()
      }, this);        



      // Begin Player Idle animation
      my.sprite.player.anims.play('idle');

      // Set player spawn at beginning
      this.currentSpawnX = this.spawn[0].x;
      this.currentSpawnY = this.spawn[0].y;
      this.respawn();

      

    }

    update(){

        if(this.gameOver == true){
            my.sprite.player.body.setVelocityX(0);
            my.sprite.player.body.setVelocityY(0);
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setAccelerationY(0);
            this.scoreText = this.add.bitmapText(60, 230, "KennyPixel", "Score: " + this.score, 32);
            this.endGame = this.add.bitmapText(60, 60, "KennyPixel", "GOOD GAME", 32);
            this.restartGame = this.add.bitmapText(60, 300, "KennyPixel", "Press 'R' to restart", 32);
            if(this.idle == false){
                my.sprite.player.anims.play('idle');
                this.idle = true;
                my.vfx.walkingRight.stop();
                my.vfx.walkingLeft.stop();
            }

            if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
                this.scoreText.visible = false;
                this.endGame.visible = false;
                this.restartGame.visible = false;
                this.scene.restart();
            }
        }
        else{
            // If player is on an icy floor make player slide around
            if(this.onIcyFloor){
                this.DRAG = 100;
                this.onIcyFloor = false;
            }
            else{
                this.DRAG = 1200;
            }

            // Movement
            if(cursors.left.isDown) {
                my.sprite.player.setAccelerationX(-this.ACCELERATION);
                my.sprite.player.setFlip(true, false);
                my.sprite.player.anims.play('walk', true);
                this.idle = false;

                my.vfx.walkingLeft.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
                my.vfx.walkingLeft.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

                if (my.sprite.player.body.blocked.down) {

                    my.vfx.walkingLeft.start();
                    if(this.soundCounter >= this.soundTimer){
                        if(this.icyFloor == true){
                            this.sound.play("iceSound");
                        }
                        else{
                            this.sound.play("walkingSound");
                        }
                        this.soundCounter = 0;
                    }
                    else{
                        this.soundCounter += 1;
                    }

                }

            } else if(cursors.right.isDown) {
                my.sprite.player.setAccelerationX(this.ACCELERATION);

                my.sprite.player.resetFlip();
                my.sprite.player.anims.play('walk', true);
                this.idle = false;

                my.vfx.walkingRight.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);

                my.vfx.walkingRight.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

                if (my.sprite.player.body.blocked.down) {

                    my.vfx.walkingRight.start();
                    if(this.soundCounter >= this.soundTimer){
                        if(this.icyFloor == true){
                            this.sound.play("iceSound");
                        }
                        else{
                            this.sound.play("walkingSound");
                        }

                        this.soundCounter = 0;
                    }
                    else{
                        this.soundCounter += 1;
                    }
                }

            } else {
                if(this.idle == false){
                    my.sprite.player.anims.play('idle');
                    this.idle = true;
                }
                // Set acceleration to 0 and have DRAG take over
                my.sprite.player.setAccelerationX(0);
                my.sprite.player.setDragX(this.DRAG);

                my.vfx.walkingRight.stop();
                my.vfx.walkingLeft.stop();
            }

            // player jump
            if(!my.sprite.player.body.blocked.down) {
                my.sprite.player.anims.play('jump');
                
                this.idle =false;
            }
            if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
                this.sound.play("iceSound");
                my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);

            }
        }

    }

    respawn(){
        console.log("Respawning");
        my.sprite.player.body.setVelocityX(0);
        my.sprite.player.body.setVelocityY(0);
        my.sprite.player.body.setAccelerationX(0);
        my.sprite.player.body.setAccelerationY(0);
        my.sprite.player.x = this.currentSpawnX;
        my.sprite.player.y = this.currentSpawnY;
        this.add.particles(this.currentSpawnX, this.currentSpawnY, "kenny-particles", {
            frame: ["circle_01.png", "circle_02.png", "circle_03.png", "circle_04.png"],
            random: true,
            scale: {start: 0.5, end: 0.05},
            maxAliveParticles: 3,
            lifespan: 200,
            duration: 200
        });
    }
}