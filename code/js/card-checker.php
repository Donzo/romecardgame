<script>
		//NFT MINTER ADDRESS
		var nftContract = '0x68aAE4a5054c064251507692bd9C0E02Dc2c8c63';	
		
		var myNFTs = [];
		var myNFTURIs = [];
		//var myNFTURIs = ['https://www.romecardgame.com/character-cards/10-pyrrhus-of-epirus.json', 'https://www.romecardgame.com/military-unit-cards/07-roman-legion.json', 'https://www.romecardgame.com/character-cards/05-horatius-the-one-eyed.json', 'https://www.romecardgame.com/military-unit-cards/03-spanish-infantry.json', 'http://www.romecardgame.com/character-cards/06-scaevola-the-left-handed.json', 'https://www.romecardgame.com/military-unit-cards/09-cretan-archers.json', 'https://www.romecardgame.com/military-unit-cards/01-numidian-cavalry.json', 'https://www.romecardgame.com/military-unit-cards/01-numidian-cavalry.json', 'https://www.romecardgame.com/character-cards/03-aeneas-of-troy.json', 'https://www.romecardgame.com/character-cards/08-the-horatii-triplets.json', 'https://www.romecardgame.com/military-unit-cards/05-spartan-infantry.json', 'https://www.romecardgame.com/military-unit-cards/04-galic-infantry.json', 'https://www.romecardgame.com/military-unit-cards/08-macedonian-elephant-cavalry.json', 'https://www.romecardgame.com/military-unit-cards/03-spanish-infantry.json' ];
		var myNFTNames = [];
		var selectedCards = [];
		var cardsInDeck = [];
		var cardsInHand = [];
		var cardsPlayed = [];
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
		}
		function convertURIToCardName(URL){
			var obj = "";
			console.log('URL = ' + URL);
			if (URL == 'https://www.romecardgame.com/character-cards/01-king-romulus-the-founder.json' || URL == 'https://romecardgame.com/character-cards/01-king-romulus-the-founder.json'){
				obj = {name:'King Romulus the Founder', classOf:"character", selected:false, inHand: false, played: false, discarded: false};
			}
			else if (URL == 'https://www.romecardgame.com/character-cards/02-camillus-the-second-founder.json' || URL == 'https://romecardgame.com/character-cards/02-camillus-the-second-founder.json'){
				obj = {name:'Camillus the Second Founder', classOf:"character", selected:false, inHand: false, played: false, discarded: false};
			}
			else if (URL == 'https://www.romecardgame.com/character-cards/03-aeneas-of-troy.json' || URL == 'https://romecardgame.com/character-cards/03-aeneas-of-troy.json'){
				obj = {name:'Aeneas of Troy', classOf:"character", selected:false, inHand: false, played: false, discarded: false};
			}
			else if (URL == 'https://www.romecardgame.com/character-cards/04-scipio-africanus.json' || URL == 'https://romecardgame.com/character-cards/04-scipio-africanus.json'){
				obj = {name:'Scipio Africanus', classOf:"character", selected:false, inHand: false, played: false, discarded: false};
			}
			else if (URL == 'https://www.romecardgame.com/character-cards/05-horatius-the-one-eyed.json' || URL == 'https://romecardgame.com/character-cards/05-horatius-the-one-eyed.json'){
				obj = {name:'Horatius the One-Eyed', classOf:"character", selected:false, inHand: false, played: false, discarded: false};
			}
			else if (URL == 'http://www.romecardgame.com/character-cards/06-scaevola-the-left-handed.json' || URL == 'http://romecardgame.com/character-cards/06-scaevola-the-left-handed.json' || URL == 'https://www.romecardgame.com/character-cards/06-scaevola-the-left-handed.json' || URL == 'https://romecardgame.com/character-cards/06-scaevola-the-left-handed.json'){
				obj = {name:'Scaevola the Left-Handed', classOf:"character", selected:false, inHand: false, played: false, discarded: false};
			}
			else if (URL == 'https://www.romecardgame.com/character-cards/07-appius-the-builder.json' || URL == 'https://romecardgame.com/character-cards/07-appius-the-builder.json'){
				obj = {name:'Appius the Builder', classOf:"character", selected:false, inHand: false, played: false, discarded: false};
			}
			else if (URL == 'https://www.romecardgame.com/character-cards/08-the-horatii-triplets.json' || URL == 'https://romecardgame.com/character-cards/08-the-horatii-triplets.json'){
				obj = {name:'The Horatii Triplets', classOf:"character", selected:false, inHand: false, played: false, discarded: false};
			}
			else if (URL == 'https://www.romecardgame.com/character-cards/09-fabius-the-delayer.json' || URL == 'https://romecardgame.com/character-cards/09-fabius-the-delayer.json'){
				obj = {name:'Fabius the Delayer', classOf:"character", selected:false, inHand: false, played: false, discarded: false};
			}
			else if (URL == 'https://www.romecardgame.com/character-cards/10-pyrrhus-of-epirus.json' || URL == 'https://romecardgame.com/character-cards/10-pyrrhus-of-epirus.json'){
				obj = {name:'Pyrrhus of Epirus', classOf:"character", selected:false, inHand: false, played: false, discarded: false};
			}
			else if (URL == 'https://www.romecardgame.com/character-cards/11-brennus.json' || URL == 'https://romecardgame.com/character-cards/11-brennus.json'){
				obj = {name:'Brennus', classOf:"character", selected:false, inHand: false, played: false, discarded: false};
			}
			else if (URL == 'https://www.romecardgame.com/military-unit-cards/01-numidian-cavalry.json' || URL == 'https://romecardgame.com/military-unit-cards/01-numidian-cavalry.json'){
				obj = {name:'Numidian Cavalry', classOf:"unit", selected:false, inHand: false, played: false, discarded: false};
			}
			else if (URL == 'https://www.romecardgame.com/military-unit-cards/02-grecian-infantry.json' || URL == 'https://romecardgame.com/military-unit-cards/02-grecian-infantry.json'){
				obj = {name:'Grecian Infantry', classOf:"unit", selected:false, inHand: false, played: false, discarded: false};
			}
			else if (URL == 'https://www.romecardgame.com/military-unit-cards/03-spanish-infantry.json' || URL == 'https://romecardgame.com/military-unit-cards/03-spanish-infantry.json'){
				obj = {name:'Spanish Infantry', classOf:"unit", selected:false, inHand: false, played: false, discarded: false};
			}
			else if (URL == 'https://www.romecardgame.com/military-unit-cards/04-galic-infantry.json' || URL == 'https://romecardgame.com/military-unit-cards/04-galic-infantry.json'){
				obj = {name:'Galic Infantry', classOf:"unit", selected:false, inHand: false, played: false, discarded: false};
			}
			else if (URL == 'https://www.romecardgame.com/military-unit-cards/05-spartan-infantry.json' || URL == 'https://romecardgame.com/military-unit-cards/05-spartan-infantry.json'){
				obj = {name:'Spartan Infantry', classOf:"unit", selected:false, inHand: false, played: false, discarded: false};
			}
			else if (URL == 'https://www.romecardgame.com/military-unit-cards/06-germanic-horde.json' || URL == 'https://romecardgame.com/military-unit-cards/06-germanic-horde.json' || URL == 'http://www.romecardgame.com/military-unit-cards/06-germanic-horde.json' || URL == 'http://romecardgame.com/military-unit-cards/06-germanic-horde.json'){
				obj = {name:'Germanic Horde', classOf:"unit", selected:false, inHand: false, played: false, discarded: false};
			}
			else if (URL == 'https://www.romecardgame.com/military-unit-cards/07-roman-legion.json' || URL == 'https://romecardgame.com/military-unit-cards/07-roman-legion.json'){
				obj = {name:'Roman Legion', classOf:"unit", selected:false, inHand: false, played: false, discarded: false};
			}
			else if (URL == 'https://www.romecardgame.com/military-unit-cards/08-macedonian-elephant-cavalry.json' || URL == 'https://romecardgame.com/military-unit-cards/08-macedonian-elephant-cavalry.json'){
				obj = {name:'Macedonian War Elephants', classOf:"unit", selected:false, inHand: false, played: false, discarded: false};
			}
			else if (URL == 'https://www.romecardgame.com/military-unit-cards/09-cretan-archers.json' || URL == 'https://romecardgame.com/military-unit-cards/09-cretan-archers.json'){
				obj = {name:'Cretan Archers', classOf:"unit", selected:false, inHand: false, played: false, discarded: false};
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
			/*
			if (myNFTNames.length < 1){
				ig.game.deckLoadingMessage1 = "You Don't Have";
				ig.game.deckLoadingMessage2 = "Any Cards.";
				ig.game.deckLoadingMessage3 = "CLICK HERE TO";
				ig.game.deckLoadingMessage4 = "BUY CARDS NOW!";
			}
			*/
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
			//console.log(result);
			return result;
		}
</script>