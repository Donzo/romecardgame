// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import '@chainlink/contracts/src/v0.8/ConfirmedOwner.sol';
import '@chainlink/contracts/src/v0.8/VRFV2WrapperConsumerBase.sol';


interface RomeCgBoosterPack { //CHANGE HERE
	function transferFrom(address, address, uint) external returns (bool); //from to amount
	function allowance(address, address) external returns (uint256); //owner, spender
}
interface RCGCharacterCardMinter {
    function safeMint(address, string[] memory) external; //Address - Random / Card Number
    function transferOwnership(address) external; //Change owner of minting contract if new PACKOPEN contract is deployed.
}
interface RCGCardURISetter1 {
    function setURI1(uint256) external returns (string memory); //Random / Card Number
}
//RCGCardURISetter1

contract OpenPackContract is VRFV2WrapperConsumerBase, ConfirmedOwner{

	event RequestFulfilled(uint256 requestId, uint256 randomNum1, uint256 randomNum2, uint256 randomNum3, uint256 randomNum4, uint256 randomNum5, uint256 randomNum6, uint256 randomNum7);
    
	//Pack Token Contract
	address internal RomeCgBoosterPackContractAddress = 0x3646d122335f75f0C0C2F389B11eE1fc0C407Cf2;
	RomeCgBoosterPack RomeCgBoosterPackContract = RomeCgBoosterPack(RomeCgBoosterPackContractAddress);
	
	//URI Setter 1 Contact
	address public RCGCardURISetter1ContractAddress = 0xE215318ba9D2FD96363253451611cC8dCE4F1d84;
    RCGCardURISetter1 RCGCardURISetter1Contract = RCGCardURISetter1(RCGCardURISetter1ContractAddress);
	
	//Character Card Minter Contract
    address internal RCGCharacterCardMinterAddress = 0x68aAE4a5054c064251507692bd9C0E02Dc2c8c63;
	RCGCharacterCardMinter RCGCharacterCardMinterContract = RCGCharacterCardMinter(RCGCharacterCardMinterAddress);
	
	address internal msgSender;
	uint256 internal packAllowance;
	uint256 public lastRequestID;
    
	
	//Mapped Random Numbers
	mapping(uint256 => uint256) public mapIdToWord1;
	mapping(uint256 => uint256) public mapIdToWord2;
	mapping(uint256 => uint256) public mapIdToWord3;
	mapping(uint256 => uint256) public mapIdToWord4;
	mapping(uint256 => uint256) public mapIdToWord5;
	mapping(uint256 => uint256) public mapIdToWord6;
	mapping(uint256 => uint256) public mapIdToWord7;

	mapping(uint256 => address) public mapIdToAddress; //Address to ID
	mapping(uint256 => bool) public mapIdToFulfilled; //Completion Status to ID
	
	//Array of URIs
	string[] public URIArray;
	
	//Might need to change this if the request is failing <----------------------------------------
	uint32 callbackGasLimit = 2420000; //Might need to change this if the request is failing <----------------------------------------
	//Might need to change this if the request is failing <----------------------------------------
	//800000
    uint16 requestConfirmations = 3;
    
    //Address LINK - hardcoded for Goerli
    address linkAddress = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB;
 	//address WRAPPER - hardcoded for Goerli
    address wrapperAddress = 0x708701a1DfF4f478de54383E49a627eD4852C816;
    
    constructor() ConfirmedOwner(msg.sender) VRFV2WrapperConsumerBase(linkAddress, wrapperAddress) payable{
        //Set other variable here if you want.
    }
    
    function openPack() external payable {
        msgSender = msg.sender;

        //Check Allowance
		packAllowance = RomeCgBoosterPackContract.allowance(msg.sender, address(this));
		require (packAllowance >= 1000000000000000000, "You must approve this contract to spend your pack.");
		spendPackThenRequest(); 
    }
	function spendPackThenRequest() private{
		bool sT = false; //Successful Transfer
		sT = RomeCgBoosterPackContract.transferFrom(msg.sender, address(this), 1000000000000000000);
		
		if (sT){
            requestRandomWords();
        }
	}
	function requestRandomWords() private returns (uint256 requestId) {
        requestId = requestRandomness(callbackGasLimit, requestConfirmations, 7);
    
        mapIdToAddress[requestId] = msg.sender;
        mapIdToFulfilled[requestId] = false;
        lastRequestID = requestId;
        return requestId;
    }
    
    function fulfillRandomWords(uint256 _requestId, uint256[] memory _randomWords) internal override {
		require(mapIdToFulfilled[_requestId] == false, 'request fulfilled already');
		mapIdToFulfilled[_requestId] = true;
		mapIdToWord1[_requestId] = (_randomWords[0] % 1000) + 1;
		mapIdToWord2[_requestId] = (_randomWords[1] % 1000) + 1;
		mapIdToWord3[_requestId] = (_randomWords[2] % 1000) + 1;
		mapIdToWord4[_requestId] = (_randomWords[3] % 1000) + 1;
		mapIdToWord5[_requestId] = (_randomWords[4] % 1000) + 1;
		mapIdToWord6[_requestId] = (_randomWords[5] % 1000) + 1;
		mapIdToWord7[_requestId] = (_randomWords[6] % 1000) + 1;

		
		mintCards(_requestId);
		emit RequestFulfilled(_requestId, mapIdToWord1[_requestId], mapIdToWord2[_requestId], mapIdToWord3[_requestId], mapIdToWord4[_requestId], mapIdToWord5[_requestId], mapIdToWord6[_requestId], mapIdToWord7[_requestId]); //ID, NUM1, NUM2
    }
    function mintCards(uint256 _requestId) private{
		delete URIArray;
		URIArray.push(RCGCardURISetter1Contract.setURI1(mapIdToWord1[_requestId]));
		URIArray.push(RCGCardURISetter1Contract.setURI1(mapIdToWord2[_requestId]));
		URIArray.push(RCGCardURISetter1Contract.setURI1(mapIdToWord3[_requestId]));
		URIArray.push(RCGCardURISetter1Contract.setURI1(mapIdToWord4[_requestId]));
		URIArray.push(RCGCardURISetter1Contract.setURI1(mapIdToWord5[_requestId]));
		URIArray.push(RCGCardURISetter1Contract.setURI1(mapIdToWord6[_requestId]));
		URIArray.push(RCGCardURISetter1Contract.setURI1(mapIdToWord7[_requestId]));
		
		RCGCharacterCardMinterContract.safeMint(mapIdToAddress[_requestId], URIArray);
    }
	//Edit URISetter Address
	function changeRCGCardURISetter1ContractAddress(address _newAddress) public onlyOwner {
        RCGCardURISetter1ContractAddress = _newAddress;
    }
	//Transfer Ownership of Minter Contract if this contract needs to be redeployed
    function transferCCMinterOwnership(address _newOwner) public onlyOwner {
        RCGCharacterCardMinterContract.transferOwnership(_newOwner);
    }
    //Change Character Card Minter Address if New Contract is Deployed
    function changecharacterCardMinterAddress(address _characterCardMinterAddress) public onlyOwner {
        RCGCharacterCardMinterAddress = _characterCardMinterAddress;
    }
    //Withdraw Link
    function withdrawLink() public onlyOwner{
        LinkTokenInterface link = LinkTokenInterface(linkAddress);
        require(link.transfer(address(owner()), link.balanceOf(address(this))), 'Unable to transfer');
    }
    //Withdraw ETH
    function withdrawETH(uint256 amount) public onlyOwner{
        address payable to = payable(address(owner()));
        to.transfer(amount);
    }
}