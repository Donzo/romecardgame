<script>
	
	var card1 = null;
	var card2 = null;
	var card3 = null;
	var card4 = null;
	var card5 = null;
	var card6 = null;
	var card7 = null;
	
	function returnCardData(ranNum){
		var cardName = '';
		var	linkToImg = '';
		if (ranNum <= 50){
			cardName = "Numidian Cavalry";
			linkToImg = "https://romecardgame.com/military-unit-cards/01-numidian-cavalry.jpg";
		}
		else if (ranNum <= 100){
			cardName = "Grecian Infantry";
			linkToImg = "https://romecardgame.com/military-unit-cards/02-grecian-infantry.jpg";
		}
		else if (ranNum <= 150){
			cardName = "Spanish Infantry";
			linkToImg = "https://romecardgame.com/military-unit-cards/03-spanish-infantry.jpg";
		}
		else if (ranNum <= 200){
			cardName = "Galic Infantry";
			linkToImg = "https://romecardgame.com/military-unit-cards/04-galic-infantry.jpg";
		}
		else if (ranNum <= 250){
			cardName = "Spartan Infantry";
			linkToImg = "https://romecardgame.com/military-unit-cards/05-spartan-infantry.jpg";
		}
		else if (ranNum <= 300){
			cardName = "Germanic Horde";
			linkToImg = "https://romecardgame.com/military-unit-cards/06-germanic-horde.jpg";
		}
		else if (ranNum <= 350){
			cardName = "Roman Legion";
			linkToImg = "https://romecardgame.com/military-unit-cards/07-roman-legion.jpg";
		}
		else if (ranNum <= 400){
			cardName = "Macedonian Elephant Cavalry";
			linkToImg = "https://romecardgame.com/military-unit-cards/08-macedonian-elephant-cavalry.jpg";
		}
		else if (ranNum <= 450){
			cardName = "Cretan Archers";
			linkToImg = "https://romecardgame.com/military-unit-cards/09-cretan-archers.jpg";
		}
		else if (ranNum <= 500){
			cardName = "King Romulus the Founder";
			linkToImg = "https://romecardgame.com/character-cards/01-king-romulus-the-founder.jpg";
		}
		else if (ranNum <= 550){
			cardName = "Camillus the Second Founder";
			linkToImg = "http://romecardgame.com/character-cards/06-scaevola-the-left-handed.jpg";
		}
		else if (ranNum <= 600){
			cardName = "Aeneas of Troy";
			linkToImg = "https://romecardgame.com/character-cards/03-aeneas-of-troy.jpg";
		}
		else if (ranNum <= 650){
			cardName = "Scipio Africanus";
			linkToImg = "https://romecardgame.com/character-cards/04-scipio-africanus.jpg";
		}
		else if (ranNum <= 700){
			cardName = "Horatius the One-Eyed";
			linkToImg = "https://romecardgame.com/character-cards/05-horatius-the-one-eyed.jpg";
		}
		else if (ranNum <= 750){
			cardName = "Scaevola the Left-Handed";
			linkToImg = "http://romecardgame.com/character-cards/06-scaevola-the-left-handed.jpg";
		}
		else if (ranNum <= 800){
			cardName = "Appius the Builder";
			linkToImg = "https://romecardgame.com/character-cards/07-appius-the-builder.jpg";
		}
		else if (ranNum <= 850){
			cardName = "The Horatii Triplets";
			linkToImg = "https://romecardgame.com/character-cards/08-the-horatii-triplets.jpg";
		}
		else if (ranNum <= 900){
			cardName = "Fabius the Delayer";
			linkToImg = "https://romecardgame.com/character-cards/09-fabius-the-delayer.jpg";
		}
		else if (ranNum <= 950){
			cardName = "Pyrrhus of Epirus";
			linkToImg = "https://romecardgame.com/character-cards/10-pyrrhus-of-epirus.jpg";
		}
		else if (ranNum <= 1000){
			cardName = "Brennus";
			linkToImg = "https://romecardgame.com/character-cards/11-brennus.jpg";
		}	
		
		return {
			'cardName': cardName,
			'linkToImg': linkToImg
		};
	}
	
	function displayCardData(){
		var header = "<h2 id='just-pulled-hdr' class='center-text'>Here Are The Cards That You Just Pulled!</h2>";
		var myCard1 = "<a class='flexLink' target='_blank' href='" + card1.linkToImg + "'><div class='my-card-img'><img src='" + card1.linkToImg + "'/></div></a>";
		var myCard2 = "<a class='flexLink' target='_blank' href='" + card2.linkToImg + "'><div class='my-card-img'><img src='" + card2.linkToImg + "'/></div></a>";
		var myCard3 = "<a class='flexLink' target='_blank' href='" + card3.linkToImg + "'><div class='my-card-img'><img src='" + card3.linkToImg + "'/></div></a>";
		var myCard4 = "<a class='flexLink' target='_blank' href='" + card4.linkToImg + "'><div class='my-card-img'><img src='" + card4.linkToImg + "'/></div></a>";
		var flexBreak = "<div class='flexBreak'></div>";
		var myCard5 = "<a class='flexLink' target='_blank' href='" + card5.linkToImg + "'><div class='my-card-img'><img src='" + card5.linkToImg + "'/></div></a>";
		var myCard6 = "<a class='flexLink' target='_blank' href='" + card6.linkToImg + "'><div class='my-card-img'><img src='" + card6.linkToImg + "'/></div></a>";
		var myCard7 = "<a class='flexLink' target='_blank' href='" + card7.linkToImg + "'><div class='my-card-img'><img src='" + card7.linkToImg + "'/></div></a>";
		var playGameButton = "<"
		pulledCardsDiv.innerHTML += header + flexBreak;
		pulledCardsDiv.innerHTML += myCard1;
		pulledCardsDiv.innerHTML += myCard2;
		pulledCardsDiv.innerHTML += myCard3;
		pulledCardsDiv.innerHTML += myCard4;
		pulledCardsDiv.innerHTML += flexBreak;
		pulledCardsDiv.innerHTML += myCard5;
		pulledCardsDiv.innerHTML += myCard6;
		pulledCardsDiv.innerHTML += myCard7;
		pulledCardsDiv.innerHTML += flexBreak;
		document.getElementById("play-game-button-div").className = "center-text";
	}
</script>