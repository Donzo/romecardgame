// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract RCGCharacterCardSetter1{
	
	string public cName;
	string public cNum;
	string public cType;
	string public cRarity;
	string public cDescr;
	string public uEffect;
	string public spAction;
	string public cIMGURL;
	
	/*
	Uncommon <=10
	Rare 15
	Very Rare 20
	Ultra Rare 20
	Legendary 25
	*/
	
	function setCardValues1(uint256 _ranNumber) public returns (string memory, string memory, string memory, string memory, string memory, string memory, string memory){
		
		if (_ranNumber < 100){
			cName = "Scaevola the Left-Handed";
			//cNum = "1";
			cType = "Hero";
			cRarity = "Semi-Rare";
			cDescr = "Scaevola the Left-Handed increases a unit's resistance to heat and may be used to alter morale on the field.";
			uEffect = "Heat Resistance - Add 30 points to the climate modifier of the attached unit when under heat risk.";
			spAction = "Fiery Conviction - Chance of increasing player morale 5 points AND lowering enemy morale 5 points (50% success rate).";
			cIMGURL = "https://doncodes.com/rome/character-cards/01-scaevola-the-left-handed.jpg";
		}
		else if (_ranNumber < 200){
			cName = "Camillus the Second Founder";
			//cNum = "2";
			cType = "General";
			cRarity = "Ultra Rare";
			cDescr = "Camillus the Second Founder provides offensive and defensive benefits for seige warfare.";
			uEffect = "Sewer Rat - Doubles the attack score of the attached unit during an offensive seige.";
			spAction = "Rebuild - Restores 20 health points to your citadel if no longer under seige.";
			cIMGURL = "https://doncodes.com/rome/character-cards/02-camillus-the-second-founder.jpg";
		}
		else if (_ranNumber < 300){
			cName = "Aeneas of Troy";
			//cNum = "3";
			cType = "General";
			cRarity = "Very Rare";
			cDescr = "Aeneas of Troy provides defensive benefits for an attached unit and allows the player to save endagered character cards.";
			uEffect = "Fortitude of Troy - Increases the defense of the attached unit by 20 points.";
			spAction = "Aphrodite's Intervention - Detach Aeneas from his current unit along with any other chosen attached character cards (1 action point each) and return them to the player's hand.";
			cIMGURL = "https://doncodes.com/rome/character-cards/03-aeneas-of-troy.jpg";
		}
		else if (_ranNumber < 400){
			cName = "Scipio Africanus";
			//cNum = "4";
			cType = "General";
			cRarity = "Legendary";
			cDescr = "Scipio Africanus improves the terrain scores of an attached unit and allows the player to deliver devastating attacks.";
			uEffect = "Master of the Continent - Increase ALL terrain scores of the attached unit by 20 points (max 100).";
			spAction = "Scipio's Gambit - The defense score of the attached unit is added to the attack score (zeroes unit's defense) for one turn.";
			cIMGURL = "https://doncodes.com/rome/character-cards/04-scipio-africanus.jpg";
		}
		else if (_ranNumber < 500){
			cName = "Horatius the One-Eyed";
			//cNum = "5";
			cType = "Hero";
			cRarity = "Uncommon";
			cDescr = "Horatius the One-Eyed improves the defense scores of an attached unit and allows the player to temporarily halt an enemy unit's movements.";
			uEffect = "Indomitable Defense - Add 10 defense points to the attached unit.";
			spAction = "Cocles' Stand - Discard this card then prevent one enemy unit from moving for three turns.";
			cIMGURL = "https://doncodes.com/rome/character-cards/05-horatius-the-one-eyed.jpg";
		}
		else if (_ranNumber < 600){
			cName = "King Romulus the Founder";
			//cNum = "6";
			cType = "General";
			cRarity = "Legendary";
			cDescr = "King Romulus the Founder can protect attached units from negative status effects and restore the strength of the player's citadel.";
			uEffect = "Divine Lineage - Negative status effects have a 50% chance of failing when applied to the unit to which Romulus is attached.";
			spAction = "Eternal Rome - Restores 30 health points to your citadel if no longer under seige.";
			cIMGURL = "https://doncodes.com/rome/character-cards/06-king-romulus-the-founder.jpg";
		}
		else if (_ranNumber < 700){
			cName = "Appius the Builder";
			//cNum = "7";
			cType = "General";
			cRarity = "Uncommon";
			cDescr = "Appius the Builder reduces the food and gold costs of military units.";
			uEffect = "Master of Logistics - Reduce food AND gold costs of the attached unit by 50%.";
			spAction = "Marvelous Design - Reduce food AND gold costs of ALL units on the field by 50% for one turn.";
			cIMGURL = "https://doncodes.com/rome/character-cards/07-appius-the-builder.jpg";
		}
		else if (_ranNumber < 800){
			cName = "The Horatii Triplets";
			//cNum = "8";
			cType = "Hero";
			cRarity = "Uncommon";
			cDescr = "The Horatii Triplets slightly increases the attack, defense, and speed of an attached unit. This card also gives the player the chance (50%) to remove a choosen character card from an engaged enemy unit.";
			uEffect = "Triple Threat - Increase the attack, defense, and speed of the attached unit by 3 points each.";
			spAction = "Single Combat - Discard this card and potentially discard an attached card of the player's choosing from an engaged enemy unit.";
			cIMGURL = "https://doncodes.com/rome/character-cards/08-the-horatii-triplets.jpg";
		}
		else if (_ranNumber < 900){
			cName = "Fabius the Delayer";
			//cNum = "9";
			cType = "General";
			cRarity = "Very Rare";
			cDescr = "Fabius the Delayer is an uncommon character card that increases the defense of an attached unit and allows the player to attempt to increase the food an gold costs of engaged units.";
			uEffect = "Fabian Tactics - Increase the defense score of the attached unit by 20 points.";
			spAction = "Strategic Patience - Increase the food and gold costs of an engaged enemy unit by 20% (50% chance of success)";
			cIMGURL = "https://doncodes.com/rome/character-cards/09-fabius-the-delayer.jpg";
		}
		else if (_ranNumber < 1000){
			cName = "Pyrrhus of Epirus";
			//cNum = "10";
			cType = "General";
			cRarity = "Ultra Rare";
			cDescr = "Pyrrhus of Epirus is an ultra rare character card that increases player morale and gives the player the option to subtract troop counts from an enemy unit 1 for 1.";
			uEffect = "Inspiring Presence - Increase player morale by 20 points when this card is played.";
			spAction = "Pyrrhic Victory - Subtract the troop count from Pyrrhus's unit from an engaged unit's troop count and vice versa. Discard this card.";
			cIMGURL = "https://doncodes.com/rome/character-cards/10-pyrrhus-of-epirus.jpg";
		}
		
        return (cName, cType, cRarity, cDescr, uEffect, spAction, cIMGURL);
    }
	

}