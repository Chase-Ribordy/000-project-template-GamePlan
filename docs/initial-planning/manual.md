# [Project Name] - Manual Tasks

> Tasks requiring human action that cannot be automated by AI agents.

## Prerequisites (Before Development Starts)

**Complete these BEFORE running `/orc-exe`:**

### API Keys & Credentials
- [ ] **[Service 1]**: [e.g., OpenAI API key]
  - Where to get: [URL]
  - Store in: `.env` as `SERVICE1_API_KEY`
  - Estimated time: [X minutes]

- [ ] **[Service 2]**: [e.g., Stripe test keys]
  - Where to get: [URL]
  - Store in: `.env` as `SERVICE2_KEY`
  - Estimated time: [X minutes]

### Account Setup
- [ ] **[Platform 1]**: Create developer account
  - URL: [signup link]
  - Required info: [what you'll need]

- [ ] **[Platform 2]**: Enable specific feature/API
  - URL: [settings link]
  - Steps: [brief instructions]

### Data & Assets
- [ ] **[Data source]**: Gather/prepare initial data
  - Format needed: [JSON/CSV/etc]
  - Location: [where to put it]

- [ ] **[Assets]**: Prepare images/logos/branding
  - Sizes needed: [dimensions]
  - Formats: [PNG/SVG/etc]

## During Development

**May be needed at specific stages:**

### Third-Party Configuration
- [ ] **[Service webhook]**: Configure callback URL
  - When: After [specific milestone]
  - URL pattern: `https://your-domain.com/api/webhook`
  - Settings needed: [specific config]

- [ ] **OAuth setup**: Register OAuth application
  - When: Before auth feature testing
  - Callback URLs to register: [list]
  - Scopes needed: [list]

### Manual Testing Points
- [ ] **Payment flow**: Test with real test cards
  - Test card numbers: [reference link]
  - Scenarios to test: [list]

- [ ] **Email delivery**: Verify emails arrive
  - Check spam folders
  - Verify formatting across clients

## Post-Development

**Before going live:**

### Deployment Configuration
- [ ] **Domain setup**: Point domain to hosting
  - DNS records needed: [A record, CNAME, etc]
  - SSL certificate: [auto/manual]

- [ ] **Environment variables**: Set production values
  - [ ] All API keys updated for production
  - [ ] Debug mode disabled
  - [ ] Analytics enabled

### Third-Party Production Setup
- [ ] **[Service 1]**: Switch from test to production mode
  - Steps: [brief instructions]
  - Verification: [how to confirm it's working]

- [ ] **[Service 2]**: Configure production webhooks
  - Update callback URLs to production domain

### User Setup & Onboarding
- [ ] **Admin account**: Create initial admin user
  - Credentials stored securely
  - 2FA enabled if applicable

- [ ] **Initial data**: Seed production database
  - [ ] Required reference data loaded
  - [ ] Test data removed

## Notes

**Why these are manual:**
- API keys require human identity verification
- OAuth apps require account ownership
- Payment testing requires human judgment
- DNS changes require domain control
- Production credentials need secure human handling

**Time estimate for all manual tasks:**
- Prerequisites: [X hours]
- During development: [X hours]
- Post-development: [X hours]
- **Total**: [X hours]

---

*Last updated: [date]*
*Owner: [who will complete these tasks]*
