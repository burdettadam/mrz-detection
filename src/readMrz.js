'use strict';

const ENVIRONMENT_IS_WEB = typeof window === 'object';
const ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';

const { join } = require('path');

const mrzOcr = require('./internal/mrzOcr');
const symbols = require('./internal/symbols'); // SYMBOLS MRZ NUMBERS
const roiOptions = require('./roiOptions');

const fingerprintOptions = {
  baseDir: join(__dirname, '../fontData'),
  height: 12,
  width: 12,
  minSimilarity: 0.5,
  fontName: 'ocrb',
  category: symbols.label,
  ambiguity: true
};

/* eslint-disable no-unused-vars */
var fontFingerprint;
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  fontFingerprint = require('../fontData/12x12/mrz/ocrb.json');
} else {
  // use a variable for the module name so that browserify does not include it
  var _module = 'ocr-tools';
  const { loadFontData } = require(_module);
  fontFingerprint = loadFontData(fingerprintOptions);
}
/* eslint-enable no-unused-vars */

async function readMrz(image, options = {}) {
  var { ocrResult, mask, rois } = await mrzOcr(image, roiOptions);

  if (options.saveName) {
    mask.save(options.saveName);
  }

  return { rois, mrz: ocrResult };
}

module.exports = readMrz;
