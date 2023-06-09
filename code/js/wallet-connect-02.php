<script>
		//NFT MINTER ADDRESS
		var tokenContract = '0x3646d122335f75f0C0C2F389B11eE1fc0C407Cf2';	
		
		async function connectMyWallet() {
			
			
			try {
				await ethereum.request({ method: 'eth_requestAccounts' });
			}
			catch(error){
				alert('somethings wrong with your wallet.');
			}
			
			const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
			const account = accounts[0];
			
		
			if (account){
				window['userAccountNumber'] = account;
			}
			else{
				console.log('no account num.')
			}
			
			//Create Web3 Object
			let web3 = new Web3(Web3.givenProvider);
									
			//Get Provider
			web3.eth.net.getId().then(
				function(value) {
					provider = value;
					if (provider){
	  					console.log('initial provider: ' + provider);
	  					reportProvider();
	  				}		
  				}	
  			);			
		}
		function reportProvider(){
			
			//Get chainId
			if (window.ethereum){
				chainId = window.ethereum.chainId;
			}
			
			//Get networkName		
			if (chainId == "0x5" || provider == 5){
  				networkName = "Goerli";
  			}
			else if (chainId == "0xa86a" || provider == 43114){
				console.log('User is on Avalanche C-Chain.');
			}
			else if (chainId == "0x1" || provider == 1){
  				networkName = "ethereum";
  			}
  			else if (chainId == "0x2a" || provider == 42){
  				networkName = "kovan";
  			}
  			else if (chainId == "0x89" || provider == 137){
  				networkName = "polygon";
  			}
  			else if (chainId == "0x4" || provider == 4){
  				networkName = "rinkeby";
  			}
  			else if (chainId == "0xa4b1" || provider == 42161){
  				networkName = "arbitrum";
  			}
  			else if (window.ethereum) {
  		 		chainId = window.ethereum.chainId;
  		 		networkName = "Ethereum?";
			}
  			else{
  				networkName = "unhandled network";
  			}
  			
  			console.log('User is on ' + networkName + ' with ID number ' + provider + ' and chainid ' + chainId + '.');
  			
  			if (chainId == "0x5" && provider == 5){
  				checkIfUserHasPacks();
			}	
  			else{
  				//Get on Goerli
  				switchNetwork(7);
  			}
  			
  			
		}
		async function switchNetwork(which){
			//Polygon
			var theChainID = '0x89';
			var theRPCURL = 'https://polygon-rpc.com';
			var nn = false;
			
			if (which == 1){
				//AVAX
				theChainID = '0xa86a';
				theRPCURL = 'https://api.avax.network/ext/bc/C/rpc';
				nn = "avalanche";
			}
			else if (which == 2){
				//Polygon
				theChainID = '0x89';
				theRPCURL = 'https://polygon-rpc.com';
				nn = "polygon";
			}
			else if (which == 3){
				//Mainnet
				theChainID = '0x1';
				theRPCURL = 'https://main-light.eth.linkpool.io/';
				nn = "ethereum";
			}
			else if (which == 4){
				//Kovan
				theChainID = '0x2a';
				theRPCURL = 'https://kovan.infura.io';
				nn = "kovan";
			}
			else if (which == 5){
				//Rinkeby
				theChainID = '0x4';
				theRPCURL = 'https://rinkeby-light.eth.linkpool.io/';
				nn = "rinkeby";
			}
			else if (which == 6){
				//Arbitrum
				theChainID = '0xa4b1';
				theRPCURL = 'https://arb1.arbitrum.io/rpc';
				nn = 'arbitrum';
			}
			else if (which == 7){
				//Goerli
				theChainID = '0x5';
				theRPCURL = 'https://goerli.infura.io/v3/';
				nn = 'goerli';
			}
			
			try {
					await window.ethereum.request({
						method: 'wallet_switchEthereumChain',
						params: [{ chainId: theChainID }],
					});
				} catch (switchError) {
  				// This error code indicates that the chain has not been added to MetaMask.
				if (switchError.code === 4902) {
					try {
						await window.ethereum.request({
							method: 'wallet_addEthereumChain',
							params: [{ chainId: theChainID, rpcUrl: theRPCURL}],
						});
						checkIfUserHasPacks();
					}
					catch (addError) {
						switchNetwork(which)
					}
				}
			}
		}
	</script>