/* api.jquery.js */
function floatToString(t, r) {
  var e = t.toFixed(r).toString();
  return e.match(/^\.\d+/) ? "0" + e : e;
}
function attributeToString(t) {
  return (
    "string" != typeof t && "undefined" === (t += "") && (t = ""),
    jQuery.trim(t)
  );
}
"undefined" == typeof window.Shopify && (window.Shopify = {}),
  (Shopify.money_format = "${{amount}}"),
  (Shopify.onError = function (t, r) {
    var e = eval("(" + t.responseText + ")");
    e.message
      ? alert(e.message + "(" + e.status + "): " + e.description)
      : alert("Error : " + Shopify.fullMessagesFromErrors(e).join("; ") + ".");
  }),
  (Shopify.fullMessagesFromErrors = function (t) {
    var o = [];
    return (
      jQuery.each(t, function (e, t) {
        jQuery.each(t, function (t, r) {
          o.push(e + " " + r);
        });
      }),
      o
    );
  }),
  (Shopify.onCartUpdate = function (t) {
    alert("There are now " + t.item_count + " items in the cart.");
  }),
  (Shopify.onCartShippingRatesUpdate = function (t, r) {
    var e = "";
    r.zip && (e += r.zip + ", "),
      r.province && (e += r.province + ", "),
      (e += r.country),
      alert(
        "There are " +
          t.length +
          " shipping rates available for " +
          e +
          ", starting at " +
          Shopify.formatMoney(t[0].price) +
          "."
      );
  }),
  (Shopify.onItemAdded = function (t) {
    alert(t.title + " was added to your shopping cart.");
  }),
  (Shopify.onProduct = function (t) {
    alert("Received everything we ever wanted to know about " + t.title);
  }),
  (Shopify.formatMoney = function (t, r) {
    function n(t, r) {
      return void 0 === t ? r : t;
    }
    function e(t, r, e, o) {
      if (
        ((r = n(r, 2)), (e = n(e, ",")), (o = n(o, ".")), isNaN(t) || null == t)
      )
        return 0;
      var a = (t = (t / 100).toFixed(r)).split(".");
      return (
        a[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + e) +
        (a[1] ? o + a[1] : "")
      );
    }
    "string" == typeof t && (t = t.replace(".", ""));
    var o = "",
      a = /\{\{\s*(\w+)\s*\}\}/,
      i = r || this.money_format;
    switch (i.match(a)[1]) {
      case "amount":
        o = e(t, 2);
        break;
      case "amount_no_decimals":
        o = e(t, 0);
        break;
      case "amount_with_comma_separator":
        o = e(t, 2, ".", ",");
        break;
      case "amount_with_space_separator":
        o = e(t, 2, " ", ",");
        break;
      case "amount_with_period_and_space_separator":
        o = e(t, 2, " ", ".");
        break;
      case "amount_no_decimals_with_comma_separator":
        o = e(t, 0, ".", ",");
        break;
      case "amount_no_decimals_with_space_separator":
        o = e(t, 0, ".", "");
        break;
      case "amount_with_space_separator":
        o = e(t, 2, ",", "");
        break;
      case "amount_with_apostrophe_separator":
        o = e(t, 2, "'", ".");
    }
    return i.replace(a, o);
  }),
  (Shopify.resizeImage = function (t, r) {
    try {
      if ("original" == r) return t;
      var e = t.match(/(.*\/[\w\-\_\.]+)\.(\w{2,4})/);
      return e[1] + "_" + r + "." + e[2];
    } catch (o) {
      return t;
    }
  }),
  (Shopify.addItem = function (t, r, e) {
    var o = {
      type: "POST",
      url: "/cart/add.js",
      data: "quantity=" + (r = r || 1) + "&id=" + t,
      dataType: "json",
      success: function (t) {
        "function" == typeof e ? e(t) : Shopify.onItemAdded(t);
      },
      error: function (t, r) {
        Shopify.onError(t, r);
      },
    };
    jQuery.ajax(o);
  }),
  (Shopify.addItemFromForm = function (t, r) {
    var e = {
      type: "POST",
      url: "/cart/add.js",
      data: jQuery("#" + t).serialize(),
      dataType: "json",
      success: function (t) {
        "function" == typeof r ? r(t) : Shopify.onItemAdded(t);
      },
      error: function (t, r) {
        Shopify.onError(t, r);
      },
    };
    jQuery.ajax(e);
  }),
  (Shopify.getCart = function (r) {
    jQuery.getJSON("/cart.js", function (t) {
      "function" == typeof r ? r(t) : Shopify.onCartUpdate(t);
    });
  }),
  (Shopify.pollForCartShippingRatesForDestination = function (o, a, t) {
    t = t || Shopify.onError;
    var n = function () {
      jQuery.ajax("/cart/async_shipping_rates", {
        dataType: "json",
        success: function (t, r, e) {
          200 === e.status
            ? "function" == typeof a
              ? a(t.shipping_rates, o)
              : Shopify.onCartShippingRatesUpdate(t.shipping_rates, o)
            : setTimeout(n, 500);
        },
        error: t,
      });
    };
    return n;
  }),
  (Shopify.getCartShippingRatesForDestination = function (t, r, e) {
    e = e || Shopify.onError;
    var o = {
      type: "POST",
      url: "/cart/prepare_shipping_rates",
      data: Shopify.param({ shipping_address: t }),
      success: Shopify.pollForCartShippingRatesForDestination(t, r, e),
      error: e,
    };
    jQuery.ajax(o);
  }),
  (Shopify.getProduct = function (t, r) {
    jQuery.getJSON("/products/" + t + ".js", function (t) {
      "function" == typeof r ? r(t) : Shopify.onProduct(t);
    });
  }),
  (Shopify.changeItem = function (t, r, e) {
    var o = {
      type: "POST",
      url: "/cart/change.js",
      data: "quantity=" + r + "&id=" + t,
      dataType: "json",
      success: function (t) {
        "function" == typeof e ? e(t) : Shopify.onCartUpdate(t);
      },
      error: function (t, r) {
        Shopify.onError(t, r);
      },
    };
    jQuery.ajax(o);
  }),
  (Shopify.removeItem = function (t, r) {
    var e = {
      type: "POST",
      url: "/cart/change.js",
      data: "quantity=0&id=" + t,
      dataType: "json",
      success: function (t) {
        "function" == typeof r ? r(t) : Shopify.onCartUpdate(t);
      },
      error: function (t, r) {
        Shopify.onError(t, r);
      },
    };
    jQuery.ajax(e);
  }),
  (Shopify.clear = function (r) {
    var t = {
      type: "POST",
      url: "/cart/clear.js",
      data: "",
      dataType: "json",
      success: function (t) {
        "function" == typeof r ? r(t) : Shopify.onCartUpdate(t);
      },
      error: function (t, r) {
        Shopify.onError(t, r);
      },
    };
    jQuery.ajax(t);
  }),
  (Shopify.updateCartFromForm = function (t, r) {
    var e = {
      type: "POST",
      url: "/cart/update.js",
      data: jQuery("#" + t).serialize(),
      dataType: "json",
      success: function (t) {
        "function" == typeof r ? r(t) : Shopify.onCartUpdate(t);
      },
      error: function (t, r) {
        Shopify.onError(t, r);
      },
    };
    jQuery.ajax(e);
  }),
  (Shopify.updateCartAttributes = function (t, r) {
    var o = "";
    jQuery.isArray(t)
      ? jQuery.each(t, function (t, r) {
          var e = attributeToString(r.key);
          "" !== e &&
            (o += "attributes[" + e + "]=" + attributeToString(r.value) + "&");
        })
      : "object" == typeof t &&
        null !== t &&
        jQuery.each(t, function (t, r) {
          o +=
            "attributes[" +
            attributeToString(t) +
            "]=" +
            attributeToString(r) +
            "&";
        });
    var e = {
      type: "POST",
      url: "/cart/update.js",
      data: o,
      dataType: "json",
      success: function (t) {
        "function" == typeof r ? r(t) : Shopify.onCartUpdate(t);
      },
      error: function (t, r) {
        Shopify.onError(t, r);
      },
    };
    jQuery.ajax(e);
  }),
  (Shopify.updateCartNote = function (t, r) {
    var e = {
      type: "POST",
      url: "/cart/update.js",
      data: "note=" + attributeToString(t),
      dataType: "json",
      success: function (t) {
        "function" == typeof r ? r(t) : Shopify.onCartUpdate(t);
      },
      error: function (t, r) {
        Shopify.onError(t, r);
      },
    };
    jQuery.ajax(e);
  }),
  "1.4" <= jQuery.fn.jquery
    ? (Shopify.param = jQuery.param)
    : ((Shopify.param = function (t) {
        var e = [],
          r = function (t, r) {
            (r = jQuery.isFunction(r) ? r() : r),
              (e[e.length] =
                encodeURIComponent(t) + "=" + encodeURIComponent(r));
          };
        if (jQuery.isArray(t) || t.jquery)
          jQuery.each(t, function () {
            r(this.name, this.value);
          });
        else for (var o in t) Shopify.buildParams(o, t[o], r);
        return e.join("&").replace(/%20/g, "+");
      }),
      (Shopify.buildParams = function (e, t, o) {
        jQuery.isArray(t) && t.length
          ? jQuery.each(t, function (t, r) {
              rbracket.test(e)
                ? o(e, r)
                : Shopify.buildParams(
                    e +
                      "[" +
                      ("object" == typeof r || jQuery.isArray(r) ? t : "") +
                      "]",
                    r,
                    o
                  );
            })
          : null != t && "object" == typeof t
          ? Shopify.isEmptyObject(t)
            ? o(e, "")
            : jQuery.each(t, function (t, r) {
                Shopify.buildParams(e + "[" + t + "]", r, o);
              })
          : o(e, t);
      }),
      (Shopify.isEmptyObject = function (t) {
        for (var r in t) return !1;
        return !0;
      }));
