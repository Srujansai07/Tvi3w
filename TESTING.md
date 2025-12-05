# Testing Guide - Tvi3W

## Testing Strategy

### 1. Manual Testing Checklist

#### Authentication
- [ ] Google OAuth sign-in works
- [ ] GitHub OAuth sign-in works
- [ ] Sign-out works correctly
- [ ] Protected routes redirect to sign-in
- [ ] Session persists across page refreshes

#### Dashboard
- [ ] Dashboard loads with correct user data
- [ ] Stats display correctly
- [ ] Quick actions are clickable
- [ ] Navigation works

#### Meetings
- [ ] Create new meeting
- [ ] Meeting form validation works
- [ ] Meeting saves to database
- [ ] Meetings list displays correctly
- [ ] Empty state shows when no meetings

#### Contacts
- [ ] Add new contact
- [ ] Contact form validation
- [ ] Contacts list displays
- [ ] Search functionality works
- [ ] Empty state shows

#### AI Features
- [ ] Content analysis works
- [ ] Business pitch analysis works
- [ ] AI returns valid JSON
- [ ] Error handling works
- [ ] Loading states display

#### Settings
- [ ] Profile displays correctly
- [ ] Preferences can be changed
- [ ] Account deletion warning shows

### 2. API Testing

#### Test Endpoints:

**Meetings API**
```bash
# Create meeting
curl -X POST https://tvi3w-ai.vercel.app/api/meetings \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Test Meeting","type":"professional","start_time":"2024-01-01T10:00:00Z"}'

# Get meetings
curl https://tvi3w-ai.vercel.app/api/meetings
```

**Contacts API**
```bash
# Create contact
curl -X POST https://tvi3w-ai.vercel.app/api/contacts \\
  -H "Content-Type: application/json" \\
  -d '{"first_name":"John","last_name":"Doe","email":"john@example.com"}'

# Get contacts
curl https://tvi3w-ai.vercel.app/api/contacts
```

**AI Analysis**
```bash
# Analyze content
curl -X POST https://tvi3w-ai.vercel.app/api/ai/analyze-content \\
  -H "Content-Type: application/json" \\
  -d '{"text":"Sample content","type":"article"}'
```

### 3. Database Testing

#### Verify RLS Policies:
1. Sign in as User A
2. Create meeting/contact
3. Sign in as User B
4. Verify User B cannot see User A's data

#### Test Queries:
```sql
-- Check user data
SELECT * FROM users WHERE id = 'user-id';

-- Check meetings
SELECT * FROM meetings WHERE user_id = 'user-id';

-- Check contacts
SELECT * FROM contacts WHERE user_id = 'user-id';
```

### 4. Performance Testing

#### Metrics to Check:
- [ ] Page load time < 3 seconds
- [ ] Time to Interactive < 5 seconds
- [ ] First Contentful Paint < 1.5 seconds
- [ ] Largest Contentful Paint < 2.5 seconds

#### Tools:
- Lighthouse (Chrome DevTools)
- WebPageTest
- Vercel Analytics

### 5. Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### 6. Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible
- [ ] Alt text on images

Tools:
- axe DevTools
- WAVE
- Lighthouse Accessibility

### 7. Error Scenarios

Test error handling for:
- [ ] Network failures
- [ ] Invalid API responses
- [ ] Missing environment variables
- [ ] Database connection errors
- [ ] Invalid user input
- [ ] Expired sessions

### 8. Load Testing

Simulate:
- 10 concurrent users
- 100 concurrent users
- 1000 requests per minute

Tools:
- Apache JMeter
- k6
- Artillery

### 9. Security Testing

- [ ] SQL injection attempts fail
- [ ] XSS attempts are blocked
- [ ] CSRF protection works
- [ ] Rate limiting enforced
- [ ] Unauthorized access blocked

### 10. Regression Testing

Before each deployment:
- [ ] Run full manual test suite
- [ ] Check all critical user flows
- [ ] Verify no breaking changes
- [ ] Test on staging environment first

## Test Results Template

```markdown
## Test Run: [Date]

### Environment
- Branch: main
- Commit: abc123
- Tester: [Name]

### Results
- Authentication: ✅ PASS
- Dashboard: ✅ PASS
- Meetings: ✅ PASS
- Contacts: ✅ PASS
- AI Features: ⚠️ PARTIAL (Gemini API issue)
- Settings: ✅ PASS

### Issues Found
1. [Issue description]
2. [Issue description]

### Notes
[Additional observations]
```

## Automated Testing (Future)

### Recommended Tools:
- **Unit Tests**: Jest, React Testing Library
- **E2E Tests**: Playwright, Cypress
- **API Tests**: Supertest
- **Visual Regression**: Percy, Chromatic

### Example Test Structure:
```typescript
// __tests__/dashboard.test.tsx
describe('Dashboard', () => {
  it('displays user stats', () => {
    // Test implementation
  })
  
  it('shows quick actions', () => {
    // Test implementation
  })
})
```

## Continuous Testing

### Pre-commit:
- Lint check
- Type check
- Format check

### Pre-push:
- Build succeeds
- No TypeScript errors

### Pre-deploy:
- Full test suite passes
- Performance benchmarks met
- Security scan clean

## Bug Reporting

When reporting bugs, include:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Screenshots/videos
5. Browser/device info
6. Console errors
7. Network requests

## Test Coverage Goals

- Critical paths: 100%
- API routes: 90%
- Components: 80%
- Utilities: 90%
- Overall: 85%
