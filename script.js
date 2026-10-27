class Raster {
  constructor(r,k) {
    this.aantalRijen = 12;
    this.aantalKolommen = 18;
    this.celGrootte = null;
  }

  berekenCelGrootte() {
    this.celGrootte = canvas.width / this.aantalKolommen;
  }

  teken() {
    push();
    noFill();
    stroke('grey');
    strokeWeight(1);
    for (var rij = 0;rij < this.aantalRijen;rij++) {
      for (var kolom = 0;kolom < this.aantalKolommen;kolom++) {
        rect(kolom*this.celGrootte,rij*this.celGrootte,this.celGrootte,this.celGrootte);
      }
    }
    stroke('blue');
    strokeWeight(100);
    noFill();
    rect(0, 0, canvas.width, canvas.height);
    
    pop();
  }
}

class Jos {
  constructor() {
    this.x = 0;
    this.y = 300;
    this.animatie = [];
    this.frameNummer =  3;
    this.stapGrootte = null;
    this.gehaald = false;
  }

  beweeg() {
    if (keyIsDown(65)) {
      this.x -= this.stapGrootte;
      this.frameNummer = 2;
    }
    if (keyIsDown(68)) {
      this.x += this.stapGrootte;
      this.frameNummer = 1;
    }
    if (keyIsDown(87)) {
      this.y -= this.stapGrootte;
      this.frameNummer = 4;
    }
    if (keyIsDown(83)) {
      this.y += this.stapGrootte;
      this.frameNummer = 5;
    }

    this.x = constrain(this.x,0,canvas.width);
    this.y = constrain(this.y,0,canvas.height - raster.celGrootte);

    if (this.x == canvas.width) {
      this.gehaald = true;
    }
  }


  wordtGeraakt(vijand) {
    let afstandX = abs(this.x - vijand.x);
    let afstandY = abs(this.y - vijand.y);

    if (
      afstandX < raster.celGrootte &&
      afstandY < raster.celGrootte
    ) {
      return true;
    }
    else{
    return false;
  }

  }

  toon() {
    image(this.animatie[this.frameNummer],this.x,this.y,raster.celGrootte,raster.celGrootte);
  }
}  

class Vijand {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.stapGrootte = null;
  }


  beweeg() {
    this.x += floor(random(-1,2))*this.stapGrootte;
    this.y += floor(random(-1,2))*this.stapGrootte;

    this.x = constrain(this.x,0,canvas.width - raster.celGrootte);
    this.y = constrain(this.y,0,canvas.height - raster.celGrootte);
  }

  toon() {
    image(this.sprite,this.x,this.y,raster.celGrootte,raster.celGrootte);
  }
}


class Raket {
  constructor(x, y, snelheidOmhoog) {
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.snelheidOmhoog = snelheidOmhoog;
    this.snelheidY = -snelheidOmhoog;
    this.zwaartekracht = 0.12;
  }

  beweeg() {
    this.y += this.snelheidY;
    this.snelheidY += this.zwaartekracht;

    if (this.y <= 0) {
      this.y = 0;
      this.snelheidY = 0.5;
    }

    if (this.y >= canvas.height - raster.celGrootte) {
      this.y = canvas.height - raster.celGrootte;
      this.snelheidY = -this.snelheidOmhoog;
    }

    this.y = constrain(
      this.y,
      0,
      canvas.height - raster.celGrootte
    );
  }

  toon() {
    image(
      this.sprite,
      this.x,
      this.y,
      raster.celGrootte,
      raster.celGrootte
    );
  }
}

class Pingpongbal {
  constructor() {
    this.x = 450;
    this.y = 250;
    this.snelheidX = 10;
    this.snelheidY = 8;
    this.grootte = 20;
    this.actief = true;
  }

  beweeg() {
    this.x += this.snelheidX;
    this.y += this.snelheidY;

    if (this.x <= 0 || this.x >= canvas.width) {
      this.snelheidX *= -1;
    }

    if (this.y <= 0 || this.y >= canvas.height) {
      this.snelheidY *= -1;
    }
  }

  toon() {
    if (this.actief) {
      fill('white');
      stroke('black');
      circle(this.x, this.y, this.grootte);
      noStroke();
    }
  }
  }

let raketSprite;
let levens = 5;
let wasGeraakt = false;
let bal;
let extraLevenGeraakt = false;
let level = 1;
let doelX = 0;
let levelOvergang = false;
let overgangTijd = 0;
let pauze = false;
let pauzeStart = 0;


function preload() {
  brug = loadImage("images/backgrounds/dame_op_brug_1800.jpg");
  raketSprite = loadImage("images/sprites/Raket.png");
}

