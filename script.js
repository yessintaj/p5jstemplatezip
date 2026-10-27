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
    for (var rij = 0;rij < this.aantalRijen;rij++) {
      for (var kolom = 0;kolom < this.aantalKolommen;kolom++) {
        rect(kolom*this.celGrootte,rij*this.celGrootte,this.celGrootte,this.celGrootte);
      }
    }
    pop();
  }
}

class Jos {
  constructor() {
    this.x = 400;
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
    if (this.x == vijand.x && this.y == vijand.y) {
      return true;
    }
    else {
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


let raketSprite;

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


}

function draw() {
  background(brug);
  raster.teken();
  eve.beweeg();
  alice.beweeg();
  bob.beweeg();
  cindy.beweeg();
  kleine.beweeg();
  grote.beweeg();
  raketje.beweeg();
  eve.toon();
  alice.toon();
  bob.toon();
  kleine.toon();
  cindy.toon();
  grote.toon();
  raketje.toon();

  if (eve.wordtGeraakt(alice) || eve.wordtGeraakt(bob) || eve.wordtGeraakt(cindy) ||               eve.wordtGeraakt(kleine) || eve.wordtGeraakt(grote) || eve.wordtGeraakt(raketje)) {
    background('red')
    fill('white')
    text("Ééén je bent dood",30,300)
    noLoop();
  }

  if (eve.gehaald) {
    background('green');
    fill('white');
    text("Je hebt gewonnen!",30,300);
    noLoop();
  }
}



