const closeGiftModal = document.querySelector(".gift-popup-close");
// Add open-check-balance-modal to store navigation
document.querySelectorAll("[data-balance-modal='open-check-balance-modal']").forEach((e) => {
  e.addEventListener("click", (event) => {
    document.querySelector(".gift-popup-modal").classList.add("is-active");
  });
});

closeGiftModal?.addEventListener("click", (event) => {
  document.querySelector(".gift-content.is-active").classList.remove("is-active");
  document.querySelector(".gift-content.check").classList.add("is-active");
  document.querySelector(".gift-popup-modal.is-active").classList.remove("is-active");
});

const closeGiftModalClearForm = document.querySelector(".gift-content.on-sucess .gift-card--close");
closeGiftModalClearForm.addEventListener("click", (event) => {
  event.preventDefault();
  document.getElementById("gift-code").value = ""; // Clear the gift code input field
  document.getElementById("gift-code-pin").value = ""; // Clear the gift code pin input field
  document.querySelector(".gift-content.on-sucess").classList.remove("is-active");
  document.querySelector(".gift-content.check").classList.add("is-active");
});



document.getElementById("check_balance").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form submission

  const giftCode = document.getElementById("gift-code").value;
  const giftCodePin = document.getElementById("gift-code-pin").value;
  const storeUrl = "my-borosil.myshopify.com";

  // Make API call and handle response
  fetch("https://qwikcilver.marmeto.com/giftcards/check_balance", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ store: storeUrl, card_number: giftCode, card_pin: giftCodePin }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Check if API call was successful
      if (data.success) {
        const successDiv = document.querySelector(".gift-content.on-sucess");
        const balance = data.data.balance;
        successDiv.innerHTML = `
          <div class="gift-card">
            <img src="https://myborosil.com/cdn/shop/t/277/assets/Borosil-logo-white.png?v=181545771884648499631686559225" class="gift-card--logo">
            <img src="https://myborosil.com/cdn/shop/t/277/assets/Borosil-logo-white.png?v=181545771884648499631686559225" class="gift-card--logo-float">
            <div class="gift-card--code">${giftCode}</div>
            <div class="gift-card--balance"><h2>Balance</h2>Rs. ${balance}</div>
          </div>
          <button id="go-to-step1" class="gift-card--close">Check another card</button>
        `;

        // Hide other content and show the success div
        document.querySelector(".gift-content.check").classList.remove("is-active");
        document.querySelector(".gift-content.on-error").classList.remove("is-active");
        successDiv.classList.add("is-active");

        // Updating the event listener for "Check another card" button
        let prevButton = successDiv.querySelector(".gift-card--close");
        prevButton.addEventListener("click", (event) => {
          event.preventDefault();
          document.getElementById("gift-code").value = ""; // Clear the gift code input field
          document.getElementById("gift-code-pin").value = ""; // Clear the gift code pin input field
          successDiv.classList.remove("is-active");
          document.querySelector(".gift-content.check").classList.add("is-active");
        });
      } else {
        // Show the error message
        let errorDiv = document.querySelector(".gift-content.on-error");
        errorDiv.querySelector("#error-message").textContent = data.error;

        // Hide other content and show the error div
        document.querySelector(".gift-content.check").classList.remove("is-active");
        document.querySelector(".gift-content.on-sucess").classList.remove("is-active");
        errorDiv.classList.add("is-active");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      // Handle any errors that occurred during the API call
      // Show the error message
      let errorDiv = document.querySelector(".gift-content.on-error");
      errorDiv.querySelector("#error-message").textContent = error.message;

      // Hide other content and show the error div
      document.querySelector(".gift-content.check").classList.remove("is-active");
      document.querySelector(".gift-content.on-sucess").classList.remove("is-active");
      errorDiv.classList.add("is-active");
    });
});

