import * as PIXI from 'pixi.js';

const animatedDiv = document.querySelector('.animated-div');
let keys = {};
let bullets = [];
const bulletSpeed = 10;

let app = new PIXI.Application({
	width: window.innerWidth, // default: 800
	height: window.innerHeight, // default: 600
	antialias: true, // default: false
	backgroundColor: 0x061639,
	autoResize: true,
});
app.renderer.view.style.display = 'block';
animatedDiv.appendChild(app.view);

// first sprite

let player = new PIXI.Sprite.from('assets/player.png');
player.anchor.set(0.5);
player.x = app.view.width / 2;
player.y = app.view.height / 2;
app.stage.addChild(player);

// control using mouse
// app.stage.interactive = true;
// const movePlayer = (e) => {
// 	// e contains the entire event data. We'll extract it
// 	let pos = e.data.global;

// 	player.x = pos.x;
// 	player.y = pos.y;
// };
// app.stage.on('pointermove', movePlayer);

// control using keyboard
const keydown = (e) => {
	keys[e.keyCode] = true;
};
const keyup = (e) => {
	keys[e.keyCode] = false;
};
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

/* manage bullet fire system from here */
// create a bullet
const createBullet = () => {
	let bullet = new PIXI.Sprite.from('assets/bullet.png');
	bullet.anchor.set(0.5);
	bullet.x = player.x;
	bullet.y = player.y;
	bullet.speed = bulletSpeed;
	app.stage.addChild(bullet);
	return bullet;
};

// fire a bullet
const fireBullet = () => {
	console.log('Fired!!');
	let bullet = createBullet();
	bullets.push(bullet);
};

// manage the array of bullets and move each bullet
const updateBullets = (delta) => {
	for(let i = 0; i < bullets.length; i++) {
        bullets[i].position.y -= bullets[i].speed;

        if(bullets[i].position.y < 0){
            bullets[i].dead = true;
        }
    }

    for (let i = 0; i < bullets.length; i++) {
		if (bullets[i].dead) {
            app.stage.removeChild(bullets[i]);
            bullets.splice(i,1);
		}
    }
};

// add an eventlistener for mouse click
animatedDiv.addEventListener('pointerdown', fireBullet);

// create a function to will be attached to the event loop in background
const gameLoop = (delta) => {
	if (keys['37'] || keys['65']) {
		player.x -= 10;
	}
	if (keys['38'] || keys['87']) {
		player.y -= 10;
	}
	if (keys['39'] || keys['68']) {
		player.x += 10;
	}
	if (keys['40'] || keys['83']) {
		player.y += 10;
	}

	updateBullets(delta);
};

// add the gameLoop to event loop so it executes
app.ticker.add(gameLoop);
