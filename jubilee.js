// This changes everything
"use strict";

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

function Particle(opts,states){

  var _P = document.createElement('div'),
      _THIS = this,
      _START = false;
  _P.className = 'particle';
  _P.appendChild(document.createElement('i'));
  this.particleNode = _P;
  this.delay = opts.delay;
  this.duration = opts.duration;
  this.states = states;
  this.options = opts;
  this.paused = true;

  if(!('style' in this.states.start)){
    this.states.start.style = {};
  }
  if(!('style' in this.states.end)){
    this.states.end.style = {};
  }

  function _conditionProp(prop){
    if(typeof prop == 'number'){
      return Math.floor(prop);
    }else{
      return Math.floor(prop[0] + Math.random()*(prop[1]-prop[0]));
    }
  }

  function _getVal(v){
    if(typeof v == 'function'){
      return v(_THIS);
    }else{
      return v;
    }
  }

function _init(){
    void _P.offsetWidth; //trigger reflow
    _P.style.transitionDelay = _P.style.animationDelay = _conditionProp(_getVal(_THIS.delay)) + 'ms';
    _P.style.animationDuration = _P.style.transitionDuration = _conditionProp(_getVal(_THIS.duration)) + 'ms';
    _P.classList.remove('play');
    if(typeof _THIS.options.onInit == 'function'){
      this.options.onInit(_THIS);
    }
  }

  function _toggleState(){

    if(_START || !_THIS.options.loop){
      _init();
      _P.classList.add('play');
      _applyState(_THIS.states.end);
    }else{
      _P.style.transitionDelay = _P.style.animationDelay = '0ms';
      _P.style.animationDuration = _P.style.transitionDuration = '0ms';
      _P.classList.remove('play');
      _applyState(_THIS.states.start);
    }

    _START = !_START;

    if(_THIS.options.loop && !_THIS.paused){
      if(!_START){
        setTimeout(_toggleState,parseInt(_P.style.transitionDelay) + parseInt(_P.style.transitionDuration));
      } else{
        _toggleState();
      }
    }
  }

  function _applyState(state){
    void _P.offsetWidth;
    if('x' in state && 'y' in state){
      _P.style.transform = 'translate3d(' + _getVal(state.x) + 'px,' + _getVal(state.y) + 'px,' + _getVal(state.z) + 'px)';
    }
    if('style' in state){
      for(var rule in state.style){
        if(rule == 'transform'){
          _P.style.transform += ' ' + _getVal(state.style[rule]);
        }else{
          _P.style[rule] = _getVal(state.style[rule]);
        }
      }
    }
  }

  this.play = function(){
    _THIS.paused = false;
    _P.style.transitionDelay = _P.style.animationDelay = '0ms';
    _P.style.transitionDuration = _P.style.animationDuration = '0ms';
    _applyState(_THIS.states.start);
    _init();
    requestAnimFrame(_toggleState);
  }

  this.applyState = function(state){
    _applyState(state);
  }

  this.stop = function(){
    _P.classList.remove('play');
  }

  this.pause = function(){
    _THIS.paused = true;
  }

  this.getNode = function(){
    return _P;
  }
}

