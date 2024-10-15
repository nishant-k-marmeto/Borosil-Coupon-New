/*--------------COLLECTION PAGE JS----------------*/
/*---------Woohoo! You've found the mini maze of JS! Don't get lost in the shrunk code jungle!-----------*/
(window.marmeto = window.marmeto || {}),
  (marmeto.Collection = (function () {
    var t = "#js-product-loop",
      e = "#js-empty-products",
      a = "#js-pagination-holder",
      r = "#js-products-count",
      i = "#sidebar-filter",
      s = "#js-sort-mobile";
    let coun = 0;
    function o(t) {
      if (
        ((this.container = document.querySelector(
          '[data-section-type="' + t + '"]'
        )),
        this.container)
      ) {
        if (
          ((this.productsPerAjax = 100),
          (this.allProducts = []),
          (this.totalPage = ""),
          (this.params = {
            page: 1,
            q: void 0,
            filterOptions: void 0,
            sortBy: void 0,
          }),
          (this.customFilters = this.initCustomFilters()),
          (this.options = JSON.parse(
            this.container.getAttribute("data-section-settings")
          )),
          history &&
            history.state &&
            history.state.filterOptions &&
            history.state.filterOptions.price)
        ) {
          var e = history.state.filterOptions.price[0];
          (document.querySelector(".price-filter-item").dataset.tag = e),
            (document.querySelector('[name="PriceFilterMin"]').value =
              e.split("-")[0]),
            (document.querySelector('[name="PriceFilterMax"]').value =
              e.split("-")[1]);
        }
        this.initQueryFromUrl(),
          this.initCollection(),
          this.attachEventListeners();
      }
    }
    return (
      (o.prototype.attachEventListeners = function () {
        var t = this,
          e = document.querySelectorAll(".filter-item");
        for (var r of e)
          r.addEventListener("click", function () {
            this.classList.toggle("filter-selected");
            let e = $(this),
              a = $(this),
              r = $(
                `.sticky-top-filter-container[data-top-filters='${e.attr(
                  "data-tag"
                )}']`
              );
            a && a.toggleClass("filter-active"),
              r && r.toggleClass("sticky-round-filters-active"),
              t.handleFilterChange(),
              document.dispatchEvent(
                new CustomEvent("swym:collections-loaded")
              ),
              document
                .querySelector(".mmc-container")
                .scrollIntoView({ behavior: "smooth" });
          });
        var o = document.querySelectorAll(".clear-all");
        for (var n of o)
          n.addEventListener("click", function (e) {
            e.preventDefault(),
              document
                .querySelector(i)
                .querySelectorAll(".filter-item")
                .forEach(function (t) {
                  t.classList.remove("filter-selected");
                }),
              t.handleFilterChange();
          });
        var l = document.querySelectorAll("#js-sort-desktop li");
        for (var c of l)
          c.addEventListener("click", function (e) {
            e.preventDefault();
            var a = this.getAttribute("data-value");
            (t.params.sortBy = a),
              t.getProducts(t.params.page),
              t.handleFilterChange(),
              (document.querySelector(
                "#js-sort-desktop [data-sort-value]"
              ).innerHTML = this.textContent),
              document.dispatchEvent(
                new CustomEvent("swym:collections-loaded")
              );
          });
        var d = document.querySelectorAll("#js-sort-mobile li");
        for (var p of d)
          p.addEventListener("click", function (e) {
            e.preventDefault();
            var a = this.getAttribute("data-value");
            (t.params.sortBy = a),
              t.getProducts(t.params.page),
              t.handleFilterChange(),
              document.querySelector(s).classList.remove("is--opened"),
              document.dispatchEvent(
                new CustomEvent("swym:collections-loaded")
              );
            $("body").removeClass("no-overflow");
          });
        var u = document.querySelectorAll(".js-accordion-heading");
        for (var h of u)
          h.addEventListener("click", function (e) {
            e.preventDefault(),
              this.classList.toggle("is-closed"),
              t.helpers().slideToggle(this.nextElementSibling);
          });
        document.querySelector(a).addEventListener("click", function (e) {
          e.preventDefault();
          var a = "";
          "A" === e.target.tagName
            ? (a = e.target.getAttribute("data-page"))
            : ("svg" !== e.target.tagName && "path" !== e.target.tagName) ||
              (a = e.target.closest("a").getAttribute("data-page")),
            t.helpers().scrollToTop(),
            "" === a && (a = "999"),
            "999" !== a && (a = parseInt(a)),
            a != t.params.page &&
              ((t.params.page = a), t.pushState(), t.getProducts(a));
        }),
          document
            .querySelector('[data-action="open-filter"]')
            .addEventListener("click", function () {
              document
                .querySelector(".mmc-main__filter")
                .classList.add("is--opened"),
                document.querySelector(s).classList.contains("is--opened") &&
                  document.querySelector(s).classList.remove("is--opened");
              $("body").addClass("no-overflow");
            });
        var m = document.querySelectorAll('[data-action="close-filter"]');
        for (var v of m)
          v.addEventListener("click", function () {
            document
              .querySelector(".mmc-main__filter")
              .classList.remove("is--opened");
            $("body").removeClass("no-overflow");
          });
        document
          .querySelector('[data-action="open-sort"]')
          .addEventListener("click", function () {
            document.querySelector(s).classList.toggle("is--opened"),
              $("body").toggleClass("no-overflow");
          });
        var f = document.querySelector('[name="PriceFilterMin"]'),
          y = document.querySelector('[name="PriceFilterMax"]');
        null != document.querySelector('[name="PriceFilterMin"]') &&
          document
            .querySelector('[name="PriceFilterMin"]')
            .addEventListener("change", function (e) {
              (e.target.value = Math.max(
                Math.min(
                  parseInt(e.target.value),
                  parseInt(y.value || e.target.max) - 1
                ),
                e.target.min
              )),
                e.target.value,
                parseInt(y.value || e.target.max),
                t.handleFilterChange();
            }),
          null != document.querySelector('[name="PriceFilterMax"]') &&
            document
              .querySelector('[name="PriceFilterMax"]')
              .addEventListener("change", function (e) {
                (e.target.value = Math.min(
                  Math.max(
                    parseInt(e.target.value),
                    parseInt(f.value || e.target.min) + 1
                  ),
                  e.target.max
                )),
                  parseInt(f.value || e.target.min),
                  e.target.value,
                  t.handleFilterChange();
              });
      }),
      (o.prototype.initCollection = function () {
        var t = this,
          e = [],
          a = "",
          r = Math.ceil(this.options.productCount / this.productsPerAjax);
        this.params.sortBy && (a = "&sort_by=" + this.params.sortBy);
        for (var i = 1; i <= r; i++)
          e.push(fetch(location.pathname + "?view=json&page=" + i + a));
        e.length
          ? Promise.all(e).then(function (e) {
              Promise.all(
                e.map(function (t) {
                  return t.json();
                })
              ).then(function (e) {
                allProductsCopy = e;
                for (var a = 0; a < e.length; a++)
                  for (var r = e[a], i = 0; i < r.length; i++)
                    t.allProducts.push(r[i]);
                t.getProducts(t.params.page),
                  document.dispatchEvent(
                    new CustomEvent("swym:collections-loaded")
                  );
              });
            })
          : console.error(
              "Nothing to fetch!! Either you forgot to add .json template or the current page type doesn't have any products."
            );
      }),
      (o.prototype.getProducts = function (i) {
        var s = [],
          o = this.filterHelpers().filterProducts(
            this.allProducts,
            this.params.filterOptions
          );
        if (
          ((s = this.options.excludeOosProducts
            ? o.filter(function (t) {
                return t.available;
              })
            : o),
          this.sortProducts(s),
          (this.totalPage = Math.ceil(s.length / this.options.productPerPage)),
          this.options.showOosLast &&
            s.sort(function (t, e) {
              return e.available - t.available;
            }),
          document.querySelector(r) &&
            (document.querySelector(r).innerHTML =
              "Showing " + s.length + " products"),
          s.length > 0 && i)
        ) {
          "999" !== i && i > this.totalPage && (i = 1);
          for (
            var n = "",
              l =
                s.length < i * this.options.productPerPage || "999" === i
                  ? s.length
                  : i * this.options.productPerPage,
              c =
                "999" === i || l < this.options.productPerPage
                  ? 0
                  : (i - 1) * this.options.productPerPage;
            c < l;
            c++
          )
            n += this.htmlRenderer().renderProduct(c, s[c]);
          this.generatePagination(i),
            document.querySelector(t).classList.remove("is-hidden"),
            document.querySelector(e).classList.add("is-hidden"),
            "infinite_scroll" == this.options.paginationType && 1 !== i
              ? (document.querySelector(t).innerHTML += n)
              : (document.querySelector(t).innerHTML = n);
        } else
          (document.querySelector(t).innerHTML = ""),
            document.querySelector(t).classList.add("is-hidden"),
            document.querySelector(a).classList.add("is-hidden"),
            document.querySelector(e).classList.remove("is-hidden");
      }),
      (o.prototype.generatePagination = function (t) {
        var e = this;
        if (this.totalPage <= 1)
          document.querySelector(a).classList.add("is-hidden");
        else {
          var r = "";
          if (
            ("999" !== t &&
              (r +=
                (t - 1 >= 1
                  ? '<a href="' +
                    this.options.collectionUrl +
                    "?page=" +
                    (t - 1) +
                    '" class="pagination__item no-border" rel="prev" title="Previous page" data-page="' +
                    (t - 1) +
                    '"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3.00293 8.00004C3.00913 8.19072 3.08671 8.37972 3.23612 8.5254L9.64155 14.772C9.95238 15.076 10.4574 15.076 10.7691 14.772C11.0809 14.4689 11.0809 13.9764 10.7691 13.6724L4.95256 8.00001L10.7691 2.32764C11.0809 2.02362 11.0809 1.53114 10.7691 1.22802C10.4574 0.923993 9.95238 0.923993 9.64155 1.22802L3.23615 7.47462C3.08674 7.62033 3.00916 7.8093 3.00293 8.00001L3.00293 8.00004Z" fill="black"/></svg></a>'
                  : "") +
                (1 !== t
                  ? '<a href="' +
                    this.options.collectionUrl +
                    '?page=1" class="pagination__item" title="Navigate to page 1" data-page="1">1</a>'
                  : "") +
                (t >= 4 ? "…" : "") +
                (t - 2 > 1
                  ? '<a href="' +
                    this.options.collectionUrl +
                    "?page=" +
                    (t - 2) +
                    '" class="pagination__item" title="Navigate to page ' +
                    (t - 2) +
                    '" data-page="' +
                    (t - 2) +
                    '">' +
                    (t - 2) +
                    "</a>"
                  : "") +
                (t - 1 > 1
                  ? '<a href="' +
                    this.options.collectionUrl +
                    "?page=" +
                    (t - 1) +
                    '" class="pagination__item" title="Navigate to page ' +
                    (t - 1) +
                    '" data-page="' +
                    (t - 1) +
                    '">' +
                    (t - 1) +
                    "</a>"
                  : "") +
                '<span class="pagination__item pagination__item--current">' +
                t +
                "</span>" +
                (t + 1 < this.totalPage
                  ? '<a href="' +
                    this.options.collectionUrl +
                    "?page=" +
                    (t + 1) +
                    '" class="pagination__item" title="Navigate to page ' +
                    (t + 1) +
                    '" data-page="' +
                    (t + 1) +
                    '">' +
                    (t + 1) +
                    "</a>"
                  : "") +
                (t + 2 < this.totalPage
                  ? '<a href="' +
                    this.options.collectionUrl +
                    "?page=" +
                    (t + 2) +
                    '" class="pagination__item" title="Navigate to page ' +
                    (t + 2) +
                    '" data-page="' +
                    (t + 2) +
                    '">' +
                    (t + 2) +
                    "</a>"
                  : "") +
                (t <= this.totalPage - 4 ? "…" : "") +
                (t !== this.totalPage
                  ? '<a href="' +
                    this.options.collectionUrl +
                    "?page=" +
                    this.totalPage +
                    '" class="pagination__item" title="Navigate to page ' +
                    this.totalPage +
                    '" data-page="' +
                    this.totalPage +
                    '">' +
                    this.totalPage +
                    "</a>"
                  : "") +
                (t + 1 <= this.totalPage
                  ? '<a href="' +
                    this.options.collectionUrl +
                    "?page=" +
                    (t + 1) +
                    '" class="pagination__item no-border" rel="next" title="Next page" data-page="' +
                    (t + 1) +
                    '"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 8C12.9938 7.80932 12.9162 7.62035 12.7668 7.47461L6.36138 1.22802C6.05055 0.923993 5.54555 0.923993 5.2338 1.22802C4.92207 1.53114 4.92207 2.02364 5.2338 2.32764L11.0504 8L5.2338 13.6724C4.92207 13.9764 4.92207 14.4689 5.2338 14.772C5.54555 15.076 6.05053 15.076 6.36138 14.772L12.7668 8.52539C12.9162 8.37968 12.9938 8.19068 13 8Z" fill="black"/></svg></a>'
                  : "")),
            (r += '<div class="infinite-scroll-element"></div>'),
            (document.querySelector(a).innerHTML = r),
            "infinite_scroll" == this.options.paginationType)
          ) {
            document.querySelector(a).classList.add("is-hidden");
            let r = document.querySelector(".infinite-scroll-element");
            new IntersectionObserver((a) => {
              a[0].intersectionRatio <= 0 ||
                e.totalPage <= t ||
                e.getProducts(t + 1);
            }).observe(r);
          } else document.querySelector(a).classList.remove("is-hidden");
        }
      }),
      (o.prototype.initQueryFromUrl = function () {
        var t = this.helpers().generateQuery();
        t.q && (this.params.q = t.q),
          t.sort_by && (this.params.sortBy = t.sort_by),
          t.page && (this.params.page = parseInt(t.page)),
          this.params.q &&
            ((this.params.q = decodeURI(this.params.q)),
            this.filterHelpers().searchToFilter(this.params.q.split(",")),
            this.handleFilterChange()),
          this.params.filterOptions &&
            this.filterHelpers().setFilterOptions(this.params);
      }),
      (o.prototype.sortProducts = function (t) {
        var e = 0;
        return (
          "title-descending" == this.params.sortBy
            ? (e = function (t, e) {
                return e.title.localeCompare(t.title);
              })
            : "title-ascending" == this.params.sortBy
            ? (e = function (t, e) {
                return t.title.localeCompare(e.title);
              })
            : "price-ascending" == this.params.sortBy
            ? (e = function (t, e) {
                return t.price - e.price;
              })
            : "price-descending" == this.params.sortBy
            ? (e = function (t, e) {
                return e.price - t.price;
              })
            : "created-ascending" == this.params.sortBy
            ? (e = function (t, e) {
                return t.published_at > e.published_at
                  ? -1
                  : t.published_at == e.published_at
                  ? t.title.localeCompare(e.title)
                  : 1;
              })
            : "created-descending" == this.params.sortBy &&
              (e = function (t, e) {
                return e.published_at > t.published_at
                  ? 1
                  : e.published_at == t.published_at
                  ? e.title.localeCompare(t.title)
                  : -1;
              }),
          e ? t.sort(e) : t
        );
      }),
      (o.prototype.pushState = function () {
        var t = {},
          e = !1,
          a = location.pathname,
          r = new URLSearchParams();
        1 != this.params.page && ((t.page = this.params.page), (e = 1)),
          this.params.sortBy &&
            this.params.q &&
            ((t.sortBy = this.params.sortBy), (t.q = this.params.q), (e = 1)),
          this.params.q && ((t.q = this.params.q), (e = 1)),
          this.params.sortBy && ((t.sortBy = this.params.sortBy), (e = 1)),
          t.q && (t.q = decodeURI(t.q)),
          Object.keys(t).forEach(function (e) {
            r.append(e, t[e]);
          }),
          e && (a = "?" + r.toString()),
          history.pushState(
            { filterOptions: this.params.filterOptions },
            " ",
            a
          );
      }),
      (o.prototype.handleFilterChange = function () {
        var t = this;
        (t.params.filterOptions = t.filterHelpers().fillFilter()),
          "999" !== t.params.page && (t.params.page = 1),
          t.getProducts(t.params.page);
        var e = Object.keys(t.params.filterOptions)
          .map(function (e) {
            return t.params.filterOptions[e]
              .map(function (t) {
                return encodeURIComponent(t);
              })
              .join(",");
          })
          .join(",");
        e
          ? ((e = location.pathname + "?q=" + e),
            t.params.sortBy && (e += "&sort_by=" + t.params.sortBy))
          : ((e = location.pathname),
            t.params.sortBy && (e += "?sort_by=" + t.params.sortBy)),
          history.replaceState(t.params, "Filtered", e);
      }),
      (o.prototype.filterHelpers = function () {
        var t = this,
          e = document.querySelector(i);
        return {
          filterProducts: function (e, a) {
            var r = [];
            if (a && Object.keys(a).length)
              for (var i = 0; i < e.length; i++)
                t.helpers().productTagFilter(a, e[i]) && r.push(e[i]);
            else r = e;
            return r;
          },
          fillFilter: function () {
            var a = {};
            return (
              document.querySelectorAll(".and", e).forEach(function (e) {
                var r = [];
                e.querySelectorAll(".or.filter-selected").forEach(function (e) {
                  r.push(t.helpers().getTagName(e));
                }),
                  r.length && (a[e.getAttribute("data-tag")] = r);
              }),
              a
            );
          },
          searchToFilter: function (a) {
            document.querySelectorAll(".and", e).forEach(function (e) {
              e.querySelectorAll(".or").forEach(function (e) {
                -1 !== a.indexOf(t.helpers().getTagName(e)) &&
                  e.classList.add("filter-selected");
              });
            });
          },
          setFilterOptions: function (a) {
            document.querySelectorAll(".and", e).forEach(function (e) {
              var r = a[e.getAttribute("data-tag")];
              r &&
                r.length &&
                e.querySelectorAll(".or").forEach(function (e) {
                  r.indexOf(
                    t.helpers().handleize(e.getAttribute("data-tag")) ||
                      t.helpers().handleize(e.textContent).trim()
                  ) >= 0 && e.classList.add("filter-selected");
                });
            });
          },
        };
      }),
      (o.prototype.helpers = function () {
        var t = this;
        return {
          handleize: function (t) {
            return t
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/-$/, "")
              .replace(/^-/, "");
          },
          scrollToTop: function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
          },
          generateQuery: function () {
            var t = window.location.href.split("?"),
              e = [];
            if (2 != t.length) return e;
            for (var a = t[1].split("&"), r = 0; r < a.length; r++) {
              var i = a[r].split("=");
              e[i[0]] = i[1];
            }
            return e;
          },
          getTagName: function (e) {
            return (
              t.helpers().handleize(e.getAttribute("data-tag")) ||
              t.helpers().handleize(e.textContent).trim()
            );
          },
          basicSearch: function (e, a) {
            var r = !1;
            return (
              (a = (a = a.map((t) => t.toLowerCase())).map(function (e) {
                return t.helpers().handleize(e);
              })),
              "object" == typeof e
                ? Object.keys(e).forEach(function (t) {
                    if (a.indexOf(e[t]) > -1) return (r = !0), !1;
                  })
                : [e].forEach(function (t) {
                    Object.keys(t).forEach(function (e) {
                      if (a.indexOf(t[e]) > -1) return (r = !0), !1;
                    });
                  }),
              r
            );
          },
          basicTagSearch: function (e, a) {
            return !!a.tags && t.helpers().basicSearch(e, a.tags);
          },
          productTagFilter: function (e, a) {
            var r = !0;
            return (
              Object.keys(e).forEach(function (i) {
                return (
                  r &&
                    e[i] &&
                    e[i].length &&
                    (r =
                      r &&
                      (t.customFilters[i]
                        ? t.customFilters[i](e[i], a)
                        : t.helpers().basicTagSearch(e[i], a))),
                  r
                );
              }),
              r
            );
          },
          compareRanges: function (t, e) {
            for (var a = 0; a < e.length; a++)
              if (t >= e[a][0] && t <= e[a][1]) return !0;
            return !1;
          },
          formatMoney: function (t, e) {
            "string" == typeof t && (t = t.replace(".", ""));
            var a = "",
              r = /\{\{\s*(\w+)\s*\}\}/,
              i = e || "₹{{amount_no_decimals}}";
            function s(t, e, a, r) {
              if (((a = a || ","), (r = r || "."), isNaN(t) || null === t))
                return 0;
              var i = (t = (t / 100).toFixed(e)).split(".");
              return (
                i[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + a) +
                (i[1] ? r + i[1] : "")
              );
            }
            switch (i.match(r)[1]) {
              case "amount":
                a = s(t, 2);
                break;
              case "amount_no_decimals":
                a = s(t, 0);
                break;
              case "amount_with_comma_separator":
                a = s(t, 2, ".", ",");
                break;
              case "amount_no_decimals_with_comma_separator":
                a = s(t, 0, ".", ",");
                break;
              case "amount_no_decimals_with_space_separator":
                a = s(t, 0, " ");
                break;
              case "amount_with_apostrophe_separator":
                a = s(t, 2, "'");
            }
            return i.replace(r, a);
          },
          slideToggle: function (t, e = 300) {
            return "none" === window.getComputedStyle(t).display
              ? (function (t, e = 500) {
                  t.style.removeProperty("display");
                  let a = window.getComputedStyle(t).display;
                  "none" === a && (a = "block"), (t.style.display = a);
                  let r = t.offsetHeight;
                  (t.style.overflow = "hidden"),
                    (t.style.height = 0),
                    (t.style.paddingTop = 0),
                    (t.style.paddingBottom = 0),
                    (t.style.marginTop = 0),
                    (t.style.marginBottom = 0),
                    t.offsetHeight,
                    (t.style.boxSizing = "border-box"),
                    (t.style.transitionProperty = "height, margin, padding"),
                    (t.style.transitionDuration = e + "ms"),
                    (t.style.height = r + "px"),
                    t.style.removeProperty("padding-top"),
                    t.style.removeProperty("padding-bottom"),
                    t.style.removeProperty("margin-top"),
                    t.style.removeProperty("margin-bottom"),
                    window.setTimeout(function () {
                      t.style.removeProperty("height"),
                        t.style.removeProperty("overflow"),
                        t.style.removeProperty("transition-duration"),
                        t.style.removeProperty("transition-property");
                    }, e);
                })(t, e)
              : (function (t, e = 500) {
                  (t.style.transitionProperty = "height, margin, padding"),
                    (t.style.transitionDuration = e + "ms"),
                    (t.style.boxSizing = "border-box"),
                    (t.style.height = t.offsetHeight + "px"),
                    t.offsetHeight,
                    (t.style.overflow = "hidden"),
                    (t.style.height = 0),
                    (t.style.paddingTop = 0),
                    (t.style.paddingBottom = 0),
                    (t.style.marginTop = 0),
                    (t.style.marginBottom = 0),
                    window.setTimeout(function () {
                      (t.style.display = "none"),
                        t.style.removeProperty("height"),
                        t.style.removeProperty("padding-top"),
                        t.style.removeProperty("padding-bottom"),
                        t.style.removeProperty("margin-top"),
                        t.style.removeProperty("margin-bottom"),
                        t.style.removeProperty("overflow"),
                        t.style.removeProperty("transition-duration"),
                        t.style.removeProperty("transition-property");
                    }, e);
                })(t, e);
          },
        };
      }),
      (o.prototype.initCustomFilters = function () {
        var t = this;
        return {
          availability: function (t, e) {
            var a = !1;
            return (
              t.filter(function (t) {
                "in-stock" == t && e.available && (a = !0),
                  "out-of-stock" != t || e.available || (a = !0);
              }),
              a
            );
          },
          brand: function (e, a) {
            var r = !1;
            return (
              e.filter(function (e) {
                a.vendor &&
                  t.helpers().handleize(e) == t.helpers().handleize(a.vendor) &&
                  (r = !0);
              }),
              r
            );
          },
          size: function (e, a) {
            var r = !1;
            return (
              e.filter(function (e) {
                a.variants.forEach(function (a) {
                  ((a.option1 &&
                    t.helpers().handleize(e) ==
                      t.helpers().handleize(a.option1)) ||
                    (a.option2 &&
                      t.helpers().handleize(e) ==
                        t.helpers().handleize(a.option2)) ||
                    (a.option3 &&
                      t.helpers().handleize(e) ==
                        t.helpers().handleize(a.option3))) &&
                    (r = !0);
                });
              }),
              r
            );
          },
          color: function (e, a) {
            var r = !1;
            return (
              e.filter(function (e) {
                a.variants.forEach(function (a) {
                  ((a.option1 &&
                    t.helpers().handleize(e) ==
                      t.helpers().handleize(a.option1)) ||
                    (a.option2 &&
                      t.helpers().handleize(e) ==
                        t.helpers().handleize(a.option2)) ||
                    (a.option3 &&
                      t.helpers().handleize(e) ==
                        t.helpers().handleize(a.option3))) &&
                    (r = !0);
                });
              }),
              r
            );
          },
          Price: function (e, a) {
            var r = !1,
              i = [];
            return (
              e.filter(function (e) {
                i.push(e.split("-")),
                  t.helpers().compareRanges(a.price / 100, i) && (r = !0);
              }),
              r
            );
          },
          producttype: function (e, a) {
            var r = !1;
            return (
              e.filter(function (e) {
                a.type &&
                  t.helpers().handleize(e) == t.helpers().handleize(a.type) &&
                  (r = !0);
              }),
              r
            );
          },
        };
      }),
      (o.prototype.htmlRenderer = function () {
        return {
          renderProduct: function (t, e) {
            var a = "";
            let loading = "";
            coun += 1;
            coun < 5 ? (loading = "eager") : (loading = "lazy");
            if (e.featured_image) {
              var r = e.featured_image.split(".");
              r[r.length - 2] = r[r.length - 2] + "_360x";
              var i = r.join(".");
              100 / !e.media[0] ||
                !e.media[0].aspect_ratio ||
                e.media[0].aspect_ratio;
            }
            if (
              ((a +=
                '<div class="product-card available-' +
                e.available +
                (e.tags.includes("QC_gift_card") ? " qc-gift-card" : "") +
                (e.tags.includes("bundle_product") ? " bundle-product" : "") +
                '">'),
              (a +=
                '<a href="/products/' +
                e.handle +
                '" class="product-card__link">'),
              (a +=
                '<img class="product-card__image" src="' +
                i +
                '" alt="' +
                e.title +
                '" width="360" height="360" loading="' +
                loading +
                '">'),
              (a += '<div class="swym-wishlist-button-bar">'),
              (a += `<button data-with-epi="true" class="swym-button swym-add-to-wishlist-view-product data-product-title="${e.title}" data-product-type="${e.type}" data-product-sku="${e.selectedVariant.sku}" product_${e.id}" data-swaction="addToWishlist" data-product-id="${e.id}" data-variant-id="${e.selectedVariant.id}" data-product-url="https://my-borosil.myshopify.com${e.url}?variant=${e.selectedVariant.id}"></button>`),
              (a += "</div>"),
              (a += "</a>"),
              (a += '<div class="product-card__info">'),
              (a += '<div id="myModal" class="modal modal--{{ section.id }}">'),
              (a += '<div class="modal-content">'),
              (a +=
                '<span class="close_error_Box close_error_Box--{{ section.id }}">&times;</span>'),
              (a +=
                '<p class="Errormessage Errormessage--{{ section.id }}"> </p>'),
              (a += "</div>"),
              (a += "</div>"),
              (a +=
                '<a class="product-card__title-container" href="/products/' +
                e.handle +
                '" ><h2 class="product-card__title"> ' +
                e.title +
                "</h2></a>"),
              (a += `<p class="product-card__snack">${
                e.metafields.subtitle &&
                Object.prototype.toString.call(e.metafields.subtitle) ==
                  "[object Array]"
                  ? e.metafields.subtitle.join(", ")
                  : e.metafields.subtitle &&
                    typeof e.metafields.subtitle === "string"
                  ? e.metafields.subtitle
                  : ""
              }</p>`),
              (a += '<div class="Producttitle_full">' + e.title + "</div>"),
              (a +=
                '<div class="product-card__price" data-product_id=' +
                e.id +
                ">"),
              (a +=
                '<span class="product-card__regularprice" >' +
                Shopify.formatMoney(e.selectedVariant.price, moneyFormat) +
                "</span>"),
              e.selectedVariant.compare_at_price > e.selectedVariant.price)
            ) {
              var s = parseInt(
                ((e.selectedVariant.compare_at_price -
                  e.selectedVariant.price) /
                  e.selectedVariant.compare_at_price) *
                  100
              );
              (a +=
                '<span class="product-card__compareprice">' +
                Shopify.formatMoney(
                  e.selectedVariant.compare_at_price,
                  moneyFormat
                ) +
                "</span>"),
                (a +=
                  '<span class="product-card__discountpercentage">' +
                  s +
                  "% off</span>");
            }
            if (
              ((a += "</div>"),
              (a += '<div class="product-card__selectors">'),
              e.variants.filter(function (t) {
                return "Default Title" !== t.title;
              }).length > 0)
            ) {
              let t = "";
              if (
                (e.variants.length < 2 && (t = "style='cursor: unset;''"),
                (a +=
                  '<input value="1" type="number" class="quantity-selector-input variant-present" onkeypress="return event.charCode >= 48" min="1" >'),
                (a += `<div style=${
                  e.available ? ' " " ' : "pointer-events:none"
                } class="product-card__quantity product-card__quantity">`),
                (a += '<div class="quantity-selector-value">1</div>'),
                (a +=
                  '<div class="product-card__selector-dropdownArrow"> </div>'),
                (a += '<ul class="quantity-selector-list">'),
                (a +=
                  '<li class="quantity-selector-listitem is-selected" data-value="1">1</li>'),
                (a +=
                  '<li class="quantity-selector-listitem" data-value="2">2</li>'),
                (a +=
                  '<li class="quantity-selector-listitem" data-value="3">3</li>'),
                (a +=
                  '<li class="quantity-selector-listitem" data-value="4">4</li>'),
                (a +=
                  '<li class="quantity-selector-listitem" data-value="5">5</li>'),
                (a +=
                  '<li class="quantity-selector-listitem" data-value="6">6</li>'),
                (a +=
                  '<li class="quantity-selector-listitem" data-value="7">7</li>'),
                (a +=
                  '<li class="quantity-selector-listitem" data-value="8">8</li>'),
                (a +=
                  '<li class="quantity-selector-listitem" data-value="9">9</li>'),
                (a +=
                  '<li class="quantity-selector-listitem" data-value="10">10+</li>'),
                (a += "</ul>"),
                (a += "</div>"),
                e.available)
              ) {
                if (
                  ((a +=
                    '<div class="product-card__variants product-card__variants">'),
                  (a +=
                    `<div class="variant-selector-value" ${t}>` +
                    e.selectedVariant.title +
                    "</div>"),
                  e.variants.length > 1)
                ) {
                  a +=
                    '<div class="product-card__selector-dropdownArrow">  </div>';
                }
                a += '<ul class="variant-selector-list">';
                for (var o = 0; o < e.variants.length; o++) {
                  var n = e.variants[o],
                    l = "";
                  let t = e.variant_inventory[n.id];
                  n.id === e.selectedVariant.id && (l = " is-selected"),
                    (a +=
                      '<li class="variant-selector-listitem' +
                      l +
                     (e.tags.includes("Dinner Sets") ? ' dinner-set-product' : '') +
                      '" data-variant="' +
                      n.id +
                      `" data-variantAvl=${t} data-product_id=${e.id} data-variant-title="` +
                      n.title +
                      '" data-variant-price="' +
                      n.price +
                      '" data-variant-Maxprice="' +
                      n.compare_at_price +
                      '" data-variant-priceToprint="' +
                      Shopify.formatMoney(n.price, moneyFormat) +
                      '" data-variant-MaxpriceToprint="' +
                      Shopify.formatMoney(n.compare_at_price, moneyFormat) +
                      '" data-variant-quantity="' +
                      n.inventory_quantity +
                      '" data-variant-available="' +
                      n.available +
                      '">'),
                    (a += '<div class="variant-selector-listitemContent">'),
                    (a +=
                      '<span class="variant-selector-title">' +
                      n.title +
                      "</span>"),
                    (a += '<span class="variant-selector-prices">'),
                    (a +=
                      '<div class="varaint-sellingPrice">' +
                      Shopify.formatMoney(n.price, moneyFormat) +
                      "</div>"),
                    n.compare_at_price > 0 &&
                      (a +=
                        '<div class="varaint-originalPrice"> ' +
                        Shopify.formatMoney(n.compare_at_price, moneyFormat) +
                        "</div>"),
                    (a += "</span>"),
                    (a += "</div>"),
                    (a += "</li>");
                }
                a += "</ul>";

                a += "</div>";
              } else {
                for (
                  a +=
                    '<div class="product-card__variants product-card__variants">',
                    a +=
                      '<div class="variant-selector-value">' +
                      e.variants[0].title +
                      "</div>",
                    a +=
                      '<div class="product-card__selector-dropdownArrow">  </div>',
                    a += '<ul class="variant-selector-list">',
                    o = 0;
                  o < e.variants.length;
                  o++
                )
                  (a +=
                    '<li class="variant-selector-listitem is-selected" data-variant="' +
                    (n = e.variants[o]).id +
                    '" data-variant-title="' +
                    n.title +
                    '">'),
                    (a += '<div class="variant-selector-listitemContent">'),
                    (a +=
                      '<span class="variant-selector-title">' +
                      n.title +
                      "</span>"),
                    (a += '<span class="variant-selector-prices">'),
                    (a +=
                      '<div class="varaint-sellingPrice">' +
                      Shopify.formatMoney(n.price, moneyFormat) +
                      "</div>"),
                    n.compare_at_price > 0 &&
                      (a +=
                        '<div class="varaint-originalPrice"> ' +
                        Shopify.formatMoney(n.compare_at_price, moneyFormat) +
                        "</div>"),
                    (a += "</span>"),
                    (a += "</div>"),
                    (a += "</li>");
                (a += "</ul>"), (a += "</div>");
              }
            } else
              (a +=
                '<input type="number" value="10" class="single-variant quantity-selector-input" onkeypress="return event.charCode >= 48" min="1" >'),
                (a +=
                  '<div class="product-card__quantity product-card__quantity">'),
                (a += '<div class="quantity-selector-value">1</div>'),
                (a +=
                  '<div class="product-card__selector-dropdownArrow"> </div>'),
                (a += '<ul class="quantity-selector-list">'),
                (a +=
                  '<li class="quantity-selector-listitem is-selected" data-value="1">1</li>'),
                (a +=
                  '<li class="quantity-selector-listitem" data-value="2">2</li>'),
                (a +=
                  '<li class="quantity-selector-listitem" data-value="3">3</li>'),
                (a +=
                  '<li class="quantity-selector-listitem" data-value="4">4</li>'),
                (a +=
                  '<li class="quantity-selector-listitem" data-value="5">5</li>'),
                (a +=
                  '<li class="quantity-selector-listitem" data-value="6">6</li>'),
                (a +=
                  '<li class="quantity-selector-listitem" data-value="7">7</li>'),
                (a +=
                  '<li class="quantity-selector-listitem" data-value="8">8</li>'),
                (a +=
                  '<li class="quantity-selector-listitem" data-value="9">9</li>'),
                (a +=
                  '<li class="quantity-selector-listitem" data-value="10">10+</li>'),
                (a += "</ul>"),
                (a += "</div>"),
                (a +=
                  `<input type="hidden" data-variantAvl="${
                    e.variant_inventory[e.variants[0].id]
                  }" class="variant-selector-listitem is-selected" data-variant="` +
                  e.variants[0].id +
                  '" data-variant-available="' +
                  e.variants[0].available +
                  '" />');
            return (
              (a += "</div>"),
              e.selectedVariant.available
                ? (e.tags.includes("personalise")
                    ? (a +=
                        '<a href="' +
                        e.url +
                        '" class="coll-personalise__button" data-product-handle="' +
                        e.handle +
                        '"> Add Personalisation </a>')
                    : e.tags.includes("dinner-atc-hide")
                    ? (a +=
                        '<a href="' +
                        e.url +
                        '" class="coll-personalise__button" data-product-handle="' +
                        e.handle +
                        '"> Make Your Dinner Set </a>')
                    : e.tags.includes("bundle_product")
                    ? (a +=
                        '<a href="' +
                        e.url +
                        '" class="product-card__addtocart bundle-ATC" data-product-handle="' +
                        e.handle +
                        '"> Shop now </a>')
                    : (a +=
                        '<button class="product-card__addtocart" type="button"> Add to cart </button>'),
                  (a += '<div class="loader loader"> </div>'))
                : e.tags.includes("dinner-atc-hide")
                ? (a +=
                    '<a href="' +
                    e.url +
                    '" class="coll-personalise__button" data-product-handle="' +
                    e.handle +
                    '"> Make Your Dinner Set </a>')
                : e.tags.includes("bundle_product")
                ? (a +=
                    '<a href="' +
                    e.url +
                    '" class="product-card__addtocart bundle-ATC" data-product-handle="' +
                    e.handle +
                    '"> Shop now </a>')
                : (a +=
                    '<button class="product-card__addtocart is-disabled" type="button"> Sold out </button>'),
              (a +=
                '<span class="error-quantity" style="display:none;">Insufficient Quantity</span>'),
              (a += "</div>"),
              e.tags.includes("New arrival")
                ? (a += '<div class="product-card_badge">New Arrival</div>')
                : "",
              (a += "</div>")
            );
          },
        };
      }),
      (function () {
        let t = (t, e, a) => {
          0 != t && NaN != t
            ? t > e || e < 1
              ? ($(a.target)
                  .parents(".product-card")
                  .find(".error-quantity")
                  .show()
                  .html(`Quantity exceeds more than ${e}`),
                $(a.target)
                  .parents(".product-card")
                  .find(".product-card__addtocart")
                  .addClass("is-disabled"),
                e < 1 &&
                  $(a.target)
                    .parents(".product-card")
                    .find(".error-quantity")
                    .hide())
              : ($(a.target)
                  .parents(".product-card")
                  .find(".error-quantity")
                  .hide(),
                $(a.target)
                  .parents(".product-card")
                  .find(".product-card__addtocart")
                  .removeClass("is-disabled"))
            : $(a.target)
                .parents(".product-card")
                .find(".product-card__addtocart")
                .addClass("is-disabled");
        };
        $(document).on("click", ".quantity-selector-listitem", function (e) {
          let a = $(e.target).data("value"),
            r =
              ($(e.target)
                .parents(".product-card__selectors")
                .find(".variant-selector-listitem.is-selected")
                .attr("data-variant"),
              $(e.target)
                .parents(".product-card__selectors")
                .find(".variant-selector-listitem.is-selected")
                .attr("data-variantavl"));
          t(a, r, e);
        }),
          $(document).on("keyup", ".quantity-selector-input", function (e) {
            let a = $(e.target).val(),
              r =
                ($(e.target)
                  .parents(".product-card__selectors")
                  .find(".variant-selector-listitem.is-selected")
                  .attr("data-variant"),
                $(e.target)
                  .parents(".product-card__selectors")
                  .find(".variant-selector-listitem.is-selected")
                  .attr("data-variantavl"));
            t(parseInt(a), r, e);
          }),
          $(document).on("blur", ".quantity-selector-input", function (t) {
            $(t.target).val() || $(t.target).val(1);
          }),
          $(".sticky-top-filter-container").click(function () {
            $(this);
            let t = $(this).attr("data-top-filters");
            t &&
              $(".top-filter-container[data-tag=" + t + "]").trigger("click");
          }),
          $(document).on("click", function (t) {
            var e = $(".product-card__quantity"),
              a = $(".product-card__variants");
            e === t.target ||
              e.has(t.target).length ||
              ($(".quantity-selector-list").removeClass("dropdown-open"),
              $(".quantity-selector-list").css("display", "none")),
              a === t.target ||
                a.has(t.target).length ||
                ($(".variant-selector-list").removeClass("dropdown-open"),
                $(".variant-selector-list").css("display", "none"));
          }),
          $(document).on("click", ".quantity-selector-listitem", function () {
            if (!$(this).hasClass("is-selected")) {
              $(this)
                .parents(".quantity-selector-list")
                .find(".quantity-selector-listitem")
                .removeClass("is-selected"),
                $(this).addClass("is-selected");
              var t = $(this).attr("data-value");
              t >= 10
                ? ($(this)
                    .parents(".product-card__quantity")
                    .css("display", "none"),
                  $(this)
                    .parents(".product-card__selectors")
                    .find(".quantity-selector-input")
                    .css("display", "block"),
                  $(this)
                    .parents(".product-card__selectors")
                    .find(".quantity-selector-input")
                    .focus())
                : $(this)
                    .parents(".product-card__quantity")
                    .find(".quantity-selector-value")
                    .html(t);
            }
          }),
          $(document).on("click", ".variant-selector-listitem", function () {
            if (!$(this).hasClass("is-selected")) {
              $(this)
                .parents(".variant-selector-list")
                .find(".variant-selector-listitem")
                .removeClass("is-selected"),
                $(this).addClass("is-selected");
              var t = $(this).attr("data-variant-title");
              $(this)
                .parents(".product-card__variants")
                .find(".variant-selector-value")
                .html(t),
                "true" == $(this).attr("data-variant-available")
                  ? ($(this)
                      .parents(".product-card")
                      .find(".product-card__addtocart")
                      .removeClass("is-disabled"),
                    $(this)
                      .parents(".product-card")
                      .find(".product-card__addtocart")
                      .html("Add to cart"))
                  : ($(this)
                      .parents(".product-card")
                      .find(".product-card__addtocart")
                      .addClass("is-disabled"),
                    $(this)
                      .parents(".product-card")
                      .find(".product-card__addtocart")
                      .html("Sold out"));
              var e = $(this).attr("data-variant-price"),
                a = $(this).attr("data-variant-Maxprice"),
                r = $(this).attr("data-variant-priceToPrint"),
                i = $(this).attr("data-variant-MaxpriceToPrint");
              if (
                ($(this)
                  .parents(".product-card")
                  .find(".product-card__regularprice")
                  .html(r),
                $(this)
                  .parents(".product-card")
                  .find(".product-card__compareprice")
                  .html(i),
                a > e)
              ) {
                $(this)
                  .parents(".product-card")
                  .find(".product-card__compareprice")
                  .html(i);
                var s = parseInt(((a - e) / a) * 100);
                $(this)
                  .parents(".product-card")
                  .find(".product-card__discountpercentage")
                  .html(s + "% off");
              }
              var o = $(this).attr("data-variant-quantity");
              $(this)
                .parents(".product-card__selectors")
                .find(".TotalQuantity")
                .val(o);
              //when the variant is changed trigger the quantity selected in order to show or hide the error message
              $(this)
                .closest(".product-card__selectors")
                .find(".quantity-selector-listitem.is-selected")
                .click();
              $(this)
                .closest(".product-card__selectors")
                .find(".quantity-selector-input.variant-present")
                .trigger("keyup");
            }
          }),
          $(document).on("click", ".product-card__addtocart", function (t) {
            if ((t.preventDefault(), $(this).hasClass("is-disabled"))) return;

            if (t.target.classList.contains('bundle-ATC')){
              window.location.href = t.target.getAttribute('href');
            }
            
            var e,
              a = $(this)
                .parents(".product-card")
                .find(".variant-selector-listitem.is-selected")
                .attr("data-variant");
            (e =
              "none" ==
              $(this)
                .parents(".product-card")
                .find(".product-card__quantity")
                .css("display")
                ? $(this)
                    .parents(".product-card")
                    .find(".quantity-selector-input")
                    .val()
                : $(this)
                    .parents(".product-card")
                    .find(".quantity-selector-listitem.is-selected")
                    .attr("data-value")),
              JSON.parse(
                $(t.target)
                  .closest("[data-section-settings]")
                  .attr("data-section-settings")
              ).products;
            let r = 0,
              i = $(this)
                .siblings(".product-card__selectors")
                .find(".variant-selector-listitem.is-selected")
                .attr("data-variant");
            if (
              (allProductsCopy.forEach((ele, ind) => {
                allProductsCopy[ind].forEach((t, e) => {
                  t.variant_inventory[i] && (r = t.variant_inventory[i]);
                });
              }),
              parseInt(e) > 0 && parseInt(e) <= r)
            ) {
              let r = $(this).parents(".product-card");
              r.find(".loader").show(),
                r.find(".product-card__addtocart").hide(),
                $.ajax({
                  method: "POST",
                  url: "/cart/add.js",
                  dataType: "json",
                  cache: !1,
                  data: { id: parseInt(a), quantity: parseInt(e) },
                  timeout: 5000,
                  success: function () {
                    mmajaxcart.AjaxcartRender(),
                      mmajaxcart.AjaxcartOpen(),
                      mmajaxcart.CartCountHandler(),
                      r.find(".loader").hide(),
                      r.find(".product-card__addtocart").show(),
                      $(this).parents(".product-card").find(".loader").hide(),
                      $(this)
                        .parents(".product-card")
                        .find(".product-card__addtocart")
                        .show();
                  },
                  error: function (jqXHR, textStatus, errorThrown) {
                    if (errorThrown == "timeout" || textStatus == "timeout") {
                      console.log("ATC error in Collection Page");
                    } else {
                      $(t.target).siblings(".error-quantity").show();
                    }
                    r.find(".loader").hide(),
                      r.find(".product-card__addtocart").show();
                  },
                });
            } else $(this).parents(".product-card").find(".modal").css("display", "none"), $(ev.target).parents(".product-card").find(".product-card__addtocart").addClass("is-disabled"), 1 > parseInt(e) && (console.log("error"), $(this).parents(".product-card").find(".product-card__addtocart").addClass("is-disabled"));
          }),
          $(window).on("load", function () {
            document
              .querySelectorAll(".variant-selector-listitem")
              .forEach((t) => {
                t.classList.contains("is-selected") &&
                  document
                    .querySelectorAll(".product-card__price")
                    .forEach((e) => {
                      if (e.dataset.product_id == t.dataset.product_id) {
                        var a = parseInt(
                          ((t.dataset.variantMaxprice -
                            t.dataset.variantPrice) /
                            t.dataset.variantMaxprice) *
                            100
                        );
                        ($(e).children()[0].innerHTML =
                          t.dataset.variantPricetoprint),
                          ($(e).children()[1].innerHTML =
                            t.dataset.variantMaxpricetoprint),
                          ($(e).children()[2].innerHTML = `${a}%`);
                      }
                    });
              });
          }),
          $(document).on("click", ".close_error_Box", function () {
            $(this)
              .parents(".product-card")
              .find(".modal")
              .css("display", "none");
          }),
          $(document).on("click", ".variant-selector-listitem", function (e) {
            let nearestParent = $(this).closest(".product-card__selectors");
            let selectedQty = nearestParent.find(
              ".quantity-selector-listitem.is-selected"
            );
            let selectedQuantity = selectedQty.data("value");
            let inventory_html = e.currentTarget.outerHTML;
            let variantQuantity = $(inventory_html).data("variant-quantity");
            let isAvailable = $(inventory_html).data("variant-available");
            let productInfo = $(this).closest(".product-card__info");
            let the_atc = productInfo.find(".product-card__addtocart");
            let the_error = productInfo.find(".error-quantity");

            if (selectedQuantity > variantQuantity || !isAvailable) {
              the_atc.addClass("is-disabled");
            }
            if (selectedQuantity > variantQuantity) {
              the_error.show();
            }
            if (!isAvailable) {
              the_error.hide();
            }
          });
      })(),
      o
    );
  })()),
  new marmeto.Collection("marmeto-collection-template");

/*--------- footer-hyper-links-functionality ----------*/
let dataValues;

async function getExcelDataAsync() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "https://sheets.googleapis.com/v4/spreadsheets/1NpItHCd_0GVq3zZ4k51W7iLOEaAhXsPFmFpRCCcskR4/values/Internal%20Linking?key=AIzaSyD_m9uaBxBNAe4kI4NZSDUUKCU3ooF0cIk",
      dataType: "json",
      success: function (data) {
        resolve(data.values);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
}

async function fetchDataAppend() {
  try {
    dataValues = await getExcelDataAsync();
    let currentCollection = $("[data-collection-handle]").attr(
        "data-collection-handle"
      ),
      firstvalue = "",
      categoryArray = [],
      textArray = [],
      linkArray = [];

    //get the first row unique heading
    for (let i = 1; i < dataValues.length; i++) {
      if (dataValues[i][0].trim() == currentCollection) {
        if (dataValues[i][1].trim() != firstvalue.trim()) {
          firstvalue = dataValues[i][1].trim();
          categoryArray.push(firstvalue);
        }
      }
    }

    //create and array of each unique array heading
    for (let k = 0; k < categoryArray.length; k++) {
      this["text" + k] = [];
      this["link" + k] = [];
      textArray.push(this["text" + k]);
      linkArray.push(this["link" + k]);
    }

    //for one heading element push 1 array of texts and corresponding 1 array of links
    for (let j = 0; j < categoryArray.length; j++) {
      for (let i = 1; i < dataValues.length; i++) {
        if (dataValues[i][0].trim() == currentCollection) {
          if (dataValues[i][1].trim() == categoryArray[j].trim()) {
            textArray[j].push(dataValues[i][2]);
            linkArray[j].push(dataValues[i][3]);
          }
        }
      }
    }

    //appending the fetched data
    if (textArray.length > 0 && linkArray.length > 0) {
      $(".footer-links__container").show();
      for (let j = 0; j < textArray.length; j++) {
        if (textArray[j].length) {
          let heading = document.createElement("p");
          heading.classList.add("h2");
          heading.innerText = categoryArray[j];
          document.querySelector(".footer-links__wrapper").appendChild(heading);

          for (let i = 0; i < textArray[j].length; i++) {
            let aTag = document.createElement("a");
            let seporatorTag = document.createElement("div");
            seporatorTag.classList.add("pipe");
            aTag.setAttribute("href", linkArray[j][i]);
            aTag.innerText = textArray[j][i];
            seporatorTag.innerText = "|";
            document.querySelector(".footer-links__wrapper").appendChild(aTag);
            if (i != textArray[j].length - 1) {
              document
                .querySelector(".footer-links__wrapper")
                .appendChild(seporatorTag);
            }
          }
        }
      }
    }
  } catch (error) {
    console.log("Error fetching data:", error);
  }
}

fetchDataAppend();

$(() => {
  function toggleStickyFilter() {
    let bigFilterOffset = document.getElementsByClassName(
      "collection-top-filters"
    )[0].offsetTop;
    if (window.pageYOffset > bigFilterOffset) {
      document
        .getElementsByClassName("sticky-collection-top-filters")[0]
        .classList.add("sticky-filter");
      $(".sticky-inner-container").slick("setPosition"); // reinitialized slick
    } else
      document
        .getElementsByClassName("sticky-collection-top-filters")[0]
        .classList.remove("sticky-filter");
  }

  $(".faq-question").click(function (e) {
    $.faqOpen = $(this).closest(".faq");
    $.faqOpen.toggleClass("active");
    if ($.faqOpen.hasClass("active")) {
      $(this).find(".PlusButton").html("-");
    }
  });

  $(".faq-question").click(function (e) {
    $.faqClose = $(this).closest(".faq");
    if (!$.faqClose.hasClass("active")) {
      $(this).find(".PlusButton").html("+");
    }
  });

  $(".read_more_btn").click(function (e) {
    $(".faq-read-more-container").toggleClass("faq-read-more-hidden");
    if ($(".faq-read-more-container").hasClass("faq-read-more-hidden")) {
      $(".read_more_btn").html("View More");
    } else {
      $(".read_more_btn").html("View Less");
    }
  });

  $(".collection-top-filters").slick({
    dots: false,
    arrows: true,
    infinite: false,
    swipeToSlide: true,
    speed: 200,
    slidesToShow: 6.5,
    slidesToScroll: 1,
    prevArrow:
      "<img class='slick-prev' src='https://cdn.shopify.com/s/files/1/0551/8009/9722/t/14/assets/circle_arrow_right.png?v=674530996865847369' style='transform: rotate(180deg);height:40px; width:40px' >",
    nextArrow:
      "<img class='slick-next' src='https://cdn.shopify.com/s/files/1/0551/8009/9722/t/14/assets/circle_arrow_right.png?v=674530996865847369' style='height:40px; width:40px' >",
    responsive: [
      {
        breakpoint: 1359,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          arrows: false,
          slidesToShow: 5.5,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 769,
        settings: {
          arrows: false,
          slidesToShow: 3.5,
          slidesToScroll: 3,
        },
      },
    ],
  });

  $(".sticky-inner-container").slick({
    dots: false,
    arrows: true,
    infinite: false,
    swipeToSlide: true,
    speed: 300,
    slidesToShow: 9,
    slidesToScroll: 1,
    prevArrow:
      "<img class='slick-prev' src='https://cdn.shopify.com/s/files/1/0551/8009/9722/t/14/assets/circle_arrow_right.png?v=674530996865847369' style='transform: rotate(180deg);' >",
    nextArrow:
      "<img class='slick-next' src='https://cdn.shopify.com/s/files/1/0551/8009/9722/t/14/assets/circle_arrow_right.png?v=674530996865847369' >",
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 6.2,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 769,
        settings: {
          arrows: false,
          swipeToSlide: true,
          slidesToShow: 3.4,
          slidesToScroll: 4,
        },
      },
    ],
  });

  $(".backdrop").click(() => {
    $(".mmc-sort-mobile").removeClass("is--opened");
    $("body").removeClass("no-overflow");
  });
});

$(".filter-group.and").each(function (index, item) {
  if ($(this).find(".filter-item").length < 1) {
    $(this).hide();
  }
});
