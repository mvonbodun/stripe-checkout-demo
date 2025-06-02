/**
 * Link Authentication Detection Testing Utilities
 * 
 * Open the browser console while on the checkout page and use these utilities
 * to investigate Link authentication states.
 */

window.linkAuthTestUtils = {
  
  /**
   * Deep inspect an event object from LinkAuthenticationElement
   */
  inspectEvent: function(event) {
    console.group("🔍 Link Authentication Event Inspection");
    
    // Log all top-level properties
    console.log("📋 All event properties:");
    Object.getOwnPropertyNames(event).forEach(prop => {
      try {
        console.log(`  ${prop}:`, event[prop]);
      } catch (e) {
        console.log(`  ${prop}: [Error accessing property]`);
      }
    });
    
    // Check prototype chain
    console.log("🔗 Event prototype:", Object.getPrototypeOf(event));
    
    // Inspect value object if present
    if (event.value) {
      console.log("📋 All event.value properties:");
      Object.getOwnPropertyNames(event.value).forEach(prop => {
        try {
          console.log(`  value.${prop}:`, event.value[prop]);
        } catch (e) {
          console.log(`  value.${prop}: [Error accessing property]`);
        }
      });
    }
    
    // Look for authentication-related properties
    const authKeys = this.findAuthKeys(event);
    if (authKeys.length > 0) {
      console.log("🔐 Potential authentication properties:", authKeys);
    } else {
      console.log("❌ No obvious authentication properties found");
    }
    
    console.groupEnd();
  },
  
  /**
   * Find properties that might relate to authentication
   */
  findAuthKeys: function(obj, prefix = '') {
    const authTerms = ['auth', 'link', 'sign', 'login', 'verify', 'token', 'session'];
    const foundKeys = [];
    
    if (!obj || typeof obj !== 'object') return foundKeys;
    
    Object.getOwnPropertyNames(obj).forEach(key => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      // Check if key name suggests authentication
      if (authTerms.some(term => key.toLowerCase().includes(term))) {
        foundKeys.push({ key: fullKey, value: obj[key] });
      }
      
      // Recursively check nested objects (limited depth)
      if (typeof obj[key] === 'object' && obj[key] !== null && !prefix.includes('.')) {
        foundKeys.push(...this.findAuthKeys(obj[key], fullKey));
      }
    });
    
    return foundKeys;
  },
  
  /**
   * Test different email scenarios
   */
  testEmailScenarios: function() {
    console.group("📧 Email Testing Scenarios");
    
    const scenarios = [
      {
        name: "New User Email",
        email: `test-${Date.now()}@example.com`,
        description: "Fresh email that has never been used with Link"
      },
      {
        name: "Link User Email", 
        email: "existing-link-user@example.com",
        description: "Email that's associated with an existing Link account"
      },
      {
        name: "Common Email",
        email: "test@gmail.com", 
        description: "Very common email pattern"
      }
    ];
    
    scenarios.forEach(scenario => {
      console.log(`\n🧪 Scenario: ${scenario.name}`);
      console.log(`📧 Email: ${scenario.email}`);
      console.log(`📝 Description: ${scenario.description}`);
      console.log("➡️ Manually enter this email and observe the logged event properties");
    });
    
    console.log("\n💡 Instructions:");
    console.log("1. Clear the email field");
    console.log("2. Enter each test email");
    console.log("3. Observe console logs for authentication indicators");
    console.log("4. Note any visual changes in the UI (Link icon, etc.)");
    
    console.groupEnd();
  },
  
  /**
   * Monitor LinkAuthenticationElement for changes
   */
  startMonitoring: function() {
    console.log("👀 Starting Link authentication monitoring...");
    console.log("💡 Any changes to the LinkAuthenticationElement will be logged with enhanced details");
    console.log("🔍 Use linkAuthTestUtils.inspectEvent(event) in the onChange handler for deep inspection");
  },
  
  /**
   * Check for Link-related objects in the global scope
   */
  checkGlobalLinkObjects: function() {
    console.group("🌐 Global Link Object Check");
    
    const linkRelated = [];
    
    // Check common global variables
    ['Stripe', 'stripe', 'elements', 'linkAuthentication'].forEach(name => {
      if (window[name]) {
        linkRelated.push({ name, value: window[name] });
      }
    });
    
    if (linkRelated.length > 0) {
      console.log("✅ Found Link-related global objects:");
      linkRelated.forEach(obj => {
        console.log(`  ${obj.name}:`, obj.value);
      });
    } else {
      console.log("❌ No obvious Link-related global objects found");
    }
    
    console.groupEnd();
  }
};

// Initialize monitoring
window.linkAuthTestUtils.startMonitoring();

// Log utility availability
console.log("🧪 Link Authentication Test Utilities loaded!");
console.log("📚 Available methods:");
console.log("  - linkAuthTestUtils.inspectEvent(event)");
console.log("  - linkAuthTestUtils.findAuthKeys(object)"); 
console.log("  - linkAuthTestUtils.testEmailScenarios()");
console.log("  - linkAuthTestUtils.checkGlobalLinkObjects()");
