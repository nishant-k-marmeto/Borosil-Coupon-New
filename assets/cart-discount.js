/* Custom kart code starts */
Shopify.CustomDiscountSubmit = function (requstCouponCode) {
  var customDiscountTextValue = document.querySelector('#custom-discount-text').value;
  var couponCodeValue = customDiscountTextValue ? customDiscountTextValue : requstCouponCode || $('.discountCode .af_coupon_code').html();
  const discountWrapperElement = document.querySelector('.custom-cart-discount-wrapper');
  const discountApplyBtn = document.querySelector('#apply-coupon-btn');
  const afCouponApplyBtn = document.querySelector('#af_custom_apply_coupon_trigger');

  discountApplyBtn.classList.add('btn-loading');
  discountApplyBtn.setAttribute('disabled', true);

  // Define the button element
  const discountButton = document.querySelector('.back-button-discount-header');
  function triggerDiscountButtonClick() {
    if (discountButton) {
      discountButton.click(); 
    } else {
      console.warn('Button not found!');
    }
  }
  


  if (afCouponApplyBtn) {
    afCouponApplyBtn.classList.add("af_custom_apply_coupon_trigger_loading");
    afCouponApplyBtn.setAttribute('disabled', true);
  }

  document.querySelector('#custom-discount-text').value = couponCodeValue

  if (customDiscountTextValue != '') {
    $.getJSON('/cart.js', function (cart) {
      var cartToken = cart.token;
      Shopify.farziDiscount(couponCodeValue, cartToken);
    })
  }

  if (couponCodeValue) {
    setTimeout(() => {
      $.getJSON('/cart.js', function (cart) {
        applyDiscount(cart, couponCodeValue)
      })
    }, 500);
  } else {
    resetFrontendState();
  }

  async function applyDiscount(cart, couponCodeValue) {
    const discountAPI = 'https://4fe2-106-51-87-194.ngrok-free.app/discount';
    const customerId = parseInt(discountWrapperElement.getAttribute('data-userId'));
    const loaderDiscount = document.querySelector('.loader-discount')
    const applyText = document.getElementById('apply-text');
    const applyLoader = document.getElementById('apply-loader');
    const discountButton = document.querySelector('#discount-offer-showBtn');
    const discountOffShow = document.querySelector('#discount-price-offShow');

    
    // Show the loader and hide the "Apply" text
    applyText.style.display = 'none';
    applyLoader.setAttribute('style', 'display: block !important;');

    const data = {
      cart: cart,
      store: `${Shopify.shop}`,
      discount: couponCodeValue,
      customer_id: customerId
    };

    try {
      const response = await fetch(discountAPI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw { status: response.status, message: error.error };
      }
      debugger
      window.sessionStorage.setItem('custom_coupon-code', couponCodeValue);
      document.cookie = "discount_code=" + couponCodeValue + "; expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/";
      debugger
      const res = await response.json();
      const discountCode = res.data.response.formatted_text.discount_pair.discountCode;
      const finalTotalPrice = res.data.response.formatted_text.final_total_price;
      const totalPrice = res.data.response.formatted_text.total_price;
      const discountAmount = res.data.response.formatted_text.discount_amount;
      const discount_code = res.data.response.formatted_text.discount_pair.discountCode;
      discountButton.innerHTML = `<span>${couponCodeValue}</span> <button class="dicount-price-closeBtn" onclick="Shopify.DiscountRemove()">X</button>`;
      discountOffShow.innerHTML=`<span>Discount Applied</span> <span>-₹${finalTotalPrice}</span>`

      // Insert the final total price into the specified element
      debugger
      const initialCartPrice = document.querySelector('#inital-cart-price');
      const finalDiscountPriceElement = document.querySelector('#final-disocunt-price');
      if (finalDiscountPriceElement) {
        initialCartPrice.classList.add('disocunted-price-main')
        finalDiscountPriceElement.innerHTML = `₹${finalTotalPrice}`;
      } else {
        console.warn('Element  "final-discount-price" not found!.');
      }
      
      if (discountedPrices.length > 0) {
        discountedPrices.forEach(element => {
          element.remove();
        });
      }
    } catch (error) {
      if (error.status === 404 || error.status === 403 || error.status === 0) {
        console.log(error.message);
        handleError(error.message);
      } else {
        console.error('Error:', error);
        if (error.message === 'signal is aborted without reason') {
          handleError('Something went wrong, please try again after some time.');
        }
      }
    } finally {
      applyLoader.setAttribute('style', 'display: none !important;');
      applyText.style.display = 'block';
      resetFrontendState();
      triggerDiscountButtonClick();
    }
  }

  // error helper function 
  const handleError = (message) => {
    let errorMsg = document.querySelector('.custom-cart-discount-wrapper span.error-msg');
    let afCartDiscountError = document.querySelector('#af_cart_page .discount_error');

    errorMsg.classList.remove('d-none');
    errorMsg.innerHTML = message;
    afCartDiscountError.innerHTML = message;

    // remove sesstion storage
    window.sessionStorage.removeItem("custom_coupon-code");
    deleteCookie('discount_code');

    setTimeout(() => {
      errorMsg.classList.add('d-none');
      errorMsg.innerHTML = "";
      afCartDiscountError.innerHTML = "";
    }, 3000);
  }

  // reset Frontend UI helper function 
  function resetFrontendState() {
    document.querySelector('#custom-discount-text').value = "";
    discountWrapperElement.classList.remove("discount-applied");
    discountApplyBtn.classList.remove('btn-loading');
    discountApplyBtn.removeAttribute('disabled');
    if (afCouponApplyBtn) {
      afCouponApplyBtn.classList.remove("af_custom_apply_coupon_trigger_loading");
      afCouponApplyBtn.removeAttribute('disabled');
    }
  }
}

Shopify.DiscountRemove = function () {
  const discountWrapperElement = document.querySelector('.custom-cart-discount-wrapper');
  const discountButton = document.querySelector('#discount-offer-showBtn');
  const discountOffShow = document.querySelector('#discount-price-offShow');
  const initialCartPrice = document.querySelector('#inital-cart-price');
  const finalDiscountPriceElement = document.querySelector('#final-disocunt-price');
  const applyLoader = document.getElementById('apply-loader');
  const applyText = document.getElementById('apply-text');

  // Clear session storage and cookie related to the coupon
  sessionStorage.removeItem('custom_coupon-code');
  document.cookie = "discount_code=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

  // Undo the discount-related changes in the UI
  if (initialCartPrice) {
    initialCartPrice.classList.remove('disocunted-price-main'); // Remove the discounted price class
  }

  if (finalDiscountPriceElement) {
    finalDiscountPriceElement.innerHTML = ''; // Clear the final discounted price display
  }

  if (discountButton) {
    discountButton.innerHTML = ''; // Clear the discount button content
  }

  if (discountOffShow) {
    discountOffShow.innerHTML = ''; // Clear the discount applied message
  }

  // Reset the loader and apply button text states
  if (applyLoader) {
    applyLoader.setAttribute('style', 'display: none !important;');
  }
  if (applyText) {
    applyText.style.display = 'block'; // Restore the "Apply" button text
  }

  // Optionally reset any other state or UI elements
  resetFrontendState();

  console.log('Coupon removed and UI reset!');
};
