(function (global) {
  'use strict';

  var
  W = 300, H = 300;

  var
  down = false,
  x = 0, y = 0,
  canvas = document.getElementById('canvas'),
  ctx = canvas.getContext('2d');

  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  clear();

  canvas.addEventListener('mousedown', function (e) {
    // console.log('mousedown');
    down = true;
    x = e.offsetX; y = e.offsetY;
  });
  canvas.addEventListener('mouseup', function (e) {
    // console.log('mouseup');
    down = false;
  });
  canvas.addEventListener('mousemove', function (e) {
    // console.log('mousemove: x=' + e.offsetX + ' y=' + e.offsetY);
    if (down) {
      line(e.offsetX, e.offsetY);
    }
  });

  document.getElementById('w_up').addEventListener('click', function () {
    ctx.lineWidth = ctx.lineWidth + 1;
    // console.log('lineWidth=' + ctx.lineWidth);
  });
  document.getElementById('w_down').addEventListener('click', function () {
    ctx.lineWidth = Math.max(1, ctx.lineWidth - 1);
    // console.log('lineWidth=' + ctx.lineWidth);
  });

  document.getElementById('clear').addEventListener('click', function () {
    clear();
    document.getElementById('text').value = '';
  });

  document.getElementById('save').addEventListener('click', function () {
    var
    dataUrl = canvas.toDataURL('image/png'),
    ch = document.getElementById('text').value;

    saveRequest({
      data: dataUrl.replace(/^.*,/, ''),
      ch: ch,
    }, function (err, req) {
      console.log(err, req);
    });
  });

  function clear() {
    ctx.clearRect(0, 0, W, H);
  }

  function line(nx, ny) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x = nx, y = ny);
    ctx.stroke();
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

})((this || 0).self || global);
