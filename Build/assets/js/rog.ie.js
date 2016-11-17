// This changes everything
"use strict";

function styleLetters(){
  var words = document.querySelectorAll('.styled-letters');
  words.forEach(function(word){
    word.childNodes.forEach(function(str){
      if(str.wholeText){
        word.innerHTML = str.wholeText.replace(/(.)/ig,'<span>$1</span>');
      }
    });
  });
}
styleLetters();



setTimeout(function(){

  var colors = ['#F9ED32','#9339B8','#062BFD','#E04595','#F3836B','#D31257'],
      classes = ['squiggle','heart','triangle','circle','heart','noodle','cross','pacman','box','star'];

  function randVal(num,append){
      append = append || '';
      return (Math.random()>0.5?-1:1) * (Math.random()*num).toFixed(2) + append;
  }

  function randomTransform(){
    return 'translate3d(0,0,' + randVal(-50,'px') + ') skewX(' + randVal(10,'deg') + ') scale3d(' + randVal(2,',') + randVal(2,',') + randVal(2) + ') rotate3d(' + randVal(1,',')  + randVal(1,',') + randVal(1) + ',15deg)';
  }
  function randomEndTransform(){
    return 'translate3d(0,0,' + randVal(300,'px') + ') skewX(' + randVal(10,'deg') + ') scale3d(' + randVal(2,',') + randVal(2,',') + randVal(2) + ') rotate3d(' + randVal(1,',')  + randVal(1,',') + randVal(1) + ',15deg)';
  }
  /*
  new Jubilee(
    document.querySelectorAll('.twinkly-text')[0],
    {
      distance: 20,
      particles: 3,
      delay: [0,500],
      loop: true,
      direction: 'radial',
      cssClass: 'delight',
      container: 'parent',
      duration: [400,700],
      onParticleCreate: function(p,i){
      }
    }
  ).play();*/


  var razzleDazzle = new Jubilee(
    document.querySelectorAll('.identity>a')[0],
    {
      distance: {start: 50, end:200},//{start:0, end: 300},
      particles: 30,
      jitter:0,
      delay: [0,200],
      loop: true,
      direction: 'radial',
      cssClass: 'celebrate',
      container: 'parent',
      duration: [500,1000],
      onParticleCreate: function(p,i){
        var particleClass = classes[Math.floor(classes.length*Math.random())];
        p.states.start.style.transform = randomTransform;
        p.states.end.style.transform = randomEndTransform;
        p.states.start.style.color = function(){return colors[Math.floor(colors.length * Math.random())]};
        p.states.end.style.color = function(){return colors[Math.floor(colors.length * Math.random())]};
        p.particleNode.classList.add(particleClass);
        if(particleClass == 'star'){
          p.particleNode.innerHTML = '<svg width="51" height="73" viewBox="0 0 51 73" xmlns="http://www.w3.org/2000/svg"><path d="M51 36.007v-.014c-13.736-.378-24.813-16.304-24.998-35.993h-.005c-.187 19.928-11.531 36-25.498 36l-.5-.007v.014l.5-.007c14.083 0 25.5 16.342 25.5 36.5l-.002.5h.005l-.002-.5c0-19.919 11.148-36.112 25-36.493z" fill="#FFB94A"/></svg>';
        } else if (particleClass == 'noodle'){
          p.particleNode.innerHTML = '<svg width="33" height="45" viewBox="0 0 33 45" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Canvas" transform="translate(101 -1)" figma:type="canvas"><g id="Vector" style="mix-blend-mode:normal;" figma:type="vector"><use xlink:href="#path0_stroke" transform="matrix(0.5 0.866025 -0.866025 0.5 -80.5946 -4.73557)" fill="#9B51E0" style="mix-blend-mode:normal;"/></g></g><defs><path id="path0_stroke" d="M 0.758427 17.5L -2.21465 19.3468L 0.758427 17.5ZM -2.97308 18.1259L -2.21465 19.3468L 3.7315 15.6532L 2.97308 14.4322L -2.97308 18.1259ZM 41.2685 19.3468L 42.0269 20.5678L 47.9731 16.8741L 47.2146 15.6532L 41.2685 19.3468ZM -2.21465 19.3468C 4.16105 29.6106 19.0974 29.6106 25.4731 19.3468L 19.5269 15.6532C 15.8897 21.5085 7.36874 21.5085 3.7315 15.6532L -2.21465 19.3468ZM 25.4731 19.3468C 29.1103 13.4915 37.6313 13.4915 41.2685 19.3468L 47.2146 15.6532C 40.8389 5.38943 25.9026 5.38943 19.5269 15.6532L 25.4731 19.3468Z"/></defs></svg>';
        }
      }
    }
  ).play();

  razzleDazzle.element.addEventListener('mouseover',function(){
    razzleDazzle.pause();
  });
  razzleDazzle.element.addEventListener('mouseout',function(){
    razzleDazzle.play();
  });

  },1500
);
