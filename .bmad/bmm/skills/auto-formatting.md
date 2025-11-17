# Skills: Auto-Formatting

Collection of formatting skills that convert operator input into properly structured markdown.

---

## Skill: format-epic-section

**Purpose:** Format raw epic description into standard epic markdown structure

### Input Format

```javascript
{
  epic_number: 2,
  title: "Content Management",
  goal: "Enable users to create and manage content",
  value: "Users can express themselves through content creation",
  functional_requirements: ["FR4", "FR5", "FR6", "FR7"],
  stories: [
    {number: 1, title: "Create Article", description: "..."},
    {number: 2, title: "Edit Article", description: "..."},
    ...
  ]
}
```

### Output Format

```markdown
## Epic {epic_number}: {title}

**Epic Goal:** {goal}

**Value Proposition:** {value}

**Functional Requirements:** {FR list}

{for each story:}
### Story {epic_number}.{story_number}: {story_title}

{story_description formatted}

---

{/for}
```

### Usage

```javascript
formatted = invoke_skill("format-epic-section", {
  epic_data: epic_object
})

// Write to file
write_file("epics.md", formatted, append=true)
```

---

## Skill: format-story-ac

**Purpose:** Convert requirements into BDD (Given/When/Then) acceptance criteria

### Input Formats Accepted

1. **Natural language**:
   ```
   "Users should see their login count when they access the dashboard"
   ```

2. **Bullet points**:
   ```
   - Dashboard shows login count
   - Clicking export downloads CSV
   - Date range can be selected
   ```

3. **Structured requirements**:
   ```javascript
   {
     requirement: "Dashboard displays metrics",
     context: "User accesses metrics dashboard",
     action: "Page loads",
     outcome: "Charts show activity for last 7 days"
   }
   ```

### Output Format (BDD)

```markdown
1. **Given** {context}
   **When** {action}
   **Then** {outcome}

2. **Given** {context}
   **When** {action}
   **Then** {outcome}
```

### Conversion Rules

1. **Extract context** (Given):
   - Look for: "when", "if", "assuming", "provided that"
   - Extract preconditions and state

2. **Extract action** (When):
   - Look for: verbs (clicks, selects, enters, submits)
   - Extract user interaction or system trigger

3. **Extract outcome** (Then):
   - Look for: "should", "will", "must", "displays", "shows"
   - Extract expected result

### Examples

```
Input: "Users should see their login count"

Analysis:
- Context: User accesses dashboard (implied)
- Action: Dashboard loads
- Outcome: Login count is displayed

Output:
**Given** I access the metrics dashboard
**When** the page loads
**Then** I see my total login count displayed
```

```
Input: "When clicking export, a CSV file downloads"

Analysis:
- Context: On metrics dashboard (implied)
- Action: User clicks "Export" button
- Outcome: CSV file downloads

Output:
**Given** I am viewing my metrics
**When** I click "Export to CSV"
**Then** a CSV file with my metrics downloads
```

```
Input: "Date range selector updates the charts"

Analysis:
- Context: On dashboard with charts
- Action: User selects different date range
- Outcome: Charts update with new data

Output:
**Given** I am viewing the metrics dashboard
**When** I select a different date range (e.g., "Last 30 days")
**Then** the charts update to show metrics for the selected period
```

### Usage

```javascript
requirements = [
  "Users see their login count",
  "Export button downloads CSV",
  "Date range can be selected"
]

formatted_acs = invoke_skill("format-story-ac", {
  requirements: requirements
})

// Output:
// 1. **Given** I access the metrics dashboard
//    **When** the page loads
//    **Then** I see my total login count displayed
//
// 2. **Given** I am viewing my metrics
//    **When** I click "Export to CSV"
//    **Then** a CSV file with my metrics downloads
//
// 3. **Given** I am viewing the dashboard
//    **When** I select a different date range
//    **Then** the charts update to show metrics for the selected period
```

---

## Skill: format-user-story

**Purpose:** Convert feature description into "As a.../I want.../So that..." format

### Input

```
Feature: "Users track their activity metrics"
or
Feature: {
  actor: "user",
  capability: "track activity metrics",
  benefit: "understand usage patterns"
}
```

### Output

```markdown
**User Story:**
As a {actor}
I want to {capability}
So that {benefit}
```

