/* Fetching and combining product data from two halves of a collection,
    storing it in session storage, and populating a select element with product titles.  */

let allProducts = [];

/*--- Calling this function once is like ordering endless pizza 
    – it keeps coming until your appetite for template pages is satisfied! */
async function appendProductData(url) {
  const response = await fetch(url);
  const data = await response.json();

  allProducts = allProducts.concat(data);

  let splitUrl = url.split("page=");
  let pageNumber = parseInt(data[0].pageNumber);
  let currentPage = parseInt(splitUrl[1]);

  if (pageNumber > currentPage) {
    let nextPageUrl = splitUrl[0] + "page=" + (currentPage + 1);
    await appendProductData(nextPageUrl);
  } else {
    sessionStorage.setItem("allProducts", JSON.stringify(allProducts));
    allProducts = JSON.parse(sessionStorage.getItem("allProducts"));
    allProducts.map((product, index) => {
      $("#mm-reg-product-fetched").append(
        $("<option>", {
          value: index + 1,
          text: product.title,
        })
      );
    });
  }
}

let allProductsURL = "/collections/all?view=product_sku&page=1";
appendProductData(allProductsURL);

//error handling and functionality for the product registration
let selectedProduct, selectedVariant, imageExtension;
$(document).ready(function () {
  const setSelectedProduct = (productIndex, variantIndex = 0) => {
    selectedProduct = allProducts[productIndex];
    $("#mm-reg-product-fetched option:selected").attr({ selected: "false" });
    $(`#mm-reg-product-fetched option[value="${productIndex + 1}"]`).attr({
      selected: "true",
    });
    $("#variant-selector-dropdown").empty();
    selectedProduct.variants.map((variant, index) => {
      $("#variant-selector-dropdown").append(
        $("<option>", {
          value: index + 1,
          text: variant.title,
        })
      );
    });
    selectedVariant = selectedProduct.variants[variantIndex];
    $("#variant-selector-dropdown option:selected").attr({ selected: "false" });
    $(`#variant-selector-dropdown option[value="${variantIndex + 1}"]`).attr({
      selected: "true",
    });
  };

  $("#mm-reg-product-fetched").on("change", function (event) {
    const currentIndex = $(this).find("option:selected").index();
    setSelectedProduct(currentIndex);
  });

  $("#variant-selector-dropdown").on("change", function (event) {
    const currentIndex = $(this).find("option:selected").index();
    selectedVariant = selectedProduct.variants[currentIndex];
  });

  function showFile(file) {
    const imageFileTypes = ["image/png", "image/jpeg"];
    const fileType = file.type;
    imageExtension = fileType;

    // Unsetting the color to prevent red color text everytime.
    $(".file-upload-div p").html("").css({ color: "unset" });

    if (!imageFileTypes.includes(fileType)) {
      $(".file-upload-div p")
        .html("Please upload only Image file")
        .css({ color: "red" });
      return;
    }

    let fileReader = new FileReader();
    fileReader.onload = () => {
      let fileURL = fileReader.result;
      let imageTag = `<div class="up-image-container">
                                    <img style="height:50px; width:50px" id="selected-img" src="${fileURL}"><input type="button" value="x" id="input-img-close"></img>
                                </div>`;
      $(".file-upload-div").after(imageTag);
    };
    fileReader.readAsDataURL(file);
  }

  //image drag drop functionality for uploading
  $(document).on(
    "dragover dragleave drop",
    ".file-upload-container",
    function (event) {
      event.preventDefault();
      event.stopPropagation();

      if ($(".up-image-container").length) return;

      if (event.type == "dragleave") {
        $(".file-upload-div p").html("Drop Image here");
      } else if (event.type == "dragover") {
        $(".file-upload-div p").html("Release to drop");
      } else {
        if (event.type == "drop") {
          const file = event.originalEvent.dataTransfer.files[0];
          $(".file-upload-div p")
            .html("Drag and drop and Image")
            .css({ color: "unset" });
          showFile(file);
        }
      }
    }
  );

  $(document).on("change", "#input-upload-image", function (event) {
    const file = this.files[0];
    showFile(file);
  });

  //handle the search functionality
  const handleSearch = (event) => {
    event.preventDefault();

    if (!$(".search-header__input.search__input").val()) {
      $(".product-search-error").show();
      return;
    }

    $(".product-search-error").hide();
    $(".selection-container").css({ display: "unset" });
    const registrationInput = $(".search-header__input.search__input")
      .val()
      .toLowerCase();
    let matchedProduct;
    allProducts.map((product, productIndex) => {
      product.variants.forEach((variant, variantIndex) => {
        if (!matchedProduct) {
          if (
            (variant.p_title &&
              variant.p_title
                .toLowerCase()
                .includes(registrationInput.toLowerCase())) ||
            (variant.barcode &&
              variant.barcode
                .toLowerCase()
                .includes(registrationInput.toLowerCase())) ||
            (variant.sku &&
              variant.sku
                .toLowerCase()
                .includes(registrationInput.toLowerCase()))
          ) {
            matchedProduct = product;
            setSelectedProduct(productIndex, variantIndex);
          }
        }
      });
    });
  };

  const handleImageClose = (event) => {
    $(".up-image-container").remove();
  };

  //registering product data through API
  const handleProductRegister = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!selectedProduct || !selectedVariant) setSelectedProduct(0);

    const productId = selectedProduct.id;
    const variantId = selectedVariant.id;
    const regProductType = selectedProduct.title;
    const productName = $("#mm-reg-product-fetched")
      .find("option:selected")
      .text();
    const variantName = $("#variant-selector-dropdown")
      .find("option:selected")
      .text();
    const inputSKU = selectedVariant.sku || "";
    const customerId = $("[data-customer-id]").attr("data-customer-id");
    const fileExt = imageExtension;
    const invoice_base64 =
      $("#selected-img").length && $("#selected-img").attr("src");
    if (!invoice_base64) {
      $(".file-upload-div p")
        .html("Please select an invoice image")
        .css({ color: "red" });
      return;
    }

    $(".submit-to-register input").hide();
    $(".loader").show();
    $(".product-search-error").hide();

    const registrationData = {
      product_id: productId,
      variant_id: variantId,
      product_name: productName,
      variant_name: variantName,
      sku: inputSKU,
      customer_id: customerId,
      file_ext: fileExt.substr(6),
      invoice_file: invoice_base64,
    };

    const registrationURL =
      "https://borosil.marmeto.com/api/addProductRegistration";
    fetch(registrationURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registrationData),
    })
      .then((response) => response.json())
      .then((data) => {
        $(".loader").hide();
        $(".custom-customer-container").hide();
        $(".registration-output-container").show();
        $(".registration-output-success").show();
      })
      .catch((err) => {
        $(".loader").hide();
        $(".custom-customer-container").hide();
        $(".registration-output-container").show();
        $(".registration-output-error").css({ display: "flex" });
      })
      .finally(()=>{
        Shopify.analytics.publish("product_registration", { product_name: productName, category_name : regProductType, invoice : invoice_base64, SKU : inputSKU });
      });
  };

  $(document).on("click", "#input-img-close", (event) => {
    handleImageClose(event);
  });

  $(document).on("click", ".product-reg-search-btn", (event) =>
    handleSearch(event)
  );
  $(document).on("click", ".submit-to-register", (event) =>
    handleProductRegister(event)
  );
});
