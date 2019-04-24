var canvas = document.querySelector('canvas');

canvas.height = window.innerHeight-50;
canvas.width = window.innerWidth-50;

var c = canvas.getContext('2d');

var feedButton = document.getElementById("feedButton");
var collectButton = document.getElementById("feedButton");
var QuitButton = document.getElementById("Quit");





// var playereName = prompt("Enter Username", "Username");
// var playerePass = prompt("Enter Password", "Password");
//var url = prompt("Type server side URL");
var url = "https://tamapurdue.pagekite.me";
var maxHealth = 140;
var maxHunger = 140;
var maxThirst = 140;
var Coins = 20;
var uID;


ask();

http.onreadystatechange = function() {//Call a function when the state changes.
  if(http.readyState == 4 && http.status == 200) {
      //alert(http.responseText);
      var response = JSON.parse(http.responseText);
      if (response.status == "failed")
      {
        alert(response.message);
        ask();
      }
      else
      {
        maxHealth = response.Health;
        maxHunger = response.Hunger;
        maxThirst = response.Thirst;
        uID = response.uid;
        //Coins = response.Coins;
      }
      //todo get userID
  }
}


function ask()
{
  var http = new XMLHttpRequest();
  if (confirm("Create new account?")) {
    var playereName = prompt("Enter New Username", "Username");
    var playerePass = prompt("Enter New Password", "Password");

    var url = url + "/signup";
    var params = JSON.stringify({UserEmail: playereName, UserPassword: playerePass});
    console.log(params);
    http.open('POST', url, true);
    
    //Send the proper header information along with the request
    http.setRequestHeader('Content-Type', 'application/json');
    //http.setRequestHeader('Origin', 'http://localhost:8080');
    http.send(params);

  } else {
    var playereName = prompt("Enter Email", "Email");
    var playerePass = prompt("Enter Password", "Password");

    var url = url + "/login";
    var params = JSON.stringify({UserEmail: playereName, UserPassword: playerePass});
    console.log(params);
    http.open('POST', url, true);
    
    //Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/json');
    http.send(params);

  }
}

function updateInfo()
{
    var url = url + "/postUserInfo";
    var params = JSON.stringify({uid: uID, Email: playereName, Health: petObject.health, Hunger: petObject.hunger, Thirst: petObject.thirst, coins: Coins});
    console.log(params);
    http.open('POST', url, true);
    
    //Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/json');
    http.send(params);
}

//todo GET USER INFO.


// var petType = prompt("which pet you want?", "cat/dog");
var petType = "dog";

//var petType = "cat.png";

