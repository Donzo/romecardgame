ig.module(
	'game.entities.square'
)
.requires(
	'impact.entity',
	'impact.entity-pool'
)
.defines(function(){
	
EntitySquare=ig.Entity.extend({
	size: {x: 32, y: 32},
	maxVel: {x: 000, y: 000},
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NEVER,
	myX: 0,
	myY: 0,
	
	selected: false,
	
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(245, 66, 212, 0.1)',
	animSheet: new ig.AnimationSheet( 'media/square.png', 32, 32 ),
	//clickSound: new ig.Sound( 'media/sounds/new-game.*' ),
	
	init: function( x, y, settings ) {
		this.parent(x, y, settings);	
		this.addAnim( 'selected', 1, [1], true );
		this.addAnim( 'notselected', 1, [0], true );
		this.addAnim( 'validLoc', 1, [2], true );
		this.addAnim( 'selectedLoc', 1, [3], true );
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
		if (this.selectedLoc){
			this.currentAnim = this.anims.selectedLoc;
		}
		else if (this.validLoc){
			this.currentAnim = this.anims.validLoc;
		}
		else if (this.selected){
			this.currentAnim = this.anims.selected;
		}
		else{
			this.currentAnim = this.anims.notselected;
		}
		
		//Click me
		if (ig.input.released('click') && this.inFocus() && this.ready) {
			if (this.validLoc){
				console.log('valid loc');
				this.selectedLoc = true;
				//No time to build this but finished game will confirm play
				//ig.game.playingCardStep = 2;
				//ig.game.confirmMove = false;
				//ig.game.confirmPlay();
				ig.game.colorTiles(2);
				ig.game.playingCardStep = 0;
				ig.game.playCardHere(this.pos.x, this.pos.y, this.myX, this.myY, this.name);
			}
			else if (!this.selected){
				ig.game.xSelected = this.myX;
				ig.game.ySelected = this.myY;
				ig.game.xSelectedPos = this.pos.x;
				ig.game.ySelectedPos = this.pos.y;
				ig.game.checkCameraBounds();
				this.selected = true;
				console.log('selected ( ' + this.myX + "," + this.myY + ')' + " Name = " + this.name);
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
ig.EntityPool.enableFor( EntitySquare );
});