/* Slick */
!(function (i) {
  "use strict";
  "function" == typeof define && define.amd
    ? define(["jquery"], i)
    : "undefined" != typeof exports
    ? (module.exports = i(require("jquery")))
    : i(jQuery);
})(function (i) {
  "use strict";
  var e = window.Slick || {};
  ((e = (function () {
    var e = 0;
    return function (t, o) {
      var s,
        n = this;
      (n.defaults = {
        accessibility: !0,
        adaptiveHeight: !1,
        appendArrows: i(t),
        appendDots: i(t),
        arrows: !0,
        asNavFor: null,
        prevArrow:
          '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
        nextArrow:
          '<button class="slick-next" aria-label="Next" type="button">Next</button>',
        autoplay: !1,
        autoplaySpeed: 3e3,
        centerMode: !1,
        centerPadding: "50px",
        cssEase: "ease",
        customPaging: function (e, t) {
          return i('<button type="button" />').text(t + 1);
        },
        dots: !1,
        dotsClass: "slick-dots",
        draggable: !0,
        easing: "linear",
        edgeFriction: 0.35,
        fade: !1,
        focusOnSelect: !1,
        focusOnChange: !1,
        infinite: !0,
        initialSlide: 0,
        lazyLoad: "ondemand",
        mobileFirst: !1,
        pauseOnHover: !0,
        pauseOnFocus: !0,
        pauseOnDotsHover: !1,
        respondTo: "window",
        responsive: null,
        rows: 1,
        rtl: !1,
        slide: "",
        slidesPerRow: 1,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 500,
        swipe: !0,
        swipeToSlide: !1,
        touchMove: !0,
        touchThreshold: 5,
        useCSS: !0,
        useTransform: !0,
        variableWidth: !1,
        vertical: !1,
        verticalSwiping: !1,
        waitForAnimate: !0,
        zIndex: 1e3,
      }),
        (n.initials = {
          animating: !1,
          dragging: !1,
          autoPlayTimer: null,
          currentDirection: 0,
          currentLeft: null,
          currentSlide: 0,
          direction: 1,
          $dots: null,
          listWidth: null,
          listHeight: null,
          loadIndex: 0,
          $nextArrow: null,
          $prevArrow: null,
          scrolling: !1,
          slideCount: null,
          slideWidth: null,
          $slideTrack: null,
          $slides: null,
          sliding: !1,
          slideOffset: 0,
          swipeLeft: null,
          swiping: !1,
          $list: null,
          touchObject: {},
          transformsEnabled: !1,
          unslicked: !1,
        }),
        i.extend(n, n.initials),
        (n.activeBreakpoint = null),
        (n.animType = null),
        (n.animProp = null),
        (n.breakpoints = []),
        (n.breakpointSettings = []),
        (n.cssTransitions = !1),
        (n.focussed = !1),
        (n.interrupted = !1),
        (n.hidden = "hidden"),
        (n.paused = !0),
        (n.positionProp = null),
        (n.respondTo = null),
        (n.rowCount = 1),
        (n.shouldClick = !0),
        (n.$slider = i(t)),
        (n.$slidesCache = null),
        (n.transformType = null),
        (n.transitionType = null),
        (n.visibilityChange = "visibilitychange"),
        (n.windowWidth = 0),
        (n.windowTimer = null),
        (s = i(t).data("slick") || {}),
        (n.options = i.extend({}, n.defaults, o, s)),
        (n.currentSlide = n.options.initialSlide),
        (n.originalSettings = n.options),
        void 0 !== document.mozHidden
          ? ((n.hidden = "mozHidden"),
            (n.visibilityChange = "mozvisibilitychange"))
          : void 0 !== document.webkitHidden &&
            ((n.hidden = "webkitHidden"),
            (n.visibilityChange = "webkitvisibilitychange")),
        (n.autoPlay = i.proxy(n.autoPlay, n)),
        (n.autoPlayClear = i.proxy(n.autoPlayClear, n)),
        (n.autoPlayIterator = i.proxy(n.autoPlayIterator, n)),
        (n.changeSlide = i.proxy(n.changeSlide, n)),
        (n.clickHandler = i.proxy(n.clickHandler, n)),
        (n.selectHandler = i.proxy(n.selectHandler, n)),
        (n.setPosition = i.proxy(n.setPosition, n)),
        (n.swipeHandler = i.proxy(n.swipeHandler, n)),
        (n.dragHandler = i.proxy(n.dragHandler, n)),
        (n.keyHandler = i.proxy(n.keyHandler, n)),
        (n.instanceUid = e++),
        (n.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/),
        n.registerBreakpoints(),
        n.init(!0);
    };
  })()).prototype.activateADA = function () {
    this.$slideTrack
      .find(".slick-active")
      .attr({ "aria-hidden": "false" })
      .find("a, input, button, select")
      .attr({ tabindex: "0" });
  }),
    (e.prototype.addSlide = e.prototype.slickAdd =
      function (e, t, o) {
        var s = this;
        if ("boolean" == typeof t) (o = t), (t = null);
        else if (t < 0 || t >= s.slideCount) return !1;
        s.unload(),
          "number" == typeof t
            ? 0 === t && 0 === s.$slides.length
              ? i(e).appendTo(s.$slideTrack)
              : o
              ? i(e).insertBefore(s.$slides.eq(t))
              : i(e).insertAfter(s.$slides.eq(t))
            : !0 === o
            ? i(e).prependTo(s.$slideTrack)
            : i(e).appendTo(s.$slideTrack),
          (s.$slides = s.$slideTrack.children(this.options.slide)),
          s.$slideTrack.children(this.options.slide).detach(),
          s.$slideTrack.append(s.$slides),
          s.$slides.each(function (e, t) {
            i(t).attr("data-slick-index", e);
          }),
          (s.$slidesCache = s.$slides),
          s.reinit();
      }),
    (e.prototype.animateHeight = function () {
      var i = this;
      if (
        1 === i.options.slidesToShow &&
        !0 === i.options.adaptiveHeight &&
        !1 === i.options.vertical
      ) {
        var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
        i.$list.animate({ height: e }, i.options.speed);
      }
    }),
    (e.prototype.animateSlide = function (e, t) {
      var o = {},
        s = this;
      s.animateHeight(),
        !0 === s.options.rtl && !1 === s.options.vertical && (e = -e),
        !1 === s.transformsEnabled
          ? !1 === s.options.vertical
            ? s.$slideTrack.animate(
                { left: e },
                s.options.speed,
                s.options.easing,
                t
              )
            : s.$slideTrack.animate(
                { top: e },
                s.options.speed,
                s.options.easing,
                t
              )
          : !1 === s.cssTransitions
          ? (!0 === s.options.rtl && (s.currentLeft = -s.currentLeft),
            i({ animStart: s.currentLeft }).animate(
              { animStart: e },
              {
                duration: s.options.speed,
                easing: s.options.easing,
                step: function (i) {
                  (i = Math.ceil(i)),
                    !1 === s.options.vertical
                      ? ((o[s.animType] = "translate(" + i + "px, 0px)"),
                        s.$slideTrack.css(o))
                      : ((o[s.animType] = "translate(0px," + i + "px)"),
                        s.$slideTrack.css(o));
                },
                complete: function () {
                  t && t.call();
                },
              }
            ))
          : (s.applyTransition(),
            (e = Math.ceil(e)),
            !1 === s.options.vertical
              ? (o[s.animType] = "translate3d(" + e + "px, 0px, 0px)")
              : (o[s.animType] = "translate3d(0px," + e + "px, 0px)"),
            s.$slideTrack.css(o),
            t &&
              setTimeout(function () {
                s.disableTransition(), t.call();
              }, s.options.speed));
    }),
    (e.prototype.getNavTarget = function () {
      var e = this,
        t = e.options.asNavFor;
      return t && null !== t && (t = i(t).not(e.$slider)), t;
    }),
    (e.prototype.asNavFor = function (e) {
      var t = this.getNavTarget();
      null !== t &&
        "object" == typeof t &&
        t.each(function () {
          var t = i(this).slick("getSlick");
          t.unslicked || t.slideHandler(e, !0);
        });
    }),
    (e.prototype.applyTransition = function (i) {
      var e = this,
        t = {};
      !1 === e.options.fade
        ? (t[e.transitionType] =
            e.transformType + " " + e.options.speed + "ms " + e.options.cssEase)
        : (t[e.transitionType] =
            "opacity " + e.options.speed + "ms " + e.options.cssEase),
        !1 === e.options.fade ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t);
    }),
    (e.prototype.autoPlay = function () {
      var i = this;
      i.autoPlayClear(),
        i.slideCount > i.options.slidesToShow &&
          (i.autoPlayTimer = setInterval(
            i.autoPlayIterator,
            i.options.autoplaySpeed
          ));
    }),
    (e.prototype.autoPlayClear = function () {
      var i = this;
      i.autoPlayTimer && clearInterval(i.autoPlayTimer);
    }),
    (e.prototype.autoPlayIterator = function () {
      var i = this,
        e = i.currentSlide + i.options.slidesToScroll;
      i.paused ||
        i.interrupted ||
        i.focussed ||
        (!1 === i.options.infinite &&
          (1 === i.direction && i.currentSlide + 1 === i.slideCount - 1
            ? (i.direction = 0)
            : 0 === i.direction &&
              ((e = i.currentSlide - i.options.slidesToScroll),
              i.currentSlide - 1 == 0 && (i.direction = 1))),
        i.slideHandler(e));
    }),
    (e.prototype.buildArrows = function () {
      var e = this;
      !0 === e.options.arrows &&
        ((e.$prevArrow = i(e.options.prevArrow).addClass("slick-arrow")),
        (e.$nextArrow = i(e.options.nextArrow).addClass("slick-arrow")),
        e.slideCount > e.options.slidesToShow
          ? (e.$prevArrow
              .removeClass("slick-hidden")
              .removeAttr("aria-hidden tabindex"),
            e.$nextArrow
              .removeClass("slick-hidden")
              .removeAttr("aria-hidden tabindex"),
            e.htmlExpr.test(e.options.prevArrow) &&
              e.$prevArrow.prependTo(e.options.appendArrows),
            e.htmlExpr.test(e.options.nextArrow) &&
              e.$nextArrow.appendTo(e.options.appendArrows),
            !0 !== e.options.infinite &&
              e.$prevArrow
                .addClass("slick-disabled")
                .attr("aria-disabled", "true"))
          : e.$prevArrow
              .add(e.$nextArrow)
              .addClass("slick-hidden")
              .attr({ "aria-disabled": "true", tabindex: "-1" }));
    }),
    (e.prototype.buildDots = function () {
      var e,
        t,
        o = this;
      if (!0 === o.options.dots) {
        for (
          o.$slider.addClass("slick-dotted"),
            t = i("<ul />").addClass(o.options.dotsClass),
            e = 0;
          e <= o.getDotCount();
          e += 1
        )
          t.append(i("<li />").append(o.options.customPaging.call(this, o, e)));
        (o.$dots = t.appendTo(o.options.appendDots)),
          o.$dots.find("li").first().addClass("slick-active");
      }
    }),
    (e.prototype.buildOut = function () {
      var e = this;
      (e.$slides = e.$slider
        .children(e.options.slide + ":not(.slick-cloned)")
        .addClass("slick-slide")),
        (e.slideCount = e.$slides.length),
        e.$slides.each(function (e, t) {
          i(t)
            .attr("data-slick-index", e)
            .data("originalStyling", i(t).attr("style") || "");
        }),
        e.$slider.addClass("slick-slider"),
        (e.$slideTrack =
          0 === e.slideCount
            ? i('<div class="slick-track"/>').appendTo(e.$slider)
            : e.$slides.wrapAll('<div class="slick-track"/>').parent()),
        (e.$list = e.$slideTrack.wrap('<div class="slick-list"/>').parent()),
        e.$slideTrack.css("opacity", 0),
        (!0 !== e.options.centerMode && !0 !== e.options.swipeToSlide) ||
          (e.options.slidesToScroll = 1),
        i("img[data-lazy]", e.$slider).not("[src]").addClass("slick-loading"),
        e.setupInfinite(),
        e.buildArrows(),
        e.buildDots(),
        e.updateDots(),
        e.setSlideClasses(
          "number" == typeof e.currentSlide ? e.currentSlide : 0
        ),
        !0 === e.options.draggable && e.$list.addClass("draggable");
    }),
    (e.prototype.buildRows = function () {
      var i,
        e,
        t,
        o,
        s,
        n,
        r,
        l = this;
      if (
        ((o = document.createDocumentFragment()),
        (n = l.$slider.children()),
        l.options.rows > 1)
      ) {
        for (
          r = l.options.slidesPerRow * l.options.rows,
            s = Math.ceil(n.length / r),
            i = 0;
          i < s;
          i++
        ) {
          var d = document.createElement("div");
          for (e = 0; e < l.options.rows; e++) {
            var a = document.createElement("div");
            for (t = 0; t < l.options.slidesPerRow; t++) {
              var c = i * r + (e * l.options.slidesPerRow + t);
              n.get(c) && a.appendChild(n.get(c));
            }
            d.appendChild(a);
          }
          o.appendChild(d);
        }
        l.$slider.empty().append(o),
          l.$slider
            .children()
            .children()
            .children()
            .css({
              width: 100 / l.options.slidesPerRow + "%",
              display: "inline-block",
            });
      }
    }),
    (e.prototype.checkResponsive = function (e, t) {
      var o,
        s,
        n,
        r = this,
        l = !1,
        d = r.$slider.width(),
        a = window.innerWidth || i(window).width();
      if (
        ("window" === r.respondTo
          ? (n = a)
          : "slider" === r.respondTo
          ? (n = d)
          : "min" === r.respondTo && (n = Math.min(a, d)),
        r.options.responsive &&
          r.options.responsive.length &&
          null !== r.options.responsive)
      ) {
        s = null;
        for (o in r.breakpoints)
          r.breakpoints.hasOwnProperty(o) &&
            (!1 === r.originalSettings.mobileFirst
              ? n < r.breakpoints[o] && (s = r.breakpoints[o])
              : n > r.breakpoints[o] && (s = r.breakpoints[o]));
        null !== s
          ? null !== r.activeBreakpoint
            ? (s !== r.activeBreakpoint || t) &&
              ((r.activeBreakpoint = s),
              "unslick" === r.breakpointSettings[s]
                ? r.unslick(s)
                : ((r.options = i.extend(
                    {},
                    r.originalSettings,
                    r.breakpointSettings[s]
                  )),
                  !0 === e && (r.currentSlide = r.options.initialSlide),
                  r.refresh(e)),
              (l = s))
            : ((r.activeBreakpoint = s),
              "unslick" === r.breakpointSettings[s]
                ? r.unslick(s)
                : ((r.options = i.extend(
                    {},
                    r.originalSettings,
                    r.breakpointSettings[s]
                  )),
                  !0 === e && (r.currentSlide = r.options.initialSlide),
                  r.refresh(e)),
              (l = s))
          : null !== r.activeBreakpoint &&
            ((r.activeBreakpoint = null),
            (r.options = r.originalSettings),
            !0 === e && (r.currentSlide = r.options.initialSlide),
            r.refresh(e),
            (l = s)),
          e || !1 === l || r.$slider.trigger("breakpoint", [r, l]);
      }
    }),
    (e.prototype.changeSlide = function (e, t) {
      var o,
        s,
        n,
        r = this,
        l = i(e.currentTarget);
      switch (
        (l.is("a") && e.preventDefault(),
        l.is("li") || (l = l.closest("li")),
        (n = r.slideCount % r.options.slidesToScroll != 0),
        (o = n
          ? 0
          : (r.slideCount - r.currentSlide) % r.options.slidesToScroll),
        e.data.message)
      ) {
        case "previous":
          (s = 0 === o ? r.options.slidesToScroll : r.options.slidesToShow - o),
            r.slideCount > r.options.slidesToShow &&
              r.slideHandler(r.currentSlide - s, !1, t);
          break;
        case "next":
          (s = 0 === o ? r.options.slidesToScroll : o),
            r.slideCount > r.options.slidesToShow &&
              r.slideHandler(r.currentSlide + s, !1, t);
          break;
        case "index":
          var d =
            0 === e.data.index
              ? 0
              : e.data.index || l.index() * r.options.slidesToScroll;
          r.slideHandler(r.checkNavigable(d), !1, t),
            l.children().trigger("focus");
          break;
        default:
          return;
      }
    }),
    (e.prototype.checkNavigable = function (i) {
      var e, t;
      if (((e = this.getNavigableIndexes()), (t = 0), i > e[e.length - 1]))
        i = e[e.length - 1];
      else
        for (var o in e) {
          if (i < e[o]) {
            i = t;
            break;
          }
          t = e[o];
        }
      return i;
    }),
    (e.prototype.cleanUpEvents = function () {
      var e = this;
      e.options.dots &&
        null !== e.$dots &&
        (i("li", e.$dots)
          .off("click.slick", e.changeSlide)
          .off("mouseenter.slick", i.proxy(e.interrupt, e, !0))
          .off("mouseleave.slick", i.proxy(e.interrupt, e, !1)),
        !0 === e.options.accessibility &&
          e.$dots.off("keydown.slick", e.keyHandler)),
        e.$slider.off("focus.slick blur.slick"),
        !0 === e.options.arrows &&
          e.slideCount > e.options.slidesToShow &&
          (e.$prevArrow && e.$prevArrow.off("click.slick", e.changeSlide),
          e.$nextArrow && e.$nextArrow.off("click.slick", e.changeSlide),
          !0 === e.options.accessibility &&
            (e.$prevArrow && e.$prevArrow.off("keydown.slick", e.keyHandler),
            e.$nextArrow && e.$nextArrow.off("keydown.slick", e.keyHandler))),
        e.$list.off("touchstart.slick mousedown.slick", e.swipeHandler),
        e.$list.off("touchmove.slick mousemove.slick", e.swipeHandler),
        e.$list.off("touchend.slick mouseup.slick", e.swipeHandler),
        e.$list.off("touchcancel.slick mouseleave.slick", e.swipeHandler),
        e.$list.off("click.slick", e.clickHandler),
        i(document).off(e.visibilityChange, e.visibility),
        e.cleanUpSlideEvents(),
        !0 === e.options.accessibility &&
          e.$list.off("keydown.slick", e.keyHandler),
        !0 === e.options.focusOnSelect &&
          i(e.$slideTrack).children().off("click.slick", e.selectHandler),
        i(window).off(
          "orientationchange.slick.slick-" + e.instanceUid,
          e.orientationChange
        ),
        i(window).off("resize.slick.slick-" + e.instanceUid, e.resize),
        i("[draggable!=true]", e.$slideTrack).off(
          "dragstart",
          e.preventDefault
        ),
        i(window).off("load.slick.slick-" + e.instanceUid, e.setPosition);
    }),
    (e.prototype.cleanUpSlideEvents = function () {
      var e = this;
      e.$list.off("mouseenter.slick", i.proxy(e.interrupt, e, !0)),
        e.$list.off("mouseleave.slick", i.proxy(e.interrupt, e, !1));
    }),
    (e.prototype.cleanUpRows = function () {
      var i,
        e = this;
      e.options.rows > 1 &&
        ((i = e.$slides.children().children()).removeAttr("style"),
        e.$slider.empty().append(i));
    }),
    (e.prototype.clickHandler = function (i) {
      !1 === this.shouldClick &&
        (i.stopImmediatePropagation(), i.stopPropagation(), i.preventDefault());
    }),
    (e.prototype.destroy = function (e) {
      var t = this;
      t.autoPlayClear(),
        (t.touchObject = {}),
        t.cleanUpEvents(),
        i(".slick-cloned", t.$slider).detach(),
        t.$dots && t.$dots.remove(),
        t.$prevArrow &&
          t.$prevArrow.length &&
          (t.$prevArrow
            .removeClass("slick-disabled slick-arrow slick-hidden")
            .removeAttr("aria-hidden aria-disabled tabindex")
            .css("display", ""),
          t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.remove()),
        t.$nextArrow &&
          t.$nextArrow.length &&
          (t.$nextArrow
            .removeClass("slick-disabled slick-arrow slick-hidden")
            .removeAttr("aria-hidden aria-disabled tabindex")
            .css("display", ""),
          t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.remove()),
        t.$slides &&
          (t.$slides
            .removeClass(
              "slick-slide slick-active slick-center slick-visible slick-current"
            )
            .removeAttr("aria-hidden")
            .removeAttr("data-slick-index")
            .each(function () {
              i(this).attr("style", i(this).data("originalStyling"));
            }),
          t.$slideTrack.children(this.options.slide).detach(),
          t.$slideTrack.detach(),
          t.$list.detach(),
          t.$slider.append(t.$slides)),
        t.cleanUpRows(),
        t.$slider.removeClass("slick-slider"),
        t.$slider.removeClass("slick-initialized"),
        t.$slider.removeClass("slick-dotted"),
        (t.unslicked = !0),
        e || t.$slider.trigger("destroy", [t]);
    }),
    (e.prototype.disableTransition = function (i) {
      var e = this,
        t = {};
      (t[e.transitionType] = ""),
        !1 === e.options.fade ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t);
    }),
    (e.prototype.fadeSlide = function (i, e) {
      var t = this;
      !1 === t.cssTransitions
        ? (t.$slides.eq(i).css({ zIndex: t.options.zIndex }),
          t.$slides
            .eq(i)
            .animate({ opacity: 1 }, t.options.speed, t.options.easing, e))
        : (t.applyTransition(i),
          t.$slides.eq(i).css({ opacity: 1, zIndex: t.options.zIndex }),
          e &&
            setTimeout(function () {
              t.disableTransition(i), e.call();
            }, t.options.speed));
    }),
    (e.prototype.fadeSlideOut = function (i) {
      var e = this;
      !1 === e.cssTransitions
        ? e.$slides
            .eq(i)
            .animate(
              { opacity: 0, zIndex: e.options.zIndex - 2 },
              e.options.speed,
              e.options.easing
            )
        : (e.applyTransition(i),
          e.$slides.eq(i).css({ opacity: 0, zIndex: e.options.zIndex - 2 }));
    }),
    (e.prototype.filterSlides = e.prototype.slickFilter =
      function (i) {
        var e = this;
        null !== i &&
          ((e.$slidesCache = e.$slides),
          e.unload(),
          e.$slideTrack.children(this.options.slide).detach(),
          e.$slidesCache.filter(i).appendTo(e.$slideTrack),
          e.reinit());
      }),
    (e.prototype.focusHandler = function () {
      var e = this;
      e.$slider
        .off("focus.slick blur.slick")
        .on("focus.slick blur.slick", "*", function (t) {
          t.stopImmediatePropagation();
          var o = i(this);
          setTimeout(function () {
            e.options.pauseOnFocus &&
              ((e.focussed = o.is(":focus")), e.autoPlay());
          }, 0);
        });
    }),
    (e.prototype.getCurrent = e.prototype.slickCurrentSlide =
      function () {
        return this.currentSlide;
      }),
    (e.prototype.getDotCount = function () {
      var i = this,
        e = 0,
        t = 0,
        o = 0;
      if (!0 === i.options.infinite)
        if (i.slideCount <= i.options.slidesToShow) ++o;
        else
          for (; e < i.slideCount; )
            ++o,
              (e = t + i.options.slidesToScroll),
              (t +=
                i.options.slidesToScroll <= i.options.slidesToShow
                  ? i.options.slidesToScroll
                  : i.options.slidesToShow);
      else if (!0 === i.options.centerMode) o = i.slideCount;
      else if (i.options.asNavFor)
        for (; e < i.slideCount; )
          ++o,
            (e = t + i.options.slidesToScroll),
            (t +=
              i.options.slidesToScroll <= i.options.slidesToShow
                ? i.options.slidesToScroll
                : i.options.slidesToShow);
      else
        o =
          1 +
          Math.ceil(
            (i.slideCount - i.options.slidesToShow) / i.options.slidesToScroll
          );
      return o - 1;
    }),
    (e.prototype.getLeft = function (i) {
      var e,
        t,
        o,
        s,
        n = this,
        r = 0;
      return (
        (n.slideOffset = 0),
        (t = n.$slides.first().outerHeight(!0)),
        !0 === n.options.infinite
          ? (n.slideCount > n.options.slidesToShow &&
              ((n.slideOffset = n.slideWidth * n.options.slidesToShow * -1),
              (s = -1),
              !0 === n.options.vertical &&
                !0 === n.options.centerMode &&
                (2 === n.options.slidesToShow
                  ? (s = -1.5)
                  : 1 === n.options.slidesToShow && (s = -2)),
              (r = t * n.options.slidesToShow * s)),
            n.slideCount % n.options.slidesToScroll != 0 &&
              i + n.options.slidesToScroll > n.slideCount &&
              n.slideCount > n.options.slidesToShow &&
              (i > n.slideCount
                ? ((n.slideOffset =
                    (n.options.slidesToShow - (i - n.slideCount)) *
                    n.slideWidth *
                    -1),
                  (r = (n.options.slidesToShow - (i - n.slideCount)) * t * -1))
                : ((n.slideOffset =
                    (n.slideCount % n.options.slidesToScroll) *
                    n.slideWidth *
                    -1),
                  (r = (n.slideCount % n.options.slidesToScroll) * t * -1))))
          : i + n.options.slidesToShow > n.slideCount &&
            ((n.slideOffset =
              (i + n.options.slidesToShow - n.slideCount) * n.slideWidth),
            (r = (i + n.options.slidesToShow - n.slideCount) * t)),
        n.slideCount <= n.options.slidesToShow &&
          ((n.slideOffset = 0), (r = 0)),
        !0 === n.options.centerMode && n.slideCount <= n.options.slidesToShow
          ? (n.slideOffset =
              (n.slideWidth * Math.floor(n.options.slidesToShow)) / 2 -
              (n.slideWidth * n.slideCount) / 2)
          : !0 === n.options.centerMode && !0 === n.options.infinite
          ? (n.slideOffset +=
              n.slideWidth * Math.floor(n.options.slidesToShow / 2) -
              n.slideWidth)
          : !0 === n.options.centerMode &&
            ((n.slideOffset = 0),
            (n.slideOffset +=
              n.slideWidth * Math.floor(n.options.slidesToShow / 2))),
        (e =
          !1 === n.options.vertical
            ? i * n.slideWidth * -1 + n.slideOffset
            : i * t * -1 + r),
        !0 === n.options.variableWidth &&
          ((o =
            n.slideCount <= n.options.slidesToShow || !1 === n.options.infinite
              ? n.$slideTrack.children(".slick-slide").eq(i)
              : n.$slideTrack
                  .children(".slick-slide")
                  .eq(i + n.options.slidesToShow)),
          (e =
            !0 === n.options.rtl
              ? o[0]
                ? -1 * (n.$slideTrack.width() - o[0].offsetLeft - o.width())
                : 0
              : o[0]
              ? -1 * o[0].offsetLeft
              : 0),
          !0 === n.options.centerMode &&
            ((o =
              n.slideCount <= n.options.slidesToShow ||
              !1 === n.options.infinite
                ? n.$slideTrack.children(".slick-slide").eq(i)
                : n.$slideTrack
                    .children(".slick-slide")
                    .eq(i + n.options.slidesToShow + 1)),
            (e =
              !0 === n.options.rtl
                ? o[0]
                  ? -1 * (n.$slideTrack.width() - o[0].offsetLeft - o.width())
                  : 0
                : o[0]
                ? -1 * o[0].offsetLeft
                : 0),
            (e += (n.$list.width() - o.outerWidth()) / 2))),
        e
      );
    }),
    (e.prototype.getOption = e.prototype.slickGetOption =
      function (i) {
        return this.options[i];
      }),
    (e.prototype.getNavigableIndexes = function () {
      var i,
        e = this,
        t = 0,
        o = 0,
        s = [];
      for (
        !1 === e.options.infinite
          ? (i = e.slideCount)
          : ((t = -1 * e.options.slidesToScroll),
            (o = -1 * e.options.slidesToScroll),
            (i = 2 * e.slideCount));
        t < i;

      )
        s.push(t),
          (t = o + e.options.slidesToScroll),
          (o +=
            e.options.slidesToScroll <= e.options.slidesToShow
              ? e.options.slidesToScroll
              : e.options.slidesToShow);
      return s;
    }),
    (e.prototype.getSlick = function () {
      return this;
    }),
    (e.prototype.getSlideCount = function () {
      var e,
        t,
        o = this;
      return (
        (t =
          !0 === o.options.centerMode
            ? o.slideWidth * Math.floor(o.options.slidesToShow / 2)
            : 0),
        !0 === o.options.swipeToSlide
          ? (o.$slideTrack.find(".slick-slide").each(function (s, n) {
              if (n.offsetLeft - t + i(n).outerWidth() / 2 > -1 * o.swipeLeft)
                return (e = n), !1;
            }),
            Math.abs(i(e).attr("data-slick-index") - o.currentSlide) || 1)
          : o.options.slidesToScroll
      );
    }),
    (e.prototype.goTo = e.prototype.slickGoTo =
      function (i, e) {
        this.changeSlide({ data: { message: "index", index: parseInt(i) } }, e);
      }),
    (e.prototype.init = function (e) {
      var t = this;
      i(t.$slider).hasClass("slick-initialized") ||
        (i(t.$slider).addClass("slick-initialized"),
        t.buildRows(),
        t.buildOut(),
        t.setProps(),
        t.startLoad(),
        t.loadSlider(),
        t.initializeEvents(),
        t.updateArrows(),
        t.updateDots(),
        t.checkResponsive(!0),
        t.focusHandler()),
        e && t.$slider.trigger("init", [t]),
        !0 === t.options.accessibility && t.initADA(),
        t.options.autoplay && ((t.paused = !1), t.autoPlay());
    }),
    (e.prototype.initADA = function () {
      var e = this,
        t = Math.ceil(e.slideCount / e.options.slidesToShow),
        o = e.getNavigableIndexes().filter(function (i) {
          return i >= 0 && i < e.slideCount;
        });
      e.$slides
        .add(e.$slideTrack.find(".slick-cloned"))
        .attr({ "aria-hidden": "true", tabindex: "-1" })
        .find("a, input, button, select")
        .attr({ tabindex: "-1" }),
        null !== e.$dots &&
          (e.$slides
            .not(e.$slideTrack.find(".slick-cloned"))
            .each(function (t) {
              var s = o.indexOf(t);
              i(this).attr({
                role: "tabpanel",
                id: "slick-slide" + e.instanceUid + t,
                tabindex: -1,
              }),
                -1 !== s &&
                  i(this).attr({
                    "aria-describedby":
                      "slick-slide-control" + e.instanceUid + s,
                  });
            }),
          e.$dots
            .attr("role", "tablist")
            .find("li")
            .each(function (s) {
              var n = o[s];
              i(this).attr({ role: "presentation" }),
                i(this)
                  .find("button")
                  .first()
                  .attr({
                    role: "tab",
                    id: "slick-slide-control" + e.instanceUid + s,
                    "aria-controls": "slick-slide" + e.instanceUid + n,
                    "aria-label": s + 1 + " of " + t,
                    "aria-selected": null,
                    tabindex: "-1",
                  });
            })
            .eq(e.currentSlide)
            .find("button")
            .attr({ "aria-selected": "true", tabindex: "0" })
            .end());
      for (var s = e.currentSlide, n = s + e.options.slidesToShow; s < n; s++)
        e.$slides.eq(s).attr("tabindex", 0);
      e.activateADA();
    }),
    (e.prototype.initArrowEvents = function () {
      var i = this;
      !0 === i.options.arrows &&
        i.slideCount > i.options.slidesToShow &&
        (i.$prevArrow
          .off("click.slick")
          .on("click.slick", { message: "previous" }, i.changeSlide),
        i.$nextArrow
          .off("click.slick")
          .on("click.slick", { message: "next" }, i.changeSlide),
        !0 === i.options.accessibility &&
          (i.$prevArrow.on("keydown.slick", i.keyHandler),
          i.$nextArrow.on("keydown.slick", i.keyHandler)));
    }),
    (e.prototype.initDotEvents = function () {
      var e = this;
      !0 === e.options.dots &&
        (i("li", e.$dots).on(
          "click.slick",
          { message: "index" },
          e.changeSlide
        ),
        !0 === e.options.accessibility &&
          e.$dots.on("keydown.slick", e.keyHandler)),
        !0 === e.options.dots &&
          !0 === e.options.pauseOnDotsHover &&
          i("li", e.$dots)
            .on("mouseenter.slick", i.proxy(e.interrupt, e, !0))
            .on("mouseleave.slick", i.proxy(e.interrupt, e, !1));
    }),
    (e.prototype.initSlideEvents = function () {
      var e = this;
      e.options.pauseOnHover &&
        (e.$list.on("mouseenter.slick", i.proxy(e.interrupt, e, !0)),
        e.$list.on("mouseleave.slick", i.proxy(e.interrupt, e, !1)));
    }),
    (e.prototype.initializeEvents = function () {
      var e = this;
      e.initArrowEvents(),
        e.initDotEvents(),
        e.initSlideEvents(),
        e.$list.on(
          "touchstart.slick mousedown.slick",
          { action: "start" },
          e.swipeHandler
        ),
        e.$list.on(
          "touchmove.slick mousemove.slick",
          { action: "move" },
          e.swipeHandler
        ),
        e.$list.on(
          "touchend.slick mouseup.slick",
          { action: "end" },
          e.swipeHandler
        ),
        e.$list.on(
          "touchcancel.slick mouseleave.slick",
          { action: "end" },
          e.swipeHandler
        ),
        e.$list.on("click.slick", e.clickHandler),
        i(document).on(e.visibilityChange, i.proxy(e.visibility, e)),
        !0 === e.options.accessibility &&
          e.$list.on("keydown.slick", e.keyHandler),
        !0 === e.options.focusOnSelect &&
          i(e.$slideTrack).children().on("click.slick", e.selectHandler),
        i(window).on(
          "orientationchange.slick.slick-" + e.instanceUid,
          i.proxy(e.orientationChange, e)
        ),
        i(window).on(
          "resize.slick.slick-" + e.instanceUid,
          i.proxy(e.resize, e)
        ),
        i("[draggable!=true]", e.$slideTrack).on("dragstart", e.preventDefault),
        i(window).on("load.slick.slick-" + e.instanceUid, e.setPosition),
        i(e.setPosition);
    }),
    (e.prototype.initUI = function () {
      var i = this;
      !0 === i.options.arrows &&
        i.slideCount > i.options.slidesToShow &&
        (i.$prevArrow.show(), i.$nextArrow.show()),
        !0 === i.options.dots &&
          i.slideCount > i.options.slidesToShow &&
          i.$dots.show();
    }),
    (e.prototype.keyHandler = function (i) {
      var e = this;
      i.target.tagName.match("TEXTAREA|INPUT|SELECT") ||
        (37 === i.keyCode && !0 === e.options.accessibility
          ? e.changeSlide({
              data: { message: !0 === e.options.rtl ? "next" : "previous" },
            })
          : 39 === i.keyCode &&
            !0 === e.options.accessibility &&
            e.changeSlide({
              data: { message: !0 === e.options.rtl ? "previous" : "next" },
            }));
    }),
    (e.prototype.lazyLoad = function () {
      function e(e) {
        i("img[data-lazy]", e).each(function () {
          var e = i(this),
            t = i(this).attr("data-lazy"),
            o = i(this).attr("data-srcset"),
            s = i(this).attr("data-sizes") || n.$slider.attr("data-sizes"),
            r = document.createElement("img");
          (r.onload = function () {
            e.animate({ opacity: 0 }, 100, function () {
              o && (e.attr("srcset", o), s && e.attr("sizes", s)),
                e.attr("src", t).animate({ opacity: 1 }, 200, function () {
                  e.removeAttr("data-lazy data-srcset data-sizes").removeClass(
                    "slick-loading"
                  );
                }),
                n.$slider.trigger("lazyLoaded", [n, e, t]);
            });
          }),
            (r.onerror = function () {
              e
                .removeAttr("data-lazy")
                .removeClass("slick-loading")
                .addClass("slick-lazyload-error"),
                n.$slider.trigger("lazyLoadError", [n, e, t]);
            }),
            (r.src = t);
        });
      }
      var t,
        o,
        s,
        n = this;
      if (
        (!0 === n.options.centerMode
          ? !0 === n.options.infinite
            ? (s =
                (o = n.currentSlide + (n.options.slidesToShow / 2 + 1)) +
                n.options.slidesToShow +
                2)
            : ((o = Math.max(
                0,
                n.currentSlide - (n.options.slidesToShow / 2 + 1)
              )),
              (s = n.options.slidesToShow / 2 + 1 + 2 + n.currentSlide))
          : ((o = n.options.infinite
              ? n.options.slidesToShow + n.currentSlide
              : n.currentSlide),
            (s = Math.ceil(o + n.options.slidesToShow)),
            !0 === n.options.fade && (o > 0 && o--, s <= n.slideCount && s++)),
        (t = n.$slider.find(".slick-slide").slice(o, s)),
        "anticipated" === n.options.lazyLoad)
      )
        for (
          var r = o - 1, l = s, d = n.$slider.find(".slick-slide"), a = 0;
          a < n.options.slidesToScroll;
          a++
        )
          r < 0 && (r = n.slideCount - 1),
            (t = (t = t.add(d.eq(r))).add(d.eq(l))),
            r--,
            l++;
      e(t),
        n.slideCount <= n.options.slidesToShow
          ? e(n.$slider.find(".slick-slide"))
          : n.currentSlide >= n.slideCount - n.options.slidesToShow
          ? e(n.$slider.find(".slick-cloned").slice(0, n.options.slidesToShow))
          : 0 === n.currentSlide &&
            e(
              n.$slider.find(".slick-cloned").slice(-1 * n.options.slidesToShow)
            );
    }),
    (e.prototype.loadSlider = function () {
      var i = this;
      i.setPosition(),
        i.$slideTrack.css({ opacity: 1 }),
        i.$slider.removeClass("slick-loading"),
        i.initUI(),
        "progressive" === i.options.lazyLoad && i.progressiveLazyLoad();
    }),
    (e.prototype.next = e.prototype.slickNext =
      function () {
        this.changeSlide({ data: { message: "next" } });
      }),
    (e.prototype.orientationChange = function () {
      var i = this;
      i.checkResponsive(), i.setPosition();
    }),
    (e.prototype.pause = e.prototype.slickPause =
      function () {
        var i = this;
        i.autoPlayClear(), (i.paused = !0);
      }),
    (e.prototype.play = e.prototype.slickPlay =
      function () {
        var i = this;
        i.autoPlay(),
          (i.options.autoplay = !0),
          (i.paused = !1),
          (i.focussed = !1),
          (i.interrupted = !1);
      }),
    (e.prototype.postSlide = function (e) {
      var t = this;
      t.unslicked ||
        (t.$slider.trigger("afterChange", [t, e]),
        (t.animating = !1),
        t.slideCount > t.options.slidesToShow && t.setPosition(),
        (t.swipeLeft = null),
        t.options.autoplay && t.autoPlay(),
        !0 === t.options.accessibility &&
          (t.initADA(),
          t.options.focusOnChange &&
            i(t.$slides.get(t.currentSlide)).attr("tabindex", 0).focus()));
    }),
    (e.prototype.prev = e.prototype.slickPrev =
      function () {
        this.changeSlide({ data: { message: "previous" } });
      }),
    (e.prototype.preventDefault = function (i) {
      i.preventDefault();
    }),
    (e.prototype.progressiveLazyLoad = function (e) {
      e = e || 1;
      var t,
        o,
        s,
        n,
        r,
        l = this,
        d = i("img[data-lazy]", l.$slider);
      d.length
        ? ((t = d.first()),
          (o = t.attr("data-lazy")),
          (s = t.attr("data-srcset")),
          (n = t.attr("data-sizes") || l.$slider.attr("data-sizes")),
          ((r = document.createElement("img")).onload = function () {
            s && (t.attr("srcset", s), n && t.attr("sizes", n)),
              t
                .attr("src", o)
                .removeAttr("data-lazy data-srcset data-sizes")
                .removeClass("slick-loading"),
              !0 === l.options.adaptiveHeight && l.setPosition(),
              l.$slider.trigger("lazyLoaded", [l, t, o]),
              l.progressiveLazyLoad();
          }),
          (r.onerror = function () {
            e < 3
              ? setTimeout(function () {
                  l.progressiveLazyLoad(e + 1);
                }, 500)
              : (t
                  .removeAttr("data-lazy")
                  .removeClass("slick-loading")
                  .addClass("slick-lazyload-error"),
                l.$slider.trigger("lazyLoadError", [l, t, o]),
                l.progressiveLazyLoad());
          }),
          (r.src = o))
        : l.$slider.trigger("allImagesLoaded", [l]);
    }),
    (e.prototype.refresh = function (e) {
      var t,
        o,
        s = this;
      (o = s.slideCount - s.options.slidesToShow),
        !s.options.infinite && s.currentSlide > o && (s.currentSlide = o),
        s.slideCount <= s.options.slidesToShow && (s.currentSlide = 0),
        (t = s.currentSlide),
        s.destroy(!0),
        i.extend(s, s.initials, { currentSlide: t }),
        s.init(),
        e || s.changeSlide({ data: { message: "index", index: t } }, !1);
    }),
    (e.prototype.registerBreakpoints = function () {
      var e,
        t,
        o,
        s = this,
        n = s.options.responsive || null;
      if ("array" === i.type(n) && n.length) {
        s.respondTo = s.options.respondTo || "window";
        for (e in n)
          if (((o = s.breakpoints.length - 1), n.hasOwnProperty(e))) {
            for (t = n[e].breakpoint; o >= 0; )
              s.breakpoints[o] &&
                s.breakpoints[o] === t &&
                s.breakpoints.splice(o, 1),
                o--;
            s.breakpoints.push(t), (s.breakpointSettings[t] = n[e].settings);
          }
        s.breakpoints.sort(function (i, e) {
          return s.options.mobileFirst ? i - e : e - i;
        });
      }
    }),
    (e.prototype.reinit = function () {
      var e = this;
      (e.$slides = e.$slideTrack
        .children(e.options.slide)
        .addClass("slick-slide")),
        (e.slideCount = e.$slides.length),
        e.currentSlide >= e.slideCount &&
          0 !== e.currentSlide &&
          (e.currentSlide = e.currentSlide - e.options.slidesToScroll),
        e.slideCount <= e.options.slidesToShow && (e.currentSlide = 0),
        e.registerBreakpoints(),
        e.setProps(),
        e.setupInfinite(),
        e.buildArrows(),
        e.updateArrows(),
        e.initArrowEvents(),
        e.buildDots(),
        e.updateDots(),
        e.initDotEvents(),
        e.cleanUpSlideEvents(),
        e.initSlideEvents(),
        e.checkResponsive(!1, !0),
        !0 === e.options.focusOnSelect &&
          i(e.$slideTrack).children().on("click.slick", e.selectHandler),
        e.setSlideClasses(
          "number" == typeof e.currentSlide ? e.currentSlide : 0
        ),
        e.setPosition(),
        e.focusHandler(),
        (e.paused = !e.options.autoplay),
        e.autoPlay(),
        e.$slider.trigger("reInit", [e]);
    }),
    (e.prototype.resize = function () {
      var e = this;
      i(window).width() !== e.windowWidth &&
        (clearTimeout(e.windowDelay),
        (e.windowDelay = window.setTimeout(function () {
          (e.windowWidth = i(window).width()),
            e.checkResponsive(),
            e.unslicked || e.setPosition();
        }, 50)));
    }),
    (e.prototype.removeSlide = e.prototype.slickRemove =
      function (i, e, t) {
        var o = this;
        if (
          ((i =
            "boolean" == typeof i
              ? !0 === (e = i)
                ? 0
                : o.slideCount - 1
              : !0 === e
              ? --i
              : i),
          o.slideCount < 1 || i < 0 || i > o.slideCount - 1)
        )
          return !1;
        o.unload(),
          !0 === t
            ? o.$slideTrack.children().remove()
            : o.$slideTrack.children(this.options.slide).eq(i).remove(),
          (o.$slides = o.$slideTrack.children(this.options.slide)),
          o.$slideTrack.children(this.options.slide).detach(),
          o.$slideTrack.append(o.$slides),
          (o.$slidesCache = o.$slides),
          o.reinit();
      }),
    (e.prototype.setCSS = function (i) {
      var e,
        t,
        o = this,
        s = {};
      !0 === o.options.rtl && (i = -i),
        (e = "left" == o.positionProp ? Math.ceil(i) + "px" : "0px"),
        (t = "top" == o.positionProp ? Math.ceil(i) + "px" : "0px"),
        (s[o.positionProp] = i),
        !1 === o.transformsEnabled
          ? o.$slideTrack.css(s)
          : ((s = {}),
            !1 === o.cssTransitions
              ? ((s[o.animType] = "translate(" + e + ", " + t + ")"),
                o.$slideTrack.css(s))
              : ((s[o.animType] = "translate3d(" + e + ", " + t + ", 0px)"),
                o.$slideTrack.css(s)));
    }),
    (e.prototype.setDimensions = function () {
      var i = this;
      !1 === i.options.vertical
        ? !0 === i.options.centerMode &&
          i.$list.css({ padding: "0px " + i.options.centerPadding })
        : (i.$list.height(
            i.$slides.first().outerHeight(!0) * i.options.slidesToShow
          ),
          !0 === i.options.centerMode &&
            i.$list.css({ padding: i.options.centerPadding + " 0px" })),
        (i.listWidth = i.$list.width()),
        (i.listHeight = i.$list.height()),
        !1 === i.options.vertical && !1 === i.options.variableWidth
          ? ((i.slideWidth = Math.ceil(i.listWidth / i.options.slidesToShow)),
            i.$slideTrack.width(
              Math.ceil(
                i.slideWidth * i.$slideTrack.children(".slick-slide").length
              )
            ))
          : !0 === i.options.variableWidth
          ? i.$slideTrack.width(5e3 * i.slideCount)
          : ((i.slideWidth = Math.ceil(i.listWidth)),
            i.$slideTrack.height(
              Math.ceil(
                i.$slides.first().outerHeight(!0) *
                  i.$slideTrack.children(".slick-slide").length
              )
            ));
      var e = i.$slides.first().outerWidth(!0) - i.$slides.first().width();
      !1 === i.options.variableWidth &&
        i.$slideTrack.children(".slick-slide").width(i.slideWidth - e);
    }),
    (e.prototype.setFade = function () {
      var e,
        t = this;
      t.$slides.each(function (o, s) {
        (e = t.slideWidth * o * -1),
          !0 === t.options.rtl
            ? i(s).css({
                position: "relative",
                right: e,
                top: 0,
                zIndex: t.options.zIndex - 2,
                opacity: 0,
              })
            : i(s).css({
                position: "relative",
                left: e,
                top: 0,
                zIndex: t.options.zIndex - 2,
                opacity: 0,
              });
      }),
        t.$slides
          .eq(t.currentSlide)
          .css({ zIndex: t.options.zIndex - 1, opacity: 1 });
    }),
    (e.prototype.setHeight = function () {
      var i = this;
      if (
        1 === i.options.slidesToShow &&
        !0 === i.options.adaptiveHeight &&
        !1 === i.options.vertical
      ) {
        var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
        i.$list.css("height", e);
      }
    }),
    (e.prototype.setOption = e.prototype.slickSetOption =
      function () {
        var e,
          t,
          o,
          s,
          n,
          r = this,
          l = !1;
        if (
          ("object" === i.type(arguments[0])
            ? ((o = arguments[0]), (l = arguments[1]), (n = "multiple"))
            : "string" === i.type(arguments[0]) &&
              ((o = arguments[0]),
              (s = arguments[1]),
              (l = arguments[2]),
              "responsive" === arguments[0] && "array" === i.type(arguments[1])
                ? (n = "responsive")
                : void 0 !== arguments[1] && (n = "single")),
          "single" === n)
        )
          r.options[o] = s;
        else if ("multiple" === n)
          i.each(o, function (i, e) {
            r.options[i] = e;
          });
        else if ("responsive" === n)
          for (t in s)
            if ("array" !== i.type(r.options.responsive))
              r.options.responsive = [s[t]];
            else {
              for (e = r.options.responsive.length - 1; e >= 0; )
                r.options.responsive[e].breakpoint === s[t].breakpoint &&
                  r.options.responsive.splice(e, 1),
                  e--;
              r.options.responsive.push(s[t]);
            }
        l && (r.unload(), r.reinit());
      }),
    (e.prototype.setPosition = function () {
      var i = this;
      i.setDimensions(),
        i.setHeight(),
        !1 === i.options.fade
          ? i.setCSS(i.getLeft(i.currentSlide))
          : i.setFade(),
        i.$slider.trigger("setPosition", [i]);
    }),
    (e.prototype.setProps = function () {
      var i = this,
        e = document.body.style;
      (i.positionProp = !0 === i.options.vertical ? "top" : "left"),
        "top" === i.positionProp
          ? i.$slider.addClass("slick-vertical")
          : i.$slider.removeClass("slick-vertical"),
        (void 0 === e.WebkitTransition &&
          void 0 === e.MozTransition &&
          void 0 === e.msTransition) ||
          (!0 === i.options.useCSS && (i.cssTransitions = !0)),
        i.options.fade &&
          ("number" == typeof i.options.zIndex
            ? i.options.zIndex < 3 && (i.options.zIndex = 3)
            : (i.options.zIndex = i.defaults.zIndex)),
        void 0 !== e.OTransform &&
          ((i.animType = "OTransform"),
          (i.transformType = "-o-transform"),
          (i.transitionType = "OTransition"),
          void 0 === e.perspectiveProperty &&
            void 0 === e.webkitPerspective &&
            (i.animType = !1)),
        void 0 !== e.MozTransform &&
          ((i.animType = "MozTransform"),
          (i.transformType = "-moz-transform"),
          (i.transitionType = "MozTransition"),
          void 0 === e.perspectiveProperty &&
            void 0 === e.MozPerspective &&
            (i.animType = !1)),
        void 0 !== e.webkitTransform &&
          ((i.animType = "webkitTransform"),
          (i.transformType = "-webkit-transform"),
          (i.transitionType = "webkitTransition"),
          void 0 === e.perspectiveProperty &&
            void 0 === e.webkitPerspective &&
            (i.animType = !1)),
        void 0 !== e.msTransform &&
          ((i.animType = "msTransform"),
          (i.transformType = "-ms-transform"),
          (i.transitionType = "msTransition"),
          void 0 === e.msTransform && (i.animType = !1)),
        void 0 !== e.transform &&
          !1 !== i.animType &&
          ((i.animType = "transform"),
          (i.transformType = "transform"),
          (i.transitionType = "transition")),
        (i.transformsEnabled =
          i.options.useTransform && null !== i.animType && !1 !== i.animType);
    }),
    (e.prototype.setSlideClasses = function (i) {
      var e,
        t,
        o,
        s,
        n = this;
      if (
        ((t = n.$slider
          .find(".slick-slide")
          .removeClass("slick-active slick-center slick-current")
          .attr("aria-hidden", "true")),
        n.$slides.eq(i).addClass("slick-current"),
        !0 === n.options.centerMode)
      ) {
        var r = n.options.slidesToShow % 2 == 0 ? 1 : 0;
        (e = Math.floor(n.options.slidesToShow / 2)),
          !0 === n.options.infinite &&
            (i >= e && i <= n.slideCount - 1 - e
              ? n.$slides
                  .slice(i - e + r, i + e + 1)
                  .addClass("slick-active")
                  .attr("aria-hidden", "false")
              : ((o = n.options.slidesToShow + i),
                t
                  .slice(o - e + 1 + r, o + e + 2)
                  .addClass("slick-active")
                  .attr("aria-hidden", "false")),
            0 === i
              ? t
                  .eq(t.length - 1 - n.options.slidesToShow)
                  .addClass("slick-center")
              : i === n.slideCount - 1 &&
                t.eq(n.options.slidesToShow).addClass("slick-center")),
          n.$slides.eq(i).addClass("slick-center");
      } else
        i >= 0 && i <= n.slideCount - n.options.slidesToShow
          ? n.$slides
              .slice(i, i + n.options.slidesToShow)
              .addClass("slick-active")
              .attr("aria-hidden", "false")
          : t.length <= n.options.slidesToShow
          ? t.addClass("slick-active").attr("aria-hidden", "false")
          : ((s = n.slideCount % n.options.slidesToShow),
            (o = !0 === n.options.infinite ? n.options.slidesToShow + i : i),
            n.options.slidesToShow == n.options.slidesToScroll &&
            n.slideCount - i < n.options.slidesToShow
              ? t
                  .slice(o - (n.options.slidesToShow - s), o + s)
                  .addClass("slick-active")
                  .attr("aria-hidden", "false")
              : t
                  .slice(o, o + n.options.slidesToShow)
                  .addClass("slick-active")
                  .attr("aria-hidden", "false"));
      ("ondemand" !== n.options.lazyLoad &&
        "anticipated" !== n.options.lazyLoad) ||
        n.lazyLoad();
    }),
    (e.prototype.setupInfinite = function () {
      var e,
        t,
        o,
        s = this;
      if (
        (!0 === s.options.fade && (s.options.centerMode = !1),
        !0 === s.options.infinite &&
          !1 === s.options.fade &&
          ((t = null), s.slideCount > s.options.slidesToShow))
      ) {
        for (
          o =
            !0 === s.options.centerMode
              ? s.options.slidesToShow + 1
              : s.options.slidesToShow,
            e = s.slideCount;
          e > s.slideCount - o;
          e -= 1
        )
          (t = e - 1),
            i(s.$slides[t])
              .clone(!0)
              .attr("id", "")
              .attr("data-slick-index", t - s.slideCount)
              .prependTo(s.$slideTrack)
              .addClass("slick-cloned");
        for (e = 0; e < o + s.slideCount; e += 1)
          (t = e),
            i(s.$slides[t])
              .clone(!0)
              .attr("id", "")
              .attr("data-slick-index", t + s.slideCount)
              .appendTo(s.$slideTrack)
              .addClass("slick-cloned");
        s.$slideTrack
          .find(".slick-cloned")
          .find("[id]")
          .each(function () {
            i(this).attr("id", "");
          });
      }
    }),
    (e.prototype.interrupt = function (i) {
      var e = this;
      i || e.autoPlay(), (e.interrupted = i);
    }),
    (e.prototype.selectHandler = function (e) {
      var t = this,
        o = i(e.target).is(".slick-slide")
          ? i(e.target)
          : i(e.target).parents(".slick-slide"),
        s = parseInt(o.attr("data-slick-index"));
      s || (s = 0),
        t.slideCount <= t.options.slidesToShow
          ? t.slideHandler(s, !1, !0)
          : t.slideHandler(s);
    }),
    (e.prototype.slideHandler = function (i, e, t) {
      var o,
        s,
        n,
        r,
        l,
        d = null,
        a = this;
      if (
        ((e = e || !1),
        !(
          (!0 === a.animating && !0 === a.options.waitForAnimate) ||
          (!0 === a.options.fade && a.currentSlide === i)
        ))
      )
        if (
          (!1 === e && a.asNavFor(i),
          (o = i),
          (d = a.getLeft(o)),
          (r = a.getLeft(a.currentSlide)),
          (a.currentLeft = null === a.swipeLeft ? r : a.swipeLeft),
          !1 === a.options.infinite &&
            !1 === a.options.centerMode &&
            (i < 0 || i > a.getDotCount() * a.options.slidesToScroll))
        )
          !1 === a.options.fade &&
            ((o = a.currentSlide),
            !0 !== t
              ? a.animateSlide(r, function () {
                  a.postSlide(o);
                })
              : a.postSlide(o));
        else if (
          !1 === a.options.infinite &&
          !0 === a.options.centerMode &&
          (i < 0 || i > a.slideCount - a.options.slidesToScroll)
        )
          !1 === a.options.fade &&
            ((o = a.currentSlide),
            !0 !== t
              ? a.animateSlide(r, function () {
                  a.postSlide(o);
                })
              : a.postSlide(o));
        else {
          if (
            (a.options.autoplay && clearInterval(a.autoPlayTimer),
            (s =
              o < 0
                ? a.slideCount % a.options.slidesToScroll != 0
                  ? a.slideCount - (a.slideCount % a.options.slidesToScroll)
                  : a.slideCount + o
                : o >= a.slideCount
                ? a.slideCount % a.options.slidesToScroll != 0
                  ? 0
                  : o - a.slideCount
                : o),
            (a.animating = !0),
            a.$slider.trigger("beforeChange", [a, a.currentSlide, s]),
            (n = a.currentSlide),
            (a.currentSlide = s),
            a.setSlideClasses(a.currentSlide),
            a.options.asNavFor &&
              (l = (l = a.getNavTarget()).slick("getSlick")).slideCount <=
                l.options.slidesToShow &&
              l.setSlideClasses(a.currentSlide),
            a.updateDots(),
            a.updateArrows(),
            !0 === a.options.fade)
          )
            return (
              !0 !== t
                ? (a.fadeSlideOut(n),
                  a.fadeSlide(s, function () {
                    a.postSlide(s);
                  }))
                : a.postSlide(s),
              void a.animateHeight()
            );
          !0 !== t
            ? a.animateSlide(d, function () {
                a.postSlide(s);
              })
            : a.postSlide(s);
        }
    }),
    (e.prototype.startLoad = function () {
      var i = this;
      !0 === i.options.arrows &&
        i.slideCount > i.options.slidesToShow &&
        (i.$prevArrow.hide(), i.$nextArrow.hide()),
        !0 === i.options.dots &&
          i.slideCount > i.options.slidesToShow &&
          i.$dots.hide(),
        i.$slider.addClass("slick-loading");
    }),
    (e.prototype.swipeDirection = function () {
      var i,
        e,
        t,
        o,
        s = this;
      return (
        (i = s.touchObject.startX - s.touchObject.curX),
        (e = s.touchObject.startY - s.touchObject.curY),
        (t = Math.atan2(e, i)),
        (o = Math.round((180 * t) / Math.PI)) < 0 && (o = 360 - Math.abs(o)),
        o <= 45 && o >= 0
          ? !1 === s.options.rtl
            ? "left"
            : "right"
          : o <= 360 && o >= 315
          ? !1 === s.options.rtl
            ? "left"
            : "right"
          : o >= 135 && o <= 225
          ? !1 === s.options.rtl
            ? "right"
            : "left"
          : !0 === s.options.verticalSwiping
          ? o >= 35 && o <= 135
            ? "down"
            : "up"
          : "vertical"
      );
    }),
    (e.prototype.swipeEnd = function (i) {
      var e,
        t,
        o = this;
      if (((o.dragging = !1), (o.swiping = !1), o.scrolling))
        return (o.scrolling = !1), !1;
      if (
        ((o.interrupted = !1),
        (o.shouldClick = !(o.touchObject.swipeLength > 10)),
        void 0 === o.touchObject.curX)
      )
        return !1;
      if (
        (!0 === o.touchObject.edgeHit &&
          o.$slider.trigger("edge", [o, o.swipeDirection()]),
        o.touchObject.swipeLength >= o.touchObject.minSwipe)
      ) {
        switch ((t = o.swipeDirection())) {
          case "left":
          case "down":
            (e = o.options.swipeToSlide
              ? o.checkNavigable(o.currentSlide + o.getSlideCount())
              : o.currentSlide + o.getSlideCount()),
              (o.currentDirection = 0);
            break;
          case "right":
          case "up":
            (e = o.options.swipeToSlide
              ? o.checkNavigable(o.currentSlide - o.getSlideCount())
              : o.currentSlide - o.getSlideCount()),
              (o.currentDirection = 1);
        }
        "vertical" != t &&
          (o.slideHandler(e),
          (o.touchObject = {}),
          o.$slider.trigger("swipe", [o, t]));
      } else
        o.touchObject.startX !== o.touchObject.curX &&
          (o.slideHandler(o.currentSlide), (o.touchObject = {}));
    }),
    (e.prototype.swipeHandler = function (i) {
      var e = this;
      if (
        !(
          !1 === e.options.swipe ||
          ("ontouchend" in document && !1 === e.options.swipe) ||
          (!1 === e.options.draggable && -1 !== i.type.indexOf("mouse"))
        )
      )
        switch (
          ((e.touchObject.fingerCount =
            i.originalEvent && void 0 !== i.originalEvent.touches
              ? i.originalEvent.touches.length
              : 1),
          (e.touchObject.minSwipe = e.listWidth / e.options.touchThreshold),
          !0 === e.options.verticalSwiping &&
            (e.touchObject.minSwipe = e.listHeight / e.options.touchThreshold),
          i.data.action)
        ) {
          case "start":
            e.swipeStart(i);
            break;
          case "move":
            e.swipeMove(i);
            break;
          case "end":
            e.swipeEnd(i);
        }
    }),
    (e.prototype.swipeMove = function (i) {
      var e,
        t,
        o,
        s,
        n,
        r,
        l = this;
      return (
        (n = void 0 !== i.originalEvent ? i.originalEvent.touches : null),
        !(!l.dragging || l.scrolling || (n && 1 !== n.length)) &&
          ((e = l.getLeft(l.currentSlide)),
          (l.touchObject.curX = void 0 !== n ? n[0].pageX : i.clientX),
          (l.touchObject.curY = void 0 !== n ? n[0].pageY : i.clientY),
          (l.touchObject.swipeLength = Math.round(
            Math.sqrt(Math.pow(l.touchObject.curX - l.touchObject.startX, 2))
          )),
          (r = Math.round(
            Math.sqrt(Math.pow(l.touchObject.curY - l.touchObject.startY, 2))
          )),
          !l.options.verticalSwiping && !l.swiping && r > 4
            ? ((l.scrolling = !0), !1)
            : (!0 === l.options.verticalSwiping &&
                (l.touchObject.swipeLength = r),
              (t = l.swipeDirection()),
              void 0 !== i.originalEvent &&
                l.touchObject.swipeLength > 4 &&
                ((l.swiping = !0), i.preventDefault()),
              (s =
                (!1 === l.options.rtl ? 1 : -1) *
                (l.touchObject.curX > l.touchObject.startX ? 1 : -1)),
              !0 === l.options.verticalSwiping &&
                (s = l.touchObject.curY > l.touchObject.startY ? 1 : -1),
              (o = l.touchObject.swipeLength),
              (l.touchObject.edgeHit = !1),
              !1 === l.options.infinite &&
                ((0 === l.currentSlide && "right" === t) ||
                  (l.currentSlide >= l.getDotCount() && "left" === t)) &&
                ((o = l.touchObject.swipeLength * l.options.edgeFriction),
                (l.touchObject.edgeHit = !0)),
              !1 === l.options.vertical
                ? (l.swipeLeft = e + o * s)
                : (l.swipeLeft = e + o * (l.$list.height() / l.listWidth) * s),
              !0 === l.options.verticalSwiping && (l.swipeLeft = e + o * s),
              !0 !== l.options.fade &&
                !1 !== l.options.touchMove &&
                (!0 === l.animating
                  ? ((l.swipeLeft = null), !1)
                  : void l.setCSS(l.swipeLeft))))
      );
    }),
    (e.prototype.swipeStart = function (i) {
      var e,
        t = this;
      if (
        ((t.interrupted = !0),
        1 !== t.touchObject.fingerCount ||
          t.slideCount <= t.options.slidesToShow)
      )
        return (t.touchObject = {}), !1;
      void 0 !== i.originalEvent &&
        void 0 !== i.originalEvent.touches &&
        (e = i.originalEvent.touches[0]),
        (t.touchObject.startX = t.touchObject.curX =
          void 0 !== e ? e.pageX : i.clientX),
        (t.touchObject.startY = t.touchObject.curY =
          void 0 !== e ? e.pageY : i.clientY),
        (t.dragging = !0);
    }),
    (e.prototype.unfilterSlides = e.prototype.slickUnfilter =
      function () {
        var i = this;
        null !== i.$slidesCache &&
          (i.unload(),
          i.$slideTrack.children(this.options.slide).detach(),
          i.$slidesCache.appendTo(i.$slideTrack),
          i.reinit());
      }),
    (e.prototype.unload = function () {
      var e = this;
      i(".slick-cloned", e.$slider).remove(),
        e.$dots && e.$dots.remove(),
        e.$prevArrow &&
          e.htmlExpr.test(e.options.prevArrow) &&
          e.$prevArrow.remove(),
        e.$nextArrow &&
          e.htmlExpr.test(e.options.nextArrow) &&
          e.$nextArrow.remove(),
        e.$slides
          .removeClass("slick-slide slick-active slick-visible slick-current")
          .attr("aria-hidden", "true")
          .css("width", "");
    }),
    (e.prototype.unslick = function (i) {
      var e = this;
      e.$slider.trigger("unslick", [e, i]), e.destroy();
    }),
    (e.prototype.updateArrows = function () {
      var i = this;
      Math.floor(i.options.slidesToShow / 2),
        !0 === i.options.arrows &&
          i.slideCount > i.options.slidesToShow &&
          !i.options.infinite &&
          (i.$prevArrow
            .removeClass("slick-disabled")
            .attr("aria-disabled", "false"),
          i.$nextArrow
            .removeClass("slick-disabled")
            .attr("aria-disabled", "false"),
          0 === i.currentSlide
            ? (i.$prevArrow
                .addClass("slick-disabled")
                .attr("aria-disabled", "true"),
              i.$nextArrow
                .removeClass("slick-disabled")
                .attr("aria-disabled", "false"))
            : i.currentSlide >= i.slideCount - i.options.slidesToShow &&
              !1 === i.options.centerMode
            ? (i.$nextArrow
                .addClass("slick-disabled")
                .attr("aria-disabled", "true"),
              i.$prevArrow
                .removeClass("slick-disabled")
                .attr("aria-disabled", "false"))
            : i.currentSlide >= i.slideCount - 1 &&
              !0 === i.options.centerMode &&
              (i.$nextArrow
                .addClass("slick-disabled")
                .attr("aria-disabled", "true"),
              i.$prevArrow
                .removeClass("slick-disabled")
                .attr("aria-disabled", "false")));
    }),
    (e.prototype.updateDots = function () {
      var i = this;
      null !== i.$dots &&
        (i.$dots.find("li").removeClass("slick-active").end(),
        i.$dots
          .find("li")
          .eq(Math.floor(i.currentSlide / i.options.slidesToScroll))
          .addClass("slick-active"));
    }),
    (e.prototype.visibility = function () {
      var i = this;
      i.options.autoplay &&
        (document[i.hidden] ? (i.interrupted = !0) : (i.interrupted = !1));
    }),
    (i.fn.slick = function () {
      var i,
        t,
        o = this,
        s = arguments[0],
        n = Array.prototype.slice.call(arguments, 1),
        r = o.length;
      for (i = 0; i < r; i++)
        if (
          ("object" == typeof s || void 0 === s
            ? (o[i].slick = new e(o[i], s))
            : (t = o[i].slick[s].apply(o[i].slick, n)),
          void 0 !== t)
        )
          return t;
      return o;
    });
});
function getFocusableElements(t) {
  return Array.from(
    t.querySelectorAll(
      "summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"
    )
  );
}
const trapFocusHandlers = {};

