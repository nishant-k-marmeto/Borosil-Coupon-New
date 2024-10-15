/*---------This file contains JS for the article-product-suggestion and blog-sentiment analysis---------*/
/*---------article-product-suggestion starts---------*/
$(document).ready(function(){
  if($(".article-products-container")){
    $(".article-products-container").slick({
      dots: true,
      arrows: true,
      slidesToShow: 5,
      slidesToScroll: 1,
      prevArrow: `<button class="slick-arrow slick-prev arrow-bg"><svg width="20px" height="20px" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-left" class="svg-inline--fa fa-arrow-left fa-w-14" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"/></svg></button>`,
      nextArrow: `<button class="slick-arrow slick-next arrow-bg"><svg width="20px" height="20px" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-right" class="svg-inline--fa fa-arrow-right fa-w-14" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"/></svg></button>`,
      responsive: [
        {
          breakpoint: 1441,
          settings: {
            dots: true,
            arrows: true,
            slidesToShow: 4,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 1134,
          settings: {
            dots: true,
            arrows: false,
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 872,
          settings: {
            slidesToShow: 2,
            dots: false,
            arrows: false,
          },
        },
        {
          breakpoint: 767,
          settings: {
            dots: false,
            arrows: false,
            slidesToShow: 1.5,
            slidesToScroll: 1
          },
        },
      ],
    });  
  }
})

/*---------blog sentiment analysis starts---------*/
function socialWindow(url) {
    var left = (screen.width - 570) / 2;
    var top = (screen.height - 570) / 2;
    var params = "menubar=no,toolbar=no,status=no,width=570,height=570,top=" + top + ",left=" + left;
    window.open(url, "NewWindow", params);
}

function setShareLinks() {
    var pageUrl = encodeURIComponent(document.URL);
    var tweet = encodeURIComponent($("meta[property='og:description']").attr("content"));

    $(".share_facebook").on("click", function() {
        url = "https://www.facebook.com/sharer.php?u=" + pageUrl;
        socialWindow(url);
    });

    $(".share_twitter").on("click", function() {
        url = "https://twitter.com/intent/tweet?url=" + pageUrl + "&text=" + tweet;
        socialWindow(url);
    });

    $(".share_linkedin").on("click", function() {
        url = "https://www.linkedin.com/shareArticle?mini=true&url=" + pageUrl;
        socialWindow(url);
    })
}

setShareLinks();

/*----- slider initialization for tips-and-tricks and lifestyle blogs ------*/
$(document).ready(() => {
  $(".slider-content__slide-wrap").slick({
    dots: true,
    arrows: true,
    lazyLoad: "ondemand",
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: 
      `<svg class="blog-arrow__prev" id="Component_3_1" data-name="Component 3 – 1" xmlns="http://www.w3.org/2000/svg" width="48.778" height="45.831" viewBox="0 0 48.778 45.831"><ellipse id="Ellipse_14" data-name="Ellipse 14" cx="24" cy="22.5" rx="24" ry="22.5" transform="matrix(-1, -0.017, 0.017, -1, 47.993, 45.831)" fill="#013564"/><path id="Polygon_1" data-name="Polygon 1" d="M10.6,0l10.6,20.571H0Z" transform="matrix(0.017, -1, 1, 0.017, 11, 33.298)" fill="#d9e255"/></svg>`,
    nextArrow: 
      `<svg class="blog-arrow__next" id="Component_4_1" data-name="Component 4 – 1" xmlns="http://www.w3.org/2000/svg" width="48" height="45" viewBox="0 0 48 45"><ellipse id="Ellipse_14" data-name="Ellipse 14" cx="24" cy="22.5" rx="24" ry="22.5" fill="#013564"/><path id="Polygon_1" data-name="Polygon 1" d="M10.6,0l10.6,20.571H0Z" transform="translate(37.571 11.844) rotate(90)" fill="#d9e255"/></svg>`
      });
  
  $('.slider-content__slide-wrap').on('afterChange', function(event, slick, currentSlide, nextSlide){
    let currentSlider = $('.slider-image__container.slick-current.slick-active');
    let currentText = currentSlider.find('[data-content-txt]').html();
    $('.slider-content__content').html(currentText);
  });
});

/*--------blog-sentiment-functionality starts---------*/

let articleData = {};
let getCustomerArticleData = {};
let changeCustomerArticleData = {};

let articleUrl = 'https://sentiment.myborosil.com/rates/blog';
let getCustomerArticleUrl = 'https://sentiment.myborosil.com/rates/customer';
let changeCustomerArticleUrl = 'https://sentiment.myborosil.com/rates/capture';

//one function for all the get, change and post the sentiment data
async function sentimentData(url, bodyData, dataType){
  const res= await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyData)
  });
  const data = await res.json();
  if(dataType == 1){
    let love = document.querySelector('[data-love]');
    let impress = document.querySelector('[data-impress]');
    let surprise = document.querySelector('[data-surprise]');
    let angry = document.querySelector('[data-angry]');
    love && data.love ? love.innerText = data.love.count : love.innerText = '0';
    impress && data.impress ? impress.innerText = data.impress.count : impress.innerText = '0';
    surprise && data.surprise ? surprise.innerText = data.surprise.count : surprise.innerText = '0';
    angry && data.angry ? angry.innerText = data.angry.count : angry.innerText = '0';
  }  
  else if(dataType == 2){
    let toCheck = document.querySelector(`[for="${data[0].rating}"]`).classList.add("selected");
    console.log(data[0].rating);
  }
  else{
    console.log("Wrong Data type");
  }
}

