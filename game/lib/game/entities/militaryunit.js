ig.module(
	'game.entities.militaryunit'
)
.requires(
	'impact.entity',
	'impact.entity-pool'
)
.defines(function(){
	
EntityMilitaryunit=ig.Entity.extend({
	size: {x: 32, y: 32},
	maxVel: {x: 000, y: 000},
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NEVER,
	
	myX: 0,
	myY: 0,
	myTileName: null,
	muName: null,
	muID: null,
	//Array
	cardData: null,
	
	selected: false,
	
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(245, 66, 212, 0.1)',
	animSheet: new ig.AnimationSheet( 'media/military-unit.png', 32, 32 ),
	//clickSound: new ig.Sound( 'media/sounds/new-game.*' ),
	
	init: function( x, y, settings ) {
		this.parent(x, y, settings);	
		this.addAnim( 'chill', 1, [0], true );
		this.addAnim( 'selectMe', 1, [1], true );
	},
	reset: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.selected = false;
    },
	
	update: function() {
		
		if (ig.game.prepareDeck || ig.game.titleScreen || ig.game.drawPlayCardDisplay){
			this.ready = false;
		}
		else{
			this.ready = true;
		}
		if (ig.game.selectMilitaryUnit){
			this.currentAnim = this.anims.selectMe;
		}
		else{
			this.currentAnim = this.anims.chill;
		}	
		//Click me
		if (ig.input.released('click') && this.inFocus() && this.ready) {
			ig.game.flashMUstats(this.muName, this.cardData);
			
			if (ig.game.playingCardStep == 1 && ig.game.curCardToPlay.classOf == "character"){
				var cName = ig.game.curCardToPlay.name;
				
				if (confirm("Are you sure you want to attach " + cName + " to this " + this.muName + "?" ) == true) {
					ig.game.attachCardHere(this.muID);
					ig.game.selectMilitaryUnit = false;
				}
				else{
					ig.game.playingCardStep = 0;
					ig.game.drawPlayingCardDisplay = false;
					ig.game.selectMilitaryUnit = false;
				}
			}
			else{
				ig.game.openMenuForMU(this.muID);
			}
			
		}
		
		//Unselect me
		if (ig.game.xSelected != this.myX || ig.game.ySelected != this.myY){
			this.selected = false;
		}
		
		this.parent();
	},

	kill: function(){
		this.parent();
	},
	inFocus: function() {
    return (
       (this.pos.x <= (ig.input.mouse.x + ig.game.screen.x)) &&
       ((ig.input.mouse.x + ig.game.screen.x) <= this.pos.x + this.size.x) &&
       (this.pos.y <= (ig.input.mouse.y + ig.game.screen.y)) &&
       ((ig.input.mouse.y + ig.game.screen.y) <= this.pos.y + this.size.y)
    );
 	}
		
});
ig.EntityPool.enableFor( EntityMilitaryunit );
});