import * as PIXI from 'pixi.js';

let player, enemy;
let keys = {};
let bullets = [];
let score = 0,
  highScore = 0,
  bulletSpeed = 10,
  enemySpeed = 5;
let verticalDirection = 'up',
  horizontalDirection = 'right';
const animatedDiv = document.querySelector('.animated-div');
const audio = document.querySelector('#audio');

let app = new PIXI.Application({
  width: window.innerWidth, // default: 800
  height: window.innerHeight, // default: 600
  antialias: true, // default: false
  transparent: true,
  autoResize: true,
});
app.renderer.view.style.display = 'block';
animatedDiv.appendChild(app.view);

// first sprite

player = new PIXI.Sprite.from('assets/player.png');
player.anchor.set(0.5);
player.x = app.view.width / 2;
player.y = app.view.height / 2;
app.stage.addChild(player);

// enemy sprite
const spawnEnemy = () => {
  enemy = new PIXI.Sprite.from('assets/enemy.png');
  enemy.x = Math.random() * app.view.width;
  enemy.y = Math.random() * app.view.height;
  app.stage.addChild(enemy);
};

//spawn first enemy
spawnEnemy();

const updateEnemy = () => {
  if (verticalDirection === 'up') {
    enemy.y -= enemySpeed;
  }
  if (verticalDirection === 'down') {
    enemy.y += enemySpeed;
  }
  if (horizontalDirection === 'right') {
    enemy.x += enemySpeed;
  }
  if (horizontalDirection === 'left') {
    enemy.x -= enemySpeed;
  }
};

// score card
const style = new PIXI.TextStyle({
  fontFamily: 'Roboto',
  fill: ['#ffffff'],
  fontSize: 16,
});
const scoreCard = new PIXI.Text('Score: ' + score, style);
app.stage.addChild(scoreCard);

// high score card
if (localStorage.getItem('highScore')) {
  highScore = localStorage.getItem('highScore');
}
const highScoreCard = new PIXI.Text('High Score: ' + highScore, style);
highScoreCard.anchor.set(1, 0);
highScoreCard.x = app.view.width;
app.stage.addChild(highScoreCard);

// control using mouse
app.stage.interactive = true;
const movePlayer = (e) => {
  // e contains the entire event data. We'll extract it
  let pos = e.data.global;

  player.x = pos.x;
  player.y = pos.y;
};
app.stage.on('pointermove', movePlayer);

// control using keyboard
const keydown = (e) => {
  keys[e.keyCode] = true;
};
const keyup = (e) => {
  keys[e.keyCode] = false;
};
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

const collision = (first, second) => {
  let firstBox = first.getBounds();
  let secondBox = second.getBounds();

  return (
    firstBox.x + firstBox.width > secondBox.x &&
    firstBox.x < secondBox.x + secondBox.width &&
    firstBox.y + firstBox.height > secondBox.y &&
    firstBox.y < secondBox.y + secondBox.height
  );
};

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
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].position.y -= bullets[i].speed;

    if (bullets[i].position.y < 0) {
      bullets[i].dead = true;
    }
  }

  // check if bullet hits the enemy and remove it if so
  for (let i = 0; i < bullets.length; i++) {
    if (collision(bullets[i], enemy)) {
      app.stage.removeChild(enemy);
      enemySpeed += 1;
      bulletSpeed += 0.5;
      score += 1;
      scoreCard.text = 'Score: ' + score;
      spawnEnemy();
    }
    if (bullets[i].dead) {
      app.stage.removeChild(bullets[i]);
      bullets.splice(i, 1);
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
  if(keys['77']) {
	  audio.pause();
  }
  if(keys['80']) {
	  audio.play();
  }

  updateBullets(delta);
  updateEnemy();

  if (enemy.x > app.view.width) {
    horizontalDirection = 'left';
  }
  if (enemy.x < 0) {
    horizontalDirection = 'right';
  }
  if (enemy.y > app.view.height) {
    verticalDirection = 'up';
  }
  if (enemy.y < 0) {
    verticalDirection = 'down';
  }

  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
    highScoreCard.text = 'High Score: ' + highScore;
  }
};

// add the gameLoop to event loop so it executes
app.ticker.add(gameLoop);
