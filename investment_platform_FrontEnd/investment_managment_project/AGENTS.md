# Investment Management Project Agent Rules

## Project Context

This is an existing production Next.js application.

The project uses:

- Next.js App Router
- React
- TypeScript
- React Hook Form
- Zod

Preserve existing architecture.

Never redesign folders or introduce new patterns without approval.


# Development Workflow

Before coding:

1. Analyze the existing implementation.
2. Search similar features.
3. Find reusable components.
4. Check existing hooks, types and validations.
5. Present a plan for large changes.

Never start coding immediately.


# Folder Architecture

Follow this structure:


## Routes

app/

Contains:

- pages
- layouts
- route groups


## Components

components/

Feature components:

components/pages/{section}/{feature}


Shared UI:

components/ui/


Never create duplicate UI components.


# Business Logic Placement


## Constants

Location:

lib/constants


Contains:

- static data
- table configuration
- dropdown options


## Hooks

Location:

lib/hooks


Contains:

- custom React hooks
- reusable feature logic


## Types

Location:

lib/types


Contains:

- reusable TypeScript types


## Validation

Location:

lib/validation


Contains:

- Zod schemas


## Utils

Location:

lib/utils


Contains:

- pure helper functions



# Forms


Required:

React Hook Form
+
Zod


Always reuse:

- FormInputField
- FormFileUploadField
- FormDatePickerField
- FormScrollableSelectField


Never:

- useState for form state
- manual validation handling


Validation messages:

Must always be Persian.


Example:

Wrong:

"Required"


Correct:

"وارد کردن عنوان الزامی است"



# Tables


Always use:

components/ui/ReusableTable.tsx


Never create:

- CustomTable
- UserTable
- ProjectTable


Extend existing table functionality.



# API Rules


Never use direct fetch.


Use:

- existing API clients
- generated hooks



# Code Quality


Always:

- TypeScript strict
- No any
- No dead code
- No duplicate logic
- Reusable components
- Clean architecture



# Final Review


Before finishing verify:

- Architecture
- Performance
- Accessibility
- SEO
- Security
- Type Safety
- Existing patterns


Generate Conventional Commit messages when requested.# Investment Management Project Agent Rules

## Project Context

This is an existing production Next.js application.

The project uses:

- Next.js App Router
- React
- TypeScript
- React Hook Form
- Zod

Preserve existing architecture.

Never redesign folders or introduce new patterns without approval.

---

# Development Workflow

Before coding:

1. Analyze the existing implementation.
2. Search similar features.
3. Find reusable components.
4. Check existing hooks, types and validations.
5. Present a plan for large changes.

Never start coding immediately.

---

# Folder Architecture

Follow this structure:

## Routes

app/

Contains:
- pages
- layouts
- route groups


## Components

components/

Feature components:

components/pages/{section}/{feature}


Shared UI:

components/ui/


Never create duplicate UI components.

---

# Business Logic Placement

## Constants

Use:

lib/constants


Examples:

- table configurations
- dropdown options
- static data


## Hooks

Use:

lib/hooks


Examples:

- API related hooks
- reusable React hooks
- feature logic hooks


## Types

Use:

lib/types


All reusable TypeScript types belong here.


## Validation

Use:

lib/validation


All Zod schemas belong here.


## Utils

Use:

lib/utils


Only pure helper functions.

---

# Forms

Required:

React Hook Form
+
Zod


Always use existing:

- FormInputField
- FormFileUploadField
- FormDatePickerField
- FormScrollableSelectField


Never:

- useState for form state
- manually manage validation errors


All validation messages MUST be Persian.

Example:

Bad:

"Required"


Good:

"وارد کردن عنوان الزامی است"

---

# Tables

Always use:

components/ui/ReusableTable.tsx


Never create:

- CustomTable
- UserTable
- ProjectTable


Extend existing table functionality.

---

# API Rules

Never use direct fetch.

Use existing API clients and generated hooks.

Follow existing API architecture.

---

# Code Quality

Always:

- TypeScript strict
- No any
- No dead code
- No duplicate logic
- Reusable components
- Clean architecture


---

# Review Before Finish

Check:

- Architecture
- Performance
- Accessibility
- SEO
- Security
- Type Safety
- Existing patterns


Generate Conventional Commit message when requested.# Investment Management Project Agent Rules

## Project Context

This is an existing production Next.js application.

Before writing code:

1. Analyze existing architecture.
2. Search existing implementations.
3. Find similar features.
4. Reuse existing patterns.

Never redesign architecture without approval.

---

# Architecture Rules

Follow current folder structure.

Main folders:

- app → Next.js routes and layouts
- components → UI and feature components
- lib/constants → static configuration and data
- lib/hooks → custom React hooks
- lib/types → TypeScript types
- lib/validation → Zod schemas
- lib/utils → helper functions

Do not create random folders.

---

# Components

Feature components belong inside:

components/pages/{panel}/{feature}

Examples:

components/pages/admin/admin-user-management

components/pages/investment-panel/invest-project

Do not create:

components/UserTable.tsx

components/CustomTable.tsx

Reuse existing components.

---

# Forms

Required stack:

React Hook Form

- Zod

Always use:

- FormInputField
- FormFileUploadField
- FormDatePickerField
- FormScrollableSelectField

Never use raw:

- Input
- Select
- DatePicker

inside forms if an existing component exists.

All validation messages must be Persian.

Example:

Wrong:

"Required"

Correct:

"وارد کردن عنوان الزامی است"

---

# Tables

All tables must use:

components/ui/ReusableTable.tsx

Never create new table abstractions.

---

# API

Never use direct fetch.

Always use existing API clients/hooks.

---

# File Placement

Constants:

lib/constants

Hooks:

lib/hooks

Types:

lib/types

Validation:

lib/validation

Utilities:

lib/utils

---

# Refactoring

Do not make large refactors.

Prefer incremental changes.

---

# Final Review

Before finishing check:

- TypeScript
- Architecture
- Performance
- Accessibility
- SEO
- Security
- Existing patterns
