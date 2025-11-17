# Skill: Expand Operator Idea

**Skill Name:** `expand-operator-idea`

**Purpose:** Convert natural language operator input into structured epic/story format

**Invoked By:** PM agent, SM agent

**When to Invoke:**
- Operator provides feature ideas in natural language
- When capturing requirements conversationally
- During brainstorming sessions
- When operator wants to add features to backlog

---

## Skill Objectives

1. **Minimize operator typing** - They speak naturally, agent formats correctly
2. **Extract complete requirements** - Ask clarifying questions to fill gaps
3. **Structure formally** - Convert to epic/story/AC format
4. **Maintain vision** - Capture operator's intent accurately
5. **Suggest enhancements** - Identify related features operator might want

---

## Expansion Process

### Step 1: Receive Operator Input

Accept natural language feature description:

```
Examples of operator input:
- "Users should be able to track their usage metrics"
- "Add export functionality for data"
- "I want authentication with social login"
- "Need a dashboard showing all the important stats"
```

### Step 2: Initial Understanding

Parse input to extract:

1. **Core capability**: What does the user want to do?
2. **Actor**: Who is performing the action?
3. **Value**: Why is this important? (if stated)
4. **Scope hints**: Any specifics mentioned?

Example parsing:
```
Input: "Users should be able to track their usage metrics"

Parsed:
- Actor: Users
- Capability: Track usage metrics
- Value: {not stated, need to ask}
- Scope: {unclear - what metrics? how displayed?}
```

### Step 3: Ask Clarifying Questions

Generate targeted questions to complete the picture:

```markdown
I understand you want users to track usage metrics. Let me ask a few questions to flesh this out:

1. **Metrics Scope**: What specific metrics should users see?
   - Activity counts (logins, actions, etc.)?
   - Time-based metrics (time spent, session duration)?
   - Resource usage (storage, API calls, etc.)?
   - Performance metrics (response times, errors)?

2. **Display Format**: How should metrics be presented?
   - Dashboard with charts/graphs?
   - Simple table/list?
   - Real-time updates or static snapshots?

3. **Time Ranges**: What time periods?
   - Today, last 7 days, last 30 days?
   - Custom date range selector?
   - All-time stats?

4. **Export**: Should users be able to export metrics?
   - If yes, what formats (CSV, JSON, PDF)?

5. **Privacy**: Individual user only, or admin view of all users?
```

### Step 4: Capture Operator Responses

Process operator answers (may be brief or detailed):

```
Operator: "Activity counts and time-based. Dashboard with graphs. Last 7 days and 30 days. CSV export would be good. Just individual users, not admin view."

Agent: Great! Let me also ask:
- Should the dashboard auto-refresh (live updates)?
- Any specific actions to track (e.g., logins, content created, searches)?
- Do you want comparison (this week vs last week)?

Operator: "No auto-refresh needed. Track logins, content created, and searches. Comparison would be nice."
```

### Step 5: Structure as Epic

Convert to formal epic structure:

```markdown
## Epic {N}: Usage Metrics Tracking

**Epic Goal:** Enable users to track their activity and usage patterns

**Value Proposition:**
Users gain visibility into their activity, helping them understand their usage patterns and productivity. Metrics provide insights for self-improvement and accountability.

**Functional Requirements:** FR{X}-FR{Y}
- FR{X}: Display activity metrics (logins, content created, searches)
- FR{X+1}: Show time-based metrics (time spent, session duration)
- FR{X+2}: Support 7-day and 30-day time ranges
- FR{X+3}: Visualize metrics in dashboard with charts/graphs
- FR{X+4}: Compare current period to previous period
- FR{X+5}: Export metrics to CSV format

**Story Breakdown:**

### Story {N}.1: Activity Metrics Collection

**User Story:**
As a user
I want my activity (logins, content created, searches) to be tracked
So that I can see what I've been doing

**Acceptance Criteria:**
1. **Given** I log in
   **When** the login completes
   **Then** a login event is recorded with timestamp

2. **Given** I create content
   **When** the content is saved
   **Then** a content-creation event is recorded with details

3. **Given** I perform a search
   **When** the search executes
   **Then** a search event is recorded with query

---

### Story {N}.2: Metrics Dashboard

**User Story:**
As a user
I want to see my activity metrics in a visual dashboard
So that I can quickly understand my usage patterns

**Acceptance Criteria:**
1. **Given** I access the metrics dashboard
   **When** the page loads
   **Then** I see charts showing my activity for the last 7 days

2. **Given** I'm viewing the dashboard
   **When** I select "Last 30 days"
   **Then** charts update to show 30-day metrics

[... continue for all stories ...]
```

