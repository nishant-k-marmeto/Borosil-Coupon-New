function faqFunctionality() {
    $(".FAQwrite_question_form_action_submit").addClass("disableSubmit");
  
    $(".section--product-details").find(".faq_link").show();
  
    $(".section--product-details")
      .find(".faq_link")
      .click(function () {
        $("html, body").animate(
          {
            scrollTop: $(".faq-container").offset().top,
          },
          2000
        );
      });
  
    $(".faq-content").hide();
    $(".FAQread_question_answer .faq").click((e) => {
      $(".faq-content").hide();
      $(".PlusButton").html("+");
      let $target = $(e.target);
      if ($target.closest(".faq").hasClass("ShowAnswer")) {
        $target.closest(".faq").removeClass("ShowAnswer");
        $target.closest(".faq").find(".faq-content").hide();
        $target.closest(".faq").find(".PlusButton").html("+");
      } else {
        $target.closest(".faq").addClass("ShowAnswer");
        $target.closest(".faq").find(".faq-content").show();
        $target.closest(".faq").find(".PlusButton").html("-");
      }
    });
  
    $(".FAQread_question_answer .faq_hidden").click((e) => {
      $(".faq-content").hide();
      $(".PlusButton").html("+");
      let $target = $(e.target);
      if ($target.closest(".faq_hidden").hasClass("ShowAnswer")) {
        $target.closest(".faq_hidden").removeClass("ShowAnswer");
        $target.closest(".faq_hidden").find(".faq-content").hide();
        $target.closest(".faq_hidden").find(".PlusButton").html("+");
      } else {
        $target.closest(".faq_hidden").addClass("ShowAnswer");
        $target.closest(".faq_hidden").find(".faq-content").show();
        $target.closest(".faq_hidden").find(".PlusButton").html("-");
      }
    });
  
    $(".view-all-text").click((e) => {
      if ($(".view-all-text").hasClass("ViewAll")) {
        $(".view-all-text").removeClass("ViewAll");
        $(".faq_hidden").hide();
        $(".view-all-text").html("View All");
      } else {
        $(".view-all-text").addClass("ViewAll");
        $(".faq_hidden").show();
        $(".view-all-text").html("View Less");
      }
    });
  
    $(".ask-question").click((e) => {
      $(".ask-question").hide();
      $(".FAQread_question_answer").hide();
      $(".FAQwrite_question_answer").show();
    });
  
    $(".ask-question_mobilescreen").click((e) => {
      $(".ask-question").hide();
      $(".FAQread_question_answer").hide();
      $(".FAQwrite_question_answer").show();
    });
  
    $(".FAQwrite_question_form_action_cancle").click((e) => {
      event.preventDefault();
      $(".ask-question").show();
      $(".FAQread_question_answer").show();
      $(".FAQwrite_question_answer").hide();
    });
  
    $("#email").blur(function () {
      let EmailEntered = $("#email").val();
      if (
        /([A-Z0-9a-z_-][^@])+?@[^$#<>?]+?\.[\w]{2,4}/.test(EmailEntered) == false
      ) {
        $(".Email_Error").show();
        $(".Email_Error").html(
          "Please enter correct Email id (Ex: john@gmail.com)"
        );
        $(".FAQwrite_question_form_action_submit").addClass("disableSubmit");
      } else {
        $(".Email_Error").hide();
      }
    });
  
    //check the forn input after entering the details
  
    $(".FAQwrite_question_form_action_submit").click((e) => {
      let formFilled = true;
      $("#contact_form input").each(function () {
        if (
          ($(this).val() == "" && $("#question").val() == "") ||
          ($(this).val().length == 0 && $("#question").val().length == 0)
        ) {
          formFilled = false;
          return false;
        }
      });
  
      $("#contact_form textarea").each(function () {
        if ($(this).val() == "") {
          formFilled = false;
          return false;
        }
      });
  
      if (formFilled) {
        $(".Email_Error").hide();
        $(".Name_Error").hide();
        $(".Text_Error").hide();
        $("#contact_form").submit(function () {
          $(".QuestionSubmitted_message").show();
          $(".FAQwrite_question_answer").hide();
          return false;
        });
      } else {
        $("#contact_form input").each(function () {
          if ($("#fname").val() == "") {
            $(".Name_Error").show();
            $(".Name_Error").html("Please enter your Name (Ex: John Smith)");
          }
          if ($("#email").val() == "") {
            $(".Email_Error").show();
            $(".Email_Error").html(
              "Please enter your Email id (Ex: john@gmail.com)"
            );
          }
        });
  
        $("#contact_form textarea").each(function () {
          if ($(this).val() == "") {
            $(".Text_Error").show();
            $(".Text_Error").html("Please enter your Question");
          }
        });
  
        return false;
      }
    });
  
    //check if all are filled
    $("#fname, #email, #question").on("keyup", function () {
      if (allFilled()) {
        $(".FAQwrite_question_form_action_submit").removeClass("disableSubmit");
        $(".Submit_Error").hide();
      }
  
      //if name and email entered is correct
  
      let EmailEntered = $("#email").val();
      if (
        /([A-Z0-9a-z_-][^@])+?@[^$#<>?]+?\.[\w]{2,4}/.test(EmailEntered) == true
      ) {
        $(".Email_Error").hide();
      }
  
      if ($("#question").val() != "") {
        $(".Text_Error").hide();
      }
    });
  
    $("#email").on("keyup", function () {
      $(".Email_Error").hide();
    });
  
    $(".FAQread_section_button").click((e) => {
      $(".QuestionSubmitted_message").hide();
      $(".ask-question").show();
      $(".FAQread_question_answer").show();
    });
  }
  
  $(() => {
    faqFunctionality();
  });
  
  function allFilled() {
    let filled = true;
  
    $("#contact_form input").each(function () {
      if ($(this).val() == "" && $("#question").val() == "") {
        filled = false;
      }
  
      let NameEntered = $("#fname").val();
      if (/^[a-zA-Z ]*$/.test(NameEntered) == false) {
        $(".Name_Error").show();
        $(".Name_Error").html("Please enter correct Name (Ex: John Smith)");
        filled = false;
      } else {
        $(".Name_Error").hide();
      }
    });
  
    if ($("#question").val() == "") {
      filled = false;
    }
  
    return filled;
  }
  
  function QuestionCountChar(val) {
    let len = val.value.length;
    if (len >= 500) {
      val.value = val.value.substring(0, 500);
    } else {
      $("#charNum").text(len + "/1000");
    }
  }