function trapFocus(t, e = t) {
  var a = getFocusableElements(t),
    r = a[0],
    s = a[a.length - 1];
  removeTrapFocus(),
    (trapFocusHandlers.focusin = (e) => {
      (e.target !== t && e.target !== s && e.target !== r) ||
        document.addEventListener("keydown", trapFocusHandlers.keydown);
    }),
    (trapFocusHandlers.focusout = function () {
      document.removeEventListener("keydown", trapFocusHandlers.keydown);
    }),
    (trapFocusHandlers.keydown = function (e) {
      "TAB" !== e.code.toUpperCase() ||
        (e.target !== s || e.shiftKey || (e.preventDefault(), r.focus()),
        (e.target === t || e.target === r) &&
          e.shiftKey &&
          (e.preventDefault(), s.focus()));
    }),
    document.addEventListener("focusout", trapFocusHandlers.focusout),
    document.addEventListener("focusin", trapFocusHandlers.focusin),
    e.focus();
}
try {
  document.querySelector(":focus-visible");
} catch {
  focusVisiblePolyfill();
}

function focusVisiblePolyfill() {
  let t = [
      "ARROWUP",
      "ARROWDOWN",
      "ARROWLEFT",
      "ARROWRIGHT",
      "TAB",
      "ENTER",
      "SPACE",
      "ESCAPE",
      "HOME",
      "END",
      "PAGEUP",
      "PAGEDOWN",
    ],
    e = null,
    a = null;
  window.addEventListener("keydown", (e) => {
    t.includes(e.code.toUpperCase()) && (a = !1);
  }),
    window.addEventListener("mousedown", (t) => {
      a = !0;
    }),
    window.addEventListener(
      "focus",
      () => {
        e && e.classList.remove("focused"),
          a || (e = document.activeElement).classList.add("focused");
      },
      !0
    );
}

