<!DOCTYPE html>
<html>
<head>
	<title>Rome Card Game</title>
	
	<!--?php  //Cookie Consent for EU
		$europe = array('AD', 'AL', 'AT', 'AX', 'BA', 'BE', 'BG', 'BY', 'CH', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FO', 'FR', 'GB', 'GG', 'GI', 'GR', 'HR', 'HU', 'IE', 'IM', 'IS', 'IT', 'JE', 'LI', 'LT', 'LU', 'LV', 'MC', 'MD', 'ME', 'MK', 'MT', 'NL', 'NO', 'PL', 'PT', 'RO', 'RS', 'RU', 'SE', 'SI', 'SJ', 'SK', 'SM', 'UA', 'VA');
		
		$country_code = $_SERVER["HTTP_CF_IPCOUNTRY"];
		
		if(in_array($country_code, $europe)) {
			  echo'<script type="text/javascript">
				window.cookieconsent_options = {"message":"This website uses cookies from Google to analyze traffic and personalize advertisements. Information about your use of this site is shared with Google.","dismiss":"Got it!","learnMore":"More info","link":"http://www.ereadingworksheets.com/e-reading-worksheets/privacy-policy/","theme":"dark-top"};
			</script>
			
			<script type="text/javascript" src="//s3.amazonaws.com/cc.silktide.com/cookieconsent.latest.min.js"></script>';
		} 
	
	?-->
	<!-- Font -->
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
	
	<style type="text/css">
		html,body {
			background-color: #C72C27;
			color: #fff;
			font-family: 'Press Start 2P', cursive;
			margin: 0;
			padding: 0;
			font-size: 12pt;
		}
		
		#canvas {
			position: absolute;
			left: 0;
			top: 100;
			margin: auto;
		}

		/* Tall Screen */
		@media only screen 
		  and (min-height: 1200px) { 

		}
		
	</style>
	
	<!-- Web3 -->
	<!-- script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"></script-->
	<script type="text/javascript" src="/dist/web3.min.js"></script>
	<?php require_once($_SERVER['DOCUMENT_ROOT'] . '/code/js/card-checker.php'); ?>
	<?php require_once($_SERVER['DOCUMENT_ROOT'] . '/code/js/wallet-connect.php'); ?>
		
	
	<script type="text/javascript">
		/*Preload Title Screen Images*/
		var tsImage = new Image();
		tsImage.src = 'media/buttons-and-logos/title-screen-main.png';
		
		var conbut = new Image();
		conbut.src = 'media/buttons-and-logos/continue-button.png';
		
		var ngbut = new Image();
		ngbut.src = 'media/buttons-and-logos/new-game-button.png';
		
		var dsImage = new Image();
		dsImage.src = 'media/buttons-and-logos/deck-screen-img.png';
		
		var menuUpBut = new Image();
		menuUpBut.src = 'media/buttons-and-logos/menu-up-button.png';
		var menuUpButDisabled = new Image();
		menuUpButDisabled.src = 'media/buttons-and-logos/menu-up-button-disabled.png';
		
		var menuDownBut = new Image();
		menuDownBut.src = 'media/buttons-and-logos/menu-down-button.png';
		var menuDownButDisabled = new Image();
		menuDownButDisabled.src = 'media/buttons-and-logos/menu-down-button-disabled.png';
	</script>
	
	<script type="text/javascript" src="lib/impact/impact.js"></script>
	<script type="text/javascript" src="lib/game/main.js"></script>
	
	<!--Disable the Backspace Button-->
	<script type="text/javascript">
		    function killBackSpace(e) {
			   e = e ? e : window.event;
			   var t = e.target ? e.target : e.srcElement ? e.srcElement : null;
			   if (t && t.tagName && (t.type && /(password)|(text)|(file)/.test(t.type.toLowerCase())) || t.tagName.toLowerCase() == 'textarea')
				  return true;
			   var k = e.keyCode ? e.keyCode : e.which ? e.which : null;
			   if (k == 8) {
				  if (e.preventDefault)
					 e.preventDefault();
				  return false;
			   };
			   return true;
		    };
		 
		    if (typeof document.addEventListener != 'undefined')
			   document.addEventListener('keydown', killBackSpace, false);
		    else if (typeof document.attachEvent != 'undefined')
			   document.attachEvent('onkeydown', killBackSpace);
		    else {
			   if (document.onkeydown != null) {
				  var oldOnkeydown = document.onkeydown;
				  document.onkeydown = function(e) {
				  oldOnkeydown(e);
				  killBackSpace(e);
				  };
			   }
		 
			   else
				  document.onkeydown = killBackSpace;
		    }
	</script>
	
	
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	
	<meta name="description" content="This is a game template that I use to develop reading games.">
	<meta property="og:url" content="https://doncodes.com/game-template/" />
	<meta property="og:title" content="Game Template | Reading Comprehension Game Template" />
	<meta property="og:description" content="This is a game template that I use to develop reading games." /> 
	<meta property="og:image" content="https://ereadinggames.com/images/idiom-unicorn-fb.jpg" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />

	<meta name="twitter:image" content="https://ereadinggames.com/images/idiom-unicorn-tw.jpg">
	<meta name="twitter:card" content="summary_large_image">
	<meta name="twitter:creator" content="@donzomortini">
	<meta name="twitter:title" content="Rome Card Game">
	<meta name="twitter:description" content="This is a game template that I use to develop reading games.">
	
</head>
<body>
	<canvas id="canvas"><font color="#FEFF04"><center>You are using an outdated browser. Why don't you download <a href='http://www.google.com/chrome'>Chrome</a>?</center></font></canvas>
</body>
<footer>
	<!-- ABI FOR WEB 3 STUFF -->
	<?php require_once($_SERVER['DOCUMENT_ROOT'] . '/code/js/abi1.php'); ?>
	<!-- ABI FOR WEB 3 STUFF -->
	<?php require_once($_SERVER['DOCUMENT_ROOT'] . '/code/js/abi2.php'); ?>
</footer>
</html>
