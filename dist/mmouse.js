!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.mmouse=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function clamp(val, min, max) {
  min = typeof min === 'number' ? min : -Infinity;
  max = typeof max === 'number' ? max : Infinity;
  return Math.max(min, Math.min(max, val));
}

function noop() {}

function trackMovement(options) {
  var opts = options || {};
  var startX, startY, diffX, diffY, prevX, prevY, posX = 0, posY = 0;
  var enabled = opts.hasOwnProperty('enabled') ? opts.enabled : true;
  var onMove = opts.onMove || noop;
  var onStart = opts.onStart || noop;
  var onStop = opts.onStop || noop;
  var getMinX = opts.getMinX || noop;
  var getMaxX = opts.getMaxX || noop;
  var getMaxY = opts.getMaxY || noop;
  var getMinY = opts.getMinY || noop;

  function start(e) {
    if (!enabled) { return; }
    startX = e.pageX;
    startY = e.pageY;
    prevX = startX;
    prevY = startY;
    onStart({x: startX, y: startY});
  }

  function stop(e) {
    if (!enabled || startX === undefined) { return; }
    var endX = e.pageX - startX;
    var endY = e.pageY - startY;
    startX = undefined;
    startY = undefined;
    posX = clamp(posX, getMinX(), getMaxX());
    posY = clamp(posY, getMinY(), getMaxY());
    onStop({x: endX, y: endY});
  }

  function track(e) {
    if (!enabled || startX === undefined) { return; }
    posX = posX + (e.pageX - prevX);
    posY = posY + (e.pageY - prevY);
    prevX = e.pageX;
    prevY = e.pageY;

    onMove({
      startX: startX,
      startY: startY,
      endX: e.pageX,
      endY: e.pageY,
      dx: e.pageX - startX,
      dy: e.pageY - startY,
      posX: clamp(posX, getMinX(), getMaxX()),
      posY: clamp(posY, getMinY(), getMaxY())
    });
  }

  return {
    move: function (e) {
      startX = prevX || 0;
      startY = prevY || 0;
      start({pageX: startX, pageY: startY});
      var target = {pageX: startX + (e.x || 0), pageY: startY + (e.y || 0)};
      track(target);
      stop(target);
    },

    disable: function () {
      enabled = false;
      startX = undefined;
      startY = undefined;
    },

    enable: function () {
      enabled = true;
    },

    start: start,
    stop: stop,
    track: track
  };
}

function trackMovementIn(el, opt) {
  var options = opt || {};
  options.getMinX = function () { return 0; };
  options.getMaxX = function () { return el.offsetWidth; };
  options.getMinY = function () { return 0; };
  options.getMaxY = function () { return el.offsetHeight; };
  return trackMovement(options);
}

exports.trackMovement = trackMovement;
exports.trackMovementIn = trackMovementIn;

},{}]},{},[1])(1)
});