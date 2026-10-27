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
    StrokeWeight(1);
    for (var rij = 0;rij < this.aantalRijen;rij++) {
      for (var kolom = 0;kolom < this.aantalKolommen;kolom++) {
        rect(kolom*this.celGrootte,rij*this.celGrootte,this.celGrootte,this.celGrootte);
      }
    }
    stroke('blue');
    StrokeWeight(5);
    noFill();
    rect(0,0,canvas.width, canvas.height);
    
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
    12 * raster.celGrootte,
    random(0, canvas.height - raster.celGrootte),
    9
  );
  kleine.sprite = raketSprite;

  
  grote = new Raket(
    14 * raster.celGrootte,
    random(0, canvas.height - raster.celGrootte),
    11
  );
  grote.sprite = raketSprite;

  
  raketje = new Raket(
    16 * raster.celGrootte,
    random(0, canvas.height - raster.celGrootte),
    13
  );
  raketje.sprite = raketSprite;

  bal = new Pingpongbal();


}

function draw() {
  if (
    mouseX >= 0 &&
    mouseX <= canvas.width &&
    mouseY >= 0 &&
    mouseY <= canvas.height &&
    (
      mouseX <= 5 ||
      mouseX >= canvas.width - 5 ||
      mouseY <= 5 ||
      mouseY >= canvas.height - 5
    )
  ) {
    background('lightblue');
  } else {
  background(brug);
  raster.teken();
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
    textSize(90);
    text("Eeen je bent dood",60,300)
    noLoop();
    return;
  }

  if (eve.gehaald) {
    background('green');
    fill('white');
    textSize(50)
    text("Je hebt gewonnen!",60,300);
    noLoop();
  }
}