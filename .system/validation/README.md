# Validation Tools

## Purpose
Progressive validation: syntax → tests → contracts → integration

## What Goes Here
- Validation scripts
- Pre-flight check tools
- Linting configurations
- Test runners

## Progressive Validation Levels

**Level 1: Syntax** (fast, <1s)
- JavaScript/CSS/HTML syntax valid
- No parse errors

**Level 2: Unit Tests** (medium, <10s)
- All tests pass
- Coverage >80%

**Level 3: Contract Compliance** (fast, <1s)
- Implementation matches contract
- All required methods exist

**Level 4: Integration Safety** (medium, <30s)
- No CSS conflicts
- No DOM ID conflicts
- Dependencies available
- Injection points exist

## Workflow
Run `./validation/pre-flight-check.sh [component]` before integration

## Principle
**Fail fast, fix early** - Catch bugs in seconds, not hours

## See Also
- `pre-flight-check.sh` - Main validation script
- `/validate-component` command - Interactive validation
