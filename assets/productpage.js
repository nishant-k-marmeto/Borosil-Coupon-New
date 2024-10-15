/*--------PRODUCT PAGE JS--------*/
/*-------Warning: Adding more non-product page JS here is like bringing a herd of cats to a dog party. Chaos will ensue!------------*/

/*-------Hydra-customizer-js-starts------------*/
let customizerModal = document.getElementById("customizer-Modal");
let customizerButton = document.getElementById("customizer-button");
let customizerClose = document.getElementsByClassName("customizer_close")[0];
if (customizerButton) {
  customizerButton.onclick = function () {
    customizerModal.style.display = "block";
    document.querySelector('.modal-customize-body').style.display = "block";
    document.querySelector('.modal-atc-body').style.display = "none";
    document.getElementById('customized_Text').value="";
    runCustomization();
    document.querySelector("body").style.overflow = "scroll";
    if (document.querySelector(".tab-container.emoji-available")){
      document.querySelector('.tab-button').click();
    }
  };
}

if (customizerClose) {
  customizerClose.onclick = function () {
    customizerModal.style.display = "none";
    document.querySelector("body").style.overflow = "scroll";
  };
}

window.onclick = function (event) {
  if (event.target == customizerModal) {
    customizerModal.style.display = "none";
  }
};

$(document).on("click", ".customize-soldout-button", function (ev) {
  ev.preventDefault();
  customizerModal.style.display = "none";
});

$(document).ready(function () {
  let ssHandle = sessionStorage.getItem("personalise");
  let url = window.location.href;
  let urlHandle = url.split("products/")[1];
  if (ssHandle == urlHandle) {
    $("#customizer-button").click();
    sessionStorage.removeItem("personalise");
  }
});

let customizerBulkModal = document.getElementById("bulk-customizer-Modal");
let customizerBulkButton = document.getElementById(
  "modal-bulk-customizer-button"
);

let customizerBulkClose = document.getElementsByClassName(
  "bulk-customizer_close"
)[0];

if (customizerBulkButton) {
  customizerBulkButton.onclick = function () {
    customizerBulkModal.style.display = "block";
    document.querySelector('.modal-bulk-customize-body').style.display = "block";
    document.querySelector('.modal-bulk-atc-body').style.display = "none";
    customizerModal.style.display = "none";
  };
}

if (customizerBulkClose) {
  customizerBulkClose.onclick = function () {
    customizerBulkModal.style.display = "none";
  };
}

window.onclick = function (event) {
  if (event.target == customizerBulkModal) {
    customizerBulkModal.style.display = "none";
  }
};
/*-------Hydra-customizer-js-ends------------*/

/*----------------main-product-details-starts-------------------*/

/*----------------------------------------------------------------------------------------P1-------------------*/

//money formattor
function moneyFormatter(number) {
  number = parseInt(number / 100);
  return number.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "INR",
  });
}

class ProductInfo extends HTMLElement {
  constructor() {
    super();

    this.variantList = this.querySelector(".variant-options-list");
    this.variantListContainer = this.querySelector(
      ".purchase-options-variants"
    );
    this.variantItems = this.querySelectorAll(".variant-options-listItem");
    this.quantityList = this.querySelector(
      ".purchase-options-quantity-selector-list"
    );

    this.quantityListContainer = this.querySelector(
      ".purchase-options-quantity"
    );
    this.quantityItems = this.querySelectorAll(
      ".purchase-options-quantity-selector-listitem"
    );
    this.purchaseOptionsVariantsDisplay = this.querySelector(
      ".purchase-options-variants-toDisplay"
    );
    this.inputVariantQuantity = this.querySelector(
      ".purchase-options-variants-input"
    );

    // Click event for variant toggling dropdown
    this.variantListContainer?.addEventListener("click", (e) => {
      this.variantList.classList.toggle("dropdown-open");
    });

    document.addEventListener("click", (event) => {
      const variantClicked = event.target.closest(".purchase-options-variants");
      const quanityClicked = event.target.closest(".qty");
      if (variantClicked === null) {
        this.variantList?.classList.remove("dropdown-open");
      }
      if (quanityClicked === null) {
        this.quantityList?.classList.remove("dropdown-open");
      }
    });

    // Click event for quantity toggling dropdown
    if (this.quantityListContainer) {
      this.quantityListContainer.addEventListener("click", () => {
        this.quantityList.classList.toggle("dropdown-open");
      });
    }
    // Event for handling click events on variant list items
    this.variantItems.forEach((listItem) => {
      listItem.addEventListener("click", (event) => {
        if (listItem && !listItem.classList.contains("is-selected")) {
          this.selectVariant(listItem);
        }
      });
    });

    // Event for handling click events on quantity list items
    this.quantityItems.forEach((listItem) => {
      listItem.addEventListener("click", (event) => {
        if (listItem && !listItem.classList.contains("is-selected")) {
          this.selectedQuantity(listItem);
        }
      });
    });

    //handle input change for variant quantity
    if (this.inputVariantQuantity) {
      this.inputVariantQuantity.addEventListener("input", (event) => {
        this.variantInventoryHandling();
      });
    }

    if (this.getAttribute("data-volume-template") == "true") {
      // Event for handling click event on Volume item selection
      this.onvolumechange = this.querySelectorAll(
        '.volumne-discounts__container input[type="radio"]'
      );

      this.onvolumechange.forEach((radioButton) => {
        radioButton.addEventListener("change", () => {
          if (radioButton.checked) {
            this.selectedVolume(radioButton);
          }
        });
      });
    }
  }

  //on DOM entry trigger the functions
  connectedCallback() {
    this.selectedVariantCallback();
  }

  //handle the variant select on page load
  selectedVariantCallback() {
    const selectedVariant = this.querySelector(
      ".variant-options-listItem.is-selected"
    );
    if (selectedVariant) {
      this.selectVariant(selectedVariant);
    }
  }

  //toggle is-selected for variant dropdown
  selectVariant(element) {
    this.variantItems.forEach((otherItem) => {
      otherItem.classList.remove("is-selected");
    });

    element.classList.add("is-selected");
    this.selectedVariantHandling(element);

    //product unavailable function
    const currentVariant = element.getAttribute("data-variant-handle");
    this.changeAvailability(currentVariant);
  }

  //toggle is selected for quantity dropdown
  selectedQuantity(element) {
    this.quantityItems.forEach((otherItem) => {
      otherItem.classList.remove("is-selected");
    });

    element.classList.add("is-selected");
    this.selectedQuantityHandling(element);
  }

  selectedVolume(element) {
    const selectedQuantity = element.dataset.value.trim();

    this.onvolumechange.forEach((otherItem) => {
      otherItem.removeAttribute("checked");
    });

    element.setAttribute("checked", "checked");

    this.quantityItems.forEach((listItem) => {
      if (listItem.getAttribute("data-value") === selectedQuantity) {
        this.selectedQuantity(listItem);
      }
    });
  }

