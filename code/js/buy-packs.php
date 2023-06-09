	<script>
		
		var boosterPackTokenAddress = '0x3646d122335f75f0C0C2F389B11eE1fc0C407Cf2';
		var vendorContractAddress = '0x38Cb8E06d0d9E840Ac297e92428f210daE29Fb3e';
		var openPackContractAddress = '0x2aa1467c7BEE04C0e2bC83621e240b132E407063';
		
		var packBalance = "0"
			
		var loadingWheelDiv = document.getElementById("loading-wheel-div");
		var confirmMes = document.getElementById("confirmation-message"); 
		var sliderUnit = document.getElementById("purchase-packs-slider-unit");
		var buyButtonDiv = document.getElementById("buy-button-div");
		var waitingMSG = document.getElementById("waiting-msg"); 
		var pulledCardsDiv = document.getElementById("pulled-cards-div"); 
	
		var approving = false;
		var approvingComplete = false;
		var purchasing = false;
		var purchaseComplete = false;
		var openingPack = false;
		var waitingForOracle = false;
		var oracleReturnDisplay = false;
		
		var userPackBalance = 0;
		
		async function checkIfUserHasPacks(){
			let web3 = new Web3(Web3.givenProvider);
			var contract = new web3.eth.Contract(abi2, boosterPackTokenAddress, {});
			balance = await contract.methods.balanceOf(window['userAccountNumber']).call();
			userPackBalance = balance * .000000000000000001;
			userPackBalance = userPackBalance.toFixed(1)
			//document.getElementById("packsLeft").innerHTML = packBalance;
			console.log('userPackBalance = ' + userPackBalance);
			if (userPackBalance >= 1){
				var checkbox = document.getElementById("tosCheckBox");
				var conJPack = userPackBalance == 1 ? "PACK" : "PACKS";
				console.log('user has packs and can open them');
				

				document.getElementById("users-packs-message").innerHTML = "You have " + userPackBalance + " " + conJPack + " left. <br/>Click the Button Below to Open One";
				if (checkbox.checked) {
					enableOpenButton('OPEN PACK');					
				}
				else{
					disableOpenButton('AGREE TO TOS TO OPEN PACK');
				}
			}
			else{
				document.getElementById("users-packs-message").innerHTML = "You don't have any PACKS.<br/>Buy PACKS to open them.";
				document.getElementById("open-packs-div").innerHTML = "";
			}
			
		}
		function disableOpenButton(msg){
			document.getElementById("open-packs-div").innerHTML = "<button id='open-pack-button' class='disabledbutton' disabled>" + msg + "</button>";
		}
		function enableOpenButton(msg){
			document.getElementById("open-packs-div").innerHTML = "<button id='open-pack-button' class='button' onclick='checkPackAllowance()'>" + msg + "</button>";
		}
		async function checkPackAllowance(){
			
			//First Check Allowance
			let web3 = new Web3(Web3.givenProvider);
				
			var contract = new web3.eth.Contract(abi2, boosterPackTokenAddress, {});
			const allowance = await contract.methods.allowance(window['userAccountNumber'], openPackContractAddress).call();
			console.log('my PACKS allowance = ' + allowance);
		
			if (parseInt(allowance) < 1000000000000000000){
				approving = true;
				approvingComplete = true;
				console.log('You need to approve this contract to spend your PACK.');
				var amount = 9999999999999999;
				var approveNum =  web3.utils.toWei(amount.toString(), 'ether')
				alert("You need to approve this contract to spend your PACK.");
				const approveAmount = await contract.methods.approve(openPackContractAddress,approveNum).send({
					from: window['userAccountNumber']
				}).on('transactionHash', function(hash){
					displayApproval();
				}).on('receipt', function(receipt){
					displayApprovalComplete();
					console.log('PACK spend approved. Ready to open a PACK.');
					openAPack();			
				});
			}
			else{
				openAPack();
			}
		
		}
		async function openAPack(){
			let web3 = new Web3(Web3.givenProvider);
			var contract = new web3.eth.Contract(abi4, openPackContractAddress, {});
			openingPack = false;
			waitingForOracle = false;
			document.getElementById("tosCheckBox").disabled = true;
			await contract.methods.openPack().send({
				from: window['userAccountNumber'],
				//value: web3.utils.toWei(sendEth, "ether"),
				//value: web3.utils.toWei("0.1", "ether"), 
				//value: web3.utils.toWei(payThis, "ether"), 
				gas: 1500000,
				maxPriorityFeePerGas:5000000000
			
			}).on('transactionHash', function(hash){
				displayOpenPack();
			}).on('receipt', function(receipt){
				displayWaitingForOracle();
				waitForOracle();				
			});
		}
		
		async function findPacksRemaining(){
			let web3 = new Web3(Web3.givenProvider);
			var contract = new web3.eth.Contract(abi2, boosterPackTokenAddress, {});
			balance = await contract.methods.balanceOf(vendorContractAddress).call();
			packBalance = (balance * .000000000000000001);
			document.getElementById("packsLeft").innerHTML = packBalance.toFixed(0);;
			
			if (packBalance < 1){
				document.getElementById("pack-balance-div").innerHTML = "SOLD OUT!";
				sliderUnit.className = "hide";
				buyButtonDiv.className = "hide";
			}
			
		}
		findPacksRemaining();
		
		async function buyPacks(amount){
			document.getElementById("tosCheckBox").disabled = true;
			var payThis = costToBuy.toFixed(1);
			let web3 = new Web3(Web3.givenProvider);
			var contract = new web3.eth.Contract(abi3, vendorContractAddress, {});
			confirmMes.className = "hide";
			
			
			await contract.methods.buyTokens().send({
				from: window['userAccountNumber'],
				//value: web3.utils.toWei(sendEth, "ether"),
				//value: web3.utils.toWei("0.1", "ether"), 
				value: web3.utils.toWei(payThis, "ether"), 
				gas: 1500000,
				maxPriorityFeePerGas:5000000000
			
			}).on('transactionHash', function(hash){
				displayPurchase();
			}).on('receipt', function(receipt){
				displayComplete();				
			});
		}
		
		async function waitForOracle(){
		
			let web3 = new Web3(Web3.givenProvider);
			var contract = new web3.eth.Contract(abi4, openPackContractAddress, {});
		 	oracleReturnDisplay = false;
			myRequestID = await contract.methods.lastRequestID.call();
			console.log('myRequestID = ' + myRequestID);
			contract.events.RequestFulfilled({
				filter: {requestId: myRequestID}, 
				fromBlock: "pending"
			}, function(error, event){ console.log(event); })
			.on('data', function(event){
				console.log("random num1 = " + event.returnValues.randomNum1);
				var num1 = event.returnValues.randomNum1;
				console.log("random num2 = " + event.returnValues.randomNum2);
				var num2 = event.returnValues.randomNum2;
				console.log("random num3 = " + event.returnValues.randomNum3);
				var num3 = event.returnValues.randomNum3;
				console.log("random num4 = " + event.returnValues.randomNum4);
				var num4 = event.returnValues.randomNum4;
				console.log("random num5 = " + event.returnValues.randomNum5);
				var num5 = event.returnValues.randomNum5;
				console.log("random num6 = " + event.returnValues.randomNum6);
				var num6 = event.returnValues.randomNum6;
				console.log("random num7 = " + event.returnValues.randomNum7);
				var num7 = event.returnValues.randomNum7;
				console.log(event);
				displayOracleReturn(num1, num2, num3, num4, num5, num6, num7);
			})
			.on('changed', function(event){
				console.log("changed:");
				console.log(event); 
				// remove event from local database
			})
			.on('error', console.error);
		}
		
		//////These are functions to change the UI so that the customer sees the loading wheel and such.
		
		function displayOpenPack(){
			if(openingPack != true){
				openingPack = true;
				loadingWheelDiv.className = "";
				document.getElementById("users-packs-message").className = "hide";
				sliderUnit.className = "hide";
				buyButtonDiv.className = "hide";
				waitingMSG.innerHTML = "Opening a Pack..."
				disableOpenButton('OPENING A PACK...');
			}
		}
		function displayWaitingForOracle(){
			if (waitingForOracle != true){
				waitingForOracle = true;
				waitingMSG.innerHTML = "Pack Opened...<br/> Waiting on Oracle.";
			}
		}
		function displayOracleReturn(num1, num2, num3, num4, num5, num6, num7){
			if (oracleReturnDisplay != true){
				oracleReturnDisplay = true;
				//pulledCardsDiv.innerHTML = "You got cards " + num1 + ", " + num2 + ", " + num3 + ", " + num4 + ", " + num5 + ", " + num6 + ", and " + num7 + "!";
				card1 = returnCardData(num1);
				card2 = returnCardData(num2);
				card3 = returnCardData(num3);
				card4 = returnCardData(num4);
				card5 = returnCardData(num5);
				card6 = returnCardData(num6);
				card7 = returnCardData(num7);
				displayCardData();
				loadingWheelDiv.className = "hide";
				checkIfUserHasPacks();
				document.getElementById("users-packs-message").className = "center-text users-packs-message";
				enableOpenButton('OPEN PACK');
				sliderUnit.className = "";
				buyButtonDiv.className = "";
				window.scrollTo(0, document.body.scrollHeight); //Scroll to bottom
			}
		}		
		function displayPurchase(){
			if (purchasing != true){
				loadingWheelDiv.className = "";
				sliderUnit.className = "hide";
				buyButtonDiv.className = "hide";
				purchasing = true;
				waitingMSG.innerHTML = "Buying Now..."
				document.getElementById("users-packs-message").className = "hide";
				disableOpenButton('Buying PACK');
			}
		}
		function displayComplete(){
			if (purchaseComplete != true){
				loadingWheelDiv.className = "hide";
				sliderUnit.className = "";
				buyButtonDiv.className = "";
				purchasing = true;
				confirmMes.className = "";
				purchaseComplete = true;
				console.log('purchase complete');
				document.getElementById("users-packs-message").className = "center-text users-packs-message";
				checkIfUserHasPacks();
				enableOpenButton('OPEN PACK');
				window.scrollTo(0, document.body.scrollHeight); //Scroll to bottom
			}
		}
		function displayApproval(){
			if (approving){
				confirmMes.className = "hide";
				loadingWheelDiv.className = "";
				sliderUnit.className = "hide";
				buyButtonDiv.className = "hide";
				approving = false;
				waitingMSG.innerHTML = "Approving your PACK spend..."
				document.getElementById("users-packs-message").className = "hide";
				disableOpenButton('Approving PACK Spend');
			}
		}
		function displayApprovalComplete(){
			if (approvingComplete){
				sliderUnit.className = "";
				buyButtonDiv.className = "";
				loadingWheelDiv.className = "hide";
				approvingComplete = false;
				document.getElementById("users-packs-message").className = "center-text users-packs-message";
				disableOpenButton('Opening your PACK');
			}
		}
	</script>