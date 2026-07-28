(function () {
  'use strict';

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {};
      i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }

    return target;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  var _WINDOW = {};
  var _DOCUMENT = {};

  try {
    if (typeof window !== 'undefined') _WINDOW = window;
    if (typeof document !== 'undefined') _DOCUMENT = document;
  } catch (e) {}

  var _ref = _WINDOW.navigator || {},
      _ref$userAgent = _ref.userAgent,
      userAgent = _ref$userAgent === void 0 ? '' : _ref$userAgent;
  var WINDOW = _WINDOW;
  var DOCUMENT = _DOCUMENT;
  var IS_BROWSER = !!WINDOW.document;
  var IS_DOM = !!DOCUMENT.documentElement && !!DOCUMENT.head && typeof DOCUMENT.addEventListener === 'function' && typeof DOCUMENT.createElement === 'function';
  var IS_IE = ~userAgent.indexOf('MSIE') || ~userAgent.indexOf('Trident/');

  var _familyProxy, _familyProxy2, _familyProxy3, _familyProxy4, _familyProxy5;

  var NAMESPACE_IDENTIFIER = '___FONT_AWESOME___';
  var PRODUCTION = function () {
    try {
      return "production" === 'production';
    } catch (e) {
      return false;
    }
  }();
  var FAMILY_CLASSIC = 'classic';
  var FAMILY_SHARP = 'sharp';
  var FAMILIES = [FAMILY_CLASSIC, FAMILY_SHARP];

  function familyProxy(obj) {
    // Defaults to the classic family if family is not available
    return new Proxy(obj, {
      get: function get(target, prop) {
        return prop in target ? target[prop] : target[FAMILY_CLASSIC];
      }
    });
  }
  var PREFIX_TO_STYLE = familyProxy((_familyProxy = {}, _defineProperty(_familyProxy, FAMILY_CLASSIC, {
    'fa': 'solid',
    'fas': 'solid',
    'fa-solid': 'solid',
    'far': 'regular',
    'fa-regular': 'regular',
    'fal': 'light',
    'fa-light': 'light',
    'fat': 'thin',
    'fa-thin': 'thin',
    'fad': 'duotone',
    'fa-duotone': 'duotone',
    'fab': 'brands',
    'fa-brands': 'brands',
    'fak': 'kit',
    'fakd': 'kit',
    'fa-kit': 'kit',
    'fa-kit-duotone': 'kit'
  }), _defineProperty(_familyProxy, FAMILY_SHARP, {
    'fa': 'solid',
    'fass': 'solid',
    'fa-solid': 'solid',
    'fasr': 'regular',
    'fa-regular': 'regular',
    'fasl': 'light',
    'fa-light': 'light',
    'fast': 'thin',
    'fa-thin': 'thin'
  }), _familyProxy));
  var STYLE_TO_PREFIX = familyProxy((_familyProxy2 = {}, _defineProperty(_familyProxy2, FAMILY_CLASSIC, {
    solid: 'fas',
    regular: 'far',
    light: 'fal',
    thin: 'fat',
    duotone: 'fad',
    brands: 'fab',
    kit: 'fak'
  }), _defineProperty(_familyProxy2, FAMILY_SHARP, {
    solid: 'fass',
    regular: 'fasr',
    light: 'fasl',
    thin: 'fast'
  }), _familyProxy2));
  var PREFIX_TO_LONG_STYLE = familyProxy((_familyProxy3 = {}, _defineProperty(_familyProxy3, FAMILY_CLASSIC, {
    fab: 'fa-brands',
    fad: 'fa-duotone',
    fak: 'fa-kit',
    fal: 'fa-light',
    far: 'fa-regular',
    fas: 'fa-solid',
    fat: 'fa-thin'
  }), _defineProperty(_familyProxy3, FAMILY_SHARP, {
    fass: 'fa-solid',
    fasr: 'fa-regular',
    fasl: 'fa-light',
    fast: 'fa-thin'
  }), _familyProxy3));
  var LONG_STYLE_TO_PREFIX = familyProxy((_familyProxy4 = {}, _defineProperty(_familyProxy4, FAMILY_CLASSIC, {
    'fa-brands': 'fab',
    'fa-duotone': 'fad',
    'fa-kit': 'fak',
    'fa-light': 'fal',
    'fa-regular': 'far',
    'fa-solid': 'fas',
    'fa-thin': 'fat'
  }), _defineProperty(_familyProxy4, FAMILY_SHARP, {
    'fa-solid': 'fass',
    'fa-regular': 'fasr',
    'fa-light': 'fasl',
    'fa-thin': 'fast'
  }), _familyProxy4));
  var FONT_WEIGHT_TO_PREFIX = familyProxy((_familyProxy5 = {}, _defineProperty(_familyProxy5, FAMILY_CLASSIC, {
    900: 'fas',
    400: 'far',
    normal: 'far',
    300: 'fal',
    100: 'fat'
  }), _defineProperty(_familyProxy5, FAMILY_SHARP, {
    900: 'fass',
    400: 'fasr',
    300: 'fasl',
    100: 'fast'
  }), _familyProxy5));
  var oneToTen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  var oneToTwenty = oneToTen.concat([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
  var DUOTONE_CLASSES = {
    GROUP: 'duotone-group',
    SWAP_OPACITY: 'swap-opacity',
    PRIMARY: 'primary',
    SECONDARY: 'secondary'
  };
  var prefixes = new Set();
  Object.keys(STYLE_TO_PREFIX[FAMILY_CLASSIC]).map(prefixes.add.bind(prefixes));
  Object.keys(STYLE_TO_PREFIX[FAMILY_SHARP]).map(prefixes.add.bind(prefixes));
  var RESERVED_CLASSES = [].concat(FAMILIES, _toConsumableArray(prefixes), ['2xs', 'xs', 'sm', 'lg', 'xl', '2xl', 'beat', 'border', 'fade', 'beat-fade', 'bounce', 'flip-both', 'flip-horizontal', 'flip-vertical', 'flip', 'fw', 'inverse', 'layers-counter', 'layers-text', 'layers', 'li', 'pull-left', 'pull-right', 'pulse', 'rotate-180', 'rotate-270', 'rotate-90', 'rotate-by', 'shake', 'spin-pulse', 'spin-reverse', 'spin', 'stack-1x', 'stack-2x', 'stack', 'ul', DUOTONE_CLASSES.GROUP, DUOTONE_CLASSES.SWAP_OPACITY, DUOTONE_CLASSES.PRIMARY, DUOTONE_CLASSES.SECONDARY]).concat(oneToTen.map(function (n) {
    return "".concat(n, "x");
  })).concat(oneToTwenty.map(function (n) {
    return "w-".concat(n);
  }));

  function bunker(fn) {
    try {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      fn.apply(void 0, args);
    } catch (e) {
      if (!PRODUCTION) {
        throw e;
      }
    }
  }

  var w = WINDOW || {};
  if (!w[NAMESPACE_IDENTIFIER]) w[NAMESPACE_IDENTIFIER] = {};
  if (!w[NAMESPACE_IDENTIFIER].styles) w[NAMESPACE_IDENTIFIER].styles = {};
  if (!w[NAMESPACE_IDENTIFIER].hooks) w[NAMESPACE_IDENTIFIER].hooks = {};
  if (!w[NAMESPACE_IDENTIFIER].shims) w[NAMESPACE_IDENTIFIER].shims = [];
  var namespace = w[NAMESPACE_IDENTIFIER];

  function normalizeIcons(icons) {
    return Object.keys(icons).reduce(function (acc, iconName) {
      var icon = icons[iconName];
      var expanded = !!icon.icon;

      if (expanded) {
        acc[icon.iconName] = icon.icon;
      } else {
        acc[iconName] = icon;
      }

      return acc;
    }, {});
  }

  function defineIcons(prefix, icons) {
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var _params$skipHooks = params.skipHooks,
        skipHooks = _params$skipHooks === void 0 ? false : _params$skipHooks;
    var normalized = normalizeIcons(icons);

    if (typeof namespace.hooks.addPack === 'function' && !skipHooks) {
      namespace.hooks.addPack(prefix, normalizeIcons(icons));
    } else {
      namespace.styles[prefix] = _objectSpread2(_objectSpread2({}, namespace.styles[prefix] || {}), normalized);
    }
    /**
     * Font Awesome 4 used the prefix of `fa` for all icons. With the introduction
     * of new styles we needed to differentiate between them. Prefix `fa` is now an alias
     * for `fas` so we'll ease the upgrade process for our users by automatically defining
     * this as well.
     */


    if (prefix === 'fas') {
      defineIcons('fa', icons);
    }
  }

  var icons = {
    
    "menu-item": [640,512,[],"e000","M184 0C135 0 96 40 96 88l0 336 0 8c0 45 35 80 80 80l344 0c13 0 24-10 24-24c0-13-11-24-24-24l-8 0 0-69c18-9 32-28 32-51l0-288c0-30-26-56-56-56L184 0zM144 432c0-17 14-32 32-32l288 0 0 64-288 0c-18 0-32-14-32-32zm32-80c-12 0-23 3-32 7l0-271c0-22 17-40 40-40l304 0c4 0 8 4 8 8l0 288c0 5-4 8-8 8l-312 0zM448 79.6c-.7-14.5-22.8-18.5-34.8-13.7c-6.8 2.7-18.3 7.6-29.4 13.7c-10.4 5.8-23.2 14.3-29.5 24.8c-5.9 9.9-8 23.4-8.9 32.7c-.7 7.5-.7 13.8-.7 16.5l0 61.4c0 7.8 7.9 14.1 17.6 14.1l50.4 0 0 76.7c0 7.8 7.9 14.1 17.6 14.1s17.6-6.3 17.6-14.1l0-160.3c0-11 0-22 0-33s0-22 0-33zM412.8 200.8l-32.8 0 0-47.4c0-4.7 .2-9.5 .6-14.2c.9-9.2 2.7-17.9 5.5-22.5c2.1-3.4 8.2-8.4 17.9-13.8c1.3-.7 3.5-1.7 5.6-2.6c1.4-.6 2.8-1.2 3.7-1.7l-.4 47.3 0 55zM275.1 90.4c-.1-7.8-8.1-14.1-17.8-13.9s-17.5 6.5-17.3 14.3l0 62.6c.1 7.8 7.6 13 17.3 12.9s18-5.1 17.8-12.9l0-63zm-48 .2c0-7.8-7.9-14.1-17.6-14.1s-17.6 6.3-17.6 14.1l0 58c0 5.5 0 11.8 .9 17.7c.9 6.1 2.9 13 8 19.3c9 11.3 24 16.7 43.6 18.3l0 102c0 7.8 7.9 14.1 17.6 14.1s17.6-6.3 17.6-14.1l0-102.8c15.8-2.3 28-7.7 35.8-17.4c5-6.3 7-13.2 8-19.3c.9-5.9 .9-12.2 .9-17.7l0-58c0-7.8-7.9-14.1-17.6-14.1s-17.6 6.3-17.6 14.1l0 57.6c0 6 0 10.7-.6 14.7c-.6 3.9-1.6 6.1-2.7 7.4c-1.2 1.5-5.5 5.8-27.6 5.8s-26.5-4.3-27.6-5.8c-1.1-1.3-2.1-3.5-2.7-7.4c-.6-4-.6-8.7-.6-14.7l0-57.6z"],
    "recipe-costing": [640,512,[],"e002","M24 0C37 0 48 11.7 48 25.6V162.1c0 5.3 3 8.5 8 8.5h8V25.6C64 11.7 74 0 88 0c13 0 24 11.7 24 25.6V170.7h8c4 0 8-3.2 8-8.5V25.6C128 11.7 138 0 152 0c13 0 24 11.7 24 25.6V162.1c0 33.1-26 59.7-56 59.7h-8V486.4c0 14.9-11 25.6-24 25.6c-14 0-24-10.7-24-25.6V221.9H56c-31 0-56-26.7-56-59.7V25.6C0 11.7 10 0 24 0zM560 153.6V273.1h32V213.3 74.7c-17 16-32 41.6-32 78.9zm32 170.7H544c-18 0-32-14.9-32-34.1V153.6C512 46.9 596 8.5 613 1.1c2 0 4-1.1 6-1.1c11 0 21 10.7 21 22.4V213.3v59.7 51.2V486.4c0 14.9-11 25.6-24 25.6c-14 0-24-10.7-24-25.6V324.3zM336 494.9c-82 0-153-45.9-192-115.2V252.8c5-1.1 11-4.3 16-6.4c0 3.2 0 6.4 0 9.6c0 104.5 78 187.7 176 187.7c70 0 131-43.7 159-108.8c11 13.9 26 22.4 43 23.5c-36 81.1-113 136.5-202 136.5zM208 60.8c36-27.7 80-43.7 128-43.7c60 0 115 25.6 155 67.2c-7 18.1-11 39.5-11 64c-32-48-85-80-144-80c-51 0-96 23.5-128 59.7V60.8zM336.7 128c9.4 0 17.7 7.5 17.7 16v18c.6 0 1.7 .5 2.2 .5s.6 0 .6 0l26.5 4.5c9.9 1.5 16 10 14.4 18.5s-11.1 14.5-20.4 13L351.1 194c-17.1-2.5-32.6-.5-43.1 3c-10.5 4-14.9 9.5-16 14c-1.1 5.5 0 8.5 .6 10.5c1.1 2 3.3 4 7.2 6.5c8.8 5.5 22.7 9 40.9 13l1.7 .5c15.5 4 34.8 8.5 49.2 17c7.7 4.5 15.5 11 19.9 19.5c5 9 5.5 19 3.9 30c-3.9 19-18.8 31.5-36.5 38c-7.7 3-16 4.5-24.3 5.5V368c0 9-8.3 16-17.7 16c-9.9 0-17.7-7-17.7-16V351c-.6-.5-.6-.5-1.1-.5c-13.3-1.5-35.4-7-50.3-13c-9.4-3.5-13.3-13-9.4-21c4.4-8 14.4-12 23.8-8c11.1 4.5 30.4 9 41.4 10.5c17.7 2.5 32.1 1 42-2.5c9.4-3.5 13.3-8.5 14.9-14.5c.6-5.5 0-8.5-1.1-10c-1.1-2-2.8-4.5-7.2-7c-8.8-5-22.7-8.5-40.9-13l-1.7-.5c-15.5-3.5-34.8-8.5-49.2-17c-7.7-4.5-15.5-11-19.9-19.5c-4.4-9-5.5-19-3.3-29.5c3.9-19.5 19.9-31.5 37.6-38c7.7-3 15.5-4.5 24.3-5.5V144c0-8.5 7.7-16 17.7-16z"]

  };
  var prefixes$1 = [null    ,'fak',
    ,'fa-kit'

  ];
  bunker(function () {
    var _iterator = _createForOfIteratorHelper(prefixes$1),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var prefix = _step.value;
        if (!prefix) continue;
        defineIcons(prefix, icons);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  });

}());