function pauseAllMedia() {
  document.querySelectorAll(".js-youtube").forEach((t) => {
    t.contentWindow.postMessage(
      '{"event":"command","func":"pauseVideo","args":""}',
      "*"
    );
  }),
    document.querySelectorAll(".js-vimeo").forEach((t) => {
      t.contentWindow.postMessage('{"method":"pause"}', "*");
    }),
    document.querySelectorAll("video").forEach((t) => t.pause()),
    document.querySelectorAll("product-model").forEach((t) => {
      t.modelViewerUI && t.modelViewerUI.pause();
    });
}

function removeTrapFocus(t = null) {
  document.removeEventListener("focusin", trapFocusHandlers.focusin),
    document.removeEventListener("focusout", trapFocusHandlers.focusout),
    document.removeEventListener("keydown", trapFocusHandlers.keydown),
    t && t.focus();
}

function onKeyUpEscape(t) {
  if ("ESCAPE" !== t.code.toUpperCase()) return;
  let e = t.target.closest("details[open]");
  if (!e) return;
  let a = e.querySelector("summary");
  e.removeAttribute("open"), a.focus();
}
class QuantityInput extends HTMLElement {
  constructor() {
    super(),
      (this.input = this.querySelector("input")),
      (this.changeEvent = new Event("change", {
        bubbles: !0,
      })),
      this.querySelectorAll("button").forEach((t) =>
        t.addEventListener("click", this.onButtonClick.bind(this))
      );
  }
  onButtonClick(t) {
    t.preventDefault();
    let e = this.input.value;
    "plus" === t.target.name ? this.input.stepUp() : this.input.stepDown(),
      e !== this.input.value && this.input.dispatchEvent(this.changeEvent);
  }
}

function debounce(t, e) {
  let a;
  return (...r) => {
    clearTimeout(a), (a = setTimeout(() => t.apply(this, r), e));
  };
}
customElements.define("quantity-input", QuantityInput);
const serializeForm = (t) => {
  let e = {},
    a = new FormData(t);
  for (let r of a.keys()) {
    let s = /(?:^(properties\[))(.*?)(?:\]$)/;
    s.test(r)
      ? ((e.properties = e.properties || {}),
        (e.properties[s.exec(r)[2]] = a.get(r)))
      : (e[r] = a.get(r));
  }
  return JSON.stringify(e);
};