  //handle variant change
  selectedVariantHandling(element) {
    let currentVariantSku = document.querySelector('.product-information-container .variant-options-listItem.is-selected')?.getAttribute('data-variant-sku');
    if (!currentVariantSku) currentVariantSku = document.querySelector('.section--product-details')?.getAttribute('data-variant-sku');

    let pincodeValue = document.querySelector('#pincodeInput').value;
    if (pincodeValue.trim() !== '') {
        checkNdd(pincodeValue, currentVariantSku);
        console.log("ndd updated");
    }
    
    const variantTitle = element.dataset.variantTitle;
    const productVariantAvailable = element.dataset.variantAvailable;
    const selectedVariantPrice = parseInt(element.dataset.variantPrice);
    const selectedVariantMaxPrice = parseInt(element.dataset.variantMaxprice);

    // Set variant title in the display
    if (this.purchaseOptionsVariantsDisplay)
      this.purchaseOptionsVariantsDisplay.innerText = variantTitle;

    // ATC hide and show functionality
    const productAtc =
      this.querySelector(".product-atc") ||
      this.querySelector(".gift-card-atc") ||
      this.querySelector("#customizer-button");
    const productSoldoutButton = this.querySelector(".product-soldout__button");
    productAtc.style.display =
      productVariantAvailable !== "true" ? "none" : "block";
    if (productSoldoutButton)
      productSoldoutButton.style.display =
        productVariantAvailable !== "true" ? "block" : "none";

    // Price change functionality
    const mainPrice = this.querySelector(".main-price");
    const comparedPrice = this.querySelector(".compared-price");
    const pricePercentageOff = this.querySelector(".price-percentage-off");
    mainPrice.innerHTML = moneyFormatter(selectedVariantPrice);
    if (selectedVariantMaxPrice > selectedVariantPrice) {
      const selectedVariantDiscount = parseInt(
        ((selectedVariantMaxPrice - selectedVariantPrice) /
          selectedVariantMaxPrice) *
          100
      );
      comparedPrice.innerHTML = moneyFormatter(selectedVariantMaxPrice);
      pricePercentageOff.innerHTML = `${selectedVariantDiscount}% off`;
    }

    // Volume discount change on variant change
    if (this.getAttribute("data-volume-template") == "true") {
      var volumeQtyRule = JSON.parse(
        this.querySelector(".volumne-discounts__container").getAttribute(
          "data-qty-rule"
        )
      );
      var originalPrice = this.querySelector(".volumne-discounts__container");
      var volumeLabel = this.querySelectorAll(
        ".volumne-discounts__container label"
      );
      var totalDiscount = 0;

      originalPrice.setAttribute("data-original-price", selectedVariantPrice);
      originalPrice.setAttribute(
        "data-compare-at-price",
        selectedVariantMaxPrice
      );

      // Define the function to find discount based on quantity
      function findDiscountRule(qty) {
        for (var i = 0; i < volumeQtyRule.length; i++) {
          if (qty === volumeQtyRule[i].qty) {
            return volumeQtyRule[i].discount;
          }
        }

        return 0;
      }
      function findDiscountShowRule(qty) {
        for (var i = 0; i < volumeQtyRule.length; i++) {
          if (qty === volumeQtyRule[i].qty) {
            return volumeQtyRule[i].showDiscount;
          }
        }

        return 0;
      }

      volumeLabel.forEach((item) => {
        var qty = parseInt(item.getAttribute("data-label"));
        var slectedVariantPrice = originalPrice.getAttribute(
          "data-original-price"
        );
        let selectedVariantCompareAtPrice = originalPrice.getAttribute(
          "data-compare-at-price"
        );

        var discountPercent = findDiscountRule(qty);
        var discountShowPercent = findDiscountShowRule(qty);
        var multipliedOriginalPrice = slectedVariantPrice * qty;
        var discountAmount = (multipliedOriginalPrice * discountPercent) / 100;
        totalDiscount = (multipliedOriginalPrice - discountAmount) / 100;

        item.querySelector(".volume-discounts__price .main-price").innerHTML =
          "₹" + (multipliedOriginalPrice / 100).toFixed(0);
        item.querySelector(
          ".volume-discounts__price .discount-price-price"
        ).innerHTML = "₹" + totalDiscount.toFixed(0);
        item.querySelector(
          ".volume-discounts__price .discount_percentage"
        ).innerHTML = discountShowPercent + "%";
        item.querySelector(
          ".volume-discounts__price .compare__at__price"
        ).innerHTML = "₹" + selectedVariantCompareAtPrice / 100;

        if (discountPercent === 0) {
          item.querySelector(
            ".volume-discounts__price .main-price"
          ).style.display = "none";
          item.querySelector(
            ".volume-discounts__price .discount_percentage"
          ).style.display = "none";
          item.querySelector(
            ".volume-discounts__price .compare__at__price"
          ).style.display = "block";
          item.querySelector(
            ".volume-discounts__price .price-percentage-off"
          ).style.display = "block";
        } else {
          item.querySelector(
            ".volume-discounts__price .main-price"
          ).style.display = "block";
          item.querySelector(
            ".volume-discounts__price .discount_percentage"
          ).style.display = "block";
          item.querySelector(
            ".volume-discounts__price .compare__at__price"
          ).style.display = "none";
          item.querySelector(
            ".volume-discounts__price .price-percentage-off"
          ).style.display = "none";
        }
      });
    }

    //check the inventory for the selected variant
    this.variantInventoryHandling();
  }

  //handle quantity change and handle error
  selectedQuantityHandling(element) {
    const selectedQuantity = parseInt(element.dataset.value);
    if (selectedQuantity < 10) {
      this.querySelector(
        ".purchase-options-quantity-selector-value"
      ).innerHTML = selectedQuantity;
    } else if (selectedQuantity >= 10) {
      const quantityInput = this.querySelector(
        ".purchase-options-variants-input"
      );
      this.querySelector(".purchase-options-quantity").style.display = "none";
      quantityInput.classList.add("show");
      quantityInput.value = 10;
      quantityInput.focus();
    }
    this.variantInventoryHandling();
  }

  //check the inventory and handle error
  variantInventoryHandling() {
    let requiredQuantity = 0;
    const selectedQuantity = parseInt(
      this.querySelector(
        ".purchase-options-quantity-selector-listitem.is-selected"
      ).dataset.value
    );
    const inputQuantity = parseInt(
      this.querySelector(".purchase-options-variants-input.show")?.value
    );
    const availableQuantity = parseInt(
      this.querySelector(".variant-options-listItem.is-selected")?.dataset
        .variantQuantity
    );
    const variantAvailable = this.querySelector(
      ".variant-options-listItem.is-selected"
    ).dataset.variantAvailable;
    const inputBoxOpen = this.querySelector(
      ".purchase-options-variants-input.show"
    );
    const quantityError = this.querySelector(".ProductErrorMessage");
    const productAtc =
      this.querySelector(".product-atc") ||
      this.querySelector(".gift-card-atc") ||
      this.querySelector("#customizer-button");

    if (inputBoxOpen && (isNaN(inputQuantity) || inputQuantity == 0)) {
      requiredQuantity = 0;
    } else if (inputBoxOpen && inputQuantity) {
      requiredQuantity = inputQuantity;
    } else {
      requiredQuantity = selectedQuantity;
    }
    if (requiredQuantity <= 0) {
      productAtc.classList.add("is-disabled");
    } else if (
      requiredQuantity > availableQuantity &&
      variantAvailable === "true"
    ) {
      quantityError.style.display = "block";
      quantityError.innerHTML = `Quantity exceeds more than ${availableQuantity}`;
      productAtc.classList.add("is-disabled");
    } else {
      quantityError.style.display = "none";
      if (productAtc) productAtc.classList.remove("is-disabled");
    }
  }

  //hide the unavailable product for the selected variant
  changeAvailability(currentVariant) {
    this.querySelectorAll(".product-group__item").forEach((productItem) => {
      if (productItem) {
        let productUnavailable = true;
        const variantItems = productItem.querySelectorAll(
          "[data-variant-title-handle]"
        );
        for (let i = 0; i < variantItems.length; i++) {
          let variantItem = variantItems[i];
          const variantItemHandle = variantItem.getAttribute(
            "data-variant-title-handle"
          );
          const variantItemAvailable = variantItem.getAttribute(
            "data-variant-available"
          );
          const independentVariants = document
            .querySelector("[data-independent-variants]")
            ?.getAttribute("data-independent-variants");

          if (
            (currentVariant === variantItemHandle ||
              independentVariants === "true") &&
            variantItemAvailable === "true"
          ) {
            productUnavailable = false;
            break;
          }
        }
        if (productUnavailable) {
          productItem.classList.add("not-available");
        } else {
          productItem.classList.remove("not-available");
        }
      }
    });
  }
}

