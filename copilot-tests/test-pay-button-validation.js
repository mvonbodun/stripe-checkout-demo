// Test Pay Button Comprehensive Validation
// Load this in browser console on checkout page: await import('/test-pay-button-validation.js')

console.log("🔐 Pay Button Validation Tester Loaded");

window.testPayButtonValidation = function() {
    console.log("\n🧪 PAY BUTTON VALIDATION TEST SUITE");
    console.log("=====================================");
    
    // Check if we're on checkout page
    if (!window.location.pathname.includes('/checkout')) {
        console.log("❌ Please navigate to /checkout page first");
        return;
    }
    
    console.log("📋 Testing All Validation Conditions:");
    console.log("1. ✉️  EmailComplete - LinkAuthenticationElement email validation");
    console.log("2. 🏠 AddressComplete - AddressElement completion");  
    console.log("3. 🚢 ShippingMethodSelected - Shipping method selection");
    console.log("4. 💳 PaymentElementReady - PaymentElement completion");
    console.log("");
    
    // Get Pay button
    const payButton = document.querySelector('button[type="submit"]');
    if (!payButton) {
        console.log("❌ Pay button not found");
        return;
    }
    
    console.log("💳 Current Pay Button State:", {
        disabled: payButton.disabled,
        text: payButton.textContent.trim()
    });
    
    console.log("\n🔍 VALIDATION STEPS TO TEST:");
    console.log("1. Enter a valid email (should see ✓ Email is valid)");
    console.log("2. Fill complete shipping address");
    console.log("3. Select a shipping method (auto-selected if available)");
    console.log("4. Fill payment details or select saved card");
    console.log("5. Pay button should become enabled only when ALL are complete");
    
    return true;
};

window.monitorPayButtonState = function(duration = 30) {
    console.log(`🔄 Monitoring Pay button state for ${duration} seconds...`);
    console.log("Make changes to form fields and watch validation states");
    
    let count = 0;
    const interval = setInterval(() => {
        const payButton = document.querySelector('button[type="submit"]');
        if (payButton) {
            count++;
            console.log(`📊 [${count}] Pay button disabled: ${payButton.disabled}`);
        }
    }, 2000);
    
    setTimeout(() => {
        clearInterval(interval);
        console.log("⏹ Pay button monitoring stopped");
    }, duration * 1000);
    
    return interval;
};

window.checkValidationStates = function() {
    console.log("\n🔍 CURRENT VALIDATION STATES:");
    
    // Check LinkAuthenticationElement
    const linkAuthElement = document.querySelector('[data-testid="link-authentication-element"] input');
    console.log("📧 Email field:", linkAuthElement ? linkAuthElement.value : "Not found");
    
    // Check AddressElement
    const addressElements = document.querySelectorAll('[data-testid="address-element"] input');
    console.log("🏠 Address fields found:", addressElements.length);
    
    // Check PaymentElement
    const paymentElement = document.querySelector('[data-testid="payment-element"]');
    console.log("💳 Payment element:", paymentElement ? "Found" : "Not found");
    
    // Check Pay button
    const payButton = document.querySelector('button[type="submit"]');
    console.log("🔐 Pay button:", {
        found: !!payButton,
        disabled: payButton?.disabled,
        text: payButton?.textContent?.trim()
    });
    
    console.log("\n💡 Watch browser console for validation state logs:");
    console.log("- 📧 LinkAuthentication changed");
    console.log("- 🏠 AddressElement changed");  
    console.log("- 💳 PaymentElement changed");
    console.log("- 🔐 Pay button validation states");
};

window.simulateValidationFlow = function() {
    console.log("\n🎭 SIMULATED VALIDATION FLOW:");
    console.log("This shows what logs you should see as you complete each step");
    console.log("");
    
    console.log("1️⃣ Email Entry:");
    console.log("   📧 LinkAuthentication changed - complete: false");
    console.log("   🔐 Pay button validation states: { emailComplete: false, ... }");
    console.log("");
    
    console.log("2️⃣ Valid Email:");
    console.log("   📧 LinkAuthentication changed - complete: true");
    console.log("   🔐 Pay button validation states: { emailComplete: true, ... }");
    console.log("");
    
    console.log("3️⃣ Address Entry:");
    console.log("   🏠 AddressElement changed - complete: true, hasValue: true");
    console.log("   🔐 Pay button validation states: { addressComplete: true, ... }");
    console.log("");
    
    console.log("4️⃣ Shipping Method (auto-selected):");
    console.log("   🚢 Shipping method changed to: Free Standard Shipping");
    console.log("   🔐 Pay button validation states: { shippingMethodSelected: true, ... }");
    console.log("");
    
    console.log("5️⃣ Payment Details:");
    console.log("   💳 PaymentElement changed - complete: true");
    console.log("   🔐 Pay button validation states: { paymentElementReady: true, ... }");
    console.log("");
    
    console.log("6️⃣ All Complete:");
    console.log("   🔐 Pay button validation states: ALL TRUE → Pay button enabled!");
};

// Auto-run basic info
console.log("🚀 Available test functions:");
console.log("- testPayButtonValidation()     - Run basic validation test");
console.log("- monitorPayButtonState(30)     - Monitor button for 30 seconds");
console.log("- checkValidationStates()       - Check current form states");
console.log("- simulateValidationFlow()      - Show expected validation flow");
