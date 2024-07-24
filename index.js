const fps = 144;
const canvas = document.getElementById("gameScreen");
const context = canvas.getContext("2d");

//sound
const fxLaser = new Sound("sounds/laserShoot.wav", 10);
const fxExplode = new Sound("sounds/explosion.wav");
const fxThrust = new Sound("sounds/thrust.wav", 2, 0.5);
const fxHit = new Sound("sounds/hitHurt.wav", 10);

const turn_speed = 360;
const thrust_strength = 5;
const friction = 0.5;
const asteroidSize = 100;
const asteroidSpeed = 50;
const asteroidVert = 10;
const asteroidRand = 0.3;
const showBounding = false;
const shipExplodeDuration = 0.3;
const shipInvurnebility = 3;
const shipInvurnebilityBlink = 0.1;
const laserMax = 20;
const laserSpeed = 500;
const laserDistance = 0.6;
const laserExplodeDuration = 0.1;
const textFadeTime = 2.5;
const textSize = 40;
const gameLives = 3;
const asteroidPointsLarge = 20;
const asteroidPointsMedium = 50;
const asteroidPointsSmall = 100;
const savekeyHighscore = "highscore";
const soundOn = true;
const color1 = "#468585";
const color2 = "#DEF9C4"
const color3 = "#9CDBA6"

let asteroidsNum = 3;

//setup game
let powerups = [];
let level;
let ship;
let asteroids;
let text;
let textAlpha;
let lives;
let score;
let highScore;
let powerupLevel;
newGame();

function newGame(){
    powerups = [];
    score = 0;
    lives = gameLives;
    level = 0;
    ship = newShip();
    powerupLevel = 0;

    //get highscore from local storage
    let scoreStr = localStorage.getItem(savekeyHighscore);
    if(scoreStr == null){
        highScore = 0;
    }
    else{
        highScore = parseInt(scoreStr);
    }

    newLevel();
}

function gameOver(){
    ship.dead = true;
    text = "You died";
    textAlpha = 1.0;
}

function newLevel(){
    createAsteroids();
    text = "Level " + (level + 1);
    textAlpha = 1.0;
}

function drawShip(x, y, a){
    context.strokeStyle = color2;
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(
        x + 4 / 3 * ship.r * Math.cos(a),
        y - 4 / 3 * ship.r * Math.sin(a)
    );
    context.lineTo(
        x - ship.r * (2 / 3 * Math.cos(a) + Math.sin(a)),
        y + ship.r * (2 / 3 * Math.sin(a) - Math.cos(a))
    );
    context.lineTo(
        x - ship.r * (2 / 3 * Math.cos(a) - Math.sin(a)),
        y + ship.r * (2 / 3 * Math.sin(a) + Math.cos(a))
    );
    context.closePath();
    context.stroke();
}

function newShip(){
    return {
        x: canvas.width / 2,
        y: canvas.height / 2,
        r: 30 / 2,
        a: 90 / 180 * Math.PI,
        rot: 0,
        thrusting: false,
        thrust: {
            x: 0,
            y: 0
        },
        explodeTime: 0,
        blinkTime: Math.ceil(shipInvurnebilityBlink * fps),
        blinkNum: Math.ceil(shipInvurnebility / shipInvurnebilityBlink),
        canShoot: true,
        lasers: [],
        dead: false
    };
}

function newPowerup(x, y, r = 20) {
    if(Math.random() > 0.95){
        powerups.push({x, y, r});
    }
}

