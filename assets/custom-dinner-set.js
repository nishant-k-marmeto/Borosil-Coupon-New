$(document).ready(function () {
  $(document).on("click", ".dinner-set__pop-button", function (e) {
    $(".dinner-set__modal").show();
    $("body").css("overflow", "hidden");
  });

  $(document).on("click", ".close-dnr__modal", function (e) {
    $(".dinner-set__modal").hide();
    $("body").css("overflow", "");
  });

  //hide and show the quantity drop down
  $(document).on("click", ".dnr-options-qty", function (e) {
    let parent = $(this).closest(".dnr-card__inner");
    parent.find(".dnr-list-item__wrapper").toggleClass("show-drop");
  });
  //let the user input the value if quantity more than 10
  $(document).on("click", ".dnr-more-qty", function (e) {
    let parent = $(this).closest(".dnr-card__wrapper");
    parent.find(".dnr-list-item__wrapper").toggleClass("show-drop");
    parent.find(".dnr-variant-input").show();
    parent.find(".dnr-options-qty").hide();
    parent.find(".dnr-variant-input").val("10");
    maxQuantityErrorHandle(parent);
    if (parseInt(parent.find(".dnr-variant-input").val()) > 0) {
      parent.addClass("selected");
    }
    calculateQtyPrice();
    disableEnableAtc();
  });
  //update the quantity when user selects the quantity from the drop down list
  $(document).on("click", ".dnr-list-item:not(.dnr-more-qty)", function (e) {
    let parent = $(this).closest(".dnr-card__wrapper");
    let currValue = $(this).attr("data-value");
    parent.find(".dnr-variant-input").val(currValue);
    parent.find(".dnr-list-item__wrapper").toggleClass("show-drop");
    parent.find(".dnr-qty-value").html(currValue);

    if (parent.hasClass("selected")) {
      parent.toggleClass("selected");
    }
    maxQuantityErrorHandle(parent);
    let inputValue = parseInt(parent.find(".dnr-variant-input").val());
    let maxValue = parseInt(parent.attr("data-dnr-variant-inventory"));
    if (inputValue > 0 && inputValue <= maxValue) {
      parent.addClass("selected");
      parent.find(".dnr-qty-value").html(inputValue);
    } else {
      // parent.find(".dnr-variant-input").val(maxValue);
      // parent.find(".dnr-list-item__wrapper").removeClass("show-drop");
      // parent.find(".dnr-qty-value").html(maxValue);
      //parent.find(`[data-value="${maxValue}"]`).click();
      //parent.removeClass("selected");
    }
    disableEnableAtc();
    calculateQtyPrice();
  });

  //error if the quantity is zero
  function cardSelectionError(element) {
    $(element).find(".dnr-card-error").show().delay(3000).hide(1);
    $(element)
      .addClass("dnr-shake")
      .on("animationend", function (e) {
        $(this).removeClass("dnr-shake").off("animationend");
      });
  }

  //atc disable enable functionality
  function disableEnableAtc() {
    if ($(".dnr-card__wrapper.selected").length <= 0) {
      $(".dinner-atc").addClass("disabled");
    } else {
      $(".dinner-atc").removeClass("disabled");
    }
  }

  //atc disable enable functionality
  function minOrderValue() {
    const currentPrice = parseInt(calculateQtyPrice());
    let minOrderValueQualified = true;
    if (currentPrice < 599) {
      $(".dinner-min__value-error").show();
      setTimeout(function() {
        $(".dinner-min__value-error").hide();
      }, 3000);
      minOrderValueQualified = false;
    } 
    return minOrderValueQualified;
  }

  //money formattor
  function moneyFormattor(number) {
    number = parseFloat(number);
    return number.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      style: "currency",
      currency: "INR",
    });
  }

  //calculate the quantity and price of selected cards
  function calculateQtyPrice() {
    let selectCrds = $(".dnr-card__wrapper.selected");
    let totalQty = 0;
    let totalPrice = 0;
    for (let i = 0; i < selectCrds.length; i++) {
      let currentQty = $(selectCrds[i]).find(".dnr-variant-input").val();
      let currentPrice = $(selectCrds[i]).attr("data-dnr-price");

      totalQty += parseInt(currentQty);
      totalPrice += parseInt(currentPrice) * parseInt(currentQty);
    }
    $(".dnr-x-pcs").html(totalQty);
    $(".dnr-y-rs").html(moneyFormattor(totalPrice));
    return totalPrice;
  }

  //
  function maxQuantityErrorHandle(element) {
    let quantity = $(element).find(".dnr-variant-input").val();
    let maxQuantity = $(element).attr("data-dnr-variant-inventory");
    console.log(maxQuantity, quantity);
    if (parseInt(maxQuantity) < parseInt(quantity)) {
      $(element).find(".dnr-card-inventory-error").show().delay(3000).hide(1);
      $(element)
        .find(".dnr-card__qty")
        .addClass("dnr-shake")
        .on("animationend", function (e) {
          $(this).removeClass("dnr-shake").off("animationend");
        });
      $(element).find(".dnr-variant-input").val(maxQuantity);
    }
  }

  //if the input value is empty or 0 set to default and quantity and auto select the product card
  $(".dnr-variant-input").focusout(function () {
    let parent = $(this).closest(".dnr-card__wrapper");
    if (!($(this).val().length >= 1) || parseInt($(this).val()) <= 0) {
      parent.find(".dnr-variant-input").val("0");
      parent.find(".dnr-qty-value").html("0");
      parent.find(".dnr-variant-input").hide();
      parent.find(".dnr-options-qty").show();
      cardSelectionError(parent);
      if (parent.hasClass("selected")) {
        parent.toggleClass("selected");
      }
    } else if (parseInt($(this).val()) > 0) {
      parent.addClass("selected");
    }
    maxQuantityErrorHandle(parent);
    if (parseInt(parent.find(".dnr-variant-input").val()) > 0) {
      parent.addClass("selected");
    }
    disableEnableAtc();
    calculateQtyPrice();
  });

  //select product card only outside the quantity container
  //when unselected the product card make the quantity to 0
  $(document).on("click", ".dnr-card__wrapper", function (e) {
    if (!$(e.target).hasClass("no-trig")) {
      let selectQuantity = $(this).find(".dnr-variant-input").val();
      if (selectQuantity > 0) {
        if ($(this).hasClass("selected")) {
          $(this).find(".dnr-qty-value").html("0");
          $(this).find(".dnr-variant-input").val("0");
        }
        $(this).toggleClass("selected");
      } else {
        cardSelectionError($(this));
      }
      disableEnableAtc();
      calculateQtyPrice();
    }
  });

  //dinner set atc functionality
  $(document).on("click", ".dinner-atc", function (e) {



    let dinnerAtcQualified = minOrderValue();
    if (!dinnerAtcQualified) return;

    let selectedCards = $(".dnr-card__wrapper.selected");
    if (selectedCards && selectedCards.length > 0) {
      const formData = {
        items: [],
      };
      for (let i = 0; i < selectedCards.length; i++) {
        let currId = $(selectedCards[i]).attr("data-dnr-variant");
        let currQty = $(selectedCards[i]).find(".dnr-variant-input").val();
        let mainProductId = $(selectedCards[i]).attr("data-main-product-id");
        let mainProductHandle = $(selectedCards[i]).attr(
          "data-main-product-handle"
        );

        formData.items.push({
          id: currId,
          quantity: currQty,
          properties: {
            "bundle-id": mainProductId,
            "bundle-handle": mainProductHandle,
          },
        });
      }

      $(".dinner-atc").css("display", "none");
      $(".dinner-atc_loader").css("display", "block");

      console.log(formData);

      $.ajax({
        method: "POST",
        url: "/cart/add.js",
        dataType: "json",
        cache: false,
        timeout: 5000,
        data: formData,
        success: function () {
          $(".dinner-atc").css("display", "inline-block");
          $(".dinner-atc_loader").css("display", "none");
          mmajaxcart.CartCountHandler();
          mmajaxcart.AjaxcartRender();
          setTimeout(function () {
            mmajaxcart.AjaxcartOpen();
          }, 1500);
          console.log((res) => console.log(res));
        },
        error: function (jqXHR, textStatus, errorThrown) {
          if (jqXHR.status === 422) {
            let ress = JSON.parse(jqXHR.responseText);
            console.log(ress.description);
            alert(ress.description);
          } else {
            alert("Error while adding to cart");
          }
          $(".dinner-atc").css("display", "inline-block");
          $(".dinner-atc_loader").css("display", "none");
        },
      });
    }
  });
});

// //ajax-cart functionality
// $(document).ready(function () {
//   //toggle the drop down
//   $(document).on("click", ".main-bundle__items-header", function (e) {
//     let parent = $(this).closest(".main-bundle__items-wrapper");
//     parent.find(".main-bundle__items").toggleClass("open");
//     $(this).toggleClass("open");
//   });

//   //bundle remove the products from the cart
//   $(document).on("click", ".main-bundle__delete", function () {
//     let parent = $(this).closest(".main-bundle__wrapper");
//     parent.find(".main-bundle__delete").hide();
//     parent.find(".loader").show();

//     let idArr = $(this).attr("data-delete-bundle").split(",");
//     const update = {};
//     idArr.forEach(function (item) {
//       update[item] = "0";
//     });

//     fetch("/cart/update.js", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ updates: update }),
//     }).then((data) => {
//       mmajaxcart.AjaxcartRender(), mmajaxcart.CartCountHandler();
//     });
//   });
// });