// Jubilee contains multiple particles
function Jubilee(elements,options){

  if( this.constructor != Jubilee ){
    Jubilee.instance = new Jubilee(elements, options );
    return Jubilee.instance;
  }

  var _ELEMENT;

  if(!elements){
    return this;
  }
  if( typeof elements == 'string' ){
    elements = document.querySelectorAll(elements);
  }
  if( typeof elements == 'object' && 'length' in elements && elements.length == 1 ){
    _ELEMENT = elements[0];
  } else if( typeof elements == 'object' && 'length' in elements){
    Array.prototype.forEach.call(
      elements,
      function(el){ new Jubilee(el,options);
    });
    return;
  } else if( typeof elements == 'object' && elements.nodeName){
    _ELEMENT = elements;
    _ELEMENT.jubilee = _THIS;
  }

  var _THIS = this,
    _TPL = document.createElement('div'),
    _NODE = null,
    _PAUSED = true,
    _OPT = {
      event: null,
      particles: 4,
      cssClass: '',
      direction: 'radial', // radial (circular), up, down, left, right
      jitter: .2,
      distance: 10,
      delay: 0,
      loop: false,
      duration: 1000,
      container: document.body,
      onParticleCreate: function(){}
    };

  this.particles = null;
  this.options = _OPT;
  this.element = _ELEMENT;

  // private helpers
  function _getOffset(el){
    var rect = el.getBoundingClientRect();
    return {
      top: rect.top + document.body.scrollTop,
      left: rect.left + document.body.scrollLeft
    };
  }

  function _ready(fn) {
    if (document.readyState != 'loading'){
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }
  function _ext( o1,o2 ){
    for (var k in o2) {
      if (o2.hasOwnProperty(k)) o1[k] = o2[k];
    }
    if(typeof o1.distance == 'number'){
      o1.distance = { start: 0, end: o1.distance }
    }
    if(typeof o1.jitter == 'number'){
      o1.jitter = { start: 0, end: o1.jitter }
    }
  }
  function _init(){

    if(typeof _OPT.event == 'string'){
      _OPT.event = {
        start: _OPT.event,
        end: null
      }
    }

    if(_OPT.container == 'parent'){
      _OPT.container = _ELEMENT;
    }
    if(_OPT.event != null){
      for(var name in _OPT.event){
        _ELEMENT.addEventListener(_OPT.event[name],_THIS[name]);
      }
    }

    // build the template
    _TPL.className = 'jubilee ' + _OPT.cssClass;

  }

  function _jitter(v){
    return 1 + ((v * Math.random()) - v/2);
  }

  function _getStates(pos){
    var _s =  {
      start: {
        x: 0,
        y: 0,
        z: 0,
        style: {}
      },
      end: {
        x: 0,
        y: 0,
        z: 0,
        style: {}
      }
    };
    switch(_OPT.direction){
      case 'radial':
        _s.start.x = function(){ return _OPT.distance.start * Math.cos(2 * Math.PI * pos / _OPT.particles) * _jitter(_OPT.jitter.start); };
        _s.start.y = function(){ return _OPT.distance.start * Math.sin(2 * Math.PI * pos / _OPT.particles) * _jitter(_OPT.jitter.start); };
        _s.end.x = function(){ return _OPT.distance.end * Math.cos(2 * Math.PI * pos / _OPT.particles) * _jitter(_OPT.jitter.end); };
        _s.end.y = function(){ return _OPT.distance.end * Math.sin(2 * Math.PI * pos / _OPT.particles) * _jitter(_OPT.jitter.end); };
        break;
      case 'up':
        _s.end.y = function(){ return _OPT.distance.end * -1 * _jitter(_OPT.jitter.end); };
        break;
      case 'down':
        _s.end.y = function(){ return _OPT.distance.end * _jitter(_OPT.jitter.end); };
        break;
      case 'left':
        _s.end.x = function(){ return -_OPT.distance.end * _jitter(_OPT.jitter.end); };
        break;
      case 'right':
        _s.end.x = function(){ return _OPT.distance.end * _jitter(_OPT.jitter.end); };
        break;
      default:
    }

    return _s;
  }

  function _buildParticles(){

    _THIS.particles = [];
    for(var i=0;i<_OPT.particles;++i){
      // setup the particle behavior
      var p = new Particle({
        delay: _OPT.delay,
        duration: _OPT.duration,
        loop: _OPT.loop
      },
      _getStates(i)
      );
      if(typeof _OPT.onParticleCreate == 'function'){
        _OPT.onParticleCreate(p,i);
        p.applyState(p.states.start);
      }
      // append the particle to the jubilee
      var pNode = p.getNode();

      _NODE.appendChild(pNode);

      _THIS.particles.push(p);
    }
  }

  // extend these instance options
  _ext(_OPT,options);

  // build and play!
  this.play = function(e){

    _PAUSED = false;

    if(!_THIS.particles){
      _THIS.build();
      if(_OPT.container != _ELEMENT){
        if(e == undefined){
          var o = _getOffset(_ELEMENT);
          _NODE.style.left = o.left + 'px';
          _NODE.style.top = o.top + 'px';
        } else {
          _NODE.style.left = e.pageX + 'px';
          _NODE.style.top = e.pageY + 'px';
        }
      }
      requestAnimFrame(function(){
        _NODE.classList.remove('stop');
        _NODE.classList.add('play');
      });
    }
    _THIS.particles.forEach(function(p){
      p.play();
    });

    return _THIS;
  }

  this.build = function(){
    _NODE = _TPL.cloneNode(true);
    _buildParticles();
    _NODE.jubilee = _THIS;
    _OPT.container.appendChild(_NODE);
    return _THIS;
  };

  this.pause = function(){
    _PAUSED = true;
    _THIS.particles.forEach(function(p){
      p.pause();
    });

    return _THIS;
  }

  this.toggle = function(){
    if(_PAUSED){
      _THIS.play();
    }else{
      _THIS.pause();
    }
  }

  this.stop = function(e){
    _NODE.classList.remove('play');
    _NODE.classList.add('stop');
    _THIS.destroy();

    return _THIS;
  }

  this.destroy = function(e){
    _THIS.particles = null;
    _OPT.container.removeChild(_NODE);
    return _THIS;
  }

  this.getNode = function(){
    return _NODE;
  }

  _init();

}
