/**
 * Extensions for calculating the contrast of elements
 */

const { namespace, extend } = require('./constants');
const ariaExtensions = require('./aria-extensions');

const { symbols } = ariaExtensions;

/**
 * Blend two alpha values
 */
function blendAlpha(s, d) {
  return s + (d * (1 - s));
}

/**
 * Blend a colour colour channel
 */
function blendChannel(sc, dc, sa, da, ba) {
  return ((sc * sa) + (dc * da * (1 - sa))) / ba;
}

/**
 * Blend an array of rgba colours together
 */
function blend(colour1, colour2) {
  const [r1, g1, b1, a1] = colour1;
  const [r2, g2, b2, a2] = colour2;

  const a = blendAlpha(a1, a2);
  return [
    blendChannel(r1, r2, a1, a2, a),
    blendChannel(g1, g2, a1, a2, a),
    blendChannel(b1, b2, a1, a2, a),
    a,
  ];
}

/**
 * Convert a gamma compressed channel to a linear value
 * See https://en.wikipedia.org/wiki/SRGB#The_reverse_transformation
 */
function gamma(value) {
  const n = value / 255;
  return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
}


/**
 * Calculate the luminosity from rgb colour values
 * See https://en.wikipedia.org/wiki/Relative_luminance
 */
function luminosity(r, g, b) {
  return (0.2126 * gamma(r)) + (0.7152 * gamma(g)) + (0.0722 * gamma(b));
}

/**
 * Calculate the contrast ratios from two luminosities
 * See https://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
 */
function contrastRatio(l1, l2) {
  if (l1 < l2) {
    [l2, l1] = [l1, l2];
  }
  return (l1 + 0.05) / (l2 + 0.05);
}

/** Convert a CSS colour to an array of RGBA values */
function toRgbaArray(style) {
  const el = document.createElement('div');
  el.style.color = style;
  document.body.appendChild(el);
  const value = window.getComputedStyle(el).color;
  if (!value) {
    throw new Error('unable to parse colour');
  }
  return colourParts(value); // eslint-disable-line no-use-before-define
}

/**
 * Given a colour in rgba or rgb format, get its parts
 * The parts should be in the range 0 to 1
 */
function colourParts(colour) {
  if (colour === 'transparent') {
    return [0, 0, 0, 0];
  }
  const match = colour.match(/^rgba?\((\d+), *(\d+), *(\d+)(?:, *(\d+(?:\.\d+)?))?\)$/);
  if (match) {
    return [+match[1], +match[2], +match[3], match[4] ? parseFloat(match[4]) : 1];
  }
  return toRgbaArray(colour);
}

/** Blend a colour with an elements background colour */
function blendWithBackground(colour, el) {
  let cursor = el;
  do {
    let background = [255, 255, 255, 1];
    let opacity = 1;
    if (cursor !== document) {
      background = colourParts(cursor[symbols.style]('backgroundColor'));
      opacity = cursor[symbols.style]('opacity');
    }
    if (background[3] !== 0) {
      colour = blend(colour, background);
    }
    if (opacity < 1) {
      colour[3] *= opacity;
    }
  } while ((cursor = cursor.parentNode));
  return [Math.round(colour[0]), Math.round(colour[1]), Math.round(colour[2]), colour[3]];
}

function textColour(el) {
  const colour = colourParts(el[symbols.style]('color'));
  return blendWithBackground(colour, el);
}

function backgroundColour(el) {
  return blendWithBackground([0, 0, 0, 0], el);
}

ariaExtensions[extend](HTMLElement.prototype, 'contrast', { get() {
  const textLuminosity = luminosity.apply(null, textColour(this));
  const backgroundLuminosity = luminosity.apply(null, backgroundColour(this));
  return contrastRatio(textLuminosity, backgroundLuminosity);
} });

/**
 * The contrast between two colours
 */
ariaExtensions.contrast = function contrast(foreground, background) {
  foreground = colourParts(foreground);
  background = colourParts(background);
  if (background[3] !== 1) {
    background = blend(background, [255, 255, 255, 1]);
  }
  if (foreground[3] !== 1) {
    foreground = blend(foreground, background);
  }
  return contrastRatio(
    luminosity.apply(null, foreground),
    luminosity.apply(null, background)
  );
};

// The following are exposed for unit testing
ariaExtensions[Symbol(`${namespace}-textColour`)] = textColour;
ariaExtensions[Symbol(`${namespace}-backgroundColour`)] = backgroundColour;
ariaExtensions[Symbol(`${namespace}-blend`)] = blend;
ariaExtensions[Symbol(`${namespace}-luminosity`)] = luminosity;
ariaExtensions[Symbol(`${namespace}-colourParts`)] = colourParts;
ariaExtensions[Symbol(`${namespace}-contrastRatio`)] = contrastRatio;