customElements.define("product-info", ProductInfo);

//The below code is used to add the bundle products to the cart
class VirtualProductButton extends HTMLElement {
  constructor() {
    super();
    // Find the button inside the custom element and store a reference to it
    this.virtualBundleAddToCartButton = this.querySelector('.virtual-bundle-product-atc');
    this.virtualBundleLoader = this.querySelector('.product-atc_loader');
  }

  connectedCallback() {
    // Find the closest parent product-info element
    this.productInfoElement = this.closest('product-info');

    if (this.productInfoElement) {
      // Find the product-title element within product-info
      this.productTitleElement = this.productInfoElement.querySelector('.product-title');
      this.mainProductId = this.productInfoElement.querySelector('.product-title');

      if (this.productTitleElement && this.mainProductId){
        this.productTitle = this.productTitleElement.getAttribute('data-product-handle');
        this.mainProductId = this.mainProductId.getAttribute('data-product-id');
      } else {
        this.productTitle = '';
        this.mainProductId = '';
      }
    }

    // Ensure the button exists before adding the event listener
    if (this.virtualBundleAddToCartButton) {
      this.virtualBundleAddToCartButton.addEventListener('click', () => {
        this.pincodeElement = document.querySelector('pincode-element');
        let deliveryPin = 0;
        if (this.pincodeElement) {
          const deliveryPinElement = this.pincodeElement.querySelector("#pincodeInput").value;
          
          if (deliveryPinElement != "") {
            deliveryPin = parseInt(deliveryPinElement);
          }
        } else {
          deliveryPin = 0;
        }

        let pincodeValue = localStorage.getItem('store_Pincode');
        
        if (deliveryPin >= 0 && pincodeValue !== "null") {
          this.virtualBundleAddToCart();
        } else {
          document.querySelector("html, body").animate(
            {
              scrollTop: document.querySelector(".product-information-container")
                .offsetTop,
            },
            2000
          );

          document.querySelector(".delivery-check").classList.add("shake_div");
          setTimeout(
            () => document.querySelector(".delivery-check").classList.remove("shake_div"),
            1000
          );

          const productErrorMessage = document.querySelector(".ProductErrorMessage");
          productErrorMessage.style.display = "block";
          productErrorMessage.innerHTML = "Please check the delivery PINCODE";
        }
      });
    }

    // Add equivalent of the jQuery code
    const deliveryPenElement = document.querySelector('.DeveryPenIfavailable');
    if (deliveryPenElement) {
      deliveryPenElement.addEventListener('click', () => {
        const deliveryText = document.querySelector('.delivery-text');
        const pincodeInput = document.querySelector('.pincode-input');
        const pincodeOutput = document.querySelector('.pincode-output');
        const input = pincodeInput.querySelector('input');

        if (deliveryText) {
          deliveryText.style.color = '#000000';
          deliveryText.innerHTML = 'Check Delivery';
        }

        if (pincodeInput) pincodeInput.style.display = 'block';
        if (pincodeOutput) pincodeOutput.style.display = 'none';
        if (input) input.value = '';
        
        localStorage.setItem('store_Pincode', null);

        if (input && input.value.length == 6) {
          pincodeInput.querySelector('button').style.color = '#013564';
        } else {
          pincodeInput.querySelector('button').style.color = '#B2B2B2';
        }
      });
    }
  }

  // This function will run when the button is clicked
  virtualBundleAddToCart() {
    const virtualBundleVariantIds = this.virtualBundleAddToCartButton.getAttribute('data-virtual-bundling-variant-ids');
    const mainProductUrl = this.virtualBundleAddToCartButton.getAttribute('data-main-product-url');
    const virtualBundleDiscountPercentage = this.virtualBundleAddToCartButton.getAttribute('data-bundle-discount-percentage');

    this.virtualBundleAddToCartButton.style.display = "none";
    this.virtualBundleLoader.style.display = "block";
    let variantIds = virtualBundleVariantIds.split(',');
    let variantItems = variantIds.map((item, index) => ({
      id: item.trim(),
      quantity: 1,
      index,
      properties: {
        virtualProductBundleTitle: this.productTitle,
        virtualBundleMainProductId: this.mainProductId,
        mainProductUrl: mainProductUrl,
        Bundle_discount: virtualBundleDiscountPercentage
      }
    }));

    let virtualFormData = {
      items: variantItems
    }

    fetch("/cart/add.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(virtualFormData),
    })
      .then((response) => response.json())
      .then((data) => {
        this.virtualBundleAddToCartButton.style.display = "block";
        this.virtualBundleLoader.style.display = "none";
        mmajaxcart.CartCountHandler();
        mmajaxcart.AjaxcartRender();
        setTimeout(() => mmajaxcart.AjaxcartOpen(), 1500);
      })
      .catch((error) => {
        alert("Error while adding to cart");
        this.virtualBundleAddToCartButton.style.display = "block";
        this.virtualBundleLoader.style.display = "none";
      });
  }
}

customElements.define("virtual-product-button", VirtualProductButton);

document.querySelectorAll('.mm-ajaxcart-remove-item').forEach(button => {
  button.addEventListener('click', function () {
    const mainProductKey = this.dataset.key;

    // Find and remove all bundle items with the same main product ID
    fetch(`/cart/update.js`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        updates: {
          [mainProductKey]: 0
        }
      })
    }).then(response => response.json())
      .then(data => {
        mmajaxcart.CartCountHandler();
        mmajaxcart.AjaxcartRender();
        setTimeout(() => mmajaxcart.AjaxcartOpen(), 1500);
        if (data.message && data.message == "Cart Error")
          alert(data.description);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });
});


document.addEventListener("DOMContentLoaded", (event) => {
  let elements = document.querySelectorAll(".variant-options-listItem");

  elements.forEach((element) => {
    if (
      element.classList.contains("hide-variant") ||
      element.classList.contains("is-selected") || 
      element.classList.contains("sold-out-variant")
    ) {
      document.querySelector("product-info").selectedVariantHandling(element);
      document.querySelector("product-info").selectedVariantCallback();
    }
  });

  
});

/*----------------------------------------------------------------------------------------P2-------------------*/

//product gallery slider function
function createSlider() {
  $(() => {
    $slider = $(".product-main-images").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: true,
      infinite: false,
      arrows: false,
      asNavFor: ".product-thumbnail-images",
    });
    let $enableArrow = $(".product-main-images .no-dragging");
    $slider.slick("slickSetOption", "arrows", $enableArrow.length > 0, true);

    $(".product-main-images").on(
      "afterChange",
      function (event, slick, currentSlide, nextSlide) {
        let $noSlide = $(".product-main-images .slick-current.no-dragging");
        let $slide = $(".product-main-images .slick-current .Magic360~");
        $slider.slick(
          "slickSetOption",
          "draggable",
          $slide.length == 0 && $noSlide.length == 0,
          false
        );
        $slider.slick(
          "slickSetOption",
          "swipe",
          $slide.length == 0 && $noSlide.length == 0,
          false
        );
        $slider.slick(
          "slickSetOption",
          "touchMove",
          $slide.length == 0 && $noSlide.length == 0,
          false
        );
      }
    );

    $(".product-thumbnail-images").slick({
      asNavFor: ".product-main-images",
      slidesToShow: 5,
      slidesToScroll: 1,
      infinite: false,
      focusOnSelect: true,
      vertical: true,
      dots: false,
      arrows: true,
      prevArrow:
        '<button class="slick-arrow slick-up"><img class="thumbnail_arrow_up" src="https://cdn.shopify.com/s/files/1/0551/8009/9722/t/248/assets/slider_arrow.svg?v=44685367292513482661679990093" alt="circle left"></button>',
      nextArrow:
        '<button class="slick-arrow slick-down"><img class="thumbnail_arrow_down" src="https://cdn.shopify.com/s/files/1/0551/8009/9722/t/248/assets/slider_arrow.svg?v=44685367292513482661679990093" alt="circle left"></button>',
      responsive: [
        {
          breakpoint: 2561,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 426,
          settings: "unslick",
        },
      ],
    });
  });
}
$(document).ready(function () {
  createSlider();
});

