// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

//Character Card Contract
contract RCGCardMinter is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
	
	using Counters for Counters.Counter;
	Counters.Counter private _tokenIdCounter;
	uint256 _tokenId = 1;

	constructor() ERC721("Rome Character Card NFT - test05", "RCGCCT05") {
		_tokenIdCounter.increment();
    }
	
	function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
	
	function safeMint(address to, string[] memory uri) public onlyOwner {
		for(uint8 i = 0; i<uri.length; i++){
			_tokenId = _tokenIdCounter.current();      
			_tokenIdCounter.increment();
			_safeMint(to, _tokenId);
			_setTokenURI(_tokenId, uri[i]);
		}
	}
	function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory){
		return super.tokenURI(tokenId);
	}
   
	function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
	function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}