function setup() {
  canvas = createCanvas(900,600);
  canvas.parent();
  frameRate(10);
  textFont("Verdana");
  textSize(90);

  raster = new Raster(6,9);

  raster.berekenCelGrootte();

  eve = new Jos();
  eve.stapGrootte = 1*raster.celGrootte;
  for (var b = 0;b < 6;b++) {
    frameEve = loadImage("images/sprites/Eve100px/Eve_" + b + ".png");
    eve.animatie.push(frameEve);
  }

  alice = new Vijand(700,200);
  alice.stapGrootte = 1*eve.stapGrootte;
  alice.sprite = loadImage("images/sprites/Alice100px/Alice.png");

  bob = new Vijand(600,400);
  bob.stapGrootte = 1*eve.stapGrootte;
  bob.sprite = loadImage("images/sprites/Bob100px/Bob.png");  

  cindy = new Vijand(600,200);
  cindy.stapGrootte = 1*eve.stapGrootte;
  cindy.sprite = loadImage("images/sprites/Alice100px/Alice.png")


  kleine = new Raket(
    random(canvas.width / 2, canvas.width - raster.celGrootte),
    random(0, canvas.height - raster.celGrootte),
    9
  );
  kleine.sprite = raketSprite;

  grote = new Raket(
    random(canvas.width / 2, canvas.width - raster.celGrootte),
    random(0, canvas.height - raster.celGrootte),
    16
  );
  grote.sprite = raketSprite;

  raketje = new Raket(
    random(canvas.width / 2, canvas.width - raster.celGrootte),
    random(0, canvas.height - raster.celGrootte),
    20
  );
  raketje.sprite = raketSprite;
  
  bal = new Pingpongbal();


}


function volgendLevel() {
  if (level < 5) {
    level++;
    pauze = true;
    pauzeStart = millis();

    eve.x = 0;
    eve.y = 300;
    eve.gehaald = false;

    alice.stapGrootte += 1;
    bob.stapGrootte += 1;
    cindy.stapGrootte += 1;

    kleine.snelheidOmhoog += 1;
    grote.snelheidOmhoog += 2;
    raketje.snelheidOmhoog += 3;

    kleine.snelheidY = -kleine.snelheidOmhoog;
    grote.snelheidY = -grote.snelheidOmhoog;
    raketje.snelheidY = -raketje.snelheidOmhoog;
  } else {
    pauze = true;
    pauzeStart = millis();
    level = 6;
  }
}


function draw() {

  if (pauze) {
    background('green');
    fill('black');
    textSize(40);
    textAlign(CENTER, CENTER);

    if (level <= 5) {
      text("Level " + (level - 1) + " gehaald", width / 2, height / 2);
    } else {
      text("Je hebt alle levels gehaald!", width / 2, height / 2);
    }

    if (millis() - pauzeStart >= 2000) {
      if (level == 6) {
        noLoop();
      } else {
        pauze = false;
      }
    }

    return;
  }

  if (
    mouseX >= 0 &&
    mouseX <= canvas.width &&
    mouseY >= 0 &&
    mouseY <= canvas.height &&
    (
      mouseX <= 50 ||
      mouseX >= canvas.width - 50 ||
      mouseY <= 50 ||
      mouseY >= canvas.height - 50
    )
  ) {
    background('lightblue');
  } else {
    background(brug);
  }
  raster.teken();
  push();
  fill('orange');
  stroke('darkorange');
  strokeWeight(1);
  rectMode(CORNER);

  let aantalLagen = 5;
  let breedte = 30;
  let hoogte = 20;

  let startX = canvas.width / 2 - (aantalLagen * breedte) / 2;
  let startY = canvas.height / 2 - (aantalLagen * hoogte) / 2;

  tekenPiramide(
    aantalLagen,
    startX,
    startY,
    breedte,
    hoogte
  );
  pop();
  eve.beweeg();
  alice.beweeg();
  bob.beweeg();
  cindy.beweeg();
  kleine.beweeg();
  grote.beweeg();
  raketje.beweeg();
  bal.beweeg();
  eve.toon();
  alice.toon();
  bob.toon();
  kleine.toon();
  cindy.toon();
  grote.toon();
  raketje.toon();
  bal.toon();


  fill('black');
  textSize(20);
  text("Levens: " + levens,10,25);

  if (bal.actief && dist(
    eve.x + raster.celGrootte / 2,
    eve.y + raster.celGrootte / 2,
    bal.x,
    bal.y
  ) < raster.celGrootte / 2 + bal.grootte / 2) {
    levens++;
    bal.actief = false;
  }


  let geraakt = (eve.wordtGeraakt(alice) || eve.wordtGeraakt(bob) || eve.wordtGeraakt(cindy) ||               eve.wordtGeraakt(kleine) || eve.wordtGeraakt(grote) || eve.wordtGeraakt(raketje)) 
    if (geraakt && !wasGeraakt) {
      levens--;
      eve.x = 0;
      eve.y = 300;
    }

    wasGeraakt = geraakt;

  if (levens <= 0) {
    background('red')
    fill('white')
    textSize(50);
    textAlign(CENTER, CENTER);
    text("Eeen je bent dood",width / 2, height / 2);
    noLoop();
    return;
  }

  if (eve.gehaald) {
    volgendLevel();
  }

  fill('white');
  textSize(20);
  text("Level: " + level, 10, 50);
}
function tekenPiramide(n, x, y, breedte, hoogte) {
  if (n > 0) {
    for (let i = 0; i < n; i++) {
      rect(x + i * breedte, y, breedte, hoogte);
    }

    tekenPiramide(
      n - 1,
      x + breedte / 2,
      y + hoogte,
      breedte,
      hoogte
    );
  }
}