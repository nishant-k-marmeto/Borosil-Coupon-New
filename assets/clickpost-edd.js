var clickpostForm = document.querySelector(".clickpost-edd__form");
var submitButton = clickpostForm.querySelector(".pincode-button");
var responseEddText = document.getElementById("response-edd-text").innerHTML;
let atcButton = document.querySelector('.product-atc');
var responseCodText = document.getElementById("response-cod-text").innerHTML;
var month = clickpostForm.querySelector('input[name="month"]').value;
var dateFormat = clickpostForm.querySelector('input[name="date_format"]').value;
var cutoffTime = clickpostForm.querySelector('input[name="cutoff_time"]') ? clickpostForm.querySelector('input[name="cutoff_time"]').value : '24';
const countdownElement = document.getElementById('countdown');
var ezedd = clickpostForm.querySelector('input[name="ezedd"]') ? clickpostForm.querySelector('input[name="ezedd"]').value : false;

// restrict through the 6 digit
document.querySelector('.pincodeInput').addEventListener('input', function() {
  if (this.value.length > 6) {
    this.value = this.value.slice(0, 6);
  }
});

const now = new Date();
const targetHours = cutoffTime;
const targetTimeToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), targetHours).getTime();
if (countdownElement) {
  const countdownInterval = setInterval(() => {
    const currentTime = new Date().getTime();
    const timeRemaining = targetTimeToday - currentTime;
    if (timeRemaining > 0) {
      const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000).toString().padStart(2, '0');
      countdownElement.innerHTML = `Order within <span style='color:red'>${hours}:${minutes}:${seconds}</span>`;
    } else {
      countdownElement.innerHTML = '00:00:00';
      clearInterval(countdownInterval); // Stop the countdown
    }
  }, 1000);
}
var monthMap = [];
if (month == 'false') {
  monthMap = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
}
else {
  monthMap = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
}
const nth = function (d) {
  if (d > 3 && d < 21) return 'th';
  switch (d % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}
submitButton.addEventListener("click", (event) => {
  event.preventDefault();
  fetchEdd();
});
var inputElementEnter = clickpostForm.querySelector('input[name="drop_pincode"]');
inputElementEnter.addEventListener('keyup', function (e) {
  if (e.key === 'Enter' || e.keyCode === 13) {
    event.preventDefault();
    fetchEdd();
  }
});
const fetchEdd = () => {
  submitButton.classList.toggle("button--loading");
  submitButton.innerHTML=''
  // submitButton.disabled = true;
  var cod = false;
  var responseFail = document.getElementById("response-error");
  var responseSuccess = document.getElementById("response-success");
  responseFail.style.display = "none";
  responseSuccess.style.display = "none";
  document.getElementById("response-hide").style.display = "none";
  var dropPincode = clickpostForm.querySelector('input[name="drop_pincode"]').value;
  var productId = clickpostForm.querySelector('input[name="product_id"]').value;
  if (dropPincode.length != 6 || !/^\d+$/.test(dropPincode)) {
    responseFail.style.color = "red";
    responseFail.innerHTML = document.getElementById("response-invalid-text").innerHTML;
    responseSuccess.style.display = "none";
    responseFail.style.display = "block";
    submitButton.classList.toggle("button--loading");
    submitButton.disabled = false;
    submitButton.innerHTML='Check'  
    return false;
  }
  var pickupPincode = clickpostForm.querySelector('input[name="pickup_pincode"]').value;
  var method = clickpostForm.querySelector('input[name="method"]').value;
  var standardEdd = clickpostForm.querySelector('input[name="standard_edd"]').value;
  var productEdd = clickpostForm.querySelector('input[name="product_edd"]') ? clickpostForm.querySelector('input[name="product_edd"]').value : 0;
  var collectionEdd = clickpostForm.querySelector('input[name="collection_edd"]') ? clickpostForm.querySelector('input[name="collection_edd"]').value : 0;
  var dateRange = clickpostForm.querySelector('input[name="date_range"]').value;
  var vendorEdd = clickpostForm.querySelector('input[name="vendor_edd"]') ? clickpostForm.querySelector('input[name="vendor_edd"]').value : 0;
  var logic = clickpostForm.querySelector('input[name="logic"]') ? clickpostForm.querySelector('input[name="logic"]').value : false;
  sessionStorage.setItem("drop_pincode", dropPincode);
  
  var variantId = document.querySelector(".variant-options-listItem.is-selected").dataset.variant
      cod = true;
      const eddData = {
        dropPincode: dropPincode,
        variantId: variantId
      }
      fetch(
        "/apps/clickpost-edd-proxy/ez-edd",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify([
            eddData
          ]),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if(data.res){
            responseFail.style.display = "none";
            responseSuccess.style.display = "block";
            responseSuccess.classList.add('active');
            var finalEdd = '';
            var dateCurrent = new Date();
            var ez_sla_max = new Date(data.data.max)
            const sla_max = Math.ceil((ez_sla_max.getTime() - dateCurrent.getTime()) / (1000 * 60 * 60 * 24));
            var ez_sla_min = new Date(data.data.min)
            const sla_min = Math.ceil((ez_sla_min.getTime() - dateCurrent.getTime()) / (1000 * 60 * 60 * 24));
            var afterCutoff = false;
            var max = sla_max + parseInt(standardEdd) + parseInt(productEdd) + parseInt(collectionEdd) + parseInt(vendorEdd);
            if (afterCutoff) max = max + 1;
            max = new Date(dateCurrent.getTime() + parseInt(max * 86400000));
            var maxDate = max.getDate();
            if (dateRange == 'true') {
              var min = sla_min + parseInt(standardEdd) + parseInt(productEdd) + parseInt(collectionEdd) + parseInt(vendorEdd);
              if (afterCutoff) min = min + 1;
              min = new Date(dateCurrent.getTime() + parseInt(min * 86400000));
              var minDate = min.getDate();
              if (min.getMonth() == max.getMonth()) finalEdd = `<span class="successful-response">` + minDate + '<sup>' + nth(minDate) + '</sup>' + ` and ` + maxDate + "<sup>" + nth(maxDate) + "</sup>" + ' ' + monthMap[max.getMonth()] + `</span>`;
              else finalEdd = `<span class="successful-response">` + minDate + '<sup>' + nth(minDate) + '</sup>' + ' ' + monthMap[min.getMonth()] + ` and ` + maxDate + "<sup>" + nth(maxDate) + "</sup>" + ' ' + monthMap[max.getMonth()] + `</span>`;
            }
            else {
              finalEdd = 'I am not delivered';
            }
            
            const responseEDD = document.getElementById("response-edd");
            
            responseEDD.innerHTML = responseEddText + " " + finalEdd;
            cod = cod ? `<span class="successful-response">available</span>` : '<span style="color:red">not available</span>';
            document.getElementById("response-cod").innerHTML = responseCodText + " " + cod;
            submitButton.classList.toggle("button--loading");
            submitButton.disabled = false;
            atcButton?.classList.remove('is-disabled');
            submitButton.innerHTML='Check'  
            if (countdownElement && method == 'single') {
              const nowClickpost = new Date()
              const targetHours = cutoffTime
              const targetTimeToday = new Date(nowClickpost.getFullYear(), nowClickpost.getMonth(), nowClickpost.getDate(), targetHours).getTime();
              const targetTimeTomorrow = targetTimeToday + (24 * 60 * 60 * 1000)
              const timeToday = targetTimeToday - (nowClickpost.getTime())
  
              if (timeToday > 0) {
                const countdownInterval = setInterval(() => {
                  const currentTime = new Date().getTime()
                  const timeRemaining = targetTimeToday - currentTime
                  if (timeRemaining > 0) {
                    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
                    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
                    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000).toString().padStart(2, '0');
                    countdownElement.innerHTML = `Order within <span style='color:red'>${hours}:${minutes}:${seconds}</span>`;
                  }
                  else {
                    countdownElement.innerHTML = '00:00:00';
                    clearInterval(countdownInterval); // Stop the countdown
                  }
                }, 1000)
              }
              else {
                const countdownIntervalTomorrow = setInterval(() => {
                  const currentTime = new Date().getTime()
                  const timeRemainingTomorrow = targetTimeTomorrow - currentTime
                  if (timeRemainingTomorrow > 0) {
                    const hours = Math.floor((timeRemainingTomorrow % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
                    const minutes = Math.floor((timeRemainingTomorrow % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
                    const seconds = Math.floor((timeRemainingTomorrow % (1000 * 60)) / 1000).toString().padStart(2, '0');
                    countdownElement.innerHTML = `Order within <span style='color:red'>${hours}:${minutes}:${seconds}</span>`;
                  }
                  else {
                    countdownElement.innerHTML = '00:00:00';
                    clearInterval(countdownIntervalTomorrow); // Stop the countdown
                  }
                }, 1000);
              }
              countdownElement.style.display = "block";
            }
          }
          else{
            submitButton.classList.toggle("button--loading");
            
            atcButton?.classList.add('is-disabled');
            submitButton.innerHTML='Check'  
            submitButton.disabled = false;
            responseSuccess.classList.remove('active');
            responseSuccess.style.display = "none";
            responseFail.style.display = "block";
            responseFail.innerHTML = "Pincode not servicable";
          }
        })
        .catch((error) => {
          responseSuccess.classList.remove('active');
          submitButton.innerHTML='Check'  
          submitButton.classList.toggle("button--loading");
          submitButton.disabled = false;
          atcButton?.classList.add('is-disabled');
          responseFail.style.display = "block";
          responseFail.innerHTML = `Unable to retrieve estimated delivery date.`;
        });
}
window.addEventListener("load", (event) => {
  const dropPincode = sessionStorage.getItem("drop_pincode");
  if (dropPincode) {
    clickpostForm.querySelector('input[name="drop_pincode"]').value = dropPincode;
    fetchEdd();
  }
});