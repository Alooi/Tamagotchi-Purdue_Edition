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
var coins = 10;
var nCoins = 5;
var dead = false;
var collectPressed = false;
var coinsArr = [];
var petX = 150;
var petY = 150;
var coinSize = 30;

function mouse()
{
  var x;
  var y;
}

function aCoin(x,y)
{
  this.x = x;
  this.y = y;
  this.vy = 2;
  
  var coinPic = new Image();
  coinPic.src = "images/coin.jpg";
  
  this.update = function()
  {
    if (this.x < petObject.getX + petX &&
      this.x + coinSize > petObject.getX &&
      this.y < petObject.getY + petY &&
      this.y + coinSize > petObject.getY)
      {
        console.log("BOOM");
      }
      else
      {
        this.y += this.vy;
        if (this.y > 2*canvas.height)
        {
          collectPressed = false;
          console.log("not pressed")
        }
      }
    } 
    
    this.draw = function()
    {
      c.drawImage(coinPic,this.x,this.y,coinSize,coinSize);
      //console.log(this.x,this.y);
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
    this.hungerBarDraw = function()
    {
      var healthBar = new Image();
      healthBar.src = "images/healthBar.jpg";
      c.drawImage(healthBar,20,30,340,85);
    }
    this.thirstBarDraw = function()
    {
      var healthBar = new Image();
      healthBar.src = "images/healthBar.jpg";
      c.drawImage(healthBar,20,30,340,85);
    }
    
    this.coinsUpdate = function()
    {
      c.font = "35px Arial Black";
      c.fillText("$" + coins,25,canvas.height-30);
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
    
    this.getX = function()
    {
      return this.x;
    }
    this.getY = function()
    {
      return this.y;
    }
    
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
      c.drawImage(petImage,this.x,this.y,petX,petY);
      
    }
    
    
    
    this.update = function(){
      if (this.x > mouse.x-(petX/2))
      {
        this.x -= this.xv;
      }
      if (this.x < mouse.x-(petX/2))
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
  
  
  petObject = new pet(petType,(canvas.width/2),(canvas.height)-petY,maxHealth)
  everythingElse = new draw_everthing_else();
  
  collectButton.addEventListener("click", collectPress);
  feedButton.addEventListener("click", feed);
  
  
  function feed()
  {
    if (coins < 1)
    {
      alert("You don't have the moneys.")
    }
    else
    petObject.feed();
  }
  
  function collectPress() 
  {
    collectPressed = true;
    console.log("pressed");
  }
  
  function collect()
  {
    function getRandomInt(max) 
    {
      return Math.floor(Math.random() * Math.floor(max));
    }
    
    
    
    for (i = 0; i < nCoins; i++)
    {
      coinsArr.push( new aCoin(getRandomInt(canvas.width),(getRandomInt(canvas.height))))
    }
    
    
    this.update = function()
    {
      for (n = 0; n < nCoins; n++)
      {
        coinsArr[n].update();
      }
    }
    
    this.animate = function()
    {
      for (n = 0; n < nCoins; n++)
      {
        coinsArr[n].draw();
      }
    }
    
    
  }
  collectables = new collect();
  
  function animate(){
    requestAnimationFrame(animate)
    c.clearRect(0,0,innerWidth, innerHeight);
    everythingElse.backgroundDraw();
    if (collectPressed)
    {
      collectables.update();
      collectables.animate();
    }
    everythingElse.coinsUpdate();
    everythingElse.healthBarDraw();
    petObject.healthUpdate();
    petObject.update();
  }
  
  animate();