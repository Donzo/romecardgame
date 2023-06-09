// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

interface RomeCgBoosterPack { //CHANGE HERE
	function transferFrom(address, address, uint) external returns (bool); //from to amount
    function transfer(address, uint256) external returns (bool);
	function allowance(address, address) external returns (uint256); //owner, spender
    function balanceOf(address) external returns (uint256); 
}

contract Vendor is Ownable {

  // Our Token Contract
  RomeCgBoosterPack RomeCgBoosterPackContract;
  address public RomeCgBoosterPackContractAddress = 0x3646d122335f75f0C0C2F389B11eE1fc0C407Cf2;

  // token price for ETH
  uint256 public tokensPerEth = 10;
  //0.1 ETH Price Initally

  // Event that log buy operation
  event BuyTokens(address buyer, uint256 amountOfETH, uint256 amountOfTokens);

  constructor(address _tokenAddress) {
    RomeCgBoosterPackContract = RomeCgBoosterPack(_tokenAddress);
  }

  /**
  * @notice Allow users to buy token for ETH
  */
  function buyTokens() public payable returns (uint256 tokenAmount) {
    require(msg.value > 0, "Send ETH to buy some tokens");

    uint256 amountToBuy = msg.value * tokensPerEth;

    // check if the Vendor Contract has enough amount of tokens for the transaction
    uint256 vendorBalance = RomeCgBoosterPackContract.balanceOf(address(this));
    require(vendorBalance >= amountToBuy, "Not ENOUGH PACK tokens in this Vendor Contract");

    // Transfer token to the msg.sender
    (bool sent) = RomeCgBoosterPackContract.transfer(msg.sender, amountToBuy);
    require(sent, "Failed to transfer token to user");

    // emit the event
    emit BuyTokens(msg.sender, msg.value, amountToBuy);

    return amountToBuy;
  }

  /**
  * @notice Allow the owner of the contract to withdraw ETH
  */
  function withdraw() public onlyOwner {
    uint256 ownerBalance = address(this).balance;
    require(ownerBalance > 0, "Owner has not balance to withdraw");

    (bool sent,) = msg.sender.call{value: address(this).balance}("");
    require(sent, "Failed to send user balance back to the owner");
  }
}