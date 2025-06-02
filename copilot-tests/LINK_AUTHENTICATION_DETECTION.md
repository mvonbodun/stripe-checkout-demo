# Link Authentication Detection Investigation

## Goal
Detect when a user is already signed in to Stripe Link, which typically shows:
- Email field with Link icon and three dots
- Pre-filled email address
- Authenticated state

## Current Implementation

### Enhanced Event Logging
The `LinkAuthenticationElement` onChange handler now logs extensive information to help discover authentication-related properties:

```tsx
onChange={event => {
  // Full event object logging
  console.log("📧 LinkAuthentication changed - Full event object:", event);
  console.log("📧 LinkAuthentication event.type:", event.type);
  console.log("📧 LinkAuthentication event.complete:", event.complete);
  console.log("📧 LinkAuthentication event.value:", event.value);
  console.log("📧 LinkAuthentication event.elementType:", event.elementType);
  
  // Check for authentication indicators
  // ... logs potential auth properties
}}
```

## Testing Approach

### Test Cases to Verify

1. **Non-authenticated User**
   - Clear browser data
   - Enter email manually
   - Check logged properties

2. **Link-authenticated User**
   - Sign in to Link on another Stripe site
   - Return to our checkout
   - Check for authentication indicators

3. **Previously Used Email**
   - Use an email that was previously used with Link
   - Check if it shows different properties

### Expected Findings

We're looking for properties that might indicate Link authentication status:
- `event.authenticated`
- `event.linked` 
- `event.value.authenticated`
- `event.value.linked`
- `event.value.linkAuth`
- Or other undocumented properties

## Console Testing

Use the browser console to inspect the event object:

```javascript
// Check for all event properties
console.table(event);

// Check for all value properties  
if (event.value) {
  console.table(event.value);
}

// Look for authentication-related keys
Object.keys(event).filter(key => 
  key.toLowerCase().includes('auth') || 
  key.toLowerCase().includes('link')
);
```

## Next Steps

1. Test with different authentication states
2. Document discovered properties
3. Implement detection logic based on findings
4. Update UI to show Link authentication status

## References

- [Stripe Link Authentication Element Docs](https://docs.stripe.com/payments/elements/link-authentication-element)
- [Stripe Link Documentation](https://docs.stripe.com/payments/link)
