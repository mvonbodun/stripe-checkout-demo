# LinkAuthenticationElement States and Pay Button Control

## Overview

The `LinkAuthenticationElement` provides email validation states through its `onChange` event that can be used to control Pay button enablement and provide user feedback.

## Event Properties

### `event.complete` - Email Validation State
- **Type**: `boolean`
- **`true`**: Email is properly formatted and valid
- **`false`**: Email is incomplete, invalid, or empty
- **Usage**: Primary property for enabling/disabling Pay button

### `event.value.email` - Email Value  
- **Type**: `string`
- **Content**: Current email string value
- **Can be**: Empty string if no email entered
- **Usage**: Store email value for payment confirmation

## Implementation Example

```tsx
const [email, setEmail] = useState('');
const [emailComplete, setEmailComplete] = useState(false);

// LinkAuthenticationElement with validation
<LinkAuthenticationElement
  options={{ defaultValues: { email } }}
  onChange={event => {
    console.log("📧 LinkAuthentication changed:", {
      complete: event.complete,
      email: event.value.email
    });
    
    setEmail(event.value.email);
    setEmailComplete(event.complete);
  }}
/>

// Visual feedback based on email state
{email && (
  <div className="mt-2 text-sm">
    {emailComplete ? (
      <span className="text-green-600 flex items-center">
        ✓ Email is valid
      </span>
    ) : (
      <span className="text-amber-600 flex items-center">
        ⚠ Please enter a valid email address
      </span>
    )}
  </div>
)}

// Pay button with email validation
<button 
  type="submit" 
  disabled={!stripe || loading || !emailComplete}
>
  Pay ${total}
</button>
```

## State Combinations

| Email Input | `event.complete` | `event.value.email` | Pay Button | User Feedback |
|-------------|------------------|---------------------|------------|---------------|
| Empty | `false` | `""` | Disabled | No feedback |
| "user@" | `false` | `"user@"` | Disabled | "Please enter a valid email" |
| "user@domain" | `false` | `"user@domain"` | Disabled | "Please enter a valid email" |
| "user@domain.com" | `true` | `"user@domain.com"` | Enabled | "✓ Email is valid" |

## Email Validation Rules

The LinkAuthenticationElement validates emails based on:
1. **Basic format**: Contains @ symbol
2. **Domain validation**: Valid domain format
3. **TLD requirement**: Valid top-level domain
4. **No spaces**: No whitespace characters
5. **RFC compliance**: Follows email standards

## Integration with Payment Flow

### 1. Initialization
```tsx
const [emailComplete, setEmailComplete] = useState(false);
```

### 2. Email Change Handling
```tsx
onChange={event => {
  setEmail(event.value.email);
  setEmailComplete(event.complete);
}}
```

### 3. Pay Button Control
```tsx
disabled={!stripe || loading || !emailComplete}
```

### 4. Form Validation
```tsx
const handleSubmit = async (e) => {
  if (!emailComplete) {
    setMessage('Please enter a valid email address.');
    return;
  }
  // ... proceed with payment
};
```

## Best Practices

### 1. **Always Check Complete State**
- Don't rely on email length or format checks
- Use `event.complete` as the authoritative validation

### 2. **Provide Clear Feedback**
- Show validation status visually
- Use consistent messaging

### 3. **Disable Pay Button Appropriately**
- Include email validation in button disabled logic
- Provide loading states during processing

### 4. **Handle Edge Cases**
- Empty email state
- Copy/paste scenarios
- Form reset situations

## Debugging Email Validation

### Console Logging
```tsx
onChange={event => {
  console.log("📧 Email validation:", {
    complete: event.complete,
    email: event.value.email,
    length: event.value.email.length
  });
}}
```

### Common Issues
1. **Button remains disabled**: Check if `emailComplete` is properly updated
2. **Validation too strict**: Ensure using `event.complete` not custom validation
3. **State not updating**: Verify `onChange` callback is properly set

## Testing Email Validation

### Valid Email Examples
- `user@example.com`
- `test.email@domain.co.uk`
- `valid+email@test-domain.org`

### Invalid Email Examples
- `user@` (incomplete domain)
- `user@domain` (missing TLD)
- `@domain.com` (missing local part)
- `user domain@test.com` (contains spaces)

## Summary

The LinkAuthenticationElement's `onChange` event provides reliable email validation through the `complete` property. Use this to:

1. **Control Pay button enablement**
2. **Provide real-time user feedback**
3. **Ensure valid email before payment**
4. **Improve user experience**

The implementation ensures users cannot proceed to payment without a properly validated email address, improving payment success rates and reducing errors.
