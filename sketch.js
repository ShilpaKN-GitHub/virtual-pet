var database;

var dog, dogImage, happyDogImage;
var foodValue, foodStock;

var timer;

function preload()
{
  dogImage = loadImage("Images/Dog.png");
  happyDogImage = loadImage("Images/happy dog.png");
}

function setup()
{
  createCanvas(500,500);

  database = firebase.database();

  dog = createSprite(250, 300, 150, 150);
  dog.addImage(dogImage);
  dog.scale = 0.15;

  foodStock = database.ref('Food');
  foodStock.on("value", readStock, showError);

  timer = 2;
}

function draw()
{
  background("green");

  if(foodValue !== undefined)
  {
    if(foodValue === 0)
    {
      writeStock(20, false);
      dog.changeImage(dogImage);
    }
  
    if(keyWentDown(UP_ARROW))
    {
      timer = 2;
      writeStock(foodValue, true);
      dog.changeImage(happyDogImage);
    }

    /* If the frameCount is divisible by 30,
      then a second has passed. It will stop at 0. */
    if (frameCount % 30 == 0 && timer > 0)
    {
      timer --;
    }

    if (timer == 0)
    {
      dog.addImage(dogImage);
    }

    drawSprites();

    fill("white");

    stroke("white");
    textSize(20);
    text("Food remaining : " + foodValue, 170, 200);

    noStroke();
    textSize(15);
    text("Note: Press UP_ARROW key to feed milk!", 130, 20);
  }
}

function readStock(data)
{
  foodValue = data.val();
}

function writeStock(value, isFeeding)
{
  if(isFeeding)
  {
    if(value <= 0)
    {
      value = 0;
    }
    else
    {
      value = value - 1;
    }
  }
  
  database.ref('/').update({
    Food: value
  });
}

function showError()
{
  console.error("Error in writing to database!!");
}