### Step 6: Suggest Related Features

Identify adjacent features operator might want:

```markdown
Related features you might consider:

1. **Goal Setting**
   - Users can set activity goals (e.g., "create 5 pieces of content per week")
   - Dashboard shows progress toward goals
   - Adds motivation and gamification

2. **Insights & Recommendations**
   - System analyzes metrics and suggests improvements
   - "You're most productive on Tuesday mornings"
   - "You haven't logged in for 3 days - welcome back!"

3. **Team Metrics** (Future)
   - Admin view of all user metrics
   - Team performance dashboards
   - Comparative analytics

Would you like to include any of these in the current epic or save for later?
```

---

## Formatting Skills

### Auto-Format Epic Section

```markdown
Input: Brief description + Q&A

Output: Properly formatted epic with:
- Epic number (next available)
- Goal statement
- Value proposition
- Functional requirements
- Story breakdown
- Markdown formatting
- Consistent structure
```

### Auto-Format Story

```markdown
Input: Story description

Output: Complete story file with:
- User story statement (As a.../I want.../So that...)
- BDD acceptance criteria (Given/When/Then)
- Task breakdown
- Dev notes section
- Proper heading hierarchy
- Standard template format
```

### Auto-Format Acceptance Criteria

```markdown
Input: Requirements in any format

Output: BDD format
- Given {context}
  When {action}
  Then {outcome}

Examples:
Input: "Users should see their login count"
Output:
**Given** I access the metrics dashboard
**When** the page loads
**Then** I see my total login count displayed

Input: "Exports should be in CSV format"
Output:
**Given** I click "Export to CSV"
**When** the export completes
**Then** a CSV file downloads with all my metrics
```

---

## Conversational Flow Examples

### Example 1: Brief Input

```
Operator: "Add user authentication"

PM: Great! Let me expand on that. A few questions:

1. Authentication methods:
   - Email/password?
   - Social login (Google, GitHub, etc.)?
   - Magic link (passwordless email)?
   - Multi-factor authentication (MFA)?

2. User registration:
   - Open registration (anyone can sign up)?
   - Invitation-only?
   - Email verification required?

3. Session management:
   - Remember me functionality?
   - Session timeout duration?
   - Multiple device support?

Operator: "Email/password is fine. Open registration with email verification. 7-day remember me."

PM: Perfect! I'll also include:
- Password reset functionality (forgot password)
- Account activation via email link
- Secure password hashing (bcrypt)

Structuring as Epic 1: User Authentication with 4 stories:
1. User Registration & Email Verification
2. Login & Session Management
3. Password Reset Flow
4. Account Security (hashing, validation)

Look good?

Operator: "Yes"

PM: ✅ Epic 1 created! Here's the formal structure:
{display formatted epic}
```

### Example 2: Detailed Input

```
Operator: "I need a content management system where users can create articles with a title, body, and tags. Articles should support markdown formatting. Users should be able to save drafts before publishing. Published articles appear in a feed. Users can edit and delete their own articles."

PM: Excellent detail! You've basically outlined Epic 2: Content Management. Let me structure it:

Epic 2: Content Management
- Story 2.1: Create Article (draft mode)
- Story 2.2: Publish Article
- Story 2.3: Article Feed/List
- Story 2.4: Edit Article
- Story 2.5: Delete Article
- Story 2.6: Markdown Rendering

A few questions to complete the picture:

1. **Tags**: Free-form text or predefined list?
2. **Feed**: Chronological, or sorted by popularity/engagement?
3. **Permissions**: Can users see others' drafts, or only published articles?
4. **Editing**: Version history? Or just overwrite?

Operator: "Tags are free-form. Feed is chronological, newest first. Only author sees drafts. No version history needed."

PM: Perfect! I'll create the epic with those specifics. I'm also suggesting:
- Story 2.7: Tag Filtering (users can filter feed by tag)
- Story 2.8: Search Articles (by title/content)

Include these now or add to backlog for later?

Operator: "Add filtering now, search can wait"

PM: Got it! Creating Epic 2 with stories 2.1-2.7 now, and adding 2.8 (search) to backlog-future.md.

{creates formatted epic}
```

