'use strict';
const sharp = require('sharp');
const makeThumbnail = async (file, thumbname, size) => { 
  // file = full path to image (req.file.path), thumbname = filename (req.file.filename)
  const result = await sharp(file).
      resize(size.width, size.height).
      png().
      toFile(thumbname);
  return result;
};

module.exports = {
  makeThumbnail,
};