### Extraction Logic

1. **Identify actor**:
   - Look for: "users", "admins", "visitors", "members"
   - Default to "user" if not specified

2. **Extract capability**:
   - Main verb + object
   - "track activity metrics", "export data", "create content"

3. **Infer benefit**:
   - If not stated, infer from capability
   - "track metrics" → "understand my usage"
   - "export data" → "analyze it offline"
   - "create content" → "share my ideas"

### Examples

```
Input: "Users track their activity metrics"

Output:
As a user
I want to track my activity metrics
So that I can understand my usage patterns
```

```
Input: "Admins export all user data to CSV"

Output:
As an admin
I want to export all user data to CSV format
So that I can perform offline analysis and reporting
```

---

## Skill: format-tech-notes

**Purpose:** Structure technical notes from various sources into dev notes section

### Input Sources

1. **Architecture references**:
   - Tech stack decisions
   - Patterns to follow
   - Standards to apply

2. **Operator guidance**:
   - Specific libraries to use
   - Implementation preferences
   - Performance requirements

3. **Story context**:
   - Dependencies
   - Integration points
   - Security considerations

### Output Structure

```markdown
## Dev Notes

**Architecture:**
- {Pattern to follow}
- {Framework/library guidance}
- {File structure notes}

**Dependencies:**
- {npm/pip packages needed}
- {External services}

**Testing Requirements:**
- {What to test}
- {Testing framework}
- {Coverage requirements}

**Security Considerations:**
- {Auth/authorization}
- {Input validation}
- {Data sanitization}

**Performance:**
- {Performance targets}
- {Optimization guidance}

**References:**
- PRD: {FR numbers}
- Architecture: {section references}
- Epic: {epic number}
```

### Auto-Population Logic

```javascript
function format_tech_notes(context) {
  notes = {}

  // From architecture.md
  if (architecture_exists) {
    notes.architecture = [
      extract_relevant_patterns(context.story),
      extract_tech_stack(context.story_domain),
      extract_standards()
    ]
  }

  // From epic/story context
  notes.dependencies = extract_dependencies(context)

  // From architecture testing section
  notes.testing = extract_testing_requirements(context)

  // From security patterns
  if (story_involves_auth || story_involves_data_input) {
    notes.security = extract_security_guidance(context)
  }

  // From NFRs (non-functional requirements)
  if (has_performance_requirements(context)) {
    notes.performance = extract_performance_guidance(context)
  }

  // References
  notes.references = {
    prd: extract_fr_references(context),
    architecture: extract_arch_references(context),
    epic: context.epic_number
  }

  return format_as_markdown(notes)
}
```

### Example

```
Context:
- Story: User Authentication (Epic 1, Story 1.1)
- Architecture: Express.js, PostgreSQL, JWT auth
- Security: bcrypt for passwords

Output:

## Dev Notes

**Architecture:**
- Use Express.js middleware pattern for route protection
- JWT tokens stored in HTTP-only cookies
- User model: Sequelize ORM with PostgreSQL
- Follow MVC structure: models/, controllers/, routes/

**Dependencies:**
- express: Web framework
- jsonwebtoken: JWT generation/validation
- bcrypt: Password hashing
- sequelize: ORM for database

**Testing Requirements:**
- Unit tests: User model, auth middleware
- Integration tests: Login/logout flows
- Test coverage: >80% for auth logic
- Framework: Jest + Supertest

**Security Considerations:**
- Hash passwords with bcrypt (cost factor: 10)
- Validate email format on registration
- Rate limiting on login endpoint (5 attempts/15min)
- JWT expiry: 7 days with refresh token
- SQL injection protection via Sequelize parameterization

**Performance:**
- Login response: <200ms
- Password hashing: async (don't block event loop)
- Database connection pooling enabled

**References:**
- PRD: FR1 (User Registration), FR2 (User Login)
- Architecture: Section 3.2 (Authentication), Section 4.1 (Security)
- Epic: Epic 1 - User Authentication
```

---

## Skill: format-task-breakdown

**Purpose:** Convert acceptance criteria into actionable task/subtask structure

### Input

Acceptance criteria (BDD format):

```markdown
1. **Given** I access the dashboard
   **When** the page loads
   **Then** I see my login count

2. **Given** I click "Export"
   **When** the export completes
   **Then** a CSV file downloads
```