//Stats to be retrived from the data base.
var nCoins = 5;
var dead = false;
var collectPressed = false;
var CoinsArr = [];
var petX = 150;
var petY = 150;
var Coinsize = 30;

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
  coinPic.src = "images/coin.jpeg";
  
  this.update = function()
  {
    if (this.x < petObject.getX + petX &&
      this.x + Coinsize > petObject.getX &&
      this.y < petObject.getY + petY &&
      this.y + Coinsize > petObject.getY)
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
      c.drawImage(coinPic,this.x,this.y,Coinsize,Coinsize);
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
      healthBar.src = "images/newHealthBar.jpeg";
      c.drawImage(healthBar,20,30,180,43);
    }
    this.thirstBarDraw = function()
    {
      var thirsthBar = new Image();
      thirsthBar.src = "images/thirstBar.jpeg";
      c.drawImage(thirsthBar,20,90,180,43);
    }
    this.hungerBarDraw = function()
    {
      var hungerhBar = new Image();
      hungerhBar.src = "images/hungerBar.jpeg";
      c.drawImage(hungerhBar,20,150,180,43);
    }
    
    this.CoinsUpdate = function()
    {
      c.font = "35px Arial Black";
      c.fillText("$" + Coins,canvas.width-100,canvas.height-30);
      // c.beginPath();
      // c.fillStyle = "white";
      // c.fillRect(20,133,340,84);
    }
  }
  
  function pet(petType,x,y,health,thirst,hunger){
    this.x = x;
    this.y = y;
    this.xv = 5;
    this.health  = health;
    this.healthV = 0.01;
    this.thirst  = thirst;
    this.thirstV = 0.02;
    this.hunger  = hunger;
    this.hungerV = 0.015;
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
      if (this.hunger < maxHunger)
      {
        console.log("it eats");
        this.hunger += 10;
        Coins--;
      }
      else
      {
        console.log("Tummy is full buddy");
      }
      
    }
    this.drink = function()
    {
      if (this.thirst < maxThirst)
      {
        console.log("it drinks");
        this.thirst += 10;
        Coins--;
      }
      else
      {
        console.log("Tummy is full buddy");
      }
      
    }
    this.heal = function()
    {
      if (this.health < maxHealth)
      {
        console.log("healed");
        this.health += 10;
        Coins--;
      }
      else
      {
        console.log("Tummy is full buddy");
      }
      
    }
    
    this.healthUpdate = function()
    {
      if (this.health > 5)
      {
        this.health -= this.healthV;
      }
      else
      {
        Dead();
      }
      c.beginPath();
      c.fillStyle = "red";
      c.fillRect(60,42,this.health,20);
      c.stroke();
    }

    this.thirstUpdate = function()
    {
      if (this.thirst > 5)
      {
        this.thirst -= this.thirstV;
      }
      else
      {
        Dead();
      }
      c.beginPath();
      c.fillStyle = "blue";
      c.fillRect(60,102,this.thirst,20);
      c.stroke();
    }

    this.hungerUpdate = function()
    {
      if (this.hunger > 5)
      {
        this.hunger -= this.hungerV;
      }
      else
      {
        Dead();
      }
      c.beginPath();
      c.fillStyle = "green";
      c.fillRect(60,162,this.hunger,20);
      c.stroke();
    }
    
    
    
    this.draw = function(){
      //console.log(this.x,this.y);
      c.drawImage(petImage,this.x,this.y,petX,petY);
      
    }
    
    
    
    this.update = function(){
      if (this.x > mouse.x-(petX/2) && mouse.y > canvas.height/2)
      {
        this.x -= this.xv;
      }
      if (this.x < mouse.x-(petX/2) && mouse.y > canvas.height/2)
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
  
  
  petObject = new pet(petType,(canvas.width/2),(canvas.height)-petY,maxHealth,maxThirst,maxHunger)
  everythingElse = new draw_everthing_else();
  
  collectButton.addEventListener("click", collectPress);
  feedButton.addEventListener("click", feed);
  drinkButton.addEventListener("click", drink);
  healButton.addEventListener("click", heal);
  QuitButton.addEventListener("click", quitApp);

  function quitApp()
  {
    updateInfo();
    self.close();
  }

  
  
  function feed()
  {
    if (Coins < 1)
    {
      alert("You don't have the moneys.")
    }
    else
    petObject.feed();
  }

  function drink()
  {
    if (Coins < 1)
    {
      alert("You don't have the moneys.")
    }
    else
    petObject.drink();
  }

  function heal()
  {
    if (Coins < 1)
    {
      alert("You don't have the moneys.")
    }
    else
    petObject.heal();
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
      CoinsArr.push( new aCoin(getRandomInt(canvas.width),-(getRandomInt(canvas.height))))
    }
    
    
    this.update = function()
    {
      for (n = 0; n < nCoins; n++)
      {
        CoinsArr[n].update();
      }
    }
    
    this.animate = function()
    {
      for (n = 0; n < nCoins; n++)
      {
        CoinsArr[n].draw();
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
    everythingElse.CoinsUpdate();
    everythingElse.healthBarDraw();
    petObject.healthUpdate();
    everythingElse.thirstBarDraw();
    petObject.thirstUpdate();
    everythingElse.hungerBarDraw();
    petObject.hungerUpdate();
    
    petObject.update();
  }
  
  animate();