### Example 3: Vague Input

```
Operator: "Something for analytics"

PM: Analytics is a broad area! Let me help narrow it down:

**Analytics Types:**
1. **User Activity** - What users do (logins, actions, time spent)
2. **Content Performance** - Which articles/posts are popular
3. **System Health** - Performance metrics, errors, uptime
4. **Business Metrics** - Revenue, conversions, growth
5. **Custom Events** - Track specific actions you define

Which type(s) are you interested in?

Operator: "User activity and content performance"

PM: Great! For user activity and content performance, what's your goal?

**Possible Goals:**
- Understand user behavior to improve product
- Identify popular content to guide content strategy
- Monitor engagement to measure success
- Provide users visibility into their own activity
- Administrative dashboard for team insights

Operator: "Understand user behavior and identify popular content"

PM: Perfect! This will be an admin/analytics epic. Questions:

1. **Audience**: Just admins, or do users see their own analytics too?
2. **Metrics**: What specific metrics matter?
   - User: Active users, retention, session duration?
   - Content: Views, likes, comments, shares?
3. **Visualization**: Charts/graphs or just numbers?
4. **Time ranges**: Today, week, month, all-time?

{continues dialog to build complete epic}
```

---

## Integration with Workflows

### During PRD Creation

```markdown
PM: Let's define your product requirements. What features do you envision?

Operator: "Users track workouts, see progress over time, export data"

{PM invokes expand-operator-idea}

PM: I'm hearing 3 main capabilities:
1. Workout tracking
2. Progress visualization
3. Data export

Let me flesh these out...

{PM asks clarifying questions}
{PM structures as formal PRD requirements}
```

### During Epic Brainstorming

```markdown
PM: We have Epic 1 (Authentication) complete. What's next?

Operator: "Content stuff and maybe some social features"

{PM invokes expand-operator-idea}

PM: Let's break "content stuff" and "social features" into concrete epics...

Content: Creating, editing, listing content?
Social: Following users, comments, likes?

{PM guides operator through expansion}
{PM creates formal epic structures}
```

---

## Output Artifacts

### Formatted Epic

Saved to epics.md or as new epic proposal:

```markdown
## Epic {N}: {Title}

**Epic Goal:** {one-sentence goal}

**Value Proposition:** {why this matters}

**Functional Requirements:** {FR references}

**Stories:**
- Story {N}.1: {title} - {brief description}
- Story {N}.2: {title} - {brief description}
...
```

### Formatted Stories

Saved to individual story files:

```markdown
# Story {N}.{M}: {Title}

**Epic:** Epic {N} - {Epic Title}
**Status:** backlog

## User Story
As a {role}
I want to {capability}
So that {benefit}

## Acceptance Criteria
1. **Given** {context}
   **When** {action}
   **Then** {outcome}
...

## Tasks and Subtasks
### Task 1: {description}
- [ ] {subtask}
...

## Dev Notes
{initial guidance based on operator input}
```

---

## Success Criteria

- ✅ Operator provides brief, natural input
- ✅ Agent asks minimal but complete questions
- ✅ All output is properly formatted
- ✅ Operator vision is accurately captured
- ✅ Agent suggests valuable related features
- ✅ No manual formatting required from operator
- ✅ Conversation is natural and efficient

---

## Related Skills

- `format-epic-section` - Format epic markdown
- `format-story-ac` - Format acceptance criteria
- `format-tech-notes` - Format dev notes