//retrieve the valid pincode if already validated
class PincodeElement extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.checkPincode();
  }
  checkPincode() {
    const savedPincode = localStorage.getItem("store_Pincode");
    if (savedPincode && savedPincode.length == 6) {
      this.classList.add("hide-input");
      this.querySelector(".delivery-text").innerText =
        "Delivery available to : ";
      this.querySelector(".DeliveryPinIfavailable").innerText = savedPincode;
    }
  }
}
customElements.define("pincode-element", PincodeElement);

/*----------------------------------------------------------------------------------------P3-------------------*/

//Add To Cart
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("product-atc")) {
    const productAtc = document.querySelector(".product-atc") ||
      document.querySelector(".gift-card-atc") ||
      document.querySelector("#customizer-button");
    
    const productAtcLoader = document.querySelector(".product-atc_loader");
    const deliveryPin = parseInt(
      document.querySelector(".DeliveryPinIfavailable").innerHTML
    );

    event.preventDefault();
    let productNDDStatus = productAtc.getAttribute('data-ndd-available');
    
    if (event.target.classList.contains("is-disabled")) return;

    const responseSuccessClickpost=document.querySelector('#response-success').classList.contains("active");
    if (deliveryPin > 0 || responseSuccessClickpost) {
      const offerProductsElement = document.querySelector("#offer-product");
      const isOfferChecked =
        offerProductsElement && offerProductsElement.checked;

      productAtc.style.display = "none";
      productAtcLoader.style.display = "block";

      const selectedVariant = document.querySelector(
        ".variant-options-listItem.is-selected"
      );
      const variantId = selectedVariant.dataset.variant;
      const variantQuantity = parseInt(selectedVariant.dataset.variantQuantity);
      const selectedQuantity =
        document.querySelector(".purchase-options-quantity").style.display ===
        "none"
          ? document.querySelector(".purchase-options-variants-input").value
          : document.querySelector(
              ".purchase-options-quantity-selector-listitem.is-selected"
            ).dataset.value;

      if (
        parseInt(selectedQuantity) > 0 &&
        parseInt(selectedQuantity) <= variantQuantity
      ) {

          let nddStatusMessage ="";
          if (productNDDStatus == "true") {
            nddStatusMessage = "Avaliable";
          }
        
        const formData = {
          items: [
            {
              id: variantId,
              quantity: selectedQuantity,
              properties: {
                _FrequentlyBoughtGroup: isOfferChecked
                  ? document.querySelector("#offer-product-handle").value
                  : null,
                ...(nddStatusMessage && { _NextDayDelivery: nddStatusMessage }),
              },
            },
            isOfferChecked
              ? {
                  id: JSON.parse(offerProductsElement.value),
                  quantity: 1,
                  properties: {
                    [document.querySelector("#offer-product-handle").value]:
                      document.querySelector("#offer-product-key").value,
                  },
                }
              : null,
          ].filter(Boolean),
        };

        fetch("/cart/add.js", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
          .then((response) => response.json())
          .then((data) => {
            productAtc.style.display = "block";
            productAtcLoader.style.display = "none";
            mmajaxcart.CartCountHandler();
            mmajaxcart.AjaxcartRender();
            setTimeout(() => mmajaxcart.AjaxcartOpen(), 1500);
            if (data.message && data.message == "Cart Error")
              alert(data.description);
          })
          .catch((error) => {
            alert("Error while adding to cart");
            productAtc.style.display = "block";
            productAtcLoader.style.display = "none";
          });
      } else {
        if (parseInt(selectedQuantity) < 1) alert("Add quantity");
        if (parseInt(selectedQuantity) > variantQuantity)
          alert(`Cannot add more than ${variantQuantity}`);
      }
    } else {
      if (
        document.querySelector(".qty-atc").classList.contains("qty-atc_sticky")
      ) {
        document.querySelector("html, body").animate(
          {
            scrollTop: document.querySelector(".product-information-container")
              .offsetTop,
          },
          2000
        );
      }

      document.querySelector(".delivery-check").classList.add("shake_div");
      setTimeout(
        () =>
          document
            .querySelector(".delivery-check")
            .classList.remove("shake_div"),
        1000
      );

      const productErrorMessage = document.querySelector(
        ".ProductErrorMessage"
      );
      productErrorMessage.style.display = "block";
      productErrorMessage.innerHTML = "Please check the delivery PINCODE";
    }
  }
});

//ATC sticky fro mobile
$(window).scroll(function () {
  let StikyElemnt = document.getElementsByClassName("qty-atc");
  let fixmeTop = StikyElemnt[0].offsetTop;
  
  let currentScroll = $(window).scrollTop(); // get current position
  if (fixmeTop >= currentScroll) {
    $(".qty-atc").removeClass("qty-atc_sticky");
  } else {
    $(".qty-atc").addClass("qty-atc_sticky");
  }
});

/*----------------------------------------------------------------------------------------P4-------------------*/

//get the product content

async function updateProductContent(handle) {
  const sectionId = document.querySelector('section.section--product-details').getAttribute('data-section-id');
  if (document.querySelector('virtual-product-button')){
    const targetElement = document.querySelector("main");
    const url = `/products/${handle}?section_id=${sectionId}&view=view-bundle-product`;
    const changeUrl = `/products/${handle}`;
    try {
      let response = await fetch(url);
      let text = await response.text();
      let rawContent = new DOMParser();
      let htmlContent = rawContent.parseFromString(text, "text/html");
      
      document.querySelector('.section--product-details').innerHTML = htmlContent.querySelector(".section--product-details").innerHTML;
      pincodeFunctionality();
      window.history.pushState("", "", changeUrl);
    } catch (error) {
      console.error("Error updating product content:", error);
    }
  }
  else
  {
    const targetElement = document.querySelector("#MainContent");
    const url = `/products/${handle}?view=product-group`;
    const changeUrl = `/products/${handle}`;
    
    try {
      let response = await fetch(url);
      let text = await response.text();
      let rawContent = new DOMParser();
      let htmlContent = rawContent.parseFromString(text, "text/html");
      targetElement.innerHTML = htmlContent.querySelector("#MainContent").innerHTML;
      window.history.pushState("", "", changeUrl);
    } catch (error) {
      console.error("Error updating product content:", error);
      window.location.href = changeUrl;
    }
  }
}

