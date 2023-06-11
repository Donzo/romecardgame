ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	//'impact.debug.debug',
	'impact.font',
	'plugins.dynamic-fonts',
	'plugins.touch-button',
	'game.entities.button',
	'game.entities.square',
	'game.entities.militaryunit',
	'game.entities.mutebutton',
	'game.levels.l1'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	//Don't forget to set this to the number of total levels or game will end early or something
	totalLevels: 2,
	
	gravity: 2000, // All entities are affected by this
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	
	//Define Main Colors
	color1:"#C72C27",
	color2:"#FFE9B5",
	color3:"#8B4513",
	color4:"#87CEEB",
	color5:"#DAA520",
	color6:"#D8BFD8",
	color7:"#008080",
	colorRight: "#32CD32",//Lime
	colorWrong: "#764762", //Red
	defaultStatTextColor: "#000000",
	
	buttonLeft: new ig.Image( 'media/buttons-and-logos/button-left.png' ),
	buttonRight: new ig.Image( 'media/buttons-and-logos/button-right.png' ),
	buttonJump: new ig.Image( 'media/buttons-and-logos/button-jump.png' ),
	buttonA: new ig.Image( 'media/buttons-and-logos/button-a.png' ),
	
	//Small Buttons
	buttonLeftSmall: new ig.Image( 'media/buttons-and-logos/button-left-small.png' ),
	buttonRightSmall: new ig.Image( 'media/buttons-and-logos/button-right-small.png' ),
	buttonJumpSmall: new ig.Image( 'media/buttons-and-logos/button-jump-small.png' ),
	buttonASmall: new ig.Image( 'media/buttons-and-logos/button-a-small.png' ),
	
	//Smaller Buttons
	buttonLeftSmaller: new ig.Image( 'media/buttons-and-logos/button-left-smaller.png' ),
	buttonRightSmaller: new ig.Image( 'media/buttons-and-logos/button-right-smaller.png' ),
	buttonJumpSmaller: new ig.Image( 'media/buttons-and-logos/button-jump-smaller.png' ),
	buttonASmaller: new ig.Image( 'media/buttons-and-logos/button-a-smaller.png' ),
	
	buttonMute: new ig.Image( 'media/buttons-and-logos/button-mute.png' ),
	buttonMuted: new ig.Image( 'media/buttons-and-logos/button-muted.png' ),
	buttonMuteSmall: new ig.Image( 'media/buttons-and-logos/button-mute-small.png' ),
	buttonMutedSmall: new ig.Image( 'media/buttons-and-logos/button-muted-small.png' ),
	
	muteGame: false,
	musicLevel: 1,
	
	//Preloaded Songs
	songs: {
		l1: new ig.Sound('media/music/01.*', false ),
		l2: new ig.Sound('media/music/02.*', false ),
		l3: new ig.Sound('media/music/03.*', false ),
		l4: new ig.Sound('media/music/04.*', false ),
	},
	
	//Sounds
	drawSwordSound: new ig.Sound('media/sounds/draw-sword.*'),
	pickSound: new ig.Sound('media/sounds/card-pick.*'),
	unpickSound: new ig.Sound('media/sounds/card-unpick.*'),
	
	goldHud: new ig.Image('media/hud-token.png'),
	foodHud: new ig.Image('media/hud-food.png'),
	moraleHud1: new ig.Image('media/hud-morale-01.png'),
	moraleHud2: new ig.Image('media/hud-morale-02.png'),
	moraleHud3: new ig.Image('media/hud-morale-03.png'),
	divinityHud: new ig.Image('media/hud-divinity.png'),
	
	CCIDCounter: 0,
	MUIDCounter: 0,
	
	enemyRecoveryTime: .66,
	
	fadeColor: this.color3,
	slideColor: this.color3,
	
	titleScreen: true,
	transition: false,
	transitionType: null,
	flashScreen: false,
	flashScreenColor: null,
	flashMsgOnTime: .85,
	flashMsgOffTime: .15,
	flashMsg: true,
	
	
	//Dfont Variables
	maxHeaderHeightRatio: 0.15,
	maxHeaderHeight: null,
	maxHeaderLines: 2,
	maxHeaderLinesPortrait: 3,
	
	
	//Ending Variables
	flickerColor: false,
	flickerCount: 0,
	flickerTotalCount: 0,
	flickerFreq: 1,
	maxFlickers: 50,
	xSelected: 0,
	ySelected: 0,
	xCamera: 0,
	yCamera:0,
	xSelectedPos: 0,
	ySelectedPos: 0,
	cameraBoundX: 128,
	cameraBoundY: 96,
	
	deckLoadingMessage1: "Loading...",
	deckLoadingMessage2: "",
	deckLoadingMessage3: "",
	deckLoadingMessage4: "",
	prepareDeck: false,
	prepareDeckMenu: 1,
	cardSelectionIndex: 0,
	selectedCardsCount: 0,
	noMilitaryUnit: true,
	maxCards: 21,
	drawPlayCardDisplay: false,
	playingCardStep: 0,
	
	
	init: function() {
		//Bind Inputs
		ig.input.bind(ig.KEY.MOUSE1, 'click');
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		ig.input.bind( ig.KEY.UP_ARROW, 'jump' );
		ig.input.bind( ig.KEY.SPACE, 'action' );
		
		this.transitionTimer = new ig.Timer(0);
		this.flashScreenTimer = new ig.Timer(0);
		this.flashMessageTimer = new ig.Timer(0);
		this.questionClearTimer = new ig.Timer(0);
		this.deathScreenTimer = new ig.Timer(0);
		this.musicDelayTimer = new ig.Timer(0);
		this.timeLeftInTurn = new ig.Timer(0);

		//Load Title Screen images into impact
		this.loadTSImages();
		
		//Call for Dynamic Fonts
		this.dFonts = new DynamicFonts();
		
		//Wipe Data
		//this.wipeData();
		
		//Load Game
		this.loadGame();
		
		//Load Level
		this.LoadLevelBro( this.pData.lvl);
		
		ig.game.spawnEntity( EntityButton, 0, 0, { name: "start" });	

		if (this.savedGame ){	
			ig.game.spawnEntity( EntityButton, 0, 0, { name: "continue" });	
		}
		
		//Set Buttons
		ig.game.setButtons();
		
		if( ig.ua.mobile ) {
			this.amImobile = true;
		}
		else{
			this.amImobile = false;
		}
		
		//this.songs.l2 = new ig.Sound('media/music/song-02.*', false );
		//this.songs.l3 = new ig.Sound('media/music/song-04.*', false );
		
		//MUSIC
		ig.music.add (this.songs.l1, 01, ["l1"] );
		ig.music.add (this.songs.l2, 02, ["l2"] );
		ig.music.add (this.songs.l3, 03, ["l3"] );
		ig.music.add (this.songs.l4, 04, ["l4"] );
		
		ig.music.loop = true;
		ig.music.volume = this.musicLevel;	
		
		//Start Sound
		if (!ig.game.muteGame){	
			//this.startSound.volume = .15; this.startSound.play(); 
		}
		
	},

	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		//Set Global Pauses
		if (this.quiz || this.transition || this.titleScreen || this.deathScreen || this.levelCleared || this.endingScreen){
			ig.game.pause = true;
		}
		else{
			ig.game.pause = false;	
		}
		//Clear the Quiz
		if (this.quiz && this.correctionOn && this.questionClearTimer.delta() > 0 && ig.input.released('click')){
			if (!ig.game.wasItRight){
				this.punishPlayer();
			}
			this.clearTheQuestion();
		}
		//Clear the Death Screen
		if (this.deathScreen && this.deathScreenTimer.delta() > 0 && ig.input.released('click') && !ig.game.transition){
			ig.game.sortEntitiesDeferred();
			this.deathScreen = false;
			ig.game.pause = true;
			ig.game.fadeIn(0, this.colorWrong);	
		}
		//Clear the Cut Screen
		if (!this.endingScreen && !this.cutCleared && this.transitionReady && ig.input.released('click') && !ig.game.transition){
			ig.game.sortEntitiesDeferred();
			this.cutCleared = true;
			ig.game.slideRightOut("","",3);
		}
		//Clear the end screen
		if (this.endingScreen && !this.cutCleared && ig.game.flickerTotalCount >= this.maxFlickers && ig.input.released('click')  && this.transitionReady){
			ig.game.sortEntitiesDeferred();
			this.cutCleared = true;
			ig.game.fadeIn(0, this.colorRight);
		}
		
		var camSpeed = 2.5;
		var margin = camSpeed * 3;
		
		if (this.screen.x < this.xCamera + margin){
			this.screen.x +=camSpeed;
		}
		if (this.screen.x > this.xCamera - margin){
			this.screen.x -=camSpeed;
		}
		if (this.screen.y < this.yCamera + margin){
			this.screen.y +=camSpeed;
		}
		if (this.screen.y > this.yCamera - margin){
			this.screen.y -=camSpeed;
		}
		if (this.announceCardDraw && this.flashMessageTimer.delta() > 0){
			this.announceCardDraw = false;
		}
		if (this.drawUnitStats && this.flashMessageTimer.delta() > 0 || this.drawUnitStats && ig.game.drawPlayCardDisplay){
			this.drawUnitStats = false;
		}
		//this.screen.x = this.xCamera;
        //this.screen.y = this.yCamera;
	},
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		//Draw Buttons on Mobile
		if( this.buttonSet && !this.quiz) {
        	this.buttonSet.draw(); 
		}

		//Draw Mute Button and HUD
		if (!this.quiz){
			this.drawMuteButton();
			this.drawHUD();
		}
		
		//Title
		if (this.titleScreen){
			this.drawTitleScreen();	
		}
		if (this.prepareDeck){
			this.drawPrepareDeckScreen();	
		}
		
		//Game Display HUD
		if (this.gameDisplay){
			this.drawGameDisplay();
		}
		if (this.drawPlayCardDisplay){
			this.drawThePlayCardDisplay();
		}
		if (this.drawPlayingCardDisplay){		
			this.drawThePlayingCardDisplay();
		}
		if (this.announceCardDraw){
			this.drawCardAnnoucement();
		}
		if (this.drawUnitStats){
			this.drawTheUnitStats();
		}
		//Transition ETC.
		if (this.transition){
			this.drawTransition();
		}
		
		if (ig.game.userAccountNumber){
			var ctx = ig.system.context;
			this.dFonts.changeFont(ctx, 1);
			var myTxt = "PLAYER: " + ig.game.userAccountNumber;
			var myTxtWidth = ctx.measureText(myTxt).width;
			var myTxtX = ig.system.width - myTxtWidth;
			
			ctx.fillStyle = ig.game.gameDisplay ? '#ffffff' : this.color2;
			ctx.fillText(myTxt, ig.system.width - myTxtWidth - 10, 15);
		}
		
		//Flash Screen for various purposes
		this.flashScreenCheck();
		
	},
	LoadLevelBro: function(currentLvlNum){
		if (currentLvlNum <= this.totalLevels){
			ig.game.pause = true;
			//Get level string
			var whichLvl =  parseInt(currentLvlNum);
			//Turn string into object reference
			var lvlStr = eval("LevelL" + whichLvl);
			//Load the level
			ig.game.muteButtonAlive = false;
			this.loadLevel( lvlStr );
			this.readyToLoad = false;
			this.spawnButtons();
		}
		else{
			ig.game.pData.lvl = 1;
			this.saveGame();
			ig.game.muteButtonAlive = false;
			this.LoadLevelBro(1);	
			this.readyToLoad = false;
			this.spawnButtons();
		}
	},
	spawnButtons: function(){
		//Spawn mute button if not in worldmaker
		if( !ig.game.muteButtonAlive ) { 
			ig.game.spawnEntity( EntityMutebutton, 0, 0);	
		}
	},

	checkCameraBounds: function(){

		var cameraLeftBound =  this.xCamera - this.cameraBoundX;
		var cameraRightBound = this.xCamera + this.cameraBoundX;
		var cameraTopBound = this.yCamera - this.cameraBoundY;
		var cameraBottomBound = this.yCamera + this.cameraBoundY;
		var targetX = this.xSelectedPos - ig.system.width / 2;
		var targetY = this.ySelectedPos - ig.system.height / 2;

		if (targetX < cameraLeftBound || targetX > cameraRightBound ){	
			this.xCamera = this.xSelectedPos - ig.system.width /2;
		}
		
		if (targetY < cameraTopBound || targetY > cameraBottomBound ){	
			this.yCamera = this.ySelectedPos - ig.system.height /2;
		}		

	},

	
	//Use for calculating how many tokens player acquired in a level prior to dying.
	lastTokens: null,
	
	pData: {
		"gold": 1000,
		"food": 1000,
		"morale": 100,
		"divinity": 60,
		"actionPoints": 3,
		"citadelHealth": 100,
		"foodProduction": 100,
		"goldProduction": 100,
		"playingAgainst": "0x44f751ead3D88b04a57C298789FCC26632e8179b",
		"eCitadelHealth": 100,
		"eFoodProduction": 100,
		"eGoldProduction": 100,
		"turnNumber": 1,
		"lvl":1,

	},

	playMusicBro: function(which){

		if(which == 1){
			ig.game.musicLevel = .25;
			ig.music.play(01);	
		}
		else if(which == 2){
			ig.game.musicLevel = .25;
			ig.music.play(02);	
		}
		else if(which == 3){
			ig.game.musicLevel = .25;
			ig.music.play(03);	
		}
		else if(which == 4){
			ig.game.musicLevel = .25;
			ig.music.play(04);	
		}
	
		if (!ig.game.muteGame){
			ig.music.volume = ig.game.musicLevel;
		}
		else{
			ig.music.volume = 0;
		}
		
	},
	drawHUD: function(){
		var ctx = ig.system.context;
		//Token HUD
		this.goldHud.draw(20, 20);
		this.setFontSizeHUD();
		ig.system.context.fillStyle = '#ffffff';
		ctx.fillText(this.pData.gold, 20 + this.goldHud.width * 1.5, 20 + this.goldHud.height);
		
		this.foodHud.draw(20, 40);
		ctx.fillText(this.pData.food, 20 + this.foodHud.width * 1.5, 40 + this.foodHud.height);
		
		
		if (this.pData.morale >= 70){
			this.moraleHud1.draw(20, 60);
		}
		else if (this.pData.morale >= 40){
			this.moraleHud2.draw(20, 60);
		}
		else{
			this.moraleHud3.draw(20, 60);
		}
		ctx.fillText(this.pData.morale, 20 + this.moraleHud1.width * 1.5, 60 + this.moraleHud1.height);
		
		this.divinityHud.draw(20, 80);
		ctx.fillText(this.pData.divinity, 20 + this.divinityHud.width * 1.5, 80 + this.divinityHud.height);
		
	},
	setFontSizeHUD: function(){
		var ctx = ig.system.context;
		
		if ( ig.system.width <= 500){
			this.dFonts.setTxtSizeHUD(ctx, 1.2);
		}
		else{
			this.dFonts.setTxtSizeHUD(ctx, .75);
		}
	},
	playSwordSound: function(){
		if (!ig.game.muteGame){	
			this.drawSwordSound.volume = .4;
			this.drawSwordSound.play();
		}
	},
	playPickSound: function(){
		if (!ig.game.muteGame){	
			this.pickSound.volume = .1;
			this.pickSound.play();
		}
	},
	playUnpickSound: function(){
		if (!ig.game.muteGame){	
			this.unpickSound.volume = .1;
			this.unpickSound.play();
		}
	},
	setLineCPLColor: function(which){
		var ctx = ig.system.context;
		if (cardsInHand[which].classOf == "unit"){
			ctx.fillStyle = "#C72C27";
		}
		else if (cardsInHand[which].classOf == "character"){
			if (this.militaryUnitPlayed){
				ctx.fillStyle = "#DAA520";
			}
			else{
				ctx.fillStyle = "#CCCCCC";
			}
			ctx.fillStyle = "#FFFFFF";
		}
	},
	discardCardFromHand: function(){
		var found = false;
		var cName = ig.game.curCardToPlay.name;
		console.log('cName ' + cName)
		for (let i = 0; i < cardsInHand.length && !found; i++) {
			if (cardsInHand[i].name == cName) {
				console.log('removing ' + cardsInHand[i].name + ' from hand');
				cardsInHand.splice(i,1);
				found = true;
			}
		}
	},
	attachCardHere: function(muID){
		this.CCIDCounter++;
		ig.game.curCardToPlay.characterID = this.CCIDCounter;
		ig.game.curCardToPlay.attachedTo = muID;
		charactersOnBoard.push(ig.game.curCardToPlay);
		this.pData.actionPoints--;
		this.discardCardFromHand();
		ig.game.playingCardStep = 0;
	},
	playCardHere: function(x, y, sX, sY, sqName){		
		this.militaryUnitPlayed = true;
		this.MUIDCounter++;
		ig.game.curCardToPlay.unitID = this.MUIDCounter;
		unitsOnBoard.push(ig.game.curCardToPlay);
		ig.game.spawnEntity( EntityMilitaryunit, x, y, {myX: sX, myY: sY, myTileName: sqName, muName:ig.game.curCardToPlay.name, cardData: ig.game.curCardToPlay, muID: ig.game.curCardToPlay.unitID});
		//ig.game.spawnEntity( EntityMilitaryunit, x, y);
		ig.game.playingCardStep = 0;
		ig.game.drawPlayingCardDisplay = false;
		this.pData.actionPoints--;
		this.discardCardFromHand();
	},
	openMenuForMU(muID){
		if (!ig.game.playingCardStep){
			var unit = unitsOnBoard.find(element => element.unitID == muID);
			console.log('Open menu for ' + unit.name + " but it's not built yet... :()");
		}
	},
	flashMUstats: function(name, data){
		this.unitDataToDraw = data;
		this.unitNameToDraw = name;
		this.drawUnitStats = true;
		this.flashMessageTimer.set(7);
	},
	drawTheUnitStats: function(){
		var ctx = ig.system.context;
		this.dFonts.changeFont(ctx, 2);
		ctx.fillStyle = "#FFFFFF";
		ctx.fillText(this.unitNameToDraw,  30, 150);
		this.dFonts.changeFont(ctx, 1);
		ctx.fillStyle = "#87CEEB";
		ctx.fillText("Troop Count: " + this.unitDataToDraw.troopCount,  30, 175);
		ctx.fillText("Attack: " + this.unitDataToDraw.attack,  30, 195);
		ctx.fillText("Defend: " + this.unitDataToDraw.defend,  30, 215);
		ctx.fillText("Speed: " + this.unitDataToDraw.speed,  30, 235);
		ctx.fillText("Movement: " + this.unitDataToDraw.movement,  30, 255);
		ctx.fillText("Desert: " + this.unitDataToDraw.desert + "%",  30, 275);
		ctx.fillText("Field: " + this.unitDataToDraw.field + "%",  30, 295);
		ctx.fillText("Marsh: " + this.unitDataToDraw.marsh + "%",  30, 315);
		ctx.fillText("Mountain: " + this.unitDataToDraw.mountain + "%",  30, 335);
		ctx.fillText("Waters: " + this.unitDataToDraw.waters + "%",  30, 355);
	},
	drawCardAnnoucement: function(){
		var ctx = ig.system.context;
		this.dFonts.changeFont(ctx, 2);
		ctx.fillStyle = "#C72C27";
		ctx.fillText("You just drew your " + this.drewCardNamed + " card.",  30, 110);
	},
	drawThePlayingCardDisplay: function(){
		var ctx = ig.system.context;
		if (ig.game.playingCardStep == 1){
			this.dFonts.changeFont(ctx, 2);
			ctx.fillStyle = "#C72C27";
			ctx.fillText("Now Playing " + ig.game.curCardToPlay.name, this.cardPickerX + 10, ig.system.height - 75);
			if (ig.game.curCardToPlay.classOf == "character"){
				ctx.fillText("Choose a military unit to attach " + ig.game.curCardToPlay.name + ".", this.cardPickerX + 10, ig.system.height - 50);
			}
			else{
				ctx.fillText("Choose a square to play " + ig.game.curCardToPlay.name + ".", this.cardPickerX + 10, ig.system.height - 50);
			}
		}
		else if (ig.game.playingCardStep == 2){
			this.dFonts.changeFont(ctx, 2);
			ctx.fillStyle = "#C72C27";
			ctx.fillText("Are you sure you want to play " + ig.game.curCardToPlay.name + " here?", this.cardPickerX + 10, this.cardPickerY + 50);
			//ctx.fillText("Choose a square to play " + ig.game.curCardToPlay.name, this.cardPickerX + 10, this.cardPickerY + 100);
		}

	},
	colorTiles: function(which){
		if (which == 2){
			var t1 = ig.game.getEntityByName('x4y12');
			var t2 = ig.game.getEntityByName('x5y12');
			var t3 = ig.game.getEntityByName('x5y13');
			var t4 = ig.game.getEntityByName('x6y13');
			var t5 = ig.game.getEntityByName('x6y12');
			var t6 = ig.game.getEntityByName('x7y12');
			var t7 = ig.game.getEntityByName('x3y12');
			var t8 = ig.game.getEntityByName('x8y12');
			
			t1.validLoc = false;
			t2.validLoc = false;
			t3.validLoc = false;
			t4.validLoc = false;
			t5.validLoc = false;
			t6.validLoc = false;
			t7.validLoc = false;
			t8.validLoc = false;
		}
		else if (ig.game.curCardToPlay.classOf == "unit"){
			var t1 = ig.game.getEntityByName('x4y12');
			var t2 = ig.game.getEntityByName('x5y12');
			var t3 = ig.game.getEntityByName('x5y13');
			var t4 = ig.game.getEntityByName('x6y13');
			var t5 = ig.game.getEntityByName('x6y12');
			var t6 = ig.game.getEntityByName('x7y12');
			var t7 = ig.game.getEntityByName('x3y12');
			var t8 = ig.game.getEntityByName('x8y12');
			
			t1.validLoc = true;
			t2.validLoc = true;
			t3.validLoc = true;
			t4.validLoc = true;
			t5.validLoc = true;
			t6.validLoc = true;
			t7.validLoc = true;
			t8.validLoc = true;
		}
		else if (ig.game.curCardToPlay.classOf == "character"){
			ig.game.selectMilitaryUnit = true;
		}
		
	},

	drawThePlayCardDisplay: function(){
		var ctx = ig.system.context;
		this.cardPickerWidth = 300;
		this.cardPickerX = 20;
		this.cardPickerY = 140;
		this.cardPickerHeight = 300;
		
		var storeOpacity = ctx.globalAlpha;
		ctx.globalAlpha = .6;
		this.drawABox(this.cardPickerX, this.cardPickerX + this.cardPickerWidth, this.cardPickerY, this.cardPickerY + this.cardPickerHeight, 3, this.color3, true, this.color2);
		ctx.globalAlpha = storeOpacity;
		
		//No name property
		ig.game.card1 = cardsInHand[0] ? cardsInHand[0].name : "";
		ig.game.card2 = cardsInHand[1] ? cardsInHand[1].name : "";
		ig.game.card3 = cardsInHand[2] ? cardsInHand[2].name : "";
		ig.game.card4 = cardsInHand[3] ? cardsInHand[3].name : "";
		ig.game.card5 = cardsInHand[4] ? cardsInHand[4].name : "";
		ig.game.card6 = cardsInHand[5] ? cardsInHand[5].name : "";
		ig.game.card7 = cardsInHand[6] ? cardsInHand[6].name : "";
		ig.game.card8 = cardsInHand[7] ? cardsInHand[7].name : "";
		ig.game.card9 = cardsInHand[8] ? cardsInHand[8].name : "";
		ig.game.card10 = cardsInHand[9] ? cardsInHand[9].name : "";
		ig.game.card11 = cardsInHand[10] ? cardsInHand[10].name : "";
		
		
		this.dFonts.changeFont(ctx, 2);
		ctx.fillStyle = "#FFFFFF";
		
		if (ig.game.card1){
			ctx.fillStyle = cardsInHand[0].classOf == "unit" ? ctx.fillStyle = "#87CEEB" : ctx.fillStyle = "#FFFFFF";
			this.setLineCPLColor(0);
			ctx.fillText(ig.game.card1, this.cardPickerX + 10, this.cardPickerY + 25);
		}
		if (ig.game.card2){
			this.setLineCPLColor(1);
			ctx.fillText(ig.game.card2, this.cardPickerX + 10, this.cardPickerY + 50);
		}
		if (ig.game.card3){
			this.setLineCPLColor(2);
			ctx.fillText(ig.game.card3, this.cardPickerX + 10, this.cardPickerY + 75);
		}
		if (ig.game.card4){
			this.setLineCPLColor(3);
			ctx.fillText(ig.game.card4, this.cardPickerX + 10, this.cardPickerY + 100);
		}
		if (ig.game.card5){
			this.setLineCPLColor(4);
			ctx.fillText(ig.game.card5, this.cardPickerX + 10, this.cardPickerY + 125);
		}
		if (ig.game.card6){
			this.setLineCPLColor(5);
			ctx.fillText(ig.game.card6, this.cardPickerX + 10, this.cardPickerY + 150);
		}
		if (ig.game.card7){
			this.setLineCPLColor(6);
			ctx.fillText(ig.game.card7, this.cardPickerX + 10, this.cardPickerY + 175);
		}
		if (ig.game.card8){
			this.setLineCPLColor(7);
			ctx.fillText(ig.game.card8, this.cardPickerX + 10, this.cardPickerY + 200);
		}
		if (ig.game.card9){
			this.setLineCPLColor(8);
			ctx.fillText(ig.game.card9, this.cardPickerX + 10, this.cardPickerY + 225);
		}
		if (ig.game.card10){
			this.setLineCPLColor(9);
			ctx.fillText(ig.game.card10, this.cardPickerX + 10, this.cardPickerY + 250);
		}
		if (ig.game.card11){
			this.setLineCPLColor(10);
			ctx.fillText(ig.game.card11, this.cardPickerX + 10, this.cardPickerY + 275);
		}
		
	},
	drawGameDisplay: function(){
		var ctx = ig.system.context;
		this.dFonts.changeFont(ctx, 1);
		var myTxt = "ACTION POINTS: " + this.pData.actionPoints;
		var myTxtWidth = ctx.measureText(myTxt).width;
		var myTxtX = ig.system.width - myTxtWidth;
			
		ctx.fillStyle = "#87CEEB";
		ctx.fillText(myTxt, ig.system.width - myTxtWidth - 10, 30);
		ctx.fillStyle = "#FFFFFF";
		myTxt = "CITADEL HEALTH: " + this.pData.citadelHealth;
		myTxtWidth = ctx.measureText(myTxt).width;
		myTxtX = ig.system.width - myTxtWidth;
		
		ctx.fillText(myTxt, ig.system.width - myTxtWidth - 10, 50);
		
		myTxt = "GOLD PRODUCTION: " + this.pData.goldProduction;
		myTxtWidth = ctx.measureText(myTxt).width;
		myTxtX = ig.system.width - myTxtWidth;
		
		ctx.fillText(myTxt, ig.system.width - myTxtWidth - 10, 70);
		
		myTxt = "FOOD PRODUCTION: " + this.pData.foodProduction;
		myTxtWidth = ctx.measureText(myTxt).width;
		myTxtX = ig.system.width - myTxtWidth;
		
		ctx.fillText(myTxt, ig.system.width - myTxtWidth - 10, 90);
		
		myTxt = "CARDS IN DECK: " + selectedCards.length;
		myTxtWidth = ctx.measureText(myTxt).width;
		myTxtX = ig.system.width - myTxtWidth;
		
		ctx.fillText(myTxt, ig.system.width - myTxtWidth - 10, 110);
		selectedCards.length
		
		this.playCardButtonWidth = 112;
		this.playCardButtonX = ig.system.width - this.playCardButtonWidth - 10;
		this.playCardButtonY = 130;
		this.playCardButtonHeight = 50;
		
		this.drawCardButtonWidth = 112;
		this.drawCardButtonX = ig.system.width - this.drawCardButtonWidth - 10;
		this.drawCardButtonY = 200;
		this.drawCardButtonHeight = 50;
		
		this.drawPlayCardButton();
		this.drawDrawCardButton();
		
		this.dFonts.changeFont(ctx, 1);
		ctx.fillStyle = this.color1;
		
		myTxt = "ENEMY: " + this.pData.playingAgainst;
		myTxtWidth = ctx.measureText(myTxt).width;
		myTxtX = ig.system.width - myTxtWidth;
		
		ctx.fillText(myTxt, ig.system.width - myTxtWidth - 10, 290);
		
		myTxt = "ENEMY CITADEL HEALTH: " + this.pData.eCitadelHealth;
		myTxtWidth = ctx.measureText(myTxt).width;
		myTxtX = ig.system.width - myTxtWidth;
		
		ctx.fillText(myTxt, ig.system.width - myTxtWidth - 10, 310);
		
		myTxt = "ENEMY FOOD PRODUCTION: " + this.pData.eFoodProduction;
		myTxtWidth = ctx.measureText(myTxt).width;
		myTxtX = ig.system.width - myTxtWidth;
		
		ctx.fillText(myTxt, ig.system.width - myTxtWidth - 10, 330);
		
		myTxt = "ENEMY GOLD PRODUCTION: " + this.pData.eGoldProduction;
		myTxtWidth = ctx.measureText(myTxt).width;
		myTxtX = ig.system.width - myTxtWidth;
		ctx.fillText(myTxt, ig.system.width - myTxtWidth - 10, 350);
		
		this.dFonts.changeFont(ctx, 2);
		ctx.fillStyle = "#C72C27";
		myTxt = "Turn #" + this.pData.turnNumber;
		ctx.fillText(myTxt, 150, 50);
		
		var tleft = ig.game.timeLeftInTurn.delta() * -1;
		myTxt = "Time Left: " + tleft.toFixed(2);
		ctx.fillText(myTxt, 250, 50);
		
		
	},
	drawPlayCardButton(){
		var ctx = ig.system.context;
		this.drawABox(this.playCardButtonX, this.playCardButtonX + this.playCardButtonWidth, this.playCardButtonY, this.playCardButtonY + this.playCardButtonHeight, 3, this.color3, true, this.color2);
		this.dFonts.changeFont(ctx, 2);
		ctx.fillStyle = this.color1;
		ctx.fillText("Play Card", this.playCardButtonX + 5, this.playCardButtonY + this.playCardButtonHeight / 2 + 5);
	},
	drawDrawCardButton(){
		var ctx = ig.system.context;
		this.drawABox(this.drawCardButtonX, this.drawCardButtonX + this.drawCardButtonWidth, this.drawCardButtonY, this.drawCardButtonY + this.drawCardButtonHeight, 3, this.color3, true, this.color2);
		this.dFonts.changeFont(ctx, 2);
		ctx.fillStyle = this.color1;
		ctx.fillText("Draw Card", this.drawCardButtonX + 5, this.drawCardButtonY + this.drawCardButtonHeight / 2 + 5);
	},

	calculateStatLines: function(){
		var statLines = 0;
		//Display tokens?
		statLines++;
		//Display levels?
		statLines++;
		//Display deaths?
		//statLines++;
		//Question Right?
		statLines++;
		//Question Wrong?
		statLines++;
		//Times Passed?
		if (ig.game.pData.timesPassed){
			statLines++;
		}
		return statLines;
	},
	drawABox: function(lx, rx, ty, by, lineWidth, lineColor, fill, fillcolor){
		var ctx = ig.system.context;
		ctx.beginPath();	
		
		ctx.moveTo(lx, ty);
		ctx.lineTo(rx, ty);
		ctx.lineTo(rx, by);
		ctx.lineTo(lx, by);
		ctx.lineTo(lx, ty);
		
		ctx.closePath();
		
		if(lineWidth){
			ctx.lineWidth = lineWidth;
		}
		if (lineColor){
			ctx.strokeStyle = lineColor;
		}
		
		ctx.stroke();
		
		if (fillcolor){
			ig.system.context.fillStyle = fillcolor;
		}
		if (fill == true){
			ctx.fill();	
		}
	},
	drawTitleScreen: function(){
		var ctx = ig.system.context;
		this.drawABox(0, ig.system.width, 0, ig.system.height, 0, this.color1, true, this.color1);
		
		//Draw Title Text Image
		var logoWidth = ig.system.width * .8;
		var logoMargin = ig.system.width * .1;
		var logoHeight = logoWidth / 10;
				
		//Draw Title Image Image
		var imageWidth = ig.system.height * .4;
		var imageHeight = imageWidth;
		var imageX = ig.system.width / 2 - (imageWidth / 2);
		var imageY = ig.system.height * .35;

		var butWidth = 0;
		var butHeight = 0;
		
		var imageY = ig.system.height * .025;
		var buffer = ig.system.height * .025;
		//Portrait
		if (ig.system.height > ig.system.width){
			
			imageY = ig.system.height * .05;
			
			logoWidth = ig.system.width * .7; 
			logoHeight = logoWidth;
			
			butWidth = ig.system.width * .425;
			butHeight = butWidth / 4;
			
			this.ngbX = (ig.system.width / 2) - (butWidth / 1.75);
			this.ngbY = imageY + logoHeight + buffer; // add another imageY as a buffer.
			
			this.ctbX = this.ngbX;
			
			if (ig.system.height > ig.system.width * 1.75){
				this.ctbY = this.ngbY + butHeight + (buffer * 4)
			}
			else{	
				this.ctbY = this.ngbY + butHeight + (buffer * 2);
			}
		}
		//Landscape
		else{
			
			logoWidth = ig.system.height * .7; 
			logoHeight = logoWidth;
			
			butWidth = ig.system.height * .45;
			butHeight = butWidth / 4;
			//We have a continue button because a save file exists
			if (butWidth){
				this.ctbX = (ig.system.width / 2) - (butWidth + buffer );
				this.ngbY = buffer + logoHeight + buffer; 
				
				this.ngbX = (ig.system.width / 2) + buffer * 3;
				//If there is a saved game, we are only drawing one button, so center this one.
				if (!this.savedGame ){	
					if (ig.system.width < this.logoWidthThresh){
						this.ngbX =  (ig.system.width / 2) - (butWidth / 1.75);
					}
					else{
						this.ngbX =  (ig.system.width / 2) - (butWidth / 2.1);
					}
				}
				
				this.ctbY = this.ngbY
			}
			//No save file exists. Start a new game.			
			else{
				this.ngbX = (ig.system.width / 2) - (butWidth / 2);
				this.ngbY = buffer + logoHeight + buffer; 
			
				this.ctbX = this.ngbX;
				this.ctbY = this.ctbY
			}
		}
		
		this.tsButtonWidth = butWidth;
		this.tsButtonHeight = butHeight;
		
		imageX = (ig.system.width / 2) - (logoWidth / 2);
		
		ctx.drawImage(this.tsImage, imageX, imageY, logoWidth, logoHeight );
		ctx.drawImage(this.newGameButton, this.ngbX, this.ngbY, butWidth, butHeight );
		if (this.savedGame ){	
			ctx.drawImage(this.continueButton, this.ctbX, this.ctbY, butWidth, butHeight );
		}
		
		
		//this.dFonts.changeFont(ctx, 5);
		ctx.fillStyle = this.color2;

		/*var txt =  'Click Anywhere to Start';
		var xPos = logoMargin * 1.2;
		var yPos = imageY + imageHeight * 1.25;
		//this.dFonts.wrapTheText(ctx, txt,  ig.system.width * .1, ig.system.width * .8, ig.system.width * .5, this.vmin * 6);
		this.dFonts.wrapTheText(ctx, txt, xPos, yPos, ig.system.width - (xPos * 2) , this.dFonts.vmin * 6);*/
		
	},
	drawPrepareDeckScreen: function(){
		var ctx = ig.system.context;
		this.drawABox(0, ig.system.width, 0, ig.system.height, 0, this.color1, true, this.color1);
		
		var imageWidth = ig.system.width * .3;
		var imageHeight = imageWidth;
		var imageX = ig.system.width - (imageWidth * 1.1);
		var imageY = ig.system.height - (imageHeight * 1.1);
		
		ctx.drawImage(this.dsImage, imageX, imageY, imageWidth, imageHeight );
		
		
		//Headline
		var header = "Prepare Your Deck";
		this.dFonts.changeFont(ctx, 5);
		
			
		ctx.fillStyle = this.color2;
		//Write the headline
		this.dFonts.wrapTheText(ctx, header, 10, this.dFonts.style5LineHeight + 20, ig.system.width - 20, this.dFonts.style5LineHeight);
		
		//Outline for Your Cards Button
		var myStoreCursorY = this.dFonts.cursorPosYNewLine;
		ig.game.cdYourCardsButtonX = 10;
		ig.game.cdYourCardsButtonWidth = 120;
		ig.game.cdYourCardsButtonY = myStoreCursorY - 10;
		ig.game.cdYourCardsButtonBottom =  ig.game.cdYourCardsButtonY + ig.system.height * .09;
		ig.game.cdYCDButtonHeight = ig.system.height * .09;
		
		var tab1Color = this.color3;
		var tab1OutlineColor = this.color2;
		
		if (this.prepareDeckMenu == 2){
			ctx.fillStyle = this.color2;
		}
		else{
			tab1Color = this.color2;
			tab1OutlineColor = this.color3;
			ctx.fillStyle = this.color3;
		}
		
		this.drawABox(ig.game.cdYourCardsButtonX,  ig.game.cdYourCardsButtonWidth, ig.game.cdYourCardsButtonY , ig.game.cdYourCardsButtonBottom, 3, tab1OutlineColor, true, tab1Color);
		
		//Your Cards Button
		var header = "Your Cards";
		this.dFonts.changeFont(ctx, 2);
		
		ctx.fillStyle = tab1OutlineColor;
		
		//Write the headline
		this.dFonts.wrapTheText(ctx, header, 20, myStoreCursorY+ 10, ig.system.width - 20, this.dFonts.style2LineHeight);
		var cursorY = this.dFonts.cursorPosY + 20;
		
		//Outline for Your Deck Button
		ig.game.cdYourDeckButtonX = ig.game.cdYourCardsButtonX + ig.game.cdYourCardsButtonWidth + 6;
		ig.game.cdYourDeckButtonWidth = 120;
		ig.game.cdYourDeckButtonY = ig.game.cdYourCardsButtonY;
		ig.game.cdYourDeckButtonHeight =  ig.game.cdYourCardsButtonBottom;
		
		var tab2Color = this.color3;
		var tab2OutlineColor = this.color2;
		
		if (this.prepareDeckMenu == 1){
			ctx.fillStyle = this.color2;
		}
		else{
			tab2Color = this.color2;
			tab2OutlineColor = this.color3
			ctx.fillStyle = this.color2;
		}
		
		this.drawABox(ig.game.cdYourDeckButtonX, ig.game.cdYourDeckButtonX + ig.game.cdYourDeckButtonWidth, ig.game.cdYourDeckButtonY , ig.game.cdYourDeckButtonHeight, 3, tab2OutlineColor, true, tab2Color);
		var header = "Your Deck";
		
		
		
		
		ctx.fillStyle = tab2OutlineColor;
		this.dFonts.wrapTheText(ctx, header, ig.game.cdYourDeckButtonX + 10, myStoreCursorY + 10, ig.system.width - 20, this.dFonts.style2LineHeight);
		//Draw Card Box
		ctx.fillStyle = this.color2;

		var boxTopY = cursorY;
		var menuBoxWidth = ig.system.width * .5;
		this.drawABox(10, menuBoxWidth, boxTopY, ig.system.height *.9, 0, this.color2, true, this.color2);
		this.drawABox(20, menuBoxWidth - 10, boxTopY + 10, ig.system.height *.9 - 10, 0, this.color3, true, this.color3);
		var boxSpaceX = (ig.system.width * .5 - 30);
		var boxSpaceY = (ig.system.height *.9) - (cursorY + 20);
		var lines = 8;
		ig.game.cdLineWidth = boxSpaceX;
		ig.game.cdLineHeight = boxSpaceY / lines;
		ig.game.slot1y = boxTopY + 30;
		ig.game.slot2y = boxTopY + 30 + ig.game.cdLineHeight * 1;
		ig.game.slot3y = boxTopY + 30 + ig.game.cdLineHeight * 2;
		ig.game.slot4y = boxTopY + 30 + ig.game.cdLineHeight * 3;
		ig.game.slot5y = boxTopY + 30 + ig.game.cdLineHeight * 4;
		ig.game.slot6y = boxTopY + 30 + ig.game.cdLineHeight * 5;
		ig.game.slot7y = boxTopY + 30 + ig.game.cdLineHeight * 6;
		ig.game.slot8y = boxTopY + 30 + ig.game.cdLineHeight * 7;
		//this.dFonts.changeFont(ctx, 1);
		
		//Menu Up and Down buttons
		ig.game.menuButWidth = boxSpaceY * .33;
		ig.game.menuButHeight = ig.game.menuButWidth;
		ig.game.menuButX = menuBoxWidth + 20;
		ig.game.menuButUpY = boxTopY;
		ig.game.menuButDownY = boxTopY + boxSpaceY - ig.game.menuButHeight;
		
		
		
		
		
		ig.game.maxNFTNames = 0;
		ig.game.maxSelectedCards = 0;
		if (myNFTNames.length){
			ig.game.maxNFTNames = myNFTNames.length;
		}
		if (selectedCards.length){
			ig.game.maxSelectedCards = selectedCards.length;
		}
		
		//Draw Up or Down Button and Disabled if List Ended;		
		var bottomOfList = ig.game.maxNFTNames - 7;
		if (ig.game.prepareDeckMenu == 2){
			bottomOfList = ig.game.maxSelectedCards - 7;
		}
		
		if (ig.game.cardSelectionIndex > 0){				
			ctx.drawImage(this.menuUpBut, ig.game.menuButX, ig.game.menuButUpY, ig.game.menuButWidth, ig.game.menuButHeight );
		}
		else if (ig.game.maxNFTNames  > 8 && ig.game.prepareDeckMenu == 1 || ig.game.maxSelectedCards > 8 && ig.game.prepareDeckMenu == 2){
			ctx.drawImage(this.menuUpButDisabled, ig.game.menuButX, ig.game.menuButUpY, ig.game.menuButWidth, ig.game.menuButHeight );
		}
		if (ig.game.cardSelectionIndex < bottomOfList){
			ctx.drawImage(this.menuDownBut, ig.game.menuButX, ig.game.menuButDownY, ig.game.menuButWidth, ig.game.menuButHeight );
		}
		else if (ig.game.maxNFTNames > 8 && ig.game.prepareDeckMenu == 1 || ig.game.maxSelectedCards > 8 && ig.game.prepareDeckMenu == 2){
			ctx.drawImage(this.menuDownButDisabled, ig.game.menuButX, ig.game.menuButDownY, ig.game.menuButWidth, ig.game.menuButHeight );
		}
		
		ig.game.cdS1 = ig.game.cardSelectionIndex;
		ig.game.cdS2 = ig.game.cardSelectionIndex + 1;
		ig.game.cdS3 = ig.game.cardSelectionIndex + 2;
		ig.game.cdS4 = ig.game.cardSelectionIndex + 3;
		ig.game.cdS5 = ig.game.cardSelectionIndex + 4;
		ig.game.cdS6 = ig.game.cardSelectionIndex + 5;
		ig.game.cdS7 = ig.game.cardSelectionIndex + 6;
		ig.game.cdS8 = ig.game.cardSelectionIndex + 7;
		
		ig.game.cdLineX = 30;
		
		if (this.prepareDeckMenu == 1){
			
			var cardName1 = myNFTNames[ig.game.cdS1] ? myNFTNames[ig.game.cdS1].name : ig.game.deckLoadingMessage1;
			var cardName2 = myNFTNames[ig.game.cdS2] ? myNFTNames[ig.game.cdS2].name : ig.game.deckLoadingMessage2;
			var cardName3 = myNFTNames[ig.game.cdS3] ? myNFTNames[ig.game.cdS3].name : ig.game.deckLoadingMessage3;
			var cardName4 = myNFTNames[ig.game.cdS4] ? myNFTNames[ig.game.cdS4].name : ig.game.deckLoadingMessage4;
			var cardName5 = myNFTNames[ig.game.cdS5] ? myNFTNames[ig.game.cdS5].name : "";
			var cardName6 = myNFTNames[ig.game.cdS6] ? myNFTNames[ig.game.cdS6].name : "";
			var cardName7 = myNFTNames[ig.game.cdS7] ? myNFTNames[ig.game.cdS7].name : "";
			var cardName8 = myNFTNames[ig.game.cdS8] ? myNFTNames[ig.game.cdS8].name : "";
		
			
		
		
			ctx.fillStyle = myNFTNames[ig.game.cdS1] && myNFTNames[ig.game.cdS1].selected ? this.color4 : this.color2;
			this.dFonts.wrapTheText(ctx, cardName1, ig.game.cdLineX , ig.game.slot1y, boxSpaceX, this.dFonts.style2LineHeight);
			ctx.fillStyle = myNFTNames[ig.game.cdS2] && myNFTNames[ig.game.cdS2].selected ? this.color4 : this.color2;
			this.dFonts.wrapTheText(ctx, cardName2, ig.game.cdLineX , ig.game.slot2y, boxSpaceX, this.dFonts.style2LineHeight);
			ctx.fillStyle = myNFTNames[ig.game.cdS3] && myNFTNames[ig.game.cdS3].selected ? this.color4 : this.color2;
			this.dFonts.wrapTheText(ctx, cardName3, ig.game.cdLineX , ig.game.slot3y, boxSpaceX, this.dFonts.style2LineHeight);
			ctx.fillStyle = myNFTNames[ig.game.cdS4] && myNFTNames[ig.game.cdS4].selected ? this.color4 : this.color2;
			this.dFonts.wrapTheText(ctx, cardName4, ig.game.cdLineX , ig.game.slot4y, boxSpaceX, this.dFonts.style2LineHeight);
			ctx.fillStyle = myNFTNames[ig.game.cdS5] && myNFTNames[ig.game.cdS5].selected ? this.color4 : this.color2;
			this.dFonts.wrapTheText(ctx, cardName5, ig.game.cdLineX , ig.game.slot5y, boxSpaceX, this.dFonts.style2LineHeight);
			ctx.fillStyle = myNFTNames[ig.game.cdS6] && myNFTNames[ig.game.cdS6].selected ? this.color4 : this.color2;
			this.dFonts.wrapTheText(ctx, cardName6, ig.game.cdLineX , ig.game.slot6y, boxSpaceX, this.dFonts.style2LineHeight);
			ctx.fillStyle = myNFTNames[ig.game.cdS7] && myNFTNames[ig.game.cdS7].selected ? this.color4 : this.color2;
			this.dFonts.wrapTheText(ctx, cardName7, ig.game.cdLineX , ig.game.slot7y, boxSpaceX, this.dFonts.style2LineHeight);
			ctx.fillStyle = myNFTNames[ig.game.cdS8] && myNFTNames[ig.game.cdS8].selected ? this.color4 : this.color2;
			this.dFonts.wrapTheText(ctx, cardName8, ig.game.cdLineX , ig.game.slot8y, boxSpaceX, this.dFonts.style2LineHeight);
		}
		else{
			var cardName1 = selectedCards[ig.game.cdS1] ? selectedCards[ig.game.cdS1].name : "No Cards Selected.";
			var cardName2 = selectedCards[ig.game.cdS2] ? selectedCards[ig.game.cdS2].name : "";
			var cardName3 = selectedCards[ig.game.cdS3] ? selectedCards[ig.game.cdS3].name : "";
			var cardName4 = selectedCards[ig.game.cdS4] ? selectedCards[ig.game.cdS4].name : "";
			var cardName5 = selectedCards[ig.game.cdS5] ? selectedCards[ig.game.cdS5].name : "";
			var cardName6 = selectedCards[ig.game.cdS6] ? selectedCards[ig.game.cdS6].name : "";
			var cardName7 = selectedCards[ig.game.cdS7] ? selectedCards[ig.game.cdS7].name : "";
			var cardName8 = selectedCards[ig.game.cdS8] ? selectedCards[ig.game.cdS8].name : "";
		
			ctx.fillStyle = this.color2;
			this.dFonts.wrapTheText(ctx, cardName1, ig.game.cdLineX , ig.game.slot1y, boxSpaceX, this.dFonts.style2LineHeight);
			this.dFonts.wrapTheText(ctx, cardName2, ig.game.cdLineX , ig.game.slot2y, boxSpaceX, this.dFonts.style2LineHeight);
			this.dFonts.wrapTheText(ctx, cardName3, ig.game.cdLineX , ig.game.slot3y, boxSpaceX, this.dFonts.style2LineHeight);
			this.dFonts.wrapTheText(ctx, cardName4, ig.game.cdLineX , ig.game.slot4y, boxSpaceX, this.dFonts.style2LineHeight);
			this.dFonts.wrapTheText(ctx, cardName5, ig.game.cdLineX , ig.game.slot5y, boxSpaceX, this.dFonts.style2LineHeight);
			this.dFonts.wrapTheText(ctx, cardName6, ig.game.cdLineX , ig.game.slot6y, boxSpaceX, this.dFonts.style2LineHeight);
			this.dFonts.wrapTheText(ctx, cardName7, ig.game.cdLineX , ig.game.slot7y, boxSpaceX, this.dFonts.style2LineHeight);
			this.dFonts.wrapTheText(ctx, cardName8, ig.game.cdLineX , ig.game.slot8y, boxSpaceX, this.dFonts.style2LineHeight);
		}
		
		if (ig.game.maxSelectedCards > 0){
			this.drawReadyForBattleButton();
		}
		this.startBattleButtonWidth = 100;
		this.startBattleButtonX = ig.system.width - this.startBattleButtonWidth - 10;
		this.startBattleButtonY = 86;
		this.startBattleButtonHeight = 50;
		
		var cardSelectionStatusLineX = this.startBattleButtonX + 5;
		var cardSelectionStatusLineY = this.startBattleButtonY + this.startBattleButtonHeight + 15;
		this.dFonts.changeFont(ctx, 1);
		ctx.fillStyle = this.color2;
		var myCSTxt = ig.game.maxSelectedCards + " of " + this.maxCards + " cards selected."
		if (ig.game.maxSelectedCards < 1){
			myCSTxt = "";
		}
		ctx.fillText(myCSTxt, cardSelectionStatusLineX, cardSelectionStatusLineY);
		
		
		
	},
	announceDraw: function (cardName){
		this.flashMessageTimer.set(7);
		this.drewCardNamed = cardName;
		this.announceCardDraw = true;
	},
	drawReadyForBattleButton: function(){
		var ctx = ig.system.context;
		this.drawABox(this.startBattleButtonX, this.startBattleButtonX + this.startBattleButtonWidth, this.startBattleButtonY, this.startBattleButtonY + this.startBattleButtonHeight, 3, this.color3, true, this.color2);
		this.dFonts.changeFont(ctx, 2);
		ctx.fillStyle = this.color1;
		ctx.fillText("Start Battle", this.startBattleButtonX + 5, this.startBattleButtonY + this.startBattleButtonHeight / 2 + 5);
	},
	loadDeck: function(){

		selectedCards.length = 0;
		//myNFTNames.forEach(function(o){if (myNFTNames.selected == true) result.push(o);} );
		for (let i = 0; i < myNFTNames.length; i++) {
			if ( myNFTNames[i].selected){
				selectedCards.push(myNFTNames[i]);
			}
		}
		if (selectedCards.length > 0){
			console.log(selectedCards);
		}
		else{
			console.log('none selected');
		}
	},
	checkForMessages: function(){
		//Display a message if certain conditions apply
		if (ig.game.pData.lvl == 1){
			//ig.game.flashThisText(ig.game.flMsgStartingTheGame, this.flMsgTime, ig.game.color4, 3);	
		}
	},
	flashThisText: function(txt, dur, color, size){
		var ctx = ig.system.context;
		
		this.flashingMessage = true;
		
		color ? this.flashMsgColor = color : this.flashMsgColor = this.color6;
		size ? this.flashMsgSize = size : this.flashMsgSize = 3;
		txt ? this.flashingText = txt : this.flashingText = "You did not enter any text, Donzo.";
		dur ? this.flashingMessageTimer.set(dur) : this.flashingMessageTimer.set(3);
		
		this.flMsgDispSwitch = true;
		this.flashingMessageIntravelTimer.set(this.flMsgOnInt);
	},
	manageTransitionVariables: function(dir){
		//Figure out how to manage these better
		//Clear ending
		if (this.endingScreen && ig.game.endingOver){
			this.endingScreen = false;
			this.flickerTotalCount = 0;
			this.flickerCount = 0;
			this.flickerFreq = 1;
			ig.game.endingOver = false;
			ig.game.gameWon = false;
			this.levelCleared = false;
			console.log('this is getting called and flciker count resets');
		}
		//Player is dead.
		if (ig.game.playerDead && !this.managingPlayerDeath ){
			this.managePlayerDeath();
		}
		//Level Clear
		if (this.levelCleared){
			this.levelCleared = false;
		}
	},
	drawTransition: function(){
		var ctx = ig.system.context;
				
		//**************FadeIn*************
		if (this.transitionType == "fadeIn"){
			var curOpacity = 0;
			if (this.transitionTimer.delta() < 0){
				curOpacity = this.transitionTimer.delta() * -1;
			}
			//Prepare Transition for Clear
			if (this.transitionTimer.delta() > 0){
				this.transition = false;
				this.transitionReady = false;
				ig.game.pause = false;
				this.manageTransitionVariables();
			}
			ctx.globalAlpha = curOpacity;
			this.drawABox(0, ig.system.width, 0, ig.system.height, 0, this.slideColor, true, this.fadeColor);
		}
		//*************FadeOut*************
		if (this.transitionType == "fadeOut"){
			var curOpacity = 1;
			if (this.transitionTimer.delta() < 1){
				curOpacity = this.transitionTimer.delta();
			}
			//Level is Ready to Load
			if (this.transitionTimer.delta() > 1){
				this.readyToLoad = true;
				this.manageTransitionVariables();
			}
			//Prepare Transition for Clear
			if (this.transitionTimer.delta() > 2){
				this.transitionReady = true;
				this.transition = false;
			}
			ctx.globalAlpha = curOpacity;
			this.drawABox(0, ig.system.width, 0, ig.system.height, 0, this.slideColor, true, this.fadeColor);
		}
		//***************SlideDownIn*************
		if (this.transitionType == "slideDownIn"){
			
			this.slideAddToY = 0;
			if (this.transitionTimer.delta() < 0){
				this.slideAddToY = this.transitionTimer.delta()  *  ig.system.height;
			}
			//Level is Ready to Load
			if (this.transitionTimer.delta() > 0){
				this.readyToLoad = true;
				if (ig.Timer.timeScale != 1){
					ig.Timer.timeScale = 1;
				}
			}
			//Prepare Transition for Clear
			if (this.transitionTimer.delta() > 1){
				this.transitionReady = true;
			}
			
			//USE SLIDE ADD TO Y to ADD to SCORES OR OTHER TEXT ON DROPS DOWN
			this.drawABox(0, ig.system.width, 0, ig.system.height + this.slideAddToY, 0, this.slideColor, true, this.slideColor);
		}
		//***************SlideUpIn*************
		if (this.transitionType == "slideUpIn"){
			
			this.slideAddToY = 0;
			if (this.transitionTimer.delta() < 0){
				this.slideAddToY = (this.transitionTimer.delta() *-1)  *  ig.system.height;
			}
			//Level is Ready to Load
			if (this.transitionTimer.delta() > 0){
				this.readyToLoad = true;
				if (ig.Timer.timeScale != 1){
					ig.Timer.timeScale = 1;
				}
			}
			//Prepare Transition for Clear
			if (this.transitionTimer.delta() > 1){
				this.transitionReady = true;
			}
			console.log('this.slideAddToY = ' + this.slideAddToY);
			//USE SLIDE ADD TO Y to ADD to SCORES OR OTHER TEXT ON DROPS DOWN
			this.drawABox(0, ig.system.width, this.slideAddToY,  ig.system.height + this.slideAddToY ,0, this.slideColor, true, this.slideColor);
		}
		//***************SlideUpOut*************
		if (this.transitionType == "slideUpOut"){
			
			this.slideAddToY = ig.system.height;
			if (this.transitionTimer.delta() < 1){
				this.slideAddToY = this.transitionTimer.delta()  *  ig.system.height;
			}
			else if (this.transitionTimer.delta() < 0){
				this.slideAddToY = 0;
			}
			//Transition is Clear
			if (this.transitionTimer.delta() > 1){
				if (ig.Timer.timeScale != 1){
					ig.Timer.timeScale = 1;
				}
				this.transition = false;
				this.transitionReady = false;
				ig.game.pause = false;
				this.manageTransitionVariables();
			}

			//USE SLIDE ADD TO Y to ADD to SCORES OR OTHER TEXT ON DROPS DOWN
			this.drawABox(0, ig.system.width, 0, ig.system.height - this.slideAddToY, 0, this.slideColor, true, this.slideColor);
		}
		//***************SlideDownOut*************
		if (this.transitionType == "slideDownOut"){
			
			this.slideAddToY = ig.system.height;
			if (this.transitionTimer.delta() < 1){
				this.slideAddToY = (this.transitionTimer.delta())  *  ig.system.height;
			}
			else if (this.transitionTimer.delta() < 0){
				this.slideAddToY = ig.system.height;
			}
			//Transition is Clear
			if (this.transitionTimer.delta() > 1){
				if (ig.Timer.timeScale != 1){
					ig.Timer.timeScale = 1;
				}
				this.transition = false;
				this.transitionReady = false;
				ig.game.pause = false;
				this.manageTransitionVariables();
			}
			//USE SLIDE ADD TO Y to ADD to SCORES OR OTHER TEXT ON DROPS DOWN
			this.drawABox(0, ig.system.width, 0 + this.slideAddToY, ig.system.height, 0, this.slideColor, true, this.slideColor);
		}
		//***************SlideRightIn*************
		if (this.transitionType == "slideRightIn"){
			
			this.slideAddToX = 0;
			if (this.transitionTimer.delta() < 0){
				this.slideAddToX = this.transitionTimer.delta()  *  ig.system.width;
			}
			//Level is Ready to Load
			if (this.transitionTimer.delta() > 0){
				//Level is loaded from this transition
				this.readyToLoad = true;
				if (ig.Timer.timeScale != 1){
					ig.Timer.timeScale = 1;
				}
			}
			//Prepare Transition for Clear
			if (this.transitionTimer.delta() > 1){
				this.transitionReady = true;
			}
			
			//USE SLIDE ADD TO Y to ADD to SCORES OR OTHER TEXT ON DROPS DOWN
			this.drawABox(0, ig.system.width + this.slideAddToX, 0, ig.system.height, 0, this.slideColor, true, this.slideColor);
		}
		//***************SlideRightOut*************
		if (this.transitionType == "slideRightOut"){
			this.slideAddToX = ig.system.width;
			if (this.transitionTimer.delta() < 1){
				this.slideAddToX = (this.transitionTimer.delta())  *  ig.system.width;
			}
			else if (this.transitionTimer.delta() > 1){
				this.slideAddToX = ig.system.width;
			}
			//Transition is Clear
			if (this.transitionTimer.delta() > 1){
				if (ig.Timer.timeScale != 1){
					ig.Timer.timeScale = 1;
				}
				this.transition = false;
				this.transitionReady = false;
				ig.game.pause = false;
				this.manageTransitionVariables();
			}
			//USE SLIDE ADD TO Y to ADD to SCORES OR OTHER TEXT ON DROPS DOWN
			this.drawABox(0 + this.slideAddToX, ig.system.width, 0 , ig.system.height, 0, this.slideColor, true, this.slideColor);
		}
		
		//Restore Alpha
		ctx.globalAlpha = 1;	
	},
	fadeIn: function(delay, color){
		if (!delay){
			ig.game.transitionTimer.set(1);
		}
		else{
			ig.game.transitionTimer.set(delay);	
		}
		ig.game.transitionType = "fadeIn";
		ig.game.transition = true;
		if (color){
			ig.game.fadeColor = color;	
		}
		else{
			ig.game.fadeColor =  this.color3;	
		}
	},
	fadeOut: function(delay, color){
		if (!delay){
			ig.game.transitionTimer.set(0);
		}
		else{
			ig.game.transitionTimer.set(delay);	
		}

		ig.game.transitionType = "fadeOut";
		ig.game.transition = true;	
		
		if (color){
			ig.game.fadeColor = color;	
		}
		else{
			ig.game.fadeColor =  this.color3;	
		}
	},
	slideDownIn: function(delay, color, speed){
		if (!delay){
			ig.game.transitionTimer.set(1);
		}
		else{
			ig.game.transitionTimer.set(delay);	
		}
		if (color){
			this.slideColor = color;
		}
		else{
			this.slideColor = this.color3;
		}
		if (speed){
			if (ig.Timer.timeScale != speed){
				ig.Timer.timeScale = speed;
			}
		}
		else{
			if (ig.Timer.timeScale != 3){
				ig.Timer.timeScale = 3;
			}
		}
		
		ig.game.transitionType = "slideDownIn";
		ig.game.transition = true;

	},
	slideUpIn: function(delay, color, speed){
		if (!delay){
			ig.game.transitionTimer.set(1);
		}
		else{
			ig.game.transitionTimer.set(delay);	
		}
		if (color){
			this.slideColor = color;
		}
		else{
			this.slideColor = this.color3;
		}
		if (speed){
			if (ig.Timer.timeScale != speed){
				ig.Timer.timeScale = speed;
			}
		}
		else{
			if (ig.Timer.timeScale != 3){
				ig.Timer.timeScale = 3;
			}
		}
		ig.game.transitionType = "slideUpIn";
		ig.game.transition = true;
	},
	slideDownOut: function(delay, color, speed){
		if (!delay){
			ig.game.transitionTimer.set(1);
		}
		else{
			ig.game.transitionTimer.set(delay);	
		}
		if (color){
			this.slideColor = color;
		}
		else{
			this.slideColor = this.color3;
		}
		if (speed){
			if (ig.Timer.timeScale != speed){
				ig.Timer.timeScale = speed;
			}
		}
		else{
			if (ig.Timer.timeScale != 3){
				ig.Timer.timeScale = 3;
			}
		}
		ig.game.transitionType = "slideDownOut";
		ig.game.transition = true;
	},
	slideUpOut: function(delay, color, speed){
		if (!delay){
			ig.game.transitionTimer.set(0);
		}
		else{
			ig.game.transitionTimer.set(delay);	
		}
		if (color){
			this.slideColor = color;
		}
		else{
			this.slideColor = this.color3;
		}
		if (speed){
			if (ig.Timer.timeScale != speed){
				ig.Timer.timeScale = speed;
			}
		}
		else{
			if (ig.Timer.timeScale != 3){
				ig.Timer.timeScale = 3;
			}
		}
		ig.game.transitionType = "slideUpOut";
		ig.game.transition = true;
	},
	//slideRightIn
	slideRightIn: function(delay, color, speed){
		if (!delay){
			ig.game.transitionTimer.set(1);
		}
		else{
			ig.game.transitionTimer.set(delay);	
		}
		if (color){
			this.slideColor = color;
		}
		else{
			this.slideColor = this.color3;
		}
		if (speed){
			if (ig.Timer.timeScale != speed){
				ig.Timer.timeScale = speed;
			}
		}
		else{
			if (ig.Timer.timeScale != 3){
				ig.Timer.timeScale = 3;
			}
		}	
		ig.game.transitionType = "slideRightIn";
		ig.game.transition = true;
	},
	//slideRightOut
	slideRightOut: function(delay, color, speed){
		if (!delay){
			ig.game.transitionTimer.set(0);
		}
		else{
			ig.game.transitionTimer.set(delay);	
		}
		if (color){
			this.slideColor = color;
		}
		else{
			this.slideColor = this.color3;
		}
		if (speed){
			if (ig.Timer.timeScale != speed){
				ig.Timer.timeScale = speed;
			}
		}
		else{
			if (ig.Timer.timeScale != 3){
				ig.Timer.timeScale = 3;
			}
		}
		ig.game.transitionType = "slideRightOut";
		ig.game.transition = true;
	},
	setButtons: function(){
		//Buttons for Mobile
		 if( ig.ua.mobile ) {
			 
			var buttonSizeY = null;
			var buttonPosY = null;
			var butRightX = null;
			var buttonRight = null;
			
			//Wide Screen - Regular Buttons
			console.log("Calculating button size... window.innerWidth = " + window.innerWidth);
			console.log("Checking height ... window.innerHeight = " + window.innerHeight);
			if ( window.innerWidth >550){
				butRightX = ig.system.width - 106;
				buttonRight = ig.system.width;
				console.log('use large buttons');
				this.buttonSet = new ig.TouchButtonCollection([
					new ig.TouchButton( 'left', {left: 10, bottom: 10}, 96, 96, this.buttonLeft, 0 ),
					new ig.TouchButton( 'right', {left: 120, bottom: 10}, 96, 96, this.buttonRight, 0 ),
					new ig.TouchButton( 'jump', {left: butRightX, bottom: 10}, 96, 96, this.buttonJump, 0 ),
					new ig.TouchButton( 'action', {left: butRightX - 106, bottom: 10}, 96, 96, this.buttonA, 0 ),
				]);
			}
			//Small Size Buttons
			else if ( window.innerWidth >440){
				butRightX = ig.system.width - 90;
				buttonRight = ig.system.width;
				console.log('use small buttons');
				this.buttonSet = new ig.TouchButtonCollection([
					new ig.TouchButton( 'left', {left: 10, bottom: 10}, 80, 80, this.buttonLeftSmall, 0 ),
					new ig.TouchButton( 'right', {left: 100, bottom: 10}, 80, 80, this.buttonRightSmall, 0 ),
					new ig.TouchButton( 'jump', {left: butRightX, bottom: 10}, 80, 80, this.buttonJumpSmall, 0 ),
					new ig.TouchButton( 'action', {left: butRightX - 90, bottom: 10}, 80, 80, this.buttonASmall, 0 ),
				]);
			}
			//Smaller Size Buttons
			else{
				butRightX = ig.system.width - 70;
				buttonRight = ig.system.width;
				console.log('use smaller buttons');
				this.buttonSet = new ig.TouchButtonCollection([
					new ig.TouchButton( 'left', {left: 10, bottom: 10}, 60, 60, this.buttonLeftSmaller, 0 ),
					new ig.TouchButton( 'right', {left: 80, bottom: 10}, 60, 60, this.buttonRightSmaller, 0 ),
					new ig.TouchButton( 'jump', {left: butRightX, bottom: 10}, 60, 60, this.buttonJumpSmaller, 0 ),
					new ig.TouchButton( 'action', {left: butRightX - 70, bottom: 10}, 60, 60, this.buttonASmaller, 0 ),
				]);
			}

			this.buttonSet.align();
		}
	},
	drawMuteButton: function(){
		var bRight = ig.system.width - 84;
		var bTop = 10;
			
		if (this.muteGame){
			if ( window.scale < .7){
				bRight = ig.system.width - 52;
				this.buttonMuted.draw(bRight, bTop);		
			}
			else{
				this.buttonMutedSmall.draw(bRight, bTop);		
			}
		}
		else{
			if ( window.scale < .7){
				bRight = ig.system.width - 52;
				this.buttonMute.draw(bRight, bTop);	
			}
			else{
				this.buttonMuteSmall.draw(bRight, bTop);	
			}
		}
	},
	drawButtons: function(numOfButtons, columns){
		//Find how much space is left.
		var ySpaceRem =  ig.system.height - this.boardPosYData;
		//Determine how many rows we need
		var rows = Math.ceil(numOfButtons / columns);
		//Calculate Margins
		var yMargin = ig.system.height  * .025;
		var yMarginTotal = yMargin * (rows + 1);
		//Determine Row Height
		this.qbRowHeight = Math.floor((ySpaceRem - yMarginTotal) / rows);
		
		theWidth = ig.system.width;
		theHeight = ig.system.height;
		
		vMargin = (theHeight * .025);
		hMargin = (theWidth * .025);
		vFrame = (theHeight * .005);
		hFrame = (theWidth * .005);
		vFrame2 = (theHeight * .00525);
		hFrame2 = (theWidth * .0025);
		//One Column
		if (columns == 1){
			this.buttonWidth = this.boardWidth;
			this.buttonHeight = this.qbRowHeight;
			
			this.ac1X = this.boardPosX;
			this.ac1Y = this.boardPosYData + yMargin;
			
			this.ac2X = this.boardPosX;
			this.ac2Y = this.ac1Y  + (yMargin / 2) + this.qbRowHeight;
			
			if (numOfButtons > 2){
				this.ac3X = this.boardPosX;
				this.ac3Y = this.ac2Y  + (yMargin / 2) + this.qbRowHeight;
			}
			if (numOfButtons > 3){
				this.ac4X = this.boardPosX;
				this.ac4Y = this.ac3Y  + (yMargin / 2) + this.qbRowHeight;
			}
			if (numOfButtons > 4){
				this.ac5X = this.boardPosX;
				this.ac5Y = this.ac4Y  + (yMargin / 2) + this.qbRowHeight;
			}
			if (numOfButtons > 5){
				this.ac6X = this.boardPosX;
				this.ac6Y = this.ac5Y  + (yMargin / 2) + this.qbRowHeight;
			}
		}
		//Two Column
		else if (columns == 2){
			
			var halfMargin = yMargin / 2;
			this.buttonWidth = (this.boardWidth / 2) - (halfMargin / 2);
			this.buttonHeight = this.qbRowHeight;
			
			this.column1X = this.boardPosX;
			this.column2X =this.boardPosX + this.buttonWidth + halfMargin;
			
			this.ac1X = this.column1X;
			this.ac1Y = this.boardPosYData + yMargin;
			this.ac2X = this.column2X ;
			this.ac2Y = this.ac1Y;
			
			
			if (numOfButtons > 2){
				this.ac3X = this.ac1X ;
				this.ac3Y = this.ac1Y  + (yMargin / 2) + this.qbRowHeight;
			}
			if (numOfButtons > 3){
				this.ac4X = this.ac2X;
				this.ac4Y = this.ac3Y;
			}
			if (numOfButtons > 4){
				this.ac5X = this.ac1X ;
				this.ac5Y = this.ac3Y  + (yMargin / 2) + this.qbRowHeight;
			}
			if (numOfButtons > 5){
				this.ac6X = this.ac2X ;
				this.ac6Y = this.ac5Y;
			}
		}
		//Three Column
		else if (columns == 3){
			var halfMargin = yMargin / 3;
			this.buttonWidth = (this.boardWidth / 3) - (halfMargin / 3);
			this.buttonHeight = this.qbRowHeight;
			
			this.column1X = this.boardPosX;
			this.column2X =this.boardPosX + this.buttonWidth + halfMargin;
			this.column3X = this.column2X + this.buttonWidth + halfMargin;
			
			this.ac1X = this.column1X;
			this.ac1Y = this.boardPosYData + yMargin;
			
			this.ac2X = this.column2X ;
			this.ac2Y = this.ac1Y;
			
			this.ac3X = this.column3X ;
			this.ac3Y = this.ac1Y;
			
			if (numOfButtons > 3){
				this.ac4X = this.ac1X;
				this.ac4Y = this.ac3Y + (yMargin / 2) + this.qbRowHeight;
			}
			if (numOfButtons > 4){
				this.ac5X = this.ac2X ;
				this.ac5Y = this.ac4Y;
			}
			if (numOfButtons > 5){
				this.ac6X = this.ac3X ;
				this.ac6Y = this.ac4Y;
			}
		}
		//Frame Outline
		ig.system.context.fillStyle = this.outerFrameColor;
		ig.system.context.fillRect(this.ac1X , this.ac1Y , this.buttonWidth,this.buttonHeight);
		ig.system.context.fillRect(this.ac2X , this.ac2Y , this.buttonWidth,this.buttonHeight);
		if (numOfButtons > 2){
			ig.system.context.fillRect(this.ac3X , this.ac3Y , this.buttonWidth,this.buttonHeight);
		}
		if (numOfButtons > 3){
			ig.system.context.fillRect(this.ac4X , this.ac4Y , this.buttonWidth,this.buttonHeight);
		}
		if (numOfButtons > 4){
			ig.system.context.fillRect(this.ac5X , this.ac5Y , this.buttonWidth,this.buttonHeight);
		}
		if (numOfButtons > 5){
			ig.system.context.fillRect(this.ac6X , this.ac6Y , this.buttonWidth,this.buttonHeight);
		}
		//Frame Inline
		ig.system.context.fillStyle = this.innerFrameColor;
		ig.system.context.fillRect(this.ac1X + hFrame, this.ac1Y+ vFrame, this.buttonWidth - (hFrame * 2),this.buttonHeight - (vFrame * 2));
		ig.system.context.fillRect(this.ac2X + hFrame, this.ac2Y+ vFrame, this.buttonWidth - (hFrame * 2),this.buttonHeight - (vFrame * 2));
		if (numOfButtons > 2){
			ig.system.context.fillRect(this.ac3X + hFrame, this.ac3Y+ vFrame, this.buttonWidth - (hFrame * 2),this.buttonHeight - (vFrame * 2));
		}
		if (numOfButtons > 3){
			ig.system.context.fillRect(this.ac4X + hFrame, this.ac4Y+ vFrame, this.buttonWidth - (hFrame * 2),this.buttonHeight - (vFrame * 2));
		}
		if (numOfButtons > 4){
			ig.system.context.fillRect(this.ac5X + hFrame, this.ac5Y+ vFrame, this.buttonWidth - (hFrame * 2),this.buttonHeight - (vFrame * 2));
		}
		if (numOfButtons > 5){
			ig.system.context.fillRect(this.ac6X + hFrame, this.ac6Y+ vFrame, this.buttonWidth - (hFrame * 2),this.buttonHeight - (vFrame * 2));
		}

		//Button Color
		//Button 1
		if (ig.game.answerChoiceBN == 1 && ig.game.correctionOn == true){
			if (ig.game.wasItRight == true) {
				ig.system.context.fillStyle =this.rightColor;
			}
			else {
				ig.system.context.fillStyle =this.wrongColor;
			}
		}
		else{
			ig.system.context.fillStyle = this.boardColor;
		}
		ig.system.context.fillRect(this.ac1X + hFrame + hFrame2, this.ac1Y + vFrame + vFrame2, this.buttonWidth - (hFrame * 2) - (hFrame2 * 2),this.buttonHeight - (vFrame * 2) - (vFrame2 * 2));
		//Button 2
		if (ig.game.answerChoiceBN == 2 && ig.game.correctionOn == true){
			if (ig.game.wasItRight == true) {
				ig.system.context.fillStyle =this.rightColor;
			}
			else {
				ig.system.context.fillStyle =this.wrongColor;
			}
		}
		else{
			ig.system.context.fillStyle = this.boardColor;
		}
		ig.system.context.fillRect(this.ac2X + hFrame + hFrame2, this.ac2Y + vFrame + vFrame2, this.buttonWidth - (hFrame * 2) - (hFrame2 * 2),this.buttonHeight - (vFrame * 2) - (vFrame2 * 2));
		//Button 3
		if (numOfButtons > 2){
			if (ig.game.answerChoiceBN == 3 && ig.game.correctionOn == true){
				if (ig.game.wasItRight == true) {
					ig.system.context.fillStyle =this.rightColor;
				}
				else {
					ig.system.context.fillStyle =this.wrongColor;
				}
			}
			else{
				ig.system.context.fillStyle = this.boardColor;
			}
			ig.system.context.fillRect(this.ac3X + hFrame + hFrame2, this.ac3Y + vFrame + vFrame2, this.buttonWidth - (hFrame * 2) - (hFrame2 * 2),this.buttonHeight - (vFrame * 2) - (vFrame2 * 2));
		}
		//Button 4
		if (numOfButtons > 3){
			if (ig.game.answerChoiceBN == 4 && ig.game.correctionOn == true){
				if (ig.game.wasItRight == true) {
					ig.system.context.fillStyle =this.rightColor;
				}
				else {
					ig.system.context.fillStyle =this.wrongColor;
				}
			}
			else{
				ig.system.context.fillStyle = this.boardColor;
			}
			ig.system.context.fillRect(this.ac4X + hFrame + hFrame2, this.ac4Y + vFrame + vFrame2, this.buttonWidth - (hFrame * 2) - (hFrame2 * 2),this.buttonHeight - (vFrame * 2) - (vFrame2 * 2));
		}
		//Button 5
		if (numOfButtons > 4){
			if (ig.game.answerChoiceBN == 5 && ig.game.correctionOn == true){
				if (ig.game.wasItRight == true) {
					ig.system.context.fillStyle =this.rightColor;
				}
				else {
					ig.system.context.fillStyle =this.wrongColor;
				}
			}
			else{
				ig.system.context.fillStyle = this.boardColor;
			}
			ig.system.context.fillRect(this.ac5X + hFrame + hFrame2, this.ac5Y + vFrame + vFrame2, this.buttonWidth - (hFrame * 2) - (hFrame2 * 2),this.buttonHeight - (vFrame * 2) - (vFrame2 * 2));
		}
		//Button 6
		if (numOfButtons > 5){
			if (ig.game.answerChoiceBN == 6 && ig.game.correctionOn == true){
				if (ig.game.wasItRight == true) {
					ig.system.context.fillStyle =this.rightColor;
				}
				else {
					ig.system.context.fillStyle =this.wrongColor;
				}
			}
			else{
				ig.system.context.fillStyle = this.boardColor;
			}
			ig.system.context.fillRect(this.ac6X + hFrame + hFrame2, this.ac6Y + vFrame + vFrame2, this.buttonWidth - (hFrame * 2) - (hFrame2 * 2),this.buttonHeight - (vFrame * 2) - (vFrame2 * 2));
		}
	},
	flashScreenBro: function(color, time){
		this.flashScreen = true;
		//If time is provided, set the timer, else go to default time
		if (time){
			this.flashScreenTimer.set(time);
		}
		else{
			this.flashScreenTimer.set(.05);
		}
		this.flashScreenColor = color;
	},
	flashScreenCheck: function(){
		if (this.flashScreen){
			this.drawABox(0, ig.system.width, 0, ig.system.height, 0, this.flashScreenColor, true, this.flashScreenColor);
			//Turn off screen flash if flashtimer hits 0.
			if (this.flashScreenTimer.delta() > 0){
				this.flashScreen = false;
			}
		}
		
	},
	wipeData: function(){		
		window.localStorage.setItem("lvl", 1);
	},
	saveGame: function(){		
		window.localStorage.setItem("lvl", ig.game.pData.lvl);
	},
	loadGame: function(){
		if (window.localStorage.getItem("lvl")){
			ig.game.pData.lvl = JSON.parse(window.localStorage.getItem("lvl"));
			this.savedGame = true;	
		}
		if (window.localStorage.getItem("gameMuted")){
			this.muteGame = JSON.parse(window.localStorage.getItem("gameMuted"));
		}
	},
	loadTSImages: function(){
		this.tsImage = new Image();
		this.tsImage.src = window.tsImage.src;
		
		this.newGameButton = new Image();
		this.newGameButton.src = window.ngbut.src;
		
		this.continueButton = new Image();
		this.continueButton.src = window.conbut.src;
		
		this.dsImage = new Image();
		this.dsImage.src = window.dsImage.src;
		
		this.menuDownBut = new Image();
		this.menuDownBut.src = window.menuDownBut.src;
		
		this.menuDownButDisabled = new Image();
		this.menuDownButDisabled.src = window.menuDownButDisabled.src;
		
		this.menuUpBut = new Image();
		this.menuUpBut.src = window.menuUpBut.src;
		
		this.menuUpButDisabled = new Image();
		this.menuUpButDisabled.src = window.menuUpButDisabled.src;
	},
	resizeYo: function(){

		var theWidthToMeasure = window.innerWidth;
		
		var scale = 1;
		
		//Mobile Phones in Landscape
		if (window.innerHeight < 450){
			scale = 1;
		}
		//Mobile Phones in Portrait
		else if (theWidthToMeasure < 400){
			scale = .9;
		}
		else if (theWidthToMeasure < 500){
			scale = .85;
		}
		else if (theWidthToMeasure< 650){
			scale = .625;
		}
		else if (theWidthToMeasure< 800){
			scale = .6;
		}
		else if (theWidthToMeasure < 1000){
			scale = .5;
		}
		else if (theWidthToMeasure < 1600){
			scale = .45;
		}
		else if (theWidthToMeasure < 2000){
			scale = .4;
		}
		else if (theWidthToMeasure < 2400){
			scale = .35;
		}
		else if (theWidthToMeasure < 2800){
			scale = .25;
		}
		else if (theWidthToMeasure< 3200){
			scale = .2;
		}
		//Smaller than 3600 but greater than 3200
		else if (theWidthToMeasure< 3600){
			scale = .15;
		}
		else{
			scale = .1;
		}
		
		//Also check height for crazy tall devices
		if (window.innerHeight > 2000){
			scale = .2;
		}
		
		
		window.scale = scale;
		
		//Set Canvas Width Minus Ads
		this.cWidth = window.innerWidth;
		this.cHeight = window.innerHeight;
		
		// Resize the canvas style and tell Impact to resize the canvas itself;
		canvas.style.width = this.cWidth + 'px';
		canvas.style.height = this.cHeight + 'px';
		
		ig.system.resize( this.cWidth * scale, this.cHeight * scale);
		//SET FONTS
		ig.game.dFonts.setVs();
		

		//REVERT THESE FOR FONT FINDING
		this.dFonts.headerSizeKnown = false;
		this.dFonts.questionSizeKnown = false;
		this.dFonts.tinyQuestionSizeKnown = false;
		this.dFonts.buttonOneSizeKnown = false;
		this.dFonts.buttonTwoSizeKnown = false;
		this.dFonts.buttonThreeSizeKnown = false;
		this.dFonts.buttonFourSizeKnown = false;
		this.dFonts.buttonFiveSizeKnown = false;
		this.dFonts.buttonSixSizeKnown = false;
		this.dFonts.correctionSizeKnown = false;
		
		//DON'T FORGET TO SET BUTTONS TOO	
		ig.game.setButtons();
		
	}
	//END ig.game
	});