function shootLaser() {
    //create laser
    if(ship.canShoot && ship.lasers.length < laserMax && powerupLevel == 0){
        ship.lasers.push({
            x: ship.x + 4 / 3 * ship.r * Math.cos(ship.a),
            y: ship.y - 4 / 3 * ship.r * Math.sin(ship.a),
            xv: laserSpeed * Math.cos(ship.a) / fps,
            yv: -laserSpeed * Math.sin(ship.a) / fps,
            distance: 0,
            explodeTime: 0
        });
        fxLaser.currentTime = 0;
        fxLaser.play();
    }
    else if(ship.canShoot && ship.lasers.length < laserMax && powerupLevel == 1){
        ship.lasers.push({
            x: ship.x + 4 / 3 * ship.r * Math.cos(ship.a) + Math.cos(ship.a) * 5,
            y: ship.y - 4 / 3 * ship.r * Math.sin(ship.a) + Math.sin(ship.a) * 5,
            xv: laserSpeed * Math.cos(ship.a) / fps,
            yv: -laserSpeed * Math.sin(ship.a) / fps,
            distance: 0,
            explodeTime: 0
        });
        ship.lasers.push({
            x: ship.x + 4 / 3 * ship.r * Math.cos(ship.a) - Math.cos(ship.a) * 5,
            y: ship.y - 4 / 3 * ship.r * Math.sin(ship.a) - Math.sin(ship.a) * 5,
            xv: laserSpeed * Math.cos(ship.a) / fps,
            yv: -laserSpeed * Math.sin(ship.a) / fps,
            distance: 0,
            explodeTime: 0
        });
        fxLaser.currentTime = 0;
        fxLaser.play();
    }
    else if(ship.canShoot && ship.lasers.length < laserMax && powerupLevel == 2){
        ship.lasers.push({
            x: ship.x + 4 / 3 * ship.r * Math.cos(ship.a) + Math.cos(ship.a) * 8,
            y: ship.y - 4 / 3 * ship.r * Math.sin(ship.a) + Math.sin(ship.a) * 8,
            xv: laserSpeed * Math.cos(ship.a) / fps,
            yv: -laserSpeed * Math.sin(ship.a) / fps,
            distance: 0,
            explodeTime: 0
        });
        ship.lasers.push({
            x: ship.x + 4 / 3 * ship.r * Math.cos(ship.a) - Math.cos(ship.a) * 8,
            y: ship.y - 4 / 3 * ship.r * Math.sin(ship.a) - Math.sin(ship.a) * 8,
            xv: laserSpeed * Math.cos(ship.a) / fps,
            yv: -laserSpeed * Math.sin(ship.a) / fps,
            distance: 0,
            explodeTime: 0
        });
        ship.lasers.push({
            x: ship.x + 4 / 3 * ship.r * Math.cos(ship.a) + Math.cos(ship.a) * 12,
            y: ship.y - 4 / 3 * ship.r * Math.sin(ship.a) + Math.sin(ship.a) * 12,
            xv: laserSpeed * Math.cos(ship.a) / fps,
            yv: -laserSpeed * Math.sin(ship.a) / fps,
            distance: 0,
            explodeTime: 0
        });
        fxLaser.currentTime = 0;
        fxLaser.play();
    }
    else if(ship.canShoot && ship.lasers.length < laserMax && powerupLevel >= 3){
        ship.lasers.push({
            x: ship.x + 4 / 3 * ship.r * Math.cos(ship.a) + Math.cos(ship.a) * 8,
            y: ship.y - 4 / 3 * ship.r * Math.sin(ship.a) + Math.sin(ship.a) * 8,
            xv: laserSpeed * Math.cos(ship.a) / fps,
            yv: -laserSpeed * Math.sin(ship.a) / fps,
            distance: 0,
            explodeTime: 0
        });
        ship.lasers.push({
            x: ship.x + 4 / 3 * ship.r * Math.cos(ship.a) - Math.cos(ship.a) * 8,
            y: ship.y - 4 / 3 * ship.r * Math.sin(ship.a) - Math.sin(ship.a) * 8,
            xv: laserSpeed * Math.cos(ship.a) / fps,
            yv: -laserSpeed * Math.sin(ship.a) / fps,
            distance: 0,
            explodeTime: 0
        });
        ship.lasers.push({
            x: ship.x + 4 / 3 * ship.r * Math.cos(ship.a) + Math.cos(ship.a) * 12,
            y: ship.y - 4 / 3 * ship.r * Math.sin(ship.a) + Math.sin(ship.a) * 12,
            xv: laserSpeed * Math.cos(ship.a) / fps,
            yv: -laserSpeed * Math.sin(ship.a) / fps,
            distance: 0,
            explodeTime: 0
        });
        ship.lasers.push({
            x: ship.x + 4 / 3 * ship.r * Math.cos(ship.a) - Math.cos(ship.a) * 12,
            y: ship.y - 4 / 3 * ship.r * Math.sin(ship.a) - Math.sin(ship.a) * 12,
            xv: laserSpeed * Math.cos(ship.a) / fps,
            yv: -laserSpeed * Math.sin(ship.a) / fps,
            distance: 0,
            explodeTime: 0
        });
        fxLaser.currentTime = 0;
        fxLaser.play();
    }

    //prevent shooting
    ship.canShoot = false;
}