document.body.addEventListener("click", (event) => {
  const target = event.target;
  const productHandle = target
    .closest(".product-group__item")
    ?.getAttribute("data-product-handle");
  const currentproductHandle = target
    .closest("[data-main-product-handle]")
    ?.getAttribute("data-main-product-handle");
    let selectedVariantHandle;
    if (!document.querySelector('virtual-product-button')){
      selectedVariantHandle = document
    .querySelector(".variant-options-listItem.is-selected")
    ?.getAttribute("data-variant-handle");
    }
    if(productHandle){
    target.closest(".product-grouping__container")?.classList.add("loading");
    document.body.style.pointerEvents = "none";
    }
    if(productHandle){
      updateProductContent(productHandle).then(() => {
        Shopify.productSwatch();
        if (!document.querySelector('virtual-product-button')){
          rememberSelectedVariant(selectedVariantHandle);
        }
        document.body.style.pointerEvents = "unset";
      });
    }
    
  
});

//trigger the function after the product content is loaded
Shopify.productSwatch = function () {
  Defer.dom(".lazy-load-parent img");
  createSlider();
  videoFunctionlity();
  productTabsFunctionality();
  metafieldCardsFunctionality();
  blogFunctionality();
  pincodeFunctionality();
  zoomFunctionality();
  loadProductRecommendations();
};

//remove the residual code and load the product recommendation script again
function loadProductRecommendations() {
  window._rkReload();
}

//remember the selected variant
function rememberSelectedVariant(selectedVariantHandle) {
  let variantElement = document.querySelector(
    `[data-variant-handle="${selectedVariantHandle}"]`
  );
  variantElement?.click();
  variantElement?.click();
}

//zoom in and out function
function zoomFunctionality() {
  //click on main image
  $(document).on("click", ".product-slick-image:not(.no-zoom)", function () {
    $(".MainImage_ZoomArea").show();
  });

  //click on zoomed image
  $(document).on("click", ".MainImage_ZoomArea", function () {
    $(".MainImage_ZoomArea").hide();
  });
}

$(() => {
  zoomFunctionality();
});

/*----------------main-product-details-ends-------------------*/

/*--------main-product-video-starts--------*/

function videoFunctionlity() {
  $(".video-container").slick({
    infinite: false,
    slidesToShow: 2.42,
    slidesToScroll: 1,
    prevArrow: ".arrow-left",
    nextArrow: ".arrow-right",
    responsive: [
      {
        breakpoint: 767,
        settings: {
          arrows: false,
          slidesToShow: 1.1,
          slidesToScroll: 1,
        },
      },
    ],
  });

  $(".main_video_slider").slick({
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow:
      '<div class="lazy-load-parent"><img  class="slick-arrow slick-prev" data-src="{{"PreVideoModelArrow.png" | asset_url}}" alt="circle left"></div>',
    nextArrow:
      '<div class="lazy-load-parent"><img class="slick-arrow slick-next" data-src="{{"NexVideoModelArrow.png" | asset_url}}" alt="circle left"></div>',
    responsive: [
      {
        breakpoint: 426,
        settings: {
          arrows: false,
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });

  //when user clicks on any video
  $(document).on("click", ".card-video", function () {
    $(".main_video_slider").find(".videocard_BigVideo").trigger("pause");
    $(".main_video_slider").find(".videocard_BigVideo").trigger("load");
    $(".ProductVideo_modal").css("display", "block");
    VideoToPlay = $(".main_video_slider").find("#" + this.id);
    $(".main_video_slider").slick("slickGoTo", VideoToPlay.index());
    VideoToPlay.trigger("play");
  });

  $(".slick-prev").click(function () {
    $(".main_video_slider").find(".videocard_BigVideo").trigger("pause");
  });

  $(".slick-next").click(function () {
    $(".main_video_slider").find(".videocard_BigVideo").trigger("pause");
  });

  // When the user clicks on <span> (x), close the modal
  $(document).on("click", ".ProductVideo_modal_close", function (ev) {
    $(".ProductVideo_modal").css("display", "none");
    $(".main_video_slider").find(".videocard_BigVideo").trigger("pause");
  });

  const max = 190;

  $(".VideoCard_p").each(function () {
    var str = $(this).text();
    if ($.trim(str).length > max) {
      $(this)
        .parents(".card")
        .find(".VideoCard_readmore")
        .css("display", "block");
    }
  });

  //when user clicks on read more
  $(document).on("click", ".VideoCard_readmore", function () {
    $(this).parents(".card").find(".VideoCard_readmore").css("display", "none");
    $(this).parents(".card").find(".VideoCard_p").css("display", "none");
    $(this)
      .parents(".card")
      .find(".VideoCard_readless")
      .css("display", "block");
    $(this).parents(".card").find(".VideoCard_pFull").css("display", "block");
  });

  //when user clicks on read less
  $(document).on("click", ".VideoCard_readless", function () {
    $(this).parents(".card").find(".VideoCard_readless").css("display", "none");
    $(this).parents(".card").find(".VideoCard_pFull").css("display", "none");
    $(this)
      .parents(".card")
      .find(".VideoCard_readmore")
      .css("display", "block");
    $(this).parents(".card").find(".VideoCard_p").css("display", "-webkit-box");
  });
}

$(() => {
  videoFunctionlity();
});
/*--------main-product-video-ends--------*/

/*--------main-product-blog-starts--------*/
function blogFunctionality() {
  $(".productpage-blogs-section-slider").slick({
    dots: false,
    arrows: true,
    infinite: true,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    prevArrow: `<svg xmlns="http://www.w3.org/2000/svg" width="34.563" height="34.563" viewBox="0 0 34.563 34.563"><path id="Regular-M" d="M26.021-50.5A17.409,17.409,0,0,1,8.74-67.777a17.414,17.414,0,0,1,17.3-17.281A17.4,17.4,0,0,1,43.3-67.777,17.425,17.425,0,0,1,26.021-50.5Zm-8.962-17.3a1.329,1.329,0,0,0,.491,1.017l5.9,5.913a1.251,1.251,0,0,0,.914.373,1.251,1.251,0,0,0,.91-.372,1.251,1.251,0,0,0,.36-.915,1.3,1.3,0,0,0-.39-.932l-2.169-2.152-2.118-1.763,3.694.135h9.084a1.269,1.269,0,0,0,.945-.365,1.269,1.269,0,0,0,.377-.94,1.273,1.273,0,0,0-.372-.95,1.273,1.273,0,0,0-.95-.372H24.65l-3.694.153,2.118-1.763,2.167-2.152a1.456,1.456,0,0,0,.39-.949,1.238,1.238,0,0,0-.362-.908,1.238,1.238,0,0,0-.908-.362,1.238,1.238,0,0,0-.914.356l-5.9,5.93a1.323,1.323,0,0,0-.493,1.017Z" transform="translate(-8.74 85.058)" fill="#013564"/></svg>`,
    nextArrow: `<svg xmlns="http://www.w3.org/2000/svg" width="34.564" height="34.563" viewBox="0 0 34.564 34.563"><path id="Regular-M" d="M26.023-50.5A17.409,17.409,0,0,0,43.3-67.777a17.414,17.414,0,0,0-17.3-17.281A17.4,17.4,0,0,0,8.74-67.777,17.425,17.425,0,0,0,26.023-50.5Zm8.962-17.3a1.329,1.329,0,0,1-.491,1.017l-5.9,5.913a1.251,1.251,0,0,1-.914.373,1.251,1.251,0,0,1-.91-.372,1.251,1.251,0,0,1-.36-.915,1.3,1.3,0,0,1,.39-.932l2.169-2.152,2.118-1.763-3.694.135H18.312a1.269,1.269,0,0,1-.945-.365,1.269,1.269,0,0,1-.377-.94,1.273,1.273,0,0,1,.372-.95,1.273,1.273,0,0,1,.95-.372h9.081l3.694.153-2.118-1.763L26.8-72.878a1.456,1.456,0,0,1-.39-.949,1.238,1.238,0,0,1,.362-.908,1.238,1.238,0,0,1,.908-.362,1.238,1.238,0,0,1,.914.356l5.9,5.93a1.323,1.323,0,0,1,.493,1.017Z" transform="translate(-8.74 85.058)" fill="#013564"/></svg>`,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
          dots: false,
          arrows: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 1,
          infinite: false,
          dots: false,
          arrows: false,
        },
      },
    ],
  });

  $(".blog_viewAll_loader").hide();
  $(".btn-view-all").show();
  $(".btn-view-all").click((e) => {
    $(".blog_viewAll_loader").show();
    $(".btn-view-all").hide();
    setTimeout(removeLoader, 2000);
  });

  $(".productpage-blog-read-more").click((e) => {
    let $target = $(e.target);
    $target
      .closest(".homepage-blogs-section-blocks")
      .find(".blog_ReadMore_loader")
      .show();
    $target
      .closest(".homepage-blogs-section-blocks")
      .find(".productpage-blog-read-more")
      .hide();
    setTimeout(removeLoader, 2000);
  });

  if (
    !$(".shopify-section.productpage-blogs-section").find(
      ".homepage-blogs-section-blocks"
    ).length
  ) {
    $(".shopify-section.productpage-blogs-section").hide();
  }
}
$(() => {
  blogFunctionality();
});

