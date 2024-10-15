/****PLEASE DON'T MAKE CHANGES IN THIS FILE IT'S AFFECT THE CODE IF YOU NEED ANY HELP PLEASE CONTACT TO FLITS TEAM support@getflits.com ****/
(function (Flits) {
    var wishlistButton = (Flits.wishlistButton = function (options) {
        Flits.wishlistButton.settings = {};
        var settings = {
            automaticAppendDivFunction: function () {},
            isWishlistAutomatic: 1,
            wslBtnType: 1,
            isCountEnable: 0,
            addtocartSelectors: ["form[action='/cart/add']:not([id*='product-form-installment'])"],
            wishListBtnDomSelector: "flits-wishlist-dom",
            wishlist_base_url: "/wishlist",
            add_wsl_url: "/add_to_wishlist",
            remove_wsl_url: "/remove_from_wishlist",
            wishlistHandle: "flits_wishlist_products",
            wishlistLastUpdate: "last_wishlist_product_update",
            clicked_add_button: "",
            appearance_style: {
                before_heart_clr: "#000000",
                before_btn_clr: "#fff",
                before_text_clr: "#f5020f",
                before_border_clr: "#000000",
                after_heart_clr: "#fc0303",
                after_btn_clr: "#080707",
                after_text_clr: "#f5faf9",
                after_border_clr: "#f7f5fa",
                collection_before_heart_clr: "#000000",
                collection_after_heart_clr: "#fc0303",
            },
            wishlist_guest_model_html: `<div id="flits-wishlist-guest-modal-content" style="display:none"> <div class="flits-wishlist-guest-modal"> <div class="flits-modal-background"> <div class="flits-bg-heart flits-heart-1"> <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24.81 21.5"><path d="M13.08,23l9.77-9.6a6.85,6.85,0,0,0,.85-8.76,6.25,6.25,0,0,0-5-2.91h-.06c-2.72,0-5.07,2.05-6.16,3.19C11.41,3.79,9.07,1.75,6.34,1.75H6.28a6.37,6.37,0,0,0-5,2.94,6.83,6.83,0,0,0,.88,8.7L11.92,23A.84.84,0,0,0,13.08,23ZM2.59,5.64A4.79,4.79,0,0,1,6.27,3.4h0c2.87,0,5.51,3.24,5.51,3.28h0a.85.85,0,0,0,1.2.09l.1-.09S15.8,3.33,18.7,3.4a4.71,4.71,0,0,1,3.66,2.21,5.18,5.18,0,0,1-.66,6.6l-9.2,9.06L3.34,12.21A5.18,5.18,0,0,1,2.59,5.64Z" transform="translate(-0.1 -1.75)" style="fill:#e9e8e8"/></svg> </div> <div class="flits-bg-heart flits-heart-2"> <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24.81 21.5"><path d="M13.08,23l9.77-9.6a6.85,6.85,0,0,0,.85-8.76,6.25,6.25,0,0,0-5-2.91h-.06c-2.72,0-5.07,2.05-6.16,3.19C11.41,3.79,9.07,1.75,6.34,1.75H6.28a6.37,6.37,0,0,0-5,2.94,6.83,6.83,0,0,0,.88,8.7L11.92,23A.84.84,0,0,0,13.08,23ZM2.59,5.64A4.79,4.79,0,0,1,6.27,3.4h0c2.87,0,5.51,3.24,5.51,3.28h0a.85.85,0,0,0,1.2.09l.1-.09S15.8,3.33,18.7,3.4a4.71,4.71,0,0,1,3.66,2.21,5.18,5.18,0,0,1-.66,6.6l-9.2,9.06L3.34,12.21A5.18,5.18,0,0,1,2.59,5.64Z" transform="translate(-0.1 -1.75)" style="fill:#e9e8e8"/></svg> </div> <div class="flits-bg-heart flits-heart-3"> <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24.81 21.5"><path d="M13.08,23l9.77-9.6a6.85,6.85,0,0,0,.85-8.76,6.25,6.25,0,0,0-5-2.91h-.06c-2.72,0-5.07,2.05-6.16,3.19C11.41,3.79,9.07,1.75,6.34,1.75H6.28a6.37,6.37,0,0,0-5,2.94,6.83,6.83,0,0,0,.88,8.7L11.92,23A.84.84,0,0,0,13.08,23ZM2.59,5.64A4.79,4.79,0,0,1,6.27,3.4h0c2.87,0,5.51,3.24,5.51,3.28h0a.85.85,0,0,0,1.2.09l.1-.09S15.8,3.33,18.7,3.4a4.71,4.71,0,0,1,3.66,2.21,5.18,5.18,0,0,1-.66,6.6l-9.2,9.06L3.34,12.21A5.18,5.18,0,0,1,2.59,5.64Z" transform="translate(-0.1 -1.75)" style="fill:#e9e8e8"/></svg> </div> <div class="flits-bg-star flits-star-1"> <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 25 25"><path d="M12.5,25,8.73,16.27,0,12.5,8.73,8.73,12.5,0l3.77,8.73L25,12.5l-8.73,3.77Z" transform="translate(0)" style="fill:#e9e8e8"/></svg> </div> <div class="flits-bg-star flits-star-2"> <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 25 25"><path d="M12.5,25,8.73,16.27,0,12.5,8.73,8.73,12.5,0l3.77,8.73L25,12.5l-8.73,3.77Z" transform="translate(0)" style="fill:#e9e8e8"/></svg> </div> <div class="flits-bg-star flits-star-3"> <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 25 25"><path d="M12.5,25,8.73,16.27,0,12.5,8.73,8.73,12.5,0l3.77,8.73L25,12.5l-8.73,3.77Z" transform="translate(0)" style="fill:#e9e8e8"/></svg> </div> <div class="flits-bg-star flits-star-4"> <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 25 25"><path d="M12.5,25,8.73,16.27,0,12.5,8.73,8.73,12.5,0l3.77,8.73L25,12.5l-8.73,3.77Z" transform="translate(0)" style="fill:#e9e8e8"/></svg> </div> <div class="flits-bg-star flits-star-5"> <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 25 25"><path d="M12.5,25,8.73,16.27,0,12.5,8.73,8.73,12.5,0l3.77,8.73L25,12.5l-8.73,3.77Z" transform="translate(0)" style="fill:#e9e8e8"/></svg> </div> <div class="flits-bg-star flits-star-6"> <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 25 25"><path d="M12.5,25,8.73,16.27,0,12.5,8.73,8.73,12.5,0l3.77,8.73L25,12.5l-8.73,3.77Z" transform="translate(0)" style="fill:#e9e8e8"/></svg> </div> <div class="flits-bg-star flits-star-7"> <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 25 25"><path d="M12.5,25,8.73,16.27,0,12.5,8.73,8.73,12.5,0l3.77,8.73L25,12.5l-8.73,3.77Z" transform="translate(0)" style="fill:#e9e8e8"/></svg> </div> </div> <div class="flits-wishlist-guest-form-box"> <div class="flits-tingle-modal-popup-header"> <div class="flits-tingle-modal-popup-header-image"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56.24 50"><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path d="M45.93,21.27a20.2,20.2,0,1,1-26.84-9.8,20.2,20.2,0,0,1,26.84,9.8" style="fill:#4576bb"/><path d="M24.3,0l.9,2.07,2.07.9-2.07.89-.9,2.07-.9-2.07L21.33,3l2.07-.9ZM53.19,22.49l-1.63.7,1.63.71.71,1.64.71-1.64,1.63-.71-1.63-.7-.71-1.64Zm-52,1.16L0,24.17l1.21.52.52,1.21.52-1.21,1.21-.52-1.21-.52-.52-1.21Z" style="fill:#2c6db6"/><path d="M44.28,5.18a1.94,1.94,0,1,1-2.36,1.39,1.94,1.94,0,0,1,2.36-1.39M6.61,10.33a1.28,1.28,0,0,0-2.56,0,1.28,1.28,0,0,0,2.56,0" style="fill:#5bc1ee"/><path d="M41.4,24V38.29A1.7,1.7,0,0,1,39.7,40H15.83a1.7,1.7,0,0,1-1.7-1.7V24Z" style="fill:#ababab"/><path d="M40.79,22.76A1.49,1.49,0,0,1,41.4,24H14.13a1.49,1.49,0,0,1,.61-1.2l12.15-8.88a1.47,1.47,0,0,1,1.76,0l12.14,8.88" style="fill:#d8d7db"/><path d="M37.4,21.58a.53.53,0,0,1,.53.53V37.28a.54.54,0,0,1-.53.54H18.2a.54.54,0,0,1-.54-.54V22.11a.54.54,0,0,1,.54-.53H37.4" style="fill:#e0e5f4"/><path d="M20.79,26.29a.27.27,0,0,1,0-.54H34.86a.27.27,0,0,1,0,.54H20.79m14.07,1.78H20.79a.27.27,0,0,0,0,.54H34.86a.27.27,0,0,0,0-.54m0,2.32H20.79a.27.27,0,0,0,0,.54H34.86a.27.27,0,0,0,0-.54" style="fill:#01516a"/><path d="M41.4,24V38.32A1.67,1.67,0,0,1,39.73,40H15.83Z" style="fill:#fff"/><path d="M39.7,40H15.8a1.67,1.67,0,0,1-1.67-1.67V24Z" style="fill:#f2f0f8"/></g></g></svg> </div> <p class="flits-h2 flits-tingle-modal-popup-header-title"> ${Flits.t(
                "Flits.locals.wishlisted_product_page.what_is_your_email",
                "What's Your Email?"
            )} </p> </div> <div class="flits-tingle-modal-popup-body"> <form id='flits-guest-wishlist-form'> <div class="flits-input-wrap"> <input type="email" class="flits-input flits-tingle-input" placeholder='${Flits.t(
                "Flits.locals.wishlisted_product_page.email_placeholder",
                "Email address"
            )}' name="email" value="" id="flits_email_id" required=""> </div> <div class="flits-tingle-modal-popup-action"> <button type="submit" class="flits-button flits-tingle-btn flits-tingle-primary-btn" data-flits-lang="wishlisted_product_page.add_to_wishlist_button" data-flits-lang-default="Add to Wishlist"> Add to Wishlist </button> </div> </form> </div> </div> <div class="flits-wishlist-guest-message-box" style='display:none'> <div class="flits-tingle-modal-popup-header"> <div class="flits-tingle-modal-popup-header-image"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56.24 50"><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path d="M24.3,0l.9,2.07,2.07.9-2.07.89-.9,2.08-.9-2.08L21.33,3l2.07-.9ZM53.19,22.48l-1.64.71,1.64.71.71,1.63.7-1.63,1.64-.71-1.64-.71-.7-1.63Zm-52,1.17L0,24.17l1.21.52.52,1.21.52-1.21,1.21-.52-1.21-.52-.52-1.21Z" style="fill:#2c6db6"/><path d="M44.28,5.18a1.94,1.94,0,1,1-2.36,1.39,1.94,1.94,0,0,1,2.36-1.39M6.61,10.33a1.28,1.28,0,0,0-2.56,0,1.28,1.28,0,0,0,2.56,0" style="fill:#5bc1ee"/><path d="M45.93,21.27a20.2,20.2,0,1,1-26.85-9.8,20.21,20.21,0,0,1,26.85,9.8" style="fill:#4576bb"/><path d="M23.4,28.86a.34.34,0,0,0,.31,0c.18-.09,4.51-2.39,4.51-5a2.28,2.28,0,0,0-.72-1.7,2.36,2.36,0,0,0-1.61-.63A2.71,2.71,0,0,0,23.55,23a2.7,2.7,0,0,0-2.33-1.44,2.36,2.36,0,0,0-1.61.63,2.28,2.28,0,0,0-.72,1.7c0,2.57,4.33,4.87,4.51,5m-3.33-6.17a1.7,1.7,0,0,1,1.15-.45,2.15,2.15,0,0,1,2,1.74.33.33,0,0,0,.41.24.34.34,0,0,0,.24-.24,2.14,2.14,0,0,1,2-1.74,1.7,1.7,0,0,1,1.15.45,1.58,1.58,0,0,1,.51,1.21c0,1.92-3.24,3.86-4,4.29-.75-.43-4-2.37-4-4.29a1.57,1.57,0,0,1,.5-1.21Zm3.48,8.21a6.33,6.33,0,1,0-6.32-6.33,6.33,6.33,0,0,0,6.32,6.33m0-12a5.66,5.66,0,1,1-5.66,5.66,5.66,5.66,0,0,1,5.66-5.66m0,19.32a1.34,1.34,0,1,0,1.34-1.34,1.34,1.34,0,0,0-1.34,1.34m1.34-.67a.67.67,0,1,1-.67.67.67.67,0,0,1,.67-.67m4,.67a1.34,1.34,0,1,0,1.34-1.34,1.34,1.34,0,0,0-1.34,1.34m1.34-.67a.67.67,0,1,1-.67.67.67.67,0,0,1,.67-.67M38.75,24.9h-2a.67.67,0,0,0-.67.67H34.75a.32.32,0,0,0-.33.25l-.26,1.08H31.09v.67h3.33a.33.33,0,0,1,0,.66H30.09v.67h.61l-.4,2.66H26.48l-.06-.38-.66.1,0,.28H23.7l-.08-.4L23,31.3l.8,4a.33.33,0,0,0,.33.27h8.25l-.17.67H24.09a.33.33,0,0,0,0,.66h8.33a.32.32,0,0,0,.33-.25l.33-1.33,1.28-6.41h.06a1,1,0,0,0,.4-1.91l.19-.76h1.07a.67.67,0,0,0,.67.67h2a.66.66,0,0,0,.66-.67v-.66a.66.66,0,0,0-.66-.67M30.2,32.23l-.4,2.67H27l-.45-2.67Zm2.28,2.67h-2l.4-2.67H33Zm-8.66-2.67h2.09l.44,2.67h-2Zm9.32-.67H31l.4-2.66h2.31Zm3.61-6h2v.66h-2Zm-4.2-2.33a.34.34,0,0,1,0-.67h.33v-.33a.34.34,0,1,1,.67,0v.33h.33a.34.34,0,0,1,0,.67h-.33v.33a.34.34,0,0,1-.67,0v-.33h-.33m-2-3.67a.33.33,0,0,1-.33-.33.33.33,0,0,1,.33-.33h.33v-.34a.34.34,0,0,1,.67,0v.34h.33a.33.33,0,0,1,.34.33.34.34,0,0,1-.34.33h-.33v.34a.34.34,0,0,1-.67,0v-.34h-.33M20.22,33.23a.34.34,0,1,1,0,.67h-.33v.33a.34.34,0,0,1-.67,0V33.9h-.33a.34.34,0,0,1,0-.67h.33V32.9a.34.34,0,1,1,.67,0v.33h.33" style="fill:#fff"/></g></g></svg> </div> <p class="flits-h2 flits-tingle-modal-popup-header-title"> ${Flits.t(
                "Flits.locals.wishlisted_product_page.product_added_to_wishlist",
                "Product has been added to your wishlist"
            )} </p> </div> <div class="flits-tingle-modal-popup-body"> <p class="flits-tingle-modal-popup-tagline-text"> ${Flits.t(
                "Flits.locals.wishlisted_product_page.view_your_wishlist_message",
                "You can view your wishlist by creating account or logging-in an existing account."
            )} </p> <p class="flits-tingle-modal-popup-text" id='flits-guest-email'></p> <div class="flits-tingle-modal-popup-action"> <a type="" class="flits-button flits-empty-button flits-tingle-btn flits-tingle-primary-btn" data-flits-lang="wishlisted_product_page.login" data-flits-lang-default="Login" href="/account/login">Login</a> <a type="" class="flits-button flits-empty-button flits-tingle-btn flits-tingle-primary-btn" data-flits-lang="wishlisted_product_page.register" data-flits-lang-default="Register" href="/account/register">Register</a> </div> </div> </div> </div> </div>`,
        };
        settings = Flits.extend(Flits.wishlistButton.settings, settings, options);
        Flits.dispatchEvent("Flits:wishlistButton:Loaded", { settings: settings });
        if (Flits.getLocalStorage(Flits.wishlistButton.settings.wishlistLastUpdate) == undefined) {
            Flits.setLocalStorage(Flits.wishlistButton.settings.wishlistLastUpdate, new Date());
        }
        document.documentElement.style.setProperty("--primaryTingleButtonBGColor", Flits.accountSettings.colorSettings.primaryButtonBGColor);
        document.documentElement.style.setProperty("--primaryTingleButtonHoverBGColor", Flits.lightOrDark(Flits.accountSettings.colorSettings.primaryButtonBGColor));
        document.documentElement.style.setProperty("--primaryTingleButtonTextColor", Flits.accountSettings.colorSettings.primaryButtonTextColor);
        document.documentElement.style.setProperty("--secondaryTingleButtonBGColor", Flits.accountSettings.colorSettings.secondaryButtonBGColor);
        document.documentElement.style.setProperty("--secondaryTingleButtonTextColor", Flits.accountSettings.colorSettings.secondaryButtonTextColor);
        Flits.dispatchEvent("Flits:wishlistButtonColor:Loaded");
        let product_style_string =
            ".filts-wishlist-product-style .flits-wls-button-secondary," +
            ".filts-wishlist-product-style .flits-wls-button-secondary:visited{ " +
            "color: " +
            Flits.wishlistButton.settings.appearance_style.before_text_clr +
            " !important;" +
            "border-color: " +
            Flits.wishlistButton.settings.appearance_style.before_border_clr +
            " !important;" +
            "background: " +
            Flits.wishlistButton.settings.appearance_style.before_btn_clr +
            " !important;" +
            "}" +
            ".filts-wishlist-product-style .flits-wls-button-secondary .flits-wls-icon-svg-color-blue { " +
            "fill: " +
            Flits.wishlistButton.settings.appearance_style.before_heart_clr +
            " !important;" +
            "color: " +
            Flits.wishlistButton.settings.appearance_style.before_heart_clr +
            " !important;" +
            "}" +
            ".filts-wishlist-product-style .flits-wls-button-secondary.flits-wls-active," +
            ".filts-wishlist-product-style .flits-wls-button-secondary.flits-wls-active:visited{ " +
            "color: " +
            Flits.wishlistButton.settings.appearance_style.after_text_clr +
            " !important;" +
            "border-color: " +
            Flits.wishlistButton.settings.appearance_style.after_border_clr +
            " !important;" +
            "background: " +
            Flits.wishlistButton.settings.appearance_style.after_btn_clr +
            " !important;" +
            "}" +
            ".filts-wishlist-product-style .flits-wls-button-secondary.flits-wls-active .flits-wls-icon-svg-color-blue { " +
            "fill: " +
            Flits.wishlistButton.settings.appearance_style.after_heart_clr +
            " !important;" +
            "color: " +
            Flits.wishlistButton.settings.appearance_style.after_heart_clr +
            " !important;" +
            "}";
        let collection_style_string =
            ".flits-wishlist-colection-style .flits-wls-button-secondary .flits-wls-icon-svg-color-blue { " +
            "fill: " +
            Flits.wishlistButton.settings.appearance_style.collection_before_heart_clr +
            " !important;" +
            "color: " +
            Flits.wishlistButton.settings.appearance_style.collection_before_heart_clr +
            " !important;" +
            "}" +
            ".flits-wishlist-colection-style .flits-wls-button-secondary.flits-wls-active .flits-wls-icon-svg-color-blue { " +
            "fill: " +
            Flits.wishlistButton.settings.appearance_style.collection_after_heart_clr +
            " !important;" +
            "color: " +
            Flits.wishlistButton.settings.appearance_style.collection_after_heart_clr +
            " !important;" +
            "}";
        Flits.styleCreate(product_style_string);
        Flits.styleCreate(collection_style_string);
        var modal = new flits_tingle.modal({
            footer: false,
            stickyFooter: false,
            getContent: true,
            closeMethods: ["button"],
            closeLabel: "Close",
            cssClass: ["flits-tingle-modal-popup-container"],
            beforeClose: function () {
                return true;
            },
        });
        Flits("body").append(Flits.wishlistButton.settings.wishlist_guest_model_html);
        var modal_content = Flits("#flits-wishlist-guest-modal-content").html() || "";
        modal.setContent(modal_content);
        Flits("#flits-wishlist-guest-modal-content").remove();
        Flits(document).on("submit", "#flits-guest-wishlist-form", function (event) {
            event.preventDefault();
            let flits_customer_email = Flits("#flits_email_id").val();
            if (typeof flits_customer_email == "undefined" || flits_customer_email == null || flits_customer_email == "") {
                return false;
            }
            Flits.setLocalStorage(Flits.cemail, flits_customer_email);
            Flits(".flits-wishlist-guest-form-box").css({ display: "none" });
            Flits("#flits-guest-email").html(
                Flits.t("Flits.locals.wishlisted_product_page.create_account_through", "Please create account/login through {{ customer_email }} email").replace("{{ customer_email }}", "<br> <strong>" + flits_customer_email + "</strong>")
            );
            Flits(".flits-wishlist-guest-message-box").css({ display: "block" });
            Flits.wishlistButton.settings.clicked_add_button.click();
        });
        function wishListCollection() {
                let collectionBtn = Flits(".flits-wishlist-colection");
                if (parseInt(Flits.wishlistButton.settings.isCountEnable)) {
                    Flits(collectionBtn).find(".flits-wls-count-btn").css("display", "flex");
                }
                Flits(collectionBtn).show();
                Flits(".flits-wishlist-colection:not(.flits-template)").parent().attr("data-flits", "wishlist-collection-parent");
        }
        function wishListDomReady() {
            Flits.checkAndSetupWishlistDiv();
        }
        function wishlistLocalData() {
            var wishlitsLocalHandles = Flits.getLocalStorage(Flits.wishlistButton.settings.wishlistHandle);
            if (wishlitsLocalHandles) {
                var wishlitsLocalHandlesArray = wishlitsLocalHandles.split(",");
                for (var i = 0; i < wishlitsLocalHandlesArray.length; i++) {
                    var s = Flits("*[data-flits-product-handle='" + wishlitsLocalHandlesArray[i] + "']");
                    s.animateWishlistButton(-1, Flits.t("Flits.locals.wishlisted_product_page.remove_from_wishlist_button", "Added to Wishlist"));
                }
            }
        }
        function diff_minutes(dt1, dt2) {
            if (dt1 == undefined || dt2 == undefined) {
                return 0;
            } else {
                var diff = (dt2.getTime() - dt1.getTime()) / 1000;
                diff /= 60;
                return Math.abs(Math.round(diff));
            }
        }
        function wishlistAjaxFunc() {
            let params = { customer_id: Flits.customer_id, customer_hash: Flits.customerHash, token: Flits.token };
            Flits.ajax({ type: "GET", url: Flits.base_url + Flits.wishlistButton.settings.wishlist_base_url, data: params })
                .done(function (resp) {
                    Flits.setLocalStorage(Flits.wishlistButton.settings.wishlistHandle, "");
                    let productHandle = [];
                    for (let i = 0; i < resp.data.length; i++) {
                        productHandle.push(resp.data[i].product_handle);
                    }
                    productHandle = productHandle.join(",");
                    Flits.setLocalStorage(Flits.wishlistButton.settings.wishlistHandle, productHandle);
                    Flits.setLocalStorage(Flits.wishlistButton.settings.wishlistLastUpdate, new Date());
                    if (Flits.request.page_type != "customers/account") {
                        wishlistLocalData();
                    }
                })
                .fail(function (resp) {})
                .always(function () {});
        }
        Flits(document).on("click", ".flits-wls-button", function (event) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            var el = Flits(this);
            Flits.wishlistButton.settings.clicked_add_button = el;
            var is_add;
            Flits(el).hasClass("flits-wls-inactive") ? (is_add = true) : (is_add = false);
            let customer_id = Flits(el).attr("data-flits-customer-id");
            let customer_email = Flits(el).attr("data-flits-customer-email");
            let product_id = Flits(el).attr("data-flits-product-id");
            let product_handle = Flits(el).attr("data-flits-product-handle");
            let product_title = Flits(el).attr("data-flits-product-title");
            let product_image = Flits(el).attr("data-flits-product-image");
            let count = 0;
            let wsl_product_count = 0;
            let token = Flits.token;
            let add_url = Flits.base_url + Flits.wishlistButton.settings.wishlist_base_url + Flits.wishlistButton.settings.add_wsl_url;
            let remove_url = Flits.base_url + Flits.wishlistButton.settings.wishlist_base_url + Flits.wishlistButton.settings.remove_wsl_url;
            if (Flits.isNull(customer_email)) {
                let customer_email_cookie = Flits.getLocalStorage(Flits.cemail);
                if (is_add) {
                    if (Flits.isNull(customer_email_cookie)) {
                        modal.open();
                        return false;
                    } else {
                        customer_email = customer_email_cookie;
                    }
                } else {
                    customer_email = customer_email_cookie;
                }
            }
            if (Flits(el).parent().find(".flits-wls-count-btn")) {
                count = Flits(el).parent().find(".flits-wls-count-btn").text();
            }
            if (is_add) {
                wsl_product_count = parseInt(count) + 1;
                Flits(el).animateWishlistButton(wsl_product_count, Flits.t("Flits.locals.wishlisted_product_page.remove_from_wishlist_button", "Added to Wishlist"));
            } else {
                wsl_product_count = parseInt(count) - 1;
                Flits(el).animateWishlistButton(wsl_product_count, Flits.t("Flits.locals.wishlisted_product_page.add_to_wishlist_button", "Add to Wishlist"));
            }
            let params = {
                customer_hash: Flits.customerHash,
                token: token,
                customer_id: customer_id,
                customer_email: customer_email,
                product_id: product_id,
                product_handle: product_handle,
                product_title: product_title,
                product_image: product_image,
                wsl_product_count: wsl_product_count,
            };
            if (is_add) {
                Flits.ajax({ type: "POST", url: add_url, data: params, contentType: "application/x-www-form-urlencoded" })
                    .done(function (resp) {
                        Flits.setLocalStorage(Flits.wishlistButton.settings.wishlistHandle, resp.products_handle);
                        Flits.dispatchEvent("Flits:Wishlist:AddCount", { resp: resp });
                        flitsSnackbar.show({
                            text:
                                '<div class="flits-wls-snackbar">' +
                                '<div class="flits-wls-snackbar-header">' +
                                Flits.t("Flits.locals.wishlisted_product_page.product_added_to_wishlist", "Product has been added to your wishlist") +
                                "</div>" +
                                '<div class="flits-wls-snackbar-body">' +
                                '<div class="flits-wls-snackbar-product-img" style="background-image: url(' +
                                product_image +
                                ')"></div>' +
                                '<a class="flits-wls-snackbar-product-name">' +
                                product_title +
                                "</a></div> </div>",
                            pos: "bottom-center",
                            showAction: false,
                            customClass: "flits-cs-flits-snackbar-container",
                        });
                    })
                    .fail(function (resp) {
                        Flits(el).animateWishlistButton(wsl_product_count - 1, Flits.t("Flits.locals.wishlisted_product_page.add_to_wishlist_button", "Add to Wishlist"));
                    })
                    .always(function () {});
            } else {
                Flits.ajax({ type: "DELETE", url: remove_url, data: params, contentType: "application/x-www-form-urlencoded" })
                    .done(function (resp) {
                        Flits.setLocalStorage(Flits.wishlistButton.settings.wishlistHandle, resp.products_handle);
                        Flits.dispatchEvent("Flits:Wishlist:RemoveCount", { resp: resp });
                        flitsSnackbar.show({
                            text: "<p>" + Flits.t("Flits.locals.wishlisted_product_page.product_remove_from_wishlist", "Product removed from your wishlist") + "</p>",
                            pos: "bottom-center",
                            showAction: false,
                            customClass: "flits-alert-default",
                        });
                    })
                    .fail(function (resp) {
                        Flits(el).animateWishlistButton(wsl_product_count + 1, Flits.t("Flits.locals.wishlisted_product_page.remove_from_wishlist_button", "Added to Wishlist"));
                    })
                    .always(function () {});
            }
            return;
        });
        if (Flits.customer_id != -1) {
            let dt1 = new Date(Flits.getLocalStorage(Flits.wishlistButton.settings.wishlistLastUpdate));
            let dt2 = new Date();
            if (Flits.getLocalStorage(Flits.wishlistButton.settings.wishlistHandle) == undefined || diff_minutes(dt1, dt2) >= 5) {
                wishlistAjaxFunc();
            } else {
                if (Flits.request.page_type != "customers/account") {
                    wishlistLocalData();
                }
            }
        } else {
            if (Flits.request.page_type != "customers/account") {
                wishlistLocalData();
            }
        }
        wishListDomReady();
        wishListCollection();
    });
    Flits.fn.extend({
        addWishlistBtn: function (attribute_data, domBtnSelector) {
          debugger;
            var settings = Flits.wishlistButton.settings;
            var domBtnSelector = domBtnSelector || Flits.wishlistButton.settings.wishListBtnDomSelector;
            this.filter(':not([data-flits="wishlist-btn-added"])').each(function (index, el) {
                el = Flits(el);
                if (el.css("display") != "none" && el.css("visibility") != "hidden") {
                    if (typeof el[0].addEventListener != "function") {
                        return;
                    }
                    var parent = el.parent();
                    var cloneNode = Flits("#" + domBtnSelector).clone();
                    Flits(cloneNode).removeClass("flits-template");
                    Flits(cloneNode).css("display", "flex");
                    Flits(cloneNode).removeAttr("id");
                    if (attribute_data) {
                        Flits(cloneNode).find(".flits-wls-button").attr(attribute_data);
                        if (attribute_data["data-flits-product-handle"] && Flits.isProductAddedInWishlist(attribute_data["data-flits-product-handle"])) {
                            Flits(cloneNode).find(".flits-wls-button").animateWishlistButton(-1, Flits.t("Flits.locals.wishlisted_product_page.remove_from_wishlist_button", "Added to Wishlist"));
                        }
                    }
                    if (Flits.wishlistButton.settings.wslBtnType != -1) {
                        Flits(cloneNode).find(".flits-wls-icon-with-text-text").css("display", "block");
                    }
                    if (parseInt(Flits.wishlistButton.settings.isCountEnable)) {
                        Flits(cloneNode).find(".flits-wls-count-btn").css("display", "flex");
                    }
                    el.after(cloneNode);
                    el.attr("data-flits", "wishlist-btn-added");
                    parent.attr("data-flits", "wishlist-btn-parent");
                    settings.automaticAppendDivFunction.apply(this, [el, parent, cloneNode]);
                    Flits.dispatchEvent("Flits:WishlistAutomaticCode:Loaded", { el: el, parent: parent, cloneNode: cloneNode });
                }
            });
            return this;
        },
        animateWishlistButton: function (c, title_txt) {
            Flits.each(this, function (index, v) {
                Flits(v).attr("data-tippy-content", title_txt);
                if (Flits(v).find(".flits-wls-icon-with-text-text")) {
                    Flits(v).find(".flits-wls-icon-with-text-text").text(title_txt);
                }
                if (c != -1) {
                    if (Flits(v).parent().find(".flits-wls-count-btn")) {
                        Flits(v).parent().find(".flits-wls-count-btn").text(c);
                    }
                }
                if (Flits(v).hasClass("flits-wls-deactivate")) {
                    Flits(v).removeClass("flits-wls-deactivate");
                }
                if (Flits(v).hasClass("flits-wls-active")) {
                    Flits(v).addClass("flits-wls-deactivate");
                }
                Flits(v).toggleClass("flits-wls-animate");
                Flits(v).toggleClass("flits-wls-active");
                Flits(v).toggleClass("flits-wls-inactive");
            });
            return this;
        },
    });
    Flits.extend({
        isProductAddedInWishlist: function (handle) {
            var wishlitsLocalHandles = Flits.getLocalStorage(Flits.wishlistButton.settings.wishlistHandle);
            if (Flits.isNull(wishlitsLocalHandles)) {
                return false;
            }
            if (wishlitsLocalHandles.split(",").indexOf(handle) != -1) {
                return true;
            }
            return false;
        },
        checkAndSetupWishlistDiv: function () {
            if (Flits.wishlistButton.settings.isWishlistAutomatic == 1) {
                Flits(Flits.wishlistButton.settings.addtocartSelectors.join(",")).addWishlistBtn();
            } else {
                if (Flits.wishlistButton.settings.wslBtnType != -1) {
                    Flits("#" + Flits.wishlistButton.settings.wishListBtnDomSelector)
                        .not(".flits-template")
                        .find(".flits-wls-icon-with-text-text")
                        .css("display", "block");
                }
                if (parseInt(Flits.wishlistButton.settings.isCountEnable)) {
                    Flits("#" + Flits.wishlistButton.settings.wishListBtnDomSelector)
                        .not(".flits-template")
                        .find(".flits-wls-count-btn")
                        .css("display", "flex");
                }
                Flits("#" + Flits.wishlistButton.settings.wishListBtnDomSelector)
                    .not(".flits-template")
                    .parent()
                    .find(Flits.wishlistButton.settings.addtocartSelectors.join(","))
                    .attr("data-flits", "wishlist-btn-added");
                Flits("#" + Flits.wishlistButton.settings.wishListBtnDomSelector)
                    .not(".flits-template")
                    .parent()
                    .find(Flits.wishlistButton.settings.addtocartSelectors.join(","))
                    .parent()
                    .attr("data-flits", "wishlist-btn-parent");
                Flits("#" + Flits.wishlistButton.settings.wishListBtnDomSelector)
                    .not(".flits-template")
                    .css("display", "flex");
                Flits("#" + Flits.wishlistButton.settings.wishListBtnDomSelector)
                    .not(".flits-template")
                    .removeAttr("id");
            }
        },
    });
    if (Flits.Metafields.IS_WISHLIST_ENABLE == 1) {
        Flits.wishlistButton({
            isWishlistAutomatic: Flits.Metafields.WSL_CODE_AUTOMATIC,
            wslBtnType: Flits.Metafields.WSL_BTN_TYPE,
            isCountEnable: Flits.Metafields.WSL_COUNT_ENABLE,
            appearance_style: {
                before_heart_clr: Flits.Metafields.WSL_BEFORE_HEART_COLOR,
                before_btn_clr: Flits.Metafields.WSL_BEFORE_BTN_COLOR,
                before_text_clr: Flits.Metafields.WSL_BEFORE_BTN_TEXT_COLOR,
                before_border_clr: Flits.Metafields.WSL_BEFORE_BTN_BORDER_COLOR,
                after_heart_clr: Flits.Metafields.WSL_AFTER_HEART_COLOR,
                after_btn_clr: Flits.Metafields.WSL_AFTER_BTN_COLOR,
                after_text_clr: Flits.Metafields.WSL_AFTER_BTN_TEXT_COLOR,
                after_border_clr: Flits.Metafields.WSL_AFTER_BTN_BORDER_COLOR,
                collection_before_heart_clr: Flits.Metafields.WSL_DEFAULT_BEFORE_HEART_COLOR,
                collection_after_heart_clr: Flits.Metafields.WSL_DEFAULT_AFTER_HEART_COLOR,
            },
        });
    }
})(Flits);
