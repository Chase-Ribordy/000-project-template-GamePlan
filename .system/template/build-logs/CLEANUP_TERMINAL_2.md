# TERMINAL 2: Clean Up /output & Analyze /components Usage

## Task Summary
Delete unused /output folder and provide detailed analysis of /components operator workflow

## Part 1: Delete /output

### Background
- /output is described as "AI test workspace" in docs
- Currently empty (only .gitkeep)
- No code actually uses it
- Appears to be unused placeholder

### Commands
```bash
# Delete output directory
rm -rf output/

# Update .gitignore to remove output/ reference
# (Manual edit or use sed)
```

## Part 2: Comprehensive /components Analysis

### Investigation Questions

Please analyze and answer these questions with examples:

#### 1. Operator Workflow with /components

**Question**: How does an operator actually interact with /components/?

Research:
- Do operators manually create files in components/?
- Or is components/ populated by agents (/integrate, /define-contract)?
- When do files appear here?

**Example workflow**:
```bash
# Scenario: Operator builds dashboard in Claude Chat
# 1. Save to references/dashboard.html
# 2. Run /integrate references/dashboard.html
# 3. What happens to components/? <-- DOCUMENT THIS
```

#### 2. Components vs. Proven

**Question**: What's the difference between /components and .system/proven/?

Research:
- When does a component go to /components vs .system/proven/?
- Is /components "work in progress" and .system/proven "validated"?
- Or do they serve different purposes?

**Flow diagram needed**:
```
references/ → /integrate → ??? → /components or .system/proven?
```

#### 3. Operator Editing

**Question**: Do operators manually edit files in /components/?

Scenarios to check:
- After /integrate creates components, do operators edit them?
- Or do agents handle all modifications?
- What if there's a bug in a component - where do I fix it?

#### 4. Test References

**Question**: tests/README.md says tests import from ../../components/

Research:
- Do operators run tests directly?
- Do they look at test results?
- Is this operator-facing visibility or agent-facing structure?

#### 5. Current Placement Evaluation

**Question**: Should /components stay at top level or move to .system/?

Compare these scenarios:

**Scenario A: /components at top level (current)**
```
Operator sees:
├── components/      # I see this, but do I use it?
├── references/      # I definitely use this (paste from Claude Chat)
├── docs/            # I definitely use this (write docs)
```

**Scenario B: /components in .system/**
```
Operator sees:
├── references/      # I use this (paste prototypes)
├── docs/            # I use this (write docs)

Hidden in .system/:
├── .system/components/   # Agents manage this
```

### Analysis Output Required

Create a detailed document: `COMPONENTS_USAGE_ANALYSIS.md`

Include:

1. **Operator Workflow** - Step-by-step with examples
2. **Components Lifecycle** - From creation to integration
3. **Operator Touchpoints** - When/how operators interact
4. **Components vs. Proven** - Clear distinction
5. **Testing Integration** - How tests fit in
6. **Recommendation** - Stay top-level or move to .system/?
   - Justification
   - Pros/cons of each approach
   - Impact on workflow

### Commands

```bash
# Create analysis document
cat > COMPONENTS_USAGE_ANALYSIS.md << 'EOF'
# Components Usage Analysis

## Executive Summary
[One paragraph: Should /components stay top-level or move to .system/? Why?]

## 1. Operator Workflow with /components

### Current Workflow
[Document step-by-step how operators interact with /components]

Example:
```
1. Operator builds dashboard in Claude Chat (1500 lines)
2. Saves to references/dashboard.html
3. Runs: /integrate references/dashboard.html
4. [What happens next? Document this]
5. [Does operator edit components/? Or is it agent-managed?]
```

### When Components Are Created
- Via /integrate: [explain]
- Via /define-contract: [explain]
- Manually by operator: [yes/no - explain]

### When Operators Edit Components
[Do they? Or is it agent-managed?]

## 2. Components vs. .system/proven/

### Distinction
| Aspect | /components | .system/proven |
|--------|-------------|----------------|
| Purpose | [?] | [?] |
| Created by | [?] | [?] |
| Validation status | [?] | [?] |
| Operator edits | [?] | [?] |

### Lifecycle Flow
```
[Document the flow from references → components → proven]
```

## 3. Testing Integration

### How tests/ References /components
[Explain the import path: ../../components/example-button/]

### Operator Interaction with Tests
- Do operators run tests? [yes/no]
- Do they see test output? [yes/no]
- Is this visibility important? [explain]

## 4. Placement Recommendation

### Option A: Keep /components Top-Level (Current)

**Pros**:
- [List reasons to keep it visible]

**Cons**:
- [List reasons it might clutter operator view]

**Operator workflow**:
- [How does operator use this folder?]

### Option B: Move to .system/components/

**Pros**:
- [List reasons to abstract it]

**Cons**:
- [List reasons this might hurt workflow]

**Operator workflow**:
- [How would workflow change?]

## 5. Final Recommendation

**Recommendation**: [Keep top-level OR Move to .system/]

**Reasoning**:
[Detailed explanation based on actual operator workflow]

**Key insight**:
[The deciding factor - what role does /components play in operator's daily work?]

## 6. Implementation Impact

If moved to .system/:
- [ ] Update tests/ import paths
- [ ] Update /integrate command references
- [ ] Update documentation
- [ ] Update .gitignore if needed
- [ ] Update README.md operator workspace section

If kept at top-level:
- [ ] Improve components/README.md to clarify operator usage
- [ ] Add examples of when operators interact with it
- [ ] Document the workflow more clearly
EOF

echo "✅ Terminal 2 Analysis Complete!"
echo ""
echo "Next steps:"
echo "1. Review COMPONENTS_USAGE_ANALYSIS.md"
echo "2. Discuss recommendation"
echo "3. Enter PLAN MODE before acting on recommendation"
```

## Success Criteria
- [ ] /output deleted
- [ ] .gitignore updated (remove output/ reference)
- [ ] COMPONENTS_USAGE_ANALYSIS.md created
- [ ] Analysis covers all 6 sections
- [ ] Clear recommendation provided
- [ ] Justification based on actual operator workflow

## Verification
```bash
# Should NOT exist
ls output/  # Should error

# Should exist
ls COMPONENTS_USAGE_ANALYSIS.md

# Review analysis
cat COMPONENTS_USAGE_ANALYSIS.md
```

## Notes for Analysis

Focus on answering: **"As an operator, do I actively use /components, or is it managed by agents?"**

Key workflow to trace:
```
Claude Chat → references/ → /integrate → ???
└─> Where do components end up?
└─> Do I edit them?
└─> Or do agents handle everything?
```

If components are agent-managed (operators don't edit them), they belong in .system/.
If operators actively work in components/, keep top-level.
