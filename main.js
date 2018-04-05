const game = new Phaser.Game(1250,570,Phaser.CANVAS,'gameDiv');
let spacefield;
let backgroundv;
let player;
let cursors;
let bullets;
let bulletTime = 0;
let fireButton;
let enemies;
let score = 0;
let scoreText;
let winText;
let mainState = {
	preload: () => {
		game.load.image('starfield', "assets/starfield.png")
		game.load.image('player', "assets/ship1.png");
		game.load.image('bullet',"assets/bullet4.png")
		game.load.image('enemy', "assets/Ghost1.png")
	},
	create: () => {
		spacefield = game.add.tileSprite(0,0,1250,570,'starfield');
		backgroundv = 5;

			player = game.add.sprite(game.world.centerX -40,game.world.centerY + 170, 'player')
			game.physics.enable(player,Phaser.Physics.ARCADE);
			cursors = game.input.keyboard.createCursorKeys();
			bullets = game.add.group();
			bullets.enableBody = true;
			bullets.physicsBodyType = Phaser.Physics.ARCADE;
			bullets.createMultiple(30, 'bullet');
			bullets.setAll('anchor.x', -1.60);
			bullets.setAll('anchor.y',0.50);
			bullets.setAll('outOfBoundsKill', true);
			bullets.setAll('checkWorldBounds', true);

			fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

			enemies = game.add.group();
			enemies.enableBody = true;
			enemies.physicsBodyType = Phaser.Physics.ARCADE;

			createEnemies();

			scoreText = game.add.text(0,500,'Score:',{font: '32px Arial', fill: '#fff'});
			winText = game.add.text(game.world.centerX,game.world.centerY, 'You Win!', {font:'32px Arial', fill:'#fff'});
			winText.visible = false;

	},
	update: () => {

		game.physics.arcade.overlap(bullets,enemies,collisionHandler,null,this);

		player.body.velocity.x = 0;

		spacefield.tilePosition.y += backgroundv;
		if(cursors.left.isDown){
			player.body.velocity.x = -350;
		}
		if(cursors.right.isDown){
			player.body.velocity.x = 350;
		}
		if(fireButton.isDown){
			fireBullet();
		}

		scoreText.text = 'Score:' + score;

		if(score == 4000){
			winText.visible = true;
			scoreText.visible = false;
		}
	}
}

function fireBullet(){
	if(game.time.now > bulletTime){
		bullet = bullets.getFirstExists(false);

		if(bullet){
			bullet.reset(player.x,player.y);
			bullet.body.velocity.y = -400;
			bulletTime = game.time.now + 200;
		}
	}
}

function createEnemies(){
	for(var y = 0; y< 4; y++){
		for(var x = 0; x < 10; x++){
			let enemy = enemies.create(x*90,y*70,'enemy');
			enemy.anchor.setTo(0.5,0.5);
		}
	}
	enemies.x = 60;
	enemies.y = 50;

	var tween = game.add.tween(enemies).to({x:380}, 2000, Phaser.Easing.Linear.None,true,0,1000,true);
	tween.onRepeat.add(descend,this);
}

function descend(){
	enemies.y += 30;
}

function collisionHandler(bullet, enemy){
	bullet.kill();
	enemy.kill();
	score += 100;
}
	
game.state.add('mainState', mainState);
game.state.start('mainState');
