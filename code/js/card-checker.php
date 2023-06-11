<script>
		//NFT MINTER ADDRESS
		var nftContract = '0x68aAE4a5054c064251507692bd9C0E02Dc2c8c63';	
		
		var myNFTs = [];
		var myNFTURIs = [];
		var myNFTNames = [];
		var selectedCards = [];
		var cardsInDeck = [];
		var cardsInHand = [];
		var cardsPlayed = [];
		var unitsOnBoard = [];
		var charactersOnBoard = [];
		var cardsDiscarded = [];
		var spliceThese = [];
		
		function dealCards(){
			spliceThese.length = 0;
			
			if (selectedCards.length <= 7){
				cardsInDeck.length = 0;
				
				for (let i = 0; i < selectedCards.length; i++) {
					selectedCards[i].inHand = true;
					cardsInHand.push(selectedCards[i]);
					
				}
				selectedCards = [];
			}
			else{
				while (cardsInHand.length < 7) {
					var randomElement = selectedCards[Math.floor(Math.random() * selectedCards.length)];
					if (randomElement.inHand != true){
						randomElement.inHand = true;
						cardsInHand.push(randomElement);
						spliceThese.push(randomElement);
					}
				}
			}
			if (spliceThese.length > 0){
				for (let i = 0; i < spliceThese.length; i++){
						selectedCards.splice(spliceThese[i],1);
				}
			}
			console.log("Logging cards in hand");
			console.log(cardsInHand);
		}
		function drawCard(){
			if (cardsInHand.length <= 10 && ig.game.pData.actionPoints > 0 && selectedCards.length > 0){
				var randomElement = selectedCards[Math.floor(Math.random() * selectedCards.length)];
				if (randomElement.inHand != true){
					randomElement.inHand = true;
					cardsInHand.push(randomElement);
					ig.game.announceDraw(randomElement.name);
					selectedCards.splice(randomElement,1)
					ig.game.pData.actionPoints--;
				}
			}
			else if (ig.game.pData.actionPoints == 0){
				alert('You are out of ACTION POINTS this turn.');
			}
			else if (selectedCards.length == 0){
				alert('Your deck is empty.')
			}
			else{
				alert('Your hand is full.')
			}
		}
		
		async function getNFTsInWallet(){
			let web3 = new Web3(Web3.givenProvider);
			var contract = new web3.eth.Contract(abi1, nftContract, {});
			const balance = await contract.methods.balanceOf(window['userAccountNumber']).call();
			console.log(balance);
			
			for (let i = 0; i < balance; i++) {
				let nftTokenID = await contract.methods.tokenOfOwnerByIndex(window['userAccountNumber'], i).call();
				myNFTs.push(nftTokenID);
			}
			if (myNFTs.length < 1){
				ig.game.deckLoadingMessage1 = "You Don't Have";
				ig.game.deckLoadingMessage2 = "Any Cards.";
				ig.game.deckLoadingMessage3 = "CLICK HERE TO";
				ig.game.deckLoadingMessage4 = "BUY CARDS NOW!";
			}
			else{
				ig.game.deckLoadingMessage1 = "Loading...";
			}	
		}
		function convertURIToCardName(URL){
			var obj = "";
			console.log('URL = ' + URL);
			if (URL == 'https://www.romecardgame.com/character-cards/01-king-romulus-the-founder.json' || URL == 'https://romecardgame.com/character-cards/01-king-romulus-the-founder.json'){
				obj = {name:'King Romulus the Founder', classOf:"character", selected:false, inHand: false, played: false, discarded: false, cardIMG:'https://romecardgame.com/character-cards/01-king-romulus-the-founder.jpg', characterID: false, attachedTo: false};
			}
			else if (URL == 'https://www.romecardgame.com/character-cards/02-camillus-the-second-founder.json' || URL == 'https://romecardgame.com/character-cards/02-camillus-the-second-founder.json'){
				obj = {name:'Camillus the Second Founder', classOf:"character", selected:false, inHand: false, played: false, discarded: false, cardIMG:'https://romecardgame.com/character-cards/02-camillus-the-second-founder.jpg', characterID: false, attachedTo: false};
			}
			else if (URL == 'https://www.romecardgame.com/character-cards/03-aeneas-of-troy.json' || URL == 'https://romecardgame.com/character-cards/03-aeneas-of-troy.json'){
				obj = {name:'Aeneas of Troy', classOf:"character", selected:false, inHand: false, played: false, discarded: false, cardIMG:'https://romecardgame.com/character-cards/03-aeneas-of-troy.jpg', characterID: false, attachedTo: false};
			}
			else if (URL == 'https://www.romecardgame.com/character-cards/04-scipio-africanus.json' || URL == 'https://romecardgame.com/character-cards/04-scipio-africanus.json'){
				obj = {name:'Scipio Africanus', classOf:"character", selected:false, inHand: false, played: false, discarded: false, cardIMG:'https://romecardgame.com/character-cards/04-scipio-africanus.jpg', characterID: false, attachedTo: false};
			}
			else if (URL == 'https://www.romecardgame.com/character-cards/05-horatius-the-one-eyed.json' || URL == 'https://romecardgame.com/character-cards/05-horatius-the-one-eyed.json'){
				obj = {name:'Horatius the One-Eyed', classOf:"character", selected:false, inHand: false, played: false, discarded: false, cardIMG:'https://romecardgame.com/character-cards/05-horatius-the-one-eyed.jpg', characterID: false, attachedTo: false};
			}
			else if (URL == 'http://www.romecardgame.com/character-cards/06-scaevola-the-left-handed.json' || URL == 'http://romecardgame.com/character-cards/06-scaevola-the-left-handed.json' || URL == 'https://www.romecardgame.com/character-cards/06-scaevola-the-left-handed.json' || URL == 'https://romecardgame.com/character-cards/06-scaevola-the-left-handed.json'){
				obj = {name:'Scaevola the Left-Handed', classOf:"character", selected:false, inHand: false, played: false, discarded: false, cardIMG:'https://romecardgame.com/character-cards/06-scaevola-the-left-handed.jpg', characterID: false, attachedTo: false};
			}
			else if (URL == 'https://www.romecardgame.com/character-cards/07-appius-the-builder.json' || URL == 'https://romecardgame.com/character-cards/07-appius-the-builder.json'){
				obj = {name:'Appius the Builder', classOf:"character", selected:false, inHand: false, played: false, discarded: false, cardIMG:'https://romecardgame.com/character-cards/07-appius-the-builder.jpg', characterID: false, attachedTo: false};
			}
			else if (URL == 'https://www.romecardgame.com/character-cards/08-the-horatii-triplets.json' || URL == 'https://romecardgame.com/character-cards/08-the-horatii-triplets.json'){
				obj = {name:'The Horatii Triplets', classOf:"character", selected:false, inHand: false, played: false, discarded: false, cardIMG:'https://romecardgame.com/character-cards/08-the-horatii-triplets.jpg', characterID: false, attachedTo: false};
			}
			else if (URL == 'https://www.romecardgame.com/character-cards/09-fabius-the-delayer.json' || URL == 'https://romecardgame.com/character-cards/09-fabius-the-delayer.json'){
				obj = {name:'Fabius the Delayer', classOf:"character", selected:false, inHand: false, played: false, discarded: false, cardIMG:'https://romecardgame.com/character-cards/09-fabius-the-delayer.jpg', characterID: false, attachedTo: false};
			}
			else if (URL == 'https://www.romecardgame.com/character-cards/10-pyrrhus-of-epirus.json' || URL == 'https://romecardgame.com/character-cards/10-pyrrhus-of-epirus.json'){
				obj = {name:'Pyrrhus of Epirus', classOf:"character", selected:false, inHand: false, played: false, discarded: false, cardIMG:'https://romecardgame.com/character-cards/10-pyrrhus-of-epirus.jpg', characterID: false, attachedTo: false};
			}
			else if (URL == 'https://www.romecardgame.com/character-cards/11-brennus.json' || URL == 'https://romecardgame.com/character-cards/11-brennus.json'){
				obj = {name:'Brennus', classOf:"character", selected:false, inHand: false, played: false, discarded: false, cardIMG:'https://romecardgame.com/character-cards/11-brennus.jpg', characterID: false, attachedTo: false};
			}
			else if (URL == 'https://www.romecardgame.com/military-unit-cards/01-numidian-cavalry.json' || URL == 'https://romecardgame.com/military-unit-cards/01-numidian-cavalry.json'){
				obj = {name:'Numidian Cavalry', classOf:"unit", selected:false, inHand: false, played: false, discarded: false, cardIMG:'https://romecardgame.com/military-unit-cards/01-numidian-cavalry.jpg', troopCount: '250', attack: '20', defend: '50', speed: '100', movement: '3', desert: '100', field: '100', forest: '50', marsh: '10', mountain: '70', waters: '10', goldCost1 : '500', goldCost2: '50', foodCost1: '500', foodCost2: '50', attached1: false, attached2: false, attached3: false, attached4: false, unitID: false};
			}
			else if (URL == 'https://www.romecardgame.com/military-unit-cards/02-grecian-infantry.json' || URL == 'https://romecardgame.com/military-unit-cards/02-grecian-infantry.json'){
				obj = {name:'Grecian Infantry', classOf:"unit", selected:false, inHand: false, played: false, discarded: false, cardIMG:'https://romecardgame.com/military-unit-cards/02-grecian-infantry.jpg', troopCount: '500', attack: '60', defend: '70', speed: '20', movement: '1', desert: '80', field: '100', forest: '60', marsh: '25', mountain: '20', waters: '10', goldCost1 : '250', goldCost2: '25', foodCost1: '250', foodCost2: '25', attached1: false, attached2: false, attached3: false, attached4: false, unitID: false};
			}
			else if (URL == 'https://www.romecardgame.com/military-unit-cards/03-spanish-infantry.json' || URL == 'https://romecardgame.com/military-unit-cards/03-spanish-infantry.json'){
				obj = {name:'Spanish Infantry', classOf:"unit", selected:false, inHand: false, played: false, discarded: false, cardIMG:'https://romecardgame.com/military-unit-cards/03-spanish-infantry.jpg', troopCount: '500', attack: '50', defend: '50', speed: '60', movement: '1', desert: '70', field: '100', forest: '50', marsh: '30', mountain: '30', waters: '10', goldCost1 : '500', goldCost2: '50', foodCost1: '250', foodCost2: '25', attached1: false, attached2: false, attached3: false, attached4: false, unitID: false};
			}
			else if (URL == 'https://www.romecardgame.com/military-unit-cards/04-galic-infantry.json' || URL == 'https://romecardgame.com/military-unit-cards/04-galic-infantry.json'){
				obj = {name:'Galic Infantry', classOf:"unit", selected:false, inHand: false, played: false, discarded: false, cardIMG:'https://romecardgame.com/military-unit-cards/04-galic-infantry.jpg', troopCount: '500', attack: '40', defend: '40', speed: '60', movement: '1', desert: '50', field: '100', forest: '80', marsh: '30', mountain: '50', waters: '10', goldCost1 : '250', goldCost2: '25', foodCost1: '250', foodCost2: '25', attached1: false, attached2: false, attached3: false, attached4: false, unitID: false};
			}
			else if (URL == 'https://www.romecardgame.com/military-unit-cards/05-spartan-infantry.json' || URL == 'https://romecardgame.com/military-unit-cards/05-spartan-infantry.json'){
				obj = {name:'Spartan Infantry', classOf:"unit", selected:false, inHand: false, played: false, discarded: false, cardIMG:'https://romecardgame.com/military-unit-cards/05-spartan-infantry.jpg', troopCount: '300', attack: '60', defend: '70', speed: '40', movement: '1', desert: '80', field: '100', forest: '50', marsh: '20', mountain: '10', waters: '10', goldCost1 : '300', goldCost2: '30', foodCost1: '150', foodCost2: '15', attached1: false, attached2: false, attached3: false, attached4: false, unitID: false};
			}
			else if (URL == 'https://www.romecardgame.com/military-unit-cards/06-germanic-horde.json' || URL == 'https://romecardgame.com/military-unit-cards/06-germanic-horde.json' || URL == 'http://www.romecardgame.com/military-unit-cards/06-germanic-horde.json' || URL == 'http://romecardgame.com/military-unit-cards/06-germanic-horde.json'){
				obj = {name:'Germanic Horde', classOf:"unit", selected:false, inHand: false, played: false, discarded: false, cardIMG:'https://romecardgame.com/military-unit-cards/06-germanic-horde.jpg', troopCount: '500', attack: '50', defend: '20', speed: '60', movement: '2', desert: '50', field: '80', forest: '100', marsh: '90', mountain: '60', waters: '20', goldCost1 : '250', goldCost2: '25', foodCost1: '300', foodCost2: '30', attached1: false, attached2: false, attached3: false, attached4: false, unitID: false};
			}
			else if (URL == 'https://www.romecardgame.com/military-unit-cards/07-roman-legion.json' || URL == 'https://romecardgame.com/military-unit-cards/07-roman-legion.json'){
				obj = {name:'Roman Legion', classOf:"unit", selected:false, inHand: false, played: false, discarded: false, cardIMG:'https://romecardgame.com/military-unit-cards/07-roman-legion.jpg', troopCount: '500', attack: '70', defend: '60', speed: '30', movement: '1', desert: '80', field: '100', forest: '60', marsh: '20', mountain: '70', waters: '10', goldCost1 : '500', goldCost2: '50', foodCost1: '250', foodCost2: '25', attached1: false, attached2: false, attached3: false, attached4: false, unitID: false};
			}
			else if (URL == 'https://www.romecardgame.com/military-unit-cards/08-macedonian-elephant-cavalry.json' || URL == 'https://romecardgame.com/military-unit-cards/08-macedonian-elephant-cavalry.json'){
				obj = {name:'Macedonian War Elephants', classOf:"unit", selected:false, inHand: false, played: false, discarded: false, cardIMG:'https://romecardgame.com/military-unit-cards/08-macedonian-elephant-cavalry.jpg', troopCount: '200', attack: '100', defend: '70', speed: '10', movement: '1', desert: '70', field: '100', forest: '60', marsh: '20', mountain: '70', waters: '10', goldCost1 : '500', goldCost2: '50', foodCost1: '250', foodCost2: '25', attached1: false, attached2: false, attached3: false, attached4: false, unitID: false};
			}
			else if (URL == 'https://www.romecardgame.com/military-unit-cards/09-cretan-archers.json' || URL == 'https://romecardgame.com/military-unit-cards/09-cretan-archers.json'){
				obj = {name:'Cretan Archers', classOf:"unit", selected:false, inHand: false, played: false, discarded: false, cardIMG:'https://romecardgame.com/military-unit-cards/09-cretan-archers.jpg', troopCount: '250', attack: '60', defend: '50', speed: '40', movement: '1', desert: '90', field: '100', forest: '40', marsh: '30', mountain: '70', waters: '15', goldCost1 : '1000', goldCost2: '100', foodCost1: '1000', foodCost2: '100', attached1: false, attached2: false, attached3: false, attached4: false, unitID: false};
			}
			return obj;
		}
		
		
		function convertURIsToCardNames(){
			for (let i = 0; i < myNFTURIs.length; i++) {
				var myNFTName = convertURIToCardName(myNFTURIs[i]);
				myNFTNames.push(myNFTName);
			}
			console.log('names converted');
			console.log(myNFTNames);
			
		}
		async function getURIs(){
			for (let i = 0; i < myNFTs.length; i++) {
				let nftTokenURI = await getNFTMetadata(myNFTs[i]);
				myNFTURIs.push(nftTokenURI);
			}
			console.log(myNFTURIs);
			convertURIsToCardNames();
		}
		async function getNFTMetadata(myTokenId){
	
			let web3 = new Web3(Web3.givenProvider);
			var tokenId = myTokenId;
			var contract = new web3.eth.Contract(abi1, nftContract, {});
			const result = await contract.methods.tokenURI(tokenId).call();
			return result;
		}
</script>