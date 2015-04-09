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
  handwrite = req.body.handwrite,
  data = req.body.data,
  png = new Buffer(data, 'base64'),
  time = Date.now();

  async([
    function (next) {
      fs.writeFile(path.join(imgDir, time + '.png'), png, next);
    },
    function (next) {
      fs.writeFile(path.join(imgDir, time + '.handwrite.json'), JSON.stringify(handwrite), next);
    },
    function (next) {
      meta[time] = ch;
      fs.writeFile(metaJson, JSON.stringify(meta), next);
    }
  ], function (err) {
      if (err) return next(err);

      res.json({
        ok: true,
      });
      next();
  });
};

function async(procs, callback) {
  return (function loop(i) {
    if (i >= procs.length) return callback(null);

    procs[i](function (err) {
      if (err) return callback(err);
      loop(i + 1);
    });
  })(0, []);
}
