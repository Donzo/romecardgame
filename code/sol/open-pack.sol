// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import '@chainlink/contracts/src/v0.8/ConfirmedOwner.sol';
import '@chainlink/contracts/src/v0.8/VRFV2WrapperConsumerBase.sol';


interface RomeCgBoosterPack { //CHANGE HERE
	function transferFrom(address, address, uint) external returns (bool); //from to amount
	function allowance(address, address) external returns (uint256); //owner, spender
}
interface RCGCharacterCardMinter {
    function setValues(uint256) external;
    function safeMint(address) external; //Address - Random / Card Number
    function transferOwnership(address) external; //Change owner of minting contract if new PACKOPEN contract is deployed.
    function changeRCGCharacterCardSetter1ContractOwnership(address) external; //Changes owner of card setter if new MINTING contract is deployed.
    function changeRCGCharacterCardSetter1ContractAddress(address) external; 
}

contract OpenPackContract is VRFV2WrapperConsumerBase, ConfirmedOwner{

	event RequestFulfilled(uint256 requestId, uint256 randomNum1, uint256 randomNum2, uint256 randomNum3, uint256 randomNum4, uint256 randomNum5, uint256 randomNum6, uint256 randomNum7);
    
	//Pack Token Contract
	address internal RomeCgBoosterPackContractAddress = 0x13f5885a2B7AF06eB08E3f3b255df2e524c1802d;
	RomeCgBoosterPack RomeCgBoosterPackContract = RomeCgBoosterPack(RomeCgBoosterPackContractAddress);

	//Character Card Minter Contract
    address internal RCGCharacterCardMinterAddress = 0x286ef885076445c401Ca54f9F89807352096a207;
	RCGCharacterCardMinter RCGCharacterCardMinterContract = RCGCharacterCardMinter(RCGCharacterCardMinterAddress);
	
	address internal msgSender;
	uint256 internal packAllowance;
	uint256 internal cardMintCounter;
	uint256 public lastRequestID;
    
	//Flattened Numbers
	uint256 internal flatRanNum1;
	uint256 internal flatRanNum2;
	uint256 internal flatRanNum3;
	uint256 internal flatRanNum4;
	uint256 internal flatRanNum5;
	uint256 internal flatRanNum6;
	uint256 internal flatRanNum7;
	//uint256 internal flatRanNum8;
	//uint256 internal flatRanNum9;
	//uint256 internal flatRanNum10;
	
	//Mapped Random Numbers
	mapping(uint256 => uint256) public mapIdToWord1;
	mapping(uint256 => uint256) public mapIdToWord2;
	mapping(uint256 => uint256) public mapIdToWord3;
	mapping(uint256 => uint256) public mapIdToWord4;
	mapping(uint256 => uint256) public mapIdToWord5;
	mapping(uint256 => uint256) public mapIdToWord6;
	mapping(uint256 => uint256) public mapIdToWord7;
	//mapping(uint256 => uint256) public mapIdToWord8;
	//mapping(uint256 => uint256) public mapIdToWord9;
	//mapping(uint256 => uint256) public mapIdToWord10;
	mapping(uint256 => address) public mapIdToAddress; //Address to ID
	mapping(uint256 => bool) public mapIdToFulfilled; //Completion Status to ID
	
	
	
	//Might need to change this if the request is failing <----------------------------------------
	uint32 callbackGasLimit = 2300000; //Might need to change this if the request is failing <----------------------------------------
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
			cardMintCounter = 0;
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
		flatRanNum1 = (_randomWords[0] % 1000) + 1;
		flatRanNum2 = (_randomWords[1] % 1000) + 1;
		flatRanNum3 = (_randomWords[2] % 1000) + 1;
		flatRanNum4 = (_randomWords[3] % 1000) + 1;
		flatRanNum5 = (_randomWords[4] % 1000) + 1;
		flatRanNum6 = (_randomWords[5] % 1000) + 1;
		flatRanNum7 = (_randomWords[6] % 1000) + 1;
		//flatRanNum8 = (_randomWords[7] % 1000) + 1;
		//flatRanNum9 = (_randomWords[8] % 1000) + 1;
		//flatRanNum10 = (_randomWords[9] % 1000) + 1;
		mapIdToWord1[_requestId] = flatRanNum1; //Store it.
		mapIdToWord2[_requestId] = flatRanNum2; //Store it.
		mapIdToWord3[_requestId] = flatRanNum3; //Store it.
		mapIdToWord4[_requestId] = flatRanNum4; //Store it.
		mapIdToWord5[_requestId] = flatRanNum5; //Store it.
		mapIdToWord6[_requestId] = flatRanNum6; //Store it.
		mapIdToWord7[_requestId] = flatRanNum7; //Store it.
		//mapIdToWord8[_requestId] = flatRanNum8; //Store it.
		//mapIdToWord9[_requestId] = flatRanNum9; //Store it.
		//mapIdToWord10[_requestId] = flatRanNum10; //Store it.
		
		mintCards(_requestId);
		emit RequestFulfilled(_requestId, flatRanNum1, flatRanNum2, flatRanNum3, flatRanNum4, flatRanNum5, flatRanNum6, flatRanNum7); //ID, NUM1, NUM2
    }
    function mintCards(uint256 _requestId) private{
		//cardMintCounter++;
		RCGCharacterCardMinterContract.setValues(mapIdToWord1[_requestId]);
		RCGCharacterCardMinterContract.safeMint(mapIdToAddress[_requestId]);
		RCGCharacterCardMinterContract.setValues(mapIdToWord2[_requestId]);
		RCGCharacterCardMinterContract.safeMint(mapIdToAddress[_requestId]);
		RCGCharacterCardMinterContract.setValues(mapIdToWord3[_requestId]);
		RCGCharacterCardMinterContract.safeMint(mapIdToAddress[_requestId]);
		RCGCharacterCardMinterContract.setValues(mapIdToWord4[_requestId]);
		RCGCharacterCardMinterContract.safeMint(mapIdToAddress[_requestId]);
		RCGCharacterCardMinterContract.setValues(mapIdToWord5[_requestId]);
		RCGCharacterCardMinterContract.safeMint(mapIdToAddress[_requestId]);
		RCGCharacterCardMinterContract.setValues(mapIdToWord6[_requestId]);
		RCGCharacterCardMinterContract.safeMint(mapIdToAddress[_requestId]);
		RCGCharacterCardMinterContract.setValues(mapIdToWord7[_requestId]);
		RCGCharacterCardMinterContract.safeMint(mapIdToAddress[_requestId]);
		//withdrawLink(); 
    }
	//Edit Callback Gas Limit
	function changeCallbackGasLimit(uint32 _callbackGasLimit) public onlyOwner {
        callbackGasLimit = _callbackGasLimit;
    }
    //Transfer Ownership of Minter Contract if this contract needs to be redeployed
    function transferCCMinterOwnership(address _newOwner) public onlyOwner {
        RCGCharacterCardMinterContract.transferOwnership(_newOwner);
    }
	//Change Booster Pack Token Address if New Contract Deployed
    function changeRomeCgBoosterPackContractAddress(address _RomeCgBoosterPackContractAddress) public onlyOwner {
        RomeCgBoosterPackContractAddress = _RomeCgBoosterPackContractAddress;
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
    function withdrawETH(uint256 amount) public {
        address payable to = payable(address(owner()));
        to.transfer(amount);
    }
}