var theWidthToMeasure = window.innerWidth;

//Mobile Phones in Landscape
if (window.innerHeight < 450){
	scale = 1;
}
//Mobile Phones in Portrait
else if (theWidthToMeasure < 400){
	scale = .9;
}
else if (theWidthToMeasure < 500){
	scale = .85;
}
else if (theWidthToMeasure< 650){
	scale = .625;
}
else if (theWidthToMeasure< 800){
	scale = .6;
}
else if (theWidthToMeasure < 1000){
	scale = .5;
}
else if (theWidthToMeasure < 1600){
	scale = .45;
}
else if (theWidthToMeasure < 2000){
	scale = .4;
}
else if (theWidthToMeasure < 2400){
	scale = .35;
}
else if (theWidthToMeasure < 2800){
	scale = .25;
}
else if (theWidthToMeasure< 3200){
	scale = .2;
}
//Smaller than 3600 but greater than 3200
else if (theWidthToMeasure< 3600){
	scale = .15;
}
else{
	scale = .1;
}

//Also check height for crazy tall devices
if (window.innerHeight > 2000){
	scale = .2;
}


window.scale = scale;


canvas.style.width = window.innerWidth + 'px';
canvas.style.height = window.innerHeight+ 'px';

window.addEventListener('resize', function(){

// If the game hasn't started yet, there's nothing to do here
if( !ig.system ) { return; }
	if (ig.game){
		ig.game.resizeYo();	
	}
}, false);

var width = window.innerWidth * scale,
height = window.innerHeight * scale;
ig.main( '#canvas', MyGame, 60, width, height, 1 );

});

