/****PLEASE DON'T MAKE CHANGES IN THIS FILE IT'S AFFECT THE CODE IF YOU NEED ANY HELP PLEASE CONTACT TO FLITS TEAM support@getflits.com ****/
(function (global, factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = global.document
      ? factory(global, true)
      : function (w) {
          if (!w.document) {
            throw new Error("Flits requires a window with a document");
          }
          return factory(w);
        };
  } else {
    factory(global);
  }
})(typeof window !== "undefined" ? window : this, function (window, noGlobal) {
  var arr = [];
  var document = window.document;
  var slice = arr.slice;
  var concat = arr.concat;
  var push = arr.push;
  var indexOf = arr.indexOf;
  var class2type = {};
  var toString = class2type.toString;
  var hasOwn = class2type.hasOwnProperty;
  var support = {};
  var version = "2.2.5-pre b14ce54334a568eaaa107be4c441660a57c3db24",
    Flits = function (selector, context) {
      return new Flits.fn.init(selector, context);
    },
    rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
    rmsPrefix = /^-ms-/,
    rdashAlpha = /-([\da-z])/gi,
    fcamelCase = function (all, letter) {
      return letter.toUpperCase();
    };
  Flits.module =
    Flits.fn =
    Flits.prototype =
      {
        Flits: version,
        constructor: Flits,
        selector: "",
        length: 0,
        toArray: function () {
          return slice.call(this);
        },
        get: function (num) {
          return num != null
            ? num < 0
              ? this[num + this.length]
              : this[num]
            : slice.call(this);
        },
        pushStack: function (elems) {
          var ret = Flits.merge(this.constructor(), elems);
          ret.prevObject = this;
          ret.context = this.context;
          return ret;
        },
        each: function (callback) {
          return Flits.each(this, callback);
        },
        map: function (callback) {
          return this.pushStack(
            Flits.map(this, function (elem, i) {
              return callback.call(elem, i, elem);
            })
          );
        },
        slice: function () {
          return this.pushStack(slice.apply(this, arguments));
        },
        first: function () {
          return this.eq(0);
        },
        last: function () {
          return this.eq(-1);
        },
        eq: function (i) {
          var len = this.length,
            j = +i + (i < 0 ? len : 0);
          return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
        },
        end: function () {
          return this.prevObject || this.constructor();
        },
        push: push,
        sort: arr.sort,
        splice: arr.splice,
      };
  Flits.extend = Flits.fn.extend = function () {
    var options,
      name,
      src,
      copy,
      copyIsArray,
      clone,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false;
    if (typeof target === "boolean") {
      deep = target;
      target = arguments[i] || {};
      i++;
    }
    if (typeof target !== "object" && !Flits.isFunction(target)) {
      target = {};
    }
    if (i === length) {
      target = this;
      i--;
    }
    for (; i < length; i++) {
      if ((options = arguments[i]) != null) {
        for (name in options) {
          src = target[name];
          copy = options[name];
          if (target === copy) {
            continue;
          }
          if (
            deep &&
            copy &&
            (Flits.isPlainObject(copy) || (copyIsArray = Flits.isArray(copy)))
          ) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && Flits.isArray(src) ? src : [];
            } else {
              clone = src && Flits.isPlainObject(src) ? src : {};
            }
            target[name] = Flits.extend(deep, clone, copy);
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }
    return target;
  };
  Flits.extend({
    expando: "Flits" + (version + Math.random()).replace(/\D/g, ""),
    isReady: true,
    error: function (msg) {
      throw new Error(msg);
    },
    noop: function () {},
    isFunction: function (obj) {
      return Flits.type(obj) === "function";
    },
    isArray: Array.isArray,
    isWindow: function (obj) {
      return obj != null && obj === obj.window;
    },
    isNumeric: function (obj) {
      var realStringObj = obj && obj.toString();
      return (
        !Flits.isArray(obj) &&
        realStringObj - parseFloat(realStringObj) + 1 >= 0
      );
    },
    isPlainObject: function (obj) {
      var key;
      if (Flits.type(obj) !== "object" || obj.nodeType || Flits.isWindow(obj)) {
        return false;
      }
      if (
        obj.constructor &&
        !hasOwn.call(obj, "constructor") &&
        !hasOwn.call(obj.constructor.prototype || {}, "isPrototypeOf")
      ) {
        return false;
      }
      for (key in obj) {
      }
      return key === undefined || hasOwn.call(obj, key);
    },
    isEmptyObject: function (obj) {
      var name;
      for (name in obj) {
        return false;
      }
      return true;
    },
    type: function (obj) {
      if (obj == null) {
        return obj + "";
      }
      return typeof obj === "object" || typeof obj === "function"
        ? class2type[toString.call(obj)] || "object"
        : typeof obj;
    },
    globalEval: function (code) {
      var script,
        indirect = eval;
      code = Flits.trim(code);
      if (code) {
        if (code.indexOf("use strict") === 1) {
          script = document.createElement("script");
          script.text = code;
          document.head.appendChild(script).parentNode.removeChild(script);
        } else {
          indirect(code);
        }
      }
    },
    camelCase: function (string) {
      return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
    },
    nodeName: function (elem, name) {
      return (
        elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase()
      );
    },
    each: function (obj, callback) {
      var length,
        i = 0;
      if (isArrayLike(obj)) {
        length = obj.length;
        for (; i < length; i++) {
          if (callback.call(obj[i], i, obj[i]) === false) {
            break;
          }
        }
      } else {
        for (i in obj) {
          if (callback.call(obj[i], i, obj[i]) === false) {
            break;
          }
        }
      }
      return obj;
    },
    trim: function (text) {
      return text == null ? "" : (text + "").replace(rtrim, "");
    },
    makeArray: function (arr, results) {
      var ret = results || [];
      if (arr != null) {
        if (isArrayLike(Object(arr))) {
          Flits.merge(ret, typeof arr === "string" ? [arr] : arr);
        } else {
          push.call(ret, arr);
        }
      }
      return ret;
    },
    inArray: function (elem, arr, i) {
      return arr == null ? -1 : indexOf.call(arr, elem, i);
    },
    merge: function (first, second) {
      var len = +second.length,
        j = 0,
        i = first.length;
      for (; j < len; j++) {
        first[i++] = second[j];
      }
      first.length = i;
      return first;
    },
    grep: function (elems, callback, invert) {
      var callbackInverse,
        matches = [],
        i = 0,
        length = elems.length,
        callbackExpect = !invert;
      for (; i < length; i++) {
        callbackInverse = !callback(elems[i], i);
        if (callbackInverse !== callbackExpect) {
          matches.push(elems[i]);
        }
      }
      return matches;
    },
    map: function (elems, callback, arg) {
      var length,
        value,
        i = 0,
        ret = [];
      if (isArrayLike(elems)) {
        length = elems.length;
        for (; i < length; i++) {
          value = callback(elems[i], i, arg);
          if (value != null) {
            ret.push(value);
          }
        }
      } else {
        for (i in elems) {
          value = callback(elems[i], i, arg);
          if (value != null) {
            ret.push(value);
          }
        }
      }
      return concat.apply([], ret);
    },
    guid: 1,
    proxy: function (fn, context) {
      var tmp, args, proxy;
      if (typeof context === "string") {
        tmp = fn[context];
        context = fn;
        fn = tmp;
      }
      if (!Flits.isFunction(fn)) {
        return undefined;
      }
      args = slice.call(arguments, 2);
      proxy = function () {
        return fn.apply(context || this, args.concat(slice.call(arguments)));
      };
      proxy.guid = fn.guid = fn.guid || Flits.guid++;
      return proxy;
    },
    now: Date.now,
    support: support,
  });
  if (typeof Symbol === "function") {
    Flits.fn[Symbol.iterator] = arr[Symbol.iterator];
  }
  Flits.each(
    "Boolean Number String Function Array Date RegExp Object Error Symbol".split(
      " "
    ),
    function (i, name) {
      class2type["[object " + name + "]"] = name.toLowerCase();
    }
  );
  function isArrayLike(obj) {
    var length = !!obj && "length" in obj && obj.length,
      type = Flits.type(obj);
    if (type === "function" || Flits.isWindow(obj)) {
      return false;
    }
    return (
      type === "array" ||
      length === 0 ||
      (typeof length === "number" && length > 0 && length - 1 in obj)
    );
  }
  var Sizzle = (function (window) {
    var i,
      support,
      Expr,
      getText,
      isXML,
      tokenize,
      compile,
      select,
      outermostContext,
      sortInput,
      hasDuplicate,
      setDocument,
      document,
      docElem,
      documentIsHTML,
      rbuggyQSA,
      rbuggyMatches,
      matches,
      contains,
      expando = "sizzle" + 1 * new Date(),
      preferredDoc = window.document,
      dirruns = 0,
      done = 0,
      classCache = createCache(),
      tokenCache = createCache(),
      compilerCache = createCache(),
      sortOrder = function (a, b) {
        if (a === b) {
          hasDuplicate = true;
        }
        return 0;
      },
      MAX_NEGATIVE = 1 << 31,
      hasOwn = {}.hasOwnProperty,
      arr = [],
      pop = arr.pop,
      push_native = arr.push,
      push = arr.push,
      slice = arr.slice,
      indexOf = function (list, elem) {
        var i = 0,
          len = list.length;
        for (; i < len; i++) {
          if (list[i] === elem) {
            return i;
          }
        }
        return -1;
      },
      booleans =
        "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
      whitespace = "[\\x20\\t\\r\\n\\f]",
      identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
      attributes =
        "\\[" +
        whitespace +
        "*(" +
        identifier +
        ")(?:" +
        whitespace +
        "*([*^$|!~]?=)" +
        whitespace +
        "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" +
        identifier +
        "))|)" +
        whitespace +
        "*\\]",
      pseudos =
        ":(" +
        identifier +
        ")(?:\\((" +
        "('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
        "((?:\\\\.|[^\\\\()[\\]]|" +
        attributes +
        ")*)|" +
        ".*" +
        ")\\)|)",
      rwhitespace = new RegExp(whitespace + "+", "g"),
      rtrim = new RegExp(
        "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$",
        "g"
      ),
      rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
      rcombinators = new RegExp(
        "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"
      ),
      rattributeQuotes = new RegExp(
        "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]",
        "g"
      ),
      rpseudo = new RegExp(pseudos),
      ridentifier = new RegExp("^" + identifier + "$"),
      matchExpr = {
        ID: new RegExp("^#(" + identifier + ")"),
        CLASS: new RegExp("^\\.(" + identifier + ")"),
        TAG: new RegExp("^(" + identifier + "|[*])"),
        ATTR: new RegExp("^" + attributes),
        PSEUDO: new RegExp("^" + pseudos),
        CHILD: new RegExp(
          "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
            whitespace +
            "*(even|odd|(([+-]|)(\\d*)n|)" +
            whitespace +
            "*(?:([+-]|)" +
            whitespace +
            "*(\\d+)|))" +
            whitespace +
            "*\\)|)",
          "i"
        ),
        bool: new RegExp("^(?:" + booleans + ")$", "i"),
        needsContext: new RegExp(
          "^" +
            whitespace +
            "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
            whitespace +
            "*((?:-\\d)?\\d*)" +
            whitespace +
            "*\\)|)(?=[^-]|$)",
          "i"
        ),
      },
      rinputs = /^(?:input|select|textarea|button)$/i,
      rheader = /^h\d$/i,
      rnative = /^[^{]+\{\s*\[native \w/,
      rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
      rsibling = /[+~]/,
      rescape = /'|\\/g,
      runescape = new RegExp(
        "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)",
        "ig"
      ),
      funescape = function (_, escaped, escapedWhitespace) {
        var high = "0x" + escaped - 0x10000;
        return high !== high || escapedWhitespace
          ? escaped
          : high < 0
          ? String.fromCharCode(high + 0x10000)
          : String.fromCharCode((high >> 10) | 0xd800, (high & 0x3ff) | 0xdc00);
      },
      unloadHandler = function () {
        setDocument();
      };
    try {
      push.apply(
        (arr = slice.call(preferredDoc.childNodes)),
        preferredDoc.childNodes
      );
      arr[preferredDoc.childNodes.length].nodeType;
    } catch (e) {
      push = {
        apply: arr.length
          ? function (target, els) {
              push_native.apply(target, slice.call(els));
            }
          : function (target, els) {
              var j = target.length,
                i = 0;
              while ((target[j++] = els[i++])) {}
              target.length = j - 1;
            },
      };
    }
    function Sizzle(selector, context, results, seed) {
      var m,
        i,
        elem,
        nid,
        nidselect,
        match,
        groups,
        newSelector,
        newContext = context && context.ownerDocument,
        nodeType = context ? context.nodeType : 9;
      results = results || [];
      if (
        typeof selector !== "string" ||
        !selector ||
        (nodeType !== 1 && nodeType !== 9 && nodeType !== 11)
      ) {
        return results;
      }
      if (!seed) {
        if (
          (context ? context.ownerDocument || context : preferredDoc) !==
          document
        ) {
          setDocument(context);
        }
        context = context || document;
        if (documentIsHTML) {
          if (nodeType !== 11 && (match = rquickExpr.exec(selector))) {
            if ((m = match[1])) {
              if (nodeType === 9) {
                if ((elem = context.getElementById(m))) {
                  if (elem.id === m) {
                    results.push(elem);
                    return results;
                  }
                } else {
                  return results;
                }
              } else {
                if (
                  newContext &&
                  (elem = newContext.getElementById(m)) &&
                  contains(context, elem) &&
                  elem.id === m
                ) {
                  results.push(elem);
                  return results;
                }
              }
            } else if (match[2]) {
              push.apply(results, context.getElementsByTagName(selector));
              return results;
            } else if (
              (m = match[3]) &&
              support.getElementsByClassName &&
              context.getElementsByClassName
            ) {
              push.apply(results, context.getElementsByClassName(m));
              return results;
            }
          }
          if (
            support.qsa &&
            !compilerCache[selector + " "] &&
            (!rbuggyQSA || !rbuggyQSA.test(selector))
          ) {
            if (nodeType !== 1) {
              newContext = context;
              newSelector = selector;
            } else if (context.nodeName.toLowerCase() !== "object") {
              if ((nid = context.getAttribute("id"))) {
                nid = nid.replace(rescape, "\\$&");
              } else {
                context.setAttribute("id", (nid = expando));
              }
              groups = tokenize(selector);
              i = groups.length;
              nidselect = ridentifier.test(nid)
                ? "#" + nid
                : "[id='" + nid + "']";
              while (i--) {
                groups[i] = nidselect + " " + toSelector(groups[i]);
              }
              newSelector = groups.join(",");
              newContext =
                (rsibling.test(selector) && testContext(context.parentNode)) ||
                context;
            }
            if (newSelector) {
              try {
                push.apply(results, newContext.querySelectorAll(newSelector));
                return results;
              } catch (qsaError) {
              } finally {
                if (nid === expando) {
                  context.removeAttribute("id");
                }
              }
            }
          }
        }
      }
      return select(selector.replace(rtrim, "$1"), context, results, seed);
    }
    function createCache() {
      var keys = [];
      function cache(key, value) {
        if (keys.push(key + " ") > Expr.cacheLength) {
          delete cache[keys.shift()];
        }
        return (cache[key + " "] = value);
      }
      return cache;
    }
    function markFunction(fn) {
      fn[expando] = true;
      return fn;
    }
    function assert(fn) {
      var div = document.createElement("div");
      try {
        return !!fn(div);
      } catch (e) {
        return false;
      } finally {
        if (div.parentNode) {
          div.parentNode.removeChild(div);
        }
        div = null;
      }
    }
    function addHandle(attrs, handler) {
      var arr = attrs.split("|"),
        i = arr.length;
      while (i--) {
        Expr.attrHandle[arr[i]] = handler;
      }
    }
    function siblingCheck(a, b) {
      var cur = b && a,
        diff =
          cur &&
          a.nodeType === 1 &&
          b.nodeType === 1 &&
          (~b.sourceIndex || MAX_NEGATIVE) - (~a.sourceIndex || MAX_NEGATIVE);
      if (diff) {
        return diff;
      }
      if (cur) {
        while ((cur = cur.nextSibling)) {
          if (cur === b) {
            return -1;
          }
        }
      }
      return a ? 1 : -1;
    }
    function createInputPseudo(type) {
      return function (elem) {
        var name = elem.nodeName.toLowerCase();
        return name === "input" && elem.type === type;
      };
    }
    function createButtonPseudo(type) {
      return function (elem) {
        var name = elem.nodeName.toLowerCase();
        return (name === "input" || name === "button") && elem.type === type;
      };
    }
    function createPositionalPseudo(fn) {
      return markFunction(function (argument) {
        argument = +argument;
        return markFunction(function (seed, matches) {
          var j,
            matchIndexes = fn([], seed.length, argument),
            i = matchIndexes.length;
          while (i--) {
            if (seed[(j = matchIndexes[i])]) {
              seed[j] = !(matches[j] = seed[j]);
            }
          }
        });
      });
    }
    function testContext(context) {
      return (
        context &&
        typeof context.getElementsByTagName !== "undefined" &&
        context
      );
    }
    support = Sizzle.support = {};
    isXML = Sizzle.isXML = function (elem) {
      var documentElement =
        elem && (elem.ownerDocument || elem).documentElement;
      return documentElement ? documentElement.nodeName !== "HTML" : false;
    };
    setDocument = Sizzle.setDocument = function (node) {
      var hasCompare,
        parent,
        doc = node ? node.ownerDocument || node : preferredDoc;
      if (doc === document || doc.nodeType !== 9 || !doc.documentElement) {
        return document;
      }
      document = doc;
      docElem = document.documentElement;
      documentIsHTML = !isXML(document);
      if ((parent = document.defaultView) && parent.top !== parent) {
        if (parent.addEventListener) {
          parent.addEventListener("unload", unloadHandler, false);
        } else if (parent.attachEvent) {
          parent.attachEvent("onunload", unloadHandler);
        }
      }
      support.attributes = assert(function (div) {
        div.className = "i";
        return !div.getAttribute("className");
      });
      support.getElementsByTagName = assert(function (div) {
        div.appendChild(document.createComment(""));
        return !div.getElementsByTagName("*").length;
      });
      support.getElementsByClassName = rnative.test(
        document.getElementsByClassName
      );
      support.getById = assert(function (div) {
        docElem.appendChild(div).id = expando;
        return (
          !document.getElementsByName ||
          !document.getElementsByName(expando).length
        );
      });
      if (support.getById) {
        Expr.find["ID"] = function (id, context) {
          if (typeof context.getElementById !== "undefined" && documentIsHTML) {
            var m = context.getElementById(id);
            return m ? [m] : [];
          }
        };
        Expr.filter["ID"] = function (id) {
          var attrId = id.replace(runescape, funescape);
          return function (elem) {
            return elem.getAttribute("id") === attrId;
          };
        };
      } else {
        delete Expr.find["ID"];
        Expr.filter["ID"] = function (id) {
          var attrId = id.replace(runescape, funescape);
          return function (elem) {
            var node =
              typeof elem.getAttributeNode !== "undefined" &&
              elem.getAttributeNode("id");
            return node && node.value === attrId;
          };
        };
      }
      Expr.find["TAG"] = support.getElementsByTagName
        ? function (tag, context) {
            if (typeof context.getElementsByTagName !== "undefined") {
              return context.getElementsByTagName(tag);
            } else if (support.qsa) {
              return context.querySelectorAll(tag);
            }
          }
        : function (tag, context) {
            var elem,
              tmp = [],
              i = 0,
              results = context.getElementsByTagName(tag);
            if (tag === "*") {
              while ((elem = results[i++])) {
                if (elem.nodeType === 1) {
                  tmp.push(elem);
                }
              }
              return tmp;
            }
            return results;
          };
      Expr.find["CLASS"] =
        support.getElementsByClassName &&
        function (className, context) {
          if (
            typeof context.getElementsByClassName !== "undefined" &&
            documentIsHTML
          ) {
            return context.getElementsByClassName(className);
          }
        };
      rbuggyMatches = [];
      rbuggyQSA = [];
      if ((support.qsa = rnative.test(document.querySelectorAll))) {
        assert(function (div) {
          docElem.appendChild(div).innerHTML =
            "<a id='" +
            expando +
            "'></a>" +
            "<select id='" +
            expando +
            "-\r\\' msallowcapture=''>" +
            "<option selected=''></option></select>";
          if (div.querySelectorAll("[msallowcapture^='']").length) {
            rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")");
          }
          if (!div.querySelectorAll("[selected]").length) {
            rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
          }
          if (!div.querySelectorAll("[id~=" + expando + "-]").length) {
            rbuggyQSA.push("~=");
          }
          if (!div.querySelectorAll(":checked").length) {
            rbuggyQSA.push(":checked");
          }
          if (!div.querySelectorAll("a#" + expando + "+*").length) {
            rbuggyQSA.push(".#.+[+~]");
          }
        });
        assert(function (div) {
          var input = document.createElement("input");
          input.setAttribute("type", "hidden");
          div.appendChild(input).setAttribute("name", "D");
          if (div.querySelectorAll("[name=d]").length) {
            rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?=");
          }
          if (!div.querySelectorAll(":enabled").length) {
            rbuggyQSA.push(":enabled", ":disabled");
          }
          div.querySelectorAll("*,:x");
          rbuggyQSA.push(",.*:");
        });
      }
      if (
        (support.matchesSelector = rnative.test(
          (matches =
            docElem.matches ||
            docElem.webkitMatchesSelector ||
            docElem.mozMatchesSelector ||
            docElem.oMatchesSelector ||
            docElem.msMatchesSelector)
        ))
      ) {
        assert(function (div) {
          support.disconnectedMatch = matches.call(div, "div");
          matches.call(div, "[s!='']:x");
          rbuggyMatches.push("!=", pseudos);
        });
      }
      rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
      rbuggyMatches =
        rbuggyMatches.length && new RegExp(rbuggyMatches.join("|"));
      hasCompare = rnative.test(docElem.compareDocumentPosition);
      contains =
        hasCompare || rnative.test(docElem.contains)
          ? function (a, b) {
              var adown = a.nodeType === 9 ? a.documentElement : a,
                bup = b && b.parentNode;
              return (
                a === bup ||
                !!(
                  bup &&
                  bup.nodeType === 1 &&
                  (adown.contains
                    ? adown.contains(bup)
                    : a.compareDocumentPosition &&
                      a.compareDocumentPosition(bup) & 16)
                )
              );
            }
          : function (a, b) {
              if (b) {
                while ((b = b.parentNode)) {
                  if (b === a) {
                    return true;
                  }
                }
              }
              return false;
            };
      sortOrder = hasCompare
        ? function (a, b) {
            if (a === b) {
              hasDuplicate = true;
              return 0;
            }
            var compare =
              !a.compareDocumentPosition - !b.compareDocumentPosition;
            if (compare) {
              return compare;
            }
            compare =
              (a.ownerDocument || a) === (b.ownerDocument || b)
                ? a.compareDocumentPosition(b)
                : 1;
            if (
              compare & 1 ||
              (!support.sortDetached &&
                b.compareDocumentPosition(a) === compare)
            ) {
              if (
                a === document ||
                (a.ownerDocument === preferredDoc && contains(preferredDoc, a))
              ) {
                return -1;
              }
              if (
                b === document ||
                (b.ownerDocument === preferredDoc && contains(preferredDoc, b))
              ) {
                return 1;
              }
              return sortInput
                ? indexOf(sortInput, a) - indexOf(sortInput, b)
                : 0;
            }
            return compare & 4 ? -1 : 1;
          }
        : function (a, b) {
            if (a === b) {
              hasDuplicate = true;
              return 0;
            }
            var cur,
              i = 0,
              aup = a.parentNode,
              bup = b.parentNode,
              ap = [a],
              bp = [b];
            if (!aup || !bup) {
              return a === document
                ? -1
                : b === document
                ? 1
                : aup
                ? -1
                : bup
                ? 1
                : sortInput
                ? indexOf(sortInput, a) - indexOf(sortInput, b)
                : 0;
            } else if (aup === bup) {
              return siblingCheck(a, b);
            }
            cur = a;
            while ((cur = cur.parentNode)) {
              ap.unshift(cur);
            }
            cur = b;
            while ((cur = cur.parentNode)) {
              bp.unshift(cur);
            }
            while (ap[i] === bp[i]) {
              i++;
            }
            return i
              ? siblingCheck(ap[i], bp[i])
              : ap[i] === preferredDoc
              ? -1
              : bp[i] === preferredDoc
              ? 1
              : 0;
          };
      return document;
    };
    Sizzle.matches = function (expr, elements) {
      return Sizzle(expr, null, null, elements);
    };
    Sizzle.matchesSelector = function (elem, expr) {
      if ((elem.ownerDocument || elem) !== document) {
        setDocument(elem);
      }
      expr = expr.replace(rattributeQuotes, "='$1']");
      if (
        support.matchesSelector &&
        documentIsHTML &&
        !compilerCache[expr + " "] &&
        (!rbuggyMatches || !rbuggyMatches.test(expr)) &&
        (!rbuggyQSA || !rbuggyQSA.test(expr))
      ) {
        try {
          var ret = matches.call(elem, expr);
          if (
            ret ||
            support.disconnectedMatch ||
            (elem.document && elem.document.nodeType !== 11)
          ) {
            return ret;
          }
        } catch (e) {}
      }
      return Sizzle(expr, document, null, [elem]).length > 0;
    };
    Sizzle.contains = function (context, elem) {
      if ((context.ownerDocument || context) !== document) {
        setDocument(context);
      }
      return contains(context, elem);
    };
    Sizzle.attr = function (elem, name) {
      if ((elem.ownerDocument || elem) !== document) {
        setDocument(elem);
      }
      var fn = Expr.attrHandle[name.toLowerCase()],
        val =
          fn && hasOwn.call(Expr.attrHandle, name.toLowerCase())
            ? fn(elem, name, !documentIsHTML)
            : undefined;
      return val !== undefined
        ? val
        : support.attributes || !documentIsHTML
        ? elem.getAttribute(name)
        : (val = elem.getAttributeNode(name)) && val.specified
        ? val.value
        : null;
    };
    Sizzle.error = function (msg) {
      throw new Error("Syntax error, unrecognized expression: " + msg);
    };
    Sizzle.uniqueSort = function (results) {
      var elem,
        duplicates = [],
        j = 0,
        i = 0;
      hasDuplicate = !support.detectDuplicates;
      sortInput = !support.sortStable && results.slice(0);
      results.sort(sortOrder);
      if (hasDuplicate) {
        while ((elem = results[i++])) {
          if (elem === results[i]) {
            j = duplicates.push(i);
          }
        }
        while (j--) {
          results.splice(duplicates[j], 1);
        }
      }
      sortInput = null;
      return results;
    };
    getText = Sizzle.getText = function (elem) {
      var node,
        ret = "",
        i = 0,
        nodeType = elem.nodeType;
      if (!nodeType) {
        while ((node = elem[i++])) {
          ret += getText(node);
        }
      } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
        if (typeof elem.textContent === "string") {
          return elem.textContent;
        } else {
          for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
            ret += getText(elem);
          }
        }
      } else if (nodeType === 3 || nodeType === 4) {
        return elem.nodeValue;
      }
      return ret;
    };
    Expr = Sizzle.selectors = {
      cacheLength: 50,
      createPseudo: markFunction,
      match: matchExpr,
      attrHandle: {},
      find: {},
      relative: {
        ">": { dir: "parentNode", first: true },
        " ": { dir: "parentNode" },
        "+": { dir: "previousSibling", first: true },
        "~": { dir: "previousSibling" },
      },
      preFilter: {
        ATTR: function (match) {
          match[1] = match[1].replace(runescape, funescape);
          match[3] = (match[3] || match[4] || match[5] || "").replace(
            runescape,
            funescape
          );
          if (match[2] === "~=") {
            match[3] = " " + match[3] + " ";
          }
          return match.slice(0, 4);
        },
        CHILD: function (match) {
          match[1] = match[1].toLowerCase();
          if (match[1].slice(0, 3) === "nth") {
            if (!match[3]) {
              Sizzle.error(match[0]);
            }
            match[4] = +(match[4]
              ? match[5] + (match[6] || 1)
              : 2 * (match[3] === "even" || match[3] === "odd"));
            match[5] = +(match[7] + match[8] || match[3] === "odd");
          } else if (match[3]) {
            Sizzle.error(match[0]);
          }
          return match;
        },
        PSEUDO: function (match) {
          var excess,
            unquoted = !match[6] && match[2];
          if (matchExpr["CHILD"].test(match[0])) {
            return null;
          }
          if (match[3]) {
            match[2] = match[4] || match[5] || "";
          } else if (
            unquoted &&
            rpseudo.test(unquoted) &&
            (excess = tokenize(unquoted, true)) &&
            (excess =
              unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)
          ) {
            match[0] = match[0].slice(0, excess);
            match[2] = unquoted.slice(0, excess);
          }
          return match.slice(0, 3);
        },
      },
      filter: {
        TAG: function (nodeNameSelector) {
          var nodeName = nodeNameSelector
            .replace(runescape, funescape)
            .toLowerCase();
          return nodeNameSelector === "*"
            ? function () {
                return true;
              }
            : function (elem) {
                return (
                  elem.nodeName && elem.nodeName.toLowerCase() === nodeName
                );
              };
        },
        CLASS: function (className) {
          var pattern = classCache[className + " "];
          return (
            pattern ||
            ((pattern = new RegExp(
              "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)"
            )) &&
              classCache(className, function (elem) {
                return pattern.test(
                  (typeof elem.className === "string" && elem.className) ||
                    (typeof elem.getAttribute !== "undefined" &&
                      elem.getAttribute("class")) ||
                    ""
                );
              }))
          );
        },
        ATTR: function (name, operator, check) {
          return function (elem) {
            var result = Sizzle.attr(elem, name);
            if (result == null) {
              return operator === "!=";
            }
            if (!operator) {
              return true;
            }
            result += "";
            return operator === "="
              ? result === check
              : operator === "!="
              ? result !== check
              : operator === "^="
              ? check && result.indexOf(check) === 0
              : operator === "*="
              ? check && result.indexOf(check) > -1
              : operator === "$="
              ? check && result.slice(-check.length) === check
              : operator === "~="
              ? (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) >
                -1
              : operator === "|="
              ? result === check ||
                result.slice(0, check.length + 1) === check + "-"
              : false;
          };
        },
        CHILD: function (type, what, argument, first, last) {
          var simple = type.slice(0, 3) !== "nth",
            forward = type.slice(-4) !== "last",
            ofType = what === "of-type";
          return first === 1 && last === 0
            ? function (elem) {
                return !!elem.parentNode;
              }
            : function (elem, context, xml) {
                var cache,
                  uniqueCache,
                  outerCache,
                  node,
                  nodeIndex,
                  start,
                  dir = simple !== forward ? "nextSibling" : "previousSibling",
                  parent = elem.parentNode,
                  name = ofType && elem.nodeName.toLowerCase(),
                  useCache = !xml && !ofType,
                  diff = false;
                if (parent) {
                  if (simple) {
                    while (dir) {
                      node = elem;
                      while ((node = node[dir])) {
                        if (
                          ofType
                            ? node.nodeName.toLowerCase() === name
                            : node.nodeType === 1
                        ) {
                          return false;
                        }
                      }
                      start = dir = type === "only" && !start && "nextSibling";
                    }
                    return true;
                  }
                  start = [forward ? parent.firstChild : parent.lastChild];
                  if (forward && useCache) {
                    node = parent;
                    outerCache = node[expando] || (node[expando] = {});
                    uniqueCache =
                      outerCache[node.uniqueID] ||
                      (outerCache[node.uniqueID] = {});
                    cache = uniqueCache[type] || [];
                    nodeIndex = cache[0] === dirruns && cache[1];
                    diff = nodeIndex && cache[2];
                    node = nodeIndex && parent.childNodes[nodeIndex];
                    while (
                      (node =
                        (++nodeIndex && node && node[dir]) ||
                        (diff = nodeIndex = 0) ||
                        start.pop())
                    ) {
                      if (node.nodeType === 1 && ++diff && node === elem) {
                        uniqueCache[type] = [dirruns, nodeIndex, diff];
                        break;
                      }
                    }
                  } else {
                    if (useCache) {
                      node = elem;
                      outerCache = node[expando] || (node[expando] = {});
                      uniqueCache =
                        outerCache[node.uniqueID] ||
                        (outerCache[node.uniqueID] = {});
                      cache = uniqueCache[type] || [];
                      nodeIndex = cache[0] === dirruns && cache[1];
                      diff = nodeIndex;
                    }
                    if (diff === false) {
                      while (
                        (node =
                          (++nodeIndex && node && node[dir]) ||
                          (diff = nodeIndex = 0) ||
                          start.pop())
                      ) {
                        if (
                          (ofType
                            ? node.nodeName.toLowerCase() === name
                            : node.nodeType === 1) &&
                          ++diff
                        ) {
                          if (useCache) {
                            outerCache = node[expando] || (node[expando] = {});
                            uniqueCache =
                              outerCache[node.uniqueID] ||
                              (outerCache[node.uniqueID] = {});
                            uniqueCache[type] = [dirruns, diff];
                          }
                          if (node === elem) {
                            break;
                          }
                        }
                      }
                    }
                  }
                  diff -= last;
                  return (
                    diff === first || (diff % first === 0 && diff / first >= 0)
                  );
                }
              };
        },
        PSEUDO: function (pseudo, argument) {
          var args,
            fn =
              Expr.pseudos[pseudo] ||
              Expr.setFilters[pseudo.toLowerCase()] ||
              Sizzle.error("unsupported pseudo: " + pseudo);
          if (fn[expando]) {
            return fn(argument);
          }
          if (fn.length > 1) {
            args = [pseudo, pseudo, "", argument];
            return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase())
              ? markFunction(function (seed, matches) {
                  var idx,
                    matched = fn(seed, argument),
                    i = matched.length;
                  while (i--) {
                    idx = indexOf(seed, matched[i]);
                    seed[idx] = !(matches[idx] = matched[i]);
                  }
                })
              : function (elem) {
                  return fn(elem, 0, args);
                };
          }
          return fn;
        },
      },
      pseudos: {
        not: markFunction(function (selector) {
          var input = [],
            results = [],
            matcher = compile(selector.replace(rtrim, "$1"));
          return matcher[expando]
            ? markFunction(function (seed, matches, context, xml) {
                var elem,
                  unmatched = matcher(seed, null, xml, []),
                  i = seed.length;
                while (i--) {
                  if ((elem = unmatched[i])) {
                    seed[i] = !(matches[i] = elem);
                  }
                }
              })
            : function (elem, context, xml) {
                input[0] = elem;
                matcher(input, null, xml, results);
                input[0] = null;
                return !results.pop();
              };
        }),
        has: markFunction(function (selector) {
          return function (elem) {
            return Sizzle(selector, elem).length > 0;
          };
        }),
        contains: markFunction(function (text) {
          text = text.replace(runescape, funescape);
          return function (elem) {
            return (
              (elem.textContent || elem.innerText || getText(elem)).indexOf(
                text
              ) > -1
            );
          };
        }),
        lang: markFunction(function (lang) {
          if (!ridentifier.test(lang || "")) {
            Sizzle.error("unsupported lang: " + lang);
          }
          lang = lang.replace(runescape, funescape).toLowerCase();
          return function (elem) {
            var elemLang;
            do {
              if (
                (elemLang = documentIsHTML
                  ? elem.lang
                  : elem.getAttribute("xml:lang") || elem.getAttribute("lang"))
              ) {
                elemLang = elemLang.toLowerCase();
                return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
              }
            } while ((elem = elem.parentNode) && elem.nodeType === 1);
            return false;
          };
        }),
        target: function (elem) {
          var hash = window.location && window.location.hash;
          return hash && hash.slice(1) === elem.id;
        },
        root: function (elem) {
          return elem === docElem;
        },
        focus: function (elem) {
          return (
            elem === document.activeElement &&
            (!document.hasFocus || document.hasFocus()) &&
            !!(elem.type || elem.href || ~elem.tabIndex)
          );
        },
        enabled: function (elem) {
          return elem.disabled === false;
        },
        disabled: function (elem) {
          return elem.disabled === true;
        },
        checked: function (elem) {
          var nodeName = elem.nodeName.toLowerCase();
          return (
            (nodeName === "input" && !!elem.checked) ||
            (nodeName === "option" && !!elem.selected)
          );
        },
        selected: function (elem) {
          if (elem.parentNode) {
            elem.parentNode.selectedIndex;
          }
          return elem.selected === true;
        },
        empty: function (elem) {
          for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
            if (elem.nodeType < 6) {
              return false;
            }
          }
          return true;
        },
        parent: function (elem) {
          return !Expr.pseudos["empty"](elem);
        },
        header: function (elem) {
          return rheader.test(elem.nodeName);
        },
        input: function (elem) {
          return rinputs.test(elem.nodeName);
        },
        button: function (elem) {
          var name = elem.nodeName.toLowerCase();
          return (
            (name === "input" && elem.type === "button") || name === "button"
          );
        },
        text: function (elem) {
          var attr;
          return (
            elem.nodeName.toLowerCase() === "input" &&
            elem.type === "text" &&
            ((attr = elem.getAttribute("type")) == null ||
              attr.toLowerCase() === "text")
          );
        },
        first: createPositionalPseudo(function () {
          return [0];
        }),
        last: createPositionalPseudo(function (matchIndexes, length) {
          return [length - 1];
        }),
        eq: createPositionalPseudo(function (matchIndexes, length, argument) {
          return [argument < 0 ? argument + length : argument];
        }),
        even: createPositionalPseudo(function (matchIndexes, length) {
          var i = 0;
          for (; i < length; i += 2) {
            matchIndexes.push(i);
          }
          return matchIndexes;
        }),
        odd: createPositionalPseudo(function (matchIndexes, length) {
          var i = 1;
          for (; i < length; i += 2) {
            matchIndexes.push(i);
          }
          return matchIndexes;
        }),
        lt: createPositionalPseudo(function (matchIndexes, length, argument) {
          var i = argument < 0 ? argument + length : argument;
          for (; --i >= 0; ) {
            matchIndexes.push(i);
          }
          return matchIndexes;
        }),
        gt: createPositionalPseudo(function (matchIndexes, length, argument) {
          var i = argument < 0 ? argument + length : argument;
          for (; ++i < length; ) {
            matchIndexes.push(i);
          }
          return matchIndexes;
        }),
      },
    };
    Expr.pseudos["nth"] = Expr.pseudos["eq"];
    for (i in {
      radio: true,
      checkbox: true,
      file: true,
      password: true,
      image: true,
    }) {
      Expr.pseudos[i] = createInputPseudo(i);
    }
    for (i in { submit: true, reset: true }) {
      Expr.pseudos[i] = createButtonPseudo(i);
    }
    function setFilters() {}
    setFilters.prototype = Expr.filters = Expr.pseudos;
    Expr.setFilters = new setFilters();
    tokenize = Sizzle.tokenize = function (selector, parseOnly) {
      var matched,
        match,
        tokens,
        type,
        soFar,
        groups,
        preFilters,
        cached = tokenCache[selector + " "];
      if (cached) {
        return parseOnly ? 0 : cached.slice(0);
      }
      soFar = selector;
      groups = [];
      preFilters = Expr.preFilter;
      while (soFar) {
        if (!matched || (match = rcomma.exec(soFar))) {
          if (match) {
            soFar = soFar.slice(match[0].length) || soFar;
          }
          groups.push((tokens = []));
        }
        matched = false;
        if ((match = rcombinators.exec(soFar))) {
          matched = match.shift();
          tokens.push({ value: matched, type: match[0].replace(rtrim, " ") });
          soFar = soFar.slice(matched.length);
        }
        for (type in Expr.filter) {
          if (
            (match = matchExpr[type].exec(soFar)) &&
            (!preFilters[type] || (match = preFilters[type](match)))
          ) {
            matched = match.shift();
            tokens.push({ value: matched, type: type, matches: match });
            soFar = soFar.slice(matched.length);
          }
        }
        if (!matched) {
          break;
        }
      }
      return parseOnly
        ? soFar.length
        : soFar
        ? Sizzle.error(selector)
        : tokenCache(selector, groups).slice(0);
    };
    function toSelector(tokens) {
      var i = 0,
        len = tokens.length,
        selector = "";
      for (; i < len; i++) {
        selector += tokens[i].value;
      }
      return selector;
    }
    function addCombinator(matcher, combinator, base) {
      var dir = combinator.dir,
        checkNonElements = base && dir === "parentNode",
        doneName = done++;
      return combinator.first
        ? function (elem, context, xml) {
            while ((elem = elem[dir])) {
              if (elem.nodeType === 1 || checkNonElements) {
                return matcher(elem, context, xml);
              }
            }
          }
        : function (elem, context, xml) {
            var oldCache,
              uniqueCache,
              outerCache,
              newCache = [dirruns, doneName];
            if (xml) {
              while ((elem = elem[dir])) {
                if (elem.nodeType === 1 || checkNonElements) {
                  if (matcher(elem, context, xml)) {
                    return true;
                  }
                }
              }
            } else {
              while ((elem = elem[dir])) {
                if (elem.nodeType === 1 || checkNonElements) {
                  outerCache = elem[expando] || (elem[expando] = {});
                  uniqueCache =
                    outerCache[elem.uniqueID] ||
                    (outerCache[elem.uniqueID] = {});
                  if (
                    (oldCache = uniqueCache[dir]) &&
                    oldCache[0] === dirruns &&
                    oldCache[1] === doneName
                  ) {
                    return (newCache[2] = oldCache[2]);
                  } else {
                    uniqueCache[dir] = newCache;
                    if ((newCache[2] = matcher(elem, context, xml))) {
                      return true;
                    }
                  }
                }
              }
            }
          };
    }
    function elementMatcher(matchers) {
      return matchers.length > 1
        ? function (elem, context, xml) {
            var i = matchers.length;
            while (i--) {
              if (!matchers[i](elem, context, xml)) {
                return false;
              }
            }
            return true;
          }
        : matchers[0];
    }
    function multipleContexts(selector, contexts, results) {
      var i = 0,
        len = contexts.length;
      for (; i < len; i++) {
        Sizzle(selector, contexts[i], results);
      }
      return results;
    }
    function condense(unmatched, map, filter, context, xml) {
      var elem,
        newUnmatched = [],
        i = 0,
        len = unmatched.length,
        mapped = map != null;
      for (; i < len; i++) {
        if ((elem = unmatched[i])) {
          if (!filter || filter(elem, context, xml)) {
            newUnmatched.push(elem);
            if (mapped) {
              map.push(i);
            }
          }
        }
      }
      return newUnmatched;
    }
    function setMatcher(
      preFilter,
      selector,
      matcher,
      postFilter,
      postFinder,
      postSelector
    ) {
      if (postFilter && !postFilter[expando]) {
        postFilter = setMatcher(postFilter);
      }
      if (postFinder && !postFinder[expando]) {
        postFinder = setMatcher(postFinder, postSelector);
      }
      return markFunction(function (seed, results, context, xml) {
        var temp,
          i,
          elem,
          preMap = [],
          postMap = [],
          preexisting = results.length,
          elems =
            seed ||
            multipleContexts(
              selector || "*",
              context.nodeType ? [context] : context,
              []
            ),
          matcherIn =
            preFilter && (seed || !selector)
              ? condense(elems, preMap, preFilter, context, xml)
              : elems,
          matcherOut = matcher
            ? postFinder || (seed ? preFilter : preexisting || postFilter)
              ? []
              : results
            : matcherIn;
        if (matcher) {
          matcher(matcherIn, matcherOut, context, xml);
        }
        if (postFilter) {
          temp = condense(matcherOut, postMap);
          postFilter(temp, [], context, xml);
          i = temp.length;
          while (i--) {
            if ((elem = temp[i])) {
              matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
            }
          }
        }
        if (seed) {
          if (postFinder || preFilter) {
            if (postFinder) {
              temp = [];
              i = matcherOut.length;
              while (i--) {
                if ((elem = matcherOut[i])) {
                  temp.push((matcherIn[i] = elem));
                }
              }
              postFinder(null, (matcherOut = []), temp, xml);
            }
            i = matcherOut.length;
            while (i--) {
              if (
                (elem = matcherOut[i]) &&
                (temp = postFinder ? indexOf(seed, elem) : preMap[i]) > -1
              ) {
                seed[temp] = !(results[temp] = elem);
              }
            }
          }
        } else {
          matcherOut = condense(
            matcherOut === results
              ? matcherOut.splice(preexisting, matcherOut.length)
              : matcherOut
          );
          if (postFinder) {
            postFinder(null, results, matcherOut, xml);
          } else {
            push.apply(results, matcherOut);
          }
        }
      });
    }
    function matcherFromTokens(tokens) {
      var checkContext,
        matcher,
        j,
        len = tokens.length,
        leadingRelative = Expr.relative[tokens[0].type],
        implicitRelative = leadingRelative || Expr.relative[" "],
        i = leadingRelative ? 1 : 0,
        matchContext = addCombinator(
          function (elem) {
            return elem === checkContext;
          },
          implicitRelative,
          true
        ),
        matchAnyContext = addCombinator(
          function (elem) {
            return indexOf(checkContext, elem) > -1;
          },
          implicitRelative,
          true
        ),
        matchers = [
          function (elem, context, xml) {
            var ret =
              (!leadingRelative && (xml || context !== outermostContext)) ||
              ((checkContext = context).nodeType
                ? matchContext(elem, context, xml)
                : matchAnyContext(elem, context, xml));
            checkContext = null;
            return ret;
          },
        ];
      for (; i < len; i++) {
        if ((matcher = Expr.relative[tokens[i].type])) {
          matchers = [addCombinator(elementMatcher(matchers), matcher)];
        } else {
          matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);
          if (matcher[expando]) {
            j = ++i;
            for (; j < len; j++) {
              if (Expr.relative[tokens[j].type]) {
                break;
              }
            }
            return setMatcher(
              i > 1 && elementMatcher(matchers),
              i > 1 &&
                toSelector(
                  tokens
                    .slice(0, i - 1)
                    .concat({ value: tokens[i - 2].type === " " ? "*" : "" })
                ).replace(rtrim, "$1"),
              matcher,
              i < j && matcherFromTokens(tokens.slice(i, j)),
              j < len && matcherFromTokens((tokens = tokens.slice(j))),
              j < len && toSelector(tokens)
            );
          }
          matchers.push(matcher);
        }
      }
      return elementMatcher(matchers);
    }
    function matcherFromGroupMatchers(elementMatchers, setMatchers) {
      var bySet = setMatchers.length > 0,
        byElement = elementMatchers.length > 0,
        superMatcher = function (seed, context, xml, results, outermost) {
          var elem,
            j,
            matcher,
            matchedCount = 0,
            i = "0",
            unmatched = seed && [],
            setMatched = [],
            contextBackup = outermostContext,
            elems = seed || (byElement && Expr.find["TAG"]("*", outermost)),
            dirrunsUnique = (dirruns +=
              contextBackup == null ? 1 : Math.random() || 0.1),
            len = elems.length;
          if (outermost) {
            outermostContext = context === document || context || outermost;
          }
          for (; i !== len && (elem = elems[i]) != null; i++) {
            if (byElement && elem) {
              j = 0;
              if (!context && elem.ownerDocument !== document) {
                setDocument(elem);
                xml = !documentIsHTML;
              }
              while ((matcher = elementMatchers[j++])) {
                if (matcher(elem, context || document, xml)) {
                  results.push(elem);
                  break;
                }
              }
              if (outermost) {
                dirruns = dirrunsUnique;
              }
            }
            if (bySet) {
              if ((elem = !matcher && elem)) {
                matchedCount--;
              }
              if (seed) {
                unmatched.push(elem);
              }
            }
          }
          matchedCount += i;
          if (bySet && i !== matchedCount) {
            j = 0;
            while ((matcher = setMatchers[j++])) {
              matcher(unmatched, setMatched, context, xml);
            }
            if (seed) {
              if (matchedCount > 0) {
                while (i--) {
                  if (!(unmatched[i] || setMatched[i])) {
                    setMatched[i] = pop.call(results);
                  }
                }
              }
              setMatched = condense(setMatched);
            }
            push.apply(results, setMatched);
            if (
              outermost &&
              !seed &&
              setMatched.length > 0 &&
              matchedCount + setMatchers.length > 1
            ) {
              Sizzle.uniqueSort(results);
            }
          }
          if (outermost) {
            dirruns = dirrunsUnique;
            outermostContext = contextBackup;
          }
          return unmatched;
        };
      return bySet ? markFunction(superMatcher) : superMatcher;
    }
    compile = Sizzle.compile = function (selector, match) {
      var i,
        setMatchers = [],
        elementMatchers = [],
        cached = compilerCache[selector + " "];
      if (!cached) {
        if (!match) {
          match = tokenize(selector);
        }
        i = match.length;
        while (i--) {
          cached = matcherFromTokens(match[i]);
          if (cached[expando]) {
            setMatchers.push(cached);
          } else {
            elementMatchers.push(cached);
          }
        }
        cached = compilerCache(
          selector,
          matcherFromGroupMatchers(elementMatchers, setMatchers)
        );
        cached.selector = selector;
      }
      return cached;
    };
    select = Sizzle.select = function (selector, context, results, seed) {
      var i,
        tokens,
        token,
        type,
        find,
        compiled = typeof selector === "function" && selector,
        match = !seed && tokenize((selector = compiled.selector || selector));
      results = results || [];
      if (match.length === 1) {
        tokens = match[0] = match[0].slice(0);
        if (
          tokens.length > 2 &&
          (token = tokens[0]).type === "ID" &&
          support.getById &&
          context.nodeType === 9 &&
          documentIsHTML &&
          Expr.relative[tokens[1].type]
        ) {
          context = (Expr.find["ID"](
            token.matches[0].replace(runescape, funescape),
            context
          ) || [])[0];
          if (!context) {
            return results;
          } else if (compiled) {
            context = context.parentNode;
          }
          selector = selector.slice(tokens.shift().value.length);
        }
        i = matchExpr["needsContext"].test(selector) ? 0 : tokens.length;
        while (i--) {
          token = tokens[i];
          if (Expr.relative[(type = token.type)]) {
            break;
          }
          if ((find = Expr.find[type])) {
            if (
              (seed = find(
                token.matches[0].replace(runescape, funescape),
                (rsibling.test(tokens[0].type) &&
                  testContext(context.parentNode)) ||
                  context
              ))
            ) {
              tokens.splice(i, 1);
              selector = seed.length && toSelector(tokens);
              if (!selector) {
                push.apply(results, seed);
                return results;
              }
              break;
            }
          }
        }
      }
      (compiled || compile(selector, match))(
        seed,
        context,
        !documentIsHTML,
        results,
        !context ||
          (rsibling.test(selector) && testContext(context.parentNode)) ||
          context
      );
      return results;
    };
    support.sortStable = expando.split("").sort(sortOrder).join("") === expando;
    support.detectDuplicates = !!hasDuplicate;
    setDocument();
    support.sortDetached = assert(function (div1) {
      return div1.compareDocumentPosition(document.createElement("div")) & 1;
    });
    if (
      !assert(function (div) {
        div.innerHTML = "<a href='#'></a>";
        return div.firstChild.getAttribute("href") === "#";
      })
    ) {
      addHandle("type|href|height|width", function (elem, name, isXML) {
        if (!isXML) {
          return elem.getAttribute(name, name.toLowerCase() === "type" ? 1 : 2);
        }
      });
    }
    if (
      !support.attributes ||
      !assert(function (div) {
        div.innerHTML = "<input/>";
        div.firstChild.setAttribute("value", "");
        return div.firstChild.getAttribute("value") === "";
      })
    ) {
      addHandle("value", function (elem, name, isXML) {
        if (!isXML && elem.nodeName.toLowerCase() === "input") {
          return elem.defaultValue;
        }
      });
    }
    if (
      !assert(function (div) {
        return div.getAttribute("disabled") == null;
      })
    ) {
      addHandle(booleans, function (elem, name, isXML) {
        var val;
        if (!isXML) {
          return elem[name] === true
            ? name.toLowerCase()
            : (val = elem.getAttributeNode(name)) && val.specified
            ? val.value
            : null;
        }
      });
    }
    return Sizzle;
  })(window);
  Flits.find = Sizzle;
  Flits.expr = Sizzle.selectors;
  Flits.expr[":"] = Flits.expr.pseudos;
  Flits.uniqueSort = Flits.unique = Sizzle.uniqueSort;
  Flits.text = Sizzle.getText;
  Flits.isXMLDoc = Sizzle.isXML;
  Flits.contains = Sizzle.contains;
  var dir = function (elem, dir, until) {
    var matched = [],
      truncate = until !== undefined;
    while ((elem = elem[dir]) && elem.nodeType !== 9) {
      if (elem.nodeType === 1) {
        if (truncate && Flits(elem).is(until)) {
          break;
        }
        matched.push(elem);
      }
    }
    return matched;
  };
  var siblings = function (n, elem) {
    var matched = [];
    for (; n; n = n.nextSibling) {
      if (n.nodeType === 1 && n !== elem) {
        matched.push(n);
      }
    }
    return matched;
  };
  var rneedsContext = Flits.expr.match.needsContext;
  var rsingleTag = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/;
  var risSimple = /^.[^:#\[\.,]*$/;
  function winnow(elements, qualifier, not) {
    if (Flits.isFunction(qualifier)) {
      return Flits.grep(elements, function (elem, i) {
        return !!qualifier.call(elem, i, elem) !== not;
      });
    }
    if (qualifier.nodeType) {
      return Flits.grep(elements, function (elem) {
        return (elem === qualifier) !== not;
      });
    }
    if (typeof qualifier === "string") {
      if (risSimple.test(qualifier)) {
        return Flits.filter(qualifier, elements, not);
      }
      qualifier = Flits.filter(qualifier, elements);
    }
    return Flits.grep(elements, function (elem) {
      return indexOf.call(qualifier, elem) > -1 !== not;
    });
  }
  Flits.filter = function (expr, elems, not) {
    var elem = elems[0];
    if (not) {
      expr = ":not(" + expr + ")";
    }
    return elems.length === 1 && elem.nodeType === 1
      ? Flits.find.matchesSelector(elem, expr)
        ? [elem]
        : []
      : Flits.find.matches(
          expr,
          Flits.grep(elems, function (elem) {
            return elem.nodeType === 1;
          })
        );
  };
  Flits.fn.extend({
    find: function (selector) {
      var i,
        len = this.length,
        ret = [],
        self = this;
      if (typeof selector !== "string") {
        return this.pushStack(
          Flits(selector).filter(function () {
            for (i = 0; i < len; i++) {
              if (Flits.contains(self[i], this)) {
                return true;
              }
            }
          })
        );
      }
      for (i = 0; i < len; i++) {
        Flits.find(selector, self[i], ret);
      }
      ret = this.pushStack(len > 1 ? Flits.unique(ret) : ret);
      ret.selector = this.selector ? this.selector + " " + selector : selector;
      return ret;
    },
    filter: function (selector) {
      return this.pushStack(winnow(this, selector || [], false));
    },
    not: function (selector) {
      return this.pushStack(winnow(this, selector || [], true));
    },
    is: function (selector) {
      return !!winnow(
        this,
        typeof selector === "string" && rneedsContext.test(selector)
          ? Flits(selector)
          : selector || [],
        false
      ).length;
    },
  });
  var rootFlits,
    rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
    init = (Flits.fn.init = function (selector, context, root) {
      var match, elem;
      if (!selector) {
        return this;
      }
      root = root || rootFlits;
      if (typeof selector === "string") {
        if (
          selector[0] === "<" &&
          selector[selector.length - 1] === ">" &&
          selector.length >= 3
        ) {
          match = [null, selector, null];
        } else {
          match = rquickExpr.exec(selector);
        }
        if (match && (match[1] || !context)) {
          if (match[1]) {
            context = context instanceof Flits ? context[0] : context;
            Flits.merge(
              this,
              Flits.parseHTML(
                match[1],
                context && context.nodeType
                  ? context.ownerDocument || context
                  : document,
                true
              )
            );
            if (rsingleTag.test(match[1]) && Flits.isPlainObject(context)) {
              for (match in context) {
                if (Flits.isFunction(this[match])) {
                  this[match](context[match]);
                } else {
                  this.attr(match, context[match]);
                }
              }
            }
            return this;
          } else {
            elem = document.getElementById(match[2]);
            if (elem && elem.parentNode) {
              this.length = 1;
              this[0] = elem;
            }
            this.context = document;
            this.selector = selector;
            return this;
          }
        } else if (!context || context.Flits) {
          return (context || root).find(selector);
        } else {
          return this.constructor(context).find(selector);
        }
      } else if (selector.nodeType) {
        this.context = this[0] = selector;
        this.length = 1;
        return this;
      } else if (Flits.isFunction(selector)) {
        return root.ready !== undefined
          ? root.ready(selector)
          : selector(Flits);
      }
      if (selector.selector !== undefined) {
        this.selector = selector.selector;
        this.context = selector.context;
      }
      return Flits.makeArray(selector, this);
    });
  init.prototype = Flits.fn;
  rootFlits = Flits(document);
  var rparentsprev = /^(?:parents|prev(?:Until|All))/,
    guaranteedUnique = {
      children: true,
      contents: true,
      next: true,
      prev: true,
    };
  Flits.fn.extend({
    has: function (target) {
      var targets = Flits(target, this),
        l = targets.length;
      return this.filter(function () {
        var i = 0;
        for (; i < l; i++) {
          if (Flits.contains(this, targets[i])) {
            return true;
          }
        }
      });
    },
    closest: function (selectors, context) {
      var cur,
        i = 0,
        l = this.length,
        matched = [],
        pos =
          rneedsContext.test(selectors) || typeof selectors !== "string"
            ? Flits(selectors, context || this.context)
            : 0;
      for (; i < l; i++) {
        for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) {
          if (
            cur.nodeType < 11 &&
            (pos
              ? pos.index(cur) > -1
              : cur.nodeType === 1 &&
                Flits.find.matchesSelector(cur, selectors))
          ) {
            matched.push(cur);
            break;
          }
        }
      }
      return this.pushStack(
        matched.length > 1 ? Flits.uniqueSort(matched) : matched
      );
    },
    index: function (elem) {
      if (!elem) {
        return this[0] && this[0].parentNode
          ? this.first().prevAll().length
          : -1;
      }
      if (typeof elem === "string") {
        return indexOf.call(Flits(elem), this[0]);
      }
      return indexOf.call(this, elem.Flits ? elem[0] : elem);
    },
    add: function (selector, context) {
      return this.pushStack(
        Flits.uniqueSort(Flits.merge(this.get(), Flits(selector, context)))
      );
    },
    addBack: function (selector) {
      return this.add(
        selector == null ? this.prevObject : this.prevObject.filter(selector)
      );
    },
  });
  function sibling(cur, dir) {
    while ((cur = cur[dir]) && cur.nodeType !== 1) {}
    return cur;
  }
  Flits.each(
    {
      parent: function (elem) {
        var parent = elem.parentNode;
        return parent && parent.nodeType !== 11 ? parent : null;
      },
      parents: function (elem) {
        return dir(elem, "parentNode");
      },
      parentsUntil: function (elem, i, until) {
        return dir(elem, "parentNode", until);
      },
      next: function (elem) {
        return sibling(elem, "nextSibling");
      },
      prev: function (elem) {
        return sibling(elem, "previousSibling");
      },
      nextAll: function (elem) {
        return dir(elem, "nextSibling");
      },
      prevAll: function (elem) {
        return dir(elem, "previousSibling");
      },
      nextUntil: function (elem, i, until) {
        return dir(elem, "nextSibling", until);
      },
      prevUntil: function (elem, i, until) {
        return dir(elem, "previousSibling", until);
      },
      siblings: function (elem) {
        return siblings((elem.parentNode || {}).firstChild, elem);
      },
      children: function (elem) {
        return siblings(elem.firstChild);
      },
      contents: function (elem) {
        return elem.contentDocument || Flits.merge([], elem.childNodes);
      },
    },
    function (name, fn) {
      Flits.fn[name] = function (until, selector) {
        var matched = Flits.map(this, fn, until);
        if (name.slice(-5) !== "Until") {
          selector = until;
        }
        if (selector && typeof selector === "string") {
          matched = Flits.filter(selector, matched);
        }
        if (this.length > 1) {
          if (!guaranteedUnique[name]) {
            Flits.uniqueSort(matched);
          }
          if (rparentsprev.test(name)) {
            matched.reverse();
          }
        }
        return this.pushStack(matched);
      };
    }
  );
  var rnotwhite = /\S+/g;
  function createOptions(options) {
    var object = {};
    Flits.each(options.match(rnotwhite) || [], function (_, flag) {
      object[flag] = true;
    });
    return object;
  }
  Flits.Callbacks = function (options) {
    options =
      typeof options === "string"
        ? createOptions(options)
        : Flits.extend({}, options);
    var firing,
      memory,
      fired,
      locked,
      list = [],
      queue = [],
      firingIndex = -1,
      fire = function () {
        locked = options.once;
        fired = firing = true;
        for (; queue.length; firingIndex = -1) {
          memory = queue.shift();
          while (++firingIndex < list.length) {
            if (
              list[firingIndex].apply(memory[0], memory[1]) === false &&
              options.stopOnFalse
            ) {
              firingIndex = list.length;
              memory = false;
            }
          }
        }
        if (!options.memory) {
          memory = false;
        }
        firing = false;
        if (locked) {
          if (memory) {
            list = [];
          } else {
            list = "";
          }
        }
      },
      self = {
        add: function () {
          if (list) {
            if (memory && !firing) {
              firingIndex = list.length - 1;
              queue.push(memory);
            }
            (function add(args) {
              Flits.each(args, function (_, arg) {
                if (Flits.isFunction(arg)) {
                  if (!options.unique || !self.has(arg)) {
                    list.push(arg);
                  }
                } else if (arg && arg.length && Flits.type(arg) !== "string") {
                  add(arg);
                }
              });
            })(arguments);
            if (memory && !firing) {
              fire();
            }
          }
          return this;
        },
        remove: function () {
          Flits.each(arguments, function (_, arg) {
            var index;
            while ((index = Flits.inArray(arg, list, index)) > -1) {
              list.splice(index, 1);
              if (index <= firingIndex) {
                firingIndex--;
              }
            }
          });
          return this;
        },
        has: function (fn) {
          return fn ? Flits.inArray(fn, list) > -1 : list.length > 0;
        },
        empty: function () {
          if (list) {
            list = [];
          }
          return this;
        },
        disable: function () {
          locked = queue = [];
          list = memory = "";
          return this;
        },
        disabled: function () {
          return !list;
        },
        lock: function () {
          locked = queue = [];
          if (!memory) {
            list = memory = "";
          }
          return this;
        },
        locked: function () {
          return !!locked;
        },
        fireWith: function (context, args) {
          if (!locked) {
            args = args || [];
            args = [context, args.slice ? args.slice() : args];
            queue.push(args);
            if (!firing) {
              fire();
            }
          }
          return this;
        },
        fire: function () {
          self.fireWith(this, arguments);
          return this;
        },
        fired: function () {
          return !!fired;
        },
      };
    return self;
  };
  Flits.extend({
    Deferred: function (func) {
      var tuples = [
          ["resolve", "done", Flits.Callbacks("once memory"), "resolved"],
          ["reject", "fail", Flits.Callbacks("once memory"), "rejected"],
          ["notify", "progress", Flits.Callbacks("memory")],
        ],
        state = "pending",
        promise = {
          state: function () {
            return state;
          },
          always: function () {
            deferred.done(arguments).fail(arguments);
            return this;
          },
          then: function () {
            var fns = arguments;
            return Flits.Deferred(function (newDefer) {
              Flits.each(tuples, function (i, tuple) {
                var fn = Flits.isFunction(fns[i]) && fns[i];
                deferred[tuple[1]](function () {
                  var returned = fn && fn.apply(this, arguments);
                  if (returned && Flits.isFunction(returned.promise)) {
                    returned
                      .promise()
                      .progress(newDefer.notify)
                      .done(newDefer.resolve)
                      .fail(newDefer.reject);
                  } else {
                    newDefer[tuple[0] + "With"](
                      this === promise ? newDefer.promise() : this,
                      fn ? [returned] : arguments
                    );
                  }
                });
              });
              fns = null;
            }).promise();
          },
          promise: function (obj) {
            return obj != null ? Flits.extend(obj, promise) : promise;
          },
        },
        deferred = {};
      promise.pipe = promise.then;
      Flits.each(tuples, function (i, tuple) {
        var list = tuple[2],
          stateString = tuple[3];
        promise[tuple[1]] = list.add;
        if (stateString) {
          list.add(
            function () {
              state = stateString;
            },
            tuples[i ^ 1][2].disable,
            tuples[2][2].lock
          );
        }
        deferred[tuple[0]] = function () {
          deferred[tuple[0] + "With"](
            this === deferred ? promise : this,
            arguments
          );
          return this;
        };
        deferred[tuple[0] + "With"] = list.fireWith;
      });
      promise.promise(deferred);
      if (func) {
        func.call(deferred, deferred);
      }
      return deferred;
    },
    when: function (subordinate) {
      var i = 0,
        resolveValues = slice.call(arguments),
        length = resolveValues.length,
        remaining =
          length !== 1 || (subordinate && Flits.isFunction(subordinate.promise))
            ? length
            : 0,
        deferred = remaining === 1 ? subordinate : Flits.Deferred(),
        updateFunc = function (i, contexts, values) {
          return function (value) {
            contexts[i] = this;
            values[i] = arguments.length > 1 ? slice.call(arguments) : value;
            if (values === progressValues) {
              deferred.notifyWith(contexts, values);
            } else if (!--remaining) {
              deferred.resolveWith(contexts, values);
            }
          };
        },
        progressValues,
        progressContexts,
        resolveContexts;
      if (length > 1) {
        progressValues = new Array(length);
        progressContexts = new Array(length);
        resolveContexts = new Array(length);
        for (; i < length; i++) {
          if (resolveValues[i] && Flits.isFunction(resolveValues[i].promise)) {
            resolveValues[i]
              .promise()
              .progress(updateFunc(i, progressContexts, progressValues))
              .done(updateFunc(i, resolveContexts, resolveValues))
              .fail(deferred.reject);
          } else {
            --remaining;
          }
        }
      }
      if (!remaining) {
        deferred.resolveWith(resolveContexts, resolveValues);
      }
      return deferred.promise();
    },
  });
  var readyList;
  Flits.fn.ready = function (fn) {
    Flits.ready.promise().done(fn);
    return this;
  };
  Flits.extend({
    isReady: false,
    readyWait: 1,
    holdReady: function (hold) {
      if (hold) {
        Flits.readyWait++;
      } else {
        Flits.ready(true);
      }
    },
    ready: function (wait) {
      if (wait === true ? --Flits.readyWait : Flits.isReady) {
        return;
      }
      Flits.isReady = true;
      if (wait !== true && --Flits.readyWait > 0) {
        return;
      }
      readyList.resolveWith(document, [Flits]);
      if (Flits.fn.triggerHandler) {
        Flits(document).triggerHandler("ready");
        Flits(document).off("ready");
      }
    },
  });
  function completed() {
    document.removeEventListener("DOMContentLoaded", completed);
    window.removeEventListener("load", completed);
    Flits.ready();
  }
  Flits.ready.promise = function (obj) {
    if (!readyList) {
      readyList = Flits.Deferred();
      if (
        document.readyState === "complete" ||
        (document.readyState !== "loading" &&
          !document.documentElement.doScroll)
      ) {
        window.setTimeout(Flits.ready);
      } else {
        document.addEventListener("DOMContentLoaded", completed);
        window.addEventListener("load", completed);
      }
    }
    return readyList.promise(obj);
  };
  Flits.ready.promise();
  var access = function (elems, fn, key, value, chainable, emptyGet, raw) {
    var i = 0,
      len = elems.length,
      bulk = key == null;
    if (Flits.type(key) === "object") {
      chainable = true;
      for (i in key) {
        access(elems, fn, i, key[i], true, emptyGet, raw);
      }
    } else if (value !== undefined) {
      chainable = true;
      if (!Flits.isFunction(value)) {
        raw = true;
      }
      if (bulk) {
        if (raw) {
          fn.call(elems, value);
          fn = null;
        } else {
          bulk = fn;
          fn = function (elem, key, value) {
            return bulk.call(Flits(elem), value);
          };
        }
      }
      if (fn) {
        for (; i < len; i++) {
          fn(
            elems[i],
            key,
            raw ? value : value.call(elems[i], i, fn(elems[i], key))
          );
        }
      }
    }
    return chainable
      ? elems
      : bulk
      ? fn.call(elems)
      : len
      ? fn(elems[0], key)
      : emptyGet;
  };
  var acceptData = function (owner) {
    return owner.nodeType === 1 || owner.nodeType === 9 || !+owner.nodeType;
  };
  function Data() {
    this.expando = Flits.expando + Data.uid++;
  }
  Data.uid = 1;
  Data.prototype = {
    register: function (owner, initial) {
      var value = initial || {};
      if (owner.nodeType) {
        owner[this.expando] = value;
      } else {
        Object.defineProperty(owner, this.expando, {
          value: value,
          writable: true,
          configurable: true,
        });
      }
      return owner[this.expando];
    },
    cache: function (owner) {
      if (!acceptData(owner)) {
        return {};
      }
      var value = owner[this.expando];
      if (!value) {
        value = {};
        if (acceptData(owner)) {
          if (owner.nodeType) {
            owner[this.expando] = value;
          } else {
            Object.defineProperty(owner, this.expando, {
              value: value,
              configurable: true,
            });
          }
        }
      }
      return value;
    },
    set: function (owner, data, value) {
      var prop,
        cache = this.cache(owner);
      if (typeof data === "string") {
        cache[data] = value;
      } else {
        for (prop in data) {
          cache[prop] = data[prop];
        }
      }
      return cache;
    },
    get: function (owner, key) {
      return key === undefined
        ? this.cache(owner)
        : owner[this.expando] && owner[this.expando][key];
    },
    access: function (owner, key, value) {
      var stored;
      if (
        key === undefined ||
        (key && typeof key === "string" && value === undefined)
      ) {
        stored = this.get(owner, key);
        return stored !== undefined
          ? stored
          : this.get(owner, Flits.camelCase(key));
      }
      this.set(owner, key, value);
      return value !== undefined ? value : key;
    },
    remove: function (owner, key) {
      var i,
        name,
        camel,
        cache = owner[this.expando];
      if (cache === undefined) {
        return;
      }
      if (key === undefined) {
        this.register(owner);
      } else {
        if (Flits.isArray(key)) {
          name = key.concat(key.map(Flits.camelCase));
        } else {
          camel = Flits.camelCase(key);
          if (key in cache) {
            name = [key, camel];
          } else {
            name = camel;
            name = name in cache ? [name] : name.match(rnotwhite) || [];
          }
        }
        i = name.length;
        while (i--) {
          delete cache[name[i]];
        }
      }
      if (key === undefined || Flits.isEmptyObject(cache)) {
        if (owner.nodeType) {
          owner[this.expando] = undefined;
        } else {
          delete owner[this.expando];
        }
      }
    },
    hasData: function (owner) {
      var cache = owner[this.expando];
      return cache !== undefined && !Flits.isEmptyObject(cache);
    },
  };
  var dataPriv = new Data();
  var dataUser = new Data();
  var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
    rmultiDash = /[A-Z]/g;
  function dataAttr(elem, key, data) {
    var name;
    if (data === undefined && elem.nodeType === 1) {
      name = "data-" + key.replace(rmultiDash, "-$&").toLowerCase();
      data = elem.getAttribute(name);
      if (typeof data === "string") {
        try {
          data =
            data === "true"
              ? true
              : data === "false"
              ? false
              : data === "null"
              ? null
              : +data + "" === data
              ? +data
              : rbrace.test(data)
              ? Flits.parseJSON(data)
              : data;
        } catch (e) {}
        dataUser.set(elem, key, data);
      } else {
        data = undefined;
      }
    }
    return data;
  }
  Flits.extend({
    hasData: function (elem) {
      return dataUser.hasData(elem) || dataPriv.hasData(elem);
    },
    data: function (elem, name, data) {
      return dataUser.access(elem, name, data);
    },
    removeData: function (elem, name) {
      dataUser.remove(elem, name);
    },
    _data: function (elem, name, data) {
      return dataPriv.access(elem, name, data);
    },
    _removeData: function (elem, name) {
      dataPriv.remove(elem, name);
    },
  });
  Flits.fn.extend({
    data: function (key, value) {
      var i,
        name,
        data,
        elem = this[0],
        attrs = elem && elem.attributes;
      if (key === undefined) {
        if (this.length) {
          data = dataUser.get(elem);
          if (elem.nodeType === 1 && !dataPriv.get(elem, "hasDataAttrs")) {
            i = attrs.length;
            while (i--) {
              if (attrs[i]) {
                name = attrs[i].name;
                if (name.indexOf("data-") === 0) {
                  name = Flits.camelCase(name.slice(5));
                  dataAttr(elem, name, data[name]);
                }
              }
            }
            dataPriv.set(elem, "hasDataAttrs", true);
          }
        }
        return data;
      }
      if (typeof key === "object") {
        return this.each(function () {
          dataUser.set(this, key);
        });
      }
      return access(
        this,
        function (value) {
          var data, camelKey;
          if (elem && value === undefined) {
            data =
              dataUser.get(elem, key) ||
              dataUser.get(elem, key.replace(rmultiDash, "-$&").toLowerCase());
            if (data !== undefined) {
              return data;
            }
            camelKey = Flits.camelCase(key);
            data = dataUser.get(elem, camelKey);
            if (data !== undefined) {
              return data;
            }
            data = dataAttr(elem, camelKey, undefined);
            if (data !== undefined) {
              return data;
            }
            return;
          }
          camelKey = Flits.camelCase(key);
          this.each(function () {
            var data = dataUser.get(this, camelKey);
            dataUser.set(this, camelKey, value);
            if (key.indexOf("-") > -1 && data !== undefined) {
              dataUser.set(this, key, value);
            }
          });
        },
        null,
        value,
        arguments.length > 1,
        null,
        true
      );
    },
    removeData: function (key) {
      return this.each(function () {
        dataUser.remove(this, key);
      });
    },
  });
  Flits.extend({
    queue: function (elem, type, data) {
      var queue;
      if (elem) {
        type = (type || "fx") + "queue";
        queue = dataPriv.get(elem, type);
        if (data) {
          if (!queue || Flits.isArray(data)) {
            queue = dataPriv.access(elem, type, Flits.makeArray(data));
          } else {
            queue.push(data);
          }
        }
        return queue || [];
      }
    },
    dequeue: function (elem, type) {
      type = type || "fx";
      var queue = Flits.queue(elem, type),
        startLength = queue.length,
        fn = queue.shift(),
        hooks = Flits._queueHooks(elem, type),
        next = function () {
          Flits.dequeue(elem, type);
        };
      if (fn === "inprogress") {
        fn = queue.shift();
        startLength--;
      }
      if (fn) {
        if (type === "fx") {
          queue.unshift("inprogress");
        }
        delete hooks.stop;
        fn.call(elem, next, hooks);
      }
      if (!startLength && hooks) {
        hooks.empty.fire();
      }
    },
    _queueHooks: function (elem, type) {
      var key = type + "queueHooks";
      return (
        dataPriv.get(elem, key) ||
        dataPriv.access(elem, key, {
          empty: Flits.Callbacks("once memory").add(function () {
            dataPriv.remove(elem, [type + "queue", key]);
          }),
        })
      );
    },
  });
  Flits.fn.extend({
    queue: function (type, data) {
      var setter = 2;
      if (typeof type !== "string") {
        data = type;
        type = "fx";
        setter--;
      }
      if (arguments.length < setter) {
        return Flits.queue(this[0], type);
      }
      return data === undefined
        ? this
        : this.each(function () {
            var queue = Flits.queue(this, type, data);
            Flits._queueHooks(this, type);
            if (type === "fx" && queue[0] !== "inprogress") {
              Flits.dequeue(this, type);
            }
          });
    },
    dequeue: function (type) {
      return this.each(function () {
        Flits.dequeue(this, type);
      });
    },
    clearQueue: function (type) {
      return this.queue(type || "fx", []);
    },
    promise: function (type, obj) {
      var tmp,
        count = 1,
        defer = Flits.Deferred(),
        elements = this,
        i = this.length,
        resolve = function () {
          if (!--count) {
            defer.resolveWith(elements, [elements]);
          }
        };
      if (typeof type !== "string") {
        obj = type;
        type = undefined;
      }
      type = type || "fx";
      while (i--) {
        tmp = dataPriv.get(elements[i], type + "queueHooks");
        if (tmp && tmp.empty) {
          count++;
          tmp.empty.add(resolve);
        }
      }
      resolve();
      return defer.promise(obj);
    },
  });
  var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
  var rcssNum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i");
  var cssExpand = ["Top", "Right", "Bottom", "Left"];
  var isHidden = function (elem, el) {
    elem = el || elem;
    return (
      Flits.css(elem, "display") === "none" ||
      !Flits.contains(elem.ownerDocument, elem)
    );
  };
  function adjustCSS(elem, prop, valueParts, tween) {
    var adjusted,
      scale = 1,
      maxIterations = 20,
      currentValue = tween
        ? function () {
            return tween.cur();
          }
        : function () {
            return Flits.css(elem, prop, "");
          },
      initial = currentValue(),
      unit =
        (valueParts && valueParts[3]) || (Flits.cssNumber[prop] ? "" : "px"),
      initialInUnit =
        (Flits.cssNumber[prop] || (unit !== "px" && +initial)) &&
        rcssNum.exec(Flits.css(elem, prop));
    if (initialInUnit && initialInUnit[3] !== unit) {
      unit = unit || initialInUnit[3];
      valueParts = valueParts || [];
      initialInUnit = +initial || 1;
      do {
        scale = scale || ".5";
        initialInUnit = initialInUnit / scale;
        Flits.style(elem, prop, initialInUnit + unit);
      } while (
        scale !== (scale = currentValue() / initial) &&
        scale !== 1 &&
        --maxIterations
      );
    }
    if (valueParts) {
      initialInUnit = +initialInUnit || +initial || 0;
      adjusted = valueParts[1]
        ? initialInUnit + (valueParts[1] + 1) * valueParts[2]
        : +valueParts[2];
      if (tween) {
        tween.unit = unit;
        tween.start = initialInUnit;
        tween.end = adjusted;
      }
    }
    return adjusted;
  }
  var rcheckableType = /^(?:checkbox|radio)$/i;
  var rtagName = /<([\w:-]+)/;
  var rscriptType = /^$|\/(?:java|ecma)script/i;
  var wrapMap = {
    option: [1, "<select multiple='multiple'>", "</select>"],
    thead: [1, "<table>", "</table>"],
    col: [2, "<table><colgroup>", "</colgroup></table>"],
    tr: [2, "<table><tbody>", "</tbody></table>"],
    td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
    _default: [0, "", ""],
  };
  wrapMap.optgroup = wrapMap.option;
  wrapMap.tbody =
    wrapMap.tfoot =
    wrapMap.colgroup =
    wrapMap.caption =
      wrapMap.thead;
  wrapMap.th = wrapMap.td;
  function getAll(context, tag) {
    var ret =
      typeof context.getElementsByTagName !== "undefined"
        ? context.getElementsByTagName(tag || "*")
        : typeof context.querySelectorAll !== "undefined"
        ? context.querySelectorAll(tag || "*")
        : [];
    return tag === undefined || (tag && Flits.nodeName(context, tag))
      ? Flits.merge([context], ret)
      : ret;
  }
  function setGlobalEval(elems, refElements) {
    var i = 0,
      l = elems.length;
    for (; i < l; i++) {
      dataPriv.set(
        elems[i],
        "globalEval",
        !refElements || dataPriv.get(refElements[i], "globalEval")
      );
    }
  }
  var rhtml = /<|&#?\w+;/;
  function buildFragment(elems, context, scripts, selection, ignored) {
    var elem,
      tmp,
      tag,
      wrap,
      contains,
      j,
      fragment = context.createDocumentFragment(),
      nodes = [],
      i = 0,
      l = elems.length;
    for (; i < l; i++) {
      elem = elems[i];
      if (elem || elem === 0) {
        if (Flits.type(elem) === "object") {
          Flits.merge(nodes, elem.nodeType ? [elem] : elem);
        } else if (!rhtml.test(elem)) {
          nodes.push(context.createTextNode(elem));
        } else {
          tmp = tmp || fragment.appendChild(context.createElement("div"));
          tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
          wrap = wrapMap[tag] || wrapMap._default;
          tmp.innerHTML = wrap[1] + Flits.htmlPrefilter(elem) + wrap[2];
          j = wrap[0];
          while (j--) {
            tmp = tmp.lastChild;
          }
          Flits.merge(nodes, tmp.childNodes);
          tmp = fragment.firstChild;
          tmp.textContent = "";
        }
      }
    }
    fragment.textContent = "";
    i = 0;
    while ((elem = nodes[i++])) {
      if (selection && Flits.inArray(elem, selection) > -1) {
        if (ignored) {
          ignored.push(elem);
        }
        continue;
      }
      contains = Flits.contains(elem.ownerDocument, elem);
      tmp = getAll(fragment.appendChild(elem), "script");
      if (contains) {
        setGlobalEval(tmp);
      }
      if (scripts) {
        j = 0;
        while ((elem = tmp[j++])) {
          if (rscriptType.test(elem.type || "")) {
            scripts.push(elem);
          }
        }
      }
    }
    return fragment;
  }
  (function () {
    var fragment = document.createDocumentFragment(),
      div = fragment.appendChild(document.createElement("div")),
      input = document.createElement("input");
    input.setAttribute("type", "radio");
    input.setAttribute("checked", "checked");
    input.setAttribute("name", "t");
    div.appendChild(input);
    support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;
    div.innerHTML = "<textarea>x</textarea>";
    support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;
  })();
  var rkeyEvent = /^key/,
    rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
    rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
  function returnTrue() {
    return true;
  }
  function returnFalse() {
    return false;
  }
  function safeActiveElement() {
    try {
      return document.activeElement;
    } catch (err) {}
  }
  function on(elem, types, selector, data, fn, one) {
    var origFn, type;
    if (typeof types === "object") {
      if (typeof selector !== "string") {
        data = data || selector;
        selector = undefined;
      }
      for (type in types) {
        on(elem, type, selector, data, types[type], one);
      }
      return elem;
    }
    if (data == null && fn == null) {
      fn = selector;
      data = selector = undefined;
    } else if (fn == null) {
      if (typeof selector === "string") {
        fn = data;
        data = undefined;
      } else {
        fn = data;
        data = selector;
        selector = undefined;
      }
    }
    if (fn === false) {
      fn = returnFalse;
    } else if (!fn) {
      return elem;
    }
    if (one === 1) {
      origFn = fn;
      fn = function (event) {
        Flits().off(event);
        return origFn.apply(this, arguments);
      };
      fn.guid = origFn.guid || (origFn.guid = Flits.guid++);
    }
    return elem.each(function () {
      Flits.event.add(this, types, fn, data, selector);
    });
  }
  Flits.event = {
    global: {},
    add: function (elem, types, handler, data, selector) {
      var handleObjIn,
        eventHandle,
        tmp,
        events,
        t,
        handleObj,
        special,
        handlers,
        type,
        namespaces,
        origType,
        elemData = dataPriv.get(elem);
      if (!elemData) {
        return;
      }
      if (handler.handler) {
        handleObjIn = handler;
        handler = handleObjIn.handler;
        selector = handleObjIn.selector;
      }
      if (!handler.guid) {
        handler.guid = Flits.guid++;
      }
      if (!(events = elemData.events)) {
        events = elemData.events = {};
      }
      if (!(eventHandle = elemData.handle)) {
        eventHandle = elemData.handle = function (e) {
          return typeof Flits !== "undefined" &&
            Flits.event.triggered !== e.type
            ? Flits.event.dispatch.apply(elem, arguments)
            : undefined;
        };
      }
      types = (types || "").match(rnotwhite) || [""];
      t = types.length;
      while (t--) {
        tmp = rtypenamespace.exec(types[t]) || [];
        type = origType = tmp[1];
        namespaces = (tmp[2] || "").split(".").sort();
        if (!type) {
          continue;
        }
        special = Flits.event.special[type] || {};
        type = (selector ? special.delegateType : special.bindType) || type;
        special = Flits.event.special[type] || {};
        handleObj = Flits.extend(
          {
            type: type,
            origType: origType,
            data: data,
            handler: handler,
            guid: handler.guid,
            selector: selector,
            needsContext:
              selector && Flits.expr.match.needsContext.test(selector),
            namespace: namespaces.join("."),
          },
          handleObjIn
        );
        if (!(handlers = events[type])) {
          handlers = events[type] = [];
          handlers.delegateCount = 0;
          if (
            !special.setup ||
            special.setup.call(elem, data, namespaces, eventHandle) === false
          ) {
            if (elem.addEventListener) {
              elem.addEventListener(type, eventHandle);
            }
          }
        }
        if (special.add) {
          special.add.call(elem, handleObj);
          if (!handleObj.handler.guid) {
            handleObj.handler.guid = handler.guid;
          }
        }
        if (selector) {
          handlers.splice(handlers.delegateCount++, 0, handleObj);
        } else {
          handlers.push(handleObj);
        }
        Flits.event.global[type] = true;
      }
    },
    remove: function (elem, types, handler, selector, mappedTypes) {
      var j,
        origCount,
        tmp,
        events,
        t,
        handleObj,
        special,
        handlers,
        type,
        namespaces,
        origType,
        elemData = dataPriv.hasData(elem) && dataPriv.get(elem);
      if (!elemData || !(events = elemData.events)) {
        return;
      }
      types = (types || "").match(rnotwhite) || [""];
      t = types.length;
      while (t--) {
        tmp = rtypenamespace.exec(types[t]) || [];
        type = origType = tmp[1];
        namespaces = (tmp[2] || "").split(".").sort();
        if (!type) {
          for (type in events) {
            Flits.event.remove(elem, type + types[t], handler, selector, true);
          }
          continue;
        }
        special = Flits.event.special[type] || {};
        type = (selector ? special.delegateType : special.bindType) || type;
        handlers = events[type] || [];
        tmp =
          tmp[2] &&
          new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");
        origCount = j = handlers.length;
        while (j--) {
          handleObj = handlers[j];
          if (
            (mappedTypes || origType === handleObj.origType) &&
            (!handler || handler.guid === handleObj.guid) &&
            (!tmp || tmp.test(handleObj.namespace)) &&
            (!selector ||
              selector === handleObj.selector ||
              (selector === "**" && handleObj.selector))
          ) {
            handlers.splice(j, 1);
            if (handleObj.selector) {
              handlers.delegateCount--;
            }
            if (special.remove) {
              special.remove.call(elem, handleObj);
            }
          }
        }
        if (origCount && !handlers.length) {
          if (
            !special.teardown ||
            special.teardown.call(elem, namespaces, elemData.handle) === false
          ) {
            Flits.removeEvent(elem, type, elemData.handle);
          }
          delete events[type];
        }
      }
      if (Flits.isEmptyObject(events)) {
        dataPriv.remove(elem, "handle events");
      }
    },
    dispatch: function (event) {
      event = Flits.event.fix(event);
      var i,
        j,
        ret,
        matched,
        handleObj,
        handlerQueue = [],
        args = slice.call(arguments),
        handlers = (dataPriv.get(this, "events") || {})[event.type] || [],
        special = Flits.event.special[event.type] || {};
      args[0] = event;
      event.delegateTarget = this;
      if (
        special.preDispatch &&
        special.preDispatch.call(this, event) === false
      ) {
        return;
      }
      handlerQueue = Flits.event.handlers.call(this, event, handlers);
      i = 0;
      while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
        event.currentTarget = matched.elem;
        j = 0;
        while (
          (handleObj = matched.handlers[j++]) &&
          !event.isImmediatePropagationStopped()
        ) {
          if (!event.rnamespace || event.rnamespace.test(handleObj.namespace)) {
            event.handleObj = handleObj;
            event.data = handleObj.data;
            ret = (
              (Flits.event.special[handleObj.origType] || {}).handle ||
              handleObj.handler
            ).apply(matched.elem, args);
            if (ret !== undefined) {
              if ((event.result = ret) === false) {
                event.preventDefault();
                event.stopPropagation();
              }
            }
          }
        }
      }
      if (special.postDispatch) {
        special.postDispatch.call(this, event);
      }
      return event.result;
    },
    handlers: function (event, handlers) {
      var i,
        matches,
        sel,
        handleObj,
        handlerQueue = [],
        delegateCount = handlers.delegateCount,
        cur = event.target;
      if (
        delegateCount &&
        cur.nodeType &&
        (event.type !== "click" || isNaN(event.button) || event.button < 1)
      ) {
        for (; cur !== this; cur = cur.parentNode || this) {
          if (
            cur.nodeType === 1 &&
            (cur.disabled !== true || event.type !== "click")
          ) {
            matches = [];
            for (i = 0; i < delegateCount; i++) {
              handleObj = handlers[i];
              sel = handleObj.selector + " ";
              if (matches[sel] === undefined) {
                matches[sel] = handleObj.needsContext
                  ? Flits(sel, this).index(cur) > -1
                  : Flits.find(sel, this, null, [cur]).length;
              }
              if (matches[sel]) {
                matches.push(handleObj);
              }
            }
            if (matches.length) {
              handlerQueue.push({ elem: cur, handlers: matches });
            }
          }
        }
      }
      if (delegateCount < handlers.length) {
        handlerQueue.push({
          elem: this,
          handlers: handlers.slice(delegateCount),
        });
      }
      return handlerQueue;
    },
    props: (
      "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase " +
      "metaKey relatedTarget shiftKey target timeStamp view which"
    ).split(" "),
    fixHooks: {},
    keyHooks: {
      props: "char charCode key keyCode".split(" "),
      filter: function (event, original) {
        if (event.which == null) {
          event.which =
            original.charCode != null ? original.charCode : original.keyCode;
        }
        return event;
      },
    },
    mouseHooks: {
      props: (
        "button buttons clientX clientY offsetX offsetY pageX pageY " +
        "screenX screenY toElement"
      ).split(" "),
      filter: function (event, original) {
        var eventDoc,
          doc,
          body,
          button = original.button;
        if (event.pageX == null && original.clientX != null) {
          eventDoc = event.target.ownerDocument || document;
          doc = eventDoc.documentElement;
          body = eventDoc.body;
          event.pageX =
            original.clientX +
            ((doc && doc.scrollLeft) || (body && body.scrollLeft) || 0) -
            ((doc && doc.clientLeft) || (body && body.clientLeft) || 0);
          event.pageY =
            original.clientY +
            ((doc && doc.scrollTop) || (body && body.scrollTop) || 0) -
            ((doc && doc.clientTop) || (body && body.clientTop) || 0);
        }
        if (!event.which && button !== undefined) {
          event.which = button & 1 ? 1 : button & 2 ? 3 : button & 4 ? 2 : 0;
        }
        return event;
      },
    },
    fix: function (event) {
      if (event[Flits.expando]) {
        return event;
      }
      var i,
        prop,
        copy,
        type = event.type,
        originalEvent = event,
        fixHook = this.fixHooks[type];
      if (!fixHook) {
        this.fixHooks[type] = fixHook = rmouseEvent.test(type)
          ? this.mouseHooks
          : rkeyEvent.test(type)
          ? this.keyHooks
          : {};
      }
      copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;
      event = new Flits.Event(originalEvent);
      i = copy.length;
      while (i--) {
        prop = copy[i];
        event[prop] = originalEvent[prop];
      }
      if (!event.target) {
        event.target = document;
      }
      if (event.target.nodeType === 3) {
        event.target = event.target.parentNode;
      }
      return fixHook.filter ? fixHook.filter(event, originalEvent) : event;
    },
    special: {
      load: { noBubble: true },
      focus: {
        trigger: function () {
          if (this !== safeActiveElement() && this.focus) {
            this.focus();
            return false;
          }
        },
        delegateType: "focusin",
      },
      blur: {
        trigger: function () {
          if (this === safeActiveElement() && this.blur) {
            this.blur();
            return false;
          }
        },
        delegateType: "focusout",
      },
      click: {
        trigger: function () {
          if (
            this.type === "checkbox" &&
            this.click &&
            Flits.nodeName(this, "input")
          ) {
            this.click();
            return false;
          }
        },
        _default: function (event) {
          return Flits.nodeName(event.target, "a");
        },
      },
      beforeunload: {
        postDispatch: function (event) {
          if (event.result !== undefined && event.originalEvent) {
            event.originalEvent.returnValue = event.result;
          }
        },
      },
    },
  };
  Flits.removeEvent = function (elem, type, handle) {
    if (elem.removeEventListener) {
      elem.removeEventListener(type, handle);
    }
  };
  Flits.Event = function (src, props) {
    if (!(this instanceof Flits.Event)) {
      return new Flits.Event(src, props);
    }
    if (src && src.type) {
      this.originalEvent = src;
      this.type = src.type;
      this.isDefaultPrevented =
        src.defaultPrevented ||
        (src.defaultPrevented === undefined && src.returnValue === false)
          ? returnTrue
          : returnFalse;
    } else {
      this.type = src;
    }
    if (props) {
      Flits.extend(this, props);
    }
    this.timeStamp = (src && src.timeStamp) || Flits.now();
    this[Flits.expando] = true;
  };
  Flits.Event.prototype = {
    constructor: Flits.Event,
    isDefaultPrevented: returnFalse,
    isPropagationStopped: returnFalse,
    isImmediatePropagationStopped: returnFalse,
    isSimulated: false,
    preventDefault: function () {
      var e = this.originalEvent;
      this.isDefaultPrevented = returnTrue;
      if (e && !this.isSimulated) {
        e.preventDefault();
      }
    },
    stopPropagation: function () {
      var e = this.originalEvent;
      this.isPropagationStopped = returnTrue;
      if (e && !this.isSimulated) {
        e.stopPropagation();
      }
    },
    stopImmediatePropagation: function () {
      var e = this.originalEvent;
      this.isImmediatePropagationStopped = returnTrue;
      if (e && !this.isSimulated) {
        e.stopImmediatePropagation();
      }
      this.stopPropagation();
    },
  };
  Flits.each(
    {
      mouseenter: "mouseover",
      mouseleave: "mouseout",
      pointerenter: "pointerover",
      pointerleave: "pointerout",
    },
    function (orig, fix) {
      Flits.event.special[orig] = {
        delegateType: fix,
        bindType: fix,
        handle: function (event) {
          var ret,
            target = this,
            related = event.relatedTarget,
            handleObj = event.handleObj;
          if (
            !related ||
            (related !== target && !Flits.contains(target, related))
          ) {
            event.type = handleObj.origType;
            ret = handleObj.handler.apply(this, arguments);
            event.type = fix;
          }
          return ret;
        },
      };
    }
  );
  Flits.fn.extend({
    on: function (types, selector, data, fn) {
      return on(this, types, selector, data, fn);
    },
    one: function (types, selector, data, fn) {
      return on(this, types, selector, data, fn, 1);
    },
    off: function (types, selector, fn) {
      var handleObj, type;
      if (types && types.preventDefault && types.handleObj) {
        handleObj = types.handleObj;
        Flits(types.delegateTarget).off(
          handleObj.namespace
            ? handleObj.origType + "." + handleObj.namespace
            : handleObj.origType,
          handleObj.selector,
          handleObj.handler
        );
        return this;
      }
      if (typeof types === "object") {
        for (type in types) {
          this.off(type, selector, types[type]);
        }
        return this;
      }
      if (selector === false || typeof selector === "function") {
        fn = selector;
        selector = undefined;
      }
      if (fn === false) {
        fn = returnFalse;
      }
      return this.each(function () {
        Flits.event.remove(this, types, fn, selector);
      });
    },
  });
  var rxhtmlTag =
      /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,
    rnoInnerhtml = /<script|<style|<link/i,
    rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
    rscriptTypeMasked = /^true\/(.*)/,
    rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
  function manipulationTarget(elem, content) {
    return Flits.nodeName(elem, "table") &&
      Flits.nodeName(
        content.nodeType !== 11 ? content : content.firstChild,
        "tr"
      )
      ? elem.getElementsByTagName("tbody")[0] ||
          elem.appendChild(elem.ownerDocument.createElement("tbody"))
      : elem;
  }
  function disableScript(elem) {
    elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
    return elem;
  }
  function restoreScript(elem) {
    var match = rscriptTypeMasked.exec(elem.type);
    if (match) {
      elem.type = match[1];
    } else {
      elem.removeAttribute("type");
    }
    return elem;
  }
  function cloneCopyEvent(src, dest) {
    var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;
    if (dest.nodeType !== 1) {
      return;
    }
    if (dataPriv.hasData(src)) {
      pdataOld = dataPriv.access(src);
      pdataCur = dataPriv.set(dest, pdataOld);
      events = pdataOld.events;
      if (events) {
        delete pdataCur.handle;
        pdataCur.events = {};
        for (type in events) {
          for (i = 0, l = events[type].length; i < l; i++) {
            Flits.event.add(dest, type, events[type][i]);
          }
        }
      }
    }
    if (dataUser.hasData(src)) {
      udataOld = dataUser.access(src);
      udataCur = Flits.extend({}, udataOld);
      dataUser.set(dest, udataCur);
    }
  }
  function fixInput(src, dest) {
    var nodeName = dest.nodeName.toLowerCase();
    if (nodeName === "input" && rcheckableType.test(src.type)) {
      dest.checked = src.checked;
    } else if (nodeName === "input" || nodeName === "textarea") {
      dest.defaultValue = src.defaultValue;
    }
  }
  function domManip(collection, args, callback, ignored) {
    args = concat.apply([], args);
    var fragment,
      first,
      scripts,
      hasScripts,
      node,
      doc,
      i = 0,
      l = collection.length,
      iNoClone = l - 1,
      value = args[0],
      isFunction = Flits.isFunction(value);
    if (
      isFunction ||
      (l > 1 &&
        typeof value === "string" &&
        !support.checkClone &&
        rchecked.test(value))
    ) {
      return collection.each(function (index) {
        var self = collection.eq(index);
        if (isFunction) {
          args[0] = value.call(this, index, self.html());
        }
        domManip(self, args, callback, ignored);
      });
    }
    if (l) {
      fragment = buildFragment(
        args,
        collection[0].ownerDocument,
        false,
        collection,
        ignored
      );
      first = fragment.firstChild;
      if (fragment.childNodes.length === 1) {
        fragment = first;
      }
      if (first || ignored) {
        scripts = Flits.map(getAll(fragment, "script"), disableScript);
        hasScripts = scripts.length;
        for (; i < l; i++) {
          node = fragment;
          if (i !== iNoClone) {
            node = Flits.clone(node, true, true);
            if (hasScripts) {
              Flits.merge(scripts, getAll(node, "script"));
            }
          }
          callback.call(collection[i], node, i);
        }
        if (hasScripts) {
          doc = scripts[scripts.length - 1].ownerDocument;
          Flits.map(scripts, restoreScript);
          for (i = 0; i < hasScripts; i++) {
            node = scripts[i];
            if (
              rscriptType.test(node.type || "") &&
              !dataPriv.access(node, "globalEval") &&
              Flits.contains(doc, node)
            ) {
              if (node.src) {
                if (Flits._evalUrl) {
                  Flits._evalUrl(node.src);
                }
              } else {
                Flits.globalEval(node.textContent.replace(rcleanScript, ""));
              }
            }
          }
        }
      }
    }
    return collection;
  }
  function remove(elem, selector, keepData) {
    var node,
      nodes = selector ? Flits.filter(selector, elem) : elem,
      i = 0;
    for (; (node = nodes[i]) != null; i++) {
      if (!keepData && node.nodeType === 1) {
        Flits.cleanData(getAll(node));
      }
      if (node.parentNode) {
        if (keepData && Flits.contains(node.ownerDocument, node)) {
          setGlobalEval(getAll(node, "script"));
        }
        node.parentNode.removeChild(node);
      }
    }
    return elem;
  }
  Flits.extend({
    htmlPrefilter: function (html) {
      return html.replace(rxhtmlTag, "<$1></$2>");
    },
    clone: function (elem, dataAndEvents, deepDataAndEvents) {
      var i,
        l,
        srcElements,
        destElements,
        clone = elem.cloneNode(true),
        inPage = Flits.contains(elem.ownerDocument, elem);
      if (
        !support.noCloneChecked &&
        (elem.nodeType === 1 || elem.nodeType === 11) &&
        !Flits.isXMLDoc(elem)
      ) {
        destElements = getAll(clone);
        srcElements = getAll(elem);
        for (i = 0, l = srcElements.length; i < l; i++) {
          fixInput(srcElements[i], destElements[i]);
        }
      }
      if (dataAndEvents) {
        if (deepDataAndEvents) {
          srcElements = srcElements || getAll(elem);
          destElements = destElements || getAll(clone);
          for (i = 0, l = srcElements.length; i < l; i++) {
            cloneCopyEvent(srcElements[i], destElements[i]);
          }
        } else {
          cloneCopyEvent(elem, clone);
        }
      }
      destElements = getAll(clone, "script");
      if (destElements.length > 0) {
        setGlobalEval(destElements, !inPage && getAll(elem, "script"));
      }
      return clone;
    },
    cleanData: function (elems) {
      var data,
        elem,
        type,
        special = Flits.event.special,
        i = 0;
      for (; (elem = elems[i]) !== undefined; i++) {
        if (acceptData(elem)) {
          if ((data = elem[dataPriv.expando])) {
            if (data.events) {
              for (type in data.events) {
                if (special[type]) {
                  Flits.event.remove(elem, type);
                } else {
                  Flits.removeEvent(elem, type, data.handle);
                }
              }
            }
            elem[dataPriv.expando] = undefined;
          }
          if (elem[dataUser.expando]) {
            elem[dataUser.expando] = undefined;
          }
        }
      }
    },
  });
  Flits.fn.extend({
    domManip: domManip,
    detach: function (selector) {
      return remove(this, selector, true);
    },
    remove: function (selector) {
      return remove(this, selector);
    },
    text: function (value) {
      return access(
        this,
        function (value) {
          return value === undefined
            ? Flits.text(this)
            : this.empty().each(function () {
                if (
                  this.nodeType === 1 ||
                  this.nodeType === 11 ||
                  this.nodeType === 9
                ) {
                  this.textContent = value;
                }
              });
        },
        null,
        value,
        arguments.length
      );
    },
    append: function () {
      return domManip(this, arguments, function (elem) {
        if (
          this.nodeType === 1 ||
          this.nodeType === 11 ||
          this.nodeType === 9
        ) {
          var target = manipulationTarget(this, elem);
          target.appendChild(elem);
        }
      });
    },
    prepend: function () {
      return domManip(this, arguments, function (elem) {
        if (
          this.nodeType === 1 ||
          this.nodeType === 11 ||
          this.nodeType === 9
        ) {
          var target = manipulationTarget(this, elem);
          target.insertBefore(elem, target.firstChild);
        }
      });
    },
    before: function () {
      return domManip(this, arguments, function (elem) {
        if (this.parentNode) {
          this.parentNode.insertBefore(elem, this);
        }
      });
    },
    after: function () {
      return domManip(this, arguments, function (elem) {
        if (this.parentNode) {
          this.parentNode.insertBefore(elem, this.nextSibling);
        }
      });
    },
    empty: function () {
      var elem,
        i = 0;
      for (; (elem = this[i]) != null; i++) {
        if (elem.nodeType === 1) {
          Flits.cleanData(getAll(elem, false));
          elem.textContent = "";
        }
      }
      return this;
    },
    clone: function (dataAndEvents, deepDataAndEvents) {
      dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
      deepDataAndEvents =
        deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
      return this.map(function () {
        return Flits.clone(this, dataAndEvents, deepDataAndEvents);
      });
    },
    html: function (value) {
      return access(
        this,
        function (value) {
          var elem = this[0] || {},
            i = 0,
            l = this.length;
          if (value === undefined && elem.nodeType === 1) {
            return elem.innerHTML;
          }
          if (
            typeof value === "string" &&
            !rnoInnerhtml.test(value) &&
            !wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()]
          ) {
            value = Flits.htmlPrefilter(value);
            try {
              for (; i < l; i++) {
                elem = this[i] || {};
                if (elem.nodeType === 1) {
                  Flits.cleanData(getAll(elem, false));
                  elem.innerHTML = value;
                }
              }
              elem = 0;
            } catch (e) {}
          }
          if (elem) {
            this.empty().append(value);
          }
        },
        null,
        value,
        arguments.length
      );
    },
    replaceWith: function () {
      var ignored = [];
      return domManip(
        this,
        arguments,
        function (elem) {
          var parent = this.parentNode;
          if (Flits.inArray(this, ignored) < 0) {
            Flits.cleanData(getAll(this));
            if (parent) {
              parent.replaceChild(elem, this);
            }
          }
        },
        ignored
      );
    },
  });
  Flits.each(
    {
      appendTo: "append",
      prependTo: "prepend",
      insertBefore: "before",
      insertAfter: "after",
      replaceAll: "replaceWith",
    },
    function (name, original) {
      Flits.fn[name] = function (selector) {
        var elems,
          ret = [],
          insert = Flits(selector),
          last = insert.length - 1,
          i = 0;
        for (; i <= last; i++) {
          elems = i === last ? this : this.clone(true);
          Flits(insert[i])[original](elems);
          push.apply(ret, elems.get());
        }
        return this.pushStack(ret);
      };
    }
  );
  var iframe,
    elemdisplay = { HTML: "block", BODY: "block" };
  function actualDisplay(name, doc) {
    var elem = Flits(doc.createElement(name)).appendTo(doc.body),
      display = Flits.css(elem[0], "display");
    elem.detach();
    return display;
  }
  function defaultDisplay(nodeName) {
    var doc = document,
      display = elemdisplay[nodeName];
    if (!display) {
      display = actualDisplay(nodeName, doc);
      if (display === "none" || !display) {
        iframe = (
          iframe || Flits("<iframe frameborder='0' width='0' height='0'/>")
        ).appendTo(doc.documentElement);
        doc = iframe[0].contentDocument;
        doc.write();
        doc.close();
        display = actualDisplay(nodeName, doc);
        iframe.detach();
      }
      elemdisplay[nodeName] = display;
    }
    return display;
  }
  var rmargin = /^margin/;
  var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");
  var getStyles = function (elem) {
    var view = elem.ownerDocument.defaultView;
    if (!view || !view.opener) {
      view = window;
    }
    return view.getComputedStyle(elem);
  };
  var swap = function (elem, options, callback, args) {
    var ret,
      name,
      old = {};
    for (name in options) {
      old[name] = elem.style[name];
      elem.style[name] = options[name];
    }
    ret = callback.apply(elem, args || []);
    for (name in options) {
      elem.style[name] = old[name];
    }
    return ret;
  };
  var documentElement = document.documentElement;
  (function () {
    var pixelPositionVal,
      boxSizingReliableVal,
      pixelMarginRightVal,
      reliableMarginLeftVal,
      container = document.createElement("div"),
      div = document.createElement("div");
    if (!div.style) {
      return;
    }
    div.style.backgroundClip = "content-box";
    div.cloneNode(true).style.backgroundClip = "";
    support.clearCloneStyle = div.style.backgroundClip === "content-box";
    container.style.cssText =
      "border:0;width:8px;height:0;top:0;left:-9999px;" +
      "padding:0;margin-top:1px;position:absolute";
    container.appendChild(div);
    function computeStyleTests() {
      div.style.cssText =
        "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;" +
        "position:relative;display:block;" +
        "margin:auto;border:1px;padding:1px;" +
        "top:1%;width:50%";
      div.innerHTML = "";
      documentElement.appendChild(container);
      var divStyle = window.getComputedStyle(div);
      pixelPositionVal = divStyle.top !== "1%";
      reliableMarginLeftVal = divStyle.marginLeft === "2px";
      boxSizingReliableVal = divStyle.width === "4px";
      div.style.marginRight = "50%";
      pixelMarginRightVal = divStyle.marginRight === "4px";
      documentElement.removeChild(container);
    }
    Flits.extend(support, {
      pixelPosition: function () {
        computeStyleTests();
        return pixelPositionVal;
      },
      boxSizingReliable: function () {
        if (boxSizingReliableVal == null) {
          computeStyleTests();
        }
        return boxSizingReliableVal;
      },
      pixelMarginRight: function () {
        if (boxSizingReliableVal == null) {
          computeStyleTests();
        }
        return pixelMarginRightVal;
      },
      reliableMarginLeft: function () {
        if (boxSizingReliableVal == null) {
          computeStyleTests();
        }
        return reliableMarginLeftVal;
      },
      reliableMarginRight: function () {
        var ret,
          marginDiv = div.appendChild(document.createElement("div"));
        marginDiv.style.cssText = div.style.cssText =
          "-webkit-box-sizing:content-box;box-sizing:content-box;" +
          "display:block;margin:0;border:0;padding:0";
        marginDiv.style.marginRight = marginDiv.style.width = "0";
        div.style.width = "1px";
        documentElement.appendChild(container);
        ret = !parseFloat(window.getComputedStyle(marginDiv).marginRight);
        documentElement.removeChild(container);
        div.removeChild(marginDiv);
        return ret;
      },
    });
  })();
  function curCSS(elem, name, computed) {
    var width,
      minWidth,
      maxWidth,
      ret,
      style = elem.style;
    computed = computed || getStyles(elem);
    ret = computed
      ? computed.getPropertyValue(name) || computed[name]
      : undefined;
    if (
      (ret === "" || ret === undefined) &&
      !Flits.contains(elem.ownerDocument, elem)
    ) {
      ret = Flits.style(elem, name);
    }
    if (computed) {
      if (
        !support.pixelMarginRight() &&
        rnumnonpx.test(ret) &&
        rmargin.test(name)
      ) {
        width = style.width;
        minWidth = style.minWidth;
        maxWidth = style.maxWidth;
        style.minWidth = style.maxWidth = style.width = ret;
        ret = computed.width;
        style.width = width;
        style.minWidth = minWidth;
        style.maxWidth = maxWidth;
      }
    }
    return ret !== undefined ? ret + "" : ret;
  }
  function addGetHookIf(conditionFn, hookFn) {
    return {
      get: function () {
        if (conditionFn()) {
          delete this.get;
          return;
        }
        return (this.get = hookFn).apply(this, arguments);
      },
    };
  }
  var rdisplayswap = /^(none|table(?!-c[ea]).+)/,
    cssShow = { position: "absolute", visibility: "hidden", display: "block" },
    cssNormalTransform = { letterSpacing: "0", fontWeight: "400" },
    cssPrefixes = ["Webkit", "O", "Moz", "ms"],
    emptyStyle = document.createElement("div").style;
  function vendorPropName(name) {
    if (name in emptyStyle) {
      return name;
    }
    var capName = name[0].toUpperCase() + name.slice(1),
      i = cssPrefixes.length;
    while (i--) {
      name = cssPrefixes[i] + capName;
      if (name in emptyStyle) {
        return name;
      }
    }
  }
  function setPositiveNumber(elem, value, subtract) {
    var matches = rcssNum.exec(value);
    return matches
      ? Math.max(0, matches[2] - (subtract || 0)) + (matches[3] || "px")
      : value;
  }
  function augmentWidthOrHeight(elem, name, extra, isBorderBox, styles) {
    var i =
        extra === (isBorderBox ? "border" : "content")
          ? 4
          : name === "width"
          ? 1
          : 0,
      val = 0;
    for (; i < 4; i += 2) {
      if (extra === "margin") {
        val += Flits.css(elem, extra + cssExpand[i], true, styles);
      }
      if (isBorderBox) {
        if (extra === "content") {
          val -= Flits.css(elem, "padding" + cssExpand[i], true, styles);
        }
        if (extra !== "margin") {
          val -= Flits.css(
            elem,
            "border" + cssExpand[i] + "Width",
            true,
            styles
          );
        }
      } else {
        val += Flits.css(elem, "padding" + cssExpand[i], true, styles);
        if (extra !== "padding") {
          val += Flits.css(
            elem,
            "border" + cssExpand[i] + "Width",
            true,
            styles
          );
        }
      }
    }
    return val;
  }
  function getWidthOrHeight(elem, name, extra) {
    var valueIsBorderBox = true,
      val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
      styles = getStyles(elem),
      isBorderBox =
        Flits.css(elem, "boxSizing", false, styles) === "border-box";
    if (val <= 0 || val == null) {
      val = curCSS(elem, name, styles);
      if (val < 0 || val == null) {
        val = elem.style[name];
      }
      if (rnumnonpx.test(val)) {
        return val;
      }
      valueIsBorderBox =
        isBorderBox &&
        (support.boxSizingReliable() || val === elem.style[name]);
      val = parseFloat(val) || 0;
    }
    return (
      val +
      augmentWidthOrHeight(
        elem,
        name,
        extra || (isBorderBox ? "border" : "content"),
        valueIsBorderBox,
        styles
      ) +
      "px"
    );
  }
  function showHide(elements, show) {
    var display,
      elem,
      hidden,
      values = [],
      index = 0,
      length = elements.length;
    for (; index < length; index++) {
      elem = elements[index];
      if (!elem.style) {
        continue;
      }
      values[index] = dataPriv.get(elem, "olddisplay");
      display = elem.style.display;
      if (show) {
        if (!values[index] && display === "none") {
          elem.style.display = "";
        }
        if (elem.style.display === "" && isHidden(elem)) {
          values[index] = dataPriv.access(
            elem,
            "olddisplay",
            defaultDisplay(elem.nodeName)
          );
        }
      } else {
        hidden = isHidden(elem);
        if (display !== "none" || !hidden) {
          dataPriv.set(
            elem,
            "olddisplay",
            hidden ? display : Flits.css(elem, "display")
          );
        }
      }
    }
    for (index = 0; index < length; index++) {
      elem = elements[index];
      if (!elem.style) {
        continue;
      }
      if (!show || elem.style.display === "none" || elem.style.display === "") {
        elem.style.display = show ? values[index] || "" : "none";
      }
    }
    return elements;
  }
  Flits.extend({
    cssHooks: {
      opacity: {
        get: function (elem, computed) {
          if (computed) {
            var ret = curCSS(elem, "opacity");
            return ret === "" ? "1" : ret;
          }
        },
      },
    },
    cssNumber: {
      animationIterationCount: true,
      columnCount: true,
      fillOpacity: true,
      flexGrow: true,
      flexShrink: true,
      fontWeight: true,
      lineHeight: true,
      opacity: true,
      order: true,
      orphans: true,
      widows: true,
      zIndex: true,
      zoom: true,
    },
    cssProps: { float: "cssFloat" },
    style: function (elem, name, value, extra) {
      if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
        return;
      }
      var ret,
        type,
        hooks,
        origName = Flits.camelCase(name),
        style = elem.style;
      name =
        Flits.cssProps[origName] ||
        (Flits.cssProps[origName] = vendorPropName(origName) || origName);
      hooks = Flits.cssHooks[name] || Flits.cssHooks[origName];
      if (value !== undefined) {
        type = typeof value;
        if (type === "string" && (ret = rcssNum.exec(value)) && ret[1]) {
          value = adjustCSS(elem, name, ret);
          type = "number";
        }
        if (value == null || value !== value) {
          return;
        }
        if (type === "number") {
          value += (ret && ret[3]) || (Flits.cssNumber[origName] ? "" : "px");
        }
        if (
          !support.clearCloneStyle &&
          value === "" &&
          name.indexOf("background") === 0
        ) {
          style[name] = "inherit";
        }
        if (
          !hooks ||
          !("set" in hooks) ||
          (value = hooks.set(elem, value, extra)) !== undefined
        ) {
          style[name] = value;
        }
      } else {
        if (
          hooks &&
          "get" in hooks &&
          (ret = hooks.get(elem, false, extra)) !== undefined
        ) {
          return ret;
        }
        return style[name];
      }
    },
    css: function (elem, name, extra, styles) {
      var val,
        num,
        hooks,
        origName = Flits.camelCase(name);
      name =
        Flits.cssProps[origName] ||
        (Flits.cssProps[origName] = vendorPropName(origName) || origName);
      hooks = Flits.cssHooks[name] || Flits.cssHooks[origName];
      if (hooks && "get" in hooks) {
        val = hooks.get(elem, true, extra);
      }
      if (val === undefined) {
        val = curCSS(elem, name, styles);
      }
      if (val === "normal" && name in cssNormalTransform) {
        val = cssNormalTransform[name];
      }
      if (extra === "" || extra) {
        num = parseFloat(val);
        return extra === true || isFinite(num) ? num || 0 : val;
      }
      return val;
    },
  });
  Flits.each(["height", "width"], function (i, name) {
    Flits.cssHooks[name] = {
      get: function (elem, computed, extra) {
        if (computed) {
          return rdisplayswap.test(Flits.css(elem, "display")) &&
            elem.offsetWidth === 0
            ? swap(elem, cssShow, function () {
                return getWidthOrHeight(elem, name, extra);
              })
            : getWidthOrHeight(elem, name, extra);
        }
      },
      set: function (elem, value, extra) {
        var matches,
          styles = extra && getStyles(elem),
          subtract =
            extra &&
            augmentWidthOrHeight(
              elem,
              name,
              extra,
              Flits.css(elem, "boxSizing", false, styles) === "border-box",
              styles
            );
        if (
          subtract &&
          (matches = rcssNum.exec(value)) &&
          (matches[3] || "px") !== "px"
        ) {
          elem.style[name] = value;
          value = Flits.css(elem, name);
        }
        return setPositiveNumber(elem, value, subtract);
      },
    };
  });
  Flits.cssHooks.marginLeft = addGetHookIf(
    support.reliableMarginLeft,
    function (elem, computed) {
      if (computed) {
        return (
          (parseFloat(curCSS(elem, "marginLeft")) ||
            elem.getBoundingClientRect().left -
              swap(elem, { marginLeft: 0 }, function () {
                return elem.getBoundingClientRect().left;
              })) + "px"
        );
      }
    }
  );
  Flits.cssHooks.marginRight = addGetHookIf(
    support.reliableMarginRight,
    function (elem, computed) {
      if (computed) {
        return swap(elem, { display: "inline-block" }, curCSS, [
          elem,
          "marginRight",
        ]);
      }
    }
  );
  Flits.each(
    { margin: "", padding: "", border: "Width" },
    function (prefix, suffix) {
      Flits.cssHooks[prefix + suffix] = {
        expand: function (value) {
          var i = 0,
            expanded = {},
            parts = typeof value === "string" ? value.split(" ") : [value];
          for (; i < 4; i++) {
            expanded[prefix + cssExpand[i] + suffix] =
              parts[i] || parts[i - 2] || parts[0];
          }
          return expanded;
        },
      };
      if (!rmargin.test(prefix)) {
        Flits.cssHooks[prefix + suffix].set = setPositiveNumber;
      }
    }
  );
  Flits.fn.extend({
    css: function (name, value) {
      return access(
        this,
        function (elem, name, value) {
          var styles,
            len,
            map = {},
            i = 0;
          if (Flits.isArray(name)) {
            styles = getStyles(elem);
            len = name.length;
            for (; i < len; i++) {
              map[name[i]] = Flits.css(elem, name[i], false, styles);
            }
            return map;
          }
          return value !== undefined
            ? Flits.style(elem, name, value)
            : Flits.css(elem, name);
        },
        name,
        value,
        arguments.length > 1
      );
    },
    show: function () {
      return showHide(this, true);
    },
    hide: function () {
      return showHide(this);
    },
    toggle: function (state) {
      if (typeof state === "boolean") {
        return state ? this.show() : this.hide();
      }
      return this.each(function () {
        if (isHidden(this)) {
          Flits(this).show();
        } else {
          Flits(this).hide();
        }
      });
    },
  });
  function Tween(elem, options, prop, end, easing) {
    return new Tween.prototype.init(elem, options, prop, end, easing);
  }
  Flits.Tween = Tween;
  Tween.prototype = {
    constructor: Tween,
    init: function (elem, options, prop, end, easing, unit) {
      this.elem = elem;
      this.prop = prop;
      this.easing = easing || Flits.easing._default;
      this.options = options;
      this.start = this.now = this.cur();
      this.end = end;
      this.unit = unit || (Flits.cssNumber[prop] ? "" : "px");
    },
    cur: function () {
      var hooks = Tween.propHooks[this.prop];
      return hooks && hooks.get
        ? hooks.get(this)
        : Tween.propHooks._default.get(this);
    },
    run: function (percent) {
      var eased,
        hooks = Tween.propHooks[this.prop];
      if (this.options.duration) {
        this.pos = eased = Flits.easing[this.easing](
          percent,
          this.options.duration * percent,
          0,
          1,
          this.options.duration
        );
      } else {
        this.pos = eased = percent;
      }
      this.now = (this.end - this.start) * eased + this.start;
      if (this.options.step) {
        this.options.step.call(this.elem, this.now, this);
      }
      if (hooks && hooks.set) {
        hooks.set(this);
      } else {
        Tween.propHooks._default.set(this);
      }
      return this;
    },
  };
  Tween.prototype.init.prototype = Tween.prototype;
  Tween.propHooks = {
    _default: {
      get: function (tween) {
        var result;
        if (
          tween.elem.nodeType !== 1 ||
          (tween.elem[tween.prop] != null &&
            tween.elem.style[tween.prop] == null)
        ) {
          return tween.elem[tween.prop];
        }
        result = Flits.css(tween.elem, tween.prop, "");
        return !result || result === "auto" ? 0 : result;
      },
      set: function (tween) {
        if (Flits.fx.step[tween.prop]) {
          Flits.fx.step[tween.prop](tween);
        } else if (
          tween.elem.nodeType === 1 &&
          (tween.elem.style[Flits.cssProps[tween.prop]] != null ||
            Flits.cssHooks[tween.prop])
        ) {
          Flits.style(tween.elem, tween.prop, tween.now + tween.unit);
        } else {
          tween.elem[tween.prop] = tween.now;
        }
      },
    },
  };
  Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
    set: function (tween) {
      if (tween.elem.nodeType && tween.elem.parentNode) {
        tween.elem[tween.prop] = tween.now;
      }
    },
  };
  Flits.easing = {
    linear: function (p) {
      return p;
    },
    swing: function (p) {
      return 0.5 - Math.cos(p * Math.PI) / 2;
    },
    _default: "swing",
  };
  Flits.fx = Tween.prototype.init;
  Flits.fx.step = {};
  var fxNow,
    timerId,
    rfxtypes = /^(?:toggle|show|hide)$/,
    rrun = /queueHooks$/;
  function createFxNow() {
    window.setTimeout(function () {
      fxNow = undefined;
    });
    return (fxNow = Flits.now());
  }
  function genFx(type, includeWidth) {
    var which,
      i = 0,
      attrs = { height: type };
    includeWidth = includeWidth ? 1 : 0;
    for (; i < 4; i += 2 - includeWidth) {
      which = cssExpand[i];
      attrs["margin" + which] = attrs["padding" + which] = type;
    }
    if (includeWidth) {
      attrs.opacity = attrs.width = type;
    }
    return attrs;
  }
  function createTween(value, prop, animation) {
    var tween,
      collection = (Animation.tweeners[prop] || []).concat(
        Animation.tweeners["*"]
      ),
      index = 0,
      length = collection.length;
    for (; index < length; index++) {
      if ((tween = collection[index].call(animation, prop, value))) {
        return tween;
      }
    }
  }
  function defaultPrefilter(elem, props, opts) {
    var prop,
      value,
      toggle,
      tween,
      hooks,
      oldfire,
      display,
      checkDisplay,
      anim = this,
      orig = {},
      style = elem.style,
      hidden = elem.nodeType && isHidden(elem),
      dataShow = dataPriv.get(elem, "fxshow");
    if (!opts.queue) {
      hooks = Flits._queueHooks(elem, "fx");
      if (hooks.unqueued == null) {
        hooks.unqueued = 0;
        oldfire = hooks.empty.fire;
        hooks.empty.fire = function () {
          if (!hooks.unqueued) {
            oldfire();
          }
        };
      }
      hooks.unqueued++;
      anim.always(function () {
        anim.always(function () {
          hooks.unqueued--;
          if (!Flits.queue(elem, "fx").length) {
            hooks.empty.fire();
          }
        });
      });
    }
    if (elem.nodeType === 1 && ("height" in props || "width" in props)) {
      opts.overflow = [style.overflow, style.overflowX, style.overflowY];
      display = Flits.css(elem, "display");
      checkDisplay =
        display === "none"
          ? dataPriv.get(elem, "olddisplay") || defaultDisplay(elem.nodeName)
          : display;
      if (checkDisplay === "inline" && Flits.css(elem, "float") === "none") {
        style.display = "inline-block";
      }
    }
    if (opts.overflow) {
      style.overflow = "hidden";
      anim.always(function () {
        style.overflow = opts.overflow[0];
        style.overflowX = opts.overflow[1];
        style.overflowY = opts.overflow[2];
      });
    }
    for (prop in props) {
      value = props[prop];
      if (rfxtypes.exec(value)) {
        delete props[prop];
        toggle = toggle || value === "toggle";
        if (value === (hidden ? "hide" : "show")) {
          if (value === "show" && dataShow && dataShow[prop] !== undefined) {
            hidden = true;
          } else {
            continue;
          }
        }
        orig[prop] = (dataShow && dataShow[prop]) || Flits.style(elem, prop);
      } else {
        display = undefined;
      }
    }
    if (!Flits.isEmptyObject(orig)) {
      if (dataShow) {
        if ("hidden" in dataShow) {
          hidden = dataShow.hidden;
        }
      } else {
        dataShow = dataPriv.access(elem, "fxshow", {});
      }
      if (toggle) {
        dataShow.hidden = !hidden;
      }
      if (hidden) {
        Flits(elem).show();
      } else {
        anim.done(function () {
          Flits(elem).hide();
        });
      }
      anim.done(function () {
        var prop;
        dataPriv.remove(elem, "fxshow");
        for (prop in orig) {
          Flits.style(elem, prop, orig[prop]);
        }
      });
      for (prop in orig) {
        tween = createTween(hidden ? dataShow[prop] : 0, prop, anim);
        if (!(prop in dataShow)) {
          dataShow[prop] = tween.start;
          if (hidden) {
            tween.end = tween.start;
            tween.start = prop === "width" || prop === "height" ? 1 : 0;
          }
        }
      }
    } else if (
      (display === "none" ? defaultDisplay(elem.nodeName) : display) ===
      "inline"
    ) {
      style.display = display;
    }
  }
  function propFilter(props, specialEasing) {
    var index, name, easing, value, hooks;
    for (index in props) {
      name = Flits.camelCase(index);
      easing = specialEasing[name];
      value = props[index];
      if (Flits.isArray(value)) {
        easing = value[1];
        value = props[index] = value[0];
      }
      if (index !== name) {
        props[name] = value;
        delete props[index];
      }
      hooks = Flits.cssHooks[name];
      if (hooks && "expand" in hooks) {
        value = hooks.expand(value);
        delete props[name];
        for (index in value) {
          if (!(index in props)) {
            props[index] = value[index];
            specialEasing[index] = easing;
          }
        }
      } else {
        specialEasing[name] = easing;
      }
    }
  }
  function Animation(elem, properties, options) {
    var result,
      stopped,
      index = 0,
      length = Animation.prefilters.length,
      deferred = Flits.Deferred().always(function () {
        delete tick.elem;
      }),
      tick = function () {
        if (stopped) {
          return false;
        }
        var currentTime = fxNow || createFxNow(),
          remaining = Math.max(
            0,
            animation.startTime + animation.duration - currentTime
          ),
          temp = remaining / animation.duration || 0,
          percent = 1 - temp,
          index = 0,
          length = animation.tweens.length;
        for (; index < length; index++) {
          animation.tweens[index].run(percent);
        }
        deferred.notifyWith(elem, [animation, percent, remaining]);
        if (percent < 1 && length) {
          return remaining;
        } else {
          deferred.resolveWith(elem, [animation]);
          return false;
        }
      },
      animation = deferred.promise({
        elem: elem,
        props: Flits.extend({}, properties),
        opts: Flits.extend(
          true,
          { specialEasing: {}, easing: Flits.easing._default },
          options
        ),
        originalProperties: properties,
        originalOptions: options,
        startTime: fxNow || createFxNow(),
        duration: options.duration,
        tweens: [],
        createTween: function (prop, end) {
          var tween = Flits.Tween(
            elem,
            animation.opts,
            prop,
            end,
            animation.opts.specialEasing[prop] || animation.opts.easing
          );
          animation.tweens.push(tween);
          return tween;
        },
        stop: function (gotoEnd) {
          var index = 0,
            length = gotoEnd ? animation.tweens.length : 0;
          if (stopped) {
            return this;
          }
          stopped = true;
          for (; index < length; index++) {
            animation.tweens[index].run(1);
          }
          if (gotoEnd) {
            deferred.notifyWith(elem, [animation, 1, 0]);
            deferred.resolveWith(elem, [animation, gotoEnd]);
          } else {
            deferred.rejectWith(elem, [animation, gotoEnd]);
          }
          return this;
        },
      }),
      props = animation.props;
    propFilter(props, animation.opts.specialEasing);
    for (; index < length; index++) {
      result = Animation.prefilters[index].call(
        animation,
        elem,
        props,
        animation.opts
      );
      if (result) {
        if (Flits.isFunction(result.stop)) {
          Flits._queueHooks(animation.elem, animation.opts.queue).stop =
            Flits.proxy(result.stop, result);
        }
        return result;
      }
    }
    Flits.map(props, createTween, animation);
    if (Flits.isFunction(animation.opts.start)) {
      animation.opts.start.call(elem, animation);
    }
    Flits.fx.timer(
      Flits.extend(tick, {
        elem: elem,
        anim: animation,
        queue: animation.opts.queue,
      })
    );
    return animation
      .progress(animation.opts.progress)
      .done(animation.opts.done, animation.opts.complete)
      .fail(animation.opts.fail)
      .always(animation.opts.always);
  }
  Flits.Animation = Flits.extend(Animation, {
    tweeners: {
      "*": [
        function (prop, value) {
          var tween = this.createTween(prop, value);
          adjustCSS(tween.elem, prop, rcssNum.exec(value), tween);
          return tween;
        },
      ],
    },
    tweener: function (props, callback) {
      if (Flits.isFunction(props)) {
        callback = props;
        props = ["*"];
      } else {
        props = props.match(rnotwhite);
      }
      var prop,
        index = 0,
        length = props.length;
      for (; index < length; index++) {
        prop = props[index];
        Animation.tweeners[prop] = Animation.tweeners[prop] || [];
        Animation.tweeners[prop].unshift(callback);
      }
    },
    prefilters: [defaultPrefilter],
    prefilter: function (callback, prepend) {
      if (prepend) {
        Animation.prefilters.unshift(callback);
      } else {
        Animation.prefilters.push(callback);
      }
    },
  });
  Flits.speed = function (speed, easing, fn) {
    var opt =
      speed && typeof speed === "object"
        ? Flits.extend({}, speed)
        : {
            complete:
              fn || (!fn && easing) || (Flits.isFunction(speed) && speed),
            duration: speed,
            easing:
              (fn && easing) || (easing && !Flits.isFunction(easing) && easing),
          };
    opt.duration = Flits.fx.off
      ? 0
      : typeof opt.duration === "number"
      ? opt.duration
      : opt.duration in Flits.fx.speeds
      ? Flits.fx.speeds[opt.duration]
      : Flits.fx.speeds._default;
    if (opt.queue == null || opt.queue === true) {
      opt.queue = "fx";
    }
    opt.old = opt.complete;
    opt.complete = function () {
      if (Flits.isFunction(opt.old)) {
        opt.old.call(this);
      }
      if (opt.queue) {
        Flits.dequeue(this, opt.queue);
      }
    };
    return opt;
  };
  Flits.fn.extend({
    fadeTo: function (speed, to, easing, callback) {
      return this.filter(isHidden)
        .css("opacity", 0)
        .show()
        .end()
        .animate({ opacity: to }, speed, easing, callback);
    },
    animate: function (prop, speed, easing, callback) {
      var empty = Flits.isEmptyObject(prop),
        optall = Flits.speed(speed, easing, callback),
        doAnimation = function () {
          var anim = Animation(this, Flits.extend({}, prop), optall);
          if (empty || dataPriv.get(this, "finish")) {
            anim.stop(true);
          }
        };
      doAnimation.finish = doAnimation;
      return empty || optall.queue === false
        ? this.each(doAnimation)
        : this.queue(optall.queue, doAnimation);
    },
    stop: function (type, clearQueue, gotoEnd) {
      var stopQueue = function (hooks) {
        var stop = hooks.stop;
        delete hooks.stop;
        stop(gotoEnd);
      };
      if (typeof type !== "string") {
        gotoEnd = clearQueue;
        clearQueue = type;
        type = undefined;
      }
      if (clearQueue && type !== false) {
        this.queue(type || "fx", []);
      }
      return this.each(function () {
        var dequeue = true,
          index = type != null && type + "queueHooks",
          timers = Flits.timers,
          data = dataPriv.get(this);
        if (index) {
          if (data[index] && data[index].stop) {
            stopQueue(data[index]);
          }
        } else {
          for (index in data) {
            if (data[index] && data[index].stop && rrun.test(index)) {
              stopQueue(data[index]);
            }
          }
        }
        for (index = timers.length; index--; ) {
          if (
            timers[index].elem === this &&
            (type == null || timers[index].queue === type)
          ) {
            timers[index].anim.stop(gotoEnd);
            dequeue = false;
            timers.splice(index, 1);
          }
        }
        if (dequeue || !gotoEnd) {
          Flits.dequeue(this, type);
        }
      });
    },
    finish: function (type) {
      if (type !== false) {
        type = type || "fx";
      }
      return this.each(function () {
        var index,
          data = dataPriv.get(this),
          queue = data[type + "queue"],
          hooks = data[type + "queueHooks"],
          timers = Flits.timers,
          length = queue ? queue.length : 0;
        data.finish = true;
        Flits.queue(this, type, []);
        if (hooks && hooks.stop) {
          hooks.stop.call(this, true);
        }
        for (index = timers.length; index--; ) {
          if (timers[index].elem === this && timers[index].queue === type) {
            timers[index].anim.stop(true);
            timers.splice(index, 1);
          }
        }
        for (index = 0; index < length; index++) {
          if (queue[index] && queue[index].finish) {
            queue[index].finish.call(this);
          }
        }
        delete data.finish;
      });
    },
  });
  Flits.each(["toggle", "show", "hide"], function (i, name) {
    var cssFn = Flits.fn[name];
    Flits.fn[name] = function (speed, easing, callback) {
      return speed == null || typeof speed === "boolean"
        ? cssFn.apply(this, arguments)
        : this.animate(genFx(name, true), speed, easing, callback);
    };
  });
  Flits.each(
    {
      slideDown: genFx("show"),
      slideUp: genFx("hide"),
      slideToggle: genFx("toggle"),
      fadeIn: { opacity: "show" },
      fadeOut: { opacity: "hide" },
      fadeToggle: { opacity: "toggle" },
    },
    function (name, props) {
      Flits.fn[name] = function (speed, easing, callback) {
        return this.animate(props, speed, easing, callback);
      };
    }
  );
  Flits.timers = [];
  Flits.fx.tick = function () {
    var timer,
      i = 0,
      timers = Flits.timers;
    fxNow = Flits.now();
    for (; i < timers.length; i++) {
      timer = timers[i];
      if (!timer() && timers[i] === timer) {
        timers.splice(i--, 1);
      }
    }
    if (!timers.length) {
      Flits.fx.stop();
    }
    fxNow = undefined;
  };
  Flits.fx.timer = function (timer) {
    Flits.timers.push(timer);
    if (timer()) {
      Flits.fx.start();
    } else {
      Flits.timers.pop();
    }
  };
  Flits.fx.interval = 13;
  Flits.fx.start = function () {
    if (!timerId) {
      timerId = window.setInterval(Flits.fx.tick, Flits.fx.interval);
    }
  };
  Flits.fx.stop = function () {
    window.clearInterval(timerId);
    timerId = null;
  };
  Flits.fx.speeds = { slow: 600, fast: 200, _default: 400 };
  Flits.fn.delay = function (time, type) {
    time = Flits.fx ? Flits.fx.speeds[time] || time : time;
    type = type || "fx";
    return this.queue(type, function (next, hooks) {
      var timeout = window.setTimeout(next, time);
      hooks.stop = function () {
        window.clearTimeout(timeout);
      };
    });
  };
  (function () {
    var input = document.createElement("input"),
      select = document.createElement("select"),
      opt = select.appendChild(document.createElement("option"));
    input.type = "checkbox";
    support.checkOn = input.value !== "";
    support.optSelected = opt.selected;
    select.disabled = true;
    support.optDisabled = !opt.disabled;
    input = document.createElement("input");
    input.value = "t";
    input.type = "radio";
    support.radioValue = input.value === "t";
  })();
  var boolHook,
    attrHandle = Flits.expr.attrHandle;
  Flits.fn.extend({
    attr: function (name, value) {
      return access(this, Flits.attr, name, value, arguments.length > 1);
    },
    removeAttr: function (name) {
      return this.each(function () {
        Flits.removeAttr(this, name);
      });
    },
  });
  Flits.extend({
    attr: function (elem, name, value) {
      var ret,
        hooks,
        nType = elem.nodeType;
      if (nType === 3 || nType === 8 || nType === 2) {
        return;
      }
      if (typeof elem.getAttribute === "undefined") {
        return Flits.prop(elem, name, value);
      }
      if (nType !== 1 || !Flits.isXMLDoc(elem)) {
        name = name.toLowerCase();
        hooks =
          Flits.attrHooks[name] ||
          (Flits.expr.match.bool.test(name) ? boolHook : undefined);
      }
      if (value !== undefined) {
        if (value === null) {
          Flits.removeAttr(elem, name);
          return;
        }
        if (
          hooks &&
          "set" in hooks &&
          (ret = hooks.set(elem, value, name)) !== undefined
        ) {
          return ret;
        }
        elem.setAttribute(name, value + "");
        return value;
      }
      if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
        return ret;
      }
      ret = Flits.find.attr(elem, name);
      return ret == null ? undefined : ret;
    },
    attrHooks: {
      type: {
        set: function (elem, value) {
          if (
            !support.radioValue &&
            value === "radio" &&
            Flits.nodeName(elem, "input")
          ) {
            var val = elem.value;
            elem.setAttribute("type", value);
            if (val) {
              elem.value = val;
            }
            return value;
          }
        },
      },
    },
    removeAttr: function (elem, value) {
      var name,
        propName,
        i = 0,
        attrNames = value && value.match(rnotwhite);
      if (attrNames && elem.nodeType === 1) {
        while ((name = attrNames[i++])) {
          propName = Flits.propFix[name] || name;
          if (Flits.expr.match.bool.test(name)) {
            elem[propName] = false;
          }
          elem.removeAttribute(name);
        }
      }
    },
  });
  boolHook = {
    set: function (elem, value, name) {
      if (value === false) {
        Flits.removeAttr(elem, name);
      } else {
        elem.setAttribute(name, name);
      }
      return name;
    },
  };
  Flits.each(Flits.expr.match.bool.source.match(/\w+/g), function (i, name) {
    var getter = attrHandle[name] || Flits.find.attr;
    attrHandle[name] = function (elem, name, isXML) {
      var ret, handle;
      if (!isXML) {
        handle = attrHandle[name];
        attrHandle[name] = ret;
        ret = getter(elem, name, isXML) != null ? name.toLowerCase() : null;
        attrHandle[name] = handle;
      }
      return ret;
    };
  });
  var rfocusable = /^(?:input|select|textarea|button)$/i,
    rclickable = /^(?:a|area)$/i;
  Flits.fn.extend({
    prop: function (name, value) {
      return access(this, Flits.prop, name, value, arguments.length > 1);
    },
    removeProp: function (name) {
      return this.each(function () {
        delete this[Flits.propFix[name] || name];
      });
    },
  });
  Flits.extend({
    prop: function (elem, name, value) {
      var ret,
        hooks,
        nType = elem.nodeType;
      if (nType === 3 || nType === 8 || nType === 2) {
        return;
      }
      if (nType !== 1 || !Flits.isXMLDoc(elem)) {
        name = Flits.propFix[name] || name;
        hooks = Flits.propHooks[name];
      }
      if (value !== undefined) {
        if (
          hooks &&
          "set" in hooks &&
          (ret = hooks.set(elem, value, name)) !== undefined
        ) {
          return ret;
        }
        return (elem[name] = value);
      }
      if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
        return ret;
      }
      return elem[name];
    },
    propHooks: {
      tabIndex: {
        get: function (elem) {
          var tabindex = Flits.find.attr(elem, "tabindex");
          return tabindex
            ? parseInt(tabindex, 10)
            : rfocusable.test(elem.nodeName) ||
              (rclickable.test(elem.nodeName) && elem.href)
            ? 0
            : -1;
        },
      },
    },
    propFix: { for: "htmlFor", class: "className" },
  });
  if (!support.optSelected) {
    Flits.propHooks.selected = {
      get: function (elem) {
        var parent = elem.parentNode;
        if (parent && parent.parentNode) {
          parent.parentNode.selectedIndex;
        }
        return null;
      },
      set: function (elem) {
        var parent = elem.parentNode;
        if (parent) {
          parent.selectedIndex;
          if (parent.parentNode) {
            parent.parentNode.selectedIndex;
          }
        }
      },
    };
  }
  Flits.each(
    [
      "tabIndex",
      "readOnly",
      "maxLength",
      "cellSpacing",
      "cellPadding",
      "rowSpan",
      "colSpan",
      "useMap",
      "frameBorder",
      "contentEditable",
    ],
    function () {
      Flits.propFix[this.toLowerCase()] = this;
    }
  );
  var rclass = /[\t\r\n\f]/g;
  function getClass(elem) {
    return (elem.getAttribute && elem.getAttribute("class")) || "";
  }
  Flits.fn.extend({
    addClass: function (value) {
      var classes,
        elem,
        cur,
        curValue,
        clazz,
        j,
        finalValue,
        i = 0;
      if (Flits.isFunction(value)) {
        return this.each(function (j) {
          Flits(this).addClass(value.call(this, j, getClass(this)));
        });
      }
      if (typeof value === "string" && value) {
        classes = value.match(rnotwhite) || [];
        while ((elem = this[i++])) {
          curValue = getClass(elem);
          cur =
            elem.nodeType === 1 && (" " + curValue + " ").replace(rclass, " ");
          if (cur) {
            j = 0;
            while ((clazz = classes[j++])) {
              if (cur.indexOf(" " + clazz + " ") < 0) {
                cur += clazz + " ";
              }
            }
            finalValue = Flits.trim(cur);
            if (curValue !== finalValue) {
              elem.setAttribute("class", finalValue);
            }
          }
        }
      }
      return this;
    },
    removeClass: function (value) {
      var classes,
        elem,
        cur,
        curValue,
        clazz,
        j,
        finalValue,
        i = 0;
      if (Flits.isFunction(value)) {
        return this.each(function (j) {
          Flits(this).removeClass(value.call(this, j, getClass(this)));
        });
      }
      if (!arguments.length) {
        return this.attr("class", "");
      }
      if (typeof value === "string" && value) {
        classes = value.match(rnotwhite) || [];
        while ((elem = this[i++])) {
          curValue = getClass(elem);
          cur =
            elem.nodeType === 1 && (" " + curValue + " ").replace(rclass, " ");
          if (cur) {
            j = 0;
            while ((clazz = classes[j++])) {
              while (cur.indexOf(" " + clazz + " ") > -1) {
                cur = cur.replace(" " + clazz + " ", " ");
              }
            }
            finalValue = Flits.trim(cur);
            if (curValue !== finalValue) {
              elem.setAttribute("class", finalValue);
            }
          }
        }
      }
      return this;
    },
    toggleClass: function (value, stateVal) {
      var type = typeof value;
      if (typeof stateVal === "boolean" && type === "string") {
        return stateVal ? this.addClass(value) : this.removeClass(value);
      }
      if (Flits.isFunction(value)) {
        return this.each(function (i) {
          Flits(this).toggleClass(
            value.call(this, i, getClass(this), stateVal),
            stateVal
          );
        });
      }
      return this.each(function () {
        var className, i, self, classNames;
        if (type === "string") {
          i = 0;
          self = Flits(this);
          classNames = value.match(rnotwhite) || [];
          while ((className = classNames[i++])) {
            if (self.hasClass(className)) {
              self.removeClass(className);
            } else {
              self.addClass(className);
            }
          }
        } else if (value === undefined || type === "boolean") {
          className = getClass(this);
          if (className) {
            dataPriv.set(this, "__className__", className);
          }
          if (this.setAttribute) {
            this.setAttribute(
              "class",
              className || value === false
                ? ""
                : dataPriv.get(this, "__className__") || ""
            );
          }
        }
      });
    },
    hasClass: function (selector) {
      var className,
        elem,
        i = 0;
      className = " " + selector + " ";
      while ((elem = this[i++])) {
        if (
          elem.nodeType === 1 &&
          (" " + getClass(elem) + " ").replace(rclass, " ").indexOf(className) >
            -1
        ) {
          return true;
        }
      }
      return false;
    },
  });
  var rreturn = /\r/g,
    rspaces = /[\x20\t\r\n\f]+/g;
  Flits.fn.extend({
    val: function (value) {
      var hooks,
        ret,
        isFunction,
        elem = this[0];
      if (!arguments.length) {
        if (elem) {
          hooks =
            Flits.valHooks[elem.type] ||
            Flits.valHooks[elem.nodeName.toLowerCase()];
          if (
            hooks &&
            "get" in hooks &&
            (ret = hooks.get(elem, "value")) !== undefined
          ) {
            return ret;
          }
          ret = elem.value;
          return typeof ret === "string"
            ? ret.replace(rreturn, "")
            : ret == null
            ? ""
            : ret;
        }
        return;
      }
      isFunction = Flits.isFunction(value);
      return this.each(function (i) {
        var val;
        if (this.nodeType !== 1) {
          return;
        }
        if (isFunction) {
          val = value.call(this, i, Flits(this).val());
        } else {
          val = value;
        }
        if (val == null) {
          val = "";
        } else if (typeof val === "number") {
          val += "";
        } else if (Flits.isArray(val)) {
          val = Flits.map(val, function (value) {
            return value == null ? "" : value + "";
          });
        }
        hooks =
          Flits.valHooks[this.type] ||
          Flits.valHooks[this.nodeName.toLowerCase()];
        if (
          !hooks ||
          !("set" in hooks) ||
          hooks.set(this, val, "value") === undefined
        ) {
          this.value = val;
        }
      });
    },
  });
  Flits.extend({
    valHooks: {
      option: {
        get: function (elem) {
          var val = Flits.find.attr(elem, "value");
          return val != null
            ? val
            : Flits.trim(Flits.text(elem)).replace(rspaces, " ");
        },
      },
      select: {
        get: function (elem) {
          var value,
            option,
            options = elem.options,
            index = elem.selectedIndex,
            one = elem.type === "select-one" || index < 0,
            values = one ? null : [],
            max = one ? index + 1 : options.length,
            i = index < 0 ? max : one ? index : 0;
          for (; i < max; i++) {
            option = options[i];
            if (
              (option.selected || i === index) &&
              (support.optDisabled
                ? !option.disabled
                : option.getAttribute("disabled") === null) &&
              (!option.parentNode.disabled ||
                !Flits.nodeName(option.parentNode, "optgroup"))
            ) {
              value = Flits(option).val();
              if (one) {
                return value;
              }
              values.push(value);
            }
          }
          return values;
        },
        set: function (elem, value) {
          var optionSet,
            option,
            options = elem.options,
            values = Flits.makeArray(value),
            i = options.length;
          while (i--) {
            option = options[i];
            if (
              (option.selected =
                Flits.inArray(Flits.valHooks.option.get(option), values) > -1)
            ) {
              optionSet = true;
            }
          }
          if (!optionSet) {
            elem.selectedIndex = -1;
          }
          return values;
        },
      },
    },
  });
  Flits.each(["radio", "checkbox"], function () {
    Flits.valHooks[this] = {
      set: function (elem, value) {
        if (Flits.isArray(value)) {
          return (elem.checked = Flits.inArray(Flits(elem).val(), value) > -1);
        }
      },
    };
    if (!support.checkOn) {
      Flits.valHooks[this].get = function (elem) {
        return elem.getAttribute("value") === null ? "on" : elem.value;
      };
    }
  });
  var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;
  Flits.extend(Flits.event, {
    trigger: function (event, data, elem, onlyHandlers) {
      var i,
        cur,
        tmp,
        bubbleType,
        ontype,
        handle,
        special,
        eventPath = [elem || document],
        type = hasOwn.call(event, "type") ? event.type : event,
        namespaces = hasOwn.call(event, "namespace")
          ? event.namespace.split(".")
          : [];
      cur = tmp = elem = elem || document;
      if (elem.nodeType === 3 || elem.nodeType === 8) {
        return;
      }
      if (rfocusMorph.test(type + Flits.event.triggered)) {
        return;
      }
      if (type.indexOf(".") > -1) {
        namespaces = type.split(".");
        type = namespaces.shift();
        namespaces.sort();
      }
      ontype = type.indexOf(":") < 0 && "on" + type;
      event = event[Flits.expando]
        ? event
        : new Flits.Event(type, typeof event === "object" && event);
      event.isTrigger = onlyHandlers ? 2 : 3;
      event.namespace = namespaces.join(".");
      event.rnamespace = event.namespace
        ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)")
        : null;
      event.result = undefined;
      if (!event.target) {
        event.target = elem;
      }
      data = data == null ? [event] : Flits.makeArray(data, [event]);
      special = Flits.event.special[type] || {};
      if (
        !onlyHandlers &&
        special.trigger &&
        special.trigger.apply(elem, data) === false
      ) {
        return;
      }
      if (!onlyHandlers && !special.noBubble && !Flits.isWindow(elem)) {
        bubbleType = special.delegateType || type;
        if (!rfocusMorph.test(bubbleType + type)) {
          cur = cur.parentNode;
        }
        for (; cur; cur = cur.parentNode) {
          eventPath.push(cur);
          tmp = cur;
        }
        if (tmp === (elem.ownerDocument || document)) {
          eventPath.push(tmp.defaultView || tmp.parentWindow || window);
        }
      }
      i = 0;
      while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {
        event.type = i > 1 ? bubbleType : special.bindType || type;
        handle =
          (dataPriv.get(cur, "events") || {})[event.type] &&
          dataPriv.get(cur, "handle");
        if (handle) {
          handle.apply(cur, data);
        }
        handle = ontype && cur[ontype];
        if (handle && handle.apply && acceptData(cur)) {
          event.result = handle.apply(cur, data);
          if (event.result === false) {
            event.preventDefault();
          }
        }
      }
      event.type = type;
      if (!onlyHandlers && !event.isDefaultPrevented()) {
        if (
          (!special._default ||
            special._default.apply(eventPath.pop(), data) === false) &&
          acceptData(elem)
        ) {
          if (ontype && Flits.isFunction(elem[type]) && !Flits.isWindow(elem)) {
            tmp = elem[ontype];
            if (tmp) {
              elem[ontype] = null;
            }
            Flits.event.triggered = type;
            elem[type]();
            Flits.event.triggered = undefined;
            if (tmp) {
              elem[ontype] = tmp;
            }
          }
        }
      }
      return event.result;
    },
    simulate: function (type, elem, event) {
      var e = Flits.extend(new Flits.Event(), event, {
        type: type,
        isSimulated: true,
      });
      Flits.event.trigger(e, null, elem);
    },
  });
  Flits.fn.extend({
    trigger: function (type, data) {
      return this.each(function () {
        Flits.event.trigger(type, data, this);
      });
    },
    triggerHandler: function (type, data) {
      var elem = this[0];
      if (elem) {
        return Flits.event.trigger(type, data, elem, true);
      }
    },
  });
  Flits.each(
    (
      "blur focus focusin focusout load resize scroll unload click dblclick " +
      "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
      "change select submit keydown keypress keyup error contextmenu"
    ).split(" "),
    function (i, name) {
      Flits.fn[name] = function (data, fn) {
        return arguments.length > 0
          ? this.on(name, null, data, fn)
          : this.trigger(name);
      };
    }
  );
  Flits.fn.extend({
    hover: function (fnOver, fnOut) {
      return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
    },
  });
  support.focusin = "onfocusin" in window;
  if (!support.focusin) {
    Flits.each({ focus: "focusin", blur: "focusout" }, function (orig, fix) {
      var handler = function (event) {
        Flits.event.simulate(fix, event.target, Flits.event.fix(event));
      };
      Flits.event.special[fix] = {
        setup: function () {
          var doc = this.ownerDocument || this,
            attaches = dataPriv.access(doc, fix);
          if (!attaches) {
            doc.addEventListener(orig, handler, true);
          }
          dataPriv.access(doc, fix, (attaches || 0) + 1);
        },
        teardown: function () {
          var doc = this.ownerDocument || this,
            attaches = dataPriv.access(doc, fix) - 1;
          if (!attaches) {
            doc.removeEventListener(orig, handler, true);
            dataPriv.remove(doc, fix);
          } else {
            dataPriv.access(doc, fix, attaches);
          }
        },
      };
    });
  }
  var location = window.location;
  var nonce = Flits.now();
  var rquery = /\?/;
  Flits.parseJSON = function (data) {
    return JSON.parse(data + "");
  };
  Flits.parseXML = function (data) {
    var xml;
    if (!data || typeof data !== "string") {
      return null;
    }
    try {
      xml = new window.DOMParser().parseFromString(data, "text/xml");
    } catch (e) {
      xml = undefined;
    }
    if (!xml || xml.getElementsByTagName("parsererror").length) {
      Flits.error("Invalid XML: " + data);
    }
    return xml;
  };
  var rhash = /#.*$/,
    rts = /([?&])_=[^&]*/,
    rheaders = /^(.*?):[ \t]*([^\r\n]*)$/gm,
    rlocalProtocol =
      /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
    rnoContent = /^(?:GET|HEAD)$/,
    rprotocol = /^\/\//,
    prefilters = {},
    transports = {},
    allTypes = "*/".concat("*"),
    originAnchor = document.createElement("a");
  originAnchor.href = location.href;
  function addToPrefiltersOrTransports(structure) {
    return function (dataTypeExpression, func) {
      if (typeof dataTypeExpression !== "string") {
        func = dataTypeExpression;
        dataTypeExpression = "*";
      }
      var dataType,
        i = 0,
        dataTypes = dataTypeExpression.toLowerCase().match(rnotwhite) || [];
      if (Flits.isFunction(func)) {
        while ((dataType = dataTypes[i++])) {
          if (dataType[0] === "+") {
            dataType = dataType.slice(1) || "*";
            (structure[dataType] = structure[dataType] || []).unshift(func);
          } else {
            (structure[dataType] = structure[dataType] || []).push(func);
          }
        }
      }
    };
  }
  function inspectPrefiltersOrTransports(
    structure,
    options,
    originalOptions,
    flitsXHR
  ) {
    var inspected = {},
      seekingTransport = structure === transports;
    function inspect(dataType) {
      var selected;
      inspected[dataType] = true;
      Flits.each(structure[dataType] || [], function (_, prefilterOrFactory) {
        var dataTypeOrTransport = prefilterOrFactory(
          options,
          originalOptions,
          flitsXHR
        );
        if (
          typeof dataTypeOrTransport === "string" &&
          !seekingTransport &&
          !inspected[dataTypeOrTransport]
        ) {
          options.dataTypes.unshift(dataTypeOrTransport);
          inspect(dataTypeOrTransport);
          return false;
        } else if (seekingTransport) {
          return !(selected = dataTypeOrTransport);
        }
      });
      return selected;
    }
    return inspect(options.dataTypes[0]) || (!inspected["*"] && inspect("*"));
  }
  function ajaxExtend(target, src) {
    var key,
      deep,
      flatOptions = Flits.ajaxSettings.flatOptions || {};
    for (key in src) {
      if (src[key] !== undefined) {
        (flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
      }
    }
    if (deep) {
      Flits.extend(true, target, deep);
    }
    return target;
  }
  function ajaxHandleResponses(s, flitsXHR, responses) {
    var ct,
      type,
      finalDataType,
      firstDataType,
      contents = s.contents,
      dataTypes = s.dataTypes;
    while (dataTypes[0] === "*") {
      dataTypes.shift();
      if (ct === undefined) {
        ct = s.mimeType || flitsXHR.getResponseHeader("Content-Type");
      }
    }
    if (ct) {
      for (type in contents) {
        if (contents[type] && contents[type].test(ct)) {
          dataTypes.unshift(type);
          break;
        }
      }
    }
    if (dataTypes[0] in responses) {
      finalDataType = dataTypes[0];
    } else {
      for (type in responses) {
        if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
          finalDataType = type;
          break;
        }
        if (!firstDataType) {
          firstDataType = type;
        }
      }
      finalDataType = finalDataType || firstDataType;
    }
    if (finalDataType) {
      if (finalDataType !== dataTypes[0]) {
        dataTypes.unshift(finalDataType);
      }
      return responses[finalDataType];
    }
  }
  function ajaxConvert(s, response, flitsXHR, isSuccess) {
    var conv2,
      current,
      conv,
      tmp,
      prev,
      converters = {},
      dataTypes = s.dataTypes.slice();
    if (dataTypes[1]) {
      for (conv in s.converters) {
        converters[conv.toLowerCase()] = s.converters[conv];
      }
    }
    current = dataTypes.shift();
    while (current) {
      if (s.responseFields[current]) {
        flitsXHR[s.responseFields[current]] = response;
      }
      if (!prev && isSuccess && s.dataFilter) {
        response = s.dataFilter(response, s.dataType);
      }
      prev = current;
      current = dataTypes.shift();
      if (current) {
        if (current === "*") {
          current = prev;
        } else if (prev !== "*" && prev !== current) {
          conv = converters[prev + " " + current] || converters["* " + current];
          if (!conv) {
            for (conv2 in converters) {
              tmp = conv2.split(" ");
              if (tmp[1] === current) {
                conv =
                  converters[prev + " " + tmp[0]] || converters["* " + tmp[0]];
                if (conv) {
                  if (conv === true) {
                    conv = converters[conv2];
                  } else if (converters[conv2] !== true) {
                    current = tmp[0];
                    dataTypes.unshift(tmp[1]);
                  }
                  break;
                }
              }
            }
          }
          if (conv !== true) {
            if (conv && s.throws) {
              response = conv(response);
            } else {
              try {
                response = conv(response);
              } catch (e) {
                return {
                  state: "parsererror",
                  error: conv
                    ? e
                    : "No conversion from " + prev + " to " + current,
                };
              }
            }
          }
        }
      }
    }
    return { state: "success", data: response };
  }
  Flits.extend({
    active: 0,
    lastModified: {},
    etag: {},
    ajaxSettings: {
      url: location.href,
      type: "GET",
      isLocal: rlocalProtocol.test(location.protocol),
      global: true,
      processData: true,
      async: true,
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      accepts: {
        "*": allTypes,
        text: "text/plain",
        html: "text/html",
        xml: "application/xml, text/xml",
        json: "application/json, text/javascript",
      },
      contents: { xml: /\bxml\b/, html: /\bhtml/, json: /\bjson\b/ },
      responseFields: {
        xml: "responseXML",
        text: "responseText",
        json: "responseJSON",
      },
      converters: {
        "* text": String,
        "text html": true,
        "text json": Flits.parseJSON,
        "text xml": Flits.parseXML,
      },
      flatOptions: { url: true, context: true },
    },
    ajaxSetup: function (target, settings) {
      return settings
        ? ajaxExtend(ajaxExtend(target, Flits.ajaxSettings), settings)
        : ajaxExtend(Flits.ajaxSettings, target);
    },
    ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
    ajaxTransport: addToPrefiltersOrTransports(transports),
    ajax: function (url, options) {
      if (typeof url === "object") {
        options = url;
        url = undefined;
      }
      options = options || {};
      var transport,
        cacheURL,
        responseHeadersString,
        responseHeaders,
        timeoutTimer,
        urlAnchor,
        fireGlobals,
        i,
        s = Flits.ajaxSetup({}, options),
        callbackContext = s.context || s,
        globalEventContext =
          s.context && (callbackContext.nodeType || callbackContext.Flits)
            ? Flits(callbackContext)
            : Flits.event,
        deferred = Flits.Deferred(),
        completeDeferred = Flits.Callbacks("once memory"),
        statusCode = s.statusCode || {},
        requestHeaders = {},
        requestHeadersNames = {},
        state = 0,
        strAbort = "canceled",
        flitsXHR = {
          readyState: 0,
          getResponseHeader: function (key) {
            var match;
            if (state === 2) {
              if (!responseHeaders) {
                responseHeaders = {};
                while ((match = rheaders.exec(responseHeadersString))) {
                  responseHeaders[match[1].toLowerCase()] = match[2];
                }
              }
              match = responseHeaders[key.toLowerCase()];
            }
            return match == null ? null : match;
          },
          getAllResponseHeaders: function () {
            return state === 2 ? responseHeadersString : null;
          },
          setRequestHeader: function (name, value) {
            var lname = name.toLowerCase();
            if (!state) {
              name = requestHeadersNames[lname] =
                requestHeadersNames[lname] || name;
              requestHeaders[name] = value;
            }
            return this;
          },
          overrideMimeType: function (type) {
            if (!state) {
              s.mimeType = type;
            }
            return this;
          },
          statusCode: function (map) {
            var code;
            if (map) {
              if (state < 2) {
                for (code in map) {
                  statusCode[code] = [statusCode[code], map[code]];
                }
              } else {
                flitsXHR.always(map[flitsXHR.status]);
              }
            }
            return this;
          },
          abort: function (statusText) {
            var finalText = statusText || strAbort;
            if (transport) {
              transport.abort(finalText);
            }
            done(0, finalText);
            return this;
          },
        };
      deferred.promise(flitsXHR).complete = completeDeferred.add;
      flitsXHR.success = flitsXHR.done;
      flitsXHR.error = flitsXHR.fail;
      s.url = ((url || s.url || location.href) + "")
        .replace(rhash, "")
        .replace(rprotocol, location.protocol + "//");
      s.type = options.method || options.type || s.method || s.type;
      s.dataTypes = Flits.trim(s.dataType || "*")
        .toLowerCase()
        .match(rnotwhite) || [""];
      if (s.crossDomain == null) {
        urlAnchor = document.createElement("a");
        try {
          urlAnchor.href = s.url;
          urlAnchor.href = urlAnchor.href;
          s.crossDomain =
            originAnchor.protocol + "//" + originAnchor.host !==
            urlAnchor.protocol + "//" + urlAnchor.host;
        } catch (e) {
          s.crossDomain = true;
        }
      }
      if (s.data && s.processData && typeof s.data !== "string") {
        s.data = Flits.param(s.data, s.traditional);
      }
      inspectPrefiltersOrTransports(prefilters, s, options, flitsXHR);
      if (state === 2) {
        return flitsXHR;
      }
      fireGlobals = Flits.event && s.global;
      if (fireGlobals && Flits.active++ === 0) {
        Flits.event.trigger("ajaxStart");
      }
      s.type = s.type.toUpperCase();
      s.hasContent = !rnoContent.test(s.type);
      cacheURL = s.url;
      if (!s.hasContent) {
        if (s.data) {
          cacheURL = s.url += (rquery.test(cacheURL) ? "&" : "?") + s.data;
          delete s.data;
        }
        if (s.cache === false) {
          s.url = rts.test(cacheURL)
            ? cacheURL.replace(rts, "$1_=" + nonce++)
            : cacheURL + (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce++;
        }
      }
      if (s.ifModified) {
        if (Flits.lastModified[cacheURL]) {
          flitsXHR.setRequestHeader(
            "If-Modified-Since",
            Flits.lastModified[cacheURL]
          );
        }
        if (Flits.etag[cacheURL]) {
          flitsXHR.setRequestHeader("If-None-Match", Flits.etag[cacheURL]);
        }
      }
      if (
        (s.data && s.hasContent && s.contentType !== false) ||
        options.contentType
      ) {
        flitsXHR.setRequestHeader("Content-Type", s.contentType);
      }
      flitsXHR.setRequestHeader(
        "Accept",
        s.dataTypes[0] && s.accepts[s.dataTypes[0]]
          ? s.accepts[s.dataTypes[0]] +
              (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "")
          : s.accepts["*"]
      );
      for (i in s.headers) {
        flitsXHR.setRequestHeader(i, s.headers[i]);
      }
      if (
        s.beforeSend &&
        (s.beforeSend.call(callbackContext, flitsXHR, s) === false ||
          state === 2)
      ) {
        return flitsXHR.abort();
      }
      strAbort = "abort";
      for (i in { success: 1, error: 1, complete: 1 }) {
        flitsXHR[i](s[i]);
      }
      transport = inspectPrefiltersOrTransports(
        transports,
        s,
        options,
        flitsXHR
      );
      if (!transport) {
        done(-1, "No Transport");
      } else {
        flitsXHR.readyState = 1;
        if (fireGlobals) {
          globalEventContext.trigger("ajaxSend", [flitsXHR, s]);
        }
        if (state === 2) {
          return flitsXHR;
        }
        if (s.async && s.timeout > 0) {
          timeoutTimer = window.setTimeout(function () {
            flitsXHR.abort("timeout");
          }, s.timeout);
        }
        try {
          state = 1;
          transport.send(requestHeaders, done);
        } catch (e) {
          if (state < 2) {
            done(-1, e);
          } else {
            throw e;
          }
        }
      }
      function done(status, nativeStatusText, responses, headers) {
        var isSuccess,
          success,
          error,
          response,
          modified,
          statusText = nativeStatusText;
        if (state === 2) {
          return;
        }
        state = 2;
        if (timeoutTimer) {
          window.clearTimeout(timeoutTimer);
        }
        transport = undefined;
        responseHeadersString = headers || "";
        flitsXHR.readyState = status > 0 ? 4 : 0;
        isSuccess = (status >= 200 && status < 300) || status === 304;
        if (responses) {
          response = ajaxHandleResponses(s, flitsXHR, responses);
        }
        response = ajaxConvert(s, response, flitsXHR, isSuccess);
        if (isSuccess) {
          if (s.ifModified) {
            modified = flitsXHR.getResponseHeader("Last-Modified");
            if (modified) {
              Flits.lastModified[cacheURL] = modified;
            }
            modified = flitsXHR.getResponseHeader("etag");
            if (modified) {
              Flits.etag[cacheURL] = modified;
            }
          }
          if (status === 204 || s.type === "HEAD") {
            statusText = "nocontent";
          } else if (status === 304) {
            statusText = "notmodified";
          } else {
            statusText = response.state;
            success = response.data;
            error = response.error;
            isSuccess = !error;
          }
        } else {
          error = statusText;
          if (status || !statusText) {
            statusText = "error";
            if (status < 0) {
              status = 0;
            }
          }
        }
        flitsXHR.status = status;
        flitsXHR.statusText = (nativeStatusText || statusText) + "";
        if (isSuccess) {
          deferred.resolveWith(callbackContext, [
            success,
            statusText,
            flitsXHR,
          ]);
        } else {
          deferred.rejectWith(callbackContext, [flitsXHR, statusText, error]);
        }
        flitsXHR.statusCode(statusCode);
        statusCode = undefined;
        if (fireGlobals) {
          globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError", [
            flitsXHR,
            s,
            isSuccess ? success : error,
          ]);
        }
        completeDeferred.fireWith(callbackContext, [flitsXHR, statusText]);
        if (fireGlobals) {
          globalEventContext.trigger("ajaxComplete", [flitsXHR, s]);
          if (!--Flits.active) {
            Flits.event.trigger("ajaxStop");
          }
        }
      }
      return flitsXHR;
    },
    getJSON: function (url, data, callback) {
      return Flits.get(url, data, callback, "json");
    },
    getScript: function (url, callback) {
      return Flits.get(url, undefined, callback, "script");
    },
  });
  Flits.each(["get", "post"], function (i, method) {
    Flits[method] = function (url, data, callback, type) {
      if (Flits.isFunction(data)) {
        type = type || callback;
        callback = data;
        data = undefined;
      }
      return Flits.ajax(
        Flits.extend(
          {
            url: url,
            type: method,
            dataType: type,
            data: data,
            success: callback,
          },
          Flits.isPlainObject(url) && url
        )
      );
    };
  });
  Flits._evalUrl = function (url) {
    return Flits.ajax({
      url: url,
      type: "GET",
      dataType: "script",
      async: false,
      global: false,
      throws: true,
    });
  };
  Flits.fn.extend({
    wrapAll: function (html) {
      var wrap;
      if (Flits.isFunction(html)) {
        return this.each(function (i) {
          Flits(this).wrapAll(html.call(this, i));
        });
      }
      if (this[0]) {
        wrap = Flits(html, this[0].ownerDocument).eq(0).clone(true);
        if (this[0].parentNode) {
          wrap.insertBefore(this[0]);
        }
        wrap
          .map(function () {
            var elem = this;
            while (elem.firstElementChild) {
              elem = elem.firstElementChild;
            }
            return elem;
          })
          .append(this);
      }
      return this;
    },
    wrapInner: function (html) {
      if (Flits.isFunction(html)) {
        return this.each(function (i) {
          Flits(this).wrapInner(html.call(this, i));
        });
      }
      return this.each(function () {
        var self = Flits(this),
          contents = self.contents();
        if (contents.length) {
          contents.wrapAll(html);
        } else {
          self.append(html);
        }
      });
    },
    wrap: function (html) {
      var isFunction = Flits.isFunction(html);
      return this.each(function (i) {
        Flits(this).wrapAll(isFunction ? html.call(this, i) : html);
      });
    },
    unwrap: function () {
      return this.parent()
        .each(function () {
          if (!Flits.nodeName(this, "body")) {
            Flits(this).replaceWith(this.childNodes);
          }
        })
        .end();
    },
  });
  Flits.expr.filters.hidden = function (elem) {
    return !Flits.expr.filters.visible(elem);
  };
  Flits.expr.filters.visible = function (elem) {
    return (
      elem.offsetWidth > 0 ||
      elem.offsetHeight > 0 ||
      elem.getClientRects().length > 0
    );
  };
  var r20 = /%20/g,
    rbracket = /\[\]$/,
    rCRLF = /\r?\n/g,
    rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
    rsubmittable = /^(?:input|select|textarea|keygen)/i;
  function buildParams(prefix, obj, traditional, add) {
    var name;
    if (Flits.isArray(obj)) {
      Flits.each(obj, function (i, v) {
        if (traditional || rbracket.test(prefix)) {
          add(prefix, v);
        } else {
          buildParams(
            prefix + "[" + (typeof v === "object" && v != null ? i : "") + "]",
            v,
            traditional,
            add
          );
        }
      });
    } else if (!traditional && Flits.type(obj) === "object") {
      for (name in obj) {
        buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
      }
    } else {
      add(prefix, obj);
    }
  }
  Flits.param = function (a, traditional) {
    var prefix,
      s = [],
      add = function (key, value) {
        value = Flits.isFunction(value) ? value() : value == null ? "" : value;
        s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
      };
    if (traditional === undefined) {
      traditional = Flits.ajaxSettings && Flits.ajaxSettings.traditional;
    }
    if (Flits.isArray(a) || (a.Flits && !Flits.isPlainObject(a))) {
      Flits.each(a, function () {
        add(this.name, this.value);
      });
    } else {
      for (prefix in a) {
        buildParams(prefix, a[prefix], traditional, add);
      }
    }
    return s.join("&").replace(r20, "+");
  };
  Flits.fn.extend({
    serialize: function () {
      return Flits.param(this.serializeArray());
    },
    serializeArray: function () {
      return this.map(function () {
        var elements = Flits.prop(this, "elements");
        return elements ? Flits.makeArray(elements) : this;
      })
        .filter(function () {
          var type = this.type;
          return (
            this.name &&
            !Flits(this).is(":disabled") &&
            rsubmittable.test(this.nodeName) &&
            !rsubmitterTypes.test(type) &&
            (this.checked || !rcheckableType.test(type))
          );
        })
        .map(function (i, elem) {
          var val = Flits(this).val();
          return val == null
            ? null
            : Flits.isArray(val)
            ? Flits.map(val, function (val) {
                return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
              })
            : { name: elem.name, value: val.replace(rCRLF, "\r\n") };
        })
        .get();
    },
  });
  Flits.ajaxSettings.xhr = function () {
    try {
      return new window.XMLHttpRequest();
    } catch (e) {}
  };
  var xhrSuccessStatus = { 0: 200, 1223: 204 },
    xhrSupported = Flits.ajaxSettings.xhr();
  support.cors = !!xhrSupported && "withCredentials" in xhrSupported;
  support.ajax = xhrSupported = !!xhrSupported;
  Flits.ajaxTransport(function (options) {
    var callback, errorCallback;
    if (support.cors || (xhrSupported && !options.crossDomain)) {
      return {
        send: function (headers, complete) {
          var i,
            xhr = options.xhr();
          xhr.open(
            options.type,
            options.url,
            options.async,
            options.username,
            options.password
          );
          if (options.xhrFields) {
            for (i in options.xhrFields) {
              xhr[i] = options.xhrFields[i];
            }
          }
          if (options.mimeType && xhr.overrideMimeType) {
            xhr.overrideMimeType(options.mimeType);
          }
          if (!options.crossDomain && !headers["X-Requested-With"]) {
            headers["X-Requested-With"] = "XMLHttpRequest";
          }
          for (i in headers) {
            xhr.setRequestHeader(i, headers[i]);
          }
          callback = function (type) {
            return function () {
              if (callback) {
                callback =
                  errorCallback =
                  xhr.onload =
                  xhr.onerror =
                  xhr.onabort =
                  xhr.onreadystatechange =
                    null;
                if (type === "abort") {
                  xhr.abort();
                } else if (type === "error") {
                  if (typeof xhr.status !== "number") {
                    complete(0, "error");
                  } else {
                    complete(xhr.status, xhr.statusText);
                  }
                } else {
                  complete(
                    xhrSuccessStatus[xhr.status] || xhr.status,
                    xhr.statusText,
                    (xhr.responseType || "text") !== "text" ||
                      typeof xhr.responseText !== "string"
                      ? { binary: xhr.response }
                      : { text: xhr.responseText },
                    xhr.getAllResponseHeaders()
                  );
                }
              }
            };
          };
          xhr.onload = callback();
          errorCallback = xhr.onerror = callback("error");
          if (xhr.onabort !== undefined) {
            xhr.onabort = errorCallback;
          } else {
            xhr.onreadystatechange = function () {
              if (xhr.readyState === 4) {
                window.setTimeout(function () {
                  if (callback) {
                    errorCallback();
                  }
                });
              }
            };
          }
          callback = callback("abort");
          try {
            xhr.send((options.hasContent && options.data) || null);
          } catch (e) {
            if (callback) {
              throw e;
            }
          }
        },
        abort: function () {
          if (callback) {
            callback();
          }
        },
      };
    }
  });
  Flits.ajaxSetup({
    accepts: {
      script:
        "text/javascript, application/javascript, " +
        "application/ecmascript, application/x-ecmascript",
    },
    contents: { script: /\b(?:java|ecma)script\b/ },
    converters: {
      "text script": function (text) {
        Flits.globalEval(text);
        return text;
      },
    },
  });
  Flits.ajaxPrefilter("script", function (s) {
    if (s.cache === undefined) {
      s.cache = false;
    }
    if (s.crossDomain) {
      s.type = "GET";
    }
  });
  Flits.ajaxTransport("script", function (s) {
    if (s.crossDomain) {
      var script, callback;
      return {
        send: function (_, complete) {
          script = Flits("<script>")
            .prop({ charset: s.scriptCharset, src: s.url })
            .on(
              "load error",
              (callback = function (evt) {
                script.remove();
                callback = null;
                if (evt) {
                  complete(evt.type === "error" ? 404 : 200, evt.type);
                }
              })
            );
          document.head.appendChild(script[0]);
        },
        abort: function () {
          if (callback) {
            callback();
          }
        },
      };
    }
  });
  var oldCallbacks = [],
    rjsonp = /(=)\?(?=&|$)|\?\?/;
  Flits.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function () {
      var callback = oldCallbacks.pop() || Flits.expando + "_" + nonce++;
      this[callback] = true;
      return callback;
    },
  });
  Flits.ajaxPrefilter("json jsonp", function (s, originalSettings, flitsXHR) {
    var callbackName,
      overwritten,
      responseContainer,
      jsonProp =
        s.jsonp !== false &&
        (rjsonp.test(s.url)
          ? "url"
          : typeof s.data === "string" &&
            (s.contentType || "").indexOf(
              "application/x-www-form-urlencoded"
            ) === 0 &&
            rjsonp.test(s.data) &&
            "data");
    if (jsonProp || s.dataTypes[0] === "jsonp") {
      callbackName = s.jsonpCallback = Flits.isFunction(s.jsonpCallback)
        ? s.jsonpCallback()
        : s.jsonpCallback;
      if (jsonProp) {
        s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName);
      } else if (s.jsonp !== false) {
        s.url +=
          (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName;
      }
      s.converters["script json"] = function () {
        if (!responseContainer) {
          Flits.error(callbackName + " was not called");
        }
        return responseContainer[0];
      };
      s.dataTypes[0] = "json";
      overwritten = window[callbackName];
      window[callbackName] = function () {
        responseContainer = arguments;
      };
      flitsXHR.always(function () {
        if (overwritten === undefined) {
          Flits(window).removeProp(callbackName);
        } else {
          window[callbackName] = overwritten;
        }
        if (s[callbackName]) {
          s.jsonpCallback = originalSettings.jsonpCallback;
          oldCallbacks.push(callbackName);
        }
        if (responseContainer && Flits.isFunction(overwritten)) {
          overwritten(responseContainer[0]);
        }
        responseContainer = overwritten = undefined;
      });
      return "script";
    }
  });
  Flits.parseHTML = function (data, context, keepScripts) {
    if (!data || typeof data !== "string") {
      return null;
    }
    if (typeof context === "boolean") {
      keepScripts = context;
      context = false;
    }
    context = context || document;
    var parsed = rsingleTag.exec(data),
      scripts = !keepScripts && [];
    if (parsed) {
      return [context.createElement(parsed[1])];
    }
    parsed = buildFragment([data], context, scripts);
    if (scripts && scripts.length) {
      Flits(scripts).remove();
    }
    return Flits.merge([], parsed.childNodes);
  };
  var _load = Flits.fn.load;
  Flits.fn.load = function (url, params, callback) {
    if (typeof url !== "string" && _load) {
      return _load.apply(this, arguments);
    }
    var selector,
      type,
      response,
      self = this,
      off = url.indexOf(" ");
    if (off > -1) {
      selector = Flits.trim(url.slice(off));
      url = url.slice(0, off);
    }
    if (Flits.isFunction(params)) {
      callback = params;
      params = undefined;
    } else if (params && typeof params === "object") {
      type = "POST";
    }
    if (self.length > 0) {
      Flits.ajax({
        url: url,
        type: type || "GET",
        dataType: "html",
        data: params,
      })
        .done(function (responseText) {
          response = arguments;
          self.html(
            selector
              ? Flits("<div>")
                  .append(Flits.parseHTML(responseText))
                  .find(selector)
              : responseText
          );
        })
        .always(
          callback &&
            function (flitsXHR, status) {
              self.each(function () {
                callback.apply(
                  this,
                  response || [flitsXHR.responseText, status, flitsXHR]
                );
              });
            }
        );
    }
    return this;
  };
  Flits.each(
    [
      "ajaxStart",
      "ajaxStop",
      "ajaxComplete",
      "ajaxError",
      "ajaxSuccess",
      "ajaxSend",
    ],
    function (i, type) {
      Flits.fn[type] = function (fn) {
        return this.on(type, fn);
      };
    }
  );
  Flits.expr.filters.animated = function (elem) {
    return Flits.grep(Flits.timers, function (fn) {
      return elem === fn.elem;
    }).length;
  };
  function getWindow(elem) {
    return Flits.isWindow(elem)
      ? elem
      : elem.nodeType === 9 && elem.defaultView;
  }
  Flits.offset = {
    setOffset: function (elem, options, i) {
      var curPosition,
        curLeft,
        curCSSTop,
        curTop,
        curOffset,
        curCSSLeft,
        calculatePosition,
        position = Flits.css(elem, "position"),
        curElem = Flits(elem),
        props = {};
      if (position === "static") {
        elem.style.position = "relative";
      }
      curOffset = curElem.offset();
      curCSSTop = Flits.css(elem, "top");
      curCSSLeft = Flits.css(elem, "left");
      calculatePosition =
        (position === "absolute" || position === "fixed") &&
        (curCSSTop + curCSSLeft).indexOf("auto") > -1;
      if (calculatePosition) {
        curPosition = curElem.position();
        curTop = curPosition.top;
        curLeft = curPosition.left;
      } else {
        curTop = parseFloat(curCSSTop) || 0;
        curLeft = parseFloat(curCSSLeft) || 0;
      }
      if (Flits.isFunction(options)) {
        options = options.call(elem, i, Flits.extend({}, curOffset));
      }
      if (options.top != null) {
        props.top = options.top - curOffset.top + curTop;
      }
      if (options.left != null) {
        props.left = options.left - curOffset.left + curLeft;
      }
      if ("using" in options) {
        options.using.call(elem, props);
      } else {
        curElem.css(props);
      }
    },
  };
  Flits.fn.extend({
    offset: function (options) {
      if (arguments.length) {
        return options === undefined
          ? this
          : this.each(function (i) {
              Flits.offset.setOffset(this, options, i);
            });
      }
      var docElem,
        win,
        elem = this[0],
        box = { top: 0, left: 0 },
        doc = elem && elem.ownerDocument;
      if (!doc) {
        return;
      }
      docElem = doc.documentElement;
      if (!Flits.contains(docElem, elem)) {
        return box;
      }
      box = elem.getBoundingClientRect();
      win = getWindow(doc);
      return {
        top: box.top + win.pageYOffset - docElem.clientTop,
        left: box.left + win.pageXOffset - docElem.clientLeft,
      };
    },
    position: function () {
      if (!this[0]) {
        return;
      }
      var offsetParent,
        offset,
        elem = this[0],
        parentOffset = { top: 0, left: 0 };
      if (Flits.css(elem, "position") === "fixed") {
        offset = elem.getBoundingClientRect();
      } else {
        offsetParent = this.offsetParent();
        offset = this.offset();
        if (!Flits.nodeName(offsetParent[0], "html")) {
          parentOffset = offsetParent.offset();
        }
        parentOffset.top += Flits.css(offsetParent[0], "borderTopWidth", true);
        parentOffset.left += Flits.css(
          offsetParent[0],
          "borderLeftWidth",
          true
        );
      }
      return {
        top: offset.top - parentOffset.top - Flits.css(elem, "marginTop", true),
        left:
          offset.left - parentOffset.left - Flits.css(elem, "marginLeft", true),
      };
    },
    offsetParent: function () {
      return this.map(function () {
        var offsetParent = this.offsetParent;
        while (
          offsetParent &&
          Flits.css(offsetParent, "position") === "static"
        ) {
          offsetParent = offsetParent.offsetParent;
        }
        return offsetParent || documentElement;
      });
    },
  });
  Flits.each(
    { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" },
    function (method, prop) {
      var top = "pageYOffset" === prop;
      Flits.fn[method] = function (val) {
        return access(
          this,
          function (elem, method, val) {
            var win = getWindow(elem);
            if (val === undefined) {
              return win ? win[prop] : elem[method];
            }
            if (win) {
              win.scrollTo(
                !top ? val : win.pageXOffset,
                top ? val : win.pageYOffset
              );
            } else {
              elem[method] = val;
            }
          },
          method,
          val,
          arguments.length
        );
      };
    }
  );
  Flits.each(["top", "left"], function (i, prop) {
    Flits.cssHooks[prop] = addGetHookIf(
      support.pixelPosition,
      function (elem, computed) {
        if (computed) {
          computed = curCSS(elem, prop);
          return rnumnonpx.test(computed)
            ? Flits(elem).position()[prop] + "px"
            : computed;
        }
      }
    );
  });
  Flits.each({ Height: "height", Width: "width" }, function (name, type) {
    Flits.each(
      { padding: "inner" + name, content: type, "": "outer" + name },
      function (defaultExtra, funcName) {
        Flits.fn[funcName] = function (margin, value) {
          var chainable =
              arguments.length && (defaultExtra || typeof margin !== "boolean"),
            extra =
              defaultExtra ||
              (margin === true || value === true ? "margin" : "border");
          return access(
            this,
            function (elem, type, value) {
              var doc;
              if (Flits.isWindow(elem)) {
                return elem.document.documentElement["client" + name];
              }
              if (elem.nodeType === 9) {
                doc = elem.documentElement;
                return Math.max(
                  elem.body["scroll" + name],
                  doc["scroll" + name],
                  elem.body["offset" + name],
                  doc["offset" + name],
                  doc["client" + name]
                );
              }
              return value === undefined
                ? Flits.css(elem, type, extra)
                : Flits.style(elem, type, value, extra);
            },
            type,
            chainable ? margin : undefined,
            chainable,
            null
          );
        };
      }
    );
  });
  Flits.fn.extend({
    bind: function (types, data, fn) {
      return this.on(types, null, data, fn);
    },
    unbind: function (types, fn) {
      return this.off(types, null, fn);
    },
    delegate: function (selector, types, data, fn) {
      return this.on(types, selector, data, fn);
    },
    undelegate: function (selector, types, fn) {
      return arguments.length === 1
        ? this.off(selector, "**")
        : this.off(types, selector || "**", fn);
    },
    size: function () {
      return this.length;
    },
  });
  Flits.fn.andSelf = Flits.fn.addBack;
  if (typeof define === "function" && define.amd) {
    define("Flits", [], function () {
      return Flits;
    });
  }
  var _Flits = window.Flits;
  Flits.noConflict = function (deep) {
    if (deep && window.Flits === Flits) {
      window.Flits = _Flits;
    }
    return Flits;
  };
  if (!noGlobal) {
    window.Flits = Flits;
  }
  return Flits;
});