function removeLoader() {
  $(".blog_viewAll_loader").hide();
  $(".btn-view-all").show();
  $(".blog_ReadMore_loader").hide();
  $(".productpage-blog-read-more").show();
}
/*--------main-product-blog-ends--------*/

/*--------main-product-tabs-starts----------*/
function productTabsFunctionality() {
  $(".tabs")
    .find(".tab_about")
    .click(function () {
      // remove active from all headers
      if ($(".tabs").find(".tab-header").hasClass("active")) {
        $(".tabs").find(".tab-header").removeClass("active");
      }

      if ($(".tab-content").find(".tab-body").hasClass("active")) {
        $(".tab-content").find(".tab-body").removeClass("active");
      }

      $(".tabs").find(".tab_about").addClass("active");
      $(".tab-content").find(".tab_about").addClass("active");
    });

  $(".tabs")
    .find(".tab_features")
    .click(function () {
      // remove active from all headers
      if ($(".tabs").find(".tab-header").hasClass("active")) {
        $(".tabs").find(".tab-header").removeClass("active");
      }
      // remove active from content
      if ($(".tab-content").find(".tab-body").hasClass("active")) {
        $(".tab-content").find(".tab-body").removeClass("active");
      }

      $(".tabs").find(".tab_features").addClass("active");
      $(".tab-content").find(".tab_features").addClass("active");
    });

  $(".tabs")
    .find(".tab_PackNSize")
    .click(function () {
      // remove active from all headers
      if ($(".tabs").find(".tab-header").hasClass("active")) {
        $(".tabs").find(".tab-header").removeClass("active");
      }
      // remove active from content
      if ($(".tab-content").find(".tab-body").hasClass("active")) {
        $(".tab-content").find(".tab-body").removeClass("active");
      }

      $(".tabs").find(".tab_PackNSize").addClass("active");
      $(".tab-content").find(".tab_PackNSize").addClass("active");
    });

  $(".tabs")
    .find(".tab_UseNCare")
    .click(function () {
      // remove active from all headers
      if ($(".tabs").find(".tab-header").hasClass("active")) {
        $(".tabs").find(".tab-header").removeClass("active");
      }
      // remove active from content
      if ($(".tab-content").find(".tab-body").hasClass("active")) {
        $(".tab-content").find(".tab-body").removeClass("active");
      }

      $(".tabs").find(".tab_UseNCare").addClass("active");
      $(".tab-content").find(".tab_UseNCare").addClass("active");
    });

  $(".tabs")
    .find(".tab_TechSpecs")
    .click(function () {
      // remove active from all headers
      if ($(".tabs").find(".tab-header").hasClass("active")) {
        $(".tabs").find(".tab-header").removeClass("active");
      }
      // remove active from content
      if ($(".tab-content").find(".tab-body").hasClass("active")) {
        $(".tab-content").find(".tab-body").removeClass("active");
      }

      $(".tabs").find(".tab_TechSpecs").addClass("active");
      $(".tab-content").find(".tab_TechSpecs").addClass("active");
    });

  $(".tab-container-mobile .content").hide();
  $(".tab-container-mobile .header").click((e) => {
    let $target = $(e.target);

    $target.closest(".accordion").find(".content").toggle();
    if (
      $target.closest(".accordion").find(".arrowup").css("display") == "none"
    ) {
      $target.closest(".accordion").find(".arrowup").css("display", "block");
      $target.closest(".accordion").find(".arrowdown").css("display", "none");
      $target.closest(".accordion").find("h3").css("color", "#013564");
    } else {
      $target.closest(".accordion").find(".arrowup").css("display", "none");
      $target.closest(".accordion").find(".arrowdown").css("display", "block");
      $target.closest(".accordion").find("h3").css("color", "#000000");
    }
  });
}

$(() => {
  productTabsFunctionality();
});

/*--------main-product-tabs-ends----------*/

/*--------main-product-metafileds-card-starts----------*/
function metafieldCardsFunctionality() {
  $(".Product_metafields_cards_slider").slick({
    infinite: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow: ".arrow-left2",
    nextArrow: ".arrow-right2",
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 850,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 1,
        },
      },
    ],
  });

  let max = 115;

  $(".Product_metafields_card_info p").each(function () {
    let str = $(this).text();
    if ($.trim(str).length > max) {
      $(this)
        .parents(".Product_metafields_card")
        .find(".Product_metafields_card_readmore")
        .css("display", "block");
    }
  });

  $(".Product_metafields_card_readmore").click((e) => {
    let $target = $(e.target);
    $target
      .closest(".Product_metafields_card")
      .find(".Product_metafields_card_cutText")
      .hide();
    $target
      .closest(".Product_metafields_card")
      .find(".Product_metafields_card_fullText")
      .show();
  });

  $(".Product_metafields_card_readless").click((e) => {
    let $target = $(e.target);
    $target
      .closest(".Product_metafields_card")
      .find(".Product_metafields_card_cutText")
      .show();
    $target
      .closest(".Product_metafields_card")
      .find(".Product_metafields_card_fullText")
      .hide();
  });
}
$(() => {
  metafieldCardsFunctionality();
});
/*--------main-product-metafileds-card-ends----------*/

/*--------bulk-form-js-starts----------*/