function fetchConfig(t = "json") {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: `application/${t}`,
    },
  };
}
void 0 === window.Shopify && (window.Shopify = {}),
  (Shopify.bind = function (t, e) {
    return function () {
      return t.apply(e, arguments);
    };
  }),
  (Shopify.setSelectorByValue = function (t, e) {
    for (var a = 0, r = t.options.length; a < r; a++) {
      var s = t.options[a];
      if (e == s.value || e == s.innerHTML) return (t.selectedIndex = a), a;
    }
  }),
  (Shopify.addListener = function (t, e, a) {
    t.addEventListener
      ? t.addEventListener(e, a, !1)
      : t.attachEvent("on" + e, a);
  }),
  (Shopify.postLink = function (t, e) {
    var a = (e = e || {}).method || "post",
      r = e.parameters || {},
      s = document.createElement("form");
    for (var n in (s.setAttribute("method", a),
    s.setAttribute("action", t),
    r)) {
      var o = document.createElement("input");
      o.setAttribute("type", "hidden"),
        o.setAttribute("name", n),
        o.setAttribute("value", r[n]),
        s.appendChild(o);
    }
    document.body.appendChild(s), s.submit(), document.body.removeChild(s);
  }),
  (Shopify.CountryProvinceSelector = function (t, e, a) {
    (this.countryEl = document.getElementById(t)),
      (this.provinceEl = document.getElementById(e)),
      (this.provinceContainer = document.getElementById(a.hideElement || e)),
      Shopify.addListener(
        this.countryEl,
        "change",
        Shopify.bind(this.countryHandler, this)
      ),
      this.initCountry(),
      this.initProvince();
  }),
  (Shopify.CountryProvinceSelector.prototype = {
    initCountry: function () {
      var t = this.countryEl.getAttribute("data-default");
      Shopify.setSelectorByValue(this.countryEl, t), this.countryHandler();
    },
    initProvince: function () {
      var t = this.provinceEl.getAttribute("data-default");
      t &&
        this.provinceEl.options.length > 0 &&
        Shopify.setSelectorByValue(this.provinceEl, t);
    },
    countryHandler: function (t) {
      var e = JSON.parse(
        (a = this.countryEl.options[this.countryEl.selectedIndex]).getAttribute(
          "data-provinces"
        )
      );
      if ((this.clearOptions(this.provinceEl), e && 0 == e.length))
        this.provinceContainer.style.display = "none";
      else {
        for (var a, r = 0; r < e.length; r++)
          ((a = document.createElement("option")).value = e[r][0]),
            (a.innerHTML = e[r][1]),
            this.provinceEl.appendChild(a);
        this.provinceContainer.style.display = "";
      }
    },
    clearOptions: function (t) {
      for (; t.firstChild; ) t.removeChild(t.firstChild);
    },
    setOptions: function (t, e) {
      var a = 0;
      for (e.length; a < e.length; a++) {
        var r = document.createElement("option");
        (r.value = e[a]), (r.innerHTML = e[a]), t.appendChild(r);
      }
    },
  });
class MenuDrawer extends HTMLElement {
  constructor() {
    super(), (this.mainDetailsToggle = this.querySelector("details"));
    let t = this.querySelectorAll("summary");
    this.addAccessibilityAttributes(t),
      "iPhone" === navigator.platform &&
        document.documentElement.style.setProperty(
          "--viewport-height",
          `${window.innerHeight}px`
        ),
      this.addEventListener("keyup", this.onKeyUp.bind(this)),
      this.addEventListener("focusout", this.onFocusOut.bind(this)),
      this.bindEvents();
  }
  bindEvents() {
    this.querySelectorAll("summary").forEach((t) =>
      t.addEventListener("click", this.onSummaryClick.bind(this))
    ),
      this.querySelectorAll("button").forEach((t) =>
        t.addEventListener("click", this.onCloseButtonClick.bind(this))
      );
  }
  addAccessibilityAttributes(t) {
    t.forEach((t) => {
      t.setAttribute("role", "button"),
        t.setAttribute("aria-expanded", !1),
        t.setAttribute("aria-controls", t.nextElementSibling.id);
    });
  }
  onKeyUp(t) {
    if ("ESCAPE" !== t.code.toUpperCase()) return;
    let e = t.target.closest("details[open]");
    e &&
      (e === this.mainDetailsToggle
        ? this.closeMenuDrawer(this.mainDetailsToggle.querySelector("summary"))
        : this.closeSubmenu(e));
  }
  onSummaryClick(t) {
    let e = t.currentTarget,
      a = e.parentNode,
      r = a.hasAttribute("open");
    a === this.mainDetailsToggle
      ? (r && t.preventDefault(),
        r ? this.closeMenuDrawer(e) : this.openMenuDrawer(e))
      : (trapFocus(e.nextElementSibling, a.querySelector("button")),
        setTimeout(() => {
          a.classList.add("menu-opening");
        }));
  }
  openMenuDrawer(t) {
    setTimeout(() => {
      this.mainDetailsToggle.classList.add("menu-opening");
    }),
      t.setAttribute("aria-expanded", !0),
      trapFocus(this.mainDetailsToggle, t),
      document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);
  }
  closeMenuDrawer(t, e = !1) {
    void 0 !== t &&
      (this.mainDetailsToggle.classList.remove("menu-opening"),
      this.mainDetailsToggle.querySelectorAll("details").forEach((t) => {
        t.removeAttribute("open"), t.classList.remove("menu-opening");
      }),
      this.mainDetailsToggle
        .querySelector("summary")
        .setAttribute("aria-expanded", !1),
      document.body.classList.remove(
        `overflow-hidden-${this.dataset.breakpoint}`
      ),
      removeTrapFocus(e),
      this.closeAnimation(this.mainDetailsToggle));
  }
  onFocusOut(t) {
    setTimeout(() => {
      this.mainDetailsToggle.hasAttribute("open") &&
        !this.mainDetailsToggle.contains(document.activeElement) &&
        this.closeMenuDrawer();
    });
  }
  onCloseButtonClick(t) {
    let e = t.currentTarget.closest("details");
    this.closeSubmenu(e);
  }
  closeSubmenu(t) {
    t.classList.remove("menu-opening"),
      removeTrapFocus(),
      this.closeAnimation(t);
  }
  closeAnimation(t) {
    let e,
      a = (r) => {
        void 0 === e && (e = r),
          r - e < 400
            ? window.requestAnimationFrame(a)
            : (t.removeAttribute("open"),
              t.closest("details[open]") &&
                trapFocus(
                  t.closest("details[open]"),
                  t.querySelector("summary")
                ));
      };
    window.requestAnimationFrame(a);
  }
}
customElements.define("menu-drawer", MenuDrawer);
class HeaderDrawer extends MenuDrawer {
  constructor() {
    super();
  }
  openMenuDrawer(t) {
    (this.header =
      this.header || document.getElementById("shopify-section-header")),
      (this.borderOffset =
        this.borderOffset ||
        this.closest(".header-wrapper").classList.contains(
          "header-wrapper--border-bottom"
        )
          ? 1
          : 0),
      document.documentElement.style.setProperty(
        "--header-bottom-position",
        `${parseInt(
          this.header.getBoundingClientRect().bottom - this.borderOffset
        )}px`
      ),
      setTimeout(() => {
        this.mainDetailsToggle.classList.add("menu-opening");
      }),
      t.setAttribute("aria-expanded", !0),
      trapFocus(this.mainDetailsToggle, t),
      document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);
  }
}
customElements.define("header-drawer", HeaderDrawer);
class ModalDialog extends HTMLElement {
  constructor() {
    super(),
      this.querySelector('[id^="ModalClose-"]').addEventListener(
        "click",
        this.hide.bind(this)
      ),
      this.addEventListener("keyup", (t) => {
        "ESCAPE" === t.code.toUpperCase() && this.hide();
      }),
      this.classList.contains("media-modal")
        ? this.addEventListener("pointerup", (t) => {
            "mouse" !== t.pointerType ||
              t.target.closest("deferred-media, product-model") ||
              this.hide();
          })
        : this.addEventListener("click", (t) => {
            "MODAL-DIALOG" === t.target.nodeName && this.hide();
          });
  }
  show(t) {
    this.openedBy = t;
    let e = this.querySelector(".template-popup");
    document.body.classList.add("overflow-hidden"),
      this.setAttribute("open", ""),
      e && e.loadContent(),
      trapFocus(this, this.querySelector('[role="dialog"]')),
      window.pauseAllMedia();
  }
  hide() {
    document.body.classList.remove("overflow-hidden"),
      this.removeAttribute("open"),
      removeTrapFocus(this.openedBy),
      window.pauseAllMedia();
  }
}
customElements.define("modal-dialog", ModalDialog);
class ModalOpener extends HTMLElement {
  constructor() {
    super();
    let t = this.querySelector("button");
    t &&
      t.addEventListener("click", () => {
        let e = document.querySelector(this.getAttribute("data-modal"));
        e && e.show(t);
      });
  }
}
customElements.define("modal-opener", ModalOpener);
class DeferredMedia extends HTMLElement {
  constructor() {
    super();
    let t = this.querySelector('[id^="Deferred-Poster-"]');
    t && t.addEventListener("click", this.loadContent.bind(this));
  }
  loadContent() {
    if ((window.pauseAllMedia(), !this.getAttribute("loaded"))) {
      let t = document.createElement("div");
      t.appendChild(
        this.querySelector("template").content.firstElementChild.cloneNode(!0)
      ),
        this.setAttribute("loaded", !0),
        this.appendChild(
          t.querySelector("video, model-viewer, iframe")
        ).focus();
    }
  }
}
customElements.define("deferred-media", DeferredMedia);
class SliderComponent extends HTMLElement {
  constructor() {
    if (
      (super(),
      (this.slider = this.querySelector("ul")),
      (this.sliderItems = this.querySelectorAll("li")),
      (this.pageCount = this.querySelector(".slider-counter--current")),
      (this.pageTotal = this.querySelector(".slider-counter--total")),
      (this.prevButton = this.querySelector('button[name="previous"]')),
      (this.nextButton = this.querySelector('button[name="next"]')),
      !this.slider || !this.nextButton)
    )
      return;
    new ResizeObserver((t) => this.initPages()).observe(this.slider),
      this.slider.addEventListener("scroll", this.update.bind(this)),
      this.prevButton.addEventListener("click", this.onButtonClick.bind(this)),
      this.nextButton.addEventListener("click", this.onButtonClick.bind(this));
  }
  initPages() {
    let t = Array.from(this.sliderItems).filter((t) => t.clientWidth > 0);
    (this.sliderLastItem = t[t.length - 1]),
      0 !== t.length &&
        ((this.slidesPerPage = Math.floor(
          this.slider.clientWidth / t[0].clientWidth
        )),
        (this.totalPages = t.length - this.slidesPerPage + 1),
        this.update());
  }
  update() {
    this.pageCount &&
      this.pageTotal &&
      ((this.currentPage =
        Math.round(this.slider.scrollLeft / this.sliderLastItem.clientWidth) +
        1),
      1 === this.currentPage
        ? this.prevButton.setAttribute("disabled", !0)
        : this.prevButton.removeAttribute("disabled"),
      this.currentPage === this.totalPages
        ? this.nextButton.setAttribute("disabled", !0)
        : this.nextButton.removeAttribute("disabled"),
      (this.pageCount.textContent = this.currentPage),
      (this.pageTotal.textContent = this.totalPages));
  }
  onButtonClick(t) {
    t.preventDefault();
    let e =
      "next" === t.currentTarget.name
        ? this.slider.scrollLeft + this.sliderLastItem.clientWidth
        : this.slider.scrollLeft - this.sliderLastItem.clientWidth;
    this.slider.scrollTo({
      left: e,
    });
  }
}
customElements.define("slider-component", SliderComponent);
class VariantSelects extends HTMLElement {
  constructor() {
    super(), this.addEventListener("change", this.onVariantChange);
  }
  onVariantChange() {
    this.updateOptions(),
      this.updateMasterId(),
      this.toggleAddButton(!0, "", !1),
      this.updatePickupAvailability(),
      this.removeErrorMessage(),
      this.currentVariant
        ? (this.updateMedia(),
          this.updateURL(),
          this.updateVariantInput(),
          this.renderProductInfo())
        : (this.toggleAddButton(!0, "", !0), this.setUnavailable());
  }
  updateOptions() {
    this.options = Array.from(this.querySelectorAll("select"), (t) => t.value);
  }
  updateMasterId() {
    this.currentVariant = this.getVariantData().find(
      (t) => !t.options.map((t, e) => this.options[e] === t).includes(!1)
    );
  }
  updateMedia() {
    if (!this.currentVariant || !this.currentVariant.featured_media) return;
    let t = document.querySelector(
      `[data-media-id="${this.dataset.section}-${this.currentVariant.featured_media.id}"]`
    );
    if (!t) return;
    let e = document.querySelector(
        `#ProductModal-${this.dataset.section} .product-media-modal__content`
      ),
      a = e.querySelector(
        `[data-media-id="${this.currentVariant.featured_media.id}"]`
      ),
      r = t.parentElement;
    r.firstChild != t &&
      (e.prepend(a),
      r.prepend(t),
      (this.stickyHeader =
        this.stickyHeader || document.querySelector("sticky-header")),
      this.stickyHeader &&
        this.stickyHeader.dispatchEvent(new Event("preventHeaderReveal")),
      window.setTimeout(() => {
        r.querySelector("li.product__media-item").scrollIntoView({
          behavior: "smooth",
        });
      }));
  }
  updateURL() {
    this.currentVariant &&
      "false" !== this.dataset.updateUrl &&
      window.history.replaceState(
        {},
        "",
        `${this.dataset.url}?variant=${this.currentVariant.id}`
      );
  }
  updateVariantInput() {
    document
      .querySelectorAll(
        `#product-form-${this.dataset.section}, #product-form-installment`
      )
      .forEach((t) => {
        let e = t.querySelector('input[name="id"]');
        (e.value = this.currentVariant.id),
          e.dispatchEvent(
            new Event("change", {
              bubbles: !0,
            })
          );
      });
  }
  updatePickupAvailability() {
    let t = document.querySelector("pickup-availability");
    t &&
      (this.currentVariant && this.currentVariant.available
        ? t.fetchAvailability(this.currentVariant.id)
        : (t.removeAttribute("available"), (t.innerHTML = "")));
  }
  removeErrorMessage() {
    let t = this.closest("section");
    if (!t) return;
    let e = t.querySelector("product-form");
    e && e.handleErrorMessage();
  }
  renderProductInfo() {
    fetch(
      `${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.section}`
    )
      .then((t) => t.text())
      .then((t) => {
        let e = `price-${this.dataset.section}`,
          a = new DOMParser().parseFromString(t, "text/html"),
          r = document.getElementById(e),
          s = a.getElementById(e);
        s && r && (r.innerHTML = s.innerHTML);
        let n = document.getElementById(`price-${this.dataset.section}`);
        n && n.classList.remove("visibility-hidden"),
          this.toggleAddButton(
            !this.currentVariant.available,
            window.variantStrings.soldOut
          );
      });
  }
  toggleAddButton(t = !0, e, a = !0) {
    let r = document.getElementById(`product-form-${this.dataset.section}`);
    if (!r) return;
    let s = r.querySelector('[name="add"]'),
      n = r.querySelector('[name="add"] > span');
    s &&
      (t
        ? (s.setAttribute("disabled", !0), e && (n.textContent = e))
        : (s.removeAttribute("disabled"),
          (n.textContent = window.variantStrings.addToCart)));
  }
  setUnavailable() {
    let t = document.getElementById(`product-form-${this.dataset.section}`),
      e = t.querySelector('[name="add"]'),
      a = t.querySelector('[name="add"] > span'),
      r = document.getElementById(`price-${this.dataset.section}`);
    e &&
      ((a.textContent = window.variantStrings.unavailable),
      r && r.classList.add("visibility-hidden"));
  }
  getVariantData() {
    return (
      (this.variantData =
        this.variantData ||
        JSON.parse(
          this.querySelector('[type="application/json"]').textContent
        )),
      this.variantData
    );
  }
}
customElements.define("variant-selects", VariantSelects);
class VariantRadios extends VariantSelects {
  constructor() {
    super();
  }
  updateOptions() {
    let t = Array.from(this.querySelectorAll("fieldset"));
    this.options = t.map(
      (t) =>
        Array.from(t.querySelectorAll("input")).find((t) => t.checked).value
    );
  }
}
customElements.define("variant-radios", VariantRadios),
  $(document).ready(function () {
    if (
      ("/cart" == window.location.pathname &&
        (document.location.href = "/?return=cart"),
      -1 != location.href.indexOf("return=cart"))
    ) {
      mmajaxcart.AjaxcartRender(),
        setTimeout(function () {
          mmajaxcart.AjaxcartOpen();
        }, 500);
      var t = window.location.href.replace("?return=cart", "");
      window.history.replaceState({}, document.title, t);
    }
  });

