// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

interface RCGCharacterCardSetter1 {
    function setCardValues1(uint256) external returns (string memory, string memory, string memory, string memory, string memory, string memory, string memory); //Random / Card Number
}

//Character Card Contract
contract RCGCharacterCardMinter is ERC721, Ownable {
	using Counters for Counters.Counter;
	using Strings for uint256;

	Counters.Counter private _tokenIdCounter;

	constructor() ERC721("Rome Character Card NFT - test01", "RCGCCT01") {}
	
	address internal RCGCharacterCardSetter1ContractAddress = 0x9E6D77D0452A210723AC999d568643a05116e7d0;
    RCGCharacterCardSetter1 RCGCharacterCardSetter1Contract = RCGCharacterCardSetter1(RCGCharacterCardSetter1ContractAddress);
	
	function safeMint(address to) public onlyOwner {
		uint256 tokenId = _tokenIdCounter.current();
		_tokenIdCounter.increment();
		_safeMint(to, tokenId);
		tokenURI(tokenId);
	}
	
    //Values and Traits
	string public cName;
	//string public cNum;
	string public cType;
	string public cDescr;
	string public cRarity;
	string public uEffect;
	string public spAction;
   
	string public cPageLink;
	string public cIMGURL;
    
    //Change Character Card Setter Address if New Contract Deployed
    function changeRCGCharacterCardSetter1ContractAddress(address _RCGCharacterCardSetter1ContractAddress) public onlyOwner {
        RCGCharacterCardSetter1ContractAddress = _RCGCharacterCardSetter1ContractAddress;
    }
    
	function setValues(uint256 _ranNum) public onlyOwner{
        cPageLink = "https://doncodes.com/rome/";
		(cName, cType, cDescr, cRarity, uEffect, spAction, cIMGURL) = RCGCharacterCardSetter1Contract.setCardValues1(_ranNum);
    }
    function tokenURI(uint256 tokenId)
		public
		view
		override
		returns (string memory)
	{
		bytes memory dataURI = abi.encodePacked(
			'{',
                //'"name": "RCG Character Card #', cNum, ' ', cName, '"'',',
                '"name": "RCG Character Card #', tokenId.toString(), '"'',',
                '"description": ''"', cDescr, '"',',',
                '"external_url": ''"', cPageLink, '"',',',
                '"image": ''"', cIMGURL, '"',',',
                '"attributes":',
                    '[',
                        '{',
                            '"trait_type": "Card Name"'',', 
                            '"value": ''"', cName, '"',
                        '}'',',
                        /*'{',
                            '"trait_type": "Card Number"'',', 
                            '"value": ''"', cNum, '"',
                        '}'',',*/
                        '{',
                            '"trait_type": "Card Type"'',', 
                            '"value": ''"', cType, '"',
                        '}'',',
                        '{',
                            '"trait_type": "Rarity"'',', 
                            '"value": ''"', cRarity, '"',
                        '}'',',
                         '{',
                            '"trait_type": "Unit Effect"'',', 
                            '"value": ''"', uEffect, '"',
                        '}'',',
                         '{',
                            '"trait_type": "Special Action"'',', 
                            '"value": ''"', spAction, '"',
                        '}',
                    ']',
            '}'
        );

        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            )
        );
    }
}