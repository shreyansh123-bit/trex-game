var trex, trex_running, trex_collided,Clouds;
var ground, invisibleGround, groundImage;
var Ob1,Ob2,Ob3,Ob4,Ob5,Ob6;
var gameOverimg,restartimg,gameOver,restart,trexC;
//groups
var ObstaclesGroup,CloudsGroup;
//game STATEs
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var count=0;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
 Ob1=loadImage('obstacle1.png');
  Ob2=loadImage('obstacle2.png');
  Ob3=loadImage('obstacle3.png');
  Ob4=loadImage('obstacle4.png');
  Ob5=loadImage('obstacle5.png');
  Ob6=loadImage('obstacle6.png');
  
  trexC=loadAnimation('trex_collided.png')
  
  restartimg=loadImage('restart.png');
  gameOverimg=loadImage('gameOver.png');
  
  
  trex_collided = loadImage("trex_collided.png");
  Clouds=loadImage("cloud.png");
  groundImage = loadImage("ground2.png")
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation('collided',trexC);
  trex.scale = 0.5;
  
  ObstaclesGroup=createGroup();
  CloudsGroup=createGroup();
  
  gameOver=createSprite(300,80)
  restart=createSprite(300,130)
  gameOver.addImage(gameOverimg)
  restart.addImage(restartimg)
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -6;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
}

function draw() {
  background(260);
  
   //display score
  text("Score: "+ count, 520, 50);
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(6 + 3*count/100);
   
    //scoring
    count =count+ Math.round(World.frameRate/60);
    
    if (count>0 && count%100 === 0){
      //playSound("checkPoint.mp3");
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
     //jump when the space key is pressed
    if(keyDown("space") && trex.y >= 160){
      trex.velocityY = -12 ;
      //playSound("jump.mp3");
    }
  
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
    
    //spawn the clouds and obstacles
    spawnClouds();
    spawnObstacles();
    
    //End the game when trex is touching the obstacle
    if(ObstaclesGroup.isTouching(trex)){
     
      
      gameState = END;
     // playSound("die.mp3");
 }
 gameOver.visible = false;
    restart.visible = false; 
  }
  
  else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation('collided',trexC);
    
//set lifetime of the game objects so that they are never destroyed
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);

if(mousePressedOver(restart)) {
    reset();
  }
   }
    //stop trex from falling down
  trex.collide(invisibleGround);
  
  drawSprites();
}

function reset(){
  gameState=PLAY;
   ObstaclesGroup.destroyEach();
  CloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  gameOver.visible=false;
  restart.visible=false;
  count=0;
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (World.frameCount % 60 === 0) {
    var cloud = createSprite(600,320,40,10);
    cloud.y =Math.round(random (10,100));
    cloud.addImage("cloud",Clouds);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    CloudsGroup.add(cloud);
    
     //assign lifetime to the variable
    cloud.lifetime = 204;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
  }
  
}

function spawnObstacles() {
  if(World.frameCount % 60 === 0) {
    var obstacle = createSprite(600,160,10,40);
    obstacle.velocityX = -6;
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    
    switch(rand){
    case 1:obstacle.addImage(Ob1)   
   break 
    case 2:obstacle.addImage(Ob2)   
   break 
   case 3:obstacle.addImage(Ob3)   
   break 
    case 4:obstacle.addImage(Ob4)   
   break 
   case 5:obstacle.addImage(Ob5)   
   break 
    case 6:obstacle.addImage(Ob6)   
   break 
    
    }
   ObstaclesGroup.add(obstacle);
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 100;
  }
}