document.addEventListener('DOMContentLoaded', () => {
  let parElement = document.querySelector('[data-customer-id]');
  let articleId = document.querySelector('[data-article-id]').getAttribute('data-article-id');
  if(parElement){
    let customerId = parElement.getAttribute('data-customer-id');
    articleData = {"articleId": articleId};
    getCustomerArticleData = {"articleId": articleId,"customerId": customerId};

    //on load get the data
    sentimentData(articleUrl, articleData, 1);

    //on load get the user selected data
    sentimentData(getCustomerArticleUrl, getCustomerArticleData, 2);

    //on change of radio, update the sentiment
    document.querySelectorAll('input[type="radio"][name="fav_language"]').forEach(radio => {
      radio.addEventListener('change', (event) => {
        let rating = radio.value;
        changeCustomerArticleData = {"customerId": customerId,"articleId": articleId,"rating": rating};
        sentimentData(changeCustomerArticleUrl, changeCustomerArticleData, 3);
        let ele = document.querySelector('.sentiment-label.selected');
        
        if(ele){
          let currentElement = document.querySelector('.sentiment-label.selected').querySelector('.sentiment-radio__count');
          let currentCount = parseInt(currentElement.innerText);
          currentElement.innerText = (currentCount-1);
          document.querySelector('.sentiment-label.selected').classList.remove("selected");
        } 
        const clickedElement = event.target;
        clickedElement.closest('.sentiment-radio').querySelector('.sentiment-label').classList.add("selected");
        let newElement = document.querySelector('.sentiment-label.selected').querySelector('.sentiment-radio__count');
        let newCount = parseInt(newElement.innerText);
        newElement.innerText = (newCount+1);
      });
    });
  }
  else {
    document.querySelectorAll('input[type="radio"][name="fav_language"]').forEach(radio => {
      radio.addEventListener('change', (event) => {
        alert('Please login to rate and comment this Article');
      });
    });
    articleData = {"articleId": articleId};
    //on load get the data
    sentimentData(articleUrl, articleData, 1);
  }
  
  
  let dataValues;
  async function getExcelDataAsyncBlog() {
      return new Promise((resolve, reject) => {
        $.ajax({
          url: "https://sheets.googleapis.com/v4/spreadsheets/1im9Wf7akTgMCD-c9D2R5D95O23nEWq5jBKojKaZOC_s/values/Sheet1?key=AIzaSyBtrB1MZJwAR3KXVcoW-pL6PMipiNVfz8U",
          dataType: "json",
          success: function (data) {
            resolve(data.values);
          },
          error: function (error) {
            reject(error);
          },
        });
      });
    }
    
    async function fetchDataAppendBlog() {
      try {
          dataValues = await getExcelDataAsyncBlog();
          let currentCollection = $("[data-blog-handle]").attr("data-blog-handle"),
          firstvalue = "",
          categoryArray = [],
          textArray = [],
          linkArray = [];
        //get the first row unique heading
        for (let i = 1; i < dataValues.length; i++) {
          if (dataValues[i][0].trim() === currentCollection) {
            if (dataValues[i][1].trim() != firstvalue.trim()) {
              firstvalue = dataValues[i][1].trim();
              categoryArray.push(firstvalue);
            }
          }
        }
    
        //create and array of each unique array heading
        for (let k = 0; k < categoryArray.length; k++) {
          this["text" + k] = [];
          this["link" + k] = [];
          textArray.push(this["text" + k]);
          linkArray.push(this["link" + k]);
        }
    
        //for one heading element push 1 array of texts and corresponding 1 array of links
        for (let j = 0; j < categoryArray.length; j++) {
          for (let i = 1; i < dataValues.length; i++) {
            if (dataValues[i][0].trim() == currentCollection) {
              if (dataValues[i][1].trim() == categoryArray[j].trim()) {
                textArray[j].push(dataValues[i][2]);
                linkArray[j].push(dataValues[i][3]);
              }
            }
          }
        }
    
        //appending the fetched data
        if (textArray.length > 0 && linkArray.length > 0) {
          $(".footer-blog-links__container").show();
          for (let j = 0; j < textArray.length; j++) {
            if (textArray[j].length) {
              let heading = document.createElement("p");
              heading.classList.add("h2");
              heading.innerText = categoryArray[j];
              document.querySelector(".footer-blog-links__wrapper").appendChild(heading);
    
              for (let i = 0; i < textArray[j].length; i++) {
                let aTag = document.createElement("a");
                let seporatorTag = document.createElement("div");
                seporatorTag.classList.add("pipe");
                aTag.setAttribute("href", linkArray[j][i]);
                aTag.innerText = textArray[j][i];
                seporatorTag.innerText = "|";
                document.querySelector(".footer-blog-links__wrapper").appendChild(aTag);
                if (i != textArray[j].length - 1) {
                  document
                    .querySelector(".footer-blog-links__wrapper")
                    .appendChild(seporatorTag);
                }
              }
            }
          }
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    }
    fetchDataAppendBlog();
  });