const explode = () => {
    ship.explodeTime = Math.ceil(shipExplodeDuration * fps);
    if(powerupLevel > 0){
        powerupLevel -= 1;
    }
    fxExplode.play();
}

function newAsteroid(x, y, r){
    let levelMult = 1 + 0.1 * level;
    let asteroid = {
        x: x,
        y: y,
        xv: Math.random() * asteroidSpeed * levelMult / fps * (Math.random() < 0.5 ? 1 : -1),
        yv: Math.random() * asteroidSpeed * levelMult / fps * (Math.random() < 0.5 ? 1 : -1),
        r: r,
        a: Math.random() * Math.PI * 2,
        vert: Math.floor(Math.random() * (asteroidVert + 1) + asteroidVert / 2),
        offset: []
    }
    //create vertex offset array
    for(let i = 0; i < asteroid.vert; i++){
        asteroid.offset.push(Math.random() * asteroidRand * 2 + 1 - asteroidRand);
    }

    return asteroid;
}

function distanceBetweenPoints(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

//setup asteriods
function createAsteroids(){
    asteroids = [];
    let x;
    let y;
    for(let i = 0; i < asteroidsNum + level; i++){
        do{
            x = Math.floor(Math.random() * canvas.width);
            y = Math.floor(Math.random() * canvas.height);
        }
        while(distanceBetweenPoints(ship.x, ship.y, x, y) < asteroidSize * 2 + ship.r);
        asteroids.push(newAsteroid(x, y, Math.ceil(asteroidSize / 2)));
    }
}

function destroyAsteroid(index){
    let x = asteroids[index].x;
    let y = asteroids[index].y;
    let r = asteroids[index].r;

    //split asteroid in 2
    if(r == Math.ceil(asteroidSize / 2)){
        asteroids.push(newAsteroid(x, y, Math.ceil(asteroidSize / 4)));
        asteroids.push(newAsteroid(x, y, Math.ceil(asteroidSize / 4)));
        score += asteroidPointsLarge;
    }
    else if(r == Math.ceil(asteroidSize / 4)){
        asteroids.push(newAsteroid(x, y, Math.ceil(asteroidSize / 8)));
        asteroids.push(newAsteroid(x, y, Math.ceil(asteroidSize / 8)));
        score += asteroidPointsMedium;
        newPowerup(asteroids[index].x, asteroids[index].y);
    }
    else{
        score += asteroidPointsSmall;
        newPowerup(asteroids[index].x, asteroids[index].y);
    }

    //check highscore
    if(score > highScore){
        highScore = score;
        localStorage.setItem(savekeyHighscore, highScore);
    }

    //destroy asteroid
    asteroids.splice(index, 1);

    //start new level
    if(asteroids.length == 0){
        level++;
        newLevel();
    }

    fxHit.play();
}

function Sound(src, maxStreams = 1, vol = 1.0){
    this.streamNum = 0;
    this.streams = [];
    for(let i = 0; i < maxStreams; i++){
        this.streams.push(new Audio(src));
        this.streams[i].volume = vol;     
    }

    this.play = function(){
        if(soundOn){
            this.streamNum = (this.streamNum + 1) % maxStreams;
            this.streams[this.streamNum].play();
        }
    }

    this.stop = function(){
        this.streams[this.streamNum].pause();
        this.streams[this.streamNum].currentTime = 0;
    }
}

const keyDown = (event) => {
    if(ship.dead){
        return;
    }

    switch(event.keyCode) {
        case 37:
            ship.rot = turn_speed / 180 * Math.PI / fps;
            break;
        case 38:
            ship.thrusting = true;
            break;
        case 39:
            ship.rot = -turn_speed / 180 * Math.PI / fps;
            break;
        case 32:
            shootLaser();
            break;
    }
}

const keyUp = (event) => {
    if(ship.dead){
        return;
    }

    switch(event.keyCode) {
        case 37:
            ship.rot = 0;
            break;
        case 38:
            ship.thrusting = false;
            break;
        case 39:
            ship.rot = 0;
            break;
        case 32:
            ship.canShoot = true;
            break;
    }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

const update = () => {
    let blinkOn = ship.blinkNum % 2 == 0;
    let exploding = ship.explodeTime > 0;

    //draw background
    context.fillStyle = color1;
    context.fillRect(0, 0, canvas.width, canvas.height);

    //thrust ship
    if(ship.thrusting && !ship.dead){
        ship.thrust.x += thrust_strength * Math.cos(ship.a) / fps;
        ship.thrust.y -= thrust_strength * Math.sin(ship.a) / fps;
        fxThrust.play();

        //draw thruster
        if(!exploding && blinkOn){
            context.fillStyle = color3;
            context.strokeStyle = color3;
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(
                ship.x - ship.r * (2 / 3 * Math.cos(ship.a) + 0.3 * Math.sin(ship.a)),
                ship.y + ship.r * (2 / 3 * Math.sin(ship.a) - 0.3 * Math.cos(ship.a))
            );
            context.lineTo(
                ship.x - ship.r * 6 / 3 * Math.cos(ship.a),
                ship.y + ship.r * 6 / 3 * Math.sin(ship.a)
            );
            context.lineTo(
                ship.x - ship.r * (2 / 3 * Math.cos(ship.a) - 0.3 * Math.sin(ship.a)),
                ship.y + ship.r * (2 / 3 * Math.sin(ship.a) + 0.3 * Math.cos(ship.a))
            );
            context.closePath();
            context.stroke();
            context.fill();
        }
    }
    else{
        ship.thrust.x -= friction * ship.thrust.x / fps;
        ship.thrust.y -= friction * ship.thrust.y / fps;
        fxThrust.stop();
    }

    //draw ship
    if(!exploding){
        if(blinkOn && !ship.dead){
            drawShip(ship.x, ship.y, ship.a);
        }
        //blinking
        if(ship.blinkNum > 0){
            ship.blinkTime--;
            if(ship.blinkTime == 0){
                ship.blinkTime = Math.ceil(shipInvurnebilityBlink * fps);
                ship.blinkNum--;
            }
        }
    }
    else{
        // draw explosion
        context.strokeStyle = "darkred";
        context.fillStyle = "darkred"
        context.beginPath();
        context.arc(ship.x, ship.y, ship.r * 1.8, 0, Math.PI * 2, false);
        context.fill();
        context.stroke();
        context.strokeStyle = "red";
        context.fillStyle = "red"
        context.beginPath();
        context.arc(ship.x, ship.y, ship.r * 1.5, 0, Math.PI * 2, false);
        context.fill();
        context.stroke();
        context.strokeStyle = "orange";
        context.fillStyle = "orange"
        context.beginPath();
        context.arc(ship.x, ship.y, ship.r * 1.2, 0, Math.PI * 2, false);
        context.fill();
        context.stroke();
        context.strokeStyle = "yellow";
        context.fillStyle = "yellow"
        context.beginPath();
        context.arc(ship.x, ship.y, ship.r * 0.8, 0, Math.PI * 2, false);
        context.fill();
        context.stroke();
        context.strokeStyle = "white";
        context.fillStyle = "white"
        context.beginPath();
        context.arc(ship.x, ship.y, ship.r * 0.4, 0, Math.PI * 2, false);
        context.fill();
        context.stroke();
    }

    if(showBounding){
        context.strokeStyle = "lime";
        context.beginPath();
        context.arc(ship.x, ship.y, ship.r, 0, Math.PI * 2, false);
        context.stroke();
    }

    //draw asteroid
    for(let i = 0; i < asteroids.length; i++){
        let {x, y, r, a, vert, offset} = asteroids[i]

        context.strokeStyle = color2;
        context.lineWidth = 2;

        //draw a path
        context.beginPath();
        context.moveTo(
            x + r * offset[0] * Math.cos(a),
            y + r * offset[0] * Math.sin(a)
        );

        //draw the polygon
        for(let j = 1; j < vert; j++){
            context.lineTo(
                x + r * offset[j] * Math.cos(a + j * Math.PI * 2 / vert),
                y + r * offset[j] * Math.sin(a + j * Math.PI * 2 / vert)
            );
        }
        context.closePath();
        context.stroke();

        if(showBounding){
            context.strokeStyle = "red";
            context.beginPath();
            context.arc(x, y, r, 0, Math.PI * 2, false);
            context.stroke();
        }

        //move asteroid
        asteroids[i].x += asteroids[i].xv;
        asteroids[i].y += asteroids[i].yv;

        //handle edge of screen
        if(asteroids[i].x < 0 - asteroids[i].r){
            asteroids[i].x = canvas.width + asteroids[i].r;
        }
        else if(asteroids[i].x > canvas.width + asteroids[i].r){
            asteroids[i].x = 0 - asteroids[i].r;
        }

        if(asteroids[i].y < 0 - asteroids[i].r){
            asteroids[i].y = canvas.height + asteroids[i].r;
        }
        else if(asteroids[i].y > canvas.height + asteroids[i].r){
            asteroids[i].y = 0 - asteroids[i].r;
        }
    }

    //draw powerup
    for(let i = 0; i < powerups.length; i++){
        context.strokeStyle = "yellow";
        context.lineWidth = 2;
        context.strokeRect(powerups[i].x, powerups[i].y, 20, 20);

        if(showBounding){
            context.strokeStyle = "yellow";
            context.beginPath();
            context.arc(powerups[i].x + 10, powerups[i].y + 10, powerups[i].r * 0.5, 0, Math.PI * 2, false);
            context.stroke();
        }

        //detect powerup pickup/collision
        if(distanceBetweenPoints(ship.x, ship.y, powerups[i].x, powerups[i].y) < ship.r + powerups[i].r){
            powerups.splice(i, 1);
            if(lives < 3 && Math.random() > 0.90){
                lives += 1;
                return;
            }

            if(powerupLevel < 3){
                powerupLevel += 1;
            }
            else{
                score += 200;
            }
        }
    }

    //draw lasers
    for(let i = 0; i < ship.lasers.length; i++){
        if(ship.lasers[i].explodeTime == 0){
            context.fillStyle = color3;
            context.beginPath();
            context.arc(ship.lasers[i].x, ship.lasers[i].y, 2, 0, Math.PI * 2, false);
            context.fill();
        }
        else{
            //draw explosion
            context.fillStyle = "#3ecbf9";
            context.beginPath();
            context.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 0.75, 0, Math.PI * 2, false);
            context.fill();
            context.fillStyle = "lightblue";
            context.beginPath();
            context.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 0.5, 0, Math.PI * 2, false);
            context.fill();
            context.fillStyle = "white";
            context.beginPath();
            context.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 0.25, 0, Math.PI * 2, false);
            context.fill();
        }
    }

    //detect laser hits on asteroids
    for(let i = asteroids.length - 1; i >= 0; i--){
        let ax = asteroids[i].x;
        let ay = asteroids[i].y;
        let ar = asteroids[i].r;

        for(let j = ship.lasers.length - 1; j >= 0; j--){
            let {x, y} = ship.lasers[j];

            //detect hits
            if(distanceBetweenPoints(ax, ay, x, y) < ar && ship.lasers[j].explodeTime == 0){
                //remove asteroid and epxlode laser
                destroyAsteroid(i);
                ship.lasers[j].explodeTime = Math.ceil(laserExplodeDuration * fps);
                break;
            }
        }
    }

    //move lasers
    for(let i = ship.lasers.length - 1; i >= 0; i--){
        //check distance traveled
        if(ship.lasers[i].distance > laserDistance * canvas.width){
            ship.lasers.splice(i, 1);
            continue;
        }

        //handle explosion
        if(ship.lasers[i].explodeTime > 0){
            ship.lasers[i].explodeTime--;
            if(ship.lasers[i].explodeTime == 0){
                ship.lasers.splice(i, 1);
                continue;
            }
        }
        else{
            //move laser
            ship.lasers[i].x += ship.lasers[i].xv;
            ship.lasers[i].y += ship.lasers[i].yv;

            //calculate distance traveled
            ship.lasers[i].distance += Math.sqrt(Math.pow(ship.lasers[i].xv, 2) + Math.pow(ship.lasers[i].yv, 2));
        }

        //handle edge of screen
        if(ship.lasers[i].x < 0){
            ship.lasers[i].x = canvas.width;
        }
        else if(ship.lasers[i].x > canvas.width){
            ship.lasers[i].x = 0;
        }

        if(ship.lasers[i].y < 0){
            ship.lasers[i].y = canvas.height;
        }
        else if(ship.lasers[i].y > canvas.height){
            ship.lasers[i].y = 0;
        }
    }

    //draw game text
    if(textAlpha >= 0){
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "rgba(255, 255, 255, " + textAlpha + ")";
        context.font = textSize + 'px "Tiny5", sans-serif';
        context.fillText(text, canvas.width / 2, canvas.height * 0.75);
        textAlpha -= (1.0 / textFadeTime / fps);
    }
    else if(ship.dead){
        newGame();
    }

    //draw lives
    for(let i = 0; i < lives; i++){
        drawShip(30 + i * 30 * 1.2, 30, 0.5 * Math.PI);
    }

    //draw score
    context.textAlign = "right";
    context.textBaseline = "middle";
    context.fillStyle = "white";
    context.font = textSize + 'px "Tiny5", sans-serif';
    context.fillText(score, canvas.width - 15, 30);

    //draw highScore
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "white";
    context.font = (textSize * 0.75) + 'px "Tiny5", sans-serif';
    context.fillText("Highscore: " + highScore, canvas.width / 2, 30);

    if(!exploding){
        //check for collision
        if(ship.blinkNum == 0 && !ship.dead){
            for(let i = 0; i < asteroids.length; i++){
                if(distanceBetweenPoints(ship.x, ship.y, asteroids[i].x, asteroids[i].y) < ship.r + asteroids[i].r){
                    explode();
                    destroyAsteroid(i);
                    break;
                }
            }
        }

        //rotate ship
        ship.a += ship.rot;

        //move ship
        ship.x += ship.thrust.x;
        ship.y += ship.thrust.y;
    }
    else{
        ship.explodeTime--;

        if(ship.explodeTime == 0){
            lives--;
            if(lives == 0){
                gameOver();
            }
            else{
                ship = newShip();
            }
        }
    }

    //handle screen edge
    if(ship.x < 0 - ship.r){
        ship.x = canvas.width + ship.r;
    }
    else if (ship.x > canvas.width + ship.r){
        ship.x = 0 - ship.r;
    }

    if(ship.y < 0 - ship.r){
        ship.y = canvas.height + ship.r;
    }
    else if (ship.y > canvas.height + ship.r){
        ship.y = 0 - ship.r;
    }
}

setInterval(update, 1000 / fps);