var jq = $;
(window.mmajaxcart = {
  AjaxcartOpen: function () {
    var t = $("body"),
      e = $(".mm-ajaxcart"),
      a = $(".mm-ajaxcart-overlay");
    t.addClass("mm-no-scroll"),
      e.addClass("has--opened"),
      a.addClass("has--active");
  },
  AjaxcartClose: function () {
    var t = $("body"),
      e = $(".mm-ajaxcart"),
      a = $(".mm-ajaxcart-overlay");
    t.removeClass("mm-no-scroll"),
      e.removeClass("has--opened"),
      a.removeClass("has--active");
  },
  AjaxcartRender: function () {
    $.get("/cart?view=mm-ajax", function (t) {
      $(".mm-ajaxcart").html(t);
      var e = parseInt($(".shipping_progress_bar").attr("data-cart-price")),
        a = $(".shipping_progress_bar").attr("data-cart-threshold-type"),
        r = parseInt(
          $(".shipping_progress_bar").attr("data-shipping-threshold")
        ),
        s = parseInt(
          $(".shipping_progress_bar").attr("data-discount10-threshold")
        ),
        n = parseInt(
          $(".shipping_progress_bar").attr("data-discount20-threshold")
        ),
        o = l;
      if (r > n) var l = r;
      else l = n;
      ("shipping_with_discount10" != a && "shipping_with_discount20" != a) ||
        (o = s =
          parseInt(
            $(".shipping_progress_bar").attr("data-discount10-threshold")
          )),
        "shipping_with_discount20" == a &&
          (o = n =
            parseInt(
              $(".shipping_progress_bar").attr("data-discount20-threshold")
            ));
      var d = "";
      e < l
        ? ((d = (e / l) * 100),
          $(".js-threshold-final-price").text(l),
          $(".progress_bar_cart_svg").css("left", d + "%"),
          $("#js-progress-bar").attr("value", d))
        : e > l && e < s && "" != s
        ? ((d = (e / s) * 100),
          $(".js-threshold-final-price").text(s),
          $(".progress_bar_cart_svg").css("left", d + "%"),
          $("#js-progress-bar").attr("value", d))
        : e > s && e < n && "" != n
        ? ((d = (e / n) * 100),
          $(".js-threshold-final-price").text(n),
          $(".progress_bar_cart_svg").css("left", d + "%"),
          $("#js-progress-bar").attr("value", d))
        : ($(".progress_bar_cart_svg").css("left", "100%"),
          $("#js-progress-bar").attr("value", "100"),
          $(".js-threshold-final-price").text(o)),
        $(".cross_sell-product").length < 1 && $(".mm_cross_sell-title").hide()
    }),
      $.getJSON("/cart", function (t) {
        for (i = 0; i < t.items.length; i++)
          "40164789289113" == t.items[i].id &&
            $.ajax({
              type: "POST",
              url: "/cart/change.js",
              dataType: "json",
              data: {
                quantity: 0,
                id: 40164789289113,
              },
              success: function () {
                mmajaxcart.AjaxcartRender(), mmajaxcart.CartCountHandler();
              },
              error: function () {},
            });
      });
  },
  CartCountHandler: function () {
    $.getJSON("/cart.js", function (t) {
      $("[data-cart-count]").text(t.item_count),
        t.item_count > 0
          ? $("[data-cart-count-bubble]").removeClass("hide")
          : $("[data-cart-count-bubble]").addClass("hide");
    });
  },
  AjaxcartChangeHandler: function (t, e = !1) {
    $.ajax({
      url: "/cart/change.js",
      dataType: "json",
      cache: !1,
      type: "post",
      data: t,
      timeout: 5000,
      beforeSend: function () {
        if (e) {
          // Ensure e is a jQuery object
          e = $(e);
  
          // Find the closest .mm-ajaxcart-item-info
          const itemInfo = e.closest(".mm-ajaxcart-item-info");
          
          if (itemInfo.length) {
            // Combine the selectors using a comma to check for either class
            const removeButton = itemInfo.find(".mm-ajaxcart-remove-item, .main-product-remove-item");
  
            // Hide the remove button if found
            if (removeButton.length) {
              removeButton.hide();
            }
  
            // Show the loader
            itemInfo.find(".loader").show();
          }
        }
      },
      success: function (t) {
        mmajaxcart.AjaxcartRender(), mmajaxcart.CartCountHandler();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        if (errorThrown == "timeout" || textStatus == "timeout") {
          console.log("Quantity add or delete timeout error in Cart Drawer");
        }
      },
    });
  },
  AjaxcartQuantityHandler: function () {
    $(document).on("click", ".mm-qty-increment, .mm-qty-decrement", function () {
      let $input = $(this).siblings("input");
      let currentValue = parseInt($input.val());
      let line = parseInt($input.attr("data-line"));
      let maxValue = parseInt($input.attr("max"));
      let minValue = parseInt($input.attr("min"));
  
      if ($(this).hasClass("mm-qty-increment")) {
        if (currentValue < maxValue) {
          currentValue++;
        }
      } else {
        if (currentValue > minValue) {
          currentValue--;
        }
      }
  
      $input.val(currentValue);
      let data = {
        quantity: currentValue,
        line: line,
      };
      mmajaxcart.AjaxcartChangeHandler(data, $input);
    });
  
    $(document).on("focusout", ".mm-ajaxcart-input", function () {
      let $input = $(this);
      let currentValue = parseInt($input.val());
      let line = parseInt($input.attr("data-line"));
      let maxValue = parseInt($input.attr("max"));
      let minValue = parseInt($input.attr("min"));
  
      if (currentValue > maxValue) {
        $input.val(maxValue);
        currentValue = maxValue;
      } else if (currentValue < minValue) {
        $input.val(minValue);
        currentValue = minValue;
      }
  
      let data = {
        quantity: currentValue,
        line: line,
      };
      mmajaxcart.AjaxcartChangeHandler(data, $input);
    });
  
      $(document).on("focusout", ".mm-ajaxcart-input", function () {
        let t = $(this);
        var e = parseInt($(this).val()),
          a = {
            quantity: e,
            line: parseInt($(this).attr("data-line")),
          };
        parseInt(e) > parseInt($(this).attr("max"))
          ? ($(this)
              .parents(".mm-ajaxcart-item-info")
              .find(".error-quantity")
              .val("Quantity exceeds more than " + $(this).attr("max")),
            $(this)
              .parents(".mm-ajaxcart-item-info")
              .find(".error-quantity")
              .show())
          : ($(this)
              .parents(".mm-ajaxcart-item-info")
              .find(".error-quantity")
              .hide(),
            $(this)
              .parents(".mm-ajaxcart-item-info")
              .find(".error-quantity")
              .val("")),
          mmajaxcart.AjaxcartChangeHandler(a, t);
      }),
      $(document).on("click", ".mm-ajaxcart-remove-item", function () {

        let e = $(this);
        let t = {
          quantity: 0,
          line: parseInt(e.attr("data-line")),
        };
        mmajaxcart.AjaxcartChangeHandler(t, e);
        if (e.attr("data-cart-added")) {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: "cart_upsell_purchase",
            status: "failure",
            productTitle: e.attr("data-name"),
            productVariant: parseInt(e.attr("data-id")),
            productPrice: parseInt(e.attr("data-price")),
          });
        }
      });

      class VirtualBundleRemoveButton extends HTMLElement {
        constructor(){
          super();
        }
      
        connectedCallback(){
          this.addEventListener("click",function(){
    
              let formData = {
                updates: {},
              };

              // now lets make an array of products depending on cart price to remove
              var myArray = [];
              let virtualBundleLineItems = document.querySelectorAll('.mm-ajaxcart-item.main-product-image li.mm-ajaxcart-item.virtual-bundle-product');
              
              virtualBundleLineItems.forEach(element =>{
                let mainProductId = this.closest('.mm-ajaxcart-item.main-product-image').getAttribute('data-main-product-id');

                let elementId = element.getAttribute('data-main-product-id');
                  if (mainProductId === elementId){
                    let variantId = element.getAttribute('data-variant-id');
                    myArray.push((variantId));
                } 
              });
              // lets get all variant ids in update object
              var productID;
              for (productID in myArray) {
                formData["updates"][(myArray[productID])] = 0;
              }

              // call update.js if products exist
              if (myArray.length > 0) {
                fetch("/cart/update.js", {
                  body: JSON.stringify(formData),
                  credentials: "same-origin",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  method: "POST",
                })
                  .then(function (response) {
                    return response.json();
                  })
                  .then(function (data) {
                    mmajaxcart.AjaxcartRender();
                    mmajaxcart.CartCountHandler();
                    
                  })
                  .catch(function (err) {
                    /* uh oh, we have error. */
                    console.error(err);
                  });
              }
            
          })
        }
      }
      customElements.define("virtual-bundle-remove-button", VirtualBundleRemoveButton);
  },
}),
  $(document).ready(function () {
    $(document).on("click", ".mm-ajaxcart-open", function (t) {
      t.preventDefault(),
        $(".select_size_quantity--wrapper").hide(),
        mmajaxcart.AjaxcartOpen();
    }),
      $(document).on(
        "click",
        ".mm-ajaxcart-close,.mm-ajaxcart-overlay",
        function (t) {
          t.preventDefault(),
            $(".select_size_quantity--wrapper").hide(),
            $(".delivery-modal-box").hide(),
            mmajaxcart.AjaxcartClose();
        }
      ),
      $(document).on("click", ".cart-edit_svg_close svg", function (t) {
        t.preventDefault(), $(".select_size_quantity--wrapper").hide();
      }),
      $(document).on("click", "div.ajax-size_variant", function (t) {
        t.preventDefault(),
          $("div.ajax-size_variant").removeClass("is-selected"),
          $(this).addClass("is-selected");
      }),
      $(".select_size_quantity--wrapper").hide(),
      $(document).on("click", ".mm-ajax_option_add", function (t) {
        t.preventDefault();
        let e = ($this = $(this)).attr("data-producturl") || "";
        e &&
          (fetch(
            "https://my-borosil.myshopify.com/products/" +
              e +
              "?view=cart_upsell_edit"
          )
            .then(function (t) {
              return t.text();
            })
            .then(function (t) {
              $(".select_size_quantity--wrapper").html(t);
            })
            .catch(function (t) {
              console.log("Failed to fetch page: ", t);
            }),
          $(".select_size_quantity--wrapper").show());
      }),
      $(document).on("click", ".selected_size_variant", function (t) {
        t.preventDefault();
        let e = ($this = $(this)).attr("data-producturl") || "",
          a = $this.attr("data-variantID") || "";
        e &&
          (fetch(
            "https://my-borosil.myshopify.com/products/" +
              e +
              "?view=cart_product_edit"
          )
            .then(function (t) {
              return t.text();
            })
            .then(function (t) {
              $(".select_size_quantity--wrapper").html(t),
                $(".mm-ajax_update_add").attr("data-edit_item-variant", a),
                $("div.update_size_variant.ajax-size_variant").each(function (
                  t
                ) {
                  $(this).attr("value") == a && $(this).addClass("is-selected");
                });
            })
            .catch(function (t) {
              console.log("Failed to fetch page: ", t);
            }),
          $(".select_size_quantity--wrapper").show());
      }),
      $(document).on("click", ".addToCart_btn_mbl", function (t) {
        t.preventDefault();
        var e = $(this);
        let a = e.attr("data-producturl") || "";
        e.attr("data-variantID"),
          a &&
            (fetch(
              "https://my-borosil.myshopify.com/" +
                a +
                "?view=collection_product_edit"
            )
              .then(function (t) {
                return t.text();
              })
              .then(function (t) {
                $(".select_size_quantity--wrapper-plp").html(t),
                  $(
                    "div.update_size_variant.ajax-size_variant:first-child"
                  ).addClass("is-selected");
              })
              .catch(function (t) {
                console.log("Failed to fetch page: ", t);
              }),
            $(".select_size_quantity--wrapper-plp").show());
      }),
      window.innerWidth < 750 &&
        $(document).on("click", ".mm-ajax_variant_add", function (t) {
          var e;
          t.preventDefault(),
            (e = {
              id: parseInt($(".ajax-size_variant.is-selected").attr("value")),
              quantity: parseInt($("#quantity_update").val()),
            }),
            $.ajax({
              url: "/cart/add.js",
              dataType: "json",
              cache: !1,
              type: "post",
              data: e,
              success: function (t) {
                $.getJSON("/cart.js", function (t) {
                  t.item_count > 1
                    ? ($(".select_size_quantity--wrapper").hide(),
                      $(".ajax_addtocart_message").addClass("show-message"),
                      mmajaxcart.CartCountHandler(),
                      mmajaxcart.AjaxcartRender(),
                      $(".site-header__icon.site-header__cart").addClass(
                        "cart-shake"
                      ),
                      setTimeout(function () {
                        $(".ajax_addtocart_message").removeClass(
                          "show-message"
                        );
                      }, 3e3),
                      setTimeout(function () {
                        $(".site-header__icon.site-header__cart").removeClass(
                          "cart-shake"
                        );
                      }, 3500))
                    : (mmajaxcart.CartCountHandler(),
                      mmajaxcart.AjaxcartRender(),
                      mmajaxcart.AjaxcartOpen(),
                      obApi("track", "AddToCart"));
                });
              },
            });
        }),
      $(document).on("click", ".mm-ajax_update_add", function (t) {
        t.preventDefault();
        var e,
          a = parseInt($(".ajax-size_variant.is-selected").attr("value")),
          r = parseInt($("#quantity_update").val());
        e = {
          id: a,
          quantity: r,
        };
        var s = {
            updates: {},
          },
          n = $(this).attr("data-edit_item-variant");
        (s.updates[n] = a != n ? 0 : r > 0 ? r : 0),
          $.ajax({
            url: "/cart/add.js",
            dataType: "json",
            cache: !1,
            type: "post",
            data: e,
            success: function (t) {
              $.ajax({
                url: "/cart/update.js",
                dataType: "json",
                type: "post",
                data: s,
                success: function (t) {
                  mmajaxcart.AjaxcartRender();
                },
              }),
                mmajaxcart.CartCountHandler(),
                mmajaxcart.AjaxcartRender(),
                obApi("track", "AddToCart");
            },
          });
      }),
      $(document).on("click", ".mm-ajax_upsell_add", function (t) {
        t.preventDefault();
        var e,
          a = 1;
        a < 0 && (a = 0),
          (e = {
            id: parseInt($(".mm-ajax_upsell_add").attr("data-id")),
            quantity: a,
          }),
          $.ajax({
            url: "/cart/add.js",
            dataType: "json",
            cache: !1,
            type: "post",
            data: e,
            success: function (t) {
              mmajaxcart.CartCountHandler(),
                mmajaxcart.AjaxcartRender(),
                mmajaxcart.AjaxcartOpen(),
                obApi("track", "AddToCart");
            },
          });
      }),
      $(document).on("click", ".mm-ajax_add", function (t) {
        let e = $(this);
        t.preventDefault();
        let variantId = e.closest("form").find('[name="id"]').val();
        let variantQty = e.closest("form").find('[name="quantity"]').val();
        let formData = {
          id: parseInt(variantId),
          quantity: parseInt(variantQty),
          properties: {
            added_from_cart: variantId,
          },
        };
        $(".select_size_quantity--wrapper").hide(),
          $.ajax({
            url: "/cart/add.js",
            dataType: "json",
            cache: !1,
            type: "post",
            data: formData,
            timeout: 5000,
            beforeSend: function () {
              e.closest("form").find("button").hide(),
                e.closest("form").find(".loader").show();
            },
            success: function (t) {
              mmajaxcart.CartCountHandler(),
                mmajaxcart.AjaxcartRender(),
                mmajaxcart.AjaxcartOpen();
            },
            error: function (jqXHR, textStatus, errorThrown) {
              if (errorThrown == "timeout" || textStatus == "timeout") {
                console.log("ATC timeout error in Cart drawer Page");
              }
            },
          });
      });
  }),
  $(document).on("click", ".login-button", () => {
    sessionStorage.setItem("prevUrl", window.location.href);
  }),
  $(document).on("click", ".mm-ajaxcart-open", (e) => {
    e.preventDefault();
    mmajaxcart.AjaxcartRender();
  });
$(document).ready(() => {
  // Homepage Slider
  $(".homepage-slider-banner-section-inner-body-slider").on("init", () => {
    $(".homepage-slider-banner-section-inner-body-slider").css({
      position: "unset",
    });
    $(".homepage-slider-banner-section-inner").css({ display: "block" });
  });

  $(".homepage-slider-banner-section-inner-body-slider").slick({
    dots: true,
    arrows: true,
    lazyLoad: "ondemand",
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow:
      "<img class='slick-prev homepage-slider-left-arrow' src='https://cdn.shopify.com/s/files/1/0551/8009/9722/files/Group_1019.svg?v=1638770181'>",
    nextArrow:
      "<img class='slick-next homepage-slider-right-arrow' src='https://cdn.shopify.com/s/files/1/0551/8009/9722/files/Group_1020.svg?v=1638770181'>",
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
          arrows: false,
        },
      },
    ],
  });

  // 	Announcement Bar **********************
  const toggleMobileNavbar = () => {
    $("body").toggleClass("no-overflow");
    $(".mobile-navbar").toggleClass("rem-drawer-trans");
  };
  $(".close").click(() => {
    $("body").removeClass("no-overflow");
    $(".mobile-navbar").removeClass("rem-drawer-trans");
  });
  $(".offer").on("init", () => {
    $(".offer a").show();
  });
  document.querySelector(".mobile-megamenu--header").style.display = "flex";
  $(".mobile-offer").on("init", () => {
    $(".mobile-offer a").show();
  });

  const initSlickAnnouncement = (element) => {
    $(element).slick({
      infinite: true,
      speed: 300,
      autoplay: true,
      autoplaySpeed: 3000,
      prevArrow: "<span><<span>",
      nextArrow: "<span>><span>",
    });
  };

  if (document.querySelector(".offer").children.length > 0) {
    if (window.innerWidth >= 1024) {
      initSlickAnnouncement(".offer");
    } else {
      initSlickAnnouncement(".mobile-offer");
    }
  }

  $(".hamburger-icon").click((ev) => {
    $("body").addClass("no-overflow");
    $(".mobile-navbar").addClass("rem-drawer-trans");
  });
  $(".header-search-icon").click((ev) => {
    $(".mobile-search-container").toggle();
  });

  // :: Sticky-header
  window.onscroll = function () {
    addSticky();
  };

  var header;
  $(document).width() > 1024
    ? (header = document.getElementById("navbar-container"))
    : (header = document.getElementById("header-container"));
  var sticky = header.offsetTop;

  function addSticky() {
    if (window.pageYOffset > sticky) {
      header.classList.add("sticky");
      $(".mm_dropdown.container.megamenu").css({ top: "75px" });
    } else {
      header.classList.remove("sticky");
      $(".mm_dropdown.container").css({ top: "120px" });
    }
  }

  $(document).on("click", ".mobile-megamenu--listitem", function (event) {
    $(this).children(".mm-right-arrow").toggleClass("menu-open");
    $(this)
      .parents(".listitem-cotainer-mm")
      .children(".mm-m-c")
      .toggleClass("show");
  });

  $(".header_navigation--item").hover(
    function (event) {
      if ($(this).children(".mm_dropdown.container.megamenu").length) {
        $(".header-container").css({
          "box-shadow": "0px 200px 1300px 2000px rgb(0 0 0 / 20%)",
        });
        $(".sticky-collection-top-filters.sticky-filter").hide();
      }
    },
    function (event) {
      $(".header-container").css({
        "box-shadow": "1px -4px 13px 2px rgb(0 0 0 / 20%)",
      });
      $(".sticky-collection-top-filters.sticky-filter").show();
    }
  );

  $(".listitem-cotainer-mm").each((index, element) => {
    if ($(element).children(".mm-m-c").length < 1)
      $(element).find(".mm-right-arrow").hide();
  });

  if ($(".offer").find(".announcement").length < 1) $(".offer").hide();
  //     ****************** Product Preview Slider
});

$(window).on("load", function () {
  $(".homepage-slider-banner-section-inner-body-slider").slick(
    "slickSetOption",
    {
      autoplay: true,
    },
    true
  );

  //   Homepage Blog Section
  $(".homepage-blogs-section-slider").slick({
    dots: false,
    arrows: true,
    infinite: true,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    prevArrow:
      "<img class='slick-prev' src='https://cdn.shopify.com/s/files/1/0551/8009/9722/files/Regular-M_3.svg?v=1637908140'>",
    nextArrow:
      "<img class='slick-next' src='https://cdn.shopify.com/s/files/1/0551/8009/9722/files/Regular-M_2.svg?v=1637908140'>",
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
          arrows: false,
        },
      },
    ],
  });

  // Homepage Category Section
  //   if (window.matchMedia("(max-width: 768px)").matches) {
  if ($(window).width() < 768) {
    /* the viewport is less than 768 pixels wide */
    $("#homepagecategory").slick({
      dots: false,
      arrows: true,
      infinite: false,
      speed: 300,
      slidesToShow: 1.2,
      slidesToScroll: 1,
    });
  }

  // Shop with Advantage
  /* Check width on page load*/
  if ($(window).width() < 749) {
    $("#shopwithadvantage").addClass("shop-with-advantage-slider");
    $(".shop-with-advantage-slider").slick({
      dots: false,
      arrows: false,
      infinite: false,
      speed: 300,
      slidesToShow: 1.2,
      slidesToScroll: 1,
    });
  }

  // Product Card Common Functions
  $(document).on("click", ".close_error_Box", function () {
    $(this).parents(".product-card").find(".modal").css("display", "none");
  });

  //Variant Selection
  $(document).on("click", ".variant-selector-listitem", function () {
    if ($(this).hasClass("is-selected")) {
      return;
    }

    $(this)
      .parents(".variant-selector-list")
      .find(".variant-selector-listitem")
      .removeClass("is-selected");
    $(this).addClass("is-selected");

    var selectedVariantTitle = $(this).attr("data-variant-title");
    $(this)
      .parents(".product-card__variants")
      .find(".variant-selector-value")
      .html(selectedVariantTitle);

    if ($(this).attr("data-variant-available") == "true") {
      $(this)
        .parents(".product-card")
        .find(".homepage-product-card__addtocart")
        .removeClass("is-disabled");
      $(this)
        .parents(".product-card")
        .find(".homepage-product-card__addtocart")
        .html("Add to cart");
    } else {
      $(this)
        .parents(".product-card")
        .find(".homepage-product-card__addtocart")
        .addClass("is-disabled");
      $(this)
        .parents(".product-card")
        .find(".homepage-product-card__addtocart")
        .html("Sold out");
    }

    //change the price
    let selectedQuantityPrice = parseInt($(this).attr("data-variant-price"));
    let selectedQuantityMaxPrice = parseInt(
      $(this).attr("data-variant-Maxprice")
    );
    let selectedQuantityPriceToPrint = $(this).attr(
      "data-variant-priceToPrint"
    );
    let selectedQuantityMaxPriceToPrint = $(this).attr(
      "data-variant-MaxpriceToPrint"
    );

    $(this)
      .parents(".product-card")
      .find(".product-card__regularprice")
      .html(selectedQuantityPriceToPrint);
    $(this)
      .parents(".product-card")
      .find(".product-card__compareprice")
      .html(selectedQuantityMaxPriceToPrint);

    if (selectedQuantityMaxPrice > selectedQuantityPrice) {
      $(this)
        .parents(".product-card")
        .find(".product-card__compareprice")
        .html(selectedQuantityMaxPriceToPrint);
      let SelectedVariantDiscount = parseInt(
        ((selectedQuantityMaxPrice - selectedQuantityPrice) /
          selectedQuantityMaxPrice) *
          100
      );
      $(this)
        .parents(".product-card")
        .find(".product-card__discountpercentage")
        .html(SelectedVariantDiscount + "% off");
    }

    //change the variant available quantity
    var variantQuantity = $(this).attr("data-variant-quantity");
    $(this)
      .parents(".product-card__selectors")
      .find(".TotalQuantity")
      .val(variantQuantity);
  });

  //Quantity selector dropdown
  $(document).on("click", ".product-card__quantity", function () {
    var selectedQuantity = $(this)
      .parents(".product-card__selectors")
      .find(".quantity-selector-list");
    if (selectedQuantity.hasClass("dropdown-open")) {
      selectedQuantity.removeClass("dropdown-open");
      selectedQuantity.css("display", "none");
    } else {
      $(".quantity-selector-list").removeClass("dropdown-open");
      $(".quantity-selector-list").css("display", "none");
      selectedQuantity.addClass("dropdown-open");
      selectedQuantity.css("display", "block");
    }
  });

  //when user clicks anywhere on window
  $(document).on("click", function (event) {
    var $triggerQuantitySelector = $(".product-card__quantity");
    var $triggerVariantSelector = $(".product-card__variants");

    if (
      $triggerQuantitySelector !== event.target &&
      !$triggerQuantitySelector.has(event.target).length
    ) {
      $(".quantity-selector-list").removeClass("dropdown-open");
      $(".quantity-selector-list").css("display", "none");
    }
    if (
      $triggerVariantSelector !== event.target &&
      !$triggerVariantSelector.has(event.target).length
    ) {
      $(".variant-selector-list").removeClass("dropdown-open");
      $(".variant-selector-list").css("display", "none");
    }
  });

  // Quantity selector
  $(document).on("click", ".quantity-selector-listitem", function () {
    if ($(this).hasClass("is-selected")) return;

    $(this)
      .parents(".quantity-selector-list")
      .find(".quantity-selector-listitem")
      .removeClass("is-selected");
    $(this).addClass("is-selected");

    let selectedQuantityValue = $(this).attr("data-value");
    if (selectedQuantityValue >= 10) {
      $(this).parents(".product-card__quantity").css("display", "none");
      $(this)
        .parents(".product-card__selectors")
        .find(".quantity-selector-input")
        .css("display", "block");
      $(this)
        .parents(".product-card__selectors")
        .find(".quantity-selector-input")
        .focus();
    } else {
      $(this)
        .parents(".product-card__quantity")
        .find(".quantity-selector-value")
        .html(selectedQuantityValue);
    }
  });

  // Variant selector dropdown
  $(document).on("click", ".product-card__variants", function () {
    let selectedVariant = $(this)
      .parents(".product-card__selectors")
      .find(".variant-selector-list");

    if (selectedVariant.hasClass("dropdown-open")) {
      selectedVariant.removeClass("dropdown-open");
      selectedVariant.css("display", "none");
    } else {
      $(".variant-selector-list").removeClass("dropdown-open");
      $(".variant-selector-list").css("display", "none");
      selectedVariant.addClass("dropdown-open");
      selectedVariant.css("display", "block");
    }
  });

  $(".collection-slider__button").click(function (event) {
    $(this)
      .parent(".collection-slider__header")
      .find(".ViewAllButton_Loader")
      .css("display", "block");
    $(this).css("display", "none");
  });

  //     Homepage Slider Banner ***********************
  $(".homepage-shop-now-button").click((e) => {
    $(".homepage-shop-now-button").css("display", "none");
    $(".loader-container").css("display", "block");
  });

  // testimonials sliders
  $(".homepage-testimonial-section-slider").slick({
    dots: true,
    arrows: true,
    infinite: true,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1023,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
          arrows: false,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
          arrows: false,
        },
      },
    ],
  });

  $(".btn-read-more").click(function (e) {
    $(this).hide();
    $(this)
      .parents(".homepage-testimonial-section-blocks-text")
      .find(".read-more-text")
      .hide();
    $(this)
      .parents(".homepage-testimonial-section-blocks-text")
      .find(".read-less-text")
      .show();
    $(this)
      .parents(".homepage-testimonial-section-blocks-text")
      .find(".btn-read-less")
      .show();
  });

  $(".btn-read-less").click(function (e) {
    $(this).hide();
    $(this)
      .parents(".homepage-testimonial-section-blocks-text")
      .find(".read-less-text")
      .hide();
    $(this)
      .parents(".homepage-testimonial-section-blocks-text")
      .find(".read-more-text")
      .show();
    $(this)
      .parents(".homepage-testimonial-section-blocks-text")
      .find(".btn-read-more")
      .show();
  });

  if ($(window).width() < 749) {
    $("#whychooseborosilhomepage").addClass("why-choose-borosil-slider");
    $(".why-choose-borosil-slider").slick({
      dots: false,
      arrows: true,
      infinite: false,
      speed: 200,
      slidesToShow: 1,
      slidesToScroll: 3,
      responsive: [
        {
          breakpoint: 749,
          settings: {
            slidesToShow: 3.5,
            slidesToScroll: 3,
            infinite: false,
            dots: false,
            arrows: false,
          },
        },
      ],
    });
  }
});