(function (Flits) {
  !(function (t, o) {
    "function" == typeof define && define.amd
      ? define(o)
      : "object" == typeof exports
      ? (module.exports = o())
      : (t.flits_tingle = o());
  })(this, function () {
    function t(t) {
      var o = {
        onClose: null,
        onOpen: null,
        beforeOpen: null,
        beforeClose: null,
        stickyFooter: !1,
        footer: !1,
        cssClass: [],
        closeLabel: "Close",
        closeMethods: ["overlay", "button", "escape"],
      };
      (this.opts = r({}, o, t)), this.init();
    }
    function o() {
      this.modalBoxFooter &&
        ((this.modalBoxFooter.style.width = this.modalBox.clientWidth + "px"),
        (this.modalBoxFooter.style.left = this.modalBox.offsetLeft + "px"));
    }
    function e() {
      (this.modal = document.createElement("div")),
        this.modal.classList.add("flits-tingle-modal"),
        (0 === this.opts.closeMethods.length ||
          -1 === this.opts.closeMethods.indexOf("overlay")) &&
          this.modal.classList.add("flits-tingle-modal-noOverlayClose"),
        (this.modal.style.display = "none"),
        this.opts.cssClass.forEach(function (t) {
          "string" == typeof t && this.modal.classList.add(t);
        }, this),
        -1 !== this.opts.closeMethods.indexOf("button") &&
          ((this.modalCloseBtn = document.createElement("button")),
          this.modalCloseBtn.classList.add("flits-tingle-modal-close"),
          (this.modalCloseBtnIcon = document.createElement("span")),
          this.modalCloseBtnIcon.classList.add("flits-tingle-moda-closeIcon"),
          (this.modalCloseBtnIcon.innerHTML = "×"),
          (this.modalCloseBtnLabel = document.createElement("span")),
          this.modalCloseBtnLabel.classList.add(
            "flits-tingle-modal-closeLabel"
          ),
          (this.modalCloseBtnLabel.innerHTML = this.opts.closeLabel),
          this.modalCloseBtn.appendChild(this.modalCloseBtnIcon),
          this.modalCloseBtn.appendChild(this.modalCloseBtnLabel)),
        (this.modalBox = document.createElement("div")),
        this.modalBox.classList.add("flits-tingle-modal-box"),
        -1 !== this.opts.closeMethods.indexOf("button") &&
          this.modalBox.appendChild(this.modalCloseBtn),
        (this.modalBoxContent = document.createElement("div")),
        this.modalBoxContent.classList.add("flits-tingle-modal-box-content"),
        this.modalBox.appendChild(this.modalBoxContent),
        this.modal.appendChild(this.modalBox);
    }
    function s() {
      (this.modalBoxFooter = document.createElement("div")),
        this.modalBoxFooter.classList.add("flits-tingle-modal-box-footer"),
        this.modalBox.appendChild(this.modalBoxFooter);
    }
    function i() {
      (this._events = {
        clickCloseBtn: this.close.bind(this),
        clickOverlay: l.bind(this),
        resize: this.checkOverflow.bind(this),
        keyboardNav: n.bind(this),
      }),
        -1 !== this.opts.closeMethods.indexOf("button") &&
          this.modalCloseBtn.addEventListener(
            "click",
            this._events.clickCloseBtn
          ),
        this.modal.addEventListener("mousedown", this._events.clickOverlay),
        window.addEventListener("resize", this._events.resize),
        document.addEventListener("keydown", this._events.keyboardNav);
    }
    function n(t) {
      -1 !== this.opts.closeMethods.indexOf("escape") &&
        27 === t.which &&
        this.isOpen() &&
        this.close();
    }
    function l(t) {
      -1 !== this.opts.closeMethods.indexOf("overlay") &&
        !d(t.target, "tingle-modal") &&
        t.clientX < this.modal.clientWidth &&
        this.close();
    }
    function d(t, o) {
      for (; (t = t.parentElement) && !t.classList.contains(o); );
      return t;
    }
    function a() {
      -1 !== this.opts.closeMethods.indexOf("button") &&
        this.modalCloseBtn.removeEventListener(
          "click",
          this._events.clickCloseBtn
        ),
        this.modal.removeEventListener("mousedown", this._events.clickOverlay),
        window.removeEventListener("resize", this._events.resize),
        document.removeEventListener("keydown", this._events.keyboardNav);
    }
    function r() {
      for (var t = 1; t < arguments.length; t++)
        for (var o in arguments[t])
          arguments[t].hasOwnProperty(o) && (arguments[0][o] = arguments[t][o]);
      return arguments[0];
    }
    var h = (function () {
      var t,
        o = document.createElement("flits-tingle-test-transition"),
        e = {
          transition: "transitionend",
          OTransition: "oTransitionEnd",
          MozTransition: "transitionend",
          WebkitTransition: "webkitTransitionEnd",
        };
      for (t in e) if (void 0 !== o.style[t]) return e[t];
    })();
    return (
      (t.prototype.init = function () {
        this.modal ||
          (e.call(this),
          i.call(this),
          document.body.insertBefore(this.modal, document.body.firstChild),
          this.opts.footer && this.addFooter());
      }),
      (t.prototype.destroy = function () {
        null !== this.modal &&
          (a.call(this),
          this.modal.parentNode.removeChild(this.modal),
          (this.modal = null));
      }),
      (t.prototype.open = function () {
        var t = this;
        "function" == typeof t.opts.beforeOpen && t.opts.beforeOpen(),
          this.modal.style.removeProperty
            ? this.modal.style.removeProperty("display")
            : this.modal.style.removeAttribute("display"),
          document.body.classList.add("flits-tingle-enabled"),
          this.setStickyFooter(this.opts.stickyFooter),
          this.modal.classList.add("flits-tingle-modal-visible"),
          h
            ? this.modal.addEventListener(
                h,
                function o() {
                  "function" == typeof t.opts.onOpen && t.opts.onOpen.call(t),
                    t.modal.removeEventListener(h, o, !1);
                },
                !1
              )
            : "function" == typeof t.opts.onOpen && t.opts.onOpen.call(t),
          this.checkOverflow();
      }),
      (t.prototype.isOpen = function () {
        return !!this.modal.classList.contains("flits-tingle-modal-visible");
      }),
      (t.prototype.close = function () {
        if (
          "function" != typeof this.opts.beforeClose ||
          this.opts.beforeClose.call(this)
        ) {
          document.body.classList.remove("flits-tingle-enabled"),
            this.modal.classList.remove("flits-tingle-modal-visible");
          var t = this;
          h
            ? this.modal.addEventListener(
                h,
                function o() {
                  t.modal.removeEventListener(h, o, !1),
                    (t.modal.style.display = "none"),
                    "function" == typeof t.opts.onClose &&
                      t.opts.onClose.call(this);
                },
                !1
              )
            : ((t.modal.style.display = "none"),
              "function" == typeof t.opts.onClose && t.opts.onClose.call(this));
        }
      }),
      (t.prototype.setContent = function (t) {
        "string" == typeof t
          ? (this.modalBoxContent.innerHTML = t)
          : ((this.modalBoxContent.innerHTML = ""),
            this.modalBoxContent.appendChild(t));
      }),
      (t.prototype.getContent = function () {
        return this.modalBoxContent;
      }),
      (t.prototype.addFooter = function () {
        s.call(this);
      }),
      (t.prototype.setFooterContent = function (t) {
        this.modalBoxFooter.innerHTML = t;
      }),
      (t.prototype.getFooterContent = function () {
        return this.modalBoxFooter;
      }),
      (t.prototype.setStickyFooter = function (t) {
        this.isOverflow() || (t = !1),
          t
            ? this.modalBox.contains(this.modalBoxFooter) &&
              (this.modalBox.removeChild(this.modalBoxFooter),
              this.modal.appendChild(this.modalBoxFooter),
              this.modalBoxFooter.classList.add(
                "flits-tingle-modal-box-footer-sticky"
              ),
              o.call(this),
              (this.modalBoxContent.style["padding-bottom"] =
                this.modalBoxFooter.clientHeight + 20 + "px"))
            : this.modalBoxFooter &&
              (this.modalBox.contains(this.modalBoxFooter) ||
                (this.modal.removeChild(this.modalBoxFooter),
                this.modalBox.appendChild(this.modalBoxFooter),
                (this.modalBoxFooter.style.width = "auto"),
                (this.modalBoxFooter.style.left = ""),
                (this.modalBoxContent.style["padding-bottom"] = ""),
                this.modalBoxFooter.classList.remove(
                  "flits-tingle-modal-box-footer-sticky"
                )));
      }),
      (t.prototype.addFooterBtn = function (t, o, e) {
        var s = document.createElement("button");
        return (
          (s.innerHTML = t),
          s.addEventListener("click", e),
          "string" == typeof o &&
            o.length &&
            o.split(" ").forEach(function (t) {
              s.classList.add(t);
            }),
          this.modalBoxFooter.appendChild(s),
          s
        );
      }),
      (t.prototype.resize = function () {
        console.warn("Resize is deprecated and will be removed in version 1.0");
      }),
      (t.prototype.isOverflow = function () {
        var t = window.innerHeight;
        return this.modalBox.clientHeight >= t;
      }),
      (t.prototype.checkOverflow = function () {
        this.modal.classList.contains("flits-tingle-modal-visible") &&
          (this.isOverflow()
            ? this.modal.classList.add("flits-tingle-modal-overflow")
            : this.modal.classList.remove("flits-tingle-modal-overflow"),
          !this.isOverflow() && this.opts.stickyFooter
            ? this.setStickyFooter(!1)
            : this.isOverflow() &&
              this.opts.stickyFooter &&
              (o.call(this), this.setStickyFooter(!0)));
      }),
      { modal: t }
    );
  });
  (function (root, factory) {
    "use strict";
    if (typeof define === "function" && define.amd) {
      define([], function () {
        return (root.flitsSnackbar = factory());
      });
    } else if (typeof module === "object" && module.exports) {
      module.exports = root.flitsSnackbar = factory();
    } else {
      root.flitsSnackbar = factory();
    }
  })(this, function () {
    var flitsSnackbar = {};
    flitsSnackbar.current = null;
    var $defaults = {
      text: "Default Text",
      textColor: "#FFFFFF",
      width: "auto",
      showAction: true,
      actionText: "Dismiss",
      actionTextAria: "Dismiss, Description for Screen Readers",
      alertScreenReader: false,
      actionTextColor: "#4CAF50",
      showSecondButton: false,
      secondButtonText: "",
      secondButtonAria: "Description for Screen Readers",
      secondButtonTextColor: "#4CAF50",
      backgroundColor: "#323232",
      pos: "bottom-left",
      duration: 5000,
      customClass: "",
      content: null,
      container: "body",
      onActionClick: function (element) {
        element.style.opacity = 0;
      },
      onSecondButtonClick: function (element) {},
      onClose: function (element) {},
    };
    flitsSnackbar.show = function ($options) {
      var options = Extend(true, $defaults, $options);
      if (flitsSnackbar.current) {
        flitsSnackbar.current.style.opacity = 0;
        setTimeout(
          function () {
            var $parent = this.parentElement;
            if ($parent) $parent.removeChild(this);
          }.bind(flitsSnackbar.current),
          500
        );
      }
      if (options.content != null) {
        flitsSnackbar.snackbar = document.createElement("div");
        flitsSnackbar.snackbar.className =
          "flits-snackbar-container " + options.customClass;
        flitsSnackbar.snackbar.appendChild(options.content);
      } else {
        flitsSnackbar.snackbar = document.createElement("div");
        flitsSnackbar.snackbar.className =
          "flits-snackbar-container " + options.customClass;
        flitsSnackbar.snackbar.style.width = options.width;
        var $p = document.createElement("p");
        $p.style.margin = 0;
        $p.style.padding = 0;
        $p.style.color = options.textColor;
        $p.style.fontSize = "14px";
        $p.style.fontWeight = 300;
        $p.style.lineHeight = "1.2";
        $p.innerHTML = options.text;
        flitsSnackbar.snackbar.appendChild($p);
        flitsSnackbar.snackbar.style.background = options.backgroundColor;
      }
      if (options.showSecondButton) {
        var secondButton = document.createElement("button");
        secondButton.className = "action";
        secondButton.innerHTML = options.secondButtonText;
        secondButton.setAttribute("aria-label", options.secondButtonAria);
        secondButton.style.color = options.secondButtonTextColor;
        secondButton.addEventListener("click", function () {
          options.onSecondButtonClick(flitsSnackbar.snackbar);
        });
        flitsSnackbar.snackbar.appendChild(secondButton);
      }
      if (options.showAction) {
        var actionButton = document.createElement("button");
        actionButton.className = "action";
        actionButton.innerHTML = options.actionText;
        actionButton.setAttribute("aria-label", options.actionTextAria);
        actionButton.style.color = options.actionTextColor;
        actionButton.addEventListener("click", function () {
          options.onActionClick(flitsSnackbar.snackbar);
        });
        flitsSnackbar.snackbar.appendChild(actionButton);
      }
      if (options.duration != false) {
        setTimeout(
          function () {
            if (flitsSnackbar.current === this) {
              flitsSnackbar.current.style.opacity = 0;
              flitsSnackbar.current.style.top = "-100px";
              flitsSnackbar.current.style.bottom = "-100px";
            }
          }.bind(flitsSnackbar.snackbar),
          options.duration
        );
      }
      if (options.alertScreenReader) {
        flitsSnackbar.snackbar.setAttribute("role", "alert");
      }
      flitsSnackbar.snackbar.addEventListener(
        "transitionend",
        function (event, elapsed) {
          if (event.propertyName === "opacity" && this.style.opacity === "0") {
            if (typeof options.onClose === "function") options.onClose(this);
            this.parentElement.removeChild(this);
            if (flitsSnackbar.current === this) {
              flitsSnackbar.current = null;
            }
          }
        }.bind(flitsSnackbar.snackbar)
      );
      flitsSnackbar.current = flitsSnackbar.snackbar;
      Flits(options.container).append(flitsSnackbar.snackbar);
      var $bottom = getComputedStyle(flitsSnackbar.snackbar).bottom;
      var $top = getComputedStyle(flitsSnackbar.snackbar).top;
      flitsSnackbar.snackbar.style.opacity = 1;
      flitsSnackbar.snackbar.className =
        "flits-snackbar-container " +
        options.customClass +
        " flits-snackbar-pos " +
        options.pos;
    };
    flitsSnackbar.close = function () {
      if (flitsSnackbar.current) {
        flitsSnackbar.current.style.opacity = 0;
      }
    };
    var Extend = function () {
      var extended = {};
      var deep = false;
      var i = 0;
      var length = arguments.length;
      if (Object.prototype.toString.call(arguments[0]) === "[object Boolean]") {
        deep = arguments[0];
        i++;
      }
      var merge = function (obj) {
        for (var prop in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            if (
              deep &&
              Object.prototype.toString.call(obj[prop]) === "[object Object]"
            ) {
              extended[prop] = Extend(true, extended[prop], obj[prop]);
            } else {
              extended[prop] = obj[prop];
            }
          }
        }
      };
      for (; i < length; i++) {
        var obj = arguments[i];
        merge(obj);
      }
      return extended;
    };
    return flitsSnackbar;
  });
  var recentlyViewDataStore = (Flits.recentlyViewDataStore = function (item) {
    var settings = {
      queue: "",
      finalQueue: [],
      limit: 9,
      recentHandle: "flits_recently_products",
      recentHandle_1: "flits_recently_products_copy",
    };
    updateProduct();
    if (isPresent(item) == -1) {
      if (isFull()) {
        removeFirstProduct();
      }
      settings.queue.push({ product_handle: item });
      settings.queue.forEach(function (v, i) {
        settings.finalQueue.push({
          product_handle: settings.queue[i].product_handle,
        });
      });
      Flits.setLocalStorage(settings.recentHandle, settings.finalQueue);
    }
    function updateProduct() {
      if (
        Flits.getLocalStorage(settings.recentHandle) == null ||
        Flits.getLocalStorage(settings.recentHandle) == undefined
      ) {
        Flits.setLocalStorage(settings.recentHandle, []);
        settings.queue = Flits.getLocalStorage(settings.recentHandle, []);
      } else {
        settings.queue = Flits.getLocalStorage(settings.recentHandle);
      }
    }
    function isPresent(item) {
      for (let i = 0; i < settings.queue.length; i++) {
        if (settings.queue[i].product_handle.indexOf(item) !== -1) {
          return 1;
        }
      }
      return -1;
    }
    function isFull() {
      return settings.limit == settings.queue.length;
    }
    function removeFirstProduct() {
      settings.queue.splice(0, 1);
    }
  });
  Flits.extend({
    LoadStyleScript: function (index, url, callback) {
      try {
        if (index && window.flitsObjects.allCssJs[index].status) {
          return;
        }
        window.flitsObjects.allCssJs[index].status = 2;
        var isCss = url.indexOf(".css") != -1;
        var tag = isCss
          ? document.createElement("link")
          : document.createElement("script");
        tag.type = isCss ? "text/css" : "text/javascript";
        isCss && (tag.rel = "stylesheet");
        if (tag.readyState) {
          tag.onreadystatechange = function () {
            if (tag.readyState == "loaded" || tag.readyState == "complete") {
              window.flitsObjects.allCssJs[index].status = 1;
              tag.onreadystatechange = null;
              if (typeof callback === "function") {
                callback.apply(this);
              }
            }
          };
        } else {
          tag.onload = function () {
            window.flitsObjects.allCssJs[index].status = 1;
            if (typeof callback === "function") {
              callback.apply(this);
            }
          };
        }
        isCss && (tag.href = url);
        !isCss && (tag.src = url);
        document.getElementsByTagName("head")[0].appendChild(tag);
      } catch (ex) {
        console.error(ex);
      }
    },
    localStorageVar: "flits",
    setLocalStorage: function (k, v) {
      if (localStorage.getItem(Flits.localStorageVar) == null) {
        localStorage.setItem(Flits.localStorageVar, "{}");
        var existing = JSON.parse(localStorage.getItem(Flits.localStorageVar));
        existing[k] = v;
        return localStorage.setItem(
          Flits.localStorageVar,
          JSON.stringify(existing)
        );
      } else {
        var existing = JSON.parse(localStorage.getItem(Flits.localStorageVar));
        existing[k] = v;
        return localStorage.setItem(
          Flits.localStorageVar,
          JSON.stringify(existing)
        );
      }
    },
    getLocalStorage: function (k) {
      var existing = JSON.parse(localStorage.getItem(Flits.localStorageVar));
      var _key = k.split(".");
      var _val = existing;
      if (_key.length > 1) {
        for (let i = 0; i < _key.length; i++) {
          if (_val != null) {
            _val = _val[_key[i]];
          }
        }
      } else {
        if (_val != null) {
          _val = _val[_key[0]];
        }
      }
      return _val;
    },
    getCookie: function (cname) {
      let name = cname + "=";
      let decodedCookie = decodeURIComponent(document.cookie);
      let ca = decodedCookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    },
    setCookie: function (cname, cvalue, exdays) {
      let d = new Date();
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
      let expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },
    styleCreate: function (option) {
      let style = '<style type="text/css">' + option + "</style>";
      Flits("head").append(style);
    },
    isNull: function (x) {
      return typeof x == "undefined" || x == null || x.toString().trim() == "";
    },
    getURLParameter: function (name) {
      return (
        decodeURIComponent(
          (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(
            location.search
          ) || [null, ""])[1].replace(/\+/g, "%20")
        ) || null
      );
    },
    formatMoney: function (cents, format, replaceObject) {
      if (typeof cents == "string") {
        cents = cents.replace(".", "");
      }
      var value = "";
      var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
      var formatString = format || "${{amount}}";
      var replaceRegex =
        Flits.money_format_replace.moneyReplaceRegex || /((\,00)|(\.00))$/g;
      var replaceWith = Flits.money_format_replace.replaceTo || "";
      if (replaceObject) {
        replaceRegex = replaceObject.moneyReplaceRegex;
        replaceWith = replaceObject.replaceTo;
      }
      function defaultOption(opt, def) {
        return typeof opt == "undefined" ? def : opt;
      }
      function formatWithDelimiters(number, precision, thousands, decimal) {
        precision = defaultOption(precision, 2);
        thousands = defaultOption(thousands, ",");
        decimal = defaultOption(decimal, ".");
        if (isNaN(number) || number == null) {
          return "0";
        }
        number = (number / 100.0).toFixed(precision);
        var parts = number.split("."),
          dollars = parts[0].replace(
            /(\d)(?=(\d\d\d)+(?!\d))/g,
            "$1" + thousands
          ),
          cents = parts[1] ? decimal + parts[1] : "";
        return dollars + cents;
      }
      switch (formatString.match(placeholderRegex)[1]) {
        case "amount":
          value = formatWithDelimiters(cents, 2);
          break;
        case "amount_no_decimals":
          value = formatWithDelimiters(cents, 0);
          break;
        case "amount_with_comma_separator":
          value = formatWithDelimiters(cents, 2, ".", ",");
          break;
        case "amount_no_decimals_with_comma_separator":
          value = formatWithDelimiters(cents, 0, ".", ",");
          break;
      }
      return Flits.unescapeHtml(
        formatString.replace(
          placeholderRegex,
          value.replace(replaceRegex, replaceWith)
        )
      ).replace("₹ ","");
    },
    unescapeHtml: function (value) {
      return value
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&#39;/g, "'");
    },
    escapeHtml: function (value) {
      return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/'/g, "&#39;");
    },
    emptySectionShow: function (
      hideSelector,
      parentSelector,
      childSelector,
      showSelector
    ) {
      if (Flits(parentSelector + " " + childSelector).length <= 0) {
        Flits(hideSelector).removeClass("flits-hide");
        Flits(showSelector).addClass("flits-hide");
      } else {
        Flits(hideSelector).addClass("flits-hide");
        Flits(showSelector).removeClass("flits-hide");
      }
    },
    copyClipBoardCode: function (e) {
      let temp = Flits(e)
        .parents(".flits-referral-link-input-wrap")
        .find('input[name="referral link"]');
      temp.select();
      document.execCommand("copy");
    },
    popupWindow: function (url, title, win, w, h) {
      const y = win.top.outerHeight / 2 + win.top.screenY - h / 2;
      const x = win.top.outerWidth / 2 + win.top.screenX - w / 2;
      return win.open(
        url,
        title,
        "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
          w +
          ", height=" +
          h +
          ", top=" +
          y +
          ", left=" +
          x
      );
    },
    t: function (translation_text, default_text) {
      try {
        var translation = translation_text;
        if (translation_text.indexOf("Flits.locals") != -1) {
          translation = eval(translation_text);
        }
        if (
          translation == null ||
          translation == " " ||
          translation == undefined
        ) {
          return default_text;
        } else {
          return translation;
        }
      } catch (err) {}
      return default_text;
    },
    ajaxEventsCallbacks: [],
    fetchEventsCallbacks: [],
    getCart: function () {
      return Flits.ajax({
        url: "/cart.json",
        method: "get",
        data: { app: "flits" },
      });
    },
    redirectToCheckout: function (parameters) {
      parameters = parameters || {};
      var form = Flits(
        Flits.StoreCreditCart.settings.checkoutFormSelectors.join(",")
      );
      if (form.length <= 0) {
        location.href = "/checkout?" + Flits.param(parameters);
        return true;
      }
      var form_action = form.attr("action");
      var form_action_data = Flits.parseURL(form_action);
      Flits.each(parameters, function (index, item) {
        var existing = form.find("[name='" + index + "']");
        if (existing.length <= 0) {
          form.append(
            "<input type='hidden' name='" + index + "' value='" + item + "'>"
          );
        } else {
          existing.val(item);
        }
        if (form_action_data.searchObject[index]) {
          form_action = form_action.replace(
            index + "=" + form_action_data.searchObject[index],
            item
          );
        } else {
          form_action +=
            (form_action.indexOf("?") !== -1 ? "&" : "?") + index + "=" + item;
        }
      });
      form.append("<input type='hidden' name='checkout' value='true'>");
      form.attr("action", form_action);
      form.trigger("submit", [{ flitsFormSubmitted: true }]);
    },
    parseURL: function (url) {
      var parser = document.createElement("a");
      var searchObject = {};
      var queries, split, i;
      parser.href = url;
      queries = parser.search.replace(/^\?/, "").split("&");
      for (i = 0; i < queries.length; i++) {
        split = queries[i].split("=");
        searchObject[split[0]] = split[1];
      }
      return {
        protocol: parser.protocol,
        host: parser.host,
        hostname: parser.hostname,
        port: parser.port,
        pathname: parser.pathname,
        search: parser.search,
        searchObject: searchObject,
        hash: parser.hash,
      };
    },
    newGuid: function () {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
        .replace(/[xy]/g, function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        })
        .toUpperCase();
    },
    dispatchEvent: function (name, data) {
      document.dispatchEvent(
        new CustomEvent(name, { bubbles: true, detail: data })
      );
    },
    listenAjaxEvents: function () {
      const send = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.send = function () {
        this.addEventListener("load", function () {
          let isNeedToCall = false;
          if (this.readyState == 4 && this._url) {
            isNeedToCall = true;
          }
          if (isNeedToCall) {
            var xhrData = this;
            Flits.each(Flits.ajaxEventsCallbacks, function (index, item) {
              item.apply(xhrData, ["ajax"]);
            });
          }
        });
        return send.apply(this, arguments);
      };
    },
    listenFetchEvents: function () {
      if (window.fetch && "function" == typeof window.fetch) {
        const t = window.fetch,
          e = function () {
            const e = t.apply(this, arguments);
            return (
              e
                .then(function (t) {
                  let e = !1;
                  t && 200 === t.status && t.url && (e = !0),
                    e &&
                      ((t._url = t.url),
                      Flits.each(Flits.fetchEventsCallbacks, function (e, o) {
                        o.apply(t, ["fetch"]);
                      }));
                })
                .catch((t) => {}),
              e
            );
          };
        window.fetch = e;
      } else console.log("we have no fetch to observe");
    },
    addAjaxEvents: function (callback) {
      if (typeof callback == "function") {
        Flits.ajaxEventsCallbacks.push(callback);
      }
    },
    addFetchEvents: function (callback) {
      if (typeof callback == "function") {
        Flits.fetchEventsCallbacks.push(callback);
      }
    },
    addToCartAjaxEvent: function () {
      var addToCartFunction = function (xhrOrFetch) {
        var url = this._url;
        if (url.indexOf("/cart/add.js") !== -1) {
          Flits.dispatchEvent("Flits:AjaxCart:ProductAdded", {
            response: this,
            xhrOrFetch: xhrOrFetch,
          });
        }
      };
      Flits.addAjaxEvents(addToCartFunction);
      Flits.addFetchEvents(addToCartFunction);
    },
    updateCartAjaxEvent: function () {
      var updateCartFunction = function (xhrOrFetch) {
        var url = this._url;
        if (
          url.indexOf("/cart/update.js") !== -1 ||
          url.indexOf("/cart/change.js") !== -1
        ) {
          Flits.dispatchEvent("Flits:AjaxCart:CartUpdated", {
            response: this,
            xhrOrFetch: xhrOrFetch,
          });
        }
      };
      Flits.addAjaxEvents(updateCartFunction);
      Flits.addFetchEvents(updateCartFunction);
    },
    clearCartAjaxEvent: function () {
      var clearCartFunction = function (xhrOrFetch) {
        var url = this._url;
        if (url.indexOf("/cart/clear.js") !== -1) {
          Flits.dispatchEvent("Flits:AjaxCart:CartCleared", {
            response: this,
            xhrOrFetch: xhrOrFetch,
          });
        }
      };
      Flits.addAjaxEvents(clearCartFunction);
      Flits.addFetchEvents(clearCartFunction);
    },
    getCartAjaxEvent: function () {
      var getCartFunction = function (xhrOrFetch) {
        var url = this._url;
        if (
          url.indexOf("flits") === -1 &&
          (url.indexOf("/cart.js") !== -1 ||
            url.indexOf("/cart?view=drawer") !== -1)
        ) {
          Flits.dispatchEvent("Flits:AjaxCart:CartRendered", {
            response: this,
            xhrOrFetch: xhrOrFetch,
          });
        }
      };
      Flits.addAjaxEvents(getCartFunction);
      Flits.addFetchEvents(getCartFunction);
    },
    debounce: function (func, wait, immediate) {
      var timeout;
      return function () {
        var context = this,
          args = arguments;
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          timeout = null;
          if (!immediate) {
            func.apply(context, args);
          }
        }, wait);
        if (callNow) func.apply(context, args);
      };
    },
    compareObject: function (obj1, obj2) {
      for (var p in obj1) {
        if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;
        switch (typeof obj1[p]) {
          case "object":
            if (!Flits.compareObject(obj1[p], obj2[p])) return false;
            break;
          case "function":
            if (
              typeof obj2[p] == "undefined" ||
              (p != "compare" && obj1[p].toString() != obj2[p].toString())
            )
              return false;
            break;
          default:
            if (obj1[p] != obj2[p]) return false;
        }
      }
      for (var p in obj2) {
        if (typeof obj1[p] == "undefined") return false;
      }
      return true;
    },
    lightOrDark: function (color) {
      var colorToHex = color;
      if (color.match(/^rgb/)) {
        color = color.match(
          /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
        );
        r = parseInt(color[1]);
        g = parseInt(color[2]);
        b = parseInt(color[3]);
        function rgbToHex(r, g, b) {
          return (
            "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
          );
        }
        colorToHex = rgbToHex(r, g, b);
      } else {
        color = +(
          "0x" + color.slice(1).replace(color.length < 5 && /./g, "$&$&")
        );
        r = color >> 16;
        g = (color >> 8) & 255;
        b = color & 255;
      }
      hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
      if (hsp > 127.5) {
        return Flits.shade(colorToHex, -0.4);
      } else {
        return Flits.shade(colorToHex, 0.4);
      }
    },
    shade: function (color, percent) {
      var f = parseInt(color.slice(1), 16);
      var t = percent < 0 ? 0 : 255;
      var p = percent < 0 ? percent * -1 : percent;
      var R = f >> 16;
      var G = (f >> 8) & 0x00ff;
      var B = f & 0x0000ff;
      var shadeColor =
        "#" +
        (
          0x1000000 +
          (Math.round((t - R) * p) + R) * 0x10000 +
          (Math.round((t - G) * p) + G) * 0x100 +
          (Math.round((t - B) * p) + B)
        )
          .toString(16)
          .slice(1);
      function hexToRgb(hex) {
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
          return r + r + g + g + b + b;
        });
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        var r = parseInt(result[1], 16);
        var g = parseInt(result[2], 16);
        var b = parseInt(result[3], 16);
        return "rgb(" + r + "," + g + "," + b + ")";
      }
      return hexToRgb(shadeColor);
    },
    timeDiffer: function (options) {
      var date1 = options.date1;
      var date2 = options.date2;
      var type = options.type || "day";
      var isAbs = options.isAbsDisabled ? options.isAbsDisabled : false;
      let diff = new Date(date1) - new Date(date2);
      let value;
      if (type == "day") {
        value = Math.floor(diff / 86400000);
      } else if (type == "minute") {
        value = Math.round(diff / 1000);
        value /= 60;
      } else if (type == "hour") {
        value = Math.floor(diff / 1000);
        value /= 60 * 60;
      }
      if (isAbs) {
        return parseInt(value);
      } else {
        return parseInt(Math.abs(value));
      }
    },
    getStoreCredit: function (callback) {
      let url = Flits.base_url + "/" + Flits.customer_id + "/credit/get_credit";
      let params = { customer_hash: Flits.customerHash, token: Flits.token };
      Flits.ajax({ method: "GET", url: url, data: params })
        .done(function (resp) {
          callback(resp);
        })
        .fail(function (resp) {})
        .always(function () {});
    },
    getWishlist: function (callback) {
      let url = Flits.base_url + "/wishlist";
      let params = {
        customer_id: Flits.customer_id,
        customer_hash: Flits.customerHash,
        token: Flits.token,
      };
      Flits.ajax({ method: "GET", url: url, data: params })
        .done(function (resp) {
          callback(resp);
        })
        .fail(function (resp) {})
        .always(function () {});
    },
    rcssescape: /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
    fcssescape: function (ch, asCodePoint) {
      if (asCodePoint) {
        if (ch === "\0") {
          return "�";
        }
        return (
          ch.slice(0, -1) +
          "\\" +
          ch.charCodeAt(ch.length - 1).toString(16) +
          " "
        );
      }
      return "\\" + ch;
    },
    escapeSelectorNavigation: function (sel) {
      return (sel + "").replace(Flits.rcssescape, Flits.fcssescape);
    },
    isTouchEnabled: function () {
      return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
      );
    },
  });
  Flits.listenAjaxEvents();
  Flits.listenFetchEvents();
  Flits.extend(window.flitsObjects.global);
  Flits.extend(window.flitsObjects.storeData);
  // Flits.ajax({
  //   url: window.flitsObjects.storeData.jsonSettingsPath,
  //   method: "GET",
  // })
  //   .done(function (data) {
  //     Flits.dispatchEvent("Flits:Loaded");
  //     Flits.AccountPageDefaultSettings;
  //     window.flitsObjects.accountPage = data;
  //     Flits.extend(window.flitsObjects.accountPage);
  //     Flits.each(window.flitsObjects.allCssJs, function (index, item) {
  //       let isNeedToLoadPage = false;
  //       let isNeedToLoadCondition = false;
  //       switch (true) {
  //         case Flits.inArray("all", item.requestPageType) != -1:
  //           isNeedToLoadPage = true;
  //           break;
  //         case Flits.inArray(
  //           window.flitsObjects.storeData.request.page_type,
  //           item.requestPageType
  //         ) != -1:
  //           isNeedToLoadPage = true;
  //           break;
  //         default:
  //           break;
  //       }
  //       if (!isNeedToLoadPage) {
  //         return true;
  //       }
  //       let metaCount = 0;
  //       Flits.each(item.loadBasedOnMetafields, function (metaIndex, metaName) {
  //         if (Array.isArray(metaName)) {
  //           var op, left, right;
  //           switch (metaName.length) {
  //             case 1:
  //               left = metaName[0];
  //               op = "==";
  //               right = 1;
  //               break;
  //             case 2:
  //               left = metaName[0];
  //               op = "==";
  //               right = metaName[1];
  //               break;
  //             case 3:
  //               left = metaName[0];
  //               op = metaName[1];
  //               right = metaName[2];
  //               break;
  //           }
  //           var str =
  //             "Flits.Metafields['" + left + "'] " + op + " '" + right + "'";
  //           if (eval(str)) {
  //             metaCount++;
  //           }
  //         } else {
  //           if (Flits.Metafields[metaName] == 1) {
  //             metaCount++;
  //           }
  //         }
  //       });
  //       if (metaCount == item.loadBasedOnMetafields.length) {
  //         isNeedToLoadCondition = true;
  //       }
  //       isNeedToLoadCondition && Flits.LoadStyleScript(index, item.url);
  //     });
  //     window.flitsObjects.storeData.request.page_type == "product" &&
  //       window.flitsObjects.storeData.product &&
  //       window.flitsObjects.storeData.product.handle &&
  //       Flits.recentlyViewDataStore(
  //         window.flitsObjects.storeData.product.handle
  //       );
  //     var instances = null;
  //     Flits(document).on("mouseover", "[data-tippy-content]", function (event) {
  //       if (!Flits.isTouchEnabled()) {
  //         if (instances) {
  //           if (instances.length) {
  //             Flits.each(instances, function (i, v) {
  //               instances[i].destroy();
  //             });
  //           } else {
  //             instances.destroy();
  //           }
  //         }
  //         if (event.target.hasAttribute("data-tippy-content")) {
  //           if (Flits(window).width() < 768) {
  //             tippy(event.target).disable();
  //           } else {
  //             let selector = Flits(this)[0];
  //             instances = tippy(selector);
  //           }
  //         }
  //       }
  //     });
  //   })
  //   .fail(function (data) {})
  //   .always(function (data) {});
  function themeJsonResponse(data) {
      Flits.dispatchEvent("Flits:Loaded");
      Flits.AccountPageDefaultSettings;
      window.flitsObjects.accountPage = data;
      Flits.extend(window.flitsObjects.accountPage);
      Flits.each(window.flitsObjects.allCssJs, function (index, item) {
        let isNeedToLoadPage = false;
        let isNeedToLoadCondition = false;
        switch (true) {
          case Flits.inArray("all", item.requestPageType) != -1:
            isNeedToLoadPage = true;
            break;
          case Flits.inArray(
            window.flitsObjects.storeData.request.page_type,
            item.requestPageType
          ) != -1:
            isNeedToLoadPage = true;
            break;
          default:
            break;
        }
        if (!isNeedToLoadPage) {
          return true;
        }
        let metaCount = 0;
        Flits.each(item.loadBasedOnMetafields, function (metaIndex, metaName) {
          if (Array.isArray(metaName)) {
            var op, left, right;
            switch (metaName.length) {
              case 1:
                left = metaName[0];
                op = "==";
                right = 1;
                break;
              case 2:
                left = metaName[0];
                op = "==";
                right = metaName[1];
                break;
              case 3:
                left = metaName[0];
                op = metaName[1];
                right = metaName[2];
                break;
            }
            var str =
              "Flits.Metafields['" + left + "'] " + op + " '" + right + "'";
            if (eval(str)) {
              metaCount++;
            }
          } else {
            if (Flits.Metafields[metaName] == 1) {
              metaCount++;
            }
          }
        });
        if (metaCount == item.loadBasedOnMetafields.length) {
          isNeedToLoadCondition = true;
        }
        isNeedToLoadCondition && Flits.LoadStyleScript(index, item.url);
      });
      window.flitsObjects.storeData.request.page_type == "product" &&
        window.flitsObjects.storeData.product &&
        window.flitsObjects.storeData.product.handle &&
        Flits.recentlyViewDataStore(
          window.flitsObjects.storeData.product.handle
        );
      var instances = null;
      Flits(document).on("mouseover", "[data-tippy-content]", function (event) {
        if (!Flits.isTouchEnabled()) {
          if (instances) {
            if (instances.length) {
              Flits.each(instances, function (i, v) {
                instances[i].destroy();
              });
            } else {
              instances.destroy();
            }
          }
          if (event.target.hasAttribute("data-tippy-content")) {
            if (Flits(window).width() < 768) {
              tippy(event.target).disable();
            } else {
              let selector = Flits(this)[0];
              instances = tippy(selector);
            }
          }
        }
      });
  }
  if(window?.flitsObjects?.global?.Metafields[`THEME_SETTINGS_${window?.flitsObjects?.storeData?.theme?.id}`]){
    themeJsonResponse(window?.flitsObjects?.global?.Metafields[`THEME_SETTINGS_${window?.flitsObjects?.storeData?.theme?.id}`].data)
  }else{
  Flits.ajax({
    url: window.flitsObjects.storeData.jsonSettingsPath,
    // url:window?.flitsObjects?.global?.Metafields[`THEME_SETTINGS_${window?.flitsObjects?.storeData?.theme?.id}`],
    method: "GET",
  })
    .done(function (data) {
     themeJsonResponse(data);   
    })
    .fail(function (data) {})
    .always(function (data) {});
  }
})(Flits);