### Output

```markdown
## Tasks and Subtasks

### Task 1: Implement metrics data collection
- [ ] Create database schema for activity events
- [ ] Add event logging on user login
- [ ] Create metrics aggregation query
- [ ] Build metrics API endpoint

### Task 2: Build metrics dashboard UI
- [ ] Create dashboard component
- [ ] Implement chart visualizations (using Chart.js)
- [ ] Add date range selector
- [ ] Connect to metrics API

### Task 3: Implement CSV export
- [ ] Create CSV generation utility
- [ ] Add export endpoint
- [ ] Wire up export button in UI
- [ ] Handle file download

### Task 4: Write tests
- [ ] Unit tests for metrics aggregation
- [ ] Integration tests for API endpoints
- [ ] E2E tests for dashboard interactions
- [ ] Test CSV export functionality
```

### Mapping Logic

```javascript
function ac_to_tasks(acceptance_criteria) {
  tasks = []

  for (ac of acceptance_criteria) {
    // Extract implementation needs
    backend_needs = extract_backend_requirements(ac)
    frontend_needs = extract_frontend_requirements(ac)
    data_needs = extract_data_requirements(ac)

    // Group into tasks
    if (data_needs.length > 0) {
      tasks.push({
        title: "Implement data layer",
        subtasks: data_needs
      })
    }

    if (backend_needs.length > 0) {
      tasks.push({
        title: "Build backend logic",
        subtasks: backend_needs
      })
    }

    if (frontend_needs.length > 0) {
      tasks.push({
        title: "Create UI components",
        subtasks: frontend_needs
      })
    }
  }

  // Always add testing task
  tasks.push({
    title: "Write tests",
    subtasks: generate_test_subtasks(acceptance_criteria)
  })

  return tasks
}
```

---

## Skill: format-markdown-structure

**Purpose:** Ensure proper markdown heading hierarchy and formatting

### Checks

1. **Heading hierarchy**: # → ## → ### (no skipping levels)
2. **Code blocks**: Properly fenced with language tags
3. **Lists**: Consistent bullet/number formatting
4. **Links**: Valid markdown link syntax
5. **Tables**: Properly formatted with headers

### Corrections

```markdown
// Input (malformed)
# Story Title
#### Acceptance Criteria  ← Skipped ##, ###
Some text
```python  ← Missing opening fence
code here
```

// Output (corrected)
# Story Title

## Acceptance Criteria

Some text

```python
code here
```
```

---

## Integration Example

How these skills work together:

```javascript
// Operator input
operator_says("Users should track their activity and export to CSV")

// Step 1: Expand idea
idea = invoke_skill("expand-operator-idea", {
  input: operator_says
})
// Returns: structured epic with stories

// Step 2: Format epic
formatted_epic = invoke_skill("format-epic-section", {
  epic_data: idea.epic
})

// Step 3: For each story, format components
for (story of idea.stories) {
  // Format user story statement
  user_story = invoke_skill("format-user-story", {
    feature: story.description
  })

  // Format acceptance criteria
  acs = invoke_skill("format-story-ac", {
    requirements: story.requirements
  })

  // Format task breakdown
  tasks = invoke_skill("format-task-breakdown", {
    acceptance_criteria: acs
  })

  // Format dev notes
  dev_notes = invoke_skill("format-tech-notes", {
    context: {
      story: story,
      architecture: load_architecture(),
      epic: idea.epic
    }
  })

  // Assemble complete story
  complete_story = `
# Story ${story.number}: ${story.title}

${user_story}

## Acceptance Criteria
${acs}

${tasks}

${dev_notes}
  `

  // Ensure proper markdown
  final_story = invoke_skill("format-markdown-structure", {
    markdown: complete_story
  })

  // Write to file
  write_file(`stories/${story.key}.md`, final_story)
}
```

---

## Success Criteria

All formatting skills should:
- ✅ Accept flexible input formats
- ✅ Produce consistent, standard output
- ✅ Require zero manual formatting from operator
- ✅ Integrate seamlessly with other skills
- ✅ Handle edge cases gracefully
- ✅ Maintain operator's intent and vision

---

## Related Skills

- `expand-operator-idea` - Uses all formatting skills
- `detect-*-opportunity` - May invoke formatting for recommendations