const quantitySel = (chosenQty, inventory, ev) => {
  if (chosenQty == 0 || chosenQty == NaN) {
    $(ev.target)
      .parents(".product-card")
      .find(".homepage-product-card__addtocart")
      .addClass("is-disabled");
    return;
  }

  if (chosenQty > inventory || inventory < 1) {
    $(ev.target)
      .parents(".product-card")
      .find(".error-quantity")
      .show()
      .html("Quantity exceeds more than" + inventory);
    $(ev.target)
      .parents(".product-card")
      .find(".homepage-product-card__addtocart")
      .addClass("is-disabled");
    if (inventory < 1)
      $(ev.target).parents(".product-card").find(".error-quantity").hide();
  } else {
    $(ev.target).parents(".product-card").find(".error-quantity").hide();
    $(ev.target)
      .parents(".product-card")
      .find(".homepage-product-card__addtocart")
      .removeClass("is-disabled");
  }
};

$(document).on("click", ".variant-selector-listitem", function (ev) {
  let chosenQty = $(ev.target)
    .parents(".product-card__selectors")
    .find(".quantity-selector-listitem.is-selected")
    .data("value");
  let variantSelected = $(ev.target)
    .parents(".product-card__selectors")
    .find(".variant-selector-listitem.is-selected")
    .attr("data-variant");
  let variantInventoryQuantity = parseInt(
    $(ev.currentTarget).attr("data-variantavl")
  );
  quantitySel(chosenQty, variantInventoryQuantity, ev);
});

$(document).on("click", ".quantity-selector-listitem", function (ev) {
  let chosenQty = $(ev.target).data("value");
  let variantSelected = $(ev.target)
    .parents(".product-card__selectors")
    .find(".variant-selector-listitem.is-selected")
    .attr("data-variant");
  let variantInventoryQuantity = $(ev.target)
    .parents(".product-card__selectors")
    .find(".variant-selector-listitem.is-selected")
    .attr("data-variantavl");
  quantitySel(chosenQty, variantInventoryQuantity, ev);
});

$(document).on("keyup", ".quantity-selector-input", function (ev) {
  let chosenQty = $(ev.target).val();
  let variantSelected = $(ev.target)
    .parents(".product-card__selectors")
    .find(".variant-selector-listitem.is-selected")
    .attr("data-variant");
  let variantInventoryQuantity = $(ev.target)
    .parents(".product-card__selectors")
    .find(".variant-selector-listitem.is-selected")
    .attr("data-variantavl");
  quantitySel(parseInt(chosenQty), variantInventoryQuantity, ev);
});

$(".quantity-selector-input").blur((ev) => {
  let chosenQty = $(ev.target).val();
  if (!chosenQty) $(ev.target).val(1);
});

//Add To Cart
$(document).on("click", ".homepage-product-card__addtocart", function (event) {
  event.preventDefault();
  if ($(this).hasClass("is-disabled")) {
    return;
  }

  var selectedVariant = $(this)
    .parents(".product-card")
    .find(".variant-selector-listitem.is-selected");
  var variantId = selectedVariant.attr("data-variant");

  var quantity = "";
  let availableInventory = 0;
  if (
    $(this)
      .parents(".product-card")
      .find(".product-card__quantity")
      .css("display") == "none"
  ) {
    quantity = $(this)
      .parents(".product-card")
      .find(".quantity-selector-input")
      .val();
  } else {
    quantity = $(this)
      .parents(".product-card")
      .find(".quantity-selector-listitem.is-selected")
      .attr("data-value");
  }

  // Start quantity verification in inventory

  // Dont use the event var its a keywork, using because used earlier everywhere.
  const currentVariantId = $(this)
    .siblings(".product-card__selectors")
    .find(".variant-selector-listitem.is-selected")
    .attr("data-variant");

  availableInventory = $(this)
    .siblings(".product-card__selectors")
    .find(".variant-selector-listitem.is-selected")
    .attr("data-variantavl");

  // :: end quantity verication in inventory
  if (parseInt(quantity) > 0 && parseInt(quantity) <= availableInventory) {
    const _this = this;
    $(this).parents(".product-card").find(".loader").show();
    $(this)
      .parents(".product-card")
      .find(".homepage-product-card__addtocart")
      .hide();

    $.ajax({
      method: "POST",
      url: "/cart/add.js",
      dataType: "json",
      cache: false,
      data: {
        id: parseInt(variantId),
        quantity: parseInt(quantity),
      },
      timeout: 5000,
      success: function () {
        mmajaxcart.CartCountHandler();
        mmajaxcart.AjaxcartRender();
        if (!$(".mm-ajaxcart").hasClass("has--opened")) {
          mmajaxcart.AjaxcartOpen();
          $(_this).parents(".product-card").find(".loader").hide();
          $(_this)
            .parents(".product-card")
            .find(".homepage-product-card__addtocart")
            .show();
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        if (errorThrown == "timeout" || textStatus == "timeout") {
          console.log("ATC timeout error in Homepage collection Widget");
        } else {
          $(event.target).siblings(".error-quantity").show();
        }
        $(".collection-slider .product-card__info .loader").hide();
        $(
          ".collection-slider .product-card__info .homepage-product-card__addtocart"
        ).show();
      },
    });
  } else {
    $(event.target)
      .parents(".product-card")
      .find(".homepage-product-card__addtocart")
      .addClass("is-disabled");
    if (parseInt(quantity) < 1) {
      $(this)
        .parents(".product-card")
        .find(".homepage-product-card__addtocart")
        .addClass("is-disabled");
    }
  }
});

//new UI/UX changes

$(document).ready(function () {
  if (window.location.href.indexOf("collections") > -1) {
    $("#faq-section-updated").detach().appendTo("#MainContent");
    $(".mmc-breadcrumb").css("margin", "2rem 0px");
  }

  if ($(window).width() < 768) {
    if (window.location.href.indexOf("collections") > -1) {
      $(".mmc-breadcrumb").css("margin", "1rem 0px");
    }
  }

  if (window.location.href.indexOf("products") > -1) {
    $(".video-header").css("padding-top", "30px");
  }

  //To hide/show Readmore button on product page
  if ($(window).width() > 1450) {
    document
      .querySelectorAll(".product_card_description")
      .forEach((el, index) => {
        if (el.innerText.length < 130) {
          document.querySelector(`.product_read_more${index}`).style.display =
            "none";
        }
      });
  }

  // To Hide Readmore Button If the Description has less than 4 lines
  if ($(window).width() > 1355) {
    document
      .querySelectorAll(".product_card_description")
      .forEach((el, index) => {
        if (el.innerText.length < 117) {
          document.querySelector(`.product_read_more${index}`).style.display =
            "none";
        }
      });
  }

  //Special Condition to Check If the title has 2 lines, then we truncate the description to 3 lines
  if ($(window).width() > 993) {
    document.querySelectorAll(".product_card_title").forEach((el, index) => {
      function productDescToggleFunction() {
        var hideDescriptionIfTwoLineTitle = document.querySelector(
          ".Product_metafields_card_info p"
        );
        hideDescriptionIfTwoLineTitle.classList.toggle("active");
      }

      if (el.innerText.length > 24) {
        document
          .querySelector(`.product_card_title_desc${index}`)
          .classList.add("twoLineTitleDescToggle");
        document.querySelector(`.product_read_more${index}`).style.display =
          "block";
        document
          .querySelector(`.product_read_more${index}`)
          .addEventListener("click", function () {
            document
              .querySelector(`.product_card_title_desc${index}`)
              .toggleClass("active");
          });
      }
    });
  }

  // To Hide Readmore Button If the Description has less than 4 lines
  if ($(window).width() < 600) {
    document
      .querySelectorAll(".product_card_description")
      .forEach((el, index) => {
        if (el.innerText.length < 170) {
          document.querySelector(`.product_read_more${index}`).style.display =
            "none";
        } else {
          document.querySelector(`.product_read_more${index}`).style.display =
            "block";
        }
      });
  }

  // To Hide Readmore Button If the Description has less than 4 lines
  if ($(window).width() < 400) {
    document
      .querySelectorAll(".product_card_description")
      .forEach((el, index) => {
        if (el.innerText.length < 150) {
          document.querySelector(`.product_read_more${index}`).style.display =
            "none";
        } else {
          document.querySelector(`.product_read_more${index}`).style.display =
            "block";
        }
      });
  }

  // To Hide Readmore Button If the Description has less than 4 lines
  if ($(window).width() < 350) {
    document
      .querySelectorAll(".product_card_description")
      .forEach((el, index) => {
        if (el.innerText.length < 110) {
          document.querySelector(`.product_read_more${index}`).style.display =
            "none";
        } else {
          document.querySelector(`.product_read_more${index}`).style.display =
            "block";
        }
      });
  }

  // Product Page what makes our product great description
  $(".Product_metafields_custom_readmore").click(function () {
    $(this).text($(this).text() == "Read less" ? "Read more" : "Read less");
    $(this)
      .parent()
      .find(".Product_metafields_card_info p")
      .toggleClass("active");
  });

  if ($(window).width() < 768) {
    if (window.location.href.indexOf("collections") > -1) {
      $(".mmc-breadcrumb").detach().appendTo(".collection-banner");
      $(".mmc-breadcrumb").css("margin", "1rem 0px");
    }
  }

  $(document).on("click", ".lang-parent", function (event) {
    $(this).toggleClass("open");
    $(".lang-child").toggleClass("open");
  });

  // <!-- --------ramakrishna code start----------- -->
  $(document).on("click", ".product-card__variants", function () {
    $(".product-card__variants li").removeClass("greyBG");
    var ul_elem = $(this).find(".variant-selector-listitem");
    $(ul_elem).each(function (i, obj) {
      if ($(this).attr("data-variant-available") == "false") {
        $(this).addClass("greyBG");
      }
    });
  });
  // <!-- --------ramakrishna code ends----------- -->

  //for customise button
  $(document).on("click", ".variant-options-listItem", function () {
    if ($(this).attr("data-variant-available") == "true") {
      $("#customizer-button").removeClass("customize-soldout-button");
      $("#customizer-button").addClass("customize-button");
    } else {
      $("#customizer-button").addClass("customize-soldout-button");
      $("#customizer-button").removeClass("customize-button");
    }
  });
});

/*-----------lazy-load-homepage-------------*/
Shopify.homepageLazyload = function () {
  // testimonials sliders
  $(".homepage-testimonial-section-slider").slick({
    dots: true,
    arrows: true,
    infinite: true,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1023,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
          arrows: false,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
          arrows: false,
        },
      },
    ],
  });

  //whychooseborosilhomepage slider
  if ($(window).width() < 749) {
    $("#whychooseborosilhomepage").addClass("why-choose-borosil-slider");
    $(".why-choose-borosil-slider").slick({
      dots: false,
      arrows: true,
      infinite: false,
      speed: 200,
      slidesToShow: 1,
      slidesToScroll: 3,
      responsive: [
        {
          breakpoint: 749,
          settings: {
            slidesToShow: 3.5,
            slidesToScroll: 3,
            infinite: false,
            dots: false,
            arrows: false,
          },
        },
      ],
    });
  }

  //   if (window.matchMedia("(max-width: 768px)").matches) {
  if ($(window).width() < 768) {
    /* the viewport is less than 768 pixels wide */
    $("#homepagecategory").slick({
      dots: false,
      arrows: true,
      infinite: false,
      speed: 300,
      slidesToShow: 1.2,
      slidesToScroll: 1,
    });
  }

  // Shop with Advantage
  /* Check width on page load*/
  if ($(window).width() < 749) {
    $("#shopwithadvantage").addClass("shop-with-advantage-slider");
    $(".shop-with-advantage-slider").slick({
      dots: false,
      arrows: false,
      infinite: false,
      speed: 300,
      slidesToShow: 1.2,
      slidesToScroll: 1,
    });
  }

  // homepage collection slider slider
  if ($(window).width() > 749) {
    $(`.collection-slider__wrapper`)
      .not(".slick-initialized")
      .slick({
        dots: true,
        arrows: true,
        lazyLoad: "ondemand",
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        prevArrow: `<button class="slick-arrow slick-prev arrow-bg"><svg width="20px" height="20px" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-left" class="svg-inline--fa fa-arrow-left fa-w-14" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"/></svg></button>`,
        nextArrow: `<button class="slick-arrow slick-next arrow-bg"><svg width="20px" height="20px" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-right" class="svg-inline--fa fa-arrow-right fa-w-14" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"/></svg></button>`,
        responsive: [
          {
            breakpoint: 1441,
            settings: {
              dots: true,
              arrows: true,
              slidesToShow: 4,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 1134,
            settings: {
              dots: true,
              arrows: false,
              slidesToShow: 3,
            },
          },
          {
            breakpoint: 872,
            settings: {
              slidesToShow: 2,
              dots: false,
              arrows: false,
            },
          },
          {
            breakpoint: 767,
            settings: {
              dots: false,
              arrows: false,
              slidesToShow: 1.1,
              slidesToScroll: 1,
              centerMode: true,
              centerPadding: "90px",
            },
          },
        ],
      });
  }
};

$(document).ready(function () {
  function e() {
    "false" == sessionStorage.getItem("lazyloaded_sections") &&
      ($.ajax({
        url: "/pages/custom-homepage",
        type: "GET",
        dataType: "html",
        success: function (e) {
          let t = $(e).find("#index-lazyload_sections").html();
          $(".custom-lazyloaded-content").html(t);
          if ($(".custom-lazyloaded-content").length > 0) {
            Shopify.homepageLazyload();
          }
        },
      }),
      sessionStorage.setItem("lazyloaded_sections", "true"));
  }
  sessionStorage.setItem("lazyloaded_sections", "false"),
    document.addEventListener("touchmove", e, !0),
    document.addEventListener("scroll", e, !0);
});

$(document).ready(function () {
  $(document).on("click", function (e) {
    let clkEle = e.target;
    if ($(clkEle).hasClass("checkout-ldr")) {
      // $(".checkout-loader__outer .loader").css("display", "block");
    }
  });
});

