var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
	var str = [1,2,3,4,5];
	str = str.splice(0, 1);
	console.log(str);

	game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);

    game.load.image('ground_1x1', 'assets/ground_1x1.png');
    game.load.image('walls_1x2', 'assets/walls_1x2.png');
    game.load.image('tiles2', 'assets/tiles2.png');

    game.load.spritesheet('coin', 'assets/coin.png', 32, 32);

    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
	    game.load.spritesheet('monster', 'assets/dude.png', 32, 48);

}

var health = 150;
var cursors;
var map;
var coins;
var score = 0;
var scoreText;
var monsters = [];
var step;

var layer;
var layer2;
var sprite;

function create() {

	map = game.add.tilemap('map');

    map.addTilesetImage('ground_1x1');
    map.addTilesetImage('walls_1x2');
    map.addTilesetImage('tiles2');

    map.setCollisionBetween(1, 12);

    layer = map.createLayer('Tile Layer 1');

    layer2 = map.createLayer('Tile Layer 2');

    layer.resizeWorld();

	//  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
	scoreText = game.add.text(20,575, 'Score: 0',{ fontSize: '16px', fill: 'white'});
	scoreText.fixedToCamera = true;
	healthText = game.add.text(200,575, 'Health: 150',{ fontSize: '16px', fill: 'white'});
	healthText.fixedToCamera = true;
	
    //  A simple background for our game
    //game.add.sprite(0, 0, 'sky');

    //  Here we create our coins group
    coins = game.add.group();
    coins.enableBody = true;

    //  And now we convert all of the Tiled objects with an ID of 34 into sprites within the coins group
    map.createFromObjects('Object Layer 1', 34, 'coin', 0, true, false, coins);

    //  Add animations to all of the coin sprites
    coins.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5], 10, true);
    coins.callAll('animations.play', 'animations', 'spin');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    //platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    //platforms.enableBody = true;

    // Here we create the ground.
    //var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    //ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    //ground.body.immovable = true;

    //  Now let's create two ledges
    //var ledge = platforms.create(400, 400, 'ground');

    //ledge.body.immovable = true;

    //ledge = platforms.create(-150, 300, 'ground');

    //ledge.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');
	//monster = game.add.sprite(128, game.world.height - 150, 'monster');
	function createMonster(x, name){
	    game.load.spritesheet('monster', 'assets/dude.png', 32, 48);
		this.monster = game.add.sprite(x, game.world.height - 150, 'monster');
		game.physics.arcade.enable(this.monster);
		this.monster.body.bounce.y = 0.2;
		this.monster.body.gravity.y = 150;
		this.monster.body.collideWorldBounds = true;
		this.monster.healthText = game.add.text((this.monster.x)+7,(this.monster.y)-15, '20',{ fontSize: '16px', fill: 'white'});
		//this.healthText.destroy();
		this.monster.body.setSize(25, 44, 3, 4);
		//game.physics.arcade.collide(this.monster, layer);
		this.health = 20;
		this.monster.animations.add('left', [0, 1, 2, 3], 10, true);
		this.monster.animations.add('right', [5, 6, 7, 8], 10, true);
	}
// Tworze 3 potworki
monsters.push(new createMonster(100, 'monster1'));
monsters.push(new createMonster(250, 'monster2'));
monsters.push(new createMonster(300, 'monster3'));
monsters.push(new createMonster(350, 'monster4'));
monsters.push(new createMonster(450, 'monster4'));
monsters.push(new createMonster(550, 'monster4'));
		function monsterWalk(){
    monsters[0].monster.body.velocity.x = 150;
    monsters[0].monster.animations.play('right');
	}

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);
	
    // Resize world
    //game.world.resize(6000, 600);

    // Camera follow the player
    game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);

    // Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 450;
    player.body.collideWorldBounds = true;
    player.body.setSize(25, 44, 3, 4);
	


    // Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    cursors = game.input.keyboard.createCursorKeys();

    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


}

function update() {

	//game.physics.arcade.collide(player, platforms);
	game.physics.arcade.collide(player, layer);
	for (var i=0;i<monsters.length;i++){
		game.physics.arcade.collide(monsters[i].monster, layer); // jak daje i zamiast 0 to nie dziala WTF
		game.physics.arcade.overlap(player, monsters[i].monster, playerStepOnMonster);
		monsters[i].monster.healthText.x=(monsters[i].monster.x)+7;
		monsters[i].monster.healthText.y=(monsters[i].monster.y)-15;
	}
	for(var j=0;j<monsters.length;j++){
		for(var k=0;k<monsters.length;k++)
		{
				game.physics.arcade.collide(monsters[j].monster, monsters[k].monster); // jak daje i zamiast 0 to nie dziala WTF
		}
	}
	
	
	/*for(var j=0;j<=monsters.length;j++){
		var kierunek = Math.round(Math.random()*100)
		if(monsters[i].monster.x < game.world.centerX){
			monsters[i].monster.body.velocity.x = 150;
			monsters[i].monster.animations.play('right');
		}
	else{
		 monsters[i].monster.body.velocity.x = -150;
		 monsters[i].monster.animations.play('left');
		}
	}*/
	walk();
	game.physics.arcade.overlap(player, coins, collectCoin, null, this);
	//game.physics.arcade.overlap(player, monster, playerStepOnMonster, null, this);
	game.debug.body(player);


	 //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
	

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }

    //  Allow the player to jump if they are touching the ground.
    
	if ((cursors.up.isDown || jumpButton.isDown) && player.body.onFloor())
    // if ((cursors.up.isDown || jumpButton.isDown) && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }


function collectCoin(player, coin) {

    coin.kill();
	score += 10;

	scoreText.text = 'Score: '+ score;


}
function playerStepOnMonster(player, monster) {

	//console.log(player);
	//console.log(monster);
	//console.log(random._text);
	monster.healthText.destroy();
	player.y=player.y-20;
    monster.kill();
	

	health -= 20;
	healthText.text = 'Health: '+ health;
	

}

}
/*
function walk(){
		var d = new Date();
		var n = d.getSeconds()%10;
//console.log(n);
for(var i=0;i<monsters.length;i++){	
		var kierunek = Math.round(Math.random()*2)
		if(n+kierunek>8){
			monsters[i].monster.body.velocity.x = 150;
			monsters[i].monster.animations.play('right');
					if(((n+kierunek)%4)==0){
			monsters[i].monster.body.velocity.y = -150;
		}
		}
		else if(n+kierunek<8){
			monsters[i].monster.body.velocity.x = -150;
			monsters[i].monster.animations.play('left');
		}
	}
}
	walk();
*/
