ig.module(
	'game.entities.monkey'
)
.requires(
	'impact.entity',
	'impact.entity-pool'
)
.defines(function(){
	
EntityMonkey = ig.Entity.extend({
	size: {x: 34, y: 25},
	offset: {x: 0, y: 0},
	maxVel: {x: 1000, y: 1000},
	storeMaxVel: {x: 1000, y: 1000},
	storeVel: {x: null, y: null},
	friction: {x: 400, y: 0},
	
	zIndex: 1,
	
	
	type: ig.Entity.TYPE.B, // Evil enemy group
	checkAgainst: ig.Entity.TYPE.A, // Check against friendly
	collides: ig.Entity.COLLIDES.PASSIVE,
	
	health: 2,
	speed: 100,
	runWaitTime: 2.5,
	flip: false,
	idle: false,
	pause: false,
	kOTB: false,
	
	//attackSound: new ig.Sound( 'media/sounds/chihuahua.*' ),
	
	//animSheet: new ig.AnimationSheet( 'media/monkey.png', 36, 30 ),
	
	animSheets: {
		walk: new ig.AnimationSheet( 'media/monkey.png', 36, 30 ),
		jump: new ig.AnimationSheet( 'media/monkey-jumping.png', 42, 40 ),
	},
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		var randomJumpTime = 1+Math.floor(Math.random()*3);
		this.jumpTimer = new ig.Timer(randomJumpTime);
		this.idleTimer = new ig.Timer(0);
		this.idlingTimer = new ig.Timer(0);
		this.runTimer = new ig.Timer(0);
		this.attackTimer = new ig.Timer(0);
		this.dieUpTimer = new ig.Timer(0);
		
		this.anims.walk = new ig.Animation( this.animSheets.walk, .1, [0,1,2,3,4,5,6,7]);
		this.anims.run = new ig.Animation( this.animSheets.walk, .05, [0,1,2,3,4,5,6,7] );
		this.anims.idle = new ig.Animation( this.animSheets.walk, .1, [9,10,11,12,13,14] );
		this.anims.jump = new ig.Animation( this.animSheets.jump, 1, [5] );
		this.anims.fall = new ig.Animation( this.animSheets.jump, 1, [6]);
		
		//this.addAnim( 'walk', .1, [0,1,2,3,4,5,6,7] );

	},
	reset: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.kOTB = false;
		this.setRandomJumpTime();

	},
	pauseTimers: function(){
		this.jumpTimer.pause();
		this.runTimer.pause();
		this.idleTimer.pause();
		this.idlingTimer.pause();
		this.attackTimer.pause();
		this.dieUpTimer.pause();
	},
	unpauseTimers: function(){
		this.jumpTimer.unpause();
		this.runTimer.unpause();
		this.idleTimer.unpause();
		this.idlingTimer.unpause();
		this.attackTimer.unpause();
		this.dieUpTimer.unpause();
	},
	paused: function(){
		//Capture Speed
		if (!this.storeVel.x){
			this.storeVel.x = this.vel.x; 	
		}
		if (!this.storeVel.y){
			this.storeVel.y = this.vel.y;	
		}
		this.vel.x = 0;
		this.vel.y = 0;
		this.maxVel.x = 0;
		this.maxVel.y = 0;
		this.storedSpeed = this.speed;
		this.speed = 0;

		//Get pause frame
		if (this.currentAnim){
			this.pauseFrame = this.currentAnim.frame;
		}
		this.pauseTimers();
		this.pause = true;
	},
	unpaused: function(){
		this.maxVel.x = this.storeMaxVel.x;
		this.maxVel.y = this.storeMaxVel.y;
		this.vel.x = this.storeVel.x;
		this.vel.y = this.storeVel.y;
		this.storeVel.x = null; 
		this.storeVel.y = null;
		this.speed = this.storedSpeed;
		
		this.currentAnim.gotoFrame(this.pauseFrame);
		this.unpauseTimers();
		this.pause = false;
	},
	update: function() {
		//Pause and Unpause
		if ( ig.game.pause && !this.pause || ig.game.getEntityByName('player') && ig.game.getEntityByName('player').landed != true ){
			this.paused();
		}
		else if (this.pause && !ig.game.pause){
			this.unpaused();	
		}
		if (!this.pause){
			this.movements();
		}
		this.animateMe(); 
		
		if (this.flip == true){
			this.offset.x = 8;
		}
		else {
			this.offset.x = 6;	
		}
		//Kill me if I've been knocked out and I'm way off the screen
		if (this.kOTB){
			this.boundaries();
		}
		this.parent();
	},
	movements: function(){
		//Knocked out the box
		if (this.kOTB){
			if (ig.game.getEntityByName('player')){
				var player = ig.game.getEntityByName('player');
				if (player.pos.x > this.pos.x){
					this.vel.x =-220;
				}
				else{
					this.vel.x = 220;	
				}
			}
			if (this.dieUpTimer.delta() < 0){
				var bFF = this.dieUpTimer.delta() * -1;
				this.vel.y = -2000 * bFF;	
			}
			else{
				var bFF = this.dieUpTimer.delta();
				if (bFF > 1){
					bFF = 1;
				}
				this.vel.y = 1000 * bFF;
			}
		}
		else{
			//idle
			if (!this.running && !this.idle && this.idleTimer.delta() > 0){
				this.idle = true;	
				var ranVal1 = Math.random();
				var ranVal2 = Math.random();
				var ranVal3 = Math.random();
				var randomIdleTime = ranVal1 + ranVal2 + ranVal3;
				this.idlingTimer.set(randomIdleTime);
			}
			//Stop idling
			if (this.idle && this.running || this.idle && this.idlingTimer.delta() > 0){
				this.idle = false;
				var whenToIdleAgain = Math.floor(Math.random() * 8) + 2;
				this.idleTimer.set(whenToIdleAgain);
			}
			if(ig.game.victoryDance){
				this.speed = 0;	
				this.running = false;
				this.hasRan = false;
			}
			else if(this.running){
				this.speed = 500;	
			}
			else if (this.idle){
				this.speed = 0;		
			}
			else{
				this.speed = 150;	
			}
			
			var xdir = this.flip ? -1 : 1;
			this.vel.x = this.speed * xdir;
			
			
			
			//Jump
			if (this.jumpTimer.delta() > 0){
				//Random Height
				var randomJumpHeight = 400 +Math.floor(Math.random()*400);
				if (this.running){
					randomJumpHeight *= 1.33;
				}
				//Jump if close enough to player
				//this.distanceTo(player) < 384
				//jump if hasran
				if ( this.hasRan && !this.idle){
					this.vel.y = -randomJumpHeight;
				}
				this.setRandomJumpTime();
			}
			
			// Near an edge? return!
			if( !ig.game.collisionMap.getTile(	this.pos.x + (this.flip ? +4 : this.size.x -4), this.pos.y + this.size.y+1	)) {
				if (this.vel.y == 0){
					this.flip = !this.flip;
				}
			}
		}
	},
	animateMe: function(){
		if (this.pause && this.currentAnim){
			this.currentAnim.gotoFrame(this.pauseFrame);	
		}
		else if (this.vel.y > 0){
			this.currentAnim = this.anims.fall;		
		}
		else if (this.vel.y < 0){
			this.currentAnim = this.anims.jump;		
		}
		else if (this.vel.x != 0 && this.running){
			this.currentAnim = this.anims.run;	
		}
		else if (this.vel.x != 0 ){
			this.currentAnim = this.anims.walk;	
		}
		else{
			this.currentAnim = this.anims.idle;		
		}
		if (this.currentAnim){
			this.currentAnim.flip.x = this.flip;
		}
		
		//Rotation code
		if (this.kOTB && !this.pause){
			this.currentAnim = this.anims.idle;	
			this.currentAnim.angle -= Math.PI/.25 * ig.system.tick;
		}
		else{
			this.currentAnim.angle = 0;	
		}
		
	},
	setRandomJumpTime: function(){
		var jumpVal1 = Math.random();
		var jumpVal2 = Math.random() / 2;
		var jumpVal3 = Math.random() / 2;
		if (this.running){
			jumpVal1 /=2;
			jumpVal2 /=2;
			jumpVal3 /=2;
		}
				
		var randomJumpTime = 1 + jumpVal1 + jumpVal2 + jumpVal3;
			
		//Random Jumps
		this.jumpTimer.set(randomJumpTime);
	},
	kill: function() {
		//this.sfxDie.play();
		this.parent();
		
	},
	
	handleMovementTrace: function( res ) {
		if (this.kOTB){
			//float through walls
			this.pos.x += this.vel.x * ig.system.tick;
			this.pos.y += this.vel.y * ig.system.tick;	
		}
		else{
			this.parent( res );
		
			// Collision with a wall? return!
			if( res.collision.x ) {
				this.flip = !this.flip;
				this.offset.x = this.flip ? 0 : 24;
			}
		}
	},
	knockMeOutTheBox: function(){
		this.kOTB = true;
		this.dieUpTimer.set(.35);				
	},
	boundaries: function(){
		if (this.pos.y > ig.system.height * 1.5 + ig.game.screen.y){
			this.kill();
		}
	},
	check: function( other ) {
		if (!ig.game.quiz && this.attackTimer.delta() > 0 && !this.kOTB){
			ig.game.quizbox.quiz(1);
			/*if (!ig.game.muteGame){
				this.attackSound.volume = .5;
				this.attackSound.play();
			}*/
			//this.receiveDamage( 1, other );
			this.attackTimer.set(ig.game.enemyRecoveryTime);
			
		}
		//I will die if the player is invulnerable
		if (!this.kOTB){
			this.knockMeOutTheBox();
		}
	}
});
	ig.EntityPool.enableFor( EntityMonkey );
});