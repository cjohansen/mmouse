/*global beforeEach */

var mmouse = require('../index.js');

describe('mmouse', function () {
  var onStart, onMove, onStop, opt;

  beforeEach(function () {
    onStart = sinon.spy();
    onMove = sinon.spy();
    onStop = sinon.spy();
    opt = {onStart: onStart, onMove: onMove, onStop: onStop};
  });

  it('triggers onMove when moving', function () {
    var tracker = mmouse.trackMovement({onMove: onMove});

    tracker.start({pageX: 50, pageY: 50});
    tracker.track({pageX: 49, pageY: 50});
    tracker.track({pageX: 48, pageY: 50});
    tracker.track({pageX: 47, pageY: 50});

    assert.calledThrice(onMove);
    assert.calledWith(onMove, {
      startX: 50,
      startY: 50,
      endX: 47,
      endY: 50,
      dx: -3,
      dy: 0,
      posX: -3,
      posY: 0
    });
  });

  it('moves programatically', function () {
    var tracker = mmouse.trackMovement(opt);

    tracker.move({x: 2, y: 5});

    assert.calledOnce(onStart);
    assert.calledOnce(onMove);
    assert.calledWith(onMove, {
      startX: 0,
      startY: 0,
      endX: 2,
      endY: 5,
      posX: 2,
      posY: 5,
      dx: 2,
      dy: 5
    });
    assert.calledOnce(onStop);
  });

  it('does not trigger events when disabled', function () {
    var tracker = mmouse.trackMovement(opt);
    tracker.disable();

    tracker.start({pageX: 50, pageY: 50});
    tracker.track({pageX: 51, pageY: 50});
    tracker.stop({pageX: 51, pageY: 50});

    refute.called(onStart);
    refute.called(onMove);
    refute.called(onStop);
  });

  it('initializes tracker disabled', function () {
    var tracker = mmouse.trackMovement({enabled: false});

    tracker.move({x: 1, y: 0});

    refute.called(onStart);
    refute.called(onMove);
    refute.called(onStop);
  });

  it('moves in two motions', function () {
    var tracker = mmouse.trackMovement(opt);

    tracker.start({pageX: 50, pageY: 50});
    tracker.track({pageX: 49, pageY: 50});
    tracker.track({pageX: 48, pageY: 50});
    tracker.track({pageX: 47, pageY: 50});
    tracker.stop({pageX: 47, pageY: 50});

    tracker.start({pageX: 450, pageY: 100});
    tracker.track({pageX: 449, pageY: 100});
    tracker.track({pageX: 448, pageY: 100});
    tracker.track({pageX: 447, pageY: 100});
    tracker.stop({pageX: 447, pageY: 100});

    assert.equals(onMove.callCount, 6);
    assert.equals(onMove.getCall(5).args[0].posX, -6);
    assert.equals(onMove.getCall(5).args[0].posY, 0);
  });

  it('stays within min/max position', function () {
    opt.getMinX = function () { return 10; };
    opt.getMaxX = function () { return 100; };
    opt.getMinY = function () { return 20; };
    opt.getMaxY = function () { return 200; };
    var tracker = mmouse.trackMovement(opt);

    tracker.move({x: 1, y: 1});
    assert.match(onMove.lastCall.args[0], {posX: 10, posY: 20});

    tracker.move({x: 200, y: 30});
    assert.match(onMove.lastCall.args[0], {posX: 100, posY: 50});

    tracker.move({x: -25, y: 300});
    assert.match(onMove.lastCall.args[0], {posX: 75, posY: 200});
  });
});
