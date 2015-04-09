(function (global) {
  'use strict';

  // constants
  var
  W = 300, H = 300,
  DEFAULT_LINE_WIDTH = 10,
  CURVE_DETECT = 80 / 180 * Math.PI, // 80 degree over
  SAME_DISTANCE = 10;

  // global? variables
  var
  // DOM and canvas context
  text = document.getElementById('text'),
  canvas = document.getElementById('canvas'),
  ctx = canvas.getContext('2d'),

  // status
  down = false,
  x = 0, y = 0,
  curve = NaN,
  handwrite = [];


  // context's default settings
  ctx.lineWidth = DEFAULT_LINE_WIDTH;
  ctx.lineCap = 'round';

  // draw events

  // mouse down = start drawing a line
  canvas.addEventListener('mousedown', function mousedown(e) {
    // console.log('mousedown');
    down = true;
    x = e.offsetX; y = e.offsetY;
    curve = NaN;
    handwrite.push([]);
    addCurve(x, y);
  });

  // mouse up = stop drawing a line
  canvas.addEventListener('mouseup', function mouseup(e) {
    // console.log('mouseup');
    down = false;
    addCurve(x, y);

    x = 0; y = 0;
    curve = NaN;
  });

  canvas.addEventListener('mousemove', function mousemove(e) {
    // console.log('mousemove: x=' + e.offsetX + ' y=' + e.offsetY);
    if (down) {
      var
      // next x/y/curve
      nx = e.offsetX, ny = e.offsetY,
      ncurve;

      if (!(nx === x || ny === y)) {
        line(nx, ny);
        ncurve = Math.atan2(ny - y, nx - x);
        if (Math.abs(ncurve - curve) >= CURVE_DETECT) {
          addCurve(x, y);
        }
        x = nx; y = ny;
        curve = ncurve;
      }
    }
    e.stopPropagation();
  });

  // control the line width
  document.getElementById('w_up').addEventListener('click', function w_upClick() {
    ctx.lineWidth = ctx.lineWidth + 1;
    // console.log('lineWidth=' + ctx.lineWidth);
  });
  document.getElementById('w_down').addEventListener('click', function w_downClick() {
    ctx.lineWidth = Math.max(1, ctx.lineWidth - 1);
    // console.log('lineWidth=' + ctx.lineWidth);
  });

  // clear canvas and status
  document.getElementById('clear').addEventListener('click', function clearClick() {
    clear();
  });

  // save an image and information(s)
  document.getElementById('save').addEventListener('click', function saveClick() {
    var
    dataUrl = canvas.toDataURL('image/png'),
    ch = text.value;

    saveRequest({
      data: dataUrl.replace(/^.*,/, ''),
      ch: ch,
      handwrite: handwrite,
    }, function saveCallback(err, req) {
      clear();
      console.log(err, req);
    });
  });


  // implementation of a process `clear canvas and status'
  function clear() {
    ctx.clearRect(0, 0, W, H);
    text.value = '';
    handwrite = [];
    x = 0; y = 0;
    curve = NaN;
    down = false;
  }

  function line(nx, ny) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(nx, ny);
    ctx.stroke();
  }

  function point(x, y) {
    var
    lineWidth = ctx.lineWidth;

    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#f00';
    ctx.beginPath();
    ctx.arc(x, y, lineWidth / 2, 0, Math.PI*2, true);
    ctx.stroke();
    ctx.restore();
  }

  function saveRequest(json, callback) {
    var
    req = new XMLHttpRequest();
    
    req.open('POST', '/save', true);

    req.addEventListener('load', function () {
      callback(null, req);
    });
    req.addEventListener('error', function (err) {
      callback('error', req);
    });
    req.addEventListener('timeout', function () {
      callback('timeout', req);
    });

    req.setRequestHeader('Content-Type', 'application/json');

    req.send(JSON.stringify(json));

  }

  // handwrite utility

  function addCurve(x, y) {
    var
    line = handwrite[handwrite.length - 1],
    xy = [x, y];

    if (line.length === 0 || euclidDistance(line[line.length - 1], xy) > SAME_DISTANCE) {
      console.log('curve: x=' + x + ' y=' + y);
      point(x, y);

      line.push(xy);
    }
  }


  // another utility

  // get a last element of the array.
  function last(arr) {
    return arr[arr.length - 1];
  }

  // get a euclid distance between A and B
  function euclidDistance(ptA, ptB) {
    return Math.sqrt(
      (ptA[0] - ptB[0]) * (ptA[0] - ptB[0]) +
      (ptA[1] - ptB[1]) * (ptA[1] - ptB[1])
    );
  }

})((this || 0).self || global);
