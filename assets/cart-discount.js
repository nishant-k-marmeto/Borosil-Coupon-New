/* Custom kart code starts */
Shopify.CustomDiscountSubmit = function(requstCouponCode) {
  var customDiscountTextValue = document.querySelector('#custom-discount-text').value;
  var couponCodeValue = customDiscountTextValue ? customDiscountTextValue : requstCouponCode || $('.discountCode .af_coupon_code').html();
  const discountWrapperElement = document.querySelector('.custom-cart-discount-wrapper');
  const discountApplyBtn = document.querySelector('#apply-coupon-btn');
  const afCouponApplyBtn = document.querySelector('#af_custom_apply_coupon_trigger');

  discountApplyBtn.classList.add('btn-loading');
  discountApplyBtn.setAttribute('disabled',true);
  
  if (afCouponApplyBtn) {
    afCouponApplyBtn.classList.add("af_custom_apply_coupon_trigger_loading");
    afCouponApplyBtn.setAttribute('disabled',true);
  } 

  document.querySelector('#custom-discount-text').value = couponCodeValue

  if(customDiscountTextValue != ''){
    $.getJSON('/cart.js', function (cart) {
      var cartToken = cart.token;
      Shopify.farziDiscount(couponCodeValue, cartToken);
    })
  }

  if (couponCodeValue) {
    setTimeout(() => {
      $.getJSON('/cart.js', function(cart) {
        applyDiscount(cart, couponCodeValue)
      })
    }, 500);
  } else {
    resetFrontendState();
  }

  async function applyDiscount(cart, couponCodeValue) {
    const discountAPI = 'https://1253-106-51-68-87.ngrok-free.app/discount';
    const customerId = parseInt(discountWrapperElement.getAttribute('data-userId'));
    const controller = new AbortController();
    const signal = controller.signal;
    const timeoutDuration = 15000; 

    // Setting timeout
    const timeoutId = setTimeout(() => {
      controller.abort(); 
      throw new Error('Request timed out');
    }, timeoutDuration);
    
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
        signal 
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw { status: response.status, message: error.error };
      }

      clearTimeout(timeoutId);
      const res = await response.json();
      const discountCode = res.data.response.formatted_text.discount_pair.discountCode;
      const finalTotalPrice = res.data.response.formatted_text.final_total_price;
      const totalPrice = res.data.response.formatted_text.total_price;
      const discountAmount = res.data.response.formatted_text.discount_amount;
      const discount_code = res.data.response.formatted_text.discount_pair.discountCode;
  
      const discountedPrices = document.querySelectorAll('.kart-discounted-price');
      const couponApplyBody = document.querySelector('#after-coupon-apply');
      const discountHiddenInput = document.querySelector('.cart-discount-body input.hiddenDiscountValue');
      const afterCouponResponse = document.querySelector('#after-coupon-response');      
      const couponTag = couponApplyBody.querySelector(".applied-discount-tag");
      const couponCodeText = couponApplyBody.querySelector(".applied-discount-tag span.discount-coupon-code");
      const couponRemoveAttr = couponApplyBody.querySelector(".applied-discount-tag .discount-remove-coupon");
      const afterDiscountValue = afterCouponResponse.querySelector('.applied-coupon-discount span.discount-value');
      const errorMsg = document.querySelector('.custom-cart-discount-wrapper span.error-msg');
      const cartTotalText = document.querySelector('.cart_total_wrapper .cart-total-text');
      const payTotal = document.querySelector('.pay__total');
      const mcPayTotal = document.querySelector('.mc_pay__total');
      const discountTotal = document.querySelector('.discount__total');
      const afCouponText = document.querySelector('.af_coupon_text');
      const afHiddenDiscount = document.querySelector('.afHiddenDiscount');
      const afCustomCouponText = document.querySelector('#af_custom_coupon_text');
      const discountCodeDetails = document.querySelector('.discountCode_details');
      const customkartdiscountContainer = document.querySelector('.custom_kartdiscount_container');
      const discountCodeDetailsContainer = document.querySelector('.discountCode_details_container');
      const KartDiscount_detail = JSON.parse(Shopify.KartDiscount_detail);
  
      discountWrapperElement.classList.add("discount-applied");
      couponTag.classList.remove("d-none");
      afterCouponResponse.classList.remove("d-none");
      couponApplyBody.querySelector(".applied-discount-tag span.discount-coupon-code").innerText = discountCode;
      afterDiscountValue.innerText = discountAmount;
      couponRemoveAttr.setAttribute('data-applied-coupon', discountCode);
      discountHiddenInput.setAttribute('value', discountCode);
      errorMsg.classList.add('d-none');
      cartTotalText.classList.add('d-none');
      errorMsg.innerHTML = '';
  
      if (discountedPrices.length > 0) {
          discountedPrices.forEach(element => {
              element.remove();
          });
      }

      if(Shopify.redeem_points) {
        init_nector_discount_preview(res.data.response.formatted_text.final_total_price * 100);
        document.querySelector('.nector-total').classList.add('d-none');
        const nectorBalance= document.getElementById('nector-discount-preview').getAttribute("data-nector-balance");
        const nectorDiscountPrice = res.data.response.formatted_text.final_total_price - parseInt(nectorBalance);

        var customDiscountPriceElement = $(
          `<small class="strike-through-price kart-discounted-price" data-current-currency="INR" style="text-decoration: line-through;">${res.data.response.formatted_text.final_total_price.toFixed(2)}</small><em class="final-price kart-discounted-price"><b>${nectorDiscountPrice.toFixed(2)}</b></em>`
        );

      } else {

        if($('.signin_redeem.redeem_points').length) {
          $('.redeem_now').addClass('visually-hidden')
          $('.get_points').removeClass('visually-hidden')
          $('.custom-checkbox').prop('checked', false)
          const earnablePoints = Math.floor(res.data.response.formatted_text.final_total_price * 0.05);
          $('.earnable_points').text(earnablePoints)
          redeemLoyaltyPoints()
        }

        var customDiscountPriceElement = $(
          `<small class="strike-through-price kart-discounted-price" data-current-currency="INR" style="text-decoration: line-through;">₹${totalPrice.toFixed(2)}</small>` +
          `<em class="final-price kart-discounted-price"><b>₹${finalTotalPrice.toFixed(2)}</b></em>`
        );
      }
  
      $('.cart-total-text').after(customDiscountPriceElement);
  
      /*this below code is used for manage the UI of easy coupon apply box -- [START]*/ 
      document.querySelector('#discount__amount').textContent = discountAmount;
      document.querySelector('#pay__amount').textContent = res.data.response.formatted_text.final_total_price.toFixed(2);
  
      payTotal.classList.remove('visually-hidden');
      discountTotal.classList.remove('visually-hidden');
      mcPayTotal.classList.add('visually-hidden');
  
      if(KartDiscount_detail[discount_code] != undefined) {
        sessionStorage.setItem('applyCoupun_heading', KartDiscount_detail[discount_code]);
      }
  
      sessionStorage.setItem('applyCoupun', discount_code);
      sessionStorage.setItem('Coupun_saveAmount', discountAmount);
  
      afCouponText.innerHTML = discount_code;
      afHiddenDiscount.value = discount_code;
      afCustomCouponText.value = discount_code;
      discountCodeDetails.innerHTML =  `₹${discountAmount} savings with this coupon`;
      customkartdiscountContainer.classList.add('discount_applied');
      customkartdiscountContainer.classList.add('discount_added');
      discountCodeDetailsContainer.classList.add('show');
  
      document.querySelector('.custom_kartdiscount_container .af_btn_holder').innerHTML = `<button type="button" class="discountCode__remove_btn" onclick="Shopify.DiscountRemove('${discount_code}');">Remove</button>`;
      document.querySelector(".custom_kartdiscount_container").setAttribute("couponCode","true");
      /* this below code is used for manage the UI of easy coupon apply box -- [END] */ 
  
      /* this below code is used for manage the UI of tap to apply -- [START] */ 
      let preAppliedCoupon = $('.discount-coupon-text .discount-coupon-code').html();
  
      if(KartDiscount_detail[preAppliedCoupon] == undefined) {
        sessionStorage.setItem('applyCoupun_heading', '');
      }
  
      let discount_item = document.querySelectorAll('.discount_finder_item');
  
      for (var i = 0; i < discount_item.length; i++) {
        if(discount_item[i].querySelector('.discount_finder_item_cta_btn .discount_cta_btn') != null) {
          discount_item[i].querySelector('.discount_finder_item_cta_btn .discount_cta_btn').classList.contains(preAppliedCoupon) ? [discount_item[i].querySelector('.discount_finder_item_cta_btn .discount_cta_btn').innerHTML = '<span>Applied</span>', discount_item[i].querySelector('.discount_finder_item_cta_btn .discount_cta_btn').classList.add('coupon_applied'), discount_item[i].classList.add('applied_discount')]: [discount_item[i].querySelector('.discount_finder_item_cta_btn .discount_cta_btn').innerHTML = '<span>Tap To Apply</span>', discount_item[i].querySelector('.discount_finder_item_cta_btn .discount_cta_btn').classList.remove('coupon_applied'), discount_item[i].classList.remove('applied_discount') ];
        }
      }
  
      document.querySelector('.custom_discount_filder_container').removeAttribute('open_finder')
      /* this below code is used for manage the UI of tap to apply -- [END] */ 

      window.sessionStorage.setItem('custom_coupon-applied', JSON.stringify(res));
      window.sessionStorage.setItem('custom_coupon-code', discountCode);
      document.cookie = "discount_code=" + discountCode + "; expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/";
    } catch (error) {
      clearTimeout(timeoutId);

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
      resetFrontendState();
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

Shopify.DiscountRemove = function(discount_code) {
  const hiddenCouponInputVal = document.querySelector('.cart-discount-body input.hiddenDiscountValue');
  const localCouponObject = window.sessionStorage.getItem('custom_coupon-applied');
  let parsedLocalCouponObject = JSON.parse(localCouponObject);
  let finalTotalPrice = parsedLocalCouponObject.data.cart_json.total_price;
  let customDiscountWrapper = document.querySelector('.custom-cart-discount-wrapper');
  let couponApplyBody = document.querySelector('#after-coupon-apply');
  let discountHiddenInput = document.querySelector('.cart-discount-body input.hiddenDiscountValue');
  let afterCouponResponse = document.querySelector('#after-coupon-response');
  let couponTag = couponApplyBody.querySelector(".applied-discount-tag");
  let errorMsg = document.querySelector('.custom-cart-discount-wrapper span.error-msg');
  let successMsg = document.querySelector('.custom-cart-discount-wrapper span.success-msg');

  let couponCodeText = couponApplyBody.querySelector(".applied-discount-tag span.discount-coupon-code");
  let couponRemoveAttr = couponApplyBody.querySelector(".applied-discount-tag .discount-remove-coupon");
  let afterDiscountValue = afterCouponResponse.querySelector('.applied-coupon-discount span.discount-value');

  if (customDiscountWrapper.classList.contains('discount-applied')) {
    customDiscountWrapper.classList.remove("discount-applied");
  }
  
  couponTag.classList.add("d-none");
  afterCouponResponse.classList.add("d-none");
  couponApplyBody.querySelector(".applied-discount-tag span.discount-coupon-code").innerText = '';
  afterDiscountValue.innerText = '';
  couponRemoveAttr.removeAttribute('data-applied-coupon');
  discountHiddenInput.removeAttribute('value');
  
  errorMsg.classList.add('d-none');
  successMsg.classList.add('d-none');
  errorMsg.innerHTML = '';
  successMsg.innerHTML = '';

  let discountedPrices = document.querySelectorAll('.kart-discounted-price');
  discountedPrices.forEach(function(el) {
    el.remove();
  });

  let totalTexts = document.querySelectorAll('.cart_total_wrapper .cart-total-text');
  totalTexts.forEach(function(el) {
    el.classList.remove('d-none');
  });

  document.querySelector('#custom-discount-text').value = '';
  window.sessionStorage.removeItem('custom_coupon-applied');
  window.sessionStorage.removeItem('custom_coupon-code');
  
  document.querySelectorAll('.custom_kartdiscount_container .af_btn_holder').forEach(function(el) {
    el.innerHTML = `<button type="button" class="af_custom_apply_coupon_trigger btn btn--regular btn--color btn--fill tlblbr0" id="af_custom_apply_coupon_trigger" onclick="Shopify.CustomDiscountSubmit()" style="margin:0;width:100%;max-height:42px;min-height:42px;padding: 8px 31px;">
      <af class="af_after_loading">Apply</af>
    </button>`;
  });

  document.querySelectorAll('.mini-cart-total-price').forEach(function(el) {
    el.style.display = 'block';
  });

  document.querySelectorAll('.mc_pay__total').forEach(function(el) {
    el.classList.remove('visually-hidden');
  });

  document.querySelectorAll('.pay__total').forEach(function(el) {
    el.classList.add('visually-hidden');
  });

  document.querySelectorAll('.discount__total').forEach(function(el) {
    el.classList.add('visually-hidden');
  });

  document.querySelectorAll('.custom_kartdiscount_container').forEach(function(el) {
    el.removeAttribute('couponCode');
  });

  document.querySelectorAll('.discount_finder_item_cta_btn button').forEach(function(el) {
    el.innerHTML = '<span>Tap To Apply</span>';
  });

  document.querySelectorAll('.discount_finder_item_cta_btn button').forEach(function(el) {
    el.classList.remove('coupon_applied');
  });

  document.querySelectorAll('.custom_kartdiscount_container').forEach(function(el) {
    el.classList.remove('discount_applied');
  });

  document.querySelector('#af_custom_coupon_text').value = sessionStorage.applyCoupun;
  document.querySelector('.discountCode .af_coupon_code').innerHTML = sessionStorage.applyCoupun;
  document.querySelector('.discountCode_details').innerHTML = sessionStorage.getItem('applyCoupun_heading');

  let cartTotal = parseInt($('.total-price').text().replace('₹', '').replace(',', ''));
  
  if(Shopify.redeem_points){
    init_nector_discount_preview(cartTotal * 100);
    document.querySelector('.nector-total').classList.remove('d-none');
  } else {
    if($('.signin_redeem.redeem_points').length) {
      $('.redeem_now').addClass('visually-hidden')
      $('.get_points').removeClass('visually-hidden')
      const earnablePoints = Math.floor(cartTotal * 0.05);
      $('.earnable_points').text(earnablePoints)
      $('.custom-checkbox').prop('checked', false)
      redeemLoyaltyPoints()
    }
  }
  
  setTimeout(() => {
    deleteCookie('discount_code');
  }, 1000)
}

// on loyalty points hanldes on kartdiscount add|remove
document.addEventListener("DOMContentLoaded", (event) => {
  const redeemCheckInput = document.querySelector('.redeem_check input');
  const miniCartGstInput = document.querySelector('.mini-cart__gst input[type=checkbox]');
  const discountCodeInput = document.querySelector("#custom-discount-text");
  const applyButtonBg = document.querySelector('.cart-discount-apply');
  let firstCharacterTyped = false;

  // On first character button unable
  if (discountCodeInput) {
    discountCodeInput.addEventListener('input', (event) => {
      if (!firstCharacterTyped && event.target.value.length > 0) {
        applyButtonBg.classList.add("enable");
        firstCharacterTyped = true;
      } else if (firstCharacterTyped && event.target.value.length === 0) {
        if (applyButtonBg.classList.contains("enable")) {
          applyButtonBg.classList.remove("enable");
          firstCharacterTyped = false;
        }
      }
    });
  }

  // redeem checkbox event listner
  if (redeemCheckInput) {
    redeemCheckInput.addEventListener('change', () => {
      if (window.sessionStorage.getItem('custom_coupon-applied') != null && window.sessionStorage.getItem('custom_coupon-code') != null) {
        const nectorBalance = document.getElementById('nector-discount-preview').getAttribute("data-nector-balance");
        const localCouponObject = window.sessionStorage.getItem('custom_coupon-applied');
        const parsedLocalCouponObject = JSON.parse(localCouponObject);
  
        if (!redeemCheckInput.checked) {
          const totalPrice = parsedLocalCouponObject.data.response.formatted_text.total_price;
          const finalTotalPrice = parsedLocalCouponObject.data.response.formatted_text.final_total_price;
          
          document.querySelector('.cart_total_wrapper .strike-through-price').innerHTML = `₹ ${totalPrice}`;
          document.querySelector('.cart_total_wrapper .final-price b').innerHTML = `₹ ${finalTotalPrice}`;
        } else {
          const nectorDiscountPrice = parsedLocalCouponObject.data.response.formatted_text.final_total_price - parseInt(nectorBalance);
  
          document.querySelector('.cart_total_wrapper .strike-through-price').innerHTML = `₹ ${parsedLocalCouponObject.data.response.formatted_text.final_total_price}`;
          document.querySelector('.cart_total_wrapper .final-price b').innerHTML = `₹ ${nectorDiscountPrice}`;
        }
      }
    })
    
    // min GST checkbnpx event listner
    miniCartGstInput?.addEventListener('change', () => {
      if (window.sessionStorage.getItem('custom_coupon-applied') != null && window.sessionStorage.getItem('custom_coupon-code') != null) {
        const localCouponObject = window.sessionStorage.getItem('custom_coupon-applied');
        const parsedLocalCouponObject = JSON.parse(localCouponObject);
        const totalPrice = parsedLocalCouponObject.data.response.formatted_text.total_price;
        const finalTotalPrice = parsedLocalCouponObject.data.response.formatted_text.final_total_price;
        const nectorBalance = document.getElementById('nector-discount-preview').getAttribute("data-nector-balance");
        
        if (miniCartGstInput.checked) {
          document.querySelector('.cart_total_wrapper .strike-through-price').innerHTML = `₹ ${totalPrice}`;
          document.querySelector('.cart_total_wrapper .final-price b').innerHTML = `₹ ${finalTotalPrice}`;
        } else if (!miniCartGstInput.checked ) {
          const nectorDiscountPrice = parsedLocalCouponObject.data.response.formatted_text.final_total_price - parseInt(nectorBalance);
  
          document.querySelector('.cart_total_wrapper .strike-through-price').innerHTML = `₹ ${parsedLocalCouponObject.data.response.formatted_text.final_total_price}`;
          document.querySelector('.cart_total_wrapper .final-price b').innerHTML = `₹ ${nectorDiscountPrice}`;
        }
      }
    });
  }
});
