ig.module(
	'game.entities.button'
)
.requires(
	'impact.entity',
	'impact.entity-pool'
)
.defines(function(){
	
EntityButton=ig.Entity.extend({
	size: {x: 1, y: 1},
	maxVel: {x: 000, y: 000},
	name: null,
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NEVER,
	
	clicked: false,
	
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(245, 66, 212, 1)',
	
	//clickSound: new ig.Sound( 'media/sounds/new-game.*' ),
	
	init: function( x, y, settings ) {
		this.parent(x, y, settings);	
		this.giveMeASecond = new ig.Timer(.33);
		//console.log(this.name + " spawned");
	},
	reset: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.giveMeASecond.set(.33);
		this.clicked = false;
		//console.log(this.name + " spawned");
    },
	
	update: function() {
		if (this.name == "start"){
			this.size.x =  ig.game.tsButtonWidth;
			this.size.y =  ig.game.tsButtonHeight; 
			this.pos.x =ig.game.ngbX + ig.game.screen.x;
			this.pos.y = ig.game.ngbY + ig.game.screen.y;
		}
		else if (this.name == "menuUp"){
			this.size.x =  ig.game.menuButWidth;
			this.size.y =  ig.game.menuButHeight; 
			this.pos.x = ig.game.menuButX + ig.game.screen.x;
			this.pos.y = ig.game.menuButUpY + ig.game.screen.y;	
		}
		else if (this.name == "menuDown"){
			this.size.x =  ig.game.menuButWidth;
			this.size.y =  ig.game.menuButHeight; 
			this.pos.x = ig.game.menuButX + ig.game.screen.x;
			this.pos.y = ig.game.menuButDownY + ig.game.screen.y;	
		}
		else if (this.name == "cdLine1"){
			this.size.x =  ig.game.cdLineWidth;
			this.size.y =  ig.game.cdLineHeight; 
			this.pos.x = ig.game.cdLineX + ig.game.screen.x;
			this.pos.y = ig.game.slot1y + ig.game.screen.y - ig.game.cdLineHeight;
		}
		else if (this.name == "cdLine2"){
			this.size.x =  ig.game.cdLineWidth;
			this.size.y =  ig.game.cdLineHeight; 
			this.pos.x = ig.game.cdLineX + ig.game.screen.x;
			this.pos.y = ig.game.slot2y + ig.game.screen.y - ig.game.cdLineHeight;
		}
		else if (this.name == "cdLine3"){
			this.size.x =  ig.game.cdLineWidth;
			this.size.y =  ig.game.cdLineHeight; 
			this.pos.x = ig.game.cdLineX + ig.game.screen.x;
			this.pos.y = ig.game.slot3y + ig.game.screen.y - ig.game.cdLineHeight;
		}
		else if (this.name == "cdLine4"){
			this.size.x =  ig.game.cdLineWidth;
			this.size.y =  ig.game.cdLineHeight; 
			this.pos.x = ig.game.cdLineX + ig.game.screen.x;
			this.pos.y = ig.game.slot4y + ig.game.screen.y - ig.game.cdLineHeight;
		}
		else if (this.name == "cdLine5"){
			this.size.x =  ig.game.cdLineWidth;
			this.size.y =  ig.game.cdLineHeight; 
			this.pos.x = ig.game.cdLineX + ig.game.screen.x;
			this.pos.y = ig.game.slot5y + ig.game.screen.y - ig.game.cdLineHeight;
		}
		else if (this.name == "cdLine6"){
			this.size.x =  ig.game.cdLineWidth;
			this.size.y =  ig.game.cdLineHeight; 
			this.pos.x = ig.game.cdLineX + ig.game.screen.x;
			this.pos.y = ig.game.slot6y + ig.game.screen.y - ig.game.cdLineHeight;
		}
		else if (this.name == "cdLine7"){
			this.size.x =  ig.game.cdLineWidth;
			this.size.y =  ig.game.cdLineHeight; 
			this.pos.x = ig.game.cdLineX + ig.game.screen.x;
			this.pos.y = ig.game.slot7y + ig.game.screen.y - ig.game.cdLineHeight;
		}
		else if (this.name == "cdLine8"){
			this.size.x =  ig.game.cdLineWidth;
			this.size.y =  ig.game.cdLineHeight; 
			this.pos.x = ig.game.cdLineX + ig.game.screen.x;
			this.pos.y = ig.game.slot8y + ig.game.screen.y - ig.game.cdLineHeight;
		}
		else if (this.name == "yourCards"){
			this.size.x =  ig.game.cdYourCardsButtonWidth;
			this.size.y =  ig.game.cdYCDButtonHeight; 
			this.pos.x = ig.game.cdYourCardsButtonX + ig.game.screen.x;
			this.pos.y = ig.game.cdYourCardsButtonY + ig.game.screen.y;
		}
		else if (this.name == "yourDeck"){
			this.size.x =  ig.game.cdYourDeckButtonWidth;
			this.size.y =  ig.game.cdYCDButtonHeight; 
			this.pos.x = ig.game.cdYourDeckButtonX + ig.game.screen.x;
			this.pos.y = ig.game.cdYourDeckButtonY + ig.game.screen.y;
		}
		else if (this.name == "startBattle"){
			this.size.x =  ig.game.startBattleButtonWidth;
			this.size.y =  ig.game.startBattleButtonHeight; 
			this.pos.x = ig.game.startBattleButtonX + ig.game.screen.x;
			this.pos.y = ig.game.startBattleButtonY + ig.game.screen.y;
		}
		else if (this.name == "playCard"){
			this.size.x =  ig.game.playCardButtonWidth;
			this.size.y =  ig.game.playCardButtonHeight; 
			this.pos.x = ig.game.playCardButtonX + ig.game.screen.x;
			this.pos.y = ig.game.playCardButtonY + ig.game.screen.y;
		}
		else if (this.name == "drawCard"){
			this.size.x =  ig.game.drawCardButtonWidth;
			this.size.y =  ig.game.drawCardButtonHeight; 
			this.pos.x = ig.game.drawCardButtonX + ig.game.screen.x;
			this.pos.y = ig.game.drawCardButtonY + ig.game.screen.y;
		}
		else if (this.name == "playCard1"){
			this.size.x =  ig.game.cardPickerWidth - 20;
			this.size.y =  18; 
			this.pos.x = ig.game.cardPickerX + ig.game.screen.x + 10;
			this.pos.y = ig.game.cardPickerY + ig.game.screen.y + 10; //25
		}
		else if (this.name == "playCard2"){
			this.size.x =  ig.game.cardPickerWidth - 20;
			this.size.y =  18; 
			this.pos.x = ig.game.cardPickerX + ig.game.screen.x + 10;
			this.pos.y = ig.game.cardPickerY + ig.game.screen.y + 35; //25
		}
		else if (this.name == "playCard3"){
			this.size.x =  ig.game.cardPickerWidth - 20;
			this.size.y =  18; 
			this.pos.x = ig.game.cardPickerX + ig.game.screen.x + 10;
			this.pos.y = ig.game.cardPickerY + ig.game.screen.y + 60; //25
		}
		else if (this.name == "playCard4"){
			this.size.x =  ig.game.cardPickerWidth - 20;
			this.size.y =  18; 
			this.pos.x = ig.game.cardPickerX + ig.game.screen.x + 10;
			this.pos.y = ig.game.cardPickerY + ig.game.screen.y + 90; //25
		}
		else if (this.name == "playCard5"){
			this.size.x =  ig.game.cardPickerWidth - 20;
			this.size.y =  18; 
			this.pos.x = ig.game.cardPickerX + ig.game.screen.x + 10;
			this.pos.y = ig.game.cardPickerY + ig.game.screen.y + 115; //25
		}
		else if (this.name == "playCard6"){
			this.size.x =  ig.game.cardPickerWidth - 20;
			this.size.y =  18; 
			this.pos.x = ig.game.cardPickerX + ig.game.screen.x + 10;
			this.pos.y = ig.game.cardPickerY + ig.game.screen.y + 140; //25
		}
		else if (this.name == "playCard7"){
			this.size.x =  ig.game.cardPickerWidth - 20;
			this.size.y =  18; 
			this.pos.x = ig.game.cardPickerX + ig.game.screen.x + 10;
			this.pos.y = ig.game.cardPickerY + ig.game.screen.y + 165; //25
		}
		else if (this.name == "playCard8"){
			this.size.x =  ig.game.cardPickerWidth - 20;
			this.size.y =  18; 
			this.pos.x = ig.game.cardPickerX + ig.game.screen.x + 10;
			this.pos.y = ig.game.cardPickerY + ig.game.screen.y + 190; //25
		}
		else if (this.name == "playCard9"){
			this.size.x =  ig.game.cardPickerWidth - 20;
			this.size.y =  18; 
			this.pos.x = ig.game.cardPickerX + ig.game.screen.x + 10;
			this.pos.y = ig.game.cardPickerY + ig.game.screen.y + 240; //25
		}
		else if (this.name == "playCard10"){
			this.size.x =  ig.game.cardPickerWidth - 20;
			this.size.y =  18; 
			this.pos.x = ig.game.cardPickerX + ig.game.screen.x + 10;
			this.pos.y = ig.game.cardPickerY + ig.game.screen.y + 265; //25
		}
		else if (this.name == "playCard11"){
			this.size.x =  ig.game.cardPickerWidth - 20;
			this.size.y =  18; 
			this.pos.x = ig.game.cardPickerX + ig.game.screen.x + 10;
			this.pos.y = ig.game.cardPickerY + ig.game.screen.y + 290; //25
		}
		if (!ig.game.titleScreen && this.name == "start" || !ig.game.prepareDeck && this.name == "menuDown"  || !ig.game.prepareDeck && this.name == "menuUp"|| !ig.game.prepareDeck && this.name == "yourCards" || !ig.game.prepareDeck && this.name == "yourDeck" ){
			this.kill();
		}
		if (this.name == "cdLine1" && !ig.game.prepareDeck || this.name == "startBattle" && !ig.game.prepareDeck || this.name == "cdLine2" && !ig.game.prepareDeck || this.name == "cdLine3" && !ig.game.prepareDeck || this.name == "cdLine4" && !ig.game.prepareDeck || this.name == "cdLine5" && !ig.game.prepareDeck || this.name == "cdLine6" && !ig.game.prepareDeck || this.name == "cdLine7" && !ig.game.prepareDeck || this.name == "cdLine8" && !ig.game.prepareDeck ){
			this.kill();
		}
		if (!ig.game.drawPlayCardDisplay && this.name == "playCard1" || !ig.game.drawPlayCardDisplay && this.name == "playCard2" || !ig.game.drawPlayCardDisplay && this.name == "playCard3" || !ig.game.drawPlayCardDisplay && this.name == "playCard4" || !ig.game.drawPlayCardDisplay && this.name == "playCard5" || !ig.game.drawPlayCardDisplay && this.name == "playCard6" || !ig.game.drawPlayCardDisplay && this.name == "playCard7" || !ig.game.drawPlayCardDisplay && this.name == "playCard8" || !ig.game.drawPlayCardDisplay && this.name == "playCard9" || !ig.game.drawPlayCardDisplay && this.name == "playCard10" || !ig.game.drawPlayCardDisplay && this.name == "playCard11"){
			this.kill();
		}
		
		if (ig.input.released('click') && this.inFocus()) {
			//Click Start Button
			if (this.name == "start"){
				ig.game.playSwordSound();
				ig.game.titleScreen = false;
				ig.game.pause = false;
				ig.game.socbClicked = true;
				ig.game.checkForMessages();
				connectWallet();
				ig.game.prepareDeck = true;
				ig.game.spawnEntity( EntityButton, 0, 0, { name: "yourCards" });
				ig.game.spawnEntity( EntityButton, 0, 0, { name: "yourDeck" });
				ig.game.spawnEntity( EntityButton, 0, 0, { name: "startBattle" });
				ig.game.spawnEntity( EntityButton, 0, 0, { name: "menuUp" });
				ig.game.spawnEntity( EntityButton, 0, 0, { name: "menuDown" });
				ig.game.spawnEntity( EntityButton, 0, 0, { name: "cdLine1" });
				ig.game.spawnEntity( EntityButton, 0, 0, { name: "cdLine2" });
				ig.game.spawnEntity( EntityButton, 0, 0, { name: "cdLine3" });
				ig.game.spawnEntity( EntityButton, 0, 0, { name: "cdLine4" });
				ig.game.spawnEntity( EntityButton, 0, 0, { name: "cdLine5" });
				ig.game.spawnEntity( EntityButton, 0, 0, { name: "cdLine6" });
				ig.game.spawnEntity( EntityButton, 0, 0, { name: "cdLine7" });
				ig.game.spawnEntity( EntityButton, 0, 0, { name: "cdLine8" });

				ig.game.playMusicBro(1);
				this.kill();
			}
			else if (this.name == "menuUp"){
				if (ig.game.cardSelectionIndex > 0){
					ig.game.cardSelectionIndex--;
				}
			}
			else if (this.name == "menuDown"){
				var bottomOfList = ig.game.maxNFTNames - 7;
				if (ig.game.prepareDeckMenu == 2){
					bottomOfList = ig.game.maxSelectedCards - 7;
				}
				if (ig.game.cardSelectionIndex < bottomOfList){				
					ig.game.cardSelectionIndex++;
				}
			}
			else if (this.name == "yourCards"){
				ig.game.cardSelectionIndex = 0;
				ig.game.prepareDeckMenu = 1;
			}
			else if (this.name == "yourDeck"){
				ig.game.loadDeck();
				ig.game.cardSelectionIndex = 0;
				ig.game.prepareDeckMenu = 2;
			}
			else if (this.name == "startBattle" && ig.game.maxSelectedCards > 0){
				console.log('starting battle...');
				dealCards();
				ig.game.fadeIn(0, ig.game.color1);
				ig.game.prepareDeck = false;
				ig.game.gameDisplay = true;
				ig.game.playMusicBro(3);
				ig.game.spawnEntity( EntityButton, 0, 0, { name: "playCard" });
				ig.game.spawnEntity( EntityButton, 0, 0, { name: "drawCard" });
			}
			else if (this.name == "drawCard" && !ig.game.drawPlayCardDisplay && !ig.game.playingCardStep ){
				drawCard();
			}
			else if (this.name == "playCard" && !ig.game.drawPlayCardDisplay && cardsInHand[0] && !ig.game.playingCardStep){
				ig.game.drawPlayCardDisplay = true;
				
				ig.game.spawnEntity( EntityButton, 0, 0, { name: "playCard1", card: cardsInHand[0] });
				if (cardsInHand[1]){
					ig.game.spawnEntity( EntityButton, 0, 0, { name: "playCard2", card: cardsInHand[1] });
				}
				if (cardsInHand[2]){
					ig.game.spawnEntity( EntityButton, 0, 0, { name: "playCard3", card: cardsInHand[2] });
				}
				if (cardsInHand[3]){
					ig.game.spawnEntity( EntityButton, 0, 0, { name: "playCard4", card: cardsInHand[3] });
				}
				if (cardsInHand[4]){
					ig.game.spawnEntity( EntityButton, 0, 0, { name: "playCard5", card: cardsInHand[4] });
				}
				if (cardsInHand[5]){
					ig.game.spawnEntity( EntityButton, 0, 0, { name: "playCard6", card: cardsInHand[5] });
				}
				if (cardsInHand[6]){
					ig.game.spawnEntity( EntityButton, 0, 0, { name: "playCard7", card: cardsInHand[6] });
				}
				if (cardsInHand[7]){
					ig.game.spawnEntity( EntityButton, 0, 0, { name: "playCard8", card: cardsInHand[7] });
				}
				if (cardsInHand[8]){
					ig.game.spawnEntity( EntityButton, 0, 0, { name: "playCard9", card: cardsInHand[8] });
				}
				if (cardsInHand[9]){
					ig.game.spawnEntity( EntityButton, 0, 0, { name: "playCard10", card: cardsInHand[9] });
				}
				if (cardsInHand[10]){
					ig.game.spawnEntity( EntityButton, 0, 0, { name: "playCard11", card: cardsInHand[10] });
				}

			}
			else if (this.name == "playCard1" || this.name == "playCard2" || this.name == "playCard3" || this.name == "playCard4" || this.name == "playCard5" || this.name == "playCard6" || this.name == "playCard7" || this.name == "playCard8" || this.name == "playCard9" || this.name == "playCard10" || this.name == "playCard11"){
				if (!ig.game.playingCardStep){
					console.log('playing ' + this.card.name);
					ig.game.curCardToPlay = this.card;
					ig.game.playingCardStep = 1;
					ig.game.colorTiles();
					ig.game.drawPlayingCardDisplay = true;
					ig.game.drawPlayCardDisplay = false;
				}
			}
			else if (ig.game.prepareDeckMenu == 1 && this.name == "cdLine1" || ig.game.prepareDeckMenu == 1 && this.name == "cdLine2" || ig.game.prepareDeckMenu == 1 && this.name == "cdLine3" || ig.game.prepareDeckMenu == 1 && this.name == "cdLine4" || ig.game.prepareDeckMenu == 1 && this.name == "cdLine5" || ig.game.prepareDeckMenu == 1 && this.name == "cdLine6" || ig.game.prepareDeckMenu == 1 && this.name == "cdLine7" || ig.game.prepareDeckMenu == 1 && this.name == "cdLine8"){
				if (this.name == "cdLine1"){
					if (myNFTNames[ig.game.cdS1] ){
						if (ig.game.selectedCardsCount < ig.game.maxCards && !myNFTNames[ig.game.cdS1].selected){
							myNFTNames[ig.game.cdS1].selected = true;
							ig.game.selectedCardsCount++;
							ig.game.playPickSound();
						}
						else if (ig.game.selectedCardsCount == ig.game.maxCards && !myNFTNames[ig.game.cdS1].selected){
							alert('Your deck is full. You must remove a card before adding a new one.');
						}
						else if (myNFTNames[ig.game.cdS1].selected){
							myNFTNames[ig.game.cdS1].selected = false;
							ig.game.selectedCardsCount--;
							ig.game.playUnpickSound();
						}					
					}
					else if (ig.game.deckLoadingMessage1 == "You Don't Have" || ig.game.deckLoadingMessage2 == "Any Cards." || ig.game.deckLoadingMessage3 == "CLICK HERE TO" || ig.game.deckLoadingMessage4 == "BUY CARDS NOW!"){
						window.open("https://romecardgame.com/buy-cards","_blank");
						ig.game.playMusicBro(2);
					}
				}
				else if (this.name == "cdLine2"){
					if (myNFTNames[ig.game.cdS2] ){
						if (ig.game.selectedCardsCount < ig.game.maxCards && !myNFTNames[ig.game.cdS2].selected){
							myNFTNames[ig.game.cdS2].selected = true;
							ig.game.selectedCardsCount++;
							ig.game.playPickSound();
						}
						else if (ig.game.selectedCardsCount == ig.game.maxCards && !myNFTNames[ig.game.cdS2].selected){
							alert('Your deck is full. You must remove a card before adding a new one.');
						}
						else if (myNFTNames[ig.game.cdS2].selected){
							myNFTNames[ig.game.cdS2].selected = false;
							ig.game.selectedCardsCount--;
							ig.game.playUnpickSound();
						}		
					}
					else if (ig.game.deckLoadingMessage1 == "You Don't Have" || ig.game.deckLoadingMessage2 == "Any Cards." || ig.game.deckLoadingMessage3 == "CLICK HERE TO" || ig.game.deckLoadingMessage4 == "BUY CARDS NOW!"){
						window.open("https://romecardgame.com/buy-cards","_blank");
						ig.game.playMusicBro(2);
					}
				}
				else if (this.name == "cdLine3"){
					if (myNFTNames[ig.game.cdS3] ){
						if (ig.game.selectedCardsCount < ig.game.maxCards && !myNFTNames[ig.game.cdS3].selected){
							myNFTNames[ig.game.cdS3].selected = true;
							ig.game.selectedCardsCount++;
							ig.game.playPickSound();
						}
						else if (ig.game.selectedCardsCount == ig.game.maxCards && !myNFTNames[ig.game.cdS3].selected){
							alert('Your deck is full. You must remove a card before adding a new one.');
						}
						else if (myNFTNames[ig.game.cdS3].selected){
							myNFTNames[ig.game.cdS3].selected = false;
							ig.game.selectedCardsCount--;
							ig.game.playUnpickSound();
						}		
					}
					else if (ig.game.deckLoadingMessage1 == "You Don't Have" || ig.game.deckLoadingMessage2 == "Any Cards." || ig.game.deckLoadingMessage3 == "CLICK HERE TO" || ig.game.deckLoadingMessage4 == "BUY CARDS NOW!"){
						window.open("https://romecardgame.com/buy-cards","_blank");
						ig.game.playMusicBro(2);
					}
				}
				else if (this.name == "cdLine4"){
					if (myNFTNames[ig.game.cdS4] ){
						if (ig.game.selectedCardsCount < ig.game.maxCards && !myNFTNames[ig.game.cdS4].selected){
							myNFTNames[ig.game.cdS4].selected = true;
							ig.game.selectedCardsCount++;
							ig.game.playPickSound();
						}
						else if (ig.game.selectedCardsCount == ig.game.maxCards && !myNFTNames[ig.game.cdS4].selected){
							alert('Your deck is full. You must remove a card before adding a new one.');
						}
						else if (myNFTNames[ig.game.cdS4].selected){
							myNFTNames[ig.game.cdS4].selected = false;
							ig.game.selectedCardsCount--;
							ig.game.playUnpickSound();
						}		
					}
					else if (ig.game.deckLoadingMessage1 == "You Don't Have" || ig.game.deckLoadingMessage2 == "Any Cards." || ig.game.deckLoadingMessage3 == "CLICK HERE TO" || ig.game.deckLoadingMessage4 == "BUY CARDS NOW!"){
						window.open("https://romecardgame.com/buy-cards","_blank");
						ig.game.playMusicBro(2);
					}
				}
				else if (this.name == "cdLine5"){
					if (myNFTNames[ig.game.cdS5] ){
						if (ig.game.selectedCardsCount < ig.game.maxCards && !myNFTNames[ig.game.cdS5].selected){
							myNFTNames[ig.game.cdS5].selected = true;
							ig.game.selectedCardsCount++;
							ig.game.playPickSound();
						}
						else if (ig.game.selectedCardsCount == ig.game.maxCards && !myNFTNames[ig.game.cdS5].selected){
							alert('Your deck is full. You must remove a card before adding a new one.');
						}
						else if (myNFTNames[ig.game.cdS5].selected){
							myNFTNames[ig.game.cdS5].selected = false;
							ig.game.selectedCardsCount--;
							ig.game.playUnpickSound();
						}		
					}
					else if (ig.game.deckLoadingMessage1 == "You Don't Have" || ig.game.deckLoadingMessage2 == "Any Cards." || ig.game.deckLoadingMessage3 == "CLICK HERE TO" || ig.game.deckLoadingMessage4 == "BUY CARDS NOW!"){
						window.open("https://romecardgame.com/buy-cards","_blank");
						ig.game.playMusicBro(2);
					}
				}
				else if (this.name == "cdLine6"){
					if (myNFTNames[ig.game.cdS6] ){
						if (ig.game.selectedCardsCount < ig.game.maxCards && !myNFTNames[ig.game.cdS6].selected){
							myNFTNames[ig.game.cdS6].selected = true;
							ig.game.selectedCardsCount++;
							ig.game.playPickSound();
						}
						else if (ig.game.selectedCardsCount == ig.game.maxCards && !myNFTNames[ig.game.cdS6].selected){
							alert('Your deck is full. You must remove a card before adding a new one.');
						}
						else if (myNFTNames[ig.game.cdS6].selected){
							myNFTNames[ig.game.cdS6].selected = false;
							ig.game.selectedCardsCount--;
							ig.game.playUnpickSound();
						}		
					}
					else if (ig.game.deckLoadingMessage1 == "You Don't Have" || ig.game.deckLoadingMessage2 == "Any Cards." || ig.game.deckLoadingMessage3 == "CLICK HERE TO" || ig.game.deckLoadingMessage4 == "BUY CARDS NOW!"){
						window.open("https://romecardgame.com/buy-cards","_blank");
						ig.game.playMusicBro(2);
					}
				}
				else if (this.name == "cdLine7"){
					if (myNFTNames[ig.game.cdS7] ){
						if (ig.game.selectedCardsCount < ig.game.maxCards && !myNFTNames[ig.game.cdS7].selected){
							myNFTNames[ig.game.cdS7].selected = true;
							ig.game.selectedCardsCount++;
							ig.game.playPickSound();
						}
						else if (ig.game.selectedCardsCount == ig.game.maxCards && !myNFTNames[ig.game.cdS7].selected){
							alert('Your deck is full. You must remove a card before adding a new one.');
						}
						else if (myNFTNames[ig.game.cdS7].selected){
							myNFTNames[ig.game.cdS7].selected = false;
							ig.game.selectedCardsCount--;
							ig.game.playUnpickSound();
						}		
					}
				}
				else if (this.name == "cdLine8"){
					if (myNFTNames[ig.game.cdS8] ){
						if (ig.game.selectedCardsCount < ig.game.maxCards && !myNFTNames[ig.game.cdS8].selected){
							myNFTNames[ig.game.cdS8].selected = true;
							ig.game.selectedCardsCount++;
							ig.game.playPickSound();
						}
						else if (ig.game.selectedCardsCount == ig.game.maxCards && !myNFTNames[ig.game.cdS8].selected){
							alert('Your deck is full. You must remove a card before adding a new one.');
						}
						else if (myNFTNames[ig.game.cdS8].selected){
							myNFTNames[ig.game.cdS8].selected = false;
							ig.game.selectedCardsCount--;
							ig.game.playUnpickSound();
						}		
					}
				}
				ig.game.loadDeck();
			}
		}
		this.parent();
	},
	resetGameData: function(){
		ig.game.pData.deaths = 0;
		ig.game.pData.qRight = 0;
		ig.game.pData.qWrong = 0;
		ig.game.pData.lvl = 1;
		ig.game.pData.tokens = 0;	
		ig.game.pData.tokensLT = 0;	
		ig.game.pData.tokensGT = 0;	
		ig.game.pData.timesPassed = 0;
		if (ig.game.quiz.usedQs){
			ig.game.quiz.usedQs.numbers.length = 0;
		}
	},
	kill: function(){
		//console.log(this.name + " killed");
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
ig.EntityPool.enableFor( EntityButton );
});