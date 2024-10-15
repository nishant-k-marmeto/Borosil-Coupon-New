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