//homepage collection slider
$(document).ready(function () {
  if ($(window).width() > 749) {
    $(`.collection-slider__wrapper`)
      .not(".slick-initialized")
      .slick({
        dots: true,
        arrows: true,
        lazyLoad: "ondemand",
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        prevArrow: `<button class="slick-arrow slick-prev arrow-bg"><svg width="20px" height="20px" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-left" class="svg-inline--fa fa-arrow-left fa-w-14" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"/></svg></button>`,
        nextArrow: `<button class="slick-arrow slick-next arrow-bg"><svg width="20px" height="20px" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-right" class="svg-inline--fa fa-arrow-right fa-w-14" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"/></svg></button>`,
        responsive: [
          {
            breakpoint: 1441,
            settings: {
              dots: true,
              arrows: true,
              slidesToShow: 4,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 1134,
            settings: {
              dots: true,
              arrows: true,
              slidesToShow: 3,
            },
          },
          {
            breakpoint: 872,
            settings: {
              slidesToShow: 2,
              dots: false,
              arrows: false,
            },
          },
          {
            breakpoint: 767,
            settings: {
              dots: false,
              arrows: false,
              slidesToShow: 1.1,
              slidesToScroll: 1,
              centerMode: true,
              centerPadding: "90px",
            },
          },
        ],
      });
  }
  //category section 2.5 sliders
  if ($(".category-main__flex.slider-yes").length > 0) {
    $(".category-main__flex.slider-yes").slick();
  }
});
$(document).ready(function () {
  $(document).on("click", function (e) {
    let clkEle = e.target;
    if ($(clkEle).hasClass("checkout-ldr")) {
      // $(".checkout-loader__outer .loader").css("display", "block");
    }
  });
});

$(document).ready(function () {
  $(document).on("click", function (e) {
    let clkEle = e.target;
    if ($(clkEle).hasClass("checkout-ldr")) {
      // $(".checkout-loader__outer .loader").css("display", "block");
    }
  });
  //account icon hide and show account list on click
  $(".account-icon").click(function () {
    $(".account-icon__list").toggleClass("is-active");
  });
  //account icon hide the account list on scroll
  $(window).scroll(function () {
    if ($(".icons-list-bottom.account-icon__list.is-active")) {
      $(".icons-list-bottom.account-icon__list.is-active").removeClass(
        "is-active"
      );
    }
  });
  //open-hamburger on click of category button
  $(".open-hamburger").click(function () {
    $(".mobile-navbar").toggleClass("rem-drawer-trans");
  });
});

//adding a custom icon for reward points rather than App icon
$(document).ready(function () {
  $("#custom-reward-button").on("click", function (e) {
    e.preventDefault();
    let smileIframe = $("#smile-lite-launcher-frame");
    let smileIframeLater = $(".smile-launcher-frame");
    if (smileIframe.length > 0) {
      let smileIframeDoc = smileIframe.contents();
      let smileButton = smileIframeDoc.find("button");
      smileButton.click();
      setTimeout(function () {
        let smileStyle = $(".smile-launcher-frame").contents().find("style");
        smileStyle.append(
          ".launcher-button {display: none !important;} .launcher-body{display: none !important;}"
        );
      }, 3000);
    } else if (smileIframeLater.length > 0) {
      let smileIframeDoc = smileIframeLater.contents();
      let smileStyle = smileIframeDoc.find("style");
      smileStyle.append(
        ".launcher-button {display: none !important;} .launcher-body{display: none !important;}"
      );
      let smileButton = smileIframeDoc.find("button");
      smileButton.click();
    }
  });
  $(document).on("click", ".close-btn.panel-header-icon", function (e) {
    let smileStyle = $(".smile-launcher-frame").contents().find("style");
    smileStyle.append(
      ".launcher-button {display: none !important;} .launcher-body{display: none !important;}"
    );
  });
});

//recently viewed section homepage
function recentlyViewed() {
  (window.marmeto = window.marmeto || {}),
    (marmeto.RecentlyViewedProducts = (function () {
      function t(t) {
        (this.container = document.querySelector(
          '[data-section-type="' + t + '"]'
        )),
          this.container &&
            ((this.options = JSON.parse(
              this.container.getAttribute("data-section-settings")
            )),
            this.options.productId && this.saveCurrentProduct(),
            this.fetchProducts());
      }
      return (
        (t.prototype.fetchProducts = function () {
          var t = this,
            r = this.getSearchQueryString();
          "" !== r &&
            fetch(
              "/search?view=mm-recently-viewed-products&type=product&q=".concat(
                r
              ),
              { credentials: "same-origin", method: "GET" }
            ).then(function (r) {
              r.text().then(function (r) {
                var e = document.createElement("div");
                (e.innerHTML = r),
                  (t.container.querySelector(
                    ".mm-recentlyviewed__container"
                  ).innerHTML = e.querySelector(
                    '[data-section-type="mm-recently-viewed-products"] .mm-recentlyviewed__container'
                  ).innerHTML),
                  (t.container.parentNode.style.display = "block"),
                  t.initSlider();
              });
            });
        }),
        (t.prototype.saveCurrentProduct = function () {
          var t = JSON.parse(
              localStorage.getItem("mmRecentlyViewedProducts") || "[]"
            ),
            r = this.options.productId;
          t.includes(r) || t.unshift(r);
          try {
            localStorage.setItem(
              "mmRecentlyViewedProducts",
              JSON.stringify(t.slice(0, 12))
            );
          } catch (t) {}
        }),
        (t.prototype.getSearchQueryString = function () {
          var t = JSON.parse(
            localStorage.getItem("mmRecentlyViewedProducts") || "[]"
          );
          return (
            t.includes(this.options.productId) &&
              t.splice(t.indexOf(this.options.productId), 1),
            t
              .map(function (t) {
                return "id:" + t;
              })
              .join(" OR ")
          );
        }),
        (t.prototype.initSlider = function () {
          $(".mm-recentlyviewed__products").slick({
            dots: true,
            arrows: true,
            lazyLoad: "ondemand",
            infinite: true,
            slidesToShow: 5,
            slidesToScroll: 1,
            prevArrow: `<button class="slick-arrow slick-prev arrow-bg"><svg width="20px" height="20px" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-left" class="svg-inline--fa fa-arrow-left fa-w-14" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"/></svg></button>`,
            nextArrow: `<button class="slick-arrow slick-next arrow-bg"><svg width="20px" height="20px" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-right" class="svg-inline--fa fa-arrow-right fa-w-14" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"/></svg></button>`,
            responsive: [
              {
                breakpoint: 1441,
                settings: {
                  dots: true,
                  arrows: true,
                  slidesToShow: 4,
                  slidesToScroll: 1,
                },
              },
              {
                breakpoint: 1134,
                settings: {
                  dots: true,
                  arrows: false,
                  slidesToShow: 3,
                },
              },
              {
                breakpoint: 872,
                settings: {
                  slidesToShow: 2,
                  dots: false,
                  arrows: false,
                },
              },
              {
                breakpoint: 767,
                settings: {
                  dots: false,
                  arrows: false,
                  slidesToShow: 1.1,
                  slidesToScroll: 1,
                  centerMode: true,
                  centerPadding: "90px",
                },
              },
            ],
          });
        }),
        t
      );
    })()),
    new marmeto.RecentlyViewedProducts("mm-recently-viewed-products");
}
Defer(recentlyViewed, 0, true);

//money formattor
function moneyFormattor(number) {
  number = parseInt(number / 100);
  return number.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "INR",
  });
}

// //ajax-cart functionality
$(document).ready(function () {
  //toggle the drop down
  $(document).on("click", ".main-bundle__items-header", function (e) {
    console.log("dropdown toggle");
    let parent = $(this).closest(".main-bundle__items-wrapper");
    parent.find(".main-bundle__items").toggleClass("open");
    $(this).toggleClass("open");
  });

  //bundle remove the products from the cart
  $(document).on("click", ".main-bundle__delete", function () {
    let parent = $(this).closest(".main-bundle__wrapper");
    parent.find(".main-bundle__delete").hide();
    parent.find(".loader").show();

    let idArr = $(this).attr("data-delete-bundle").split(",");
    const update = {};
    idArr.forEach(function (item) {
      update[item] = "0";
    });

    fetch("/cart/update.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ updates: update }),
    }).then((data) => {
      mmajaxcart.AjaxcartRender(), mmajaxcart.CartCountHandler();
    });
  });
});

// The below js code is for lazy loading the sections.
class LazySection extends HTMLElement {
  static sectionsToFetch = [];

  constructor() {
    super();

    this.section = this.closest("section")?.id || this.closest("[id]").id;
    this.section = this.section?.replace("shopify-section-", "");

    this.trigger = this.dataset.triggerEvent || "intersection-observer";
    this.targetSelector = this.dataset.triggerTarget || "body";

    this.boundHandleMouseover = this.handleMouseover.bind(this);
    this.boundHandleClick = this.handleClick.bind(this);
  }

  connectedCallback() {
    const targetElement = document.querySelector(this.targetSelector);

    // Different triggers based on data-trigger attribute
    if (this.trigger === "mouseover") {
      if (screen.width < 990) return;

      targetElement.addEventListener("mouseover", this.boundHandleMouseover);
    } else if (this.trigger === "click") {
      targetElement.addEventListener("click", this.boundHandleClick);
    } else {
      // Default to intersection observer
      new IntersectionObserver(this.handleIntersection.bind(this), {
        rootMargin: "0px 0px 200px 0px",
      }).observe(this);
    }
  }

  // Handler for intersection-observer trigger
  handleIntersection(entries, observer) {
    if (!entries[0].isIntersecting) return;
    observer.unobserve(this);

    this.fetchSections();
  }

  // Handler for mouseover trigger
  handleMouseover() {
    // Remove trigger once added to sectionsToFetch
    this.removeTrigger();
    this.fetchSections();
  }

  // Handler for click trigger
  handleClick() {
    // Remove trigger once added to sectionsToFetch
    this.removeTrigger();
    this.fetchSections();
  }

  // Common function for fetching sections
  fetchSections() {
    LazySection.sectionsToFetch.push(this.section);
    const sectionsToFetchBatch =
      LazySection.sectionsToFetch.length == 5
        ? LazySection.sectionsToFetch.splice(0, 5)
        : LazySection.sectionsToFetch;

    // Check if there is an ongoing network request
    if (LazySection.abortController) {
      LazySection.abortController.abort();
    }

    LazySection.abortController =
      sectionsToFetchBatch.length < 5 && new AbortController();

    fetch(
      window.location.pathname + "?sections=" + sectionsToFetchBatch.join(","),
      LazySection.abortController.signal
        ? { signal: LazySection.abortController.signal }
        : {}
    )
      .then((response) => response.json())
      .then((json) => {
        for (const [key, value] of Object.entries(json)) {
          const sectionContent = new DOMParser()
            .parseFromString(value, "text/html")
            .getElementById("shopify-section-" + key);

          if (sectionContent && sectionContent.innerHTML.trim().length) {
            const section = document.getElementById("shopify-section-" + key);
            section.innerHTML = sectionContent.innerHTML;

            // Reinjects the script tags to allow execution. By default, scripts are disabled when using element.innerHTML.
            section.querySelectorAll("script").forEach((oldScriptTag) => {
              const newScriptTag = document.createElement("script");
              Array.from(oldScriptTag.attributes).forEach((attribute) => {
                newScriptTag.setAttribute(attribute.name, attribute.value);
              });
              newScriptTag.appendChild(
                document.createTextNode(oldScriptTag.innerHTML)
              );
              oldScriptTag.parentNode.replaceChild(newScriptTag, oldScriptTag);
            });
          }
        }

        if (sectionsToFetchBatch.length < 5) LazySection.sectionsToFetch = [];
      })
      .catch((e) => {
        console.warn(e);
      });
  }

  // Remove trigger based on data-target attribute
  removeTrigger() {
    const targetElement = document.querySelector(this.targetSelector);

    if (targetElement) {
      targetElement.removeEventListener("mouseover", this.boundHandleMouseover);
      targetElement.removeEventListener("click", this.boundHandleClick);
    }
  }
}
customElements.define("lazy-section", LazySection);

// custom element for clickpost pincode -->  custom solution 

class ClickpostEDDForm extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.init();
  }

  init() {
    this.updateVariables();
    this.setupEventListeners();
    this.initializeCountdown();
    this.checkInitialPincode();
  }

  updateVariables() {
    this.clickpostForm = document.querySelector(".clickpost-edd__form");
    this.submitButton = this.clickpostForm.querySelector(".pincode-button");
    this.responseEddText = document.getElementById("response-edd-text").innerHTML;
    this.atcButton = document.querySelector('.product-atc');
    this.responseCodText = document.getElementById("response-cod-text").innerHTML;
    this.month = this.clickpostForm.querySelector('input[name="month"]').value;
    this.dateFormat = this.clickpostForm.querySelector('input[name="date_format"]').value;
    this.cutoffTime = this.clickpostForm.querySelector('input[name="cutoff_time"]') ? this.clickpostForm.querySelector('input[name="cutoff_time"]').value : '24';
    this.countdownElement = document.getElementById('countdown');
    this.ezedd = this.clickpostForm.querySelector('input[name="ezedd"]') ? this.clickpostForm.querySelector('input[name="ezedd"]').value : false;
    this.monthMap = this.month === 'false' ? 
      ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] :
      ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  }

  setupEventListeners() {
    this.clickpostForm.querySelector('.pincodeInput').addEventListener('input', this.restrictPincodeLength.bind(this));
    this.submitButton.addEventListener("click", this.fetchEdd.bind(this));
    this.clickpostForm.querySelector('input[name="drop_pincode"]').addEventListener('keyup', this.handleKeyup.bind(this));
  }

  restrictPincodeLength(event) {
    if (event.target.value.length > 6) {
      event.target.value = event.target.value.slice(0, 6);
    }
  }

  handleKeyup(event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
      event.preventDefault();
      this.fetchEdd();
    }
  }

  initializeCountdown() {
    if (this.countdownElement) {
      const now = new Date();
      const targetHours = this.cutoffTime;
      const targetTimeToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), targetHours).getTime();
      
      const countdownInterval = setInterval(() => {
        const currentTime = new Date().getTime();
        const timeRemaining = targetTimeToday - currentTime;

        if (timeRemaining > 0) {
          const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
          const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
          const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000).toString().padStart(2, '0');
          this.countdownElement.innerHTML = `Order within <span style='color:red'>${hours}:${minutes}:${seconds}</span>`;
        } else {
          this.countdownElement.innerHTML = '00:00:00';
          clearInterval(countdownInterval);
        }
      }, 1000);
    }
  }

  fetchEdd() {
    this.submitButton.classList.toggle("button--loading");
    this.submitButton.innerHTML = '';
    
    let cod = false;
    const responseFail = document.getElementById("response-error");
    const responseSuccess = document.getElementById("response-success");
    responseFail.style.display = "none";
    responseSuccess.style.display = "none";
    document.getElementById("response-hide").style.display = "none";
    
    const dropPincode = this.clickpostForm.querySelector('input[name="drop_pincode"]').value;
    const productId = this.clickpostForm.querySelector('input[name="product_id"]').value;

    if (dropPincode.length !== 6 || !/^\d+$/.test(dropPincode)) {
      responseFail.style.color = "red";
      responseFail.innerHTML = document.getElementById("response-invalid-text").innerHTML;
      responseSuccess.style.display = "none";
      responseFail.style.display = "block";
      this.submitButton.classList.toggle("button--loading");
      this.submitButton.disabled = false;
      this.submitButton.innerHTML = 'Check';
      return false;
    }

    // Fetch other values
    const pickupPincode = this.clickpostForm.querySelector('input[name="pickup_pincode"]').value;
    const method = this.clickpostForm.querySelector('input[name="method"]').value;
    const standardEdd = this.clickpostForm.querySelector('input[name="standard_edd"]').value;
    const productEdd = this.clickpostForm.querySelector('input[name="product_edd"]') ? this.clickpostForm.querySelector('input[name="product_edd"]').value : 0;
    const collectionEdd = this.clickpostForm.querySelector('input[name="collection_edd"]') ? this.clickpostForm.querySelector('input[name="collection_edd"]').value : 0;
    const dateRange = this.clickpostForm.querySelector('input[name="date_range"]').value;
    const vendorEdd = this.clickpostForm.querySelector('input[name="vendor_edd"]') ? this.clickpostForm.querySelector('input[name="vendor_edd"]').value : 0;
    const logic = this.clickpostForm.querySelector('input[name="logic"]') ? this.clickpostForm.querySelector('input[name="logic"]').value : false;
    sessionStorage.setItem("drop_pincode", dropPincode);

    const variantId = document.querySelector(".variant-options-listItem.is-selected").dataset.variant;
    cod = true;
    const eddData = {
      dropPincode: dropPincode,
      variantId: variantId
    };

    fetch("/apps/clickpost-edd-proxy/ez-edd", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify([eddData]),
    })
      .then(response => response.json())
      .then(data => {
        if (data.res) {
          responseFail.style.display = "none";
          responseSuccess.style.display = "block";
          responseSuccess.classList.add('active');
          let finalEdd = '';
          const dateCurrent = new Date();
          const ez_sla_max = new Date(data.data.max);
          const sla_max = Math.ceil((ez_sla_max.getTime() - dateCurrent.getTime()) / (1000 * 60 * 60 * 24));
          const ez_sla_min = new Date(data.data.min);
          const sla_min = Math.ceil((ez_sla_min.getTime() - dateCurrent.getTime()) / (1000 * 60 * 60 * 24));
          let afterCutoff = false;
          let max = sla_max + parseInt(standardEdd) + parseInt(productEdd) + parseInt(collectionEdd) + parseInt(vendorEdd);
          if (afterCutoff) max += 1;
          max = new Date(dateCurrent.getTime() + parseInt(max * 86400000));
          const maxDate = max.getDate();
          if (dateRange === 'true') {
            let min = sla_min + parseInt(standardEdd) + parseInt(productEdd) + parseInt(collectionEdd) + parseInt(vendorEdd);
            if (afterCutoff) min += 1;
            min = new Date(dateCurrent.getTime() + parseInt(min * 86400000));
            const minDate = min.getDate();
            if (min.getMonth() === max.getMonth()) {
              finalEdd = `<span class="successful-response">${minDate}<sup>${this.nth(minDate)}</sup> and ${maxDate}<sup>${this.nth(maxDate)}</sup> ${this.monthMap[max.getMonth()]}</span>`;
            } else {
              finalEdd = `<span class="successful-response">${minDate}<sup>${this.nth(minDate)}</sup> ${this.monthMap[min.getMonth()]} and ${maxDate}<sup>${this.nth(maxDate)}</sup> ${this.monthMap[max.getMonth()]}</span>`;
            }
          } else {
            finalEdd = 'I am not delivered';
          }

          const responseEDD = document.getElementById("response-edd");
          responseEDD.innerHTML = this.responseEddText + " " + finalEdd;
          cod = cod ? `<span class="successful-response">available</span>` : '<span style="color:red">not available</span>';
          document.getElementById("response-cod").innerHTML = this.responseCodText + " " + cod;
          this.submitButton.classList.toggle("button--loading");
          this.submitButton.disabled = false;
          this.atcButton?.classList.remove('is-disabled');
          this.submitButton.innerHTML = 'Check';
        } else {
          responseFail.style.color = "red";
          responseFail.innerHTML = 'This Pin Code is not serviceable';
          responseFail.style.display = "block";
          responseSuccess.style.display = "none";
          this.submitButton.classList.toggle("button--loading");
          this.submitButton.disabled = false;
          this.submitButton.innerHTML = 'Check';
          this.atcButton?.classList.add('is-disabled');
        }
      });
  }

  nth(n) {
    if (n > 3 && n < 21) return 'th';
    switch (n % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }

  checkInitialPincode() {
    const pincode = sessionStorage.getItem("drop_pincode");
    if (pincode) {
      this.clickpostForm.querySelector('input[name="drop_pincode"]').value = pincode;
      this.fetchEdd();
    }
  }
}
customElements.define('clickpost-edd-form', ClickpostEDDForm);

class DiscountToggle extends HTMLElement {
  connectedCallback() {
    const trigger = this.querySelector('#discount-toggle-container');
    const discountContainer = this.querySelector('.discount-main-container');
    const ajaxCartBody = document.querySelector('.mm-ajaxcart-items');
    const backButton = this.querySelector('.back-button-discount-header');
    const headerWrapper = document.querySelector('.mm-ajaxcart_header-wrapper');
    const bottomGstContainer = document.querySelector('.mm-bottom-giv-gst-price');

    // Initialize with hidden state
    discountContainer.classList.add('hidden');

    // Trigger click event handler
    trigger.addEventListener('click', () => {
      discountContainer.classList.remove('hidden');
      discountContainer.classList.add('visible');
      trigger.classList.add('hidden');
      if (ajaxCartBody) {
        ajaxCartBody.classList.add('hidden');
        ajaxCartBody.classList.remove('visible');
        headerWrapper.classList.add('hidden');
        headerWrapper.classList.remove('visible');
        bottomGstContainer.classList.add('hidden');
      }
    });

    // Back button event handler
    if (backButton) {
      backButton.addEventListener('click', () => {
        discountContainer.classList.remove('visible');
        discountContainer.classList.add('hidden');
        trigger.classList.remove('hidden');
        if (ajaxCartBody) {
          ajaxCartBody.classList.remove('hidden');
          ajaxCartBody.classList.add('visible');
          headerWrapper.classList.remove('hidden');
          headerWrapper.classList.add('visible');
          bottomGstContainer.classList.remove('hidden');
        }
      });
    }
  }
}

customElements.define('discount-toggle', DiscountToggle);

class OfferToggle extends HTMLElement {
  connectedCallback() {
    const allOffersBtn = this.querySelector('.all-offers-btn');
    const bankOffersBtn = this.querySelector('.bank-offers-btn');
    const otherOffersBtn = this.querySelector('.other-offers-btn');
    const allOfferContainers = this.querySelectorAll('.all-offer-combined-container > div');

    // default fn: show all offers
    this.toggleOffers('all', allOfferContainers);
    this.setSelected(allOffersBtn);

    // togoggle functionality
    allOffersBtn.addEventListener('click', () => {
      this.toggleOffers('all', allOfferContainers);
      this.setSelected(allOffersBtn);
    });

    bankOffersBtn.addEventListener('click', () => {
      this.toggleOffers('bank', allOfferContainers);
      this.setSelected(bankOffersBtn);
    });

    otherOffersBtn.addEventListener('click', () => {
      this.toggleOffers('other', allOfferContainers);
      this.setSelected(otherOffersBtn);
    });
  }

  toggleOffers(type, containers) {
    containers.forEach(container => {
      if (type === 'all') {
        container.style.display = 'block';
      } else {
        const offerType = container.getAttribute('data-offer-type');
        container.style.display = offerType === type ? 'block' : 'none';
      }
    });
  }

  setSelected(button) {
    this.querySelectorAll('.toogle-button-discount button').forEach(btn => {
      btn.classList.remove('selected');
    });
    button.classList.add('selected');
  }
}

customElements.define('offer-toggle', OfferToggle);
