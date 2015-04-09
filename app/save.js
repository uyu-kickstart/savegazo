var
fs = require('fs'),
path = require('path');

var
imgDir   = path.join(process.cwd(), 'img'),
metaJson = path.join(imgDir, 'meta.json');

var
meta = JSON.parse(fs.readFileSync(metaJson, 'utf-8'));

module.exports = function (req, res, next) {
  var
  ch = req.body.ch,
  data = req.body.data,
  png = new Buffer(data, 'base64'),
  time = Date.now();

  fs.writeFile(path.join(imgDir, time + '.png'), png, function (err) {
    if (err) return next(err);

    meta[time] = ch;
    fs.writeFile(metaJson, JSON.stringify(meta), function (err) {
      if (err) return next(err);

      res.json({
        ok: true,
      });
      next();
    });
  });
};
