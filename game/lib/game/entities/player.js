ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity',
	'impact.entity-pool'
)
.defines(function(){

EntityPlayer = ig.Entity.extend({

	name:"player",
	
	size: {x: 20, y: 40},
	offset: {x: 8, y: -3},
	friction: {x: 4000, y: 0},
	storeVel: {x: 0, y: 0},
	maxVel: {x: 400, y: 1000},
	maxVelStore: {x: 400, y: 1000},
	maxX: 400,
	maxY: 1000,

	accelGround: 600,
	accelAir: 600,
	
	jump: 750,
	health: 1,
	
	gravityFactor: 1,
	theGravityFactor: 1,
	
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(245, 66, 212, 1)',
	
	type: ig.Entity.TYPE.A, 
	
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.PASSIVE,
	
	pause: false,
	flip: false,
	zIndex: 10,
	
	landed: false,
	alive: true,
	dying: false,
	victory: false,
	invin: true,
	invinTime: 2,
	readyBro: true,
	deathMode: null,
	animSheets: {
		player: new ig.AnimationSheet( 'media/player-01.png', 20, 40 ),
		playerDeath: new ig.AnimationSheet( 'media/player-death.png', 44, 41 ),
	},
	
	//swimSound: new ig.Sound( 'media/sounds/swim.*' ),

	unpauseTimers: function(){
		this.invincibleTimer.unpause();
		if (ig.game.flashingMessage){
			ig.game.flashingMessageTimer.unpause();
			ig.game.flashingMessageIntravelTimer.unpause();
		}
	},
	pauseTimers: function(){
		this.invincibleTimer.pause();
		if (ig.game.flashingMessage){
			ig.game.flashingMessageTimer.pause();
			ig.game.flashingMessageIntravelTimer.pause();
		}
	},
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		//Timers
		this.invincibleTimer = new ig.Timer(2);
		this.victoryTimer = new ig.Timer(0);
		this.deathTimer = new ig.Timer(0);
		this.waitToStartTimer = new ig.Timer(.25);
		
		//Anims
		this.anims.idle = new ig.Animation( this.animSheets.player, 1, [0] );
		this.anims.run = new ig.Animation( this.animSheets.player, 0.1, [1,2,3,0] );
		this.anims.jump = new ig.Animation( this.animSheets.player, 1, [4] );
		this.anims.fall = new ig.Animation( this.animSheets.player, 1, [5] );
		this.anims.win = new ig.Animation( this.animSheets.player, .5, [6], true );
		this.anims.dying = new ig.Animation( this.animSheets.playerDeath, .05, [0,0,0,1]);

		this.anims.idleInv = new ig.Animation( this.animSheets.player, 0.05, [0, 0, 7] );
		this.anims.runInv = new ig.Animation( this.animSheets.player, 0.05, [1,2,7,3,4,7,5,6,7] );
		this.anims.jumpInv = new ig.Animation( this.animSheets.player, 0.05, [8,8,7] );
		this.anims.fallInv = new ig.Animation( this.animSheets.player, 0.05, [9,9,7] );

		this.currentAnim = this.anims.fall;
		
		//Calculate Token Stuff
		if (!ig.global.wm){
			ig.game.processTokens('reset');
		}
		//Make sure mute button exists
		if (!ig.global.wm){
			ig.game.spawnButtons();
		}
	},
	reset: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.invincibleTimer.set(2);
		this.dying = false;
		this.dead = false;
		this.pause = false;
		this.victoryDance = false;
		this.landed = false;
		this.deathMode = null;
		this.currentAnim = this.anims.fall;
		//Reset this variable so enemy deaths count towards metrics
		ig.game.clearingLevel = false;
		
		//Calculate Token Stuff and Make sure mute button exists
		if (!ig.global.wm){
			ig.game.processTokens('reset');
			ig.game.spawnButtons();
		}
	},
	paused: function(){
		//Pause Movement
		
		this.storeVel.x = this.vel.x ? this.vel.x : 0; 	
		this.storeVel.y = this.vel.y ? this.vel.y : 0;	
		this.vel.x = 0;
		this.vel.y = 0;
		this.maxVelStore.x = this.maxVel.x;
		this.maxVelStore.y = this.maxVel.y;
		this.maxVel.x = 0;
		this.maxVel.y = 0;
		this.theGravityFactor = this.gravityFactor;
		this.gravityFactor = 0;
		//Pause Animation
		
		this.pauseFrame =  this.currentAnim ? this.currentAnim.frame : 0;
		this.pause = true;
		//Pause Timers
		this.pauseTimers();
		ig.game.pause = true;
	},
	unpaused: function(){
		//Restore Movement
		this.maxVel.x = this.maxVelStore.x;
		this.maxVel.y = this.maxVelStore.y;
		this.vel.x = this.storeVel.x;
		this.vel.y = this.storeVel.y;
		 this.gravityFactor = this.theGravityFactor;
		//Restore Timers
		this.unpauseTimers();
		//Restore Switches
		this.pause = false;
	},
	invincible: function(time){
		this.invin = true;
		this.invincibleTimer.set(time);
	},
	
	checkForUnpause: function(){
		//This function clears the dead screen after death once level is restarted.
		if (ig.game.playerDead && !this.dying){
			if ( ig.input.released('attack') ||  ig.input.released('click')){
				ig.game.playerDead = false;
				ig.game.managingPlayerDeath = false;
				ig.game.dying = false;
				ig.game.pause = false;
				ig.game.checkForMessages();
			}	
		}
	},
	movements: function(){
		// move left or right
		var accelAir = this.accelAir;	
		var accel = this.accelGround;
		this.amReady = true;
		
		//Add things that make me "not ready" - (Pause player while the rest of the game moves)
		if (this.dying || this.dead || this.victoryDance || ig.game.transition || ig.game.deathScreen){
			this.amReady = false;	
			this.vel.x = 0;
			this.accel.x = 0;		
		}
		else if (ig.input.pressed('jump') ){
			this.vel.y = -this.jump;	
		}
		else if (ig.input.state('left') && ig.input.state('right')){
			this.accel.x = 0;									
		}
		else if( ig.input.state('left')) {
			if (this.vel.x > 0){
				this.accel.x = 0;	
				this.vel.x = 0;
			}
			this.accel.x = -accel;
			this.flip = true;
		}
		else if( ig.input.state('right') ) {
			if (this.vel.x < 0){
				this.accel.x = 0;
				this.vel.x = 0;
			}
			this.accel.x = accel;
			this.flip = false;
		}
		else {
			this.accel.x = 0;
		}
	},
	animMe: function(){
		//Set Animation
		if (this.dying){
			this.currentAnim = this.anims.dying;
		}
		else if (this.victoryDance){
			this.currentAnim = this.anims.win;	
		}
		//Stay on a cool frame when the level loads, before the player first hits the ground.
		else if (!this.landed){
			this.currentAnim = this.anims.fall;
		}
		else if (this.pause){
			if (this.currentAnim){
				this.currentAnim.gotoFrame(this.pauseFrame);
			}
		}
		else if (this.invin && this.vel.y < 0){
			this.currentAnim = this.anims.jumpInv;
		}
		else if( this.vel.y < 0 ) {
			this.currentAnim = this.anims.jump;
		}
		else if(this.invin && this.vel.y > 0 ) {
			this.currentAnim = this.anims.fallInv;
		}
		else if( this.vel.y > 0 ) {
			this.currentAnim = this.anims.fall;
		}
		else if( this.invin && this.vel.x != 0 ) {
			this.currentAnim = this.anims.runInv;
		}
		else if( this.vel.x != 0 ) {
			this.currentAnim = this.anims.run;
		}
		else if( this.invin){
			this.currentAnim = this.anims.idleInv;
			this.anims.run.rewind();	
		}
		else {
			this.currentAnim = this.anims.idle;
			this.anims.run.rewind();
		}
		if (this.currentAnim){
			this.currentAnim.flip.x = this.flip;
		}
	},
	checkConditions: function(){
		//Victory (start cut)
		if (this.victoryDance && this.victoryTimer.delta() > 0){
			if (ig.game.gameWon && !ig.game.transition){
				ig.game.endingScreen = true;
				//I kind of want to jump to the transition so I'm doing this odd delay.
				ig.game.fadeOut(-.93, ig.game.color1);				
			}
			else if (!ig.game.transition && !ig.game.gameWon){ 
				//FADEOUT
				//ig.game.fadeOut();
				ig.game.levelCleared = true;
				ig.game.slideRightIn("","",3);
			}
		}
		//Load Level and Kill Everything
		if (this.victoryDance && ig.game.readyToLoad){
			ig.game.pData.lvl++;
			//Set this variable so enemy killcount doesn't get crazy high every reload
			ig.game.clearingLevel = true;
			ig.game.saveGame();
			ig.game.LoadLevelBro( ig.game.pData.lvl );
			
		}
		if (this.dying && this.deathTimer.delta() > 0 && !this.dead){
			//Process Death Data - Reload
			ig.game.processTokens('rewind');
			ig.game.pData.deaths++;
			ig.game.saveGame();
			this.dead = true;
			ig.game.playerDead = true;
			ig.game.fadeOut(0, ig.game.colorWrong);	
		}
		//initiate dying sequence when health drops below 0
		if (this.health <= 0 && !this.dying){
			//Fade out to red or colorwrong
			this.initDeathSeq("fallThrough");
		}
		
		var maxX = ig.game.collisionMap.width * ig.game.collisionMap.tilesize;
		var maxY = ig.game.collisionMap.height * ig.game.collisionMap.tilesize;
		//Kill me if I fall out of collision area for some buggy reason.
		if (this.pos.y < 0 && !this.dying|| this.pos.x < 0 && !this.dying || this.pos.y > maxY && !this.dying || this.pos.x > maxX && !this.dying){
			this.initDeathSeq();
		}

		//End invinc
		if (this.invin && this.invincibleTimer.delta() > 0){
			this.invin = false;	
		}

		//End Flashing Messages
		if (ig.game.flashingMessage && ig.game.flashingMessageTimer.delta() > 0){
			ig.game.flashingMessage = false;
		}
	},

	playMusicBro: function(){
		/*
		if (ig.game.getEntityByName("lighthousedoor")){
			var lHD = ig.game.getEntityByName("lighthousedoor");
			lHD.victorySong.stop();
			ig.game.deadSound.stop();
		}
		if(ig.game.pData.lvl <= 10){
			ig.game.musicLevel = .25;
			ig.music.play(01);	
		}
		else if(ig.game.pData.lvl <= 20){
			ig.game.musicLevel = .25;
			ig.music.play(02);	
		}
		else if(ig.game.pData.lvl <= 30){
			ig.game.musicLevel = .25;
			ig.music.play(03);	
		}
	
		if (!ig.game.muteGame){
			ig.music.volume = ig.game.musicLevel;
		}
		else{
			ig.music.volume = 0;
		}
		*/
	},
	update: function() {
		
		if (!this.musicPlaying && !ig.game.cutScreen && !ig.game.titleScreen && !ig.game.fadeToRed && !ig.game.endingScreen){
			//this.playMusicBro();
			this.musicPlaying = true;
		}
		
		if (this.pause ||  ig.game.playerDead ){
			this.checkForUnpause();	
		}
		if ( ig.game.pause && !this.pause ){
			this.readyBro = false;	
			this.paused();
		}
		else if (this.pause && !ig.game.pause){
			this.readyBro = true;
			this.unpaused();
		}
	
		//Move if the Player is "Ready"
		if (this.readyBro){
			this.movements();
		}
		//Dying
		else if (this.dying){
			//Death stuff
			this.vel.x = 0;	
			this.accel.x = 0;
			this.maxVel.y =  this.jump;
			this.vel.y = this.jump;
			this.collides = ig.Entity.COLLIDES.NEVER;
			this.type = ig.Entity.TYPE.NONE;
			if (this.deathMode == "fallThrough"){
					
			}
		}

		
		//Set Animation
		this.checkConditions();
		this.animMe();
		
		
		this.parent();
	},
	initDeathSeq: function(deathMode){
		if (deathMode){
			this.deathMode = deathMode;
		}
		this.deathAnim = true;
		this.anims.dying.rewind();
		this.dying = true;
		ig.game.dying = true;
		this.deathTimer.set(2);
		//Make a wrong sound
		if (!ig.game.muteGame){	ig.game.deadSound.volume = .4; ig.game.deadSound.play(); }
		//Dont forget to figure out this token logic that is not currently relevant
		ig.game.lastTokens = ig.game.pData.tokensLT;
	},
	kill: function(){
		this.parent();
	},
	handleMovementTrace: function( res ) {
		if (this.deathMode == "fallThrough" && this.dying){
			//float through walls
			this.pos.x += this.vel.x * ig.system.tick;
			this.pos.y += this.vel.y * ig.system.tick;	
		}
		else{
			var accel = this.standing ? this.accelGround : this.accelAir;
			if( res.collision.y || res.collision.slope ){
				this.vel.y = 0;	
				if (!this.landed){
					console.log('this.landed');
					this.landed = true;
					ig.game.transition = false;
					ig.game.readyToLoad = false;
					ig.game.playMusicBro();
					//This prevents the player from reseting the cut animation over and over again.
					ig.game.cutCleared = false;
				}
			}
			//Continue resolving the collision as normal
			this.parent(res); 
		}
	}
});
ig.EntityPool.enableFor( EntityPlayer );
});
