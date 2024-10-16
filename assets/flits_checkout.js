/****PLEASE DON'T MAKE CHANGES IN THIS FILE IT'S AFFECT THE CODE IF YOU NEED ANY HELP PLEASE CONTACT TO FLITS TEAM support@getflits.com ****/
(!window.flitsApp || window.flitsApp === void 0) && (window.flitsApp = {}),
  (window.flitsApp.formatMoney = function (o, m) {
    function n(o, m) {
      return void 0 === o ? m : o;
    }
    function r(o, m, t, _) {
      if (
        ((m = n(m, 2)), (t = n(t, ",")), (_ = n(_, ".")), isNaN(o) || null == o)
      )
        return 0;
      var a = (o = (o / 100).toFixed(m)).split(".");
      return (
        a[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + t) +
        (a[1] ? _ + a[1] : "")
      );
    }
    "string" == typeof o && (o = o.replace(".", ""));
    var t = "",
      _ = /\{\{\s*(\w+)\s*\}\}/,
      a = m || "${{amount}}";
    switch (a.match(_)[1]) {
      case "amount":
        t = r(o, 2);
        break;
      case "amount_no_decimals":
        t = r(o, 0);
        break;
      case "amount_with_comma_separator":
        t = r(o, 2, ".", ",");
        break;
      case "amount_no_decimals_with_comma_separator":
        t = r(o, 0, ".", ",");
    }
    return a.replace(_, t);
  }),
  (window.flitsApp.credit_on_shipping_method = function () {
    var that = this;
    if (
      ((this.customer_id = ""),
      (this.customer_url = ""),
      (this.token = ""),
      (this.moneyFormat = ""),
      (this.select_div = ""),
      (this.select_format = ""),
      (this.store_credit_applied = ""),
      (this.cart_data = {}),
      (this.spent_rules = {}),
      (this.applied_discount_code_span =
        ".applied-reduction-code__information"),
      document.querySelector(".reduction-code__text") &&
        (this.applied_discount_code_span = ".reduction-code__text"),
      (this.get_ajax_obj = function () {
        if (window.XMLHttpRequest) return new XMLHttpRequest();
        else if (window.ActiveXObject)
          return new ActiveXObject("Microsoft.XMLHTTP");
      }),
      (this.serialize = function (obj) {
        var str = [];
        for (var p in obj)
          obj.hasOwnProperty(p) &&
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
      }),
      (this.generate_code = function (data) {
        var that = this;
        var moneyFormat = that.money_format;
        var total_credits = data.total_credits;
        var rules = data.rules;
        for (var i = 0; i < rules.length; i++) {
          var credits = rules[i].applicable_credits;
          var rule_id = rules[i].rule.id;
          var option_text =
            "You can use {{ credit }} credits out of {{ total_credit }}.";
          switch (rules[i].rule.rule.column.name) {
            case "cart_value":
              option_text = that.spent_rules.credit_cart_percentage.replace(
                "{{ credit }}",
                window.flitsApp.formatMoney(Math.abs(credits), moneyFormat).replace("₹ ","")
              );
              option_text = option_text.replace(
                "{{ total_credit }}",
                window.flitsApp.formatMoney(
                  Math.abs(total_credits),
                  moneyFormat
                ).replace("₹ ","")
              );
              break;
            case "checkout_shipping":
              option_text = that.spent_rules.free_shipping_rule;
              break;
            default:
              option_text = option_text.replace(
                "{{ credit }}",
                window.flitsApp.formatMoney(Math.abs(credits), moneyFormat).replace("₹ ","")
              );
              option_text = option_text.replace(
                "{{ total_credit }}",
                window.flitsApp.formatMoney(
                  Math.abs(total_credits),
                  moneyFormat
                ).replace("₹ ","")
              );
              break;
          }
          var opt = document.createElement("option");
          (opt.value = rule_id),
            (opt.innerHTML = option_text),
            opt.setAttribute('selected',true),
            that.select_format.querySelector(
              'select option[value="' + rule_id + '"]'
            ) || that.select_format.querySelector("select").appendChild(opt);
            // that.select_format.querySelector('select').selectedIndex = 1;
        }
        rules.length <= 0 && (that.select_format.style.display = "none");
      }),
      (this.add_checkbox_code = function () {
        setTimeout(function () {
          if (!document.querySelector("#flits-use-credit-div")) {
            var forms = document.querySelectorAll(
              'form input[name="checkout[reduction_code]"]'
            );
            for (var i = 0; i < forms.length; i++) {
              var form = forms[i].closest("form");
              if (form) {
                var select_div = that.select_div.cloneNode(!0);
                form.parentElement.parentNode.insertBefore(
                  select_div,
                  form.parentElement.nextSibling
                );
              }
            }
          }
        }, 4000);
      }),
      (this.getCookie = function (cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(";");
        for (var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == " ") c = c.substring(1);
          if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
      }),
      (this.setCookie = function (cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
      }),
      (this.isNull = function (x) {
        return x === void 0 || x == null || x.toString().trim() == "";
      }),
      (this.get_credit = function (args_data) {
        var that = this;
        var url = that.customer_url + "/get_credit";
        if (Shopify && Shopify.Checkout.step == that.step_name) {
          var ajax = that.get_ajax_obj();
          (ajax.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
              var res = JSON.parse(this.responseText);
              var div = document.createElement("div");
              if (
                ((div.id = "flits-use-credit-div"),
                (div.style.marginBottom = "1.5em"),
                that.generate_code(res.code),
                (that.select_div = div),
                that.select_div.append(that.select_format),
                res.is_credit_on_checkout == 1)
              ) {
                var old_code = that.getCookie("flits_discount_code");
                var applied_code_div = document.querySelector(
                  that.applied_discount_code_span
                );
                if (
                  (that.isNull(old_code)
                    ? that.add_checkbox_code()
                    : that.isNull(applied_code_div)
                    ? that.add_checkbox_code()
                    : old_code == applied_code_div.innerHTML ||
                      that.add_checkbox_code(),
                  !that.isNull(args_data))
                ) {
                  var code_step = args_data.step;
                  switch (code_step) {
                    case "remove_code":
                      var checkout_code_interval = setInterval(function () {
                        var that = window.flitsApp.credit_on_shipping_obj;
                        var applied_code_div = document.querySelector(
                          that.applied_discount_code_span
                        );
                        var old_code = that.getCookie("flits_discount_code");
                        that.isNull(applied_code_div)
                          ? (clearInterval(checkout_code_interval),
                            that.add_checkbox_code())
                          : old_code == applied_code_div.innerHTML ||
                            (clearInterval(checkout_code_interval),
                            that.add_checkbox_code());
                      }, 100);
                      break;
                    case "apply_code":
                      var checkout_code_interval = setInterval(function () {
                        var that = window.flitsApp.credit_on_shipping_obj;
                        var applied_code_div = document.querySelector(
                          that.applied_discount_code_span
                        );
                        var old_code = that.getCookie("flits_discount_code");
                        that.isNull(applied_code_div) ||
                          (clearInterval(checkout_code_interval),
                          that.add_checkbox_code());
                      }, 100);
                      break;
                    default:
                      break;
                  }
                }
              }
            }
          }),
            ajax.open("POST", url, !0),
            ajax.setRequestHeader(
              "Content-type",
              "application/x-www-form-urlencoded"
            );
          var cart_data = that.cart_data;
          that.isNull(cart_data.token) ||
            (Object.defineProperty(
              cart_data,
              "cart_token",
              Object.getOwnPropertyDescriptor(cart_data, "token")
            ),
            delete cart_data.token);
          var remove_attribute = [
            "sku",
            "featured_image",
            "product_description",
            "title",
            "url",
            "handle",
            "product_type",
            "product_title",
            "discounts",
            "variant_options",
            "options_with_values",
            "variant_title",
          ];
          for (var i = 0; i < cart_data.items.length; i++)
            for (var j = 0; j < remove_attribute.length; j++)
              that.isNull(cart_data.items[i][remove_attribute[j]]) ||
                delete cart_data.items[i][remove_attribute[j]];
          var data = that.serialize({
            customer_hash: window.flitsApp.credit_on_shipping_obj.customer_hash,
            token: that.token,
            cart: btoa(unescape(encodeURIComponent(JSON.stringify(cart_data)))),
            customer_id: that.customer_id,
            shipping_price: that.get_shipping_price(),
          });
          ajax.send(data);
        }
      }),
      (this.get_shipping_price = function () {
        var shipping_div = document.querySelector(
          "[data-checkout-total-shipping-target]"
        );
        return shipping_div
          ? shipping_div.getAttribute("data-checkout-total-shipping-target")
          : 0;
      }),
      (this.getCartData = function (success, error) {
        var that = this;
        var cart_url = "/cart.json";
        var cart_ajax = that.get_ajax_obj();
        (cart_ajax.onreadystatechange = function () {
          if (this.readyState == 4)
            if (this.status == 200) {
              if (typeof success == "function") {
                var res = JSON.parse(this.responseText);
                success(res);
              }
            } else typeof error == "function" && error();
        }),
          cart_ajax.open("GET", cart_url, !0),
          cart_ajax.send();
      }),
      (this.getFormData = function (form) {
        var inputs = form.querySelectorAll("[name]");
        var data = {};
        for (var i = 0; i < inputs.length; i++)
          data[inputs[i].name] = inputs[i].value;
        return that.serialize(data);
      }),
      (this.applyCreditClickEvent = function () {
        document.addEventListener("click", function (event) {
          var els = event.target;
          var btn = els;
          var that = window.flitsApp.credit_on_shipping_obj;
          if (els.classList.contains("apply-flits-credit")) {
            var is_checkbox = !1;
            var element = els
              .closest("#flits-use-credit-div")
              .querySelector("#flits-want-to-use-credit");
            var spent_rule_id = -1;
            if (
              (element && element.tagName.toString().toLowerCase() == "select"
                ? (is_checkbox = !1)
                : (is_checkbox = !0),
              is_checkbox && element.checked)
            )
              event.preventDefault();
            else if (!is_checkbox && element.value !== "-1")
              (spent_rule_id = element.value), event.preventDefault();
            else return !0;
            btn.setAttribute("disabled", !0),
              btn.classList.add("btn--loading"),
              that.getCartData(
                function (cart) {
                  var URL = "/credit/apply_credit";
                  var token = that.token;
                  URL = that.customer_url + URL;
                  var ajax = that.get_ajax_obj();
                  (ajax.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                      var res = JSON.parse(this.responseText);
                      if ((btn.setAttribute("disabled", !1), res.status)) {
                        var input = document
                          .querySelector(
                            'input[name="checkout[reduction_code]"]'
                          )
                          .cloneNode(!0);
                        (input.type = "hidden"),
                          (input.value = res.code),
                          document
                            .querySelector(
                              'input[name="checkout[reduction_code]"]'
                            )
                            .closest("form")
                            .appendChild(input),
                          document
                            .querySelector(
                              'input[name="checkout[reduction_code]"]'
                            )
                            .closest("form")
                            .submit(),
                          (btn.querySelector(".btn__applied").style.display =
                            "inline-block"),
                          (btn.querySelector(".btn__spinner").style.display =
                            "none"),
                          (btn.querySelector(".btn__content").style.display =
                            "none"),
                          that.setCookie("flits_discount_code", res.code, 3);
                      }
                    }
                  }),
                    ajax.open("POST", URL, !0),
                    ajax.setRequestHeader(
                      "Content-type",
                      "application/x-www-form-urlencoded"
                    ),
                    Object.defineProperty(
                      cart,
                      "cart_token",
                      Object.getOwnPropertyDescriptor(cart, "token")
                    ),
                    delete cart.token;
                  var remove_attribute = [
                    "sku",
                    "featured_image",
                    "product_description",
                    "title",
                    "url",
                    "handle",
                    "product_type",
                    "product_title",
                    "discounts",
                    "variant_options",
                    "options_with_values",
                    "variant_title",
                  ];
                  for (var i = 0; i < cart.items.length; i++)
                    for (var j = 0; j < remove_attribute.length; j++)
                      that.isNull(cart.items[i][remove_attribute[j]]) ||
                        delete cart.items[i][remove_attribute[j]];
                  var params =
                    "token=" +
                    token +
                    "&customer_hash=" +
                    window.flitsApp.credit_on_shipping_obj.customer_hash +
                    "&data=" +
                    btoa(unescape(encodeURIComponent(JSON.stringify(cart)))) +
                    "&spent_rule_id=" +
                    spent_rule_id +
                    "&shipping_price=" +
                    that.get_shipping_price();
                  ajax.send(params);
                },
                function () {
                  location.href = "/checkout";
                }
              );
          }
        }),
          document.addEventListener("submit", function (event) {
            var form = event.target;
            var that = window.flitsApp.credit_on_shipping_obj;
            return (
              that.isNull(form.querySelector("#checkout_clear_discount")) ||
                that.get_credit({ step: "remove_code" }),
              that.isNull(form.querySelector("#checkout_reduction_code")) ||
                that.get_credit({ step: "apply_code" }),
              !0
            );
          });
      }),
      (this.addEventToGoPaymentBtn = function () {
        var that = this;
        var btn = document.querySelector(
          '[data-trekkie-id="continue_to_payment_method_button"]'
        );
        if (btn) {
          var flits_discount_code = that.getCookie("flits_discount_code");
          var applied_code = document.querySelector(
            that.applied_discount_code_span
          )
            ? document.querySelector(that.applied_discount_code_span).innerHTML
            : null;
          if (
            flits_discount_code &&
            applied_code &&
            applied_code == flits_discount_code &&
            document.querySelector(".applied-reduction-code__clear-button")
          ) {
            var form = document
              .querySelector(".applied-reduction-code__clear-button")
              .closest("form");
            form.submit();
          }
        }
      }),
      (this.step_name = "payment_method"),
      Shopify && Shopify.Checkout.step == this.step_name)
    ) {
      var url = location.origin + "/?view=flits_customer_data";
      var ajax = this.get_ajax_obj();
      (ajax.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          var data = this.responseText;
          var parser = new DOMParser();
          var htmlDoc = parser.parseFromString(data, "text/html");
          var res = JSON.parse(
            htmlDoc.querySelector(".flits-checkout-data").innerHTML
          );
          var select = htmlDoc.querySelector(
            ".flits-checkout-select-credit-div"
          );
          (that.customer_id = res.customer_id),
            (that.customer_url = res.customer_url),
            (window.flitsApp.credit_on_shipping_obj.customer_hash =
              res.customer_hash),
            (that.token = res.token),
            (that.money_format = htmlDoc.querySelector(
              "#flits-money-format"
            ).value),
            (that.select_format = select),
            (that.spent_rules = res.spent_rules),
            (that.store_credit_applied = res.store_credit_applied),
            that.getCartData(
              function (cart_data) {
                var that = window.flitsApp.credit_on_shipping_obj;
                (that.cart_data = cart_data),
                  that.get_credit(),
                  that.applyCreditClickEvent();
              },
              function () {}
            );
        }
      }),
        ajax.open("GET", url, !0),
        ajax.send();
    }
    if (
      (Shopify &&
        Shopify.Checkout.step == "shipping_method" &&
        that.addEventToGoPaymentBtn(),
      Shopify)
    ) {
      var flits_discount_code = that.getCookie("flits_discount_code");
      var applied_code = document.querySelector(that.applied_discount_code_span)
        ? document.querySelector(that.applied_discount_code_span).innerHTML
        : null;
      if (
        flits_discount_code &&
        applied_code &&
        applied_code == flits_discount_code
      ) {
        var append_parent = document.querySelector(
          ".total-line-table " + that.applied_discount_code_span
        ).parentNode;
        var span = document.createElement("span");
        (span.innerHTML = "Store Credit Applied"),
          (span.className = "flits-store-credit-information"),
          append_parent.appendChild(span),
          (document.querySelector(
            ".total-line-table " + that.applied_discount_code_span
          ).style.display = "none");
        var url = location.origin + "/?view=flits_customer_data";
        var ajax = this.get_ajax_obj();
        (ajax.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            var data = this.responseText;
            var parser = new DOMParser();
            var htmlDoc = parser.parseFromString(data, "text/html");
            var res = JSON.parse(
              htmlDoc.querySelector(".flits-checkout-data").innerHTML
            );
            span.innerHTML = res.store_credit_applied;
            var flits_code_change_interval = setInterval(function () {
              if (
                flits_discount_code &&
                applied_code &&
                applied_code == flits_discount_code &&
                document.querySelector(
                  ".total-line-table " + that.applied_discount_code_span
                )
              ) {
                var append_parent = document.querySelector(
                  ".total-line-table " + that.applied_discount_code_span
                ).parentNode;
                if (
                  !append_parent.querySelector(
                    ".flits-store-credit-information"
                  )
                ) {
                  var span = document.createElement("span");
                  (span.innerHTML = res.store_credit_applied),
                    (span.className = "flits-store-credit-information"),
                    append_parent.appendChild(span),
                    (document.querySelector(
                      ".total-line-table " + that.applied_discount_code_span
                    ).style.display = "none");
                }
              }
            }, 100);
          }
        }),
          ajax.open("GET", url, !0),
          ajax.send();
      }
    }
  }),
  (window.flitsApp.credit_on_shipping_obj =
    new window.flitsApp.credit_on_shipping_method());
