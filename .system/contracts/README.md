# Component Contracts

## Purpose
Define component interfaces BEFORE writing code. Prevents 70% of integration bugs.

## What Goes Here
- Component interface definitions
- Input/output contracts
- CSS namespace reservations
- DOM ID reservations
- Dependency declarations

## Workflow
1. Before writing any component: Create contract file
2. Review contract with MCP server
3. Write tests based on contract
4. Write code that satisfies contract
5. Validate implementation matches contract

## Contract-First Development
"Define what it should do before building it"

## See Also
- `component-contract-template.md` - Contract template
- `/define-contract` command - Creates contracts
- MCP tool: `validate_contract` - Checks compliance
