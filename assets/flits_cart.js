/****PLEASE DON'T MAKE CHANGES IN THIS FILE IT'S AFFECT THE CODE IF YOU NEED ANY HELP PLEASE CONTACT TO FLITS TEAM support@getflits.com ****/
(function (Flits) {
    var StoreCreditCart = (Flits.StoreCreditCart = function (options) {
        Flits.StoreCreditCart.settings = {};
        var settings = {
            get_spent_rules_route: "/get_credit",
            apply_credit_route: "/credit/apply_credit",
            delete_discounts_route: "/delete-discounts",
            main_div_class: "flits-credit-code-div",
            creditDropdownClass: "flits-want-to-use-credit flits-input",
            checkoutButtonSelectors: ["input[name='checkout']", "button[name='checkout']", "[href$='checkout']"],
            checkoutFormSelectors: ["form[action$='/cart'][method='post']"],
            updateCartButtonSelectors: ["form[action$='/cart'] input[name='update']", "form[action$='/cart'] button[name='update']"],
            isCodeAutomatic: true,
            automaticCodeDiv: "#flits-cart-automatic-code",
            checkoutButtonParameterValue: "store-credit-added",
            checkoutButtonParentParameterValue: "store-credit-parent",
            automaticAppendDivFunction: function () {},
            isAjaxCart: true,
            isApplyCreditChecked: false,
            isProcessCheckout: true,
            isDeleteDiscount: true,
            removeAttributesFromCart: ["sku", "featured_image", "product_description", "title", "url", "handle", "product_type", "product_title", "discounts", "variant_options", "options_with_values", "variant_title"],
            creditDropDownHtml: '<div id="flits-cart-automatic-code" style="display:none;"> <div class="flits-credit-code-div flits-template"></div> </div>',
        };
        settings = Flits.extend(Flits.StoreCreditCart.settings, settings, options);
        Flits.dispatchEvent("Flits:StoreCreditCart:Loaded", { settings: settings });
        function generate_dropdown_code(data) {
            var moneyFormat = Flits.money_format;
            var total_credits = data.total_credits;
            if (total_credits <= 0) {
                return "";
            }
            var rules = data.rules;
            if (rules.length <= 0) {
                return "";
            }
            var $selectConatiner = Flits("<div class='flits-select-row flits-cart-drp'/>");
            var $result = Flits("<select class='" + Flits.StoreCreditCart.settings.creditDropdownClass + "' />");
            $selectConatiner.append(
                '<div class="flits-select-arrow">' +
                    '<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" shape-rendering="geometricPrecision"><path d="M6 9l6 6 6-6"></path></svg>' +
                    "</div>"
            );
            if (rules.length > 0) {
                $result.append("<option value='-1'>" + Flits.t("Flits.locals.cart_page.select_credit_option", "Select option to use store credit") + "</option>");
            }
            for (var i = 0; i < rules.length; i++) {
                var credits = rules[i].applicable_credits;
                var rule_id = rules[i].rule.id;
                var option_text = "You can use {{ credit }} credit out of {{ total_credit }}.";
                switch (rules[i].rule.rule.column.name) {
                    case "cart_value":
                        option_text = Flits.t("Flits.locals.cart_page.credit_cart_percentage", "You can use {{ credit }} credit out of {{ total_credit }}.").replace("{{ credit }}", Flits.formatMoney(Math.abs(credits), moneyFormat));
                        option_text = option_text.replace("{{ total_credit }}", Flits.formatMoney(Math.abs(total_credits), moneyFormat));
                        break;
                    default:
                        option_text = option_text.replace("{{ credit }}", Flits.formatMoney(Math.abs(credits), moneyFormat));
                        option_text = option_text.replace("{{ total_credit }}", Flits.formatMoney(Math.abs(total_credits), moneyFormat));
                        break;
                }
                $result.append("<option value='" + rule_id + "'>" + option_text + "</option>");
            }
            $selectConatiner.append($result);
            return Flits($selectConatiner);
        }
        function get_spent_rules(cart) {
            if (cart.total_price <= 0) {
                return;
            }
            cart = setupCartData(cart);
            var lastLoadedCart = Flits.getLocalStorage("lastLoadedCart");
            if (Flits.compareObject(lastLoadedCart, cart)) {
                var res = Flits.getLocalStorage("lastLoadedSpentRules");
                setupSpentRules(res, true);
                return true;
            }
            Flits.setLocalStorage("lastLoadedCart", cart);
            var url = [Flits.base_url, Flits.customer_id].join("/") + Flits.StoreCreditCart.settings.get_spent_rules_route;
            Flits.ajax({ url: url, method: "POST", data: { customer_hash: Flits.customerHash, token: Flits.token, cart: btoa(unescape(encodeURIComponent(JSON.stringify(cart)))) } }).done(function (res) {
                setupSpentRules(res, false);
            });
        }
        function setupSpentRules(res, isOldCartData) {
            Flits.setLocalStorage("lastLoadedSpentRules", res);
            if (res.is_credit_on_cart == "0") {
                return;
            }
            if (isOldCartData) {
                return;
            }
            var code = generate_dropdown_code(res.code);
            Flits("." + Flits.StoreCreditCart.settings.main_div_class).appendStoreCreditDropDown(code);
        }
        function apply_credit(cart) {
            if (cart.total_price <= 0) {
                Flits.redirectToCheckout({ discount: "+" });
                return false;
            }
            var checkoutProcessData = Flits.StoreCreditCart.settings.checkoutProcessData;
            if (Flits.isEmptyObject(checkoutProcessData) || checkoutProcessData.spentRuleId == -1 || !checkoutProcessData.spentRuleId) {
                Flits.redirectToCheckout({ discount: "+" });
                return false;
            }
            cart = setupCartData(cart);
            var url = [Flits.base_url, Flits.customer_id].join("/") + Flits.StoreCreditCart.settings.apply_credit_route;
            Flits.ajax({ url: url, method: "post", data: { customer_hash: Flits.customerHash, token: Flits.token, data: btoa(unescape(encodeURIComponent(JSON.stringify(cart)))), spent_rule_id: checkoutProcessData.spentRuleId } })
                .done(function (res) {
                    if (!res.status) {
                        Flits.redirectToCheckout({ discount: "+" });
                        return;
                    }
                    Flits.redirectToCheckout({ discount: res.code });
                    return;
                })
                .fail(function () {
                    Flits.redirectToCheckout({ discount: "+" });
                });
        }
        function removeOldDiscountCodes() {
            var url = [Flits.base_url, Flits.customer_id].join("/") + Flits.StoreCreditCart.settings.delete_discounts_route;
            return Flits.ajax({ url: url, method: "post", data: { customer_hash: Flits.customerHash, token: Flits.token } });
        }
        function setupCartData(cart) {
            Object.defineProperty(cart, "cart_token", Object.getOwnPropertyDescriptor(cart, "token"));
            delete cart["token"];
            var remove_attribute = Flits.StoreCreditCart.settings.removeAttributesFromCart;
            for (var i = 0; i < cart.items.length; i++) {
                for (var j = 0; j < remove_attribute.length; j++) {
                    if (!Flits.isNull(cart.items[i][remove_attribute[j]])) {
                        delete cart.items[i][remove_attribute[j]];
                    }
                }
            }
            return cart;
        }
        function checkoutProcess(event, btn) {
            checkIntegratedApplicationCode();
            if (!Flits.StoreCreditCart.settings.isProcessCheckout) {
                return false;
            }
            var parent = btn.closest('[data-flits="' + Flits.StoreCreditCart.settings.checkoutButtonParentParameterValue + '"]');
            if (!parent) {
                return true;
            }
            var element = Flits(parent).find(".flits-want-to-use-credit");
            var spentRuleId = -1;
            if (element.length <= 0) {
                return true;
            }
            var isStoreCreditApply = false;
            switch (element.prop("tagName").toString().toLowerCase()) {
                case "checkbox":
                    isStoreCreditApply = element.is(":checked");
                    spentRuleId = element.val();
                    break;
                case "select":
                    spentRuleId = element.val();
                    if (spentRuleId != "-1") {
                        isStoreCreditApply = true;
                    }
                    break;
                default:
                    break;
            }
            if (!isStoreCreditApply || spentRuleId == -1) {
                return true;
            }
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            var old_text = Flits(btn).html();
            var new_text = Flits.t("Flits.locals.cart_page.applying_credit_message", "Applying credit please wait");
            switch (Flits(btn).prop("tagName").toString().toLowerCase()) {
                case "input":
                    old_text = Flits(btn).val();
                    Flits(btn).val(new_text);
                    break;
                case "button":
                default:
                    old_text = Flits(btn).html();
                    Flits(btn).html(new_text);
                    break;
            }
            Flits(btn).attr("disabled", true);
            Flits.StoreCreditCart.settings.checkoutProcessData = { btn: btn, btnOldTxt: old_text, event: event, spentRuleId: spentRuleId };
            Flits.getCart()
                .done(apply_credit)
                .fail(function () {
                    Flits.redirectToCheckout({ discount: "+" });
                    return false;
                });
            return false;
        }
        function setupcheckoutProcess(event, submitBtn) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            var checkoutProcessResult = checkoutProcess(event, submitBtn);
            if (checkoutProcessResult) {
                if (Flits.StoreCreditCart.settings.isDeleteDiscount) {
                    removeOldDiscountCodes();
                }
                Flits.redirectToCheckout({ discount: "+" });
            }
            return false;
        }
        function add_events() {
            Flits(document).on("click", '[data-flits="' + Flits.StoreCreditCart.settings.checkoutButtonParameterValue + '"]', function (event) {
                var submitBtn = this;
                return setupcheckoutProcess.apply(Flits.StoreCreditCart, [event, submitBtn]);
            });
            Flits(document).on("click", Flits.StoreCreditCart.settings.updateCartButtonSelectors.join(","), function (event) {
                Flits(this).attr("data-flits", "update-cart-btn");
            });
            Flits(document).on("click", function (event) {
                var ele = event.target;
                var isUpdateButton = false;
                Flits.each(Flits(Flits.StoreCreditCart.settings.updateCartButtonSelectors.join(",")), function (index, item) {
                    if (Flits(ele).is(Flits(this))) {
                        isUpdateButton = true;
                        return false;
                    }
                });
                if (!isUpdateButton) {
                    Flits("[data-flits='update-cart-btn']").removeAttr("data-flits");
                }
            });
            Flits(document).on("submit", Flits.StoreCreditCart.settings.checkoutFormSelectors.join(","), function (event, extraParameter) {
                if (!Flits.isNull(extraParameter) && extraParameter.flitsFormSubmitted) {
                    return true;
                }
                if (Flits(this).find("[data-flits='update-cart-btn']").length > 0) {
                    return true;
                }
                var submitBtn = null;
                if (event.originalEvent && event.originalEvent.submitter) {
                    submitBtn = event.originalEvent.submitter;
                }
                if (!submitBtn && document.activeElement.type == "submit") {
                    submitBtn = document.activeElement;
                }
                if (!submitBtn) {
                    submitBtn = Flits(this).find("[type='submit'][data-flits='" + Flits.StoreCreditCart.settings.checkoutButtonParameterValue + "']");
                }
                if (!submitBtn) {
                    return true;
                }
                return setupcheckoutProcess.apply(Flits.StoreCreditCart, [event, submitBtn]);
            });
            if (Flits.StoreCreditCart.settings.isAjaxCart) {
                Flits.addToCartAjaxEvent();
                Flits.updateCartAjaxEvent();
                Flits.clearCartAjaxEvent();
                Flits.getCartAjaxEvent();
                var debouncedFunction = Flits.debounce(function (event) {
                    Flits.checkAndSetupStoreCreditDiv();
                    Flits.getCart().done(get_spent_rules);
                }, 2500);
                Flits(document).on("Flits:AjaxCart:ProductAdded", debouncedFunction);
                Flits(document).on("Flits:AjaxCart:CartUpdated", debouncedFunction);
                Flits(document).on("Flits:AjaxCart:CartRendered", debouncedFunction);
                Flits.dispatchEvent("Flits:AjaxCart:Setup", { debouncedFunction: debouncedFunction });
            }
        }
        function checkIntegratedApplicationCode() {
            Flits.StoreCreditCart.settings.isProcessCheckout = true;
            if (window.globoStores) {
                var isDateTimeSelected = true;
                if (window.globoStores.settings.storePickup.dateTimePicker.datePicker && "" == Flits(window.globoStores.datePicker.$node).val()) {
                    isDateTimeSelected = false;
                }
                if (window.globoStores.settings.storePickup.dateTimePicker.timePicker && "" == Flits(window.globoStores.timePicker.$node).val()) {
                    isDateTimeSelected = false;
                }
                if (!isDateTimeSelected) {
                    Flits("#pickupDateTimeErrorMsg").show();
                    Flits.StoreCreditCart.settings.isProcessCheckout = false;
                    return;
                }
            }
            if (window.Zapiet) {
                var isDateTimeSelected = false;
                if (window.Zapiet.Widget.checkoutEnabled()) {
                    isDateTimeSelected = true;
                }
                if (!isDateTimeSelected) {
                    Flits.StoreCreditCart.settings.isProcessCheckout = false;
                    return;
                }
            }
            Flits.dispatchEvent("Flits:IsCheckoutPossible");
        }
        function init() {
            Flits.checkAndSetupStoreCreditDiv();
            Flits.setLocalStorage("lastLoadedCart", {});
            Flits.setLocalStorage("lastLoadedSpentRules", {});
            Flits.getCart().done(get_spent_rules);
            add_events();
        }
      if(Flits.customer_id != "-1"){
        init();
      }
        var ajaxWishlistViewFunction = function(xhrOrFetch) {
          var url = this._url;
          // You can add your choice of URL Instead '?view=ajax'
            (-1 !== url.indexOf("cart?view=")) && Flits.dispatchEvent("Flits:AjaxWishlist", {
              response: this,
              xhrOrFetch: xhrOrFetch
            })
        };
        Flits.addAjaxEvents(ajaxWishlistViewFunction);
        Flits.addFetchEvents(ajaxWishlistViewFunction);
        Flits(document).on("Flits:AjaxWishlist", function() {
          setTimeout(function() {
            init();
          }, 1000);
        });
    });
    Flits.extend({
        checkAndSetupStoreCreditDiv: function () {
            if (Flits.StoreCreditCart.settings.isCodeAutomatic) {
                Flits(Flits.StoreCreditCart.settings.checkoutButtonSelectors.join(",")).appendStoreCreditDiv();
            } else {
                Flits("." + Flits.StoreCreditCart.settings.main_div_class)
                    .not(".flits-template")
                    .parents(Flits.StoreCreditCart.settings.automaticCodeDiv)
                    .show();
                Flits("." + Flits.StoreCreditCart.settings.main_div_class)
                    .not(".flits-template")
                    .attr("data-flits-manual-code", true);
                Flits("." + Flits.StoreCreditCart.settings.main_div_class)
                    .not(".flits-template")
                    .parents(Flits.StoreCreditCart.settings.automaticCodeDiv)
                    .parent()
                    .find(Flits.StoreCreditCart.settings.checkoutButtonSelectors.join(","))
                    .attr("data-flits", Flits.StoreCreditCart.settings.checkoutButtonParameterValue);
                Flits("." + Flits.StoreCreditCart.settings.main_div_class)
                    .not(".flits-template")
                    .parents(Flits.StoreCreditCart.settings.automaticCodeDiv)
                    .parent()
                    .attr("data-flits", Flits.StoreCreditCart.settings.checkoutButtonParentParameterValue);
            }
        },
    });
    Flits.fn.extend({
        appendStoreCreditDropDown: function (code) {
            this.each(function (index, item) {
                Flits(item).html("");
                Flits(item).append(Flits(code).clone(true));
            });
            return this;
        },
        appendStoreCreditDiv: function () {
            var settings = Flits.StoreCreditCart.settings;
            this.filter(':not([data-flits="' + Flits.StoreCreditCart.settings.checkoutButtonParameterValue + '"])').each(function (index, el) {
                el = Flits(el);
                if (el.css("display") != "none" && el.css("visibility") != "hidden") {
                    if (typeof el[0].addEventListener != "function") {
                        return;
                    }
                    var cloneNode = Flits(Flits.StoreCreditCart.settings.creditDropDownHtml)
                        .find("." + Flits.StoreCreditCart.settings.main_div_class)
                        .clone(true);
                    Flits(cloneNode).removeClass("flits-template");
                    var parent = el.parent();
                    el.before(cloneNode);
                    el.attr("data-flits", Flits.StoreCreditCart.settings.checkoutButtonParameterValue);
                    parent.attr("data-flits", Flits.StoreCreditCart.settings.checkoutButtonParentParameterValue);
                    Flits.StoreCreditCart.settings.automaticAppendDivFunction.apply(this, [el, parent, cloneNode]);
                    Flits.dispatchEvent("Flits:CartAutomaticCode:Loaded", { el: el, parent: parent, cloneNode: cloneNode });
                }
            });
            return this;
        },
    });
    StoreCreditCart(window.flitsObjects.StoreCreditCartPage);
})(Flits);
