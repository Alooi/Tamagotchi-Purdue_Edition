var canvas = document.querySelector('canvas');

canvas.height = window.innerHeight-50;
canvas.width = window.innerWidth-50;

var c = canvas.getContext('2d');

var feedButton = document.getElementById("feedButton");
var collectButton = document.getElementById("feedButton");





//var playereName = prompt("Whats your name", "Enter name here");

// var petType = prompt("which pet you want?", "cat/dog");
var petType = "dog";

//var petType = "cat.png";

//Stats to be retrived from the data base.
var maxHealth = 260;
var maxHunger = 260;
var maxThirst = 260;
var coins = 5;
var dead = false;

//

function mouse()
{
  var x;
  var y;
}

function aCoin()
{
  this.x;
  this.y;
  this.vy;

  var coinPic = new Image();
  coinPic.src = "images/coin.jpg";

  this.animate = function()
  {
    
  }
}

window.addEventListener('mousemove', 
function(event) {
  mouse.x = event.x;
  mouse.y = event.y;
  //console.log(mouse.x);
})

function Dead()
{
  dead = true;
  //console.log("DEYAAD");
}



function draw_everthing_else()
{
  this.backgroundDraw = function()
  {
    var backgroundImage = new Image();
    backgroundImage.src = "images/roomPic.jpg";
    c.drawImage(backgroundImage,0,0,canvas.width,canvas.height);
    //console.log(backgroundImage);
  }

  this.healthBarDraw = function()
  {
    var healthBar = new Image();
    healthBar.src = "images/healthBar.jpg";
    c.drawImage(healthBar,20,30,340,85);
  }

  this.coinsUpdate = function()
  {
    c.font = "35px Arial Black";
    c.fillText("$" + coins,25,166);
    // c.beginPath();
    // c.fillStyle = "white";
    // c.fillRect(20,133,340,84);
  }
}

function pet(petType,x,y,health){
    this.x = x;
    this.y = y;
    this.xv = 5;
    this.health  = health;
    this.healthV = 0.08;
    var petImage = new Image();
    petImage.src = "./images/" + petType + ".jpg";

    this.feed = function()
    {
      if (this.health < maxHealth)
      {
        console.log("been fed");
        this.health += 10;
        coins--;
      }
      else
      {
        console.log("Tummy is full buddy");
      }

    }

    this.healthUpdate = function()
    {
      if (this.health > 10)
      {
        this.health -= this.healthV;
      }
      else
      {
        Dead();
      }
      c.beginPath();
      c.fillStyle = "red";
      c.fillRect(93,53,this.health,40);
      c.stroke();
    }

    

  this.draw = function(){
    //console.log(this.x,this.y);
    c.drawImage(petImage,this.x,this.y,250,250);
    
  }


  this.update = function(){
    if (this.x > mouse.x-125)
    {
      this.x -= this.xv;
    }
    if (this.x < mouse.x-125)
    {
      this.x += this.xv;
    }
    //this.y++;
    if (dead)
    {
      petImage.src = "images/dead.png";
    }
    this.draw();
  }

}


petObject = new pet(petType,(canvas.width/2),(canvas.height)-250,maxHealth)
everythingElse = new draw_everthing_else();

feedButton.addEventListener("click", feed);
collectButton.addEventListener("click", collect);
function feed()
{
  if (coins < 1)
  {
    alert("You don't have the moneys.")
  }
  else
  petObject.feed();
}
function collect()
{
  function getRandomInt(max) 
  {
    return Math.floor(Math.random() * Math.floor(max));
  }
  // for (i = 0; i < nCoins; i++)
  // {
  //   getRandomInt()
  // }
}

function animate(){
  requestAnimationFrame(animate)
  c.clearRect(0,0,innerWidth, innerHeight);
  everythingElse.backgroundDraw();
  everythingElse.coinsUpdate();
  everythingElse.healthBarDraw();
  petObject.healthUpdate();
  petObject.update();
}

animate();