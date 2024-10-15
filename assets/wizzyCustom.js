window.onWizzyScriptLoaded=function () {

  $(document).on('click', '.wizzy-custom-addToCart', function(ev) {
    ev.preventDefault();
    
    if($(this).hasClass('is-disabled')) {
      return;
    }
    
    var selectedVariant = $(this).parents('.product-card').find('.product-item-swatch-item.swatch-selected.swatch-in-stock');
    var variantId;
    if(selectedVariant == undefined) {
      variantId = selectedVariant.attr('data-variationid');
    }else {
      variantId = $(this).parents('.product-card').attr('data-id');
    }
       
      const $parentCard = $(this).parents('.product-card')
      $parentCard.find('.loader').show();
      $parentCard.find('.wizzy-custom-addToCart').hide();
      $.ajax({
        method: 'POST',
        url: '/cart/add.js',
        dataType: 'json',
        cache: false,
        data: {
          id: parseInt(variantId),
          quantity: 1 // parseInt(quantity)
        },
        success: function() {
        mmajaxcart.AjaxcartRender();
        mmajaxcart.AjaxcartOpen();
        $parentCard.find('.loader').hide();
        $parentCard.find('.wizzy-custom-addToCart').show();
        },
        error: function (jqXHR, textStatus, errorThrown) {
          alert("Error while adding to cart");      
          $parentCard.find('.loader').hide();
          $parentCard.find('.wizzy-custom-addToCart').show();
        }
      })
  })
  


  window.wizzyConfig.events.registerEvent(window.wizzyConfig.events.allowedEvents.AFTER_PRODUCTS_TRANSFORMED, function(data) {
      let n = data.length;
      let m;
      for (let i = 0; i < n; i++) {

        var hasSwatch = data[i].swatches?.length;
        if(hasSwatch != undefined &&  hasSwatch > 0) {
          
          var swatchesLength = data[i].swatches[0].values.length;
          if(swatchesLength > 0) {
            data[i].swatches[0].values[0].firstSwatch = true;
          }
        }
        
        m = data[i].attributes.length;
        for (let j = 0; j < m; j++) {

          if (data[i].attributes[j].id === "product_badge_judgeme") {
            const htmlString = data[i].attributes[j].values[0].value[0];
            const tempElement = document.createElement('div');
            tempElement.innerHTML = htmlString;
            
            const spanElement = tempElement.querySelector('.jdgm-prev-badge__text');
            spanElement.innerHTML = spanElement.innerHTML.split("reviews").join("");
            spanElement.innerHTML = spanElement.innerHTML.split("review").join("");
            var checkIfNoReviews = spanElement.innerHTML;
            if(checkIfNoReviews == " No  ") {
              
            }else {
              data[i].reviewHTML = tempElement.querySelector(".jdgm-prev-badge").innerHTML;
            }
                          
          } else if (data[i].attributes[j].id === "product_variant_ids") {
            data[i].variantId = data[i].attributes[j].values[0].value[0];
          }else if(data[i].attributes[j].id === "product_subtitle_product_subtitle") {
            var valueOfSubtitle = data[i].attributes[j].values[0].value[0]; 
            valueOfSubtitle = valueOfSubtitle.split(`["`).join("");
            valueOfSubtitle = valueOfSubtitle.split(`"]`).join("");
            if(valueOfSubtitle !== "&nbsp") {
              data[i].subTitle = valueOfSubtitle;
            }
          }else if(data[i].attributes[j].id == "product_Size") {
            data[i].currentSelectedSwatch = data[i].attributes[j].values[0].value[0];
          }else if(data[i].attributes[j].id == "product_tags") {
            let tags = data[i].attributes[j].values[0].value[0];
            data[i].personalizeCart = tags.includes("personalise");
          }
        }
         if (data[i].price) {
            data[i].price = data[i].price.split(".")[0];
          }
  
          if (data[i].sellingPrice) {
            data[i].sellingPrice = data[i].sellingPrice.split(".")[0];
          }
      }
    return data;
  });


  window.wizzyConfig.events.registerEvent(window.wizzyConfig.events.allowedEvents.BEFORE_RENDER_RESULTS, function(data) {
    
    var x = document.getElementById("smile-ui-lite-container");
    if(x != null || x != undefined) {
      x.style.display = "none";
    }
    
    return data;
  });


  $('body').on('click', ".header-search-icon", function(event) {
    if(document.documentElement.clientWidth < 768) {
      let x = document.querySelector('.mobile-search-container');
      if(x.style?.display == 'none') {
        
      }else {
        setTimeout(function() {
          $('.mobile-search-input').click();
          $('.mobile-search-input').focus();
        }, 200);
      }
    }
  });

  
  var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutationRecord) {
        if ($(mutationRecord.target).hasClass("sticky")) {
          $("body").addClass("wizzy-autocomplete-position-fix");
        } else {
          $("body").removeClass("wizzy-autocomplete-position-fix");
        }
      });    
  });
  
  var target = document.getElementById('navbar-container');
  observer.observe(target, { attributes : true, attributeFilter : ['class'] })

  
  
  changeTemplate("wizzy-search-results-product");
  changeTemplate("wizzy-search-results");
  changeTemplate("wizzy-autocomplete-topproducts");
}



const getVariantDataFromApi = (x, variationId, groupId) => {
  fetch("https://api.wizzy.ai/v1/products/variation", {
      // Adding method type
      method: "POST",
       
      // Adding body or contents to send
      body: JSON.stringify({
        "variationId": variationId,
        "groupId": groupId,
      }),
       
      // Adding headers to the request
      headers: {
        "x-store-id": "244cd0b4e42711eda8750a0c8095feae",
        "x-api-key": "VTl2UmJWb1QzUkxqaTNET0dob2RpWFYxdVhzWlZkMHFTenhyakkzVCtvelJXcTAybTVvekNZM1JmRXpEVlg4UkN6OWJjSWoxd21mT21kY0w3dUpRUlE9PQ==",
        "Content-type": "application/json; charset=UTF-8"
      }
  })
 
  // Converting to JSON
  .then(response => response.json())
   
  // Displaying results to console
  .then((json) => {
    console.log(json);
    x.attr("data-variant-price", json.payload.result.sellingPrice.toString() + "00"); 
    x.attr("data-variant-maxprice", json.payload.result.price.toString() + "00");
    x.attr("data-variant-pricetoprint", "₹ " + json.payload.result.sellingPrice.toString());
    x.attr("data-variant-maxpricetoprint", "₹ " + json.payload.result.price.toString());
    
  });
}

const changeTemplate = (div) => {
  const oldDiv = document.getElementById(div);
  const newDiv = document.getElementById(div + "-new").text;
  oldDiv.text = newDiv;
}

