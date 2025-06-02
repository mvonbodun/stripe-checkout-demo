// LinkAuthenticationElement Email Validation Tester
// Run this in browser console on checkout page to test email validation

window.testEmailValidation = function() {
    console.log("🧪 Testing LinkAuthenticationElement Email Validation");
    console.log("=" .repeat(50));
    
    // Test emails with expected results
    const testCases = [
        { email: "", expected: false, description: "Empty email" },
        { email: "user", expected: false, description: "No @ symbol" },
        { email: "user@", expected: false, description: "Incomplete domain" },
        { email: "user@domain", expected: false, description: "Missing TLD" },
        { email: "user@domain.", expected: false, description: "Empty TLD" },
        { email: "user@domain.c", expected: false, description: "Single char TLD" },
        { email: "user@domain.com", expected: true, description: "Valid email" },
        { email: "test.email@example.org", expected: true, description: "Valid with dots" },
        { email: "user+tag@domain.co.uk", expected: true, description: "Valid with plus and subdomain" }
    ];
    
    console.log("Test Cases:");
    testCases.forEach((testCase, index) => {
        console.log(`${index + 1}. ${testCase.description}: "${testCase.email}" -> Expected: ${testCase.expected}`);
    });
    
    console.log("\n📋 Instructions:");
    console.log("1. Go to checkout page");
    console.log("2. Open browser console");
    console.log("3. Manually test each email in the LinkAuthenticationElement");
    console.log("4. Watch console logs for validation results");
    console.log("5. Verify Pay button enable/disable state");
    
    console.log("\n🔍 What to look for:");
    console.log("- Console logs: '📧 LinkAuthentication changed'");
    console.log("- Pay button disabled when complete = false");
    console.log("- Pay button enabled when complete = true");
    console.log("- Visual feedback messages");
    
    return testCases;
};

window.checkPayButtonState = function() {
    const payButton = document.querySelector('button[type="submit"]');
    if (payButton) {
        console.log("💳 Pay Button State:", {
            disabled: payButton.disabled,
            text: payButton.textContent.trim()
        });
    } else {
        console.log("❌ Pay button not found");
    }
};

window.monitorEmailValidation = function() {
    console.log("🔄 Starting email validation monitoring...");
    console.log("Type emails in the LinkAuthenticationElement field");
    console.log("This will log validation states automatically");
    
    // Add periodic checks
    const interval = setInterval(() => {
        const payButton = document.querySelector('button[type="submit"]');
        if (payButton) {
            console.log(`📊 Pay button disabled: ${payButton.disabled}`);
        }
    }, 2000);
    
    // Stop monitoring after 30 seconds
    setTimeout(() => {
        clearInterval(interval);
        console.log("⏹ Email validation monitoring stopped");
    }, 30000);
    
    return interval;
};

// Auto-run setup
console.log("🚀 LinkAuthenticationElement Email Validation Tester Loaded");
console.log("Available functions:");
console.log("- testEmailValidation() - Show test cases");
console.log("- checkPayButtonState() - Check current Pay button state");
console.log("- monitorEmailValidation() - Monitor validation for 30 seconds");
console.log("\nNavigate to /checkout to test email validation");