class BulkForm extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.addEventListeners();
  }

  addEventListeners() {
    // Add your event listeners here
    const form = this.querySelector("#bulk-data-form");
    const bulkQuoteButton = this.querySelector(".bulk-quote-popup__button");
    const customizerCloseButton = this.querySelector(
      ".bulk-form__inner .customizer_close"
    );

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleFormSubmit(form);
    });

    bulkQuoteButton.addEventListener("click", () => {
      this.showBulkForm();
    });

    customizerCloseButton.addEventListener("click", () => {
      this.hideBulkForm();
    });
  }

  handleFormSubmit(form) {
    const bulkSubmitText = this.querySelector(".bulk-button__text");
    const bulkSubmitLoader = this.querySelector(".bulk-button__loader");
    bulkSubmitText.style.display = "none";
    bulkSubmitLoader.style.display = "block";

    const currentBulkProductSku = this.selectedSku();
    const bulkSubmitQuantity = document.querySelector('#ContactFormQuantity').value;
    const deliveryDeadline = document.querySelector('#Deadline').value;

    const data = new FormData(form);
    const action = form.action;

    fetch(action, {
      method: "POST",
      body: data,
    })
      .then(() => {
        bulkSubmitText.style.display = "block";
        bulkSubmitLoader.style.display = "none";
        alert("Bulk Quote Form Submitted Successfully!");
        this.hideBulkForm();
        this.clearBulkForm(form);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Something went wrong, please try again later.");
      })
      .finally(()=>{
        Shopify.analytics.publish("bulk_quote_requested", { product_sku : currentBulkProductSku, bulk_quantity : bulkSubmitQuantity, delivery_deadline : deliveryDeadline});
      });
  }

  clearBulkForm(form) {
    const elements = form.elements;
    for (let i = 0; i < elements.length; i++) {
      let element = elements[i];
      if (element.type !== "submit") {
        element.value = "";
      }
    }
  }

  showBulkForm() {
    const bulkFormWrapper = this.querySelector(".bulk-form__wrapper");
    const currentBulkSku = this.selectedSku();
    const bulkSkuElement = this.querySelector("#bulk-product-sku");
    const bulkSkuInput = this.querySelector("#ContactFormSKU");

    bulkSkuElement.innerHTML = currentBulkSku;
    bulkSkuInput.value = currentBulkSku;
    document.body.classList.add("bulk-no-scroll");
    bulkFormWrapper.style.display = "block";
    Shopify.analytics.publish("bulk_quote_clicked", { eventName : "Bulk Quote Clicked" });
  }

  hideBulkForm() {
    const bulkFormWrapper = this.querySelector(".bulk-form__wrapper");
    document.body.classList.remove("bulk-no-scroll");
    bulkFormWrapper.style.display = "none";
  }

  selectedSku() {
    let currentVariantSku = document
      .querySelector(
        ".product-information-container .variant-options-listItem.is-selected"
      )
      ?.getAttribute("data-variant-sku");
    if (!currentVariantSku)
      currentVariantSku = document
        .querySelector(".section--product-details")
        ?.getAttribute("data-variant-sku");
    return currentVariantSku;
  }
}

customElements.define("bulk-form", BulkForm);

/*--------bulk-form-js-ends----------*/

/*--------variant galley in the pdp starts----------*/
class VariantItem extends HTMLElement {
  constructor() {
    super();
    if (document.querySelector('[data-variant-gallery="true"]'))
      this.setupEventListeners();
  }

  setupEventListeners() {
    this.addEventListener("click", this.handleVariantItemClick.bind(this));
  }

  connectedCallback() {
    createSlider();
    if (document.querySelector('[data-variant-gallery="true"]'))
      setTimeout(() => this.variantGalleryChange(), 100);
    this.readMoreVariants();
  }

  handleVariantItemClick(event) {
    const variantItemElement = event.target;
    const variantItemName = variantItemElement
      .closest(".variant-options-listItem ")
      .getAttribute("data-variant-handle");
    this.variantGalleryChange(variantItemName);
  }

  variantGalleryChange(selectedElement) {
    selectedElement = selectedElement || this.getSelectedVariantHandle();

    $(".product-main-images, .product-thumbnail-images")
      .slick("unslick")
      .empty();

    const mainImagesToMove = this.getImagesToMove(
      ".product-slick-image",
      `data-src-alt*="${selectedElement}"`
    );
    const thumbNailImagesToMove = this.getImagesToMove(
      ".product-thumbnail-image",
      `data-thumb-src-alt*="${selectedElement}"`
    );

    const mainImages =
      mainImagesToMove.length > 0
        ? mainImagesToMove
        : this.getImagesToMove(".product-slick-image");
    const thumbNailImages =
      thumbNailImagesToMove.length > 0
        ? thumbNailImagesToMove
        : this.getImagesToMove(".product-thumbnail-image");

    $(".product-main-images").append(mainImages);
    $(".product-thumbnail-images").append(thumbNailImages);

    createSlider();
  }

  getSelectedVariantHandle() {
    return this.querySelector(
      ".variant-options-listItem.is-selected"
    ).getAttribute("data-variant-handle");
  }

  getImagesToMove(selector, attributeFilter) {
    const imagesToMove = attributeFilter
      ? $(`.product-main-images-dope ${selector}[${attributeFilter}]`).clone()
      : $(`.product-main-images-dope ${selector}`).clone();

    return imagesToMove;
  }

  readMoreVariants() {
    const variantContainerWidth = this.offsetWidth;
    const variantContainerWidthReduced = 0.75 * variantContainerWidth;

    let variantsWidth = 0;
    let hiddenVariantsCount = 0;

    const productVariants = document.querySelectorAll(
      "variant-item.variant-options-list .variant-options-listItem"
    );
    for (let i = 0; i < productVariants.length; i++) {
      if (
        !(
          (variantsWidth += productVariants[i].offsetWidth) <
          variantContainerWidthReduced
        )
      ) {
        productVariants[i].classList.add("hide-variant");
        hiddenVariantsCount += 1;
      }
    }
    if (hiddenVariantsCount > 0) {
      const hiddenVariantCount = document.querySelector(".view-more__variants");
      hiddenVariantCount.style.display = "block";
      hiddenVariantCount.innerText = "+ " + hiddenVariantsCount;
    }

    const viewMoreButton = this.querySelector(".view-more__variants");

    const handleViewMoreClick = (event) => {
      const viewMoreElement = event.target;
      viewMoreElement
        .closest("variant-item")
        .classList.add("show-hidden-variants");
      viewMoreElement.style.display = "none";
    };
    viewMoreButton.addEventListener("click", handleViewMoreClick);
  }
}

customElements.define("variant-item", VariantItem);
/*--------variant galley in the pdp ends----------*/

// async function checkNdd(pincode, variant_sku) {
//   try {
//     const response = await fetch(`https://edd.myborosil.com/pincode/ndd?pincode=${pincode}&sku=${variant_sku}`);
//     let $isNddAvailable = response.status;

//     if ($isNddAvailable == 200) {
//       sessionStorage.setItem('nddAvailable', true);
//       document.querySelector('#pincode_ndd').innerHTML = 'Next day delivery is available';
//     } else if ($isNddAvailable == 404) {
//       const data = await response.json();
//       sessionStorage.setItem('nddAvailable', false);
//       document.querySelector('#pincode_ndd').innerHTML = data.message || 'Not servicable';
//     } 
//   } catch (error) {
//     console.error('Error fetching NDD availability:', error);
//     document.querySelector('#pincode_ndd').innerHTML = 'Error checking delivery availability';
//   }
// }

async function checkNdd(pincode, variant_sku) {
  try {
    const response = await fetch(`https://edd.myborosil.com/pincode/ndd?pincode=${pincode}&sku=${variant_sku}`);
    const nddData = await response.json();
    let nddMessage = nddData.message;
    
    const productAtc =
      document.querySelector(".product-atc") ||
      document.querySelector(".gift-card-atc") ||
      document.querySelector("#customizer-button");

    if (nddMessage == 'serviciable') {
      // document.querySelector('#pincode_ndd').innerHTML = 'Next day delivery is available';
      productAtc.setAttribute('data-NDD-available', true);
    } else if (nddMessage == 'not serviceable') {
      productAtc.setAttribute('data-NDD-available', false);
      // document.querySelector('#pincode_ndd').innerHTML = 'Next day delivery is not available';
    } 
  } catch (error) {
    console.error('Error fetching NDD availability:', error);
    // document.querySelector('#pincode_ndd').innerHTML = 'Error checking delivery availability';
  }
}

/*--------pincode functionality starts----------*/
function pincodeFunctionality() {
  async function checkIfServiceable(pincode) {
    const response = await fetch(
      "https://pincode.myborosil.com/api/getpincode?pincode=" + pincode
    );
    const data = await response.json();
    var $response = data.response;
    if (
      $response != "error" &&
      $response.pre_paid == "Y" &&
      $response.cod == "Y"
    ) {
      //store the pincodevar
      store_Pincode = $inputValue;
      localStorage.setItem("store_Pincode", store_Pincode);

      $(".pincode-input").hide();
      $(".pincode-output").css("display", "flex");
      $(".delivery-text").css("color", "#000000");
      $(".delivery-text").html("Delivery available to : ");
      $(".DeliveryPinIfavailable").html($inputValue);
      $(".product-atc").removeClass("is-disabled");
      $(".ProductErrorMessage").hide();
      $(".product-atc").hover(
        function () {
          $(".ProductErrorMessage").hide();
        },
        function () {
          $(".ProductErrorMessage").hide();
        }
      );
    } else {
      $(".pincode-input").hide();
      $(".pincode-output").css("display", "flex");
      $(".delivery-text").css("color", "red");
      $(".delivery-text").html("We do not ship to your pincode : ");
      $(".DeliveryPinIfavailable").html($inputValue);
      $(".product-atc").addClass("is-disabled");

      $(".product-atc").hover(
        function () {
          $(".ProductErrorMessage").show();
          $(".ProductErrorMessage").html("Please enter correct delivery code");
        },
        function () {
          $(".ProductErrorMessage").hide();
        }
      );

      localStorage.setItem("store_Pincode", null);
    }
  }

  //Checking Pincode in Product Page
  var $input = $("#pincodeInput");
  var $submitBtn = $("#pinSubmit");
  var $inputValue,
    $cod,
    $date,
    $fromDate,
    $toDate,
    $sellFromDate,
    $sellToDate,
    $deliverDate,
    $addDays,
    $currentTime;

  //Allow only number
  $input.keydown(function () {
    var $self = $(this);
    var $removedText = $self.val().replace(/\D/, "");
    $self.val($removedText);
  });

  //Restrict Paste
  $input.on("paste", function (e) {
    e.preventDefault();
  });

  //when 6 digit number is entered
  $input.keyup(function () {
    if ($input.val().length == 6) {
      $(".pincode-input button").css("color", "#013564");
      $(".pincode-button").html("Check");
      $(".pincode-button").hover(
        function () {
          $(".pincode-input button").css("color", "#013564");
          $(".pincode-button").html("Check");
        },
        function () {
          $(".pincode-input button").css("color", "#013564");
          $(".pincode-button").html("Check");
        }
      );
    } else {
      $(".pincode-button").hover(
        function () {
          $(".pincode-button").css("color", "red");
          $(".pincode-button").html("Add valid pincode");
        },
        function () {
          $(".pincode-button").css("color", "#B2B2B2");
          $(".pincode-button").html("Check");
        }
      );
    }
  });

  $submitBtn.on("click", function () {
    $DeliveryText = $(".delivery-text");
    $inputValue = $input.val();

    if ($inputValue.length == 6) {
      checkIfServiceable($inputValue);
      let variant_sku = document.querySelector('.section--product-details').getAttribute('data-variant-sku');
      checkNdd($inputValue,variant_sku);
    } else {
      $(".pincode-button").css("color", "red");
      $(".pincode-button").css("font-size", "12px");
      $(".pincode-button").html("Add your pincode");
    }
  });

  $(".DeveryPenIfavailable").on("click", function () {
    $(".delivery-text").css("color", "#000000");
    $(".delivery-text").html("Check Delivery");
    $(".pincode-input").show();
    $(".pincode-output").hide();
    $(".DeliveryPinIfavailable").html(null);
    localStorage.setItem("store_Pincode", null);

    if ($input.val().length == 6) {
      $(".pincode-input button").css("color", "#013564");
    } else {
      $(".pincode-input button").css("color", "#B2B2B2");
    }
  });
}

$(() => {
  pincodeFunctionality();
});
/*--------pincode functionality ends----------*/

/*--------gift card functionality starts----------*/

$(document).ready(function () {
  $(".short-description .read").click(function () {
    $(".short-description").toggleClass("hidden");
  });
});

$(document).ready(function () {
  let emailError = true,
    nameError = true;
  let emailRegex =
    /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  function goToError() {
    $([document.documentElement, document.body]).animate(
      {
        scrollTop: $(".error").offset().top - 400,
      },
      2000
    );
  }

  //error hanlding for the gift card atc
  $(document).on("click", ".gift-card-atc", function (e) {
    let recipientName = $('[name="properties[_recipient_name]"]').val(),
      recipientEmail = $('[name="properties[_Gift to Email]"]').val(),
      senderName = $('[name="properties[_sender_name]"]').val(),
      senderEmail = $('[name="properties[_sender_email]"]').val(),
      qcMessage = $('[name="properties[_QC Message]"]').val();

    if (!recipientName || !recipientEmail || !senderName || !senderEmail) {
      $(".error").html("Required fields can't be blank.");
      goToError();
      return;
    }

    if (
      /^[A-Za-z0-9 ]+$/.test(recipientName) &&
      /^[A-Za-z0-9 ]+$/.test(senderName)
    ) {
      nameError = false;
    } else {
      nameError = true;
      $(".error").html("No special characters allowed in the Name Field.");
      goToError();
      return;
    }

    if (emailRegex.test(recipientEmail) && emailRegex.test(senderEmail)) {
      emailError = false;
    } else {
      emailError = true;
      $(".error").html(`Please enter correct email address`);
      goToError();
      return;
    }

    if (!emailError && !nameError) {
      $(".error").empty();
      addGiftCard(
        recipientName,
        recipientEmail,
        senderName,
        senderEmail,
        qcMessage
      );
    }
  });

  //Add To Cart
  function addGiftCard(rn, re, sn, se, qm) {
    if ($(this).hasClass("is-disabled")) {
      return;
    }
    if ($(".DeliveryPinIfavailable").html() > 0) {
      $(".product-atc").css("display", "none");
      $(".product-atc_loader").css("display", "block");
      const selectedVariant = $(".variant-options-listItem.is-selected");
      const variantId = selectedVariant.attr("data-variant");
      const variantQuantity = 1;
      const formData = {
        items: [
          {
            id: variantId * 1,
            quantity: variantQuantity * 1,
            properties: {
              _recipient_name: rn,
              "_Gift to Email": re,
              _sender_name: sn,
              _sender_email: se,
              "_QC Message": qm,
            },
          },
        ],
      };
      fetch(window.Shopify.routes.root + "cart/add.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          $(".product-atc").css("display", "block");
          $(".product-atc_loader").css("display", "none");
          mmajaxcart.CartCountHandler();
          mmajaxcart.AjaxcartRender();
          setTimeout(function () {
            mmajaxcart.AjaxcartOpen();
          }, 1500);
        })
        .catch((error) => {
          alert("Error while adding to cart");
          $(".product-atc").css("display", "block");
          $(".product-atc_loader").css("display", "none");
        });
    } else {
      if ($(".qty-atc").hasClass("qty-atc_sticky")) {
        $("html, body").animate(
          {
            scrollTop: $(".product-information-container").offset().top,
          },
          2000
        );
      }
      $(".delivery-check").addClass("shake_div");
      setTimeout(function () {
        $(".delivery-check").removeClass("shake_div");
      }, 1000);
      $(".ProductErrorMessage").show();
      $(".ProductErrorMessage").html("Please check the delivery PINCODE");
    }
  }
  $('label[for="message"]').click(function () {
    $(this).next("textarea").toggleClass("hide");
    $(this).find("i").toggleClass("fa-chevron-down fa-chevron-up");
  });
});
/*--------gift card functionality ends----------*/


