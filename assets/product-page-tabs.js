
// product page tabs switching js code

function productTabsFunctionality() {
    $(".tabs").find(".tab_about").click(function () {
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
  
    $(".tabs").find(".tab_features").click(function () {
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
  
    $(".tabs").find(".tab_PackNSize").click(function () {
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
  
    $(".tabs").find(".tab_UseNCare").click(function () {
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
  
    $(".tabs").find(".tab_TechSpecs").click(function () {
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