let faceapi;
let detections = [];
let dynamicHappy = 0;
let dynamicSad = 0;
let dynamicNormal = 0;
var dynamicColor = 0;

let video;
let canvas

/* arrays of the elements that are created */
var ovals = [10];
var rects=[17];
var elipses = [25];
angle = 0;

var sounds = [];

/* loading sounds from the asset folder */
function preload(p) {
  sounds.push(p.loadSound("../assets/sound1.mp3"));
  sounds.push(p.loadSound("../assets/sound2.mp3"));
  sounds.push(p.loadSound("../assets/sound3.mp3"));
  sounds.push(p.loadSound("../assets/sound4.mp3"));
  sounds.push(p.loadSound("../assets/sound5.mp3"));
  sounds.push(p.loadSound("../assets/sound6.mp3"));
  sounds.push(p.loadSound("../assets/sound7.mp3"));
}

/* using the ml5.js face api model */
function faceReady() {
    faceapi.detect(gotFaces);
  }
  
  function gotFaces(error, result) {
    if (error) {
      console.log(error);
      return;
    }
  
    /* detections is an array that holds objects inside of it, in this case the facial expressions is what
    we are looking for*/
    detections = result;　
    if (detections[0] && detections[0].expressions) {
      /* accessing only happy,sad and neutral properties of the 'expressions' object */
      var {happy, sad, neutral} = detections[0].expressions;
      /* mapping the variables to be able to work with bigger numbers */
      let happyColor = sketch1.map(happy, 0, 1, 0, 700);
      let sadColor= sketch1.map(sad, 0, 1,0, 300);
      let normalColor = sketch1.map(neutral, 0, 1, 0, 200);

      /* difference variable is created so the changes in colour are not so sudden */
      /* is looking at a difference between the current colour and the wanted colour and slowly adding towards it */
      let differenceHappy = happyColor - dynamicHappy;
      differenceHappy*=0.1;
      let differenceSad = sadColor - dynamicSad;
      differenceSad*=0.1;
      let differenceNormal = normalColor - dynamicNormal;
      differenceNormal*=0.1;
      
      /* to get rid of the decimal point in numbers */
      dynamicHappy += Math.round(differenceHappy);
      dynamicSad += Math.round(differenceSad);
      dynamicNormal += Math.round(differenceNormal);
      /* divided all of the colours by 3 so I can get one number as the average of all 3 and use that as the colour */
      dynamicColor = Math.round((dynamicHappy+dynamicSad+dynamicNormal)/3);
      
      
    }
    faceapi.detect(gotFaces);
  }

  /* created using an example on codepen: https://codepen.io/edhebert/pen/VpBzRo */
  /* two canvases, the web cam video is on one canvas and the art is generating on the other */
var c1 = function(p){
    p.setup = function(){
        var canvas = p.createCanvas(500, 500);
        canvas.parent('#sketch1');
        video = p.createCapture(p.VIDEO);// Creates the live video from webcam
        video.id("video");
        video.size(p.width, p.height);

        const faceOptions = {
            withLandmarks: true,
            withExpressions: true,
            withDescriptors: true,
            minConfidence: 0.5
        };

        //Initializes the api model
         faceapi = ml5.faceApi(video, faceOptions, faceReady);
    }
}

/* second canvas where the art is */
var c2 = function(p){
    p.setup = function(){
      p.angleMode(p.DEGREES) /* otherwise they would be in PI */
        var canvas = p.createCanvas(1920, 1080);
        canvas.parent('#sketch2');
        p.background(255,255, 255);
        preload(p); /* preloading the sounds */
        /* all of the elements in the setup function are drawn only once */
        /* defining the ellipses of the main spirograph */
        for (i = 0; i < 25; i++) {
            elipses[i] = {
                angle: angle,
                r1: p.random(200,450),
                r2: p.random(700,900)
            }
            angle = angle + 7;
          }

          /* defining the rectangles */
          for (j = 0; j < 17; j++) {
        rects[j] = {
          //by multiplying with 0.1 and 0.9 I'm constraining the elements to show up inside of the canvas
          x: p.random(p.width * 0.1, p.width * 0.9),
          y: p.random(p.height * 0.1, p.height * 0.9),
          w: p.random(10, 20),
          h: p.random(20, 40),
          i: p.random(5, 10),
          r: p.random(10, 50), 
          g: p.random(80, 150),
          b: p.random(100, 150),
          a: 120,
          angle: p.random(-1.5, 3),
          ofX: p.random(40, 150),
          ofY: p.random(40, 150),
          ofSpeed: p.random(0.1, 0.6),
        }
        
          }
          /* defining the ovals */
          for(l=0; l<10; l++){
            ovals[l] = {
              x: p.random(p.width * 0.1, p.width * 0.9),
              y: p.random(p.height * 0.1, p.height * 0.9),
              w: p.random(20, 30),
              h: p.random(10, 40),
              angle: p.random(1.5,-5),
              i: p.random(4,10),
              r: p.random(135,176), 
              g: p.random(206,224),
              b: p.random(230,250),
              a: 120,
              ofX: p.random(40, 150),
              ofY: p.random(40, 150),
              ofSpeed: p.random(0.1, 0.5),
            }
          }

         
    }



    p.draw = function(){
        p.background(0);
      
        /* a sound is played based on the frame count */
        if(p.frameCount % 600 == 0){
          let randSound = p.random(sounds);
          console.log(randSound);
          randSound.play();
      }

      /* drawing all of the main elements */
        myrect(p);
        myoval(p);
        mycircle(p);
    }
}

/* the main spirograph function */
function mycircle(p) {
    p.push();
    /* using blend mode to get special effects with the colours */
    p.blendMode(p.DIFFERENCE);
    p.translate(960, 540);
    p.rotate(p.frameCount*0.1)

    /* console.log(dynamicColor);  */

    for (i = 0; i < 25; i++) {
      /* using hsba instead of the rgb (hue, saturation, brightness and alpha) */
        var h = p.color(`hsba(${dynamicColor}, 90%, 40%, 0.4)`);

        if(dynamicColor > 90){
          p.stroke(255);
          p.fill(h);
        
         }
         else{
          p.noFill();
          p.stroke(255);
        }  

        p.rotate(elipses[i].angle);
        p.ellipse(0, 0, elipses[i].r1, elipses[i].r2);
      }
    p.pop();
  }

  /* function for the rectangles */
  function myrect(p) {

    for(j=0; j<17; j++){
      p.push();  

      /* moving the rectangles by offset using sin and cos */
      let offsetX = p.sin(p.frameCount * rects[j].ofSpeed) *rects[j].ofX
      let offsetY = p.cos(p.frameCount * rects[j].ofSpeed) *rects[j].ofY

      p.translate(offsetX, offsetY);
 
      for (var total = 0; total < rects[j].i; total++) {
        var width = (rects[j].i - total) * rects[j].w;
        var height = (rects[j].i - total) * rects[j].h;

        if(dynamicColor>95){
          p.noFill();
          p.stroke(rects[j].r,rects[j].g,rects[j].b,rects[j].a);
        }
        else{
          p.noFill();
          p.stroke(255)
          p.strokeWeight(0.5)
        }

        
        p.rotate(rects[j].angle);
        p.rect(rects[j].x, rects[j].y, width, height);
      }
      p.pop();
    }
  
  }

  /* function for the ovals */
  function myoval(p) {
    for (l = 0; l<10; l++){

      p.push();
      
       /* moving the ovals by offset using sin and cos */  
      let offsetX = p.sin(p.frameCount * ovals[l].ofSpeed) *ovals[l].ofX
      let offsetY = p.cos(p.frameCount * ovals[l].ofSpeed) *ovals[l].ofY

      p.translate(offsetX, offsetY);

      if(dynamicColor>90){
        p.fill(ovals[l].r,ovals[l].g,ovals[l].b,ovals[l].a)
      }
      else{
        p.noFill();
      }

      for (var total = 0; total < ovals[l].i; total++) {
        var width = (ovals[l].i - total) * ovals[l].w;
        var height = (ovals[l].i - total) * ovals[l].h;
        p.strokeWeight(0.4)
        p.stroke(255)
        p.rotate(ovals[l].angle);
        p.ellipse(ovals[l].x, ovals[l].y, width, height);
      }

    
      p.pop();
  }
    
  }


var sketch1 = new p5(c1);
var sketch2 = new p5(c2);



