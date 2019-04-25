var canvas = document.querySelector('canvas');

canvas.height = window.innerHeight-50;
canvas.width = window.innerWidth-50;

var c = canvas.getContext('2d');

var feedButton = document.getElementById("feedButton");
var collectButton = document.getElementById("collectButton");
var QuitButton = document.getElementById("Quit");
var trainButton = document.getElementById("trainButton");





// var playereName = prompt("Enter Username", "Username");
// var playerePass = prompt("Enter Password", "Password");
//var url = prompt("Type server side URL");
var maxHealth;
var maxHunger;
var maxThirst;
var Coins;
var uID;
var nowTime;
var responseTime;
var dead = false;

var playereName;
var playerePass;

var petObject = new pet(petType,(canvas.width/2),(canvas.height)-petY,maxHealth,maxThirst,maxHunger)

var http = new XMLHttpRequest();
ask();

http.onreadystatechange = function() {//Call a function when the state changes.
  if(http.readyState == 4 && http.status == 200) {
      //alert(http.responseText);
      var response = JSON.parse(http.responseText);
      if (response.status == "failed")
      {
        alert(response.error);
        ask();
      }
      else
      {
        console.log("success");
        console.log(response.Health, response.Hunger, response.Thirst);
        maxHealth = response.Health;
        maxHunger = response.Hunger;
        maxThirst = response.Thirst;
        uID = response.uid;
        Coins = response.coins;

        nowTime = new Date();
        responseTime = response.time;

        maxHealth = maxHealth - ((nowTime - responseTime)/100000);
        if (maxHealth < 5)
        {
          maxHealth = 4;
        }
        else dead = false;
        petObject = new pet(petType,(canvas.width/2),(canvas.height)-petY,maxHealth,maxThirst,maxHunger);
        
      }
      //todo get userID
  }
}


function ask()
{
  var url = "https://tamapurdue.pagekite.me";
  if (confirm("Press Ok to create a new account, or cancel if you already have an account")) {
    playereName = prompt("Enter New Username", "Default@forTesting.test");
    playerePass = prompt("Enter New Password", "Password");

    url = url + "/signup";
    var params = JSON.stringify({UserEmail: playereName, UserPassword: playerePass});
    console.log(params);
    http.open('POST', url, true);
    
    //Send the proper header information along with the request
    http.setRequestHeader('Content-Type', 'application/json');
    //http.setRequestHeader('Origin', 'http://localhost:8080');
    http.send(params);

  } else {
    playereName = prompt("Enter your Email to log-in", "Default@forTesting.test");
    playerePass = prompt("Enter a Password", "Password");

    url = url + "/login";
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
    var url = "https://tamapurdue.pagekite.me/postUserInfo";
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
    //console.log(this.x, this.y, petObject.x, petObject.y)
    if (this.x < petObject.x + petX &&
      this.x + Coinsize > petObject.x &&
      this.y < petObject.y + petY &&
      this.y + Coinsize > petObject.y)
      {
        //console.log("BOOM");
        Coins++;
        this.y = canvas.height+1;
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
      c.fillText("$" + Coins + " pet speed: " + petObject.xv ,canvas.width-330,60);
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

    this.train = function()
    {
      this.xv += 1;
      Coins -= 5;
    }

    
    this.feed = function()
    {
      if (this.hunger < 140)
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
      if (this.thirst < 140)
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
      if (this.health < 140)
      {
        console.log("healed");
        this.health += 10;
        Coins -= 3;
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
  

  
  everythingElse = new draw_everthing_else();
  collectables = new collect();
  
  collectButton.addEventListener("click", collectPress);
  feedButton.addEventListener("click", feed);
  drinkButton.addEventListener("click", drink);
  healButton.addEventListener("click", heal);
  QuitButton.addEventListener("click", quitApp);
  trainButton.addEventListener("click", train);


  function train()
  {
    petObject.train();
  }


  function quitApp()
  {
    updateInfo();
    alert("saving...");
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
    collectables.new();
    console.log("pressed");
  }
  
  function collect()
  {
    function getRandomInt(max) 
    {
      return Math.floor(Math.random() * Math.floor(max));
    }
    this.new = function()
    {
      console.log(CoinsArr);
      CoinsArr = [];
      for (i = 0; i < nCoins; i++)
      {
        CoinsArr.push( new aCoin(getRandomInt(canvas.width),-(getRandomInt(canvas.height))))
      }
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
  
  function animate(){
    requestAnimationFrame(animate)
    c.clearRect(0,0,innerWidth, innerHeight);
    everythingElse.backgroundDraw();
    if (collectPressed)
    {
      collectables.update();
      collectables.animate();
    }
    
    everythingElse.healthBarDraw();
    petObject.healthUpdate();
    everythingElse.thirstBarDraw();
    petObject.thirstUpdate();
    everythingElse.hungerBarDraw();
    petObject.hungerUpdate();
    
    petObject.update();
    everythingElse.CoinsUpdate();
  }
  
  animate();