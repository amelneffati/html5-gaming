var KEYCODE_SPACE = 32;
var KEYCODE_DOWN = 40;
var KEYCODE_UP = 38;
var KEYCODE_LEFT = 37;
var KEYCODE_RIGHT = 39;
var canvas;
var stage;
var messageField;
var scoreField;
var score = 0;
var ship;
var asteroids;
var fires;
var nextAsteroid;

// Lance la fonction handleKeyDown quand une touche est appuyée
document.onkeydown = handleKeyDown;

// Fonction au lancement de la page et initialisation du canvas
function init() {
  canvas = document.getElementById("gameCanvas");
  stage = new createjs.Stage(canvas);
  messageField = new createjs.Text(
    "Click to play",
    "bold 24px Arial",
    "#FFFFFF"
  );
  messageField.maxWidth = canvas.width;
  messageField.textAlign = "center";
  messageField.textBaseline = "middle";
  messageField.x = canvas.width / 2;
  messageField.y = canvas.height / 2;
  scoreField = new createjs.Text("0", "bold 18px Arial", "#FFFFFF");
  scoreField.textAlign = "right";
  scoreField.x = canvas.width - 20;
  scoreField.y = 20;
  scoreField.maxWidth = 1000;
  stage.addChild(messageField);
  stage.addChild(scoreField);
  stage.update();
  // Clic appelle handleClick
  canvas.onclick = handleClick;
}

// Lance la partie
function handleClick() {
  canvas.onclick = null;
  stage.removeChild(messageField);
  restart();
}

function restart() {
  // Reinitialise le canvas
  stage.removeAllChildren();

  // Reinitialise le tableau d'asteroids et fires
  asteroids = [];
  fires = [];
  nextAsteroid = 0;
  score = 0;

  // Création du vaisseau
  ship = new createjs.Shape();
  ship.graphics.beginFill("#3ACCE1").drawCircle(0, 0, 20);
  ship.x = canvas.width / 2;
  ship.y = canvas.height - 35;

  stage.addChild(ship);
  stage.addChild(scoreField);

  // Boucle du jeu appelle la fonction tick
  if (!createjs.Ticker.hasEventListener("tick")) {
    createjs.Ticker.addEventListener("tick", tick);
  }
}

function createAsteroid() {
  if (nextAsteroid <= 0) {
    nextAsteroid = 20;
    var size = Math.floor(Math.random() * 20) + 10;
    var o = new createjs.Shape();
    o.x = Math.floor(Math.random() * canvas.width) + 1;
    o.y = 20;
    o.size = size;
    o.graphics.beginFill("#78849E").drawCircle(0, 0, size);
    stage.addChild(o);
    asteroids.push(o);
  } else {
    nextAsteroid--;
  }
}

function tick(event) {
  stage.clear();
  createAsteroid();

  asteroids.forEach(function(asteroid, index) {
    // Descend l'asteroid
    asteroid.y += 5;

    // Si l'asteroid touche le vaisseau
    if (hitRadius(asteroid.x, asteroid.y, asteroid.size, ship.x, ship.y, 10)) {
      // Supprime le vaisseau
      stage.removeChild(ship);

      // Affiche le message
      messageField.text = "Click to play again";
      stage.addChild(messageField);

      // Reactive la fonction handleClick
      canvas.onclick = handleClick;
    }

    // Si l'asteroid touche une balle
    fires.forEach(function(bullet) {
      if (
        hitRadius(asteroid.x, asteroid.y, asteroid.size, bullet.x, bullet.y, 7)
      ) {
        // Ajout des points au score
        score += 5;

        // Supprime l'asteroid du tableau
        asteroids.splice(index, 1);

        // Supprime l'asteroid et la balle
        stage.removeChild(asteroid);
        stage.removeChild(bullet);
      }
    });

    // Si l'asteroid depasse le canvas on le supprime
    if (asteroid.y > canvas.height) {
      asteroids.splice(index, 1);
      stage.removeChild(asteroid);
    }
  });

  fires.forEach(function(bullet, index) {
    // On fait monter la balle vers le haut
    bullet.y -= 20;

    // Si la balle dépasse du canvas on la supprime
    if (bullet.y < 0) {
      fires.splice(index, 1);
      stage.removeChild(bullet);
    }
  });

  // On met à jour le texte du score
  scoreField.text = score.toString();
  stage.update(event);
}

function fireBullet() {
  var o = new createjs.Shape();
  o.x = ship.x;
  o.y = ship.y;
  o.graphics.beginFill("#FFB900").drawRect(0, 0, 7, 7);
  stage.addChild(o);
  fires.push(o);
}

// Verifie si on touche un asteroid
function hitRadius(X, Y, Hit, tX, tY, tHit) {
  if (tX - tHit > X + Hit) {
    return;
  }
  if (tX + tHit < X - Hit) {
    return;
  }
  if (tY - tHit > Y + Y) {
    return;
  }

  if (tY + tHit < Y - Hit) {
    return;
  }
  return (
    Hit + tHit >
    Math.sqrt(Math.pow(Math.abs(X - tX), 2) + Math.pow(Math.abs(Y - tY), 2))
  );
}

function handleKeyDown(e) {
  switch (e.keyCode) {
    case KEYCODE_SPACE:
      fireBullet();
      return false;
    case KEYCODE_LEFT:
      ship.x -= 15;
      return false;
    case KEYCODE_RIGHT:
      ship.x += 15;
      return false;
    case KEYCODE_UP:
      ship.y -= 15;
      return false;
    case KEYCODE_DOWN:
      ship.y += 15;
      return false;
  }
}
