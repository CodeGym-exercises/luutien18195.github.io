let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let score = 0;
let life = 10;
let FPS = 0;


window.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
        case 37:
            TankStatus.status = "moveleft";
            console.log("37->> left");
            break;
        case 38:
            TankStatus.status = "movetop";
            console.log("38->> top");
            break;
        case 39:
            TankStatus.status = "moveright";
            console.log("39->> right");
            break;
        case 40:
            TankStatus.status = "movedown";
            console.log("40->> down");
            break;
        case 83:
            TankStatus.status = "stop";
            console.log("83->> stop");
            break;
        case 81:
            Skill.status = "q";
            console.log("83->> q skill");
            break;
    }
});

//=================== CLASS ========================

//=======CIRCLE=========
let Circle = function(x, y, dx, dy, rad, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = rad;
    this.color = color;

    this.draw = function() {
        ctx.beginPath();
        //let img = new Image();
        //img.src = "imgs/ufo.png";
        ctx.shadowOffX = 10;
        ctx.shadowOffY = 10;
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        //ctx.drawImage(img, this.x, this.y,this.radius,this.radius);
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        this.update();
    }
    this.update = function() {
        if (this.x > canvas.width - this.radius ||
            this.x < 0 + this.radius) {
            this.dx = -this.dx;
        }
        if (this.y > canvas.height - this.radius ||
            this.y < 0 + this.radius) {
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;
    }
    this.collision = function(object) {
        let distance = Math.sqrt(Math.pow((this.x - object.x), 2) + Math.pow((this.y - object.y), 2));
        let sumOfRad = this.radius + object.radius;

        if (distance <= sumOfRad) {
            this.dx = -this.dx;
            this.dy = -this.dy;
            object.dx = -object.dx;
            object.dy = -object.dy;
        }
    }
}

//=======TANK=========
let Tank = function(x, y, size, spd) {
    this.x = x;
    this.y = y;
    this.spdx = spd;
    this.spdy = spd;
    this.width = size;
    this.height = size;
    this.degree = 0;
    this.draw = function() {
        //ctx.rotate(Math.PI/10);
        let img = new Image(100, 100);
        img.src = "imgs/spaceship.png";
        //ctx.rotate(-45*Math.PI/180);
        ctx.save();
        ctx.translate(this.x + (this.width / 2), this.y + (this.height / 2));
        ctx.rotate(this.degree * Math.PI / 180);
        this.degree += 1;
        if (this.degree == 360) {
            this.degree = 0;
        }
        ctx.shadowOffX = 10;
        ctx.shadowOffY = 10;
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#fff";
        ctx.translate(-this.width / 2, -this.height / 2);
        ctx.drawImage(img, 0, 0, this.width, this.height);
        ctx.restore();
        //ctx.resetTransform();
    };

    this.update = function() {
        if (TankStatus.status == "movetop") {
            if (this.y > 0) {
                this.y -= this.spdy;
            }
            //console.log(this.nextStepY);            
        } else if (TankStatus.status == "movedown") {
            if (this.y < canvas.height - this.height) {
                this.y += this.spdy;
            }
        } else if (TankStatus.status == "moveleft") {
            if (this.x > 0) {
                this.x -= this.spdx;
            }

        } else if (TankStatus.status == "moveright") {
            if (this.x < canvas.width - this.width) {
                this.x += this.spdx;
            }
        }
        TankStatus.posX = this.x;
        TankStatus.posY = this.y;
        TankStatus.degree = this.degree;
    }
} 

//=======Bullet============
let Bullet = function(x,y,degree){
    this.x = x;
    this.y = y;
    this.dx = undefined;
    this.dy = undefined;
    this.radius = 14;
    this.color = "#fff";
    this.speed = 2;
    this.degree = degree;

    this.draw = function(){
        //ctx.beginPath();
        let img = new Image();
        img.src = "imgs/rocket.png";
        ctx.save()
        ctx.translate(this.x+this.radius,this.y+this.radius+2);
        ctx.rotate((this.degree+22)*Math.PI/180);
        ctx.shadowOffX = 1;
        ctx.shadowOffY = 10;
        ctx.shadowBlur = 40;
        ctx.shadowColor = this.color;
        ctx.translate(-this.radius,-(this.radius+2))
        ctx.drawImage(img,0,0,this.radius*2,this.radius*2+2);
        ctx.restore();
        //ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
        //ctx.fillStyle = this.color;
        //ctx.fill();
        //ctx.closePath();
    }

    this.update = function(){
        this.draw();
        this.dx = this.speed*Math.cos((this.degree-50)*Math.PI/180);
        this.dy = this.speed*Math.sin((this.degree-50)*Math.PI/180);
        this.x+=this.dx;
        this.y+=this.dy;
        this.speed+=0.2;
        //console.log("x " + this.x);
        //console.log("y " + this.y);
    }

    this.collision = function(object) {
        let distance = Math.sqrt(Math.pow((this.x - object.x), 2) + Math.pow((this.y - object.y), 2));
        let sumOfRad = this.radius + object.radius;
        if (distance <= sumOfRad) {
            return true;
        }else{return false;}
    }
}

let Explosion = function(x,y){
    this.posX = x;
    this.posY = y;
    this.draw= function(){
        let img = new Image();
        img.src = "imgs/explosion"+Math.floor(Math.random()*3)+".png";
        ctx.shadowOffX = 1;
        ctx.shadowOffY = 10;
        ctx.shadowBlur = 80;
        ctx.shadowColor = "#ff0";
        ctx.drawImage(img,this.posX,this.posY,100,100);
    };
}//=======END_CLASS=========

//=========init obj========
//->>init tank
let x = 200,
    y = 200,
    size = 60,
    spd = 5;
let tank = new Tank(x, y, size, spd);

//->>init circle
let arrCircle = [];
let arrColor = [
    "#153641",
    "#22556E",
    "#4799B7",
    "#6DB3BF",
    "#94CFC9",
    "#009EA9",
    "#F8F7F5",
    "#FAD956",
    "#F8A602"
];
loadCircle(4); //input->length

//-->>init bullet skill
let arrBullet = [];

//-->>init Explosion array
let arrExplosion = [];

//=========== object ==========
let TankStatus = {
    status: "stop",
    degree: undefined,
    posX: undefined,
    posY: undefined
}
let Skill = {
    status: "noskill"
}
//=========FNC=========

function gameOver() {
    if(life==0){
        cancelAnimationFrame(id);
        tank.x = x;
        tank.y = y;
        //alert("Game Over, score: " + score);
        ctx.font = "100px Arial";
        ctx.fillStyle = "#fff";
        ctx.fillText("Game Over",canvas.width/2-200,300);
        ctx.font = "60px Arial";
        ctx.fillText("Your score " + score,canvas.width/2,350);
        ctx.font = "30px Arial";
        ctx.fillText("Press f5 to contiune",canvas.width/2,400);        
    }
}

function clearExplosion(){
    if(arrExplosion.length!=0){
        if(FPS==50){
            arrExplosion.shift();
            FPS = 0;
        }
        FPS++;
        //console.log(FPS);
    }
}

function drawExplosion(){
    for(let i = 0; i < arrExplosion.length; i++){
        arrExplosion[i].draw();
    }
}

function loadExplosion(x,y){
    arrExplosion.push(new Explosion(x,y));
}

function collitionOfBulletWidthCircle(){
    for(let i = 0; i < arrBullet.length; i++){
        for(let j = 0; j < arrCircle.length; j++){
            if(arrBullet[i].collision(arrCircle[j])){
                loadExplosion(arrBullet[i].x,arrBullet[i].y)
                arrCircle.splice(j,1);
                initCircle();
                arrBullet.splice(i,1);
                score++;
                break;
            }
        }
    }
}

function fire(){
    if(Skill.status=="q"){
        let x = TankStatus.posX+tank.width/2;
        let y = TankStatus.posY+tank.height/2;
        let dg = TankStatus.degree;
        loadBullet(x,y,dg);        
        Skill.status="noskill";
    }
    for(let i = 0; i<arrBullet.length; i++){
        arrBullet[i].update();
        if(arrBullet[i].x<0||arrBullet[i].x>canvas.width||
            arrBullet[i].y<0||arrBullet[i].y>canvas.height){
            arrBullet.splice(i,1);
        }
    }
}

function loadBullet(x,y,degree){
    arrBullet.push(new Bullet(x,y,degree));
}

function collitionOfTankWithCircle() {
    for (let i = 0; i < arrCircle.length; i++) {
        let distanceCurrent = Math.sqrt(Math.pow(((tank.x + tank.width / 2) - arrCircle[i].x), 2) + Math.pow(((tank.y + tank.height / 2) - arrCircle[i].y), 2));
        let distance = tank.width / 2 + arrCircle[i].radius;
        if (distanceCurrent <= distance) {
            life -= 1;
            loadExplosion(arrCircle[i].x,arrCircle[i].y)
            arrCircle.splice(i, 1);
            initCircle();
            break;
        }
    }

}

function collisionOfCircle() {
    for (let i = 0; i < arrCircle.length; i++) {
        for (let j = i + 1; j < arrCircle.length; j++) {
            arrCircle[i].collision(arrCircle[j]);
        }
    }
}

function drawCircle() {
    for (let i = 0; i < arrCircle.length; i++) {
        arrCircle[i].draw();
    }
}

function loadCircle(length) {
    for (let i = 0; i < length; i++) {
        initCircle();
    }
}

function initCircle() {
    let randomdx = Math.floor(Math.random() * 3) + 2;
    let randomdy = Math.floor(Math.random() * 3) + 2;
    let temp = [1, -1];
    let radius = 20,
    x = Math.random() * (canvas.width - radius * 2) + radius;
    y = Math.random() * (canvas.height - radius * 2) + radius;
    randomdx *= temp[Math.floor(Math.random() * 2)];
    randomdy *= temp[Math.floor(Math.random() * 2)];
    arrCircle.push(new Circle(x, y, randomdx, randomdy, radius, getRandomColor()));
}

function getRandomColor() {
    return arrColor[Math.floor(Math.random() * arrColor.length)];
} //=======END FNC=========

function getDistanceOf2Point(x1,y1,x2,y2){
    return Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2));
}
let count = 10;
//==========draw============
let id;
function animate() {
    id = requestAnimationFrame(animate);
    //requestAnimationFrame()
    //console.log("runing");
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.font = "20px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText("Score: "+ score,10,30);
    ctx.fillText("Life: "+ life,10,60);
    ctx.fillText("Q: fire ",120,30);
    ctx.fillText("S: stop ",200,30);
    tank.draw();
    tank.update();
    fire();
    drawCircle();
    collisionOfCircle();
    collitionOfTankWithCircle();
    collitionOfBulletWidthCircle();
    drawExplosion();
    clearExplosion();
    gameOver();
}
animate();
