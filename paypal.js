// js/paypal.js
document.addEventListener("DOMContentLoaded", () => {
  const checkoutBtn = document.getElementById("checkout-btn");
  const cartSidebar = document.getElementById("cart");

  // Load cart from localStorage
  let cart = JSON.parse(localStorage.getItem("beansDreamsCart")) || [];

  function calculateCartTotal() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  }

  // Render PayPal into hidden container
  if (window.paypal && typeof window.paypal.Buttons === "function") {
    paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: { value: calculateCartTotal() }
          }]
        });
      },
      onApprove: async (data, actions) => {
        const order = await actions.order.capture();

        // Send cart + PayPal order to backend
        try {
          await fetch("/api/save-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cart, paypalOrder: order })
          });

          alert("Thank you! Your order has been received.");
          localStorage.removeItem("beansDreamsCart");
          cart = [];
          if (cartSidebar) cartSidebar.classList.remove("open");
          window.location.href = "/thank-you.html"; // Optional redirect
        } catch (err) {
          console.error("Error saving order:", err);
          alert("Checkout failed. Please try again.");
        }
      }
    }).render("#hidden-paypal");
  }

  // Checkout button triggers hidden PayPal flow
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
      }
      const paypalBtn = document.querySelector("#hidden-paypal iframe");
      if (paypalBtn) {
        paypalBtn.click();
      } else {
        alert("PayPal checkout not ready yet.");
      }
    });
  }
});
