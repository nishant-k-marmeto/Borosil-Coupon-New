/****PLEASE DON'T MAKE CHANGES IN THIS FILE IT'S AFFECT THE CODE IF YOU NEED ANY HELP PLEASE CONTACT TO FLITS TEAM support@getflits.com ****/
(function (Flits) {
  /* To load js in all pages */
  if (
    Flits.Metafields.IS_SOCIAL_LOGIN_PAID &&
    Flits.Metafields.IS_SOCIAL_LOGIN_ENABLE
  ) {
    if (window.flitsObjects.allCssJs.socialLoginJs) {
      Flits.LoadStyleScript(
        "socialLoginJs",
        window.flitsObjects.allCssJs.socialLoginJs.url
      );
    }
  }
  if(Flits.Metafields.IS_STORE_CREDIT_PAID && Flits.Metafields.CREDIT_DISPLAY_ON == 'cart' && Flits.Metafields.is_store_credit_enable && window.flitsObjects.storeData.customer_id != -1){
    Flits.LoadStyleScript('cartJs',window.flitsObjects.allCssJs.cartJs.url);
  }

  if (location.pathname.indexOf("/account") != -1) {
    Flits(document).on("click", ".flits-custom-tab-add", function (e) {
      var elem = Flits(this).attr("href").replace("/account", "");
      var el = elem.replace("#", "");
      //Flits('.flits-account-container').addClass('flits-active');

      Flits(".flits-menu-items .flits-menu-item").removeClass(
        "flits-menu-active"
      );
      Flits(".flits-custom-tab-add").removeClass("flits-menu-active");
      Flits('.flits-account-container a[href="' + elem + '"]')
        .closest(".flits-menu-item")
        .addClass("flits-menu-active");

      Flits(".flits-account-box").removeClass("flits-account-box-active");
      Flits(".flits-mobile-account-box").removeClass(
        "flits-account-box-active"
      );
      Flits("#flits_tab_" + el).addClass("flits-account-box-active");
      Flits("#flits_mobile_tab_" + el).addClass("flits-account-box-active");
      // To change the location.hash of the URL
      location.hash = el;
      var mobileDrawerOpen =
        Flits(".mobile-navbar").hasClass("rem-drawer-trans");
      if (mobileDrawerOpen) {
        Flits(".rem-drawer-trans").removeClass("rem-drawer-trans");
      }
    });
  }

  Flits.extend({
    addToCartCustom: function (params, button) {
      Flits.ajax({
        type: "POST",
        url: "/cart/add.js",
        data: params,
        dataType: "json",
      })
        .done(function (resp) {
          mmajaxcart.AjaxcartRender();
          Flits(".mm-ajaxcart-open")[0].click();
          flitsSnackbar.show({
            text: Flits.t(
              "Flits.locals.cart_page.added_to_cart",
              "Item(s) Added to cart"
            ),
            pos: "bottom-center",
            showAction: !1,
            customClass: "flits-alert-success",
            duration: 1500,
          });
        })
        .fail(function (resp) {
          flitsSnackbar.show({
            text: resp.responseJSON.description,
            pos: "bottom-center",
            showAction: !1,
            customClass: "flits-alert-error",
          });
        })
        .always(function () {});
    },
  });
  Flits(document).on("click", ".flits-reorder-btn", function (event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    let items = flitsOrder[Flits(this).attr("data-flits-target")];
    let params = {};
    let noItem = 0;
    let soldOutItem = 0;
    params["items"] = [];
    if (items.length > 0) {
      for (let i = 0; items.length > i; i++) {
        let item = items[i];
        if (!item.item_variant_id) {
          noItem++;
        } else {
          if (item.available == "true") {
            if (parseInt(item.inventory_quantity) <= parseInt(item.quantity)) {
              if (cartOrder[item.variant_id]) {
                if (
                  parseInt(item.inventory_quantity) >
                  parseInt(cartOrder[item.variant_id].cart_quantity)
                ) {
                  item.quantity =
                    parseInt(item.inventory_quantity) -
                    parseInt(cartOrder[item.variant_id].cart_quantity);
                } else {
                  item.quantity = parseInt(item.inventory_quantity);
                }
                flitsSnackbar.show({
                  text: Flits.t(
                    "Flits.locals.general.cart_updated",
                    "Some items are no longer available. Your cart has been updated."
                  ),
                  pos: "bottom-center",
                  showAction: false,
                  customClass: "flits-alert-default",
                });
              }
            } else {
              if (cartOrder[item.variant_id]) {
                if (
                  parseInt(item.inventory_quantity) <=
                  parseInt(cartOrder[item.variant_id].cart_quantity) +
                    parseInt(item.quantity)
                ) {
                  item.quantity =
                    parseInt(item.inventory_quantity) -
                    parseInt(cartOrder[item.variant_id].cart_quantity);
                  flitsSnackbar.show({
                    text: Flits.t(
                      "Flits.locals.general.cart_updated",
                      "Some items are no longer available. Your cart has been updated."
                    ),
                    pos: "bottom-center",
                    showAction: false,
                    customClass: "flits-alert-default",
                  });
                }
              }
            }
            params["items"].push({
              id: item.variant_id,
              quantity: item.quantity,
            });
          } else {
            soldOutItem++;
          }
        }
      }
      if (noItem == 1) {
        flitsSnackbar.show({
          text: Flits.t(
            "Flits.locals.order_page.one_product_unavailable",
            "One of the products is unavailable"
          ),
          pos: "bottom-center",
          showAction: false,
          customClass: "flits-alert-default",
        });
      } else if (noItem > 1) {
        flitsSnackbar.show({
          text: Flits.t(
            "Flits.locals.order_page.some_products_unavailable",
            "Some of the products are unavailable"
          ),
          pos: "bottom-center",
          showAction: false,
          customClass: "flits-alert-default",
        });
      }
      if (soldOutItem == 1) {
        setTimeout(
          function () {
            flitsSnackbar.show({
              text: Flits.t(
                "Flits.locals.order_page.one_product_sold_out",
                "One of the products is sold out."
              ),
              pos: "bottom-center",
              showAction: false,
              customClass: "flits-alert-default",
            });
          },
          noItem > 0 ? 1500 : 0
        );
      } else if (soldOutItem > 1) {
        setTimeout(
          function () {
            flitsSnackbar.show({
              text: Flits.t(
                "Flits.locals.order_page.some_products_sold_out",
                "Some of the products are sold out"
              ),
              pos: "bottom-center",
              showAction: false,
              customClass: "flits-alert-default",
            });
          },
          noItem > 0 ? 1500 : 0
        );
      }
      Flits.dispatchEvent("Flits:order:BeforeReOrder", {
        params: params,
      });
      setTimeout(
        function () {
          Flits.addToCartCustom(params);
        },
        soldOutItem > 0 || noItem > 0 ? 2500 : 1000
      );
    }
  });

  var ajaxCartViewFunction = function (xhrOrFetch) {
    var url = this._url;

    if (
      url.indexOf("/cart/change.js") !== -1 ||
      url.indexOf("view=mm-ajax") !== -1
    ) {
      Flits.dispatchEvent("Flits:AjaxCart", {
        response: this,
        xhrOrFetch: xhrOrFetch,
      });
    }
  };
  Flits.addAjaxEvents(ajaxCartViewFunction);

  Flits(document).on("Flits:AjaxCart", function () {
  
    Flits.getCart().done((cartData) => {
      let resp = localStorage.getItem("flits_credit_rules");
      if(resp){
       addCreditEarnMessageCartPage(JSON.parse(resp), cartData); 
      }
      else{
        seprateCartCallRules(cartData);
      }
    });
  });

  function seprateCartCallRules(cartData){
    function commonFromMetaFields(resp){
      resp.rules.all_rules_data.splice(3, 0, defaultRules);
      let objectToString = JSON.stringify(resp.rules.all_rules_data);
      localStorage.setItem("flits_credit_rules", objectToString);
      setCookie("flits_credit_rules", "true", 5);
      addCreditEarnMessageCartPage(resp, cartData);
    }
    if (window.flitsObjects.global.Metafields.GET_RULES_FOR_GUEST_CUSTOMERS) {
      commonFromMetaFields(window.flitsObjects.global.Metafields.GET_RULES_FOR_GUEST_CUSTOMERS)
    }else{
      Flits.ajax({
        type: "GET",
        url: Flits.base_url + "/get-rules?token=" + Flits.token,
      }).done(function (resp) {
        commonFromMetaFields(resp)  
      });
    }
  }

  function showEmptyBlock(selector, message, append) {
    var clone = Flits(".flits-no-activity-list").clone();
    clone.find(".flits-empty-text").text(message);
    if (append == 1) {
      Flits(selector).append(clone);
    } else {
      Flits(selector).html(clone);
    }
  }

  // ....................................................REWARD WIDGET....................................................

  //To set the template of spent rules(vertical design)
  var nestedSort =
    (prop1, prop2 = null, direction = "asc") =>
    (e1, e2) => {
      const a = prop2 ? e1[prop1][prop2] : e1[prop1],
        b = prop2 ? e2[prop1][prop2] : e2[prop1],
        sortOrder = direction === "asc" ? 1 : -1;
      return a < b ? -sortOrder : a > b ? sortOrder : 0;
    };
  Flits(document).on(
    "FlitsCustom:howToSpentRules:Successful",
    function (event) {
      if (howToSpentRuleLength > 0) {
        spentRange.sort(nestedSort("range"));
        var temp = "right";
        Flits.each(spentRange, function (index, value) {
          let divTag = Flits("<div />");
          if (index == 0) {
            divTag.addClass("active");
            Flits(
              ".flits-spend-rules-range-container .flits-spend-rule-description[data-flits-rule-for=" +
                value.range +
                "]"
            ).removeClass("flits-hide");
          }
          divTag.addClass("container");
          divTag.attr("data-flits-range-for", value.range);
          divTag.attr("data-flits-child", index + 1);
          let rangeLabel = Flits.formatMoney(
            Math.abs(value * 100),
            Flits.money_format
          );
          divTag.html(
            value.range_label.replace(
              "-",
              '<span class="flits-divider">-</span>'
            )
          );
          var childElement = divTag.html();
          var parentElement = Flits("<div class='range'></div>");
          parentElement.append(childElement);
          divTag.empty();
          divTag.append(parentElement);
          Flits(
            ".flits-spend-rules-range-container .flits-cart-range-container .flits-cart-range-slider"
          ).append(divTag);
          if (temp == "right") {
            divTag.addClass("left");
            temp = "left";
          } else {
            divTag.addClass("right");
            temp = "right";
          }
          var content = Flits(
            ".flits-spend-rules-range-container .flits-spend-rule-description"
          )[index];
          divTag.append(content);
        });
        setTimeout(function () {
          Flits(
            ".how-to-spend .flits-how-to-spend-container, .how-to-spend .flits-how-to-spend-inner-container"
          ).removeClass("flits-hide");
          Flits(".flits-how-to-spend-loader").hide();
        }, 700);
      }
    }
  );

  //Function for cookies so that we don't have to call every time every functions
  function setCookie(name, value, minutes) {
    var expires = "";
    if (minutes) {
      var date = new Date();
      date.setTime(date.getTime() + minutes * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }
  function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  const defaultRules = {
    rule_id: 4,
    is_fixed: 0,
    credits: 500,
    column_value: "1",
    module_on: "order_number",
    avails: [],
    description: "after_order_number_rule_description",
    image:
      "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNDgwIDQ4MCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDgwIDQ4MDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHBhdGggc3R5bGU9ImZpbGw6IzdEOEQ5QzsiIGQ9Ik0xNTIsOGgxNzZjMTcuNjczLDAsMzIsMTQuMzI3LDMyLDMydjQwMGMwLDE3LjY3My0xNC4zMjcsMzItMzIsMzJIMTUyYy0xNy42NzMsMC0zMi0xNC4zMjctMzItMzJWNDANCglDMTIwLDIyLjMyNywxMzQuMzI3LDgsMTUyLDh6Ii8+DQo8cGF0aCBzdHlsZT0iZmlsbDojODdDRUU5OyIgZD0iTTEyMCw4MGgyNDB2MzI4SDEyMFY4MHoiLz4NCjxnPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiNBQUJFQ0U7IiBkPSJNMTg0LDQwaDExMnYxNkgxODRWNDB6Ii8+DQoJPHBhdGggc3R5bGU9ImZpbGw6I0FBQkVDRTsiIGQ9Ik0yMjQsNDMyaDMydjE2aC0zMlY0MzJ6Ii8+DQo8L2c+DQo8cGF0aCBzdHlsZT0iZmlsbDojMkQ3NUJCOyIgZD0iTTI0OCwyMTZ2MTYwSDhWMjE2SDI0OHoiLz4NCjxnPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiNGREJENDA7IiBkPSJNMjQ4LDI0OHY0OEg4di00OEgyNDh6Ii8+DQoJPGNpcmNsZSBzdHlsZT0iZmlsbDojRkRCRDQwOyIgY3g9IjM3NiIgY3k9IjIwOCIgcj0iOTYiLz4NCjwvZz4NCjxjaXJjbGUgc3R5bGU9ImZpbGw6I0ZGRjY5QTsiIGN4PSIzNzYiIGN5PSIyMDgiIHI9IjY0Ii8+DQo8Zz4NCgk8cGF0aCBzdHlsZT0iZmlsbDojRkRCRDQwOyIgZD0iTTIyNCwzMjB2MzJoLTMydi0zMkgyMjR6Ii8+DQoJPHBhdGggc3R5bGU9ImZpbGw6I0ZEQkQ0MDsiIGQ9Ik00MDAsMjAwaC00MHYtMTZoNDBjNC40MTgsMCw4LTMuNTgyLDgtOHMtMy41ODItOC04LThoLTE2di04YzAtNC40MTgtMy41ODItOC04LThzLTgsMy41ODItOCw4djgNCgkJaC0xNmMtNC40MTgsMC04LDMuNTgyLTgsOHYzMmMwLDQuNDE4LDMuNTgyLDgsOCw4aDQwdjE2aC00MGMtNC40MTgsMC04LDMuNTgyLTgsOHMzLjU4Miw4LDgsOGgxNnY4YzAsNC40MTgsMy41ODIsOCw4LDgNCgkJczgtMy41ODIsOC04di04aDE2YzQuNDE4LDAsOC0zLjU4Miw4LTh2LTMyQzQwOCwyMDMuNTgyLDQwNC40MTgsMjAwLDQwMCwyMDB6Ii8+DQo8L2c+DQo8Zz4NCgk8cGF0aCBzdHlsZT0iZmlsbDojMzk0RDVDOyIgZD0iTTI4OCwxMjBoLTgwYy00LjQxOCwwLTgtMy41ODItOC04YzAtNC40MTgsMy41ODItOCw4LThoODBjNC40MTgsMCw4LDMuNTgyLDgsOA0KCQlDMjk2LDExNi40MTgsMjkyLjQxOCwxMjAsMjg4LDEyMHoiLz4NCgk8cGF0aCBzdHlsZT0iZmlsbDojMzk0RDVDOyIgZD0iTTI3MiwxNTJoLTMyYy00LjQxOCwwLTgtMy41ODItOC04czMuNTgyLTgsOC04aDMyYzQuNDE4LDAsOCwzLjU4Miw4LDhTMjc2LjQxOCwxNTIsMjcyLDE1MnoiLz4NCgk8cGF0aCBzdHlsZT0iZmlsbDojMzk0RDVDOyIgZD0iTTMyOCwzNDRoLTQ4Yy00LjQxOCwwLTgtMy41ODItOC04czMuNTgyLTgsOC04aDQ4YzQuNDE4LDAsOCwzLjU4Miw4LDhTMzMyLjQxOCwzNDQsMzI4LDM0NHoiLz4NCgk8cGF0aCBzdHlsZT0iZmlsbDojMzk0RDVDOyIgZD0iTTMxMiwzNzZoLTMyYy00LjQxOCwwLTgtMy41ODItOC04czMuNTgyLTgsOC04aDMyYzQuNDE4LDAsOCwzLjU4Miw4LDhTMzE2LjQxOCwzNzYsMzEyLDM3NnoiLz4NCjwvZz4NCjxwYXRoIGQ9Ik0xODQsNDBoMTEydjE2SDE4NFY0MHoiLz4NCjxwYXRoIGQ9Ik0yMjQsNDMyaDMydjE2aC0zMlY0MzJ6Ii8+DQo8cGF0aCBkPSJNMzc2LDEwNGMtMi43MDQsMC01LjM1MiwwLjItOCwwLjQwOFY0MGMtMC4wMjYtMjIuMDgtMTcuOTItMzkuOTc0LTQwLTQwSDE1MmMtMjIuMDgsMC4wMjYtMzkuOTc0LDE3LjkyLTQwLDQwdjE2OEg4DQoJYy00LjQxOCwwLTgsMy41ODItOCw4djE2MGMwLDQuNDE4LDMuNTgyLDgsOCw4aDEwNHY1NmMwLjAyNiwyMi4wOCwxNy45MiwzOS45NzQsNDAsNDBoMTc2YzIyLjA4LTAuMDI2LDM5Ljk3NC0xNy45Miw0MC00MFYzMTEuNTkyDQoJYzIuNjQ4LDAuMjA4LDUuMjk2LDAuNDA4LDgsMC40MDhjNTcuNDM4LDAsMTA0LTQ2LjU2MiwxMDQtMTA0UzQzMy40MzgsMTA0LDM3NiwxMDRMMzc2LDEwNHogTTEyOCw0MGMwLTEzLjI1NSwxMC43NDUtMjQsMjQtMjRoMTc2DQoJYzEzLjI1NSwwLDI0LDEwLjc0NSwyNCwyNHYzMkgxMjhWNDB6IE0yNDAsMjI0djE2SDE2di0xNkgyNDB6IE0xNiwyNTZoMjI0djMySDE2VjI1NnogTTE2LDMwNGgyMjR2NjRIMTZWMzA0eiBNMzUyLDQ0MA0KCWMwLDEzLjI1NS0xMC43NDUsMjQtMjQsMjRIMTUyYy0xMy4yNTUsMC0yNC0xMC43NDUtMjQtMjR2LTI0aDIyNFY0NDB6IE0zNTIsNDAwSDEyOHYtMTZoMTIwYzQuNDE4LDAsOC0zLjU4Miw4LThWMjE2DQoJYzAtNC40MTgtMy41ODItOC04LThIMTI4Vjg4aDIyNHYxOC45MDRjLTU1LjgzNCwxMy4xOTMtOTAuNDAxLDY5LjE1MS03Ny4yMDgsMTI0Ljk4NGM5LjA0NSwzOC4yNzcsMzguOTMxLDY4LjE2Myw3Ny4yMDgsNzcuMjA4VjQwMA0KCXogTTM3NiwyOTZjLTQ4LjYwMSwwLTg4LTM5LjM5OS04OC04OHMzOS4zOTktODgsODgtODhzODgsMzkuMzk5LDg4LDg4QzQ2My45NDMsMjU2LjU3Nyw0MjQuNTc3LDI5NS45NDMsMzc2LDI5NnoiLz4NCjxwYXRoIGQ9Ik0zNzYsMTM2Yy0zOS43NjQsMC03MiwzMi4yMzYtNzIsNzJzMzIuMjM2LDcyLDcyLDcyczcyLTMyLjIzNiw3Mi03MkM0NDcuOTU2LDE2OC4yNTQsNDE1Ljc0NiwxMzYuMDQ0LDM3NiwxMzZ6IE0zNzYsMjY0DQoJYy0zMC45MjgsMC01Ni0yNS4wNzItNTYtNTZzMjUuMDcyLTU2LDU2LTU2czU2LDI1LjA3Miw1Niw1NkM0MzEuOTY1LDIzOC45MTMsNDA2LjkxMywyNjMuOTY1LDM3NiwyNjR6Ii8+DQo8cGF0aCBkPSJNMjI0LDMxMmgtMzJjLTQuNDE4LDAtOCwzLjU4Mi04LDh2MzJjMCw0LjQxOCwzLjU4Miw4LDgsOGgzMmM0LjQxOCwwLDgtMy41ODIsOC04di0zMkMyMzIsMzE1LjU4MiwyMjguNDE4LDMxMiwyMjQsMzEyeg0KCSBNMjE2LDM0NGgtMTZ2LTE2aDE2VjM0NHoiLz4NCjxwYXRoIGQ9Ik0zODQsMjU2di04aDE2YzQuNDE4LDAsOC0zLjU4Miw4LTh2LTMyYzAtNC40MTgtMy41ODItOC04LThoLTQwdi0xNmg0MGM0LjQxOCwwLDgtMy41ODIsOC04cy0zLjU4Mi04LTgtOGgtMTZ2LTgNCgljMC00LjQxOC0zLjU4Mi04LTgtOHMtOCwzLjU4Mi04LDh2OGgtMTZjLTQuNDE4LDAtOCwzLjU4Mi04LDh2MzJjMCw0LjQxOCwzLjU4Miw4LDgsOGg0MHYxNmgtNDBjLTQuNDE4LDAtOCwzLjU4Mi04LDhzMy41ODIsOCw4LDgNCgloMTZ2OGMwLDQuNDE4LDMuNTgyLDgsOCw4UzM4NCwyNjAuNDE4LDM4NCwyNTZ6Ii8+DQo8cGF0aCBkPSJNMjk2LDExMmMwLTQuNDE4LTMuNTgyLTgtOC04aC04MGMtNC40MTgsMC04LDMuNTgyLTgsOGMwLDQuNDE4LDMuNTgyLDgsOCw4aDgwQzI5Mi40MTgsMTIwLDI5NiwxMTYuNDE4LDI5NiwxMTJ6Ii8+DQo8cGF0aCBkPSJNMjgwLDE0NGMwLTQuNDE4LTMuNTgyLTgtOC04aC0zMmMtNC40MTgsMC04LDMuNTgyLTgsOHMzLjU4Miw4LDgsOGgzMkMyNzYuNDE4LDE1MiwyODAsMTQ4LjQxOCwyODAsMTQ0eiIvPg0KPHBhdGggZD0iTTI3MiwzMzZjMCw0LjQxOCwzLjU4Miw4LDgsOGg0OGM0LjQxOCwwLDgtMy41ODIsOC04cy0zLjU4Mi04LTgtOGgtNDhDMjc1LjU4MiwzMjgsMjcyLDMzMS41ODIsMjcyLDMzNnoiLz4NCjxwYXRoIGQ9Ik0zMTIsMzYwaC0zMmMtNC40MTgsMC04LDMuNTgyLTgsOHMzLjU4Miw4LDgsOGgzMmM0LjQxOCwwLDgtMy41ODIsOC04UzMxNi40MTgsMzYwLDMxMiwzNjB6Ii8+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8L3N2Zz4NCg==",
    is_default_rule: true,
    is_eatab_to_appendrned: false,
    mappedRuleIds: [4, 3, 34],
    relation: ">=",
    tab_to_append: "flits_earning_rules",
    title: "after_order_number_rule_title",
  };
  //Function for seting rules
  let howToSpentRuleLength = 0;
  let spentRange = [];
  function setRules(data) {
    if (Flits("#custom-earning").length) {
      Flits("#custom-earning").html("");
    }
    let rules = data;
    let howToEarnRuleLength = 0;
    let notApplicableEarnRuleCount = 0;
    let earnRuleLength = 0;
    let referFriendRuleLength = 0;
    let title;
    let description;
    let multilangTitle;
    let multilangDescription;
    let unlockText;
    let earnedRuleCount = 0;
    let rulesConfig = {
      register: {
        icon: "PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOTAuNCAxODYuNyI+PHRpdGxlPlJlZ2lzdGVyPC90aXRsZT48cGF0aCBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIiBkPSJNMTMzLjEsMTMxYTYsNiwwLDEsMCw5LjgtN2gwQTc4LjEsNzguMSwwLDAsMCwxMDEsOTMuMmE0OS43OCw0OS43OCwwLDAsMCwyNi42LTQzLjgsNDkuMyw0OS4zLDAsMSwwLTcyLDQzLjhDMjMuNCwxMDMuMywwLDEzMy4xLDAsMTY4LjRhNiw2LDAsMCwwLDUuOSw1LjksNiw2LDAsMCwwLDUuOS01LjlBNjYuMzgsNjYuMzgsMCwwLDEsMTMzLjEsMTMxWk00MC45LDQ5LjRBMzcuNCwzNy40LDAsMSwxLDc4LjMsODYuOSwzNy4zNCwzNy4zNCwwLDAsMSw0MC45LDQ5LjRaTTE5MC40LDE1Mi43YTYsNiwwLDAsMS01LjksNS45SDE2Mi4xVjE4MWE1LjkxLDUuOTEsMCwwLDEtNS45LDUuOSw2LDYsMCwwLDEtNS45LTUuOVYxNTguNkgxMjcuOWE2LDYsMCwwLDEsMC0xMS45aDIyLjRWMTI0LjNhNS45MSw1LjkxLDAsMCwxLDUuOS01LjksNiw2LDAsMCwxLDUuOSw1LjloMHYyMi40aDIyLjRhNi4wNiw2LjA2LDAsMCwxLDUuOSw2WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtMC4yKSIgc3R5bGU9ImZpbGw6IzI1ZDg3MiIvPjwvc3ZnPg==",
        linkTo: "none",
        isDisplayEarnedCredits: false,
      },
      subscribe: {
        icon: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOTcuMjEgMTg3Ij48dGl0bGU+U3Vic2NyaWJlIEljb248L3RpdGxlPjxwYXRoIGQ9Ik0yMS40OSwzOC41MWE5LjQ3LDkuNDcsMCwwLDEtMy4yNi0xLjYyLDEuNjYsMS42NiwwLDAsMS0uNjctMS40LDEuNjQsMS42NCwwLDAsMSwuMzctMS4wNywxLjA4LDEuMDgsMCwwLDEsLjg2LS40NSwyLjQyLDIuNDIsMCwwLDEsMS4yLjQxLDksOSwwLDAsMCwyLjYyLDEuMzIsMTAuNzUsMTAuNzUsMCwwLDAsMywuNCw2LDYsMCwwLDAsMy4yNy0uNzRBMi40NCwyLjQ0LDAsMCwwLDMwLDMzLjE4YTEuODcsMS44NywwLDAsMC0xLTEuNzEsMTQuNzcsMTQuNzcsMCwwLDAtMy41NS0xLjE1QTIxLjM5LDIxLjM5LDAsMCwxLDIxLjI3LDI5YTUuODgsNS44OCwwLDAsMS0yLjQyLTEuODdBNC44Miw0LjgyLDAsMCwxLDE4LDI0LjI4LDUuNDgsNS40OCwwLDAsMSwxOSwyMWE2LjcsNi43LDAsMCwxLDIuOS0yLjIzQTEwLDEwLDAsMCwxLDI2LDE4YTEwLjIsMTAuMiwwLDAsMSw2LjgxLDIuMjIsMi4yOCwyLjI4LDAsMCwxLC41NC42MiwxLjgsMS44LDAsMCwxLC4xNi43OCwxLjU5LDEuNTksMCwwLDEtLjM3LDEuMDYsMS4wNiwxLjA2LDAsMCwxLS44Ni40NiwxLjYxLDEuNjEsMCwwLDEtLjU0LS4wOSw2LjEzLDYuMTMsMCwwLDEtLjY2LS4zMiw5LjQyLDkuNDIsMCwwLDAtMi4zMi0xLjNBNy45Miw3LjkyLDAsMCwwLDI2LDIxYTUuMzksNS4zOSwwLDAsMC0zLjE0LjgxQTIuNTYsMi41NiwwLDAsMCwyMS43MSwyNGEyLjA1LDIuMDUsMCwwLDAsMSwxLjg0QTExLjg5LDExLjg5LDAsMCwwLDI2LjE5LDI3YTIzLjI1LDIzLjI1LDAsMCwxLDQuMjIsMS4zLDYuMjQsNi4yNCwwLDAsMSwyLjQ4LDEuODJBNC40Myw0LjQzLDAsMCwxLDMzLjc3LDMzYTUuMzIsNS4zMiwwLDAsMS0xLDMuMiw2LjU5LDYuNTksMCwwLDEtMi44MywyLjE2LDEwLjc2LDEwLjc2LDAsMCwxLTQuMTkuNzdBMTQuNywxNC43LDAsMCwxLDIxLjQ5LDM4LjUxWm0xNy44My0xLjU5cS0yLjE5LTIuMTktMi4xOS02LjM5VjIwYTEuODQsMS44NCwwLDAsMSwuNS0xLjM2LDIsMiwwLDAsMSwyLjY4LDAsMS44OCwxLjg4LDAsMCwxLC41LDEuMzZWMzAuNzNhNS43Myw1LjczLDAsMCwwLDEuMjYsNCw0Ljc2LDQuNzYsMCwwLDAsMy42NywxLjM1LDQuNyw0LjcsMCwwLDAsMy42Ni0xLjM3LDUuNzYsNS43NiwwLDAsMCwxLjI1LTRWMjBhMS44OCwxLjg4LDAsMCwxLC41LTEuMzYsMiwyLDAsMCwxLDIuNjgsMCwxLjg0LDEuODQsMCwwLDEsLjUsMS4zNlYzMC41M2E4LjY4LDguNjgsMCwwLDEtMi4xOSw2LjM4cS0yLjE5LDIuMjEtNi40LDIuMlQzOS4zMiwzNi45MlpNNzQuMDksMzBhNS4yNiw1LjI2LDAsMCwxLDEsMy4yMSw1LDUsMCwwLDEtMS44OSw0LjEyQTguMTQsOC4xNCwwLDAsMSw2OCwzOC44NUg2MC40NmExLjgyLDEuODIsMCwwLDEtMS4zMi0uNDcsMS43MSwxLjcxLDAsMCwxLS40OS0xLjMxVjIwYTEuNzEsMS43MSwwLDAsMSwuNDktMS4zMSwxLjgyLDEuODIsMCwwLDEsMS4zMi0uNDdoNy4yNWE4LDgsMCwwLDEsNSwxLjQyLDQuNzIsNC43MiwwLDAsMSwxLjgyLDQsNC43OCw0Ljc4LDAsMCwxLS44NiwyLjg0LDUsNSwwLDAsMS0yLjM4LDEuNzVBNC45NCw0Ljk0LDAsMCwxLDc0LjA5LDMwWk02Mi4zMywyNi45aDQuNzZRNzEsMjYuOTMsNzEsMjRhMi40OCwyLjQ4LDAsMCwwLTEtMi4xNiw0LjkzLDQuOTMsMCwwLDAtMi45Mi0uN0g2Mi4zM1ptOC4yNCw4LjI3YTIuNzMsMi43MywwLDAsMCwuOTMtMi4yOCwyLjc5LDIuNzksMCwwLDAtLjk0LTIuMzEsNC44LDQuOCwwLDAsMC0zLS43Nkg2Mi4zM1YzNS45aDUuMjZhNC44NCw0Ljg0LDAsMCwwLDMtLjdabTEwLjkxLDMuMzFhOS4zOCw5LjM4LDAsMCwxLTMuMjYtMS42MiwxLjc3LDEuNzcsMCwwLDEtLjMtMi40NywxLjA4LDEuMDgsMCwwLDEsLjg2LS40NSwyLjM2LDIuMzYsMCwwLDEsMS4xOS40MUE5LjE1LDkuMTUsMCwwLDAsODIuNiwzNS43YTEwLjc1LDEwLjc1LDAsMCwwLDMsLjQsNiw2LDAsMCwwLDMuMjctLjc0QTIuNDQsMi40NCwwLDAsMCw5MCwzMy4xOGExLjg4LDEuODgsMCwwLDAtMS0xLjcxLDE0LjUxLDE0LjUxLDAsMCwwLTMuNTQtMS4xNUEyMS4zOSwyMS4zOSwwLDAsMSw4MS4yNiwyOWE1Ljg4LDUuODgsMCwwLDEtMi40Mi0xLjg3QTQuODIsNC44MiwwLDAsMSw3OCwyNC4yOCw1LjQ4LDUuNDgsMCwwLDEsNzksMjFhNi43LDYuNywwLDAsMSwyLjg1LTIuMjNBMTAsMTAsMCwwLDEsODYsMThhMTAuMjIsMTAuMjIsMCwwLDEsNi44MSwyLjIyLDIuMjgsMi4yOCwwLDAsMSwuNTQuNjIsMS44LDEuOCwwLDAsMSwuMTYuNzgsMS42NSwxLjY1LDAsMCwxLS4zNywxLjA2LDEuMDYsMS4wNiwwLDAsMS0uODYuNDYsMS41NywxLjU3LDAsMCwxLS41NC0uMDksNS4zMyw1LjMzLDAsMCwxLS42Ni0uMzIsOS42LDkuNiwwLDAsMC0yLjMyLTEuM0E3LjkyLDcuOTIsMCwwLDAsODYsMjFhNS4zOSw1LjM5LDAsMCwwLTMuMTQuODFBMi41NiwyLjU2LDAsMCwwLDgxLjcsMjRhMi4wNSwyLjA1LDAsMCwwLDEsMS44NEExMS45MiwxMS45MiwwLDAsMCw4Ni4xNywyN2EyMy4zOCwyMy4zOCwwLDAsMSw0LjIzLDEuMyw2LjMxLDYuMzEsMCwwLDEsMi41LDEuODYsNC40Myw0LjQzLDAsMCwxLC44NiwyLjgsNS4zMiw1LjMyLDAsMCwxLTEsMy4yLDYuNTksNi41OSwwLDAsMS0yLjgzLDIuMTYsMTAuOCwxMC44LDAsMCwxLTQuMTkuNzcsMTQuNywxNC43LDAsMCwxLTQuMjYtLjYyWm0xOS43NC0uNjhhOC42LDguNiwwLDAsMS0zLjQzLTMuNjgsMTIuNCwxMi40LDAsMCwxLTEuMi01LjYxQTEyLjI1LDEyLjI1LDAsMCwxLDk3Ljc5LDIzYTguNTgsOC41OCwwLDAsMSwzLjQzLTMuNjdBMTAuMjQsMTAuMjQsMCwwLDEsMTA2LjQzLDE4YTExLjMyLDExLjMyLDAsMCwxLDMuNjMuNTcsOS4zMSw5LjMxLDAsMCwxLDMsMS42NSwxLjU3LDEuNTcsMCwwLDEsLjUzLjYxLDEuODYsMS44NiwwLDAsMSwuMTUuNzksMS42OSwxLjY5LDAsMCwxLS4zNSwxLjA4LDEuMDgsMS4wOCwwLDAsMS0uODUuNDQsMi4xOSwyLjE5LDAsMCwxLTEuMi0uNDEsOC40NSw4LjQ1LDAsMCwwLTIuMzQtMS4zLDcuMjIsNy4yMiwwLDAsMC0yLjM5LS4zN0E1LjYyLDUuNjIsMCwwLDAsMTAyLDIzYTguNjMsOC42MywwLDAsMC0xLjU2LDUuNThBOC42OCw4LjY4LDAsMCwwLDEwMiwzNC4xNWE1LjYyLDUuNjIsMCwwLDAsNC42LDEuOSw2LjkzLDYuOTMsMCwwLDAsMi4zMi0uMzgsMTEuNTUsMTEuNTUsMCwwLDAsMi40MS0xLjI5LDQsNCwwLDAsMSwuNTktLjI5LDEuNTQsMS41NCwwLDAsMSwuNjEtLjEyLDEuMDgsMS4wOCwwLDAsMSwuODUuNDQsMS42OSwxLjY5LDAsMCwxLC4zNSwxLjA4LDEuODYsMS44NiwwLDAsMS0uMTUuNzcsMS41NSwxLjU1LDAsMCwxLS41My42Myw5LjMxLDkuMzEsMCwwLDEtMywxLjY1LDExLjMyLDExLjMyLDAsMCwxLTMuNjMuNTcsMTAuMzQsMTAuMzQsMCwwLDEtNS4yLTEuMjhabTMyLjY0LS4zMmExLjM5LDEuMzksMCwwLDEtLjU0LDEuMTFBMiwyLDAsMCwxLDEzMiwzOWExLjg2LDEuODYsMCwwLDEtLjg5LS4yMiwxLjkzLDEuOTMsMCwwLDEtLjcyLS42NWwtMy44OC01LjlBMy44OSwzLjg5LDAsMCwwLDEyNS4zMiwzMWEzLjQ0LDMuNDQsMCwwLDAtMS43MS0uMzhoLTIuODZ2Ni41NWExLjksMS45LDAsMCwxLS41LDEuMzgsMS43OSwxLjc5LDAsMCwxLTEuMzQuNTEsMS44MywxLjgzLDAsMCwxLTEuMzYtLjUxLDEuODYsMS44NiwwLDAsMS0uNTEtMS4zOFYyMGExLjc0LDEuNzQsMCwwLDEsLjQ4LTEuMzEsMS44MywxLjgzLDAsMCwxLDEuMzMtLjQ3aDcuM2E4LDgsMCwwLDEsNS4zMywxLjU2LDUuNiw1LjYsMCwwLDEsMS44Miw0LjUxLDUuNzIsNS43MiwwLDAsMS0xLjMsNCw2LjQ1LDYuNDUsMCwwLDEtMy44NCwyLDMuNjcsMy42NywwLDAsMSwxLjQ4LjczLDYuNDcsNi40NywwLDAsMSwxLjI2LDEuNDZsMi42Niw0LjA2YTEuOSwxLjksMCwwLDEsLjMsMVptLTUuMTEtMTAuNjJhMywzLDAsMCwwLDEtMi40NywzLDMsMCwwLDAtMS0yLjQ3LDUuMTQsNS4xNCwwLDAsMC0zLjEzLS43N2gtNC45djYuNTFoNC45YTQuOTMsNC45MywwLDAsMCwzLjEzLS43N1ptOS4xLDExLjYxYTEuODUsMS44NSwwLDAsMS0uNTItMS4zN1YyMEExLjc3LDEuNzcsMCwwLDEsMTM5LDE4LjEzaC4yMWExLjg3LDEuODcsMCwwLDEsMS4zOS41MUExLjg1LDEuODUsMCwwLDEsMTQxLjEsMjBWMzcuMTNhMS44OSwxLjg5LDAsMCwxLS41MSwxLjM3LDEuODQsMS44NCwwLDAsMS0xLjM5LjUyLDEuNzksMS43OSwwLDAsMS0xLjM1LS41MlpNMTYxLDMwYTUuMjUsNS4yNSwwLDAsMSwxLDMuMjEsNSw1LDAsMCwxLTEuODgsNC4xMiw4LjE0LDguMTQsMCwwLDEtNS4xOCwxLjQ5SDE0Ny40YTEuODQsMS44NCwwLDAsMS0xLjMzLS40NywxLjc0LDEuNzQsMCwwLDEtLjQ4LTEuMzFWMjBhMS43NCwxLjc0LDAsMCwxLC40OC0xLjMxLDEuODQsMS44NCwwLDAsMSwxLjMzLS40N2g3LjI0YTgsOCwwLDAsMSw1LDEuNDIsNC43MSw0LjcxLDAsMCwxLDEuODMsNCw0Ljc4LDQuNzgsMCwwLDEtLjg2LDIuODQsNSw1LDAsMCwxLTIuMzgsMS43NUE1LDUsMCwwLDEsMTYxLDMwWm0tMTEuNzYtMy4xSDE1NHEzLjg5LDAsMy44OS0yLjg5YTIuNTEsMi41MSwwLDAsMC0xLTIuMTYsNC45Myw0LjkzLDAsMCwwLTIuOTItLjdoLTQuNzZabTguMjQsOC4yN2EyLjczLDIuNzMsMCwwLDAsLjkzLTIuMjgsMi43NywyLjc3LDAsMCwwLS45NS0yLjMxLDQuNzUsNC43NSwwLDAsMC0zLS43NkgxNDkuMlYzNS45aDUuMjZhNC44Niw0Ljg2LDAsMCwwLDMtLjdaTTE2NiwzOC4zOGExLjc0LDEuNzQsMCwwLDEtLjQ4LTEuMzFWMjBhMS43NCwxLjc0LDAsMCwxLC40OC0xLjMxLDEuODMsMS44MywwLDAsMSwxLjMzLS40N2gxMC41NGEyLDIsMCwwLDEsMS4zMi4zOCwxLjMsMS4zLDAsMCwxLC40NiwxLjA4LDEuMzcsMS4zNywwLDAsMS0uNDYsMS4xMiwyLDIsMCwwLDEtMS4zMi40SDE2OS4ydjUuN2g4LjA5YTIsMiwwLDAsMSwxLjMxLjM4LDEuMzcsMS4zNywwLDAsMSwuNDcsMS4xMSwxLjMxLDEuMzEsMCwwLDEtLjQ3LDEuMDgsMiwyLDAsMCwxLTEuMzEuMzhIMTY5LjJ2Nmg4LjY3YTIsMiwwLDAsMSwxLjMyLjM5LDEuNDEsMS40MSwwLDAsMSwuNDYsMS4xMywxLjMsMS4zLDAsMCwxLS40NiwxLjA4LDIuMDUsMi4wNSwwLDAsMS0xLjMyLjM4SDE2Ny4zQTEuODMsMS44MywwLDAsMSwxNjYsMzguMzhaTTE4MS4xOCwwaC0xNjVBMTYuMjMsMTYuMjMsMCwwLDAsMCwxNi4yMVY1Ni4xQTE2LjIzLDE2LjIzLDAsMCwwLDE2LjIxLDcyLjMxaDY2Ljl2NTAuMjhsLTcuMDYtNy4wN0ExNS40NiwxNS40NiwwLDAsMCw1Mi4zNywxMzUuMnEuMzguNTcuODIsMS4xbDI4LjI2LDM0LjA4QTQ2LjMyLDQ2LjMyLDAsMCwwLDExNywxODdoMTcuNjZhNDEuMTQsNDEuMTQsMCwwLDAsNDAuOTMtNDAuOTNWMTExLjE2YTE1LjE1LDE1LjE1LDAsMCwwLTIyLjQ0LTEzLjMsMTUuMjQsMTUuMjQsMCwwLDAtMjAuNi02LjMzbC0uMTguMWExNS4xNCwxNS4xNCwwLDAsMC0xMy41LTguMSwxNS40MywxNS40MywwLDAsMC01LjQsMXYtMTJIMTgxYTE2LjIyLDE2LjIyLDAsMCwwLDE2LjIxLTE2LjJWMTYuMjFBMTUuOTIsMTUuOTIsMCwwLDAsMTgxLjU4LDBaTTEyOS40NSwxMTYuNzdhNSw1LDAsMCwwLDUtNXYtNi44NWE1LjQxLDUuNDEsMCwwLDEsMTAuODEsMFYxMThhNSw1LDAsMSwwLDEwLDB2LTYuODZhNS40LDUuNCwwLDAsMSwxMC44LDBoMHYzNC45MWEzMS4yMSwzMS4yMSwwLDAsMS0zMS4xNiwzMS4xNkgxMTcuMTlhMzYsMzYsMCwwLDEtMjcuODUtMTMuMDlMNjAuODgsMTI5Ljg2YTUuNDYsNS40NiwwLDAsMS0xLjI1LTQuMzYsNC43OCw0Ljc4LDAsMCwxLDIuNS0zLjc0LDUuNTIsNS41MiwwLDAsMSwzLjExLTEsNS42Nyw1LjY3LDAsMCwxLDQsMS42Nkw4MC42MiwxMzMuNmE3LjQxLDcuNDEsMCwwLDAsNy44OSwxLjY2LDcuMjksNy4yOSwwLDAsMCw0LjU3LTYuODVWNTUuMjdhNS41LDUuNSwwLDAsMSw1LjQxLTUuNCw0Ljg3LDQuODcsMCwwLDEsMy43NCwxLjY2LDUuNTcsNS41NywwLDAsMSwxLjY2LDMuNzR2NTAuMjhhNSw1LDAsMSwwLDEwLDBWOTguNjlhNS40MSw1LjQxLDAsMCwxLDEwLjgxLDB2MTMuMDlhNC42Myw0LjYzLDAsMCwwLDQuMjUsNVpNMTg3LDU2LjFhNiw2LDAsMCwxLTUuODIsNkgxMTMuNjVWNTUuMjdhMTUuMDksMTUuMDksMCwwLDAtNC41Ny0xMC44MSwxNC45MywxNC45MywwLDAsMC0xMC44LTQuMzZBMTUuMjYsMTUuMjYsMCwwLDAsODMuMTEsNTUuMjd2Ni44NkgxNi4yMWE1Ljg2LDUuODYsMCwwLDEtNS44Mi01LjlzMC0uMDcsMC0uMVYxNi4yMWE2LDYsMCwwLDEsNS44Mi02aDE2NUE1Ljg1LDUuODUsMCwwLDEsMTg3LDE2LjA5czAsLjA4LDAsLjEyVjU2LjFaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDApIiBzdHlsZT0iZmlsbDojMjVkODcyIi8+PC9zdmc+",
        linkTo: "none",
        isDisplayEarnedCredits: false,
      },
      order_number: {
        icon: "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIxLjEuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAyNSAyNSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjUgMjU7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojMjVEODcyO30KPC9zdHlsZT4KPHBhdGggaWQ9IkxheWVyXzIiIGNsYXNzPSJzdDAiIGQ9Ik0yMi4xLDE4LjRjMC0wLjMsMC4yLTAuNSwwLjUtMC41czAuNSwwLjIsMC41LDAuNWMwLDAuMy0wLjIsMC41LTAuNSwwLjVsMCwwCglDMjIuMywxOC45LDIyLjEsMTguNiwyMi4xLDE4LjR6IE0wLDIzLjV2LTEyQzAsMTEuMywwLjIsMTEsMC40LDExYzAsMCwwLDAsMC4xLDBoNi42VjUuNGMwLTAuMywwLjItMC41LDAuNS0wLjVoMy43CgljMC0yLjcsMi4yLTQuOSw0LjktNC45czQuOSwyLjIsNC45LDQuOWMwLDAsMCwwLDAsMGgzLjRjMC4zLDAsMC41LDAuMiwwLjUsMC41djE4LjJjMCwwLjgtMC43LDEuNS0xLjUsMS41SDEuNQoJQzAuNywyNSwwLDI0LjMsMCwyMy41eiBNMS41LDI0aDEwLjRjMC4zLDAsMC41LTAuMiwwLjUtMC41di0xLjdIMXYxLjhDMSwyMy44LDEuMiwyNCwxLjUsMjR6IE0yNCwyMy41di0xLjhIMTMuM3YxLjgKCWMwLDAuMiwwLDAuMy0wLjEsMC41aDEwLjNDMjMuOCwyNCwyNCwyMy44LDI0LDIzLjV6IE0xMi4zLDQuOWg3LjhjMC0yLjItMS44LTMuOS0zLjktMy45QzE0LjEsMSwxMi4zLDIuNywxMi4zLDQuOXogTTguMSwxMWg0LjcKCWMwLjMsMCwwLjUsMC4yLDAuNSwwLjVjMCwwLDAsMCwwLDB2OS4zSDI0VjUuOWgtMi45djIuMmgwLjVjMC4zLDAsMC41LDAuMiwwLjUsMC41YzAsMCwwLDAsMCwwYzAsMC4zLTAuMiwwLjUtMC41LDAuNWgtMgoJYy0wLjMsMC0wLjUtMC4yLTAuNS0wLjVjMC0wLjMsMC4yLTAuNSwwLjUtMC41YzAsMCwwLDAsMCwwaDAuNVY1LjloLTcuOHYyLjJoMC41YzAuMywwLDAuNSwwLjIsMC41LDAuNWMwLDAsMCwwLDAsMAoJYzAsMC4zLTAuMiwwLjUtMC41LDAuNWgtMS45Yy0wLjMsMC0wLjUtMC4yLTAuNS0wLjVjMC0wLjMsMC4yLTAuNSwwLjUtMC41YzAsMCwwLDAsMCwwaDAuNVY1LjlIOC4xVjExeiBNMSwxMnY4LjhoMTEuM1YxMkgxegoJIE0zLjcsMTQuOXYxYzAsMS42LDEuMywyLjksMi45LDIuOWMxLjYsMCwyLjktMS4zLDIuOS0yLjljMCwwLDAsMCwwLDB2LTFjMC4zLDAsMC41LTAuMiwwLjUtMC41cy0wLjItMC41LTAuNS0wLjVoLTEKCWMtMC4zLDAtMC41LDAuMi0wLjUsMC41czAuMiwwLjUsMC41LDAuNXYxYy0wLjIsMS4xLTEuMywxLjgtMi40LDEuNWMtMC43LTAuMi0xLjMtMC44LTEuNS0xLjV2LTFjMC4zLDAsMC41LTAuMiwwLjUtMC41CglTNSwxMy45LDQuNywxMy45aC0xYy0wLjMsMC0wLjUsMC4yLTAuNSwwLjVTMy40LDE0LjksMy43LDE0LjlMMy43LDE0LjlMMy43LDE0Ljl6IE0yMi42LDE2LjljMC4zLDAsMC41LTAuMiwwLjUtMC41YzAsMCwwLDAsMCwwdi00CgljMC0wLjMtMC4yLTAuNS0wLjUtMC41cy0wLjUsMC4yLTAuNSwwLjV2My45QzIyLjEsMTYuNywyMi4zLDE2LjksMjIuNiwxNi45QzIyLjYsMTYuOSwyMi42LDE2LjksMjIuNiwxNi45TDIyLjYsMTYuOXoiLz4KPC9zdmc+Cg==",
        linkTo: "/collections/all",
        isDisplayEarnedCredits: false,
      },
      birthdate: {
        icon: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNSAyNSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiMyNWQ4NzI7fTwvc3R5bGU+PC9kZWZzPjxnIGlkPSJMYXllcl8yIiBkYXRhLW5hbWU9IkxheWVyIDIiPjxnIGlkPSJMYXllcl8xLTIiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMjQuOTMsMTIuODlhMiwyLDAsMCwwLTIuNDctMS40M2wtNC4yOCwxLjE1YTMzLjEsMzMuMSwwLDAsMC0yLjM2LTIuOTVMMjAuOSw0LjU4YTIsMiwwLDAsMCwuNTgtMS40MkEyLDIsMCwwLDAsMTgsMS43M2EuMzQuMzQsMCwwLDAsLjQ4LjQ4LDEuMzQsMS4zNCwwLDAsMSwuOTUtLjM5aDBhMS4zMywxLjMzLDAsMCwxLDEuMzQsMS4zNCwxLjMyLDEuMzIsMCwwLDEtLjM5Ljk0TDE1LjM0LDkuMThBMzIsMzIsMCwwLDAsMTIuNCw2LjgxbDEuMTQtNC4yN0EyLDIsMCwwLDAsMTIuMTEuMDcsMiwyLDAsMCwwLDkuNjUsMS40OWEuMzQuMzQsMCwwLDAsLjIzLjQyLjM0LjM0LDAsMCwwLC40Mi0uMjQsMS4zMywxLjMzLDAsMCwxLC42Mi0uODEsMS4zMiwxLjMyLDAsMCwxLDEuODMuNDksMS4zMywxLjMzLDAsMCwxLC4xNCwxTDExLjgsNi40MWMtMS4zMi0uODYtMi43LTEuNS0zLjYyLTEuMjdhMS4zNCwxLjM0LDAsMCwwLS45NCwxaDBMMCwyNC41NGEuMzMuMzMsMCwwLDAsLjA4LjM2LjMxLjMxLDAsMCwwLC4yNC4xbC4xMiwwTDE4LjksMTcuNzZoMGExLjMsMS4zLDAsMCwwLDEtLjk0Yy4yNC0uOS0uNDEtMi4yOS0xLjI3LTMuNjJsNC4wNi0xLjA5YTEuMzMsMS4zMywwLDAsMSwxLC4xNCwxLjMzLDEuMzMsMCwwLDEtLjMyLDIuNDUuMzQuMzQsMCwwLDAsLjA5LjY3bC4wOSwwYTIsMiwwLDAsMCwxLjQyLTIuNDZabS03LjYyLDQuNzYtMi42OSwxLjA2VjE2LjI3QTEwLjI3LDEwLjI3LDAsMCwwLDE3LjMxLDE3LjY1Wk0xMy45NCwxOWwtMi44MSwxLjFWMTMuM2EzLjgzLDMuODMsMCwwLDAsLjI4LjI5LDIyLjQ0LDIyLjQ0LDAsMCwwLDIuNTMsMi4yWm0tMy40OCwxLjM3LTIuODEsMS4xdi0xM2ExNi4zNCwxNi4zNCwwLDAsMCwyLjgxLDQuMVpNNywyMS43LDQuMTYsMjIuOHYtN2gwTDcsOC42NVpNMy40OSwxNy41NXY1LjUybC0yLjU2LDFabTE1LjcxLS45YS42NC42NCwwLDAsMS0uNTEuNDdjLS43NC4yMS0yLjI5LS4zNi00LjE4LTEuNzRsLS4wNiwwYTIzLjA5LDIzLjA5LDAsMCwxLTIuNTYtMi4yM2MtMy0zLTQuMzEtNS43NC00LTYuOGEuNzIuNzIsMCwwLDEsLjc0LS41NCw2Ljg1LDYuODUsMCwwLDEsMywxLjMzbC0uMzgsMS40MmEuMzQuMzQsMCwwLDAsLjY1LjE4bC4zMi0xLjJhMjYuNTIsMjYuNTIsMCwwLDEsMi42NiwyLjE1bC0uNjEuNjFjLS4zLjMuMTcuNzkuNDguNDhsLjYxLS42MWEyOS44NCwyOS44NCwwLDAsMSwyLjE0LDIuNjZsLTEuMTkuMzJhLjM0LjM0LDAsMCwwLC4xOC42NWwxLjQyLS4zOGMuODQsMS4yNywxLjQ5LDIuNTUsMS4zLDMuMjdaTTE1LjUxLDIuNDgsMTYsMWEuMzUuMzUsMCwwLDEsLjQzLS4yMi4zNC4zNCwwLDAsMSwuMjEuNDNsLS40OSwxLjUxYS4zMy4zMywwLDAsMS0uMzIuMjRsLS4xLDBBLjM0LjM0LDAsMCwxLDE1LjUxLDIuNDhabTUuMTMsNi4zYS4zNC4zNCwwLDAsMS0uMS40N2wtMS4zMy44N2EuMzQuMzQsMCwxLDEtLjM3LS41NmwxLjMzLS44N2EuMzQuMzQsMCwwLDEsLjQ3LjA5Wk0xNSw3YTEuMjIsMS4yMiwwLDAsMCwuODgtLjM3QTEuMjUsMS4yNSwwLDAsMCwxNSw0LjQ3YTEuMjksMS4yOSwwLDAsMC0uODkuMzZBMS4yNiwxLjI2LDAsMCwwLDE1LDdabS0uNDEtMS42NkEuNTguNTgsMCwwLDEsMTUsNS4xNGEuNi42LDAsMCwxLC40MS4xNy41OC41OCwwLDEsMS0uODIsMFptOC4yNCwxMS4xN2EuMzcuMzcsMCwwLDEtLjMuMTYuMzUuMzUsMCwwLDEtLjE3LDBMMjEsMTUuOGEuMzQuMzQsMCwwLDEtLjEyLS40Ni4zMy4zMywwLDAsMSwuNDYtLjEybDEuMzguNzlhLjM1LjM1LDAsMCwxLC4xMy40N1pNOC40LDIuNjVhLjM0LjM0LDAsMCwxLC4xMi0uNDZBLjM0LjM0LDAsMCwxLDksMi4zMWwuNzksMS4zOGEuMzMuMzMsMCwwLDEtLjI5LjVBLjM0LjM0LDAsMCwxLDkuMiw0Wk0yMiw4LjI4bDEuMzEuMzVoLjA5YS4zNC4zNCwwLDAsMCwuMzMtLjI1TDI0LDcuMDhhLjM2LjM2LDAsMCwwLDAtLjI1LjM0LjM0LDAsMCwwLS4yMS0uMTZsLTEuMzEtLjM1YS4zMy4zMywwLDAsMC0uNDEuMjRsLS4zNSwxLjMxYS4yOC4yOCwwLDAsMCwwLC4yNS4zMi4zMiwwLDAsMCwuMi4xNlptLjY4LTEuMjIuNjYuMTctLjE4LjY2LS42NS0uMThaIi8+PC9nPjwvZz48L3N2Zz4=",
        linkTo: "none",
        isDisplayEarnedCredits: true,
      },
      monthly_date: {
        icon: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNSAyNSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiMyNWQ4NzI7fTwvc3R5bGU+PC9kZWZzPjxnIGlkPSJMYXllcl8yIiBkYXRhLW5hbWU9IkxheWVyIDIiPjxnIGlkPSJMYXllcl8xLTIiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+PGcgaWQ9IkNhbGVuZGFyIj48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0yMi45MiwyLjVIMjAuODNWMS42N2ExLjY3LDEuNjcsMCwxLDAtMy4zMywwVjIuNUgxNC4xN1YxLjY3YTEuNjcsMS42NywwLDAsMC0zLjM0LDBWMi41SDcuNVYxLjY3YTEuNjcsMS42NywwLDEsMC0zLjMzLDBWMi41SDIuMDhBMi4wOCwyLjA4LDAsMCwwLDAsNC41OFYyMS4yNWEyLjA4LDIuMDgsMCwwLDAsMi4wOCwyLjA4SDEzLjc1YS40MS40MSwwLDAsMCwuNDItLjQxLjQyLjQyLDAsMCwwLS40Mi0uNDJIMi4wOEExLjI2LDEuMjYsMCwwLDEsLjgzLDIxLjI1VjguMzNIMjQuMTd2Ny4wOWEuNDEuNDEsMCwwLDAsLjQxLjQxLjQxLjQxLDAsMCwwLC40Mi0uNDFWNC41OEEyLjA4LDIuMDgsMCwwLDAsMjIuOTIsMi41Wm0tNC41OS0uODNhLjg1Ljg1LDAsMCwxLC44NC0uODQuODQuODQsMCwwLDEsLjgzLjg0djIuNWEuODMuODMsMCwwLDEtLjgzLjgzLjg0Ljg0LDAsMCwxLS44NC0uODNabS02LjY2LDBhLjgzLjgzLDAsMSwxLDEuNjYsMHYyLjVhLjgzLjgzLDAsMSwxLTEuNjYsMFpNNSwxLjY3QS44NC44NCwwLDAsMSw1LjgzLjgzYS44NS44NSwwLDAsMSwuODQuODR2Mi41QS44NC44NCwwLDAsMSw1LjgzLDUsLjgzLjgzLDAsMCwxLDUsNC4xN1pNMjQuMTcsNy41SC44M1Y0LjU4QTEuMjYsMS4yNiwwLDAsMSwyLjA4LDMuMzNINC4xN3YuODRhMS42NywxLjY3LDAsMCwwLDMuMzMsMFYzLjMzaDMuMzN2Ljg0YTEuNjcsMS42NywwLDAsMCwzLjM0LDBWMy4zM0gxNy41di44NGExLjY3LDEuNjcsMCwwLDAsMy4zMywwVjMuMzNoMi4wOWExLjI2LDEuMjYsMCwwLDEsMS4yNSwxLjI1WiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTExLjY3LDExLjI1YS44NC44NCwwLDAsMC0uODQtLjgzSDkuMTdhLjg0Ljg0LDAsMCwwLS44NC44M1YxMi41YS44NC44NCwwLDAsMCwuODQuODNoMS42NmEuODQuODQsMCwwLDAsLjg0LS44M1pNOS4xNywxMi41VjExLjI1aDEuNjZWMTIuNVoiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik02LjY3LDExLjI1YS44NC44NCwwLDAsMC0uODQtLjgzSDQuMTdhLjg0Ljg0LDAsMCwwLS44NC44M1YxMi41YS44NC44NCwwLDAsMCwuODQuODNINS44M2EuODQuODQsMCwwLDAsLjg0LS44M1pNNC4xNywxMi41VjExLjI1SDUuODNWMTIuNVoiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0yMC44MywxMy4zM2EuODQuODQsMCwwLDAsLjg0LS44M1YxMS4yNWEuODQuODQsMCwwLDAtLjg0LS44M0gxOS4xN2EuODQuODQsMCwwLDAtLjg0LjgzVjEyLjVhLjg0Ljg0LDAsMCwwLC44NC44M1ptLTEuNjYtMi4wOGgxLjY2VjEyLjVIMTkuMTdaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTEuNjcsMTVhLjg0Ljg0LDAsMCwwLS44NC0uODNIOS4xN2EuODQuODQsMCwwLDAtLjg0LjgzdjEuMjVhLjg0Ljg0LDAsMCwwLC44NC44M2gxLjY2YS44NC44NCwwLDAsMCwuODQtLjgzWm0tMi41LDEuMjVWMTVoMS42NnYxLjI1WiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTYuNjcsMTVhLjg0Ljg0LDAsMCwwLS44NC0uODNINC4xN2EuODQuODQsMCwwLDAtLjg0LjgzdjEuMjVhLjg0Ljg0LDAsMCwwLC44NC44M0g1LjgzYS44NC44NCwwLDAsMCwuODQtLjgzWm0tMi41LDEuMjVWMTVINS44M3YxLjI1WiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTEwLjgzLDE3LjkySDkuMTdhLjg0Ljg0LDAsMCwwLS44NC44M1YyMGEuODQuODQsMCwwLDAsLjg0LjgzaDEuNjZhLjg0Ljg0LDAsMCwwLC44NC0uODNWMTguNzVBLjg0Ljg0LDAsMCwwLDEwLjgzLDE3LjkyWk05LjE3LDIwVjE4Ljc1aDEuNjZWMjBaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTQuMTcsMTMuMzNoMS42NmEuODQuODQsMCwwLDAsLjg0LS44M1YxMS4yNWEuODQuODQsMCwwLDAtLjg0LS44M0gxNC4xN2EuODQuODQsMCwwLDAtLjg0LjgzVjEyLjVBLjg0Ljg0LDAsMCwwLDE0LjE3LDEzLjMzWm0wLTIuMDhoMS42NlYxMi41SDE0LjE3WiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTEzLjMzLDE2LjI1YS44NC44NCwwLDAsMCwuODQuODMuNDEuNDEsMCwwLDAsLjQxLS40MS40MS40MSwwLDAsMC0uNDEtLjQyVjE1aDEuNjZhLjQyLjQyLDAsMCwwLC40Mi0uNDIuNDEuNDEsMCwwLDAtLjQyLS40MUgxNC4xN2EuODQuODQsMCwwLDAtLjg0LjgzWiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTUuODMsMTcuOTJINC4xN2EuODQuODQsMCwwLDAtLjg0LjgzVjIwYS44NC44NCwwLDAsMCwuODQuODNINS44M0EuODQuODQsMCwwLDAsNi42NywyMFYxOC43NUEuODQuODQsMCwwLDAsNS44MywxNy45MlpNNC4xNywyMFYxOC43NUg1LjgzVjIwWiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTE5LjU4LDE0LjE3QTUuNDIsNS40MiwwLDEsMCwyNSwxOS41OCw1LjQxLDUuNDEsMCwwLDAsMTkuNTgsMTQuMTdabTAsMTBhNC41OSw0LjU5LDAsMSwxLDQuNTktNC41OUE0LjU5LDQuNTksMCwwLDEsMTkuNTgsMjQuMTdaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMjIsMTcuODRsLTMuMjQsMy4yNEwxNy4yOCwxOS42YS40Mi40MiwwLDAsMC0uNTksMCwuNDEuNDEsMCwwLDAsMCwuNThMMTguNDYsMjJBLjQxLjQxLDAsMCwwLDE5LDIybDMuNTQtMy41M2EuNDIuNDIsMCwwLDAtLjU5LS41OVoiLz48L2c+PC9nPjwvZz48L3N2Zz4=",
        linkTo: "none",
        isDisplayEarnedCredits: true,
      },
      product_review: {
        icon: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMS4zMyAyMCI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiMyNWQ4NzI7fS5jbHMtMntvcGFjaXR5OjAuMzt9PC9zdHlsZT48L2RlZnM+PGcgaWQ9IkxheWVyXzIiIGRhdGEtbmFtZT0iTGF5ZXIgMiI+PGcgaWQ9IkxheWVyXzEtMiIgZGF0YS1uYW1lPSJMYXllciAxIj48ZyBpZD0iSWNvbnMiPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTIuOTEsMTcuNDVINy41N2EuMzYuMzYsMCwwLDEsLjIzLjA5TDEwLDE5LjcyYTEsMSwwLDAsMCwxLjM3LDBsMi4xNy0yLjE3YS4zNC4zNCwwLDAsMSwuMjMtLjFoNC42N2EyLjkxLDIuOTEsMCwwLDAsMi45MS0yLjkxVjkuMzdhMi45MSwyLjkxLDAsMCwwLTEuNDYtMi41MWwtLjMyLjU2YTIuMjUsMi4yNSwwLDAsMSwxLjEzLDEuOTV2NS4xN2EyLjI2LDIuMjYsMCwwLDEtMi4yNiwyLjI2SDEzLjc1YTEsMSwwLDAsMC0uNjguMjlMMTAuOSwxOS4yNmEuMzMuMzMsMCwwLDEtLjQ3LDBMOC4yNiwxNy4wOGExLDEsMCwwLDAtLjY4LS4yOEgyLjkxQTIuMjYsMi4yNiwwLDAsMSwuNjUsMTQuNTRWOS4zN0EyLjI1LDIuMjUsMCwwLDEsMS43OCw3LjQybC0uMzMtLjU2QTIuOTIsMi45MiwwLDAsMCwwLDkuMzd2NS4xN2EyLjkxLDIuOTEsMCwwLDAsMi45MSwyLjkxWiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTMuNTUsMTQuODdINi4xNGExLDEsMCwwLDAsMS0xdi0uMzNoOC43MmEyLjkxLDIuOTEsMCwwLDAsMi45MS0yLjkxVjUuNDlhMS42MSwxLjYxLDAsMCwwLTEuNjEtMS42MUgxMy45YS4zMy4zMywwLDAsMS0uMzMtLjMzVjEuNjJhMS42MiwxLjYyLDAsMSwwLTMuMjMsMCwyLjIyLDIuMjIsMCwwLDEtLjY2LDEuNTksMi4yNiwyLjI2LDAsMCwxLTEuNi42N2gtMVYzLjU1YTEsMSwwLDAsMC0xLTFIMy41NWExLDEsMCwwLDAtMSwxVjEzLjlBMSwxLDAsMCwwLDMuNTUsMTQuODdabTIuOTEtMWEuMzIuMzIsMCwwLDEtLjMyLjMySDMuNTVhLjMzLjMzLDAsMCwxLS4zMi0uMzJWMTEuMzFhMS42MiwxLjYyLDAsMSwxLDMuMjMsMFpNOC4wOCw0LjUyYTIuOTIsMi45MiwwLDAsMCwyLjA2LS44NSwyLjg4LDIuODgsMCwwLDAsLjg1LTIsMSwxLDAsMSwxLDEuOTQsMFYzLjU1YTEsMSwwLDAsMCwxLDFoMy4yM2ExLDEsMCwwLDEsMSwxdjUuMTdhMi4yNywyLjI3LDAsMCwxLTIuMjcsMi4yN0g3LjExVjQuNTJabS00Ljg1LTFhLjMzLjMzLDAsMCwxLC4zMi0uMzJINi4xNGEuMzIuMzIsMCwwLDEsLjMyLjMyVjkuNzNhMi4yNiwyLjI2LDAsMCwwLTMuMjMsMFoiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik00Ljg1LDEwLjM0YTEsMSwwLDEsMCwxLDFBMSwxLDAsMCwwLDQuODUsMTAuMzRabTAsMS4yOWEuMzIuMzIsMCwxLDEsMC0uNjQuMzIuMzIsMCwwLDEsMCwuNjRaIi8+PC9nPjwvZz48L2c+PC9zdmc+",
        linkTo: "/collections/all",
        isDisplayEarnedCredits: true,
      },
      product_tag: {
        icon: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDcuNTYgMTg2Ljk5Ij48dGl0bGU+UHJvZHVjdCBUYWcgaWNvbjwvdGl0bGU+PHBhdGggZD0iTTE0OS43Myw5MWEzLjQ4LDMuNDgsMCwwLDEsMS4xNS00Ljc4aDBhMjAsMjAsMCwwLDAsOS0xMi4yOSwzLjQ4LDMuNDgsMCwwLDEsNi43NywxLjY0QTI2LjgsMjYuOCwwLDAsMSwxNTQuNTIsOTIuMSwzLjQ4LDMuNDgsMCwwLDEsMTQ5LjczLDkxWm01Ny44NC00Ny4xMmE0LjY1LDQuNjUsMCwwLDEtNC42NSw0LjY0SDE4Mi42OUwxODMuNzgsODBoMHYuNjRhMjguNzcsMjguNzcsMCwwLDEtMiwxMCwyNy40LDI3LjQsMCwwLDEtNS4yMiw4Ljc1TDk4Ljg4LDE4Mi41OGExNCwxNCwwLDAsMS0xOS43LjY5TDQuNDIsMTEzLjU2YTE0LDE0LDAsMCwxLS42OS0xOS43MUw4MS4zNywxMC42QTMwLjQsMzAuNCwwLDAsMSwxMDAuMjMsMkwxNTgsMGEzMC40NSwzMC40NSwwLDAsMSw5LjE1LDEuNTEsMjAuNzgsMjAuNzgsMCwwLDEsNy43NSw0LjE4LDE2LjQ5LDE2LjQ5LDAsMCwxLDIuODIsMy41OCwyNy4xNCwyNy4xNCwwLDAsMSwyLDQuMjMsMzAuMSwzMC4xLDAsMCwxLDIsOS40NmwuNTcsMTYuMjJoMjAuNTZhNC42NSw0LjY1LDAsMCwxLDQuNzIsNC41OHYuMTJabS0zNC4xOSw0LjY1SDE0Mi41MWE0LjY1LDQuNjUsMCwwLDEsMC05LjNoMzAuNTVsLS41NS0xNS44OWExOS43LDE5LjcsMCwwLDAtLjg3LTQuODIsMTkuNDgsMTkuNDgsMCwwLDAtMS44OS00LjQxLDcuNjYsNy42NiwwLDAsMC0xLjE5LTEuNTcsMTIuNDYsMTIuNDYsMCwwLDAtNC4yNi0yLjE0LDIxLjQ4LDIxLjQ4LDAsMCwwLTYuMzEtMWwtNTcuNDQsMmEyMC4zOSwyMC4zOSwwLDAsMC0xMi4zOCw1LjUzaDBMMTAuNTMsMTAwLjE5YTQuNjcsNC42NywwLDAsMCwuMjMsNi41N2w3NC43Niw2OS43MWE0LjY2LDQuNjYsMCwwLDAsNi41Ni0uMjNMMTY5LjcyLDkzYTE4LjcyLDE4LjcyLDAsMCwwLDMuMzQtNS43NiwxOS45NCwxOS45NCwwLDAsMCwxLjQ0LTYuNjdaTTk4LjY2LDcwLjRhMi45LDIuOSwwLDAsMC00LjEuMTRoMEw1Ny42NSwxMTAuMTNhMi45MiwyLjkyLDAsMCwwLDQuMjUsNGgwTDk4LjgxLDc0LjVhMi45LDIuOSwwLDAsMC0uMTUtNC4xWm0xMi44OSwxNkw3NC42NCwxMjZhMi45MSwyLjkxLDAsMCwwLDQuMjQsNEwxMTUuOCw5MC4zNWEyLjkyLDIuOTIsMCwxLDAtNC4yNS00Wm0xOS4zNy0zMy41NUExMSwxMSwwLDAsMSwxNDMuNTIsMzVhMi45MSwyLjkxLDAsMCwwLDIuNjYtNS4xNywxNi44NCwxNi44NCwwLDEsMCw0LjU5LDI2LjQ2LDIuOTIsMi45MiwwLDEsMC00LjI1LTRoMGExMSwxMSwwLDAsMS0xNS41NC42bC0uMDYtLjA1WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTAuMDEgMCkiIHN0eWxlPSJmaWxsOiMyNWQ4NzIiLz48L3N2Zz4=",
        linkTo: "none",
        isDisplayEarnedCredits: true,
      },
      referrer_friend: {
        icon: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNSAyNSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiMyNWQ4NzI7fTwvc3R5bGU+PC9kZWZzPjxnIGlkPSJMYXllcl8yIiBkYXRhLW5hbWU9IkxheWVyIDIiPjxnIGlkPSJMYXllcl8xLTIiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMjIuMiwxOC44YTIuNjgsMi42OCwwLDAsMCwxLjQxLTIuMzQsMi43NiwyLjc2LDAsMCwwLTUuNTIsMEEyLjY4LDIuNjgsMCwwLDAsMTkuNSwxOC44YTQuMTgsNC4xOCwwLDAsMC0yLjgsMy45MnYxLjg2YS40Mi40MiwwLDAsMCwuNDIuNDJoNy40NmEuNDIuNDIsMCwwLDAsLjQyLS40MlYyMi43MmE0LjE2LDQuMTYsMCwwLDAtMi44LTMuOTJabS0zLjI4LTIuMzRhMS45MywxLjkzLDAsMSwxLDEuOTMsMS44NkExLjksMS45LDAsMCwxLDE4LjkyLDE2LjQ2Wm01LjI1LDcuNzFIMTcuNTRWMjIuNzJhMy4zMiwzLjMyLDAsMCwxLDYuNjMsMFoiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0yMi4yMSw1YTIuNjcsMi42NywwLDAsMCwxLjQtMi4zNSwyLjc2LDIuNzYsMCwwLDAtNS41MiwwQTIuNjgsMi42OCwwLDAsMCwxOS41LDUsNC4xNCw0LjE0LDAsMCwwLDE2LjcsOXYxLjg3YS40MS40MSwwLDAsMCwuNDIuNDFoNy40NmEuNDEuNDEsMCwwLDAsLjQyLS40MVY5QTQuMTQsNC4xNCwwLDAsMCwyMi4yMSw1Wk0xOC45MiwyLjY5YTEuOTMsMS45MywwLDAsMSwzLjg2LDAsMS45MywxLjkzLDAsMCwxLTMuODYsMFptNS4yNSw3LjcxSDE3LjU0VjlhMy4zMiwzLjMyLDAsMCwxLDYuNjMsMFoiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xMy40MywxMi4zMmwyLjM1LTJhLjQyLjQyLDAsMCwwLDAtLjU5LjQxLjQxLDAsMCwwLS41OSwwbC0yLjYsMi4yNEg5LjdhLjQxLjQxLDAsMCwwLS40Mi40MS40Mi40MiwwLDAsMCwuNDIuNDJoMi45NGwyLjYsMi4xNGEuNDcuNDcsMCwwLDAsLjU5LS4wNi40MS40MSwwLDAsMC0uMDYtLjU5WiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTcuMzEsMTEuMzJhMy4xNywzLjE3LDAsMCwwLC43OC0yLjA3LDMuMjIsMy4yMiwwLDAsMC02LjQ0LDAsMy4xNywzLjE3LDAsMCwwLC43OCwyLjA3LDQuNTcsNC41NywwLDAsMC0yLjQzLDR2Mi40NWEuNDIuNDIsMCwwLDAsLjQyLjQyaDguOWEuNDIuNDIsMCwwLDAsLjQyLS40MlYxNS4zM0E0LjU5LDQuNTksMCwwLDAsNy4zMSwxMS4zMlpNNC44Nyw2LjlBMi4zNSwyLjM1LDAsMSwxLDIuNDksOS4yNSwyLjM3LDIuMzcsMCwwLDEsNC44Nyw2LjlabS0uNDUsNS41LjQ1LDAsLjQ1LDB2MS45NWwtLjQ1LjU3LS40NS0uNTdabTQuNDksNUg3LjZ2LTJhLjQyLjQyLDAsMCwwLS44NCwwdjJIM3YtMmEuNDIuNDIsMCwwLDAtLjg0LDB2MkguODN2LTJhMy43NiwzLjc2LDAsMCwxLDIuMjktMy40MSwzLjUsMy41LDAsMCwwLC40Ny4yNXYyLjQ2bDEsMS4yMmEuNDEuNDEsMCwwLDAsLjY2LDBsMS0xLjIyVjEyLjE3YTMuNSwzLjUsMCwwLDAsLjQ3LS4yNSwzLjc2LDMuNzYsMCwwLDEsMi4yOSwzLjQxdjJaIi8+PC9nPjwvZz48L3N2Zz4=",
        linkTo: "none",
        isDisplayEarnedCredits: true,
      },
      referee_friend: {
        icon: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNSAyNSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiMyNWQ4NzI7fTwvc3R5bGU+PC9kZWZzPjxnIGlkPSJMYXllcl8yIiBkYXRhLW5hbWU9IkxheWVyIDIiPjxnIGlkPSJMYXllcl8xLTIiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTAuOTQsMTIuNWEuNzUuNzUsMCwwLDAtLjcxLS43OGgtMnYtLjM5YS43OS43OSwwLDAsMC0uNzktLjc4aC0yYS43NC43NCwwLDAsMC0uNy43OFYxMi41aDBhMS41NywxLjU3LDAsMCwwLDAsMy4xM2guMDhBMi41MSwyLjUxLDAsMCwwLDcuMiwxNy41OEg4LjQ1YTIuNTEsMi41MSwwLDAsMCwyLjQzLTEuOTVoLjA2YTEuNTcsMS41NywwLDAsMCwwLTMuMTNaTTQuNjksMTQuODRhLjc4Ljc4LDAsMCwxLDAtMS41NlptNS40Ny4yM0ExLjczLDEuNzMsMCwwLDEsOC40NSwxNi44SDcuMmExLjczLDEuNzMsMCwwLDEtMS43MS0xLjczVjExLjMzSDcuNDF2LjM5YS43OC43OCwwLDAsMCwuNzguNzhoMlptLjc4LS4yM1YxMy4yOGEuNzguNzgsMCwxLDEsMCwxLjU2WiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTEyLjQ3LDguMjhhLjc4Ljc4LDAsMCwwLS44Mi0uMDdsLS41NC4yOS0uMjYtLjM4YTEuNTYsMS41NiwwLDAsMC0xLjMtLjdINy4wNWExLjU0LDEuNTQsMCwwLDAtMS4zOS44Ny44NS44NSwwLDAsMC0uMDkuMjJsLS4wOC0uMDhhLjc5Ljc5LDAsMCwwLS41NS0uMjNINC4zMkExLjIsMS4yLDAsMCwwLDMuMTMsOS4zOHYyLjM0YS4zOS4zOSwwLDAsMCwuMzkuMzkuNC40LDAsMCwwLC4zOS0uMzlWOS4zOEEuNDIuNDIsMCwwLDEsNC4zMiw5aC42MmwuNjcuNjdhLjM4LjM4LDAsMCwwLC42Ni0uMjcsMS41OSwxLjU5LDAsMCwxLC4wOS0uNzUuNzguNzgsMCwwLDEsLjY5LS40M2gyLjVhLjc3Ljc3LDAsMCwxLC42NS4zNWwuMjYuMzhhLjc5Ljc5LDAsMCwwLDEsLjI3TDEyLDguOTFsLS4yNiwxLjU3YS4xNS4xNSwwLDAsMCwwLC4wN3YxLjE3YS40LjQsMCwwLDAsLjM5LjM5LjM5LjM5LDAsMCwwLC4zOS0uMzlWMTAuNThMMTIuNzgsOWEuNzcuNzcsMCwwLDAtLjMxLS43NloiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik02LjY0LDEzLjI4YS40LjQsMCwxLDEtLjM5LjM5QS4zOS4zOSwwLDAsMSw2LjY0LDEzLjI4WiIvPjxjaXJjbGUgY2xhc3M9ImNscy0xIiBjeD0iOC45OCIgY3k9IjEzLjY3IiByPSIwLjM5Ii8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNOC4zMiwxNWwtLjEyLjExYS41Ni41NiwwLDAsMS0uNzgsMEw3LjMxLDE1YS4zOS4zOSwwLDAsMC0uNTYuNTVsLjEyLjEyYTEuMzgsMS4zOCwwLDAsMCwuOTQuMzksMS40LDEuNCwwLDAsMCwxLS4zOWwuMTEtLjEyQS4zOS4zOSwwLDAsMCw4LjMyLDE1WiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTI0LjA5LDEwLjI5YTMuMTIsMy4xMiwwLDAsMC01LjMxLDEuODJIMTUuNjFhNy44NSw3Ljg1LDAsMCwwLTItNC44M0wxNS4zLDUuNTlhMy4xMiwzLjEyLDAsMSwwLTEuMjEtMi40NkEzLjA1LDMuMDUsMCwwLDAsMTQuNzUsNUwxMy4wNiw2LjczYTcuODEsNy44MSwwLDEsMCwwLDExLjU0TDE0Ljc1LDIwYTMuMDYsMy4wNiwwLDAsMC0uNjYsMS45MiwzLjEzLDMuMTMsMCwxLDAsMS4yMS0yLjQ3bC0xLjY5LTEuNjlhNy44NSw3Ljg1LDAsMCwwLDItNC44M2gzLjE3YTMuMTEsMy4xMSwwLDAsMCwzLjEsMi43NCwzLjEzLDMuMTMsMCwwLDAsMi4yMS01LjM0Wk0xNy4yMS43OGEyLjM1LDIuMzUsMCwxLDEtMi4zNCwyLjM1QTIuMzUsMi4zNSwwLDAsMSwxNy4yMS43OFptMCwxOC43NWEyLjM1LDIuMzUsMCwxLDEtMi4zNCwyLjM1QTIuMzUsMi4zNSwwLDAsMSwxNy4yMSwxOS41M1ptLTkuNCwwYTcsNywwLDEsMSw3LTcsNyw3LDAsMCwxLTcsN1ptMTUuNzItNS4zN2EyLjM0LDIuMzQsMCwxLDEsMC0zLjMyQTIuMzUsMi4zNSwwLDAsMSwyMy41MywxNC4xNloiLz48L2c+PC9nPjwvc3ZnPg==",
        linkTo: "none",
        isDisplayEarnedCredits: false,
      },
      referrals_total_number: {
        icon: "PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzNTYuNSAzNTYuNSI+PHRpdGxlPkVhcm4gY3JlZGl0IG9uIG51bWJlciBvZiByZWZlcnJhbHM8L3RpdGxlPjxwYXRoIGlkPSJMYXllcl8yIiBkYXRhLW5hbWU9IkxheWVyIDIiIGQ9Ik0zMzMuNzgsMjAzLjI5YTE4LDE4LDAsMCwwLTIuOS4xNmwtMzAuNTktNDAuNzFhNjYuMTEsNjYuMTEsMCwwLDAsMjEuNTctNDVsMzcuMjYsMThhMjEuMjUsMjEuMjUsMCwwLDAtMS42NSw4LjMxLDIzLjc3LDIzLjc3LDAsMSwwLDIzLjc3LTIzLjc3aDBhMjIuNDYsMjIuNDYsMCwwLDAtMTUuMTQsNS41N2gtLjE2TDMyMS4wNywxMDQuM2E2NS4yOCw2NS4yOCwwLDAsMC0xMjkuNzQsNy4yMmwtMzUuMTQsMzBhNjQuOTEsNjQuOTEsMCwwLDAtMzYuMTYtMTVWOTUuNjdhMjMuNDMsMjMuNDMsMCwwLDAsMTcuODEtMjIuOSwyMy43NywyMy43NywwLDAsMC00Ny41MywwaDBhMjMuNDMsMjMuNDMsMCwwLDAsMTcuODEsMjIuOXYzMWE2NS4yNCw2NS4yNCwwLDEsMCw3MC4yOCw3Ni4xNmwyNi42NywyMC44NmEyNy40LDI3LjQsMCwwLDAtMS44LDkuMzNBMjMuNzcsMjMuNzcsMCwxLDAsMjI3LDIwOS4yNWgtLjA4YTIyLjkxLDIyLjkxLDAsMCwwLTE0LjQzLDVsLTMzLjM0LTI2YTY0LjgxLDY0LjgxLDAsMCwwLTE0Ljc1LTM4LjM2bDI4LTIzLjY5QTY0LjQzLDY0LjQzLDAsMCwwLDIyMi43MSwxNzBhMTIsMTIsMCwwLDAsMS4yNi44Niw1OSw1OSwwLDAsMCw3Ljc3LDMuNzcsMzAsMzAsMCwwLDAsNCwxLjQxLDM2LjQsMzYuNCwwLDAsMCw0LjE2LDEuMjYsMjQuNDQsMjQuNDQsMCwwLDAsNC4xNi44NiwzNS4zNSwzNS4zNSwwLDAsMCw0LjE2LjcxYzEuNDEuMTYsMi42Ny4zOSw0LjE2LjU1aDguNzljMS40MS0uMTYsMi42Ny0uMzEsNC4xNi0uNTVhNjUuNjUsNjUuNjUsMCwwLDAsMTYuMzktNC4zMSwzNS40NywzNS40NywwLDAsMCwzLjkyLTEuOCw0Mi4zLDQyLjMsMCwwLDAsMy43Ny0yLDQuMyw0LjMsMCwwLDAsMS40MS0xLjI2bC4xNi4zOSwyNi42NywzNS40NWE2NS40NCw2NS40NCwwLDAsMC00OS4xOCw2My4yMiw2Mi40OCw2Mi40OCwwLDAsMCwzLjYxLDIxLjF2LjE2bC0yMy43NywxNy44MUE2NS4zMiw2NS4zMiwwLDAsMCwxMjYuMzksMzM0SDk1LjMzYTIzLjQzLDIzLjQzLDAsMCwwLTIyLjktMTcuODFBMjMuNzcsMjMuNzcsMCwxLDAsOTUuMjUsMzQ2aDMxYTY0LjM5LDY0LjM5LDAsMCwwLDMwLjgzLDQ5LjQ5Yy4xNiwwLC4xNiwwLC4xNi4xNmEzMS45MSwzMS45MSwwLDAsMCwyLjksMS42NSwyMy42NCwyMy42NCwwLDAsMCw0LjQ3LDIuMmMxLjI2LjU1LDIuNTEsMS4xLDMuOTIsMS42NWExMiwxMiwwLDAsMCwzLjIyLDEuMSwyMi43MywyMi43MywwLDAsMCwzLjc3LDEuMSw1NS41Myw1NS41MywwLDAsMCwxNS42OSwyLDU2LjgxLDU2LjgxLDAsMCwwLDE1LjQ1LTJjLjg2LS4xNiwxLjY1LS4zOSwyLjUxLS41NWEzNy4yNywzNy4yNywwLDAsMCw2LjI4LTIuMiw3LjQ1LDcuNDUsMCwwLDAsMS42NS0uNzEsNDMuNDIsNDMuNDIsMCwwLDAsNi42Ny0zLjIyLDcuMTEsNy4xMSwwLDAsMCwxLjI2LS44Niw2NC4yNCw2NC4yNCwwLDAsMCwyOS44OC00MWwzOC43NSwxOC43NWExOS43NSwxOS43NSwwLDAsMC0xLjU3LDguMjRBMjMuNzcsMjMuNzcsMCwxLDAsMzE1LjgyLDM1OGgwYTIxLjgxLDIxLjgxLDAsMCwwLTE1LjE0LDUuOGwtNDQuMzItMjEuNDFhNi43Nyw2Ljc3LDAsMCwwLC4xNi0yLjIsNjMuMzgsNjMuMzgsMCwwLDAtMy42MS0yMS4yNmwyMy45Mi0xNy44MWE2NS4yOSw2NS4yOSwwLDEsMCwxMTMuNS02NC41NSw2NC41LDY0LjUsMCwwLDAtNTYuNTUtMzMuMjZabTU5LjM4LTU5LjIyYTExLjkyLDExLjkyLDAsMSwxLTQuMzEtOS4xOCwxMS44NSwxMS44NSwwLDAsMSw0LjMxLDkuMThaTTIxNy40NiwyMjUuOGExMS43OCwxMS43OCwwLDAsMSw5LjU3LTQuNzEsMTEuODksMTEuODksMCwwLDEsMCwyMy43NywxMS42OCwxMS42OCwwLDAsMS0xMS44NC0xMS42MVYyMzNhMTIsMTIsMCwwLDEsMi4yNy03LjIyWm0tMTE1LjIzLTE1M2ExMS44NCwxMS44NCwwLDEsMSwxMS44NCwxMS45MkExMi4wNiwxMi4wNiwwLDAsMSwxMDIuMjMsNzIuNzdabTY1LjM0LDExOC42OHYuMTZhNTMuNSw1My41LDAsMCwxLTEwNy0uMTZjMC0yOS4zNCwyNC4xNi01My4yNiw1My40OS01My4yNmE1Mi45NCw1Mi45NCwwLDAsMSwzNy40MSwxNS4zbC4zOS4zOWE1Mi4xMiw1Mi4xMiwwLDAsMSwxNS42OSwzNy41N1pNMjkyLjIxLDE1NmE1LjQ5LDUuNDksMCwwLDAtMy40NSwxLjFsLS4xNi4xNmE0Ni4xNSw0Ni4xNSwwLDAsMS04LjMxLDQuODZjLS44Ni41NS0xLjguODYtMi42NywxLjQxYTU0LjMzLDU0LjMzLDAsMCwxLTE1LjY5LDRjLTEuNzMuMjQtMy40NS4zMS01LjI2LjM5YTQxLjg2LDQxLjg2LDAsMCwxLTUuNDEtLjM5LDQ5LjcyLDQ5LjcyLDAsMCwxLTE1LjY5LTRjLS44Ni0uNTUtMS44LS44Ni0yLjktMS40MUE0Mi4xNSw0Mi4xNSwwLDAsMSwyMjEsMTU0LjE5YTUzLjM4LDUzLjM4LDAsMSwxLDcxLjE0LDBaTTcyLjUsMzUxLjg1QTExLjg0LDExLjg0LDAsMSwxLDg0LjQyLDM0MCwxMS45NCwxMS45NCwwLDAsMSw3Mi41LDM1MS44NVpNMjI3LDM3OS43N2E1Ni43OSw1Ni43OSwwLDAsMS0xMS44NCw3LjkyLDI1LDI1LDAsMCwxLTUuOCwyLjM1LDM4LjU2LDM4LjU2LDAsMCwxLTExLjg0LDIuOSwzNS42MSwzNS42MSwwLDAsMS0xMi4yNCwwLDM2LjQ0LDM2LjQ0LDAsMCwxLTExLjg0LTIuOSwxOC4zOSwxOC4zOSwwLDAsMS01LjczLTIuMzUsNTAuMDksNTAuMDksMCwwLDEtMTEuOTItNy45Miw1My41LDUzLjUsMCwxLDEsNzUuNTQtNC4yNGMtMS40MSwxLjQ5LTIuODIsMi45LTQuMzEsNC4yNFptNzkuMjItNS4xOGExMi4xMSwxMi4xMSwwLDAsMSw5LjczLTQuODYsMTEuODgsMTEuODgsMCwxLDEsLjA4LDIzLjc3aDBhMTIuMDcsMTIuMDcsMCwwLDEtMTEuOTItMTEuOTIsMTEuNjQsMTEuNjQsMCwwLDEsMi4xMi03Wm02My4yMi02Ni4xMmE0OC40Nyw0OC40NywwLDAsMS0xNC43NSw5LjMzLDUzLjE0LDUzLjE0LDAsMCwxLTIwLjg2LDQuMzFBNTQuMjcsNTQuMjcsMCwwLDEsMzEzLDMxNy44MWE1MS42Nyw1MS42NywwLDAsMS0xNC43NS05LjMzLDU2LjA4LDU2LjA4LDAsMCwxLTEzLjMzLTE4LjM1LDUzLjQ2LDUzLjQ2LDAsMSwxLDg0LjU2LDE4LjM1Wk0xOTEuMzQsMjk4LjM1YTIzLjc3LDIzLjc3LDAsMSwwLDIzLjc3LDIzLjc3aDBBMjMuOSwyMy45LDAsMCwwLDE5MS4zNCwyOTguMzVabTAsMzUuNjlhMTEuODQsMTEuODQsMCwxLDEsMTEuODQtMTEuODRBMTEuODMsMTEuODMsMCwwLDEsMTkxLjM0LDMzNFptMTcuMSwyMy43N0gxNzQuMDhjLTEwLjEyLDAtMTguMzUsNy45Mi0xOC4zNSwxNy44MXY0LjE2YTQ3LjE0LDQ3LjE0LDAsMCwwLDExLjkyLDcuOTJWMzc1LjYyYTYuMyw2LjMsMCwwLDEsNi41MS02aDM0LjM2YzMuNjEsMCw2LjY3LDIuNjcsNi42Nyw2djEyLjA4QTU2Ljc5LDU2Ljc5LDAsMCwwLDIyNywzNzkuNzd2LTQuMTZDMjI2Ljk1LDM2NS43MywyMTguNzEsMzU3LjgxLDIwOC40MywzNTcuODFabS0xMSwzNS4xNEEzNi40NCwzNi40NCwwLDAsMCwyMDkuMywzOTBhNTUuNjEsNTUuNjEsMCwwLDEtMTEuODQsMi45Wm0tMTIuMjQsMGEzNS42MSwzNS42MSwwLDAsMCwxMi4yNCwwLDc5LjY1LDc5LjY1LDAsMCwxLTEyLjI0LDBaTTE3My4yOSwzOTBhMzguNTYsMzguNTYsMCwwLDAsMTEuODQsMi45LDU2Ljc5LDU2Ljc5LDAsMCwxLTExLjg0LTIuOVptLTE2LDUuNTdhMi43OSwyLjc5LDAsMCwwLDEuMjYuODYsNS4yMyw1LjIzLDAsMCwwLDEuNjUuNzEsMjUuMjgsMjUuMjgsMCwwLDEtMi45LTEuNTdabTEzMy40Mi0yMjZhNC4zLDQuMywwLDAsMS0xLjQxLDEuMjZBNS40OCw1LjQ4LDAsMCwxLDI5MSwxNzBabS0yLTEyLjYzYTYsNiwwLDAsMSwzLjQ1LTEuMXYtMS44YTM3LjY0LDM3LjY0LDAsMCwxLTMuNDUsMi45Wk0yNTYuNiw3Mi43N2EyMy43NywyMy43NywwLDEsMCwyMy43NywyMy43N2gwQTIzLjgsMjMuOCwwLDAsMCwyNTYuNiw3Mi43N1ptMCwzNS42MWExMS44OCwxMS44OCwwLDEsMSwxMS45Mi0xMS45MiwxMS44NSwxMS44NSwwLDAsMS0xMS45MiwxMS45MlptLTUuMzMsNTkuMTRjMS44LjE2LDMuNjEuMzksNS40MS4zOWEzOS40OSwzOS40OSwwLDAsMCw1LjI2LS4zOUE2MC41Nyw2MC41NywwLDAsMSwyNTEuMjYsMTY3LjUyWm0yMi41MS0zNS4zSDIzOS40MmMtMTAuMjgsMC0xOC4zNSw3LjkyLTE4LjM1LDE3LjgxdjQuMTZhNDIuMTUsNDIuMTUsMCwwLDAsMTEuNjksNy45MlYxNTBjMC0zLjIyLDMuMDYtNiw2LjY3LTZoMzQuNDNhNi4yNCw2LjI0LDAsMCwxLDYuNTEsNnYxMi4wOGE0OSw0OSwwLDAsMCw4LjMxLTQuODZsLjE2LS4xNmE2LDYsMCwwLDEsMy40NS0xLjF2LTZhMTguMywxOC4zLDAsMCwwLTE4LjUxLTE3LjgxWm0tMTY0LjY0LDc4LjJWMjA1YTIzLjQ0LDIzLjQ0LDAsMCwxLTkuNzMtMi40M2wxLjczLTYuNjdhMjEuMTQsMjEuMTQsMCwwLDAsOS40OSwyLjUxYzMuMjksMCw1LjQ5LTEuMjYsNS40OS0zLjUzcy0xLjgtMy41My02LTQuOTRjLTYuMTItMi0xMC4yOC00Ljk0LTEwLjI4LTEwLjQzLDAtNSwzLjUzLTguOTQsOS42NS0xMC4ydi01LjQxSDExNXY1YTIxLjQ2LDIxLjQ2LDAsMCwxLDguMzEsMS44OGwtMS42NSw2LjQzYTE5LDE5LDAsMCwwLTguMjQtMmMtMy42OSwwLTQuOTQsMS41Ny00Ljk0LDMuMjIsMCwxLjg4LDIsMy4wNiw2LjksNC45NCw2LjgyLDIuNDMsOS41Nyw1LjU3LDkuNTcsMTAuNzVzLTMuNjEsOS40MS0xMC4yLDEwLjU5djUuOGgtNS42NVptMjE5LjcsODFWMjg2YTIzLjQ0LDIzLjQ0LDAsMCwxLTkuNzMtMi40M2wxLjczLTYuNjdhMjEuMTQsMjEuMTQsMCwwLDAsOS40OSwyLjUxYzMuMjIsMCw1LjQ5LTEuMjYsNS40OS0zLjUzcy0xLjgtMy41My02LTVjLTYuMTItMi0xMC4yOC00Ljk0LTEwLjI4LTEwLjQzLDAtNSwzLjUzLTksOS42NS0xMC4ydi01LjQxaDUuNTd2NWEyMS40NiwyMS40NiwwLDAsMSw4LjMxLDEuODhsLTEuNjUsNi40M2ExOSwxOSwwLDAsMC04LjI0LTJjLTMuNjksMC00Ljk0LDEuNTctNC45NCwzLjIyLDAsMS44OCwyLDMuMDYsNi45LDQuOTQsNi44MiwyLjQzLDkuNTcsNS41Nyw5LjU3LDEwLjY3cy0zLjYxLDkuNDEtMTAuMiwxMC41OXY1LjhoLTUuNjVaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNDguNSAtNDkpIiBzdHlsZT0iZmlsbDojMjVkODcyIi8+PC9zdmc+",
        linkTo: "none",
        isDisplayEarnedCredits: true,
      },
      referrals_order_number: {
        icon: "PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NTcgMTg3LjI0Ij48dGl0bGU+Q3JlZGl0IG9uIHJlZmVycmFsX3MgWCBvcmRlcjwvdGl0bGU+PHBhdGggaWQ9IkxheWVyXzIiIGRhdGEtbmFtZT0iTGF5ZXIgMiIgZD0iTTQyOC45LDg1LjFhNy41NSw3LjU1LDAsMSwxLTEyLjEtNlY2MC45YTEzLjYsMTMuNiwwLDAsMC0yNy4yLDBWNzlhNy40Myw3LjQzLDAsMCwxLDEuNiwxMC41LDcuNjcsNy42NywwLDAsMS02LjEsMy4xLDcuNTEsNy41MSwwLDAsMS03LjctNy40LDcuMiw3LjIsMCwwLDEsMy4xLTYuMlY2MC45YTIyLjcxLDIyLjcxLDAsMCwxLDQ1LjQsMFY3OUE3Ljg3LDcuODcsMCwwLDEsNDI4LjksODUuMVptMTEuNC0yMi43SDQyOC45djloMy44TDQ0Ni4yLDE0N0gzNjAuMWwxMy41LTc1LjVoMy44di05SDM2NkwzNDkuMywxNTZINDU3LjFabS00Ny43LDB2OWgyMS4ydi05Wm0tMTk1LjMsNTAtMjguOCwyOC44LTguNy04LjYsMTQuNC0xNC4zSDE2My42QTI2LjU5LDI2LjU5LDAsMCwwLDEzNywxNDQuOXYxMS42SDEyNC43VjE0NC44YTM4Ljg0LDM4Ljg0LDAsMCwxLDM4LjktMzguN2gxMEwxNTkuOSw5Mi40bDguNy04LjZaTTE2NC4xLDQ1LjJhNDUuMyw0NS4zLDAsMCwxLTQ1LjMsNDUuMiw2Ni41Niw2Ni41NiwwLDAsMC00NC43LDE3LjNBNDUuNzgsNDUuNzgsMCwwLDAsNjMuNCwxMDEsNzksNzksMCwwLDEsOTMuMSw4Mi40YTQ1LjIsNDUuMiwwLDEsMSw3MS0zNy4yWm0tMTIuMiwwYTMzLjEsMzMuMSwwLDEsMC0zMy4yLDMzaC4xQTMzLjE4LDMzLjE4LDAsMCwwLDE1MS45LDQ1LjJabTIwMC4yLDBhNDUuMyw0NS4zLDAsMCwxLTQ1LjMsNDUuMiw2Ni4xNyw2Ni4xNywwLDAsMC02Ni4yLDY2SDIyOC40YTc4LjI5LDc4LjI5LDAsMCwxLDUyLjgtNzMuOSw0NS4yOCw0NS4yOCwwLDEsMSw3MC45LTM3LjNabS0xMi4yLDBhMzMuMSwzMy4xLDAsMSwwLTMzLjIsMzNoLjFBMzMuMTgsMzMuMTgsMCwwLDAsMzM5LjksNDUuMlpNOTAuMSwxNDIuMWE0NSw0NSwwLDEsMS0xNi0zNC4zQTQ0LjQ3LDQ0LjQ3LDAsMCwxLDkwLjEsMTQyLjFabS0zMC44LDUuM2E5LjQ1LDkuNDUsMCwwLDAtNC40LTguNCwyMi4yOSwyMi4yOSwwLDAsMC01LjYtMi43LDIxLjI0LDIxLjI0LDAsMCwxLTUuNy0yLjcsMywzLDAsMCwxLTEuNS0yLjRjMC0xLjQuOS0yLjgsMy41LTMuMmE5LjcsOS43LDAsMCwxLDEuNy0uMSwxOS43MywxOS43MywwLDAsMSw4LjYsMmwxLjctNi43YTIxLjcxLDIxLjcxLDAsMCwwLTguNy0yVjExNkg0My4xdjUuN0MzNi43LDEyMi45LDMzLDEyNywzMywxMzIuM2MwLDUuMSwzLjQsOCw4LjUsMTAuMS43LjMsMS40LjUsMi4yLjgsNC40LDEuNSw2LjMsMi45LDYuMyw1LjJzLTIuMywzLjctNS43LDMuN2ExNy4yMiwxNy4yMiwwLDAsMS0zLjktLjQsMjEuNjUsMjEuNjUsMCwwLDEtNi0yLjJsLTEuOCw3YTIzLjY1LDIzLjY1LDAsMCwwLDEwLjEsMi42djUuNmg1Ljl2LTYuMWM3LTEuNCwxMC43LTUuOSwxMC43LTExLjJaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMC4xIDAuMDQpIiBzdHlsZT0iZmlsbDojMjVkODcyIi8+PC9zdmc+",
        linkTo: "none",
        isDisplayEarnedCredits: true,
      },
      referrals_total_spent: {
        icon: "PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzODUuMzQgMTg3LjMiPjx0aXRsZT5FYXJuIGNyZWRpdCBvbiByZWZlcnJhbF9zIHNwZW50PC90aXRsZT48cGF0aCBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIiBkPSJNMTY4LjQsODMuN2wtOC43LDguNkwxNzMuNCwxMDZoLTEwYTM4LjkyLDM4LjkyLDAsMCwwLTM4LjksMzguOHYxMS42aDEyLjNWMTQ0LjhhMjYuNzIsMjYuNzIsMCwwLDEsMjYuNi0yNi42SDE3NGwtMTQuNCwxNC4zLDguNyw4LjYsMjguOC0yOC44Wk0xMTguOCwwQTQ1LjEyLDQ1LjEyLDAsMCwwLDkzLjEsODIuNCw3OS40Nyw3OS40NywwLDAsMCw2My40LDEwMWE0NS4wNyw0NS4wNywwLDEsMCwxMC43LDYuNyw2NS45LDY1LjksMCwwLDEsNDQuNy0xNy4zLDQ1LjIsNDUuMiwwLDAsMCwwLTkwLjRabS03MCwxNTguNHY2LjFINDIuOXYtNS43YTIzLjY1LDIzLjY1LDAsMCwxLTEwLjEtMi42bDEuOC03YTIxLjY1LDIxLjY1LDAsMCwwLDYsMi4yLDE3LjIyLDE3LjIyLDAsMCwwLDMuOS40YzMuNCwwLDUuNy0xLjMsNS43LTMuN3MtMS45LTMuNy02LjMtNS4yYy0uOC0uMy0xLjUtLjUtMi4yLS44LTUuMi0yLjEtOC41LTUtOC41LTEwLjFzMy43LTkuMywxMC4xLTEwLjZ2LTUuNkg0OVYxMjFhMjIuMSwyMi4xLDAsMCwxLDguNywyTDU2LDEyOS43YTE5LjczLDE5LjczLDAsMCwwLTguNi0yLDkuNyw5LjcsMCwwLDAtMS43LjFjLTIuNi40LTMuNSwxLjgtMy41LDMuMmEzLDMsMCwwLDAsMS41LDIuNCwyOS43NCwyOS43NCwwLDAsMCw1LjcsMi43LDI4LjksMjguOSwwLDAsMSw1LjYsMi43LDkuNDUsOS40NSwwLDAsMSw0LjQsOC40Yy0uMSw1LjUtMy44LDEwLTEwLjYsMTEuMlptNzAtODAuMmEzMywzMywwLDEsMSwzMy4xLTMzLDMzLDMzLDAsMCwxLTMzLjEsMzNabTIzNy43LDUuNS04LjcsOC42TDM2MS41LDEwNmgtMTBhMzguOTIsMzguOTIsMCwwLDAtMzguOSwzOC44djExLjZoMTIuMlYxNDQuOGEyNi43MiwyNi43MiwwLDAsMSwyNi42LTI2LjZIMzYybC0xNC40LDE0LjMsOC43LDguNiwyOC45LTI4LjhaTTMwNi44LDBhNDUuMTksNDUuMTksMCwwLDAtMjUuNiw4Mi41LDc4LjUyLDc4LjUyLDAsMCwwLTUyLjgsNzMuOWgxMi4yYTY2LjE3LDY2LjE3LDAsMCwxLDY2LjItNjYsNDUuMiw0NS4yLDAsMSwwLDAtOTAuNFptMCw3OC4yYTMzLDMzLDAsMSwxLDMzLjEtMzNBMzMsMzMsMCwwLDEsMzA2LjgsNzguMloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMTQgMCkiIHN0eWxlPSJmaWxsOiMyNWQ4NzIiLz48L3N2Zz4=",
        linkTo: "none",
        isDisplayEarnedCredits: true,
      },
      add_product_to_wishlist: {
        icon: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNS45OSAyNC41Ij48dGl0bGU+d2lzaGxpc3RfaWNvbjwvdGl0bGU+PHBhdGggZD0iTTE3LjIyLjI1aDBhMy4yOCwzLjI4LDAsMCwwLTIsLjY1QTMuMjUsMy4yNSwwLDAsMCwxMy4zLjI1aDBBMy4yOCwzLjI4LDAsMCwwLDExLDUuODVsMS4yNiwxLjI2YTEuNiwxLjYsMCwwLDAtLjE5Ljc1VjExLjNhMS42MSwxLjYxLDAsMCwwLTIuMTUuMzMsMS42MSwxLjYxLDAsMCwwLTIuODMuNjYsMS42MSwxLjYxLDAsMCwwLS45NC0uM2gwYTEuNjUsMS42NSwwLDAsMC0xLjYxLDEuNjR2NC41MWE0LjE5LDQuMTksMCwwLDAsLjU1LDIuMDhMNi40MiwyMi42djEuNzlhLjM2LjM2LDAsMCwwLC43MiwwVjIyLjVhLjM2LjM2LDAsMCwwLDAtLjE4TDUuNjgsMTkuODZhMy40OCwzLjQ4LDAsMCwxLS40Ni0xLjcyVjEzLjYzYS45Mi45MiwwLDAsMSwuOS0uOTJoMGEuOS45LDAsMCwxLC45Ljg0djEuMzlhLjM2LjM2LDAsMSwwLC43MiwwVjEyLjY0YS45LjksMCwxLDEsMS43OSwwaDB2Mi4yN2EuMzYuMzYsMCwxLDAsLjcyLDBWMTIuNjdoMGEuOS45LDAsMCwxLDEuNzksMHYyLjNhLjM2LjM2LDAsMCwwLC43MiwwVjcuODZhLjkuOSwwLDAsMSwxLjc5LDB2OWEuMzYuMzYsMCwxLDAsLjcyLDBWMTQuNGExLjA4LDEuMDgsMCwwLDEsMS4xNSwxLjA3VjE4YTMuNDYsMy40NiwwLDAsMS0uNTQsMS44NmwtMS41MywyLjQxYS4zNi4zNiwwLDAsMC0uMDYuMTl2MS44OWEuMzYuMzYsMCwxLDAsLjcyLDBWMjIuNjFsMS40Ny0yLjMyQTQuMTgsNC4xOCwwLDAsMCwxNy4xNCwxOFYxNS40OGExLjgsMS44LDAsMCwwLTEuODctMS43OVY3Ljg2YTEuNjEsMS42MSwwLDAsMC0yLjU4LTEuM0wxMS40OCw1LjM0YTIuNTMsMi41MywwLDAsMS0uNzUtMS44QTIuNTYsMi41NiwwLDAsMSwxNSwxLjYzYS4zNi4zNiwwLDAsMCwuNDgsMEEyLjU2LDIuNTYsMCwwLDEsMTksNS4zNEwxNi4xMiw4LjI1YS4zNi4zNiwwLDEsMCwuNTEuNTFsMi45MS0yLjkxQTMuMjgsMy4yOCwwLDAsMCwxNy4yMi4yNVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00LjUxIC0wLjI1KSIgc3R5bGU9ImZpbGw6IzU2YjQ2YiIvPjwvc3ZnPg==",
        linkTo: "/collections/all",
        isDisplayEarnedCredits: true,
      },
      admin_rule: {
        icon: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNzcuMTMgMTg2Ljk4Ij48dGl0bGU+YW5ub3VuY2VtZW50ICBWMjwvdGl0bGU+PHBhdGggZD0iTTExNS4yNiw1OS40N0M5NywzMi42Miw3Mi42NCwxOC4zNSw1OS44NywyNy4xYTE0LjY1LDE0LjY1LDAsMCwwLTMuNjEsMy42M2MwLC4xLTI5LjU1LDU5LjktMjkuNTUsNTkuOUwxMC4yMiwxMDEuODFBMjMuMywyMy4zLDAsMCwwLDQsMTM0LjE3SDRsLjc0LDEuMDlBMjMuMzUsMjMuMzUsMCwwLDAsMzcsMTQxLjQ2bDI2LjUsMzljMy45LDQuODEsMTEuMzgsOS41OSwyMC42Miw0QTE0LDE0LDAsMCwwLDkwLjMxLDE3NSwxNC43OSwxNC43OSwwLDAsMCw4OCwxNjMuODNMNjQuNjgsMTI5LjRzNTUuMTgtNC40LDU1LjM4LTQuNDhhMTMuMiwxMy4yLDAsMCwwLDQuODEtMi4wNmM2LjU2LTQuNDUsOC45MS0xMy44LDYuNjQtMjYuMzFDMTI5LjUxLDg1LDEyMy42Nyw3MiwxMTUuMjYsNTkuNDdaTTEwLjc3LDEzMS4yMSwxMCwxMzAuMTJhMTYuMDcsMTYuMDcsMCwwLDEsNC4yNi0yMi4zMmgwbDE0LjI1LTkuNywxOC44MSwyNy43LTE0LjI1LDkuNjlhMTYuMDksMTYuMDksMCwwLDEtMjIuMzUtNC4yNlpNODIuMDgsMTY3LjlhNy42Myw3LjYzLDAsMCwxLTEyLjY2LDguNTFMNDMsMTM3LjVsMTAuNjItNy4yMiwyLjgxLS4yMlpNNTQuMiwxMjMsMzMuNyw5Mi43OSw1My4yNSw1Mi45M2MxLjksMTEuMiw3LjQ1LDI0LjUsMTYuMzEsMzcuNTVzMTkuMTgsMjMuMTIsMjguODcsMjlaTTExNSwxMTguMmMtOS44NS0uNjQtMjUuOS0xMS43Ni0zOS40OS0zMS43OHMtMTgtMzktMTUtNDguNGE4Ljc5LDguNzksMCwwLDEsOC4yNS02LjE4YzkuNzgsMCwyNi40MiwxMS4xNyw0MC40LDMxLjc3LDcuODcsMTEuNTksMTMuNjEsMjMuNzIsMTUuMTcsMzQuMzIsMy4xMSwyMC4yNS05LjM2LDIwLjI1LTkuMzYsMjAuMjVaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAxIDApIiBzdHlsZT0iZmlsbDojMjVkODcyIi8+PHBhdGggZD0iTTg5LjQ4LDYwLjIzYTE5LjM3LDE5LjM3LDAsMCwwLTE0LjY4LDMsMy42NCwzLjY0LDAsMCwwLDQuMTMsNmgwQTEyLjM3LDEyLjM3LDAsMCwxLDkyLjgyLDg5LjdhMy42MSwzLjYxLDAsMCwwLDIuMDcsNi41OEEzLjU0LDMuNTQsMCwwLDAsOTcsOTUuNjZhMTkuNTgsMTkuNTgsMCwwLDAtNy4zMi0zNS40M1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDEgMCkiIHN0eWxlPSJmaWxsOiMyNWQ4NzIiLz48cGF0aCBkPSJNMTE5LjcxLDM0LjM3aC4zNWEzLjYsMy42LDAsMCwwLDMuNTktMy4yM2wyLjc5LTI3LjA2YTMuNjEsMy42MSwwLDAsMC03LjE2LS45NGgwdi4yTDExNi41LDMwLjQyYTMuNTksMy41OSwwLDAsMCwzLjE5LDMuOTVaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAxIDApIiBzdHlsZT0iZmlsbDojMjVkODcyIi8+PHBhdGggZD0iTTE2Ni4zNiwyOC44MWEzLjYxLDMuNjEsMCwwLDAtNS0xTDEzNi4yMSw0NC4yN2EzLjYxLDMuNjEsMCwwLDAtMSw1LDMuODEsMy44MSwwLDAsMCw1LjE0LDFsMjUuMTQtMTYuNDlhMy42MSwzLjYxLDAsMCwwLC44OS01WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMSAwKSIgc3R5bGU9ImZpbGw6IzI1ZDg3MiIvPjxwYXRoIGQ9Ik0xNzQuMDUsNzIuODUsMTQ0LjgxLDY3LjZhMy42MSwzLjYxLDAsMSwwLTEuMjgsNy4xMWgwTDE3Mi43NSw4MGguNjRhMy42MSwzLjYxLDAsMCwwLC42NC03LjE4WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMSAwKSIgc3R5bGU9ImZpbGw6IzI1ZDg3MiIvPjwvc3ZnPg==",
        linkTo: "none",
        isDisplayEarnedCredits: false,
      },
    };
    Flits.each(rules, function (ruleIndex, ruleItem) {
      let ruleBoxClone = Flits(".flits-rule-card-template2").clone();
      ruleBoxClone.removeClass("flits-rule-card-template2");
      let credits;
      let notApplicableText = Flits.t(
        "Flits.locals.how_to_earn_credit_page.rule_not_applicable",
        "*Not Applicable"
      );
      if (ruleItem.is_default_rule) {
        credits = ruleItem.credits;
        if (ruleItem.is_fixed || ruleItem.module_on == "monthly_date") {
          credits = Flits.formatMoney(
            Math.abs(credits),
            Flits.money_format
          ).replace("₹ ", "");
          unlockText = Flits.t(
            "Flits.locals.how_to_earn_credit_page.unlock_fixed_credit",
            "Unlock {{ credit }}"
          );
        } else {
          credits /= 100;
          credits += "%";
          unlockText = Flits.t(
            "Flits.locals.how_to_earn_credit_page.unlock_some_percentage_credit",
            "Unlock {{ credit }} cashback"
          );
        }
        unlockText = unlockText.replace("{{ credit }}", credits);
        ruleBoxClone.find(".flits-unlock-badge").html(unlockText);
        if (ruleItem.is_earned) {
          ruleBoxClone.addClass("flits-rule-earned");
          earnedRuleCount++;
        }
        switch (ruleItem.module_on) {
          case "register":
            multilangTitle = Flits.t(
              "Flits.locals.how_to_earn_credit_page.register_credit_rule_title",
              "Register credit"
            );
            multilangDescription = Flits.t(
              "Flits.locals.how_to_earn_credit_page.register_credit_rule_description",
              "Register and get {{ credit }} credit."
            );
            title = multilangTitle;
            description = multilangDescription.replace("{{ credit }}", credits);
            !rulesConfig[ruleItem.module_on].isDisplayEarnedCredits
              ? ruleBoxClone
                  .find(".flits-rule-earn-credit")
                  .addClass("flits-hide")
              : "";
            if (!ruleItem.is_earned) {
              if (Flits.customer_id != "-1") {
                ruleBoxClone.addClass("flits-rule-not-applicable");
                ruleBoxClone
                  .find(".flits-unlock-badge")
                  .html(notApplicableText);
                notApplicableEarnRuleCount++;
              } else {
                ruleBoxClone
                  .find(".flits-unlock-badge")
                  .attr("href", "/account/register");
              }
            }
            break;
          case "subscribe":
            multilangTitle = Flits.t(
              "Flits.locals.how_to_earn_credit_page.subscribe_credit_rule_title",
              "Subscriber credit"
            );
            multilangDescription = Flits.t(
              "Flits.locals.how_to_earn_credit_page.subscribe_credit_rule_description",
              "Subscribe and get {{ credit }} credit."
            );
            title = multilangTitle;
            description = multilangDescription.replace("{{ credit }}", credits);
            !rulesConfig[ruleItem.module_on].isDisplayEarnedCredits
              ? ruleBoxClone
                  .find(".flits-rule-earn-credit")
                  .addClass("flits-hide")
              : "";
            let isSubscribed =
              Flits.customer_accepts_marketing == "true" ? "1" : "0";
            let isSubscribCreditEarned = ruleItem.is_earned ? "1" : "0";
            switch (isSubscribed + isSubscribCreditEarned) {
              case "00":
                ruleBoxClone.removeClass("flits-rule-not-applicable");
                ruleBoxClone
                  .find(".flits-unlock-badge")
                  .html(unlockText)
                  .addClass("flits-accept-marketing");
                break;
              case "10":
                ruleBoxClone.removeClass("flits-rule-earned");
                ruleBoxClone.addClass("flits-rule-not-applicable");
                ruleBoxClone
                  .find(".flits-unlock-badge")
                  .html(notApplicableText);
                notApplicableEarnRuleCount++;
                break;
              case "11":
                break;
              case "01":
                break;
              default:
                break;
            }
            break;
          case "order_number":
            multilangTitle = Flits.t(
              "Flits.locals.how_to_earn_credit_page.specific_order_credit_rule_title",
              "Credit on specific order"
            );
            multilangDescription = Flits.t(
              "Flits.locals.how_to_earn_credit_page.specific_order_credit_rule_description",
              "Earn {{ credit }} credit on your order number {{ order_count }}"
            );
            title = multilangTitle;
            description = multilangDescription
              .replace("{{ credit }}", credits)
              .replace("{{ order_count }}", ruleItem.column_value);
            !rulesConfig[ruleItem.module_on].isDisplayEarnedCredits
              ? ruleBoxClone
                  .find(".flits-rule-earn-credit")
                  .addClass("flits-hide")
              : "";
            let orderCount = parseInt(Flits.customer_orders_count);
            let columnValue = parseInt(ruleItem.column_value);
            if (!ruleItem.is_earned) {
              if (orderCount >= columnValue) {
                ruleBoxClone.removeClass("flits-rule-earned");
                ruleBoxClone.addClass("flits-rule-not-applicable");
                ruleBoxClone
                  .find(".flits-unlock-badge")
                  .html(notApplicableText);
                notApplicableEarnRuleCount++;
              }
            }
            if (ruleItem.relation == ">=") {
              multilangTitle = Flits.t(
                "Flits.locals.how_to_earn_credit_page.specific_order_and_next_orders_credit_rule_title",
                "Credit on order number {{ order_count }} and next orders"
              );
              multilangDescription = Flits.t(
                "Flits.locals.how_to_earn_credit_page.specific_order_and_next_orders_credit_rule_description",
                "You can earn {{ credit }} credit on order number {{ order_count }} and next orders {{ order_count+1 }}, {{ order_count+2 }}..... {{ order_count+n }}"
              );
              title = multilangTitle.replace(
                "{{ order_count }}",
                ruleItem.column_value
              );
              description = multilangDescription
                .replace("{{ credit }}", credits)
                .replace("{{ order_count }}", ruleItem.column_value)
                .replace(
                  "{{ order_count+1 }}",
                  parseInt(ruleItem.column_value) + 1
                )
                .replace(
                  "{{ order_count+2 }}",
                  parseInt(ruleItem.column_value) + 2
                )
                .replace("{{ order_count+n }}", "n");
              ruleBoxClone.removeClass("flits-rule-earned");
              ruleBoxClone.removeClass("flits-rule-not-applicable");
              console.log(unlockText, "unlockText")
              ruleBoxClone.find(".flits-unlock-badge").html(unlockText);
              ruleBoxClone
                .find(".flits-rule-earn-credit")
                .removeClass("flits-hide");
            }
            ruleBoxClone
              .find(".flits-unlock-badge")
              .attr("href", rulesConfig[ruleItem.module_on].linkTo)
              .attr("target", "_blank");
            break;
          case "birthdate":
            multilangTitle = Flits.t(
              "Flits.locals.how_to_earn_credit_page.birthdate_credit_rule_title",
              "Birthday credit*"
            );
            multilangDescription = Flits.t(
              "Flits.locals.how_to_earn_credit_page.birthdate_credit_rule_description_1",
              "Share your birthdate with us to get {{ credit }} credit on your birthday."
            );
            let birthdayMultilangDescription = Flits.t(
              "Flits.locals.how_to_earn_credit_page.birthdate_credit_rule_description_2",
              "{{ days }} day/s left for a birthday reward of {{ credit }} credit."
            );
            let termsCondtionMultilangDescription = Flits.t(
              "Flits.locals.how_to_earn_credit_page.birthdate_credit_rule_description_3",
              "*You can avail this credit only once in a year."
            );
            title = multilangTitle;
            description = multilangDescription.replace("{{ credit }}", credits);
            let birthdayDescription = birthdayMultilangDescription.replace(
              "{{ credit }}",
              credits
            );
            !rulesConfig[ruleItem.module_on].isDisplayEarnedCredits
              ? ruleBoxClone
                  .find(".flits-rule-earn-credit")
                  .addClass("flits-hide")
              : "";
            ruleBoxClone.removeClass("flits-rule-earned");
            ruleBoxClone
              .find(".flits-rule-redirect-link")
              .attr("data-flits-redirect", "#profile");
            ruleBoxClone
              .find(".flits-rule-redirect-link")
              .attr("href", "/account#profile");
            ruleBoxClone
              .find(".flits-rule-redirect-link")
              .addClass("flits-birthday-redirect");
            ruleBoxClone
              .find(".flits-rule-redirect-link")
              .append(
                Flits.t(
                  "Flits.locals.how_to_earn_credit_page.add_birthdate",
                  "Add your Birthdate"
                )
              );
            ruleBoxClone
              .find(".flits-unlock-badge")
              .addClass("flits-birthday-unlock-badge");
            ruleBoxClone
              .find(".flits-birthday-unlock-badge")
              .addClass("flits-redirect-link")
              .attr("data-flits-redirect", "#profile");
            ruleBoxClone
              .find(".flits-birthday-unlock-badge")
              .addClass("flits-redirect-link")
              .attr("href", "/account#profile");
            ruleBoxClone
              .find(".flits-rule-redirect-link")
              .removeClass("flits-hide");
            descriptionCloneTag = ruleBoxClone
              .find(".flits-rule-description")
              .clone();
            descriptionCloneTag.addClass(
              "flits-birthday-rule-terms-condition flits-mt-10"
            );
            ruleBoxClone
              .find(".flits-rule-description")
              .after(descriptionCloneTag);
            ruleBoxClone
              .find(
                ".flits-rule-description:not(.flits-birthday-rule-terms-condition)"
              )
              .addClass("flits-birthday-rule-description");
            ruleBoxClone
              .find(".flits-birthday-rule-description")
              .attr("data-flits-birthdate-count-text", birthdayDescription);
            ruleBoxClone
              .find(".flits-birthday-rule-terms-condition")
              .html(termsCondtionMultilangDescription);
            break;
          case "monthly_date":
            multilangTitle = Flits.t(
              "Flits.locals.how_to_earn_credit_page.monthly_credit_rule_title",
              "Monthly credit"
            );
            multilangDescription = Flits.t(
              "Flits.locals.how_to_earn_credit_page.monthly_credit_rule_description",
              "You will get {{ credit }} credit on  {{ date }} of every month."
            );
            title = multilangTitle;
            description = multilangDescription
              .replace("{{ credit }}", credits)
              .replace("{{ date }}", new Date(ruleItem.column_value).getDate());
            !rulesConfig[ruleItem.module_on].isDisplayEarnedCredits
              ? ruleBoxClone
                  .find(".flits-rule-earn-credit")
                  .addClass("flits-hide")
              : "";
            ruleBoxClone.removeClass("flits-rule-earned");
            ruleBoxClone.find(".flits-unlock-badge").addClass("flits-hide");
            if (ruleItem.is_fixed) {
              multilangTitle = Flits.t(
                "Flits.locals.how_to_earn_credit_page.special_day_credit_rule_title",
                "Bonus day credit"
              );
              multilangDescription = Flits.t(
                "Flits.locals.how_to_earn_credit_page.special_day_credit_rule_description",
                "Get special day credit on {{ date }}"
              );
              title = multilangTitle;
              description = multilangDescription.replace(
                "{{ date }}",
                new Date(ruleItem.column_value).getDate() +
                  "/" +
                  (new Date(ruleItem.column_value).getMonth() + 1) +
                  "/" +
                  new Date(ruleItem.column_value).getFullYear()
              );
              if (
                Flits.timeDiffer({
                  date1: ruleItem.column_value,
                  date2: new Date(),
                  type: "day",
                  isAbsDisabled: true,
                }) < 0
              ) {
                ruleBoxClone.addClass("flits-rule-not-applicable");
                ruleBoxClone
                  .find(".flits-unlock-badge")
                  .html(notApplicableText);
                ruleBoxClone
                  .find(".flits-unlock-badge")
                  .removeClass("flits-hide");
                notApplicableEarnRuleCount++;
              }
            }
            break;
          case "product_review":
            multilangTitle = Flits.t(
              "Flits.locals.how_to_earn_credit_page.product_review_credit_rule_title",
              "Product review credit"
            );
            multilangDescription = Flits.t(
              "Flits.locals.how_to_earn_credit_page.product_review_credit_rule_description",
              "Write a product review and get {{ credit }} credit."
            );
            title = multilangTitle;
            description = multilangDescription.replace("{{ credit }}", credits);
            !rulesConfig[ruleItem.module_on].isDisplayEarnedCredits
              ? ruleBoxClone
                  .find(".flits-rule-earn-credit")
                  .addClass("flits-hide")
              : "";
            ruleBoxClone.removeClass("flits-rule-earned");
            ruleBoxClone
              .find(".flits-unlock-badge")
              .attr("href", rulesConfig[ruleItem.module_on].linkTo)
              .attr("target", "_blank");
            break;
          case "product_tag":
            multilangTitle = Flits.t(
              "Flits.locals.how_to_earn_credit_page.product_tag_credit_rule_title",
              "Credit for specific product collection"
            );
            multilangDescription = Flits.t(
              "Flits.locals.how_to_earn_credit_page.product_tag_credit_rule_description",
              "Buy product/s with (any tag) {{ tag }} and get {{ credit }} credit."
            );
            title = multilangTitle;
            description = multilangDescription.replace("{{ credit }}", credits);
            !rulesConfig[ruleItem.module_on].isDisplayEarnedCredits
              ? ruleBoxClone
                  .find(".flits-rule-earn-credit")
                  .addClass("flits-hide")
              : "";
            ruleBoxClone.removeClass("flits-rule-earned");
            let productTagSpan = Flits("<span/>");
            Flits(ruleItem.avails).each(function (index, item) {
              let productTagAnchor = Flits(
                '<a href="/search?q=' +
                  item +
                  '" target="_blank" class="flits-link">' +
                  item +
                  "</a>"
              );
              if (index > 0) {
                productTagSpan.append(",");
              }
              productTagSpan.append(productTagAnchor);
            });
            description = description.replace(
              "{{ tag }}",
              productTagSpan.html()
            );
            ruleBoxClone
              .find(".flits-unlock-badge")
              .attr("href", "/search?q=" + ruleItem.avails[0])
              .attr("target", "_blank");
            break;
          case "add_product_to_wishlist":
            multilangTitle = Flits.t(
              "Flits.locals.how_to_earn_credit_page.wishlisted_product_credit_rule_title",
              "Wishlisted product credit"
            );
            multilangDescription = Flits.t(
              "Flits.locals.how_to_earn_credit_page.wishlisted_product_credit_rule_description",
              "You can earn {{ credit }} credit when you add product/s in wishlist."
            );
            title = multilangTitle;
            description = multilangDescription.replace("{{ credit }}", credits);
            !rulesConfig[ruleItem.module_on].isDisplayEarnedCredits
              ? ruleBoxClone
                  .find(".flits-rule-earn-credit")
                  .addClass("flits-hide")
              : "";
            ruleBoxClone.removeClass("flits-rule-earned");
            ruleBoxClone
              .find(".flits-unlock-badge")
              .attr("href", rulesConfig[ruleItem.module_on].linkTo)
              .attr("target", "_blank");
            break;
          case "cart":
            multilangTitle = Flits.t(
              "Flits.locals.how_to_spend_credit_page.spend_credit_on_cart_rule_title",
              "Spend on cart"
            );
            let cartRange = ruleItem.column_value;
            let range = cartRange.split(":");
            let minRange = Flits.formatMoney(
              Math.abs(range[0] * 100),
              Flits.money_format
            ).replace("₹ ", "");
            let maxRange = Flits.formatMoney(
              Math.abs(range[1] * 100),
              Flits.money_format
            ).replace("₹ ", "");
            if (ruleItem.is_fixed && range[1] != "-1") {
              multilangDescription = Flits.t(
                "Flits.locals.how_to_spend_credit_page.spend_credit_on_cart_rule_description_1",
                "Your cart value is between {{ min_cart_value }}-{{ max_cart_value }}. Congratulations you are eligible to use {{ credit }} credit."
              );
              description = multilangDescription
                .replace(
                  "{{ min_cart_value }}-{{ max_cart_value }}",
                  '{{ min_cart_value }}<span class="flits-divider">-</span>{{ max_cart_value }}'
                )
                .replace("{{ min_cart_value }}", minRange)
                .replace("{{ max_cart_value }}", maxRange)
                .replace("{{ credit }}", credits);
            } else if (ruleItem.is_fixed && range[1] == "-1") {
              multilangDescription = Flits.t(
                "Flits.locals.how_to_spend_credit_page.spend_credit_on_cart_rule_description_3",
                "Your cart value is {{ min_cart_value }} (or more). Congratulations you can use {{ credit }} credit."
              );
              description = multilangDescription
                .replace("{{ min_cart_value }}", minRange)
                .replace("{{ credit }}", credits);
            } else if (!ruleItem.is_fixed && range[1] != "-1") {
              multilangDescription = Flits.t(
                "Flits.locals.how_to_spend_credit_page.spend_credit_on_cart_rule_description_2",
                "Your cart value is between {{ min_cart_value }}-{{ max_cart_value }}. Congratulations you are eligible to use {{ credit }} of cart value as credit."
              );
              description = multilangDescription
                .replace(
                  "{{ min_cart_value }}-{{ max_cart_value }}",
                  '{{ min_cart_value }}<span class="flits-divider">-</span>{{ max_cart_value }}'
                )
                .replace("{{ min_cart_value }}", minRange)
                .replace("{{ max_cart_value }}", maxRange)
                .replace("{{ credit }}", credits);
            } else if (!ruleItem.is_fixed && range[1] == "-1") {
              multilangDescription = Flits.t(
                "Flits.locals.how_to_spend_credit_page.spend_credit_on_cart_rule_description_4",
                "Your cart value is {{ min_cart_value }} (or more). Congratulations you are eligible to use {{ credit }} of cart value as credit."
              );
              description = multilangDescription
                .replace("{{ min_cart_value }}", minRange)
                .replace("{{ credit }}", credits);
            }
            break;
          case "referrer_friend":
            multilangTitle = Flits.t(
              "Flits.locals.refer_friend_page.referrer_credit_rule_title",
              "Referral Program"
            );
            multilangDescription = Flits.t(
              "Flits.locals.refer_friend_page.referrer_credit_rule_description",
              "Invite your friends and get {{ credit }} credit when they sign up."
            );
            title = multilangTitle;
            description = multilangDescription.replace("{{ credit }}", credits);
            !rulesConfig[ruleItem.module_on].isDisplayEarnedCredits
              ? ruleBoxClone
                  .find(".flits-rule-earn-credit")
                  .addClass("flits-hide")
              : "";
            ruleBoxClone.removeClass("flits-rule-earned");
            descriptionCloneTag = ruleBoxClone
              .find(".flits-rule-description")
              .clone();
            descriptionCloneTag.addClass(
              "flits-referee-friend-rule-description flits-mt-10"
            );
            ruleBoxClone
              .find(".flits-rule-description")
              .after(descriptionCloneTag);
            ruleBoxClone
              .find(
                ".flits-rule-description:not(.flits-referee-friend-rule-description)"
              )
              .addClass("flits-referrer-friend-rule-description");
            break;
          case "referee_friend":
            multilangTitle = Flits.t(
              "Flits.locals.refer_friend_page.referee_credit_rule_title",
              "Referral Program"
            );
            multilangDescription = Flits.t(
              "Flits.locals.refer_friend_page.referee_credit_rule_description",
              "When your friends accept the invitation, they will get  {{ credit }} credit."
            );
            title = multilangTitle;
            description = multilangDescription.replace("{{ credit }}", credits);
            !rulesConfig[ruleItem.module_on].isDisplayEarnedCredits
              ? ruleBoxClone
                  .find(".flits-rule-earn-credit")
                  .addClass("flits-hide")
              : "";
            if (!ruleItem.is_earned) {
              ruleBoxClone.addClass("flits-rule-not-applicable");
              ruleBoxClone.find(".flits-unlock-badge").html(notApplicableText);
            }
            break;
          case "referrals_total_number":
            multilangTitle = Flits.t(
              "Flits.locals.refer_friend_page.credit_on_number_of_referrals_rule_title",
              "Credit on numbers of referrals"
            );
            multilangDescription = Flits.t(
              "Flits.locals.refer_friend_page.credit_on_number_of_referrals_rule_description",
              "When you reach {{ referral_count }} referrals you get {{ credit }} credit."
            );
            title = multilangTitle;
            description = multilangDescription
              .replace("{{ credit }}", credits)
              .replace("{{ referral_count }}", ruleItem.column_value);
            !rulesConfig[ruleItem.module_on].isDisplayEarnedCredits
              ? ruleBoxClone
                  .find(".flits-rule-earn-credit")
                  .addClass("flits-hide")
              : "";
            if (!ruleItem.is_earned) {
              ruleBoxClone.attr(
                "data-flits-referrals-total-number",
                ruleItem.column_value
              );
            }
            break;
          case "referrals_total_spent":
            multilangTitle = Flits.t(
              "Flits.locals.refer_friend_page.credit_on_referrals_total_spent_amount_rule_title",
              "Credit after referral's total spent amount"
            );
            multilangDescription = Flits.t(
              "Flits.locals.refer_friend_page.credit_on_referrals_total_spent_amount_rule_description",
              "You can earn {{ credit }} credit when your referral's total spent amount is {{ total_spent_amount }} or more."
            );
            title = multilangTitle;
            let totalSpentAmount = Flits.formatMoney(
              Math.abs(parseInt(ruleItem.column_value) * 100),
              Flits.money_format
            ).replace("₹ ", "");
            description = multilangDescription
              .replace("{{ credit }}", credits)
              .replace("{{ total_spent_amount }}", totalSpentAmount);
            !rulesConfig[ruleItem.module_on].isDisplayEarnedCredits
              ? ruleBoxClone
                  .find(".flits-rule-earn-credit")
                  .addClass("flits-hide")
              : "";
            ruleBoxClone.removeClass("flits-rule-earned");
            break;
          case "referrals_order_number":
            multilangTitle = Flits.t(
              "Flits.locals.refer_friend_page.referrals_specific_order_credit_rule_title",
              "Refer & Earn"
            );
            multilangDescription = Flits.t(
              "Flits.locals.refer_friend_page.referrals_specific_order_credit_rule_description",
              "Send your friend {{ credit }} and you get {{ credit }} after their first purchase"
            );
            title = multilangTitle;
            description = multilangDescription
              .replace("{{ credit }}", credits)
              .replace("{{ order_count }}", ruleItem.column_value)
              .replace("{{ credit }}", credits);
            if (ruleItem.relation == ">=") {
              multilangTitle = Flits.t(
                "Flits.locals.refer_friend_page.referrals_specific_order_and_next_orders_credit_rule_title",
                "Credit on referee's order number {{ order_count }} and next orders"
              );
              multilangDescription = Flits.t(
                "Flits.locals.refer_friend_page.referrals_specific_order_and_next_orders_credit_rule_description",
                "You can earn {{ credit }} credit on referee's order number {{ order_count }} and next orders {{ order_count+1 }}, {{ order_count+2 }}... {{ order_count+n }}"
              );
              title = multilangTitle.replace(
                "{{ order_count }}",
                ruleItem.column_value
              );
              description = multilangDescription
                .replace("{{ credit }}", credits)
                .replace("{{ order_count }}", ruleItem.column_value)
                .replace(
                  "{{ order_count+1 }}",
                  parseInt(ruleItem.column_value) + 1
                )
                .replace(
                  "{{ order_count+2 }}",
                  parseInt(ruleItem.column_value) + 2
                )
                .replace("{{ order_count+n }}", "n");
            }
            !rulesConfig[ruleItem.module_on].isDisplayEarnedCredits
              ? ruleBoxClone
                  .find(".flits-rule-earn-credit")
                  .addClass("flits-hide")
              : "";
            ruleBoxClone.removeClass("flits-rule-earned");
            break;
          default:
            break;
        }
      } else {
        title = ruleItem.title;
        description = ruleItem.description;
        ruleBoxClone.find(".flits-unlock-badge").addClass("flits-hide");
      }
      ruleBoxClone.find(".flits-rule-title").html(title);
      if (ruleItem.module_on == "referrer_friend") {
        ruleBoxClone
          .find(".flits-referrer-friend-rule-description")
          .html(description);
      } else if (ruleItem.module_on == "referee_friend") {
        Flits(".flits-referee-friend-rule-description").html(description);
      } else if (ruleItem.module_on == "birthdate") {
        ruleBoxClone.find(".flits-birthday-rule-description").html(description);
      } else {
        ruleBoxClone.find(".flits-rule-description").html(description);
      }
      if (ruleItem.mappedRuleIds) {
        ruleBoxClone.attr(
          "data-flits-rule-id-array",
          ruleItem.mappedRuleIds.toString()
        );
      } else {
        ruleBoxClone.attr("data-flits-rule-id-array", ruleItem.rule_id);
      }
      ruleBoxClone.attr("data-flits-rule-id", ruleItem.rule_id);
      if (rulesConfig[ruleItem.module_on]) {
        let image =
          rulesConfig[ruleItem.module_on].icon == undefined
            ? ""
            : "data:image/svg+xml;base64," +
              rulesConfig[ruleItem.module_on].icon;
        ruleBoxClone.find(".flits-rule-image").find("img").attr("src", image);
      }

      switch (ruleItem.tab_to_append) {
        case "flits_earning_rules":
          earnRuleLength++;
          if (ruleItem.module_on.indexOf("refer") != -1) {
            referFriendRuleLength++;
            ruleBoxClone
              .find(".flits-unlock-badge")
              .addClass("flits-refer-friend-unlock-badge");
            if (ruleItem.module_on != "referee_friend") {
              Flits(".flits-refer-friend-div").append(ruleBoxClone.clone());
            }
          } else {
            howToEarnRuleLength++;
            Flits("#custom-earning").append(ruleBoxClone);
          }
          break;
        case "flits_spent_rules":
          if (ruleItem.module_on == "cart") {
            howToSpentRuleLength++;
            let rangeValue = ruleItem.column_value.split(":");
            let rangeValueFrom = parseInt(rangeValue[0]);
            let rangeValueTo = parseInt(rangeValue[1]);
            let rangeLLabelFrom = Flits.formatMoney(
              Math.abs(parseInt(rangeValue[0]) * 100),
              Flits.money_format
            ).replace("₹ ", "");
            let rangeLabelTo =
              parseInt(rangeValue[1]) == -1
                ? "Max"
                : Flits.formatMoney(
                    Math.abs(parseInt(rangeValue[1]) * 100),
                    Flits.money_format
                  ).replace("₹ ", "");
            let rangeLabel = rangeLLabelFrom + " - " + rangeLabelTo;
            spentRange.push({
              range: rangeValueFrom,
              range_label: rangeLabel,
            });
            let pTag = Flits("<p />");
            pTag.addClass("flits-spend-rule-description");
            pTag.attr("data-flits-rule-for", rangeValueFrom);
            pTag.html(description);
            Flits(".how-to-spend .flits-spend-rules-range-container").append(
              pTag
            );
          }
          break;
        case "flits_from_admin_rules":
          title = ruleItem.title;
          description = ruleItem.description;
          ruleBoxClone.find(".flits-rule-title").html(title);
          ruleBoxClone.find(".flits-rule-description").html(description);
          !rulesConfig["admin_rule"].isDisplayEarnedCredits
            ? ruleBoxClone
                .find(".flits-rule-earn-credit")
                .addClass("flits-hide")
            : "";
          image =
            rulesConfig["admin_rule"].icon == undefined
              ? ""
              : "data:image/svg+xml;base64," + rulesConfig["admin_rule"].icon;
          ruleBoxClone.find(".flits-rule-image").find("img").attr("src", image);
          adminRuleLength++;
          Flits(".flits-from-admin-div .flits-rules-card").append(ruleBoxClone);
          break;
        default:
          break;
      }
      if (rules.length - 1 == ruleIndex) {
        Flits.dispatchEvent("FlitsCustom:howToSpentRules:Successful");
      }
    });
    if (notApplicableEarnRuleCount > 0) {
      Flits(".flits-how-to-earn-not-applicable-note").removeClass("flits-hide");
    }
    if (Flits("#custom-earning").children().length == 0) {
      showEmptyBlock(
        "#custom-earning",
        "The store has not set up any rules yet",
        1
      );
    }
    if (Flits(".flits-cart-range-slider").children().length == 0) {
      showEmptyBlock(
        ".flits-cart-range-container",
        "The store has not set up any rules yet",
        0
      );
    }
    Flits(".flits-referrer-friend-rule-description")
      .parent()
      .find(".flits-unlock-badge")
      .attr("href", "account#referFriend");
  }
  //Function for User Credit activity list
  function setUserActivity(data) {
    Flits(".flits-activity-list").html("");
    Flits(data).each(function (index, item) {
      var activityClone = Flits(".flits-activity-card-template").clone();
      activityClone.removeClass("flits-activity-card-template");
      activityClone.find(".flits-activity-title").text(item.comment);
      let credit = item.credits.toString();
      var sign;
      if (credit.includes("-")) {
        sign = "-";
      } else {
        sign = "+";
      }
      let points = Flits.formatMoney(
        Math.abs(item.credits),
        Flits.money_format
      ).replace("₹ ", "");
      activityClone
        .find(".flits-activity-credit")
        .text(sign + " " + points + " Points");
      if (sign == "-") {
        activityClone
          .find(".flits-activity-credit")
          .addClass("flits-activity-debit");
      }
      activityClone.find(".flits-activity-date").text(item.created_at);
      Flits(".flits-activity-list").append(activityClone.clone());
    });
    if (Flits(".flits-activity-list").children().length == 0) {
      let emptyDiv = Flits(".flits-no-activity-list").clone();
      Flits(".flits-activity-list").append(emptyDiv);
    }
  }
  //Function for all AJAX calls
  function getCreditruleAjax() {
    Flits(".flits-custom-earn-loader").show();
    Flits(".flits-credit-box-content-with-scroll").css("overflow", "hidden");
    if (Flits.customer_id != "-1") {
      Flits.ajax({
        method: "GET",
        url: Flits.base_url + "/" + Flits.customer_id + "/credit/get_credit",
        data: {
          customer_hash: Flits.customerHash,
          token: Flits.token,
        },
      })
        .done(function (resp) {
          var data = resp;
          if (data.status) {
            var bal = Flits.formatMoney(
              Math.abs(data.customer.credits),
              Flits.money_format
            ).replace("₹ ", "");
            var bal_text =
              `<svg fill="#000000" width="26px" height="26px" viewBox="0 0 24.00 24.00" xmlns="http://www.w3.org/2000/svg" stroke="#000000" stroke-width="0.00024000000000000003"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M21,14.571C21,16.465,18.538,18,15.5,18S10,16.465,10,14.571s2.462-3.428,5.5-3.428S21,12.678,21,14.571Zm-5.5,5.286c-3.038,0-5.5-1.535-5.5-3.428v2.142C10,20.465,12.462,22,15.5,22S21,20.465,21,18.571V16.429C21,18.322,18.538,19.857,15.5,19.857Zm-7-11c3.038,0,5.5-1.535,5.5-3.428S11.538,2,8.5,2,3,3.535,3,5.429,5.462,8.857,8.5,8.857Zm-.125,4a5.58,5.58,0,0,1,2.181-2.389,8.44,8.44,0,0,1-2.056.25C5.462,10.714,3,9.179,3,7.286V9.428C3,11.3,5.4,12.811,8.375,12.853ZM8.5,22a8.83,8.83,0,0,0,1.079-.067,4.917,4.917,0,0,1-1.37-2.085C5.307,19.753,3,18.261,3,16.429v2.142C3,20.465,5.462,22,8.5,22ZM8,17.556V15.4c-2.8-.16-5-1.613-5-3.4v2.143C3,15.931,5.2,17.4,8,17.556Z"></path></g></svg>Just a reminder that you have<b> ` +
              bal +
              ` </b>in store credit waiting for you to use.`;
            Flits(".flits-expanded-header-top .flits-total-credit").html(bal);
            Flits(
              ".flits-credit-fix-header-points .flits-total-credit span"
            ).html(bal);
            setUserActivity(data.customer.credit_log);
          }
        })
        .fail(function (resp) {
          flitsSnackbar.show({
            text: resp.statusText,
            pos: "bottom-center",
            showAction: false,
            customClass: "flits-alert-danger",
          });
        })
        .always(function () {});
      Flits.ajax({
        type: "POST",
        url: Flits.base_url + "/" + Flits.customer_id + "/get_rule",
        data: {
          customer_hash: Flits.customerHash,
          token: Flits.token,
          theme_id: Flits.theme.id,
        },
      })
        .done(function (resp) {
          resp.rules.all_rules_data.splice(3, 0, defaultRules);
          let objectToString = JSON.stringify(resp.rules.all_rules_data);
          //localStorage.setItem("flits_credit_rules_customer", objectToString);
          //setCookie('flits_credit_rules_customer', 'true', 1440);
          setRules(resp.rules.all_rules_data);
          if (resp.rules.all_rules_data.length > 0) {
            setRules(resp.rules.all_rules_data);
          } else {
            showEmptyBlock(
              "#custom-earning",
              "The store has not set up any rules yet",
              1
            );
            showEmptyBlock(
              ".flits-cart-range-container",
              "The store has not set up any rules yet",
              0
            );
            // showEmptyBlock();
          }
        })
        .fail(function (resp) {
          flitsSnackbar.show({
            text: resp.statusText,
            pos: "bottom-center",
            showAction: false,
            customClass: "flits-alert-danger",
          });
        })
        .always(function () {});
      if (Flits.Metafields.IS_REFER_PROGRAM_ON == 1) {
        Flits.ajax({
          method: "GET",
          url:
            Flits.base_url +
            "/" +
            Flits.customer_id +
            "/refer_friend/get_referral_data",
          data: {
            customer_hash: Flits.customerHash,
            token: Flits.token,
          },
        })
          .done(function (resp) {
            updateReferCreditCustom(resp);
          })
          .fail(function (resp) {
            flitsSnackbar.show({
              text: resp.statusText,
              pos: "bottom-center",
              showAction: false,
              customClass: "flits-alert-danger",
            });
          })
          .always(function () {});
      }
    } else {
      function commonGetRulesForCredit(resp){
        resp.rules.all_rules_data.splice(3, 0, defaultRules);
        let objectToString = JSON.stringify(resp.rules.all_rules_data);
        localStorage.setItem("flits_credit_rules", objectToString);
        setCookie("flits_credit_rules", "true", 5);
        // addCreditEarnMessageProductPage(resp);
        if (resp.rules.all_rules_data.length > 0) {
          setRules(resp.rules.all_rules_data);
        } else {
          showEmptyBlock("#custom-earning","The store has not set up any rules yet",1);
          showEmptyBlock(".flits-cart-range-container","The store has not set up any rules yet",0);
        }
      }
      if(window.flitsObjects.global.Metafields.GET_RULES_FOR_GUEST_CUSTOMERS){
        commonGetRulesForCredit(window.flitsObjects.global.Metafields.GET_RULES_FOR_GUEST_CUSTOMERS);
      }else{
        Flits.ajax({
          type: "GET",
          url: Flits.base_url + "/get-rules?token=" + Flits.token,
        })
          .done(function (resp) {
            commonGetRulesForCredit(resp)
          })
          .fail(function (resp) {
            flitsSnackbar.show({
              text: resp.statusText,
              pos: "bottom-center",
              showAction: false,
              customClass: "flits-alert-danger",
            });
          })
          .always(function () {});
      }
      // Flits.ajax({
      //   type: "GET",
      //   url: Flits.base_url + "/get-rules?token=" + Flits.token,
      // })
      //   .done(function (resp) {
      //     resp.rules.all_rules_data.splice(3, 0, defaultRules);
      //     let objectToString = JSON.stringify(resp.rules.all_rules_data);
      //     localStorage.setItem("flits_credit_rules", objectToString);
      //     setCookie('flits_credit_rules', 'true', 5);
      //     // addCreditEarnMessageProductPage(resp);
      //     if (resp.rules.all_rules_data.length > 0) {
      //       setRules(resp.rules.all_rules_data);
      //     } else {
      //       showEmptyBlock(
      //         "#custom-earning",
      //         "The store has not set up any rules yet",
      //         1
      //       );
      //       showEmptyBlock(
      //         ".flits-cart-range-container",
      //         "The store has not set up any rules yet",
      //         0
      //       );
      //     }
      //   })
      //   .fail(function (resp) {
      //     flitsSnackbar.show({
      //       text: resp.statusText,
      //       pos: "bottom-center",
      //       showAction: false,
      //       customClass: "flits-alert-danger",
      //     });
      //   })
      //   .always(function () {});
    }
  }

  //Function for appending credit rules
  function appendCreditrule() {
    if (Flits.customer_id != '-1') {
    getCreditruleAjax();
    } else {
      let creditRuleCookie = getCookie('flits_credit_rules');
      if (creditRuleCookie) {
        let creditRuleLocal = localStorage.getItem("flits_credit_rules");
        if (creditRuleLocal) {
          let creditRuleLocalObj = JSON.parse(creditRuleLocal);
          setRules(creditRuleLocalObj);
        } else {
          getCreditruleAjax();
        }
      } else {
        localStorage.removeItem("flits_credit_rules");
        getCreditruleAjax();
      }
    }
    setTimeout(function () {
      Flits(".flits-custom-earn-loader").hide();
      Flits(".flits-credit-box-content-with-scroll").css("overflow", "");
    }, 1000);
    setTimeout(function () {
      if (
        Flits(
          '.flits-refer-friend-div .flits-rule-card[data-flits-rule-id="11"] .flits-rule-description'
        ).length
      ) {
        let programDesc = Flits(
          '.flits-refer-friend-div .flits-rule-card[data-flits-rule-id="11"] .flits-rule-description'
        ).html();
        Flits(".flits-refer-friend-outside-content-desc").html(programDesc);
        Flits(".flits-refer-friend-outside-content").show();
      }
    }, 3000);
  }

  // Function to Scroll to Top
  function scrollToTop() {
    var content = Flits(".flits-credit-box-content-with-scroll"); // replace with the selector for the element inside the popup that you want to set the scrollTop for
    content.scrollTop(0);
  }

  // Function to setup Refer Credit Page
  function updateReferCreditCustom(resp) {
    let customer = resp.customer;
    let log = customer.credit_log;
    Flits(".flits-credit-popup-main .flits-total-referral").html(
      resp.reached_referral_limit
    );
    if (customer.referral_code != "") {
      let shareableLink =
        "https://" +
        location.host +
        "/account/register?flits_refer_code=" +
        encodeURIComponent(unescape(btoa(customer.referral_code))) +
        "&flits_inviter_name=" +
        encodeURIComponent(unescape(btoa(customer.name)));
      Flits('.flits-credit-popup-main input[name="referral link"]').val(
        shareableLink
      );
    }
    if (resp.refer_by != "") {
      Flits(".flits-credit-popup-main .flits-referby-row").removeClass(
        "flits-hide"
      );
    }
    if (typeof navigator.share == "function") {
      Flits(
        ".flits-credit-popup-main .flits-share-btn[data-flits-share-platform='navigator_share']"
      ).removeClass("flits-hide");
    }
    if (resp.facebook_share) {
      Flits(
        ".flits-credit-popup-main .flits-share-btn[data-flits-share-platform='facebook']"
      ).removeClass("flits-hide");
    }
    if (resp.whatsapp_share) {
      Flits(
        ".flits-credit-popup-main .flits-share-btn[data-flits-share-platform='whatsapp']"
      ).removeClass("flits-hide");
    }
    if (
      typeof navigator.share != "function" &&
      !resp.facebook_share &&
      !resp.whatsapp_share
    ) {
      Flits(".flits-credit-popup-main .flits-link-share-btn-box").addClass(
        "flits-hide"
      );
      Flits(
        ".flits-credit-popup-main .flits-referral-link-input-wrap"
      ).addClass("flits-referral-link-full");
      Flits(
        ".flits-credit-popup-main .flits-referral-link-input-wrap"
      ).addClass("flits-mb-10");
    }
  }

  // On Click Events
  Flits(document).on("click", ".flits-credit-popup-button", function (event) {
    event.preventDefault();
    if (Flits(this).hasClass("active")) {
      Flits(this).removeClass("active");
      Flits(".flits-close-credit-popup").trigger("click");
    } else {
      if (Flits(".flits-cart-range-slider div").length < 1) {
        appendCreditrule();
      }
      Flits(this).addClass("active");
      Flits(".flits-credit-popup-button .open-text").hide();
      Flits(".flits-credit-popup-button .close-text").show();
      Flits(".flits-credit-popup-main").show();
      setTimeout(function () {
        Flits(".flits-front-buttons").show();
        Flits(".flits-header-bottom").show();
      }, 100);
      Flits(".flits-total-credit").show();
    }
    Flits(".back").trigger("click");
    scrollToTop();
  });
  Flits(document).on("click", "a.bottom-rewards", function (event) {
    event.preventDefault();
    if (Flits(this).hasClass("active")) {
      Flits(this).removeClass("active");
      Flits(".flits-close-credit-popup").trigger("click");
    } else {
      if (Flits(".flits-cart-range-slider div").length < 1) {
        appendCreditrule();
      }
      Flits(this).addClass("active");
      Flits(".flits-credit-popup-button .open-text").hide();
      Flits(".flits-credit-popup-button .close-text").show();
      Flits(".flits-credit-popup-main").show();
      setTimeout(function () {
        Flits(".flits-front-buttons").show();
        Flits(".flits-header-bottom").show();
      }, 1500);
      Flits(".flits-total-credit").show();
    }
    Flits(".back").trigger("click");
    scrollToTop();
  });
  Flits(document).on("click", ".flits-close-credit-popup", function (event) {
    event.preventDefault();
    Flits(".flits-credit-popup-main").hide();
    Flits(".how-to-spend").hide();
    Flits(".flits-credit-popup-button .open-text").show();
    Flits(".flits-credit-popup-button .close-text").hide();
    Flits(".flits-credit-popup-button").removeClass("active");
    Flits(".flits-credit-popup-header-part").removeClass("fixed-header");
    Flits(".flits-credit-popup-header-part").removeClass("fixed-header-inner");
    Flits(".flits-earn-redeem-group").show();
  });
  Flits(document).on("click", ".how-to-earn-btn", function (event) {
    Flits("#flits_tab_howToEarn").show();
    Flits(".flits-bal-header").show();
    Flits(".flits-front-buttons").hide();
    Flits(".flits-earn-redeem-group").hide();
    Flits(".flits-header-bottom .only-front").hide();
    Flits(".flits-header-bottom .not-front").show();
    Flits(".back").show();
    Flits(".flits-front").hide();
    // Flits('.flits-credit-popup-header-part').addClass('fixed-header-inner');
    scrollToTop();
  });
  Flits(document).on("click", ".back", function (event) {
    Flits("#flits_tab_howToEarn").hide();
    Flits(".flits-front-buttons").show();
    Flits(".back").hide();
    Flits(".flits-bal-header").hide();
    Flits(".flits-header-bottom .only-front").show();
    Flits(".flits-header-bottom .not-front").hide();
    Flits(".how-to-spend").hide();
    Flits(".flits-refer-friend-div").hide();
    Flits(".flits-your-activity-div").hide();
    Flits(".flits-front").show();
    Flits(".flits-credit-popup-header-part").removeClass("fixed-header");
    Flits(".flits-credit-popup-header-part").removeClass("fixed-header-inner");
    Flits(".flits-earn-redeem-group").show();
    Flits(".flits-expanded-header-top").addClass("with-transition");
    setTimeout(function () {
      Flits(".flits-expanded-header-top").removeClass("with-transition");
    }, 400);
    scrollToTop();
  });
  Flits(document).on("click", ".flits-activity-btn", function (event) {
    Flits(".flits-front-buttons").hide();
    Flits(".back").show();
    Flits(".flits-bal-header").show();
    Flits(".flits-header-bottom .only-front").hide();
    Flits(".flits-header-bottom .not-front").show();
    Flits(".flits-your-activity-div").show();
    Flits(".flits-front").hide();
    Flits(".flits-credit-popup-header-part").addClass("fixed-header-inner");
    Flits(".flits-earn-redeem-group").hide();
    scrollToTop();
  });

  Flits(".flits-credit-box-content-with-scroll").on("scroll", function (event) {
    if (
      !$(this)
        .parent()
        .find(".flits-credit-popup-header-part")
        .hasClass("fixed-header-inner")
    ) {
      var scrollVal = Math.min(Flits(this).scrollTop() * 1.85, 170);
      Flits(".flits-expanded-header-top").css(
        "transform",
        `translate3d(0px,${-scrollVal}px,0px)`
      );
      if (Flits(".flits-credit-box-content-with-scroll").scrollTop() > 87) {
        Flits(".flits-credit-popup-header-part").addClass("fixed-header");
        if (Flits(".flits-credit-popup-header-part").hasClass("fixed-header")) {
          Flits(".flits-expanded-header-top").attr("style", "");
        }
      }
      if (Flits(".flits-credit-box-content-with-scroll").scrollTop() < 87) {
        Flits(".flits-credit-popup-header-part").removeClass("fixed-header");
        // Flits('.flits-expanded-header-top').attr("style", "");
      }
    }

    // debounce(handleScroll, 50)();
    // handleScroll();
  });
  Flits(document).on("click", ".how-to-spent-btn", function (event) {
    Flits(".flits-front-buttons").hide();
    Flits(".back").show();
    Flits(".flits-bal-header").show();
    Flits(".flits-header-bottom .only-front").hide();
    Flits(".flits-header-bottom .not-front").show();
    Flits(".how-to-spend").show();
    Flits(".flits-front").hide();
    // Flits('.flits-credit-popup-header-part').addClass('fixed-header-inner');
    Flits(".flits-earn-redeem-group").hide();
    scrollToTop();
  });
  Flits(document).on("click", ".how-to-refer-btn", function (event) {
    Flits(".flits-front-buttons").hide();
    Flits(".back").show();
    Flits(".flits-header-bottom .only-front").hide();
    Flits(".flits-header-bottom .not-front").show();
    Flits(".flits-bal-header").show();
    Flits(".flits-refer-friend-div").show();
    Flits(".flits-front").hide();
    // Flits('.flits-credit-popup-header-part').addClass('fixed-header-inner');
    Flits(".flits-earn-redeem-group").hide();
    scrollToTop();
  });
  Flits(document).on(
    "click",
    ".flits-credit-popup-main .flits-copy-btn",
    function () {
      Flits.copyClipBoardCode(this);
      flitsSnackbar.show({
        text: Flits.t(
          "Flits.locals.refer_friend_page.referral_link_copied",
          "Link Copied"
        ),
        pos: "bottom-center",
        showAction: false,
        customClass: "flits-alert-default",
        duration: 1500,
      });
    }
  );
  Flits(document).on(
    "click",
    ".flits-credit-popup-main .flits-share-btn",
    function (event) {
      let platform = Flits(this).attr("data-flits-share-platform");
      let referralLink = Flits(
        '.flits-credit-popup-main input[name="referral link"]'
      ).val();
      let facebookDescription = encodeURIComponent(
        unescape(
          Flits.t(
            "Flits.locals.refer_friend_page.referral_program_invitation_message",
            "You can earn credit for creating an account with {{ shop_name }}. Use this link and get rewarded : {{ link }}"
          )
            .replace("{{ link }}", "")
            .replace("{{ shop_name }}", Flits.shop_name)
        )
      );
      let encodedDescription = encodeURIComponent(
        unescape(
          Flits.t(
            "Flits.locals.refer_friend_page.referral_program_invitation_message",
            "You can earn credit for creating an account with {{ shop_name }}. Use this link and get rewarded : {{ link }}"
          )
            .replace("{{ link }}", referralLink)
            .replace("{{ shop_name }}", Flits.shop_name)
        )
      );
      let description = Flits.t(
        "Flits.locals.refer_friend_page.referral_program_invitation_message",
        "You can earn credit for creating an account with {{ shop_name }}. Use this link and get rewarded : {{ link }}"
      )
        .replace("{{ link }}", referralLink)
        .replace("{{ shop_name }}", Flits.shop_name);
      let url = null;
      switch (platform) {
        case "facebook":
          url =
            "https://www.facebook.com/sharer/sharer.php?u=" +
            encodeURIComponent(unescape(referralLink)) +
            "&quote=" +
            facebookDescription;
          break;
        case "whatsapp":
          url = "https://api.whatsapp.com/send?text=" + encodedDescription;
          break;
        case "navigator_share":
          var data = {
            title: "Refer Freind",
            text: description,
          };
          let sharePromise = navigator.share(data);
          return true;
          break;
        default:
        case "facebook":
          break;
      }
      if (url) {
        Flits.popupWindow(
          url,
          platform.charAt(0).toUpperCase() + platform.slice(1) + " Share",
          window,
          700,
          700
        );
      }
    }
  );

  // Flits(document).on('click', '.flits-credit-popup-button', function(event) {
  //     if(Flits.Metafields.IS_REFER_PROGRAM_ON == 0) {
  //       Flits(".flits-credit-box-content-with-scroll .how-to-refer-btn").css("display","none");
  //     }
  // })
  // Flits(document).on('click', '.flits-credit-popup-button', function(event) {
  //   setTimeout(function() {
  //     if(Flits.Metafields.IS_REFER_PROGRAM_ON == 0) {
  //       Flits(".flits-credit-box-content-with-scroll .how-to-refer-btn").css("display","none");
  //     }
  //   }, 3500);
  // })

  // Flits(document).on('click', '.back', function(event) {
  //   if(Flits.Metafields.IS_REFER_PROGRAM_ON == 0) {
  //     Flits(".flits-credit-box-content-with-scroll .how-to-refer-btn").css("display","none");
  //   }
  // });

  Flits(document).on("Flits:Mammeto-Collections-Loaded", function (event) {
    setTimeout(function () {
      let collectionBtn = Flits(".flits-wishlist-colection");
      parseInt(Flits.wishlistButton.settings.isCountEnable) &&
        Flits(collectionBtn)
          .find(".flits-wls-count-btn")
          .css("display", "flex"),
        Flits(collectionBtn).show(),
        Flits(".flits-wishlist-colection:not(.flits-template)")
          .parent()
          .attr("data-flits", "wishlist-collection-parent");
    }, 1000);
    setTimeout(function () {
      Flits(".flits-wishlist-colection").each(function (index, ele) {
        let wishProdHandle = Flits(ele)
          .find(".flits-wls-button")
          .attr("data-flits-product-handle");
        if (Flits.isProductAddedInWishlist(wishProdHandle)) {
          Flits(ele)
            .find(".flits-wls-button")
            .removeClass("flits-wls-inactive");
          Flits(ele).find(".flits-wls-button").addClass("flits-wls-active");
          Flits(ele)
            .find(".flits-wls-button")
            .attr(
              "data-tippy-content",
              Flits.t(
                "Flits.locals.wishlisted_product_page.remove_from_wishlist_button",
                "Remove from Wishlist"
              )
            );
        }
      });
    }, 2000);
  });

  Flits(document).on("click", ".flits-front-buttons", function (event) {
    Flits(".flits-expanded-header-top").addClass("with-transition");
    Flits(".flits-credit-popup-header-part").addClass("fixed-header-inner");
    setTimeout(function () {
      Flits(".flits-expanded-header-top").removeClass("with-transition");
    }, 400);
  });

  if (Flits.request.page_type === "product") {
  let creditRuleCookie = getCookie('flits_credit_rules');
  if (creditRuleCookie) {
    let creditRuleLocal = localStorage.getItem("flits_credit_rules");
    if (creditRuleLocal) {
      let creditRuleLocalObj = JSON.parse(creditRuleLocal);
        addCreditEarnMessageProductPage(creditRuleLocalObj);
    } else {
      seprateCallRules();
    }
  } else {
    localStorage.removeItem("flits_credit_rules");
    seprateCallRules();
  }
}

function seprateCallRules(){
  // Flits.ajax({
  //       type: "GET",
  //       url: Flits.base_url + "/get-rules?token=" + Flits.token,
  //     }).done(function (resp) {
  //         resp.rules.all_rules_data.splice(3, 0, defaultRules);
  //         let objectToString = JSON.stringify(resp.rules.all_rules_data);
  //         localStorage.setItem("flits_credit_rules", objectToString);
  //         setCookie('flits_credit_rules', 'true', 5);
  //         addCreditEarnMessageProductPage(resp);
  //       })
  function commonGetRulesFromMetafields(resp) {
      resp.rules.all_rules_data.splice(3, 0, defaultRules);
      let objectToString = JSON.stringify(resp.rules.all_rules_data);
      localStorage.setItem("flits_credit_rules", objectToString);
      setCookie("flits_credit_rules", "true", 5);
      addCreditEarnMessageProductPage(resp);
    }
    if (window.flitsObjects.global.Metafields.GET_RULES_FOR_GUEST_CUSTOMERS) {
      commonGetRulesFromMetafields(window.flitsObjects.global.Metafields.GET_RULES_FOR_GUEST_CUSTOMERS);
    }else{
      Flits.ajax({
        type: "GET",
        url: Flits.base_url + "/get-rules?token=" + Flits.token,
      }).done(function (resp) {
        commonGetRulesFromMetafields(window.flitsObjects.global.Metafields.GET_RULES_FOR_GUEST_CUSTOMERS)  
      });
    }
}
  // Flits.ajax({
  //   type: "GET",
  //   url: Flits.base_url + "/get-rules?token=" + Flits.token,
  // })
  //   .done(function (resp) {
  //     resp.rules.all_rules_data.splice(3, 0, defaultRules);
  //     let objectToString = JSON.stringify(resp.rules.all_rules_data);
  //     localStorage.setItem("flits_credit_rules", objectToString);
  //     if (Flits.request.page_type === "product") {
  //       addCreditEarnMessageProductPage(resp);
  //     }
  //   })
  //   .fail(function (resp) {
  //     flitsSnackbar.show({
  //       text: resp.statusText,
  //       pos: "bottom-center",
  //       showAction: false,
  //       customClass: "flits-alert-danger",
  //     });
  //   })
  //   .always(function () {});
  function findCommonElements(arr1, arr2) {
    // Convert array1 elements to lowercase and then to a Set
    const set1 = new Set(arr1.map((item) => item.toLowerCase()));
    // Filter arr2's elements after converting them to lowercase
    return arr2.filter((item) => set1.has(item.toLowerCase()));
  }

  function addCreditEarnMessageProductPage(data) {
    let rules = data;
    var tempAmount = 0;
    Flits.each(rules, function (ruleIndex, ruleItem) {
      // switch (ruleItem.module_on) {
      // case 'order_number':

      // break;
      // case 'product_tag':
      if (ruleItem.module_on == "product_tag") {
        const result = findCommonElements(
          ruleItem.avails,
          window.flitsObjects.storeData.product.tags
        );
        if (result.length > 0) {
          if (!ruleItem.is_fixed) {
            tempAmount =
              tempAmount +
              ((window.flitsObjects.storeData.product.price / 100) *
                ruleItem.credits) /
                10000;
          } else {
            tempAmount = tempAmount + ruleItem.credits / 100;
          }
        }
      }
      // if (ruleIndex == rules.length -1) {
      //   if (!ruleItem.is_fixed) {
      //     tempAmount = tempAmount + (((window.flitsObjects.storeData.product.price / 100) * 300) / 10000);
      //   } else {
      //     tempAmount = tempAmount + ruleItem.credits / 100;
      //   }
      // }
      //   break;
      // default:
      // }
    });
    if (!0) {
      tempAmount =
        tempAmount +
        ((window.flitsObjects.storeData.product.price / 100) * 300) / 10000;
    } else {
      tempAmount = tempAmount + 100 / 100;
    }
    if (tempAmount > 0) {
      // tempAmount = Flits.formatMoney(tempAmount, Flits.money_format);
      let text = Flits.t(
        "Flits.locals.how_to_earn_credit_page.credit_on_product_tags",
        "You will earn <span>{{ credit }}</span> points on this product"
      );
      text = text.replace("{{ credit }}", Math.ceil(tempAmount));
      if (Flits(".flits-credit-on-product-tag").length <= 0) {
        const divElement = Flits(
          `<div style="" class="flits-credit-on-product-tag"></div>`
        );
        Flits(divElement).insertAfter(
          ".product-information-container .bulk-order"
        );
      }
      Flits(".product-information-container .flits-credit-on-product-tag").html(
        text
      );
    }
  }
  function addCreditEarnMessageCartPage(data, cartData) {
    let rules = data;
    var tempCartAmount = 0;
    var productTagCountTemp = 0;
    // Flits.each(rules, (function(ruleIndex, ruleItem) {
    // if(ruleItem.module_on == "order_number") {
    if (!0) {
      tempCartAmount =
        tempCartAmount + ((cartData?.total_price / 100) * 300) / 10000;
    } else {
      tempCartAmount = tempCartAmount + 100 / 100;
    }
    // }
    // }));
    for (const item of cartData.items) {
      Flits.ajax({
        type: "GET",
        url: `/products/${item.handle}.json`,
        async: false,
      })
        .done(function (productData) {
          if (
            productData.product.tags !== null &&
            productData.product.tags !== undefined &&
            productData.product.tags !== "" &&
            productData.product.variants[0].price > 0
          ) {
            data.forEach((ruleItem) => {
              switch (ruleItem.module_on) {
                case "product_tag":
                  const result = findCommonElements(
                    ruleItem?.avails,
                    productData.product?.tags?.split(",")
                  );
                  if (result.length > 0) {
                    if (!ruleItem.is_fixed) {
                      productTagCountTemp =
                        productTagCountTemp +
                        (productData.product.variants[0].price *
                          ruleItem.credits) /
                          10000;
                    } else {
                      productTagCountTemp =
                        productTagCountTemp + ruleItem.credits / 100;
                    }
                  }
                  break;
                default:
              }
            });
          }
        })
        .fail(function (resp) {})
        .always(function () {});
    }

    let totalAmount = tempCartAmount + productTagCountTemp;
    if (totalAmount) {
      const formElements = [".mm-ajaxcart-header"];
      formElements.map((item, index) => {
        let text = Flits.t(
          "Flits.locals.how_to_earn_credit_page.credit_on_product_tags",
          "You will earn <span>{{ credit }}</span> points on this purchase"
        );
        text = text.replace("{{ credit }}", Math.ceil(totalAmount));
        if (Flits(".flits-credit-earning-on-cart").length <= 0) {
          const divElement = Flits(
            `<div class="flits-credit-earning-on-cart"></div>`
          );
          Flits(divElement).insertAfter(Flits(item));
        }
        Flits(".flits-credit-earning-on-cart").html(text);
      });
    }
  }

  Flits(document).on("click", ".flits-view-order-button", function () {
    Flits(this).toggleClass("flits-active");
    Flits(this).parents(".flits-order-list-container").addClass("flits-active");
    var viewOrder = Flits(this).attr("data-view");
    Flits(".flits-custom-order-card").css("display", "none");
    Flits(".flits-order-table-header").css("display", "none");
    Flits(".flits-order-pagination").css("display", "none");
    Flits(`.flits-collaps-order-details[data-order-view='${viewOrder}']`).css(
      "display",
      "block"
    );
    Flits(this).parents(".flits-order-card").toggleClass("flits-active");
  });
  Flits(document).on("click", ".back-to-order", function () {
    Flits(this)
      .parents(".flits-order-list-container")
      .removeClass("flits-active");
    Flits(".flits-custom-order-card").css("display", "block");
    Flits(".flits-order-table-header").css("display", "block");
    Flits(".flits-order-pagination").css("display", "inline-flex");
    Flits(`.flits-collaps-order-details`).css("display", "none");
  });
  Flits(document).on("click", "#trackorder-button", function () {
    var trackOrder = Flits(this).attr("data-track-order");
    Flits(this).parents(".flits-collaps-order-details").css("display", "none");
    Flits(`.flits-track-order-data[data-track-order='${trackOrder}']`).css(
      "display",
      "block"
    );
  });
  Flits(document).on("click", ".back-to-order-detail", function () {
    Flits(this).parents(".flits-track-order-data").css("display", "none");
    Flits(this)
      .parents(".flits-order-card")
      .find(".flits-collaps-order-details")
      .css("display", "block");
  });
  
//Added By THOR
  Flits(".flits-profile-form input[type='tel'][name='phone']").on(
    "keydown paste",
    function (event) {
      // Get the key code of the pressed key
      var keyCode = event.keyCode || event.which;

      // Check if the key code corresponds to backspace (8) or if it's a paste event (86)
      if (keyCode === 8 || event.type === "paste") {
        // Prevent backspace and paste events
        event.preventDefault();
      }
    }
  );

  // Prevent input via keypress event
  Flits(".flits-profile-form input[type='tel'][name='phone']").on(
    "keypress",
    function (event) {
      // Prevent keypress events
      event.preventDefault();
    }
  );
})(Flits);
