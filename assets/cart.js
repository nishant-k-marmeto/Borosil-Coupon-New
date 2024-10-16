class CartRemoveButton extends HTMLElement {
  constructor() {
    super(),
      this.addEventListener("click", (e) => {
        e.preventDefault(),
          this.closest("cart-items").updateQuantity(this.dataset.index, 0);
      });
  }
}
customElements.define("cart-remove-button", CartRemoveButton);
class CartItems extends HTMLElement {
  constructor() {
    super(),
      (this.lineItemStatusElement = document.getElementById(
        "shopping-cart-line-item-status"
      )),
      (this.currentItemCount = Array.from(
        this.querySelectorAll('[name="updates[]"]')
      ).reduce((e, t) => e + parseInt(t.value), 0)),
      (this.debouncedOnChange = debounce((e) => {
        this.onChange(e);
      }, 300)),
      this.addEventListener("change", this.debouncedOnChange.bind(this));
  }
  onChange(e) {
    this.updateQuantity(
      e.target.dataset.index,
      e.target.value,
      document.activeElement.getAttribute("name")
    );
  }
  getSectionsToRender() {
    return [
      {
        id: "main-cart-items",
        section: document.getElementById("main-cart-items").dataset.id,
        selector: ".js-contents",
      },
      {
        id: "main-cart-footer",
        section: document.getElementById("main-cart-footer").dataset.id,
        selector: ".js-contents",
      },
      {
        id: "cart-icon-bubble",
        section: "cart-icon-bubble",
        selector: ".shopify-section",
      },
      {
        id: "cart-live-region-text",
        section: "cart-live-region-text",
        selector: ".shopify-section",
      }
    ];
  }
  updateQuantity(e, t, n) {
    this.enableLoading(e);
    const i = JSON.stringify({
      line: e,
      quantity: t,
      sections: this.getSectionsToRender().map((e) => e.section),
      sections_url: window.location.pathname,
    });
    fetch(`${routes.cart_change_url}`, { ...fetchConfig(), body: i })
      .then((e) => e.text())
      .then((t) => {
        const i = JSON.parse(t);
        this.classList.toggle("is-empty", 0 === i.item_count);
        const s = document.getElementById("main-cart-footer");
        s && s.classList.toggle("is-empty", 0 === i.item_count),
          this.getSectionsToRender().forEach((e) => {
            (document.getElementById(e.id).querySelector(e.selector) || document.getElementById(e.id)
            ).innerHTML = this.getSectionInnerHTML(i.sections[e.section],e.selector);
          }),
          this.updateLiveRegions(e, i.item_count);
        const r = document.getElementById(`CartItem-${e}`);
        r &&
          r.querySelector(`[name="${n}"]`) &&
          r.querySelector(`[name="${n}"]`).focus(),
          this.disableLoading();
      })
      .catch(() => {
        this.querySelectorAll(".loading-overlay").forEach((e) =>
          e.classList.add("hidden")
        ),
          (document.getElementById("cart-errors").textContent =
            window.cartStrings.error),
          this.disableLoading();
      });
  }
  updateLiveRegions(e, t) {
    this.currentItemCount === t &&
      (document
        .getElementById(`Line-item-error-${e}`)
        .querySelector(".cart-item__error-text").innerHTML =
        window.cartStrings.quantityError.replace(
          "[quantity]",
          document.getElementById(`Quantity-${e}`).value
        )),
      (this.currentItemCount = t),
      this.lineItemStatusElement.setAttribute("aria-hidden", !0);
    const n = document.getElementById("cart-live-region-text");
    n.setAttribute("aria-hidden", !1),
      setTimeout(() => {
        n.setAttribute("aria-hidden", !0);
      }, 1e3);
  }
  getSectionInnerHTML(e, t) {
    return new DOMParser().parseFromString(e, "text/html").querySelector(t).innerHTML;
  }
  enableLoading(e) {
    document
      .getElementById("main-cart-items")
      .classList.add("cart__items--disabled"),
      this.querySelectorAll(`#CartItem-${e} .loading-overlay`).forEach((e) =>
        e.classList.remove("hidden")
      ),
      document.activeElement.blur(),
      this.lineItemStatusElement.setAttribute("aria-hidden", !1);
  }
  disableLoading() {
    document
      .getElementById("main-cart-items")
      .classList.remove("cart__items--disabled");
  }
}
customElements.define("cart-items", CartItems);

