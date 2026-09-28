let razorpayScriptPromise = null;

// Loads https://checkout.razorpay.com/v1/checkout.js exactly once and
// resolves true/false depending on whether `window.Razorpay` became
// available. Safe to call multiple times (e.g. every checkout attempt) —
// subsequent calls reuse the same in-flight/completed promise.
export function loadRazorpayScript() {
    if (window.Razorpay) return Promise.resolve(true);

    if (!razorpayScriptPromise) {
        razorpayScriptPromise = new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => {
                razorpayScriptPromise = null; // allow retrying on a later attempt
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }

    return razorpayScriptPromise;
}
