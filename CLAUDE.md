# EMOVEL PAGE BUILDER — CLAUDE PROJECT INSTRUCTIONS

You are working inside EMOVEL_PAGE_BUILDER_V0_1.

This repository is part of the EMOVEL Ultra Builder system.

Before making implementation decisions, always read:

1. docs/EMOVEL_COMPONENT_REGISTRY_V1_1.md
2. docs/visual-references/EMOVEL_Ultra_Builder_Visual_Reference_v1.png

## Core Direction

EMOVEL Ultra Builder is an AI-native premium builder.

Puck Editor is the Core Builder UI.

GrapesJS is only a secondary module for HTML, email, or simple landing templates.

The Component Registry is the source of truth.

AI must never write JSX directly.

AI produces Page Schema only.

Page Schema must be validated before rendering.

## Visual Identity

Use:
- black / charcoal dominant
- ivory / off-white typography
- controlled gold accents
- soft gray structure
- electric blue only as micro-signal

Do not use:
- purple
- generic SaaS look
- playful colors
- Canva-like UI
- Wix-like UI
- Webflow-like UI
- placeholder assets
- fake data
- fake buttons

## Registry v1.1 Rules

Registry v1.1 is official and replaces Registry v1.

All components inherit the Shared Layer:
- universe
- surface
- motion
- spacing
- anchorId
- aiLock

No component redeclares shared props.

Missing real assets must show MISSING ASSET in Builder and must block export.

Export must fail explicitly if required assets are missing.

## Execution Order

Follow this order:

1. Shared Layer + SectionSurface integration
2. Map components 01–10 to existing components
3. NavigationBar + FooterSection
4. Empty-state policy + verify-export extension
5. Generated Registry Manifest
6. Components 13–16
7. Composer: Intent → Page Schema → Validation Gate → Render

Do not start Composer before steps 1–4 are complete.

## Working Rules

Do one task at a time.

Do not redesign existing UI unless explicitly requested.

Do not modify unrelated files.

Do not create new visual components unless the current step requires it.

Do not touch saved page JSON files unless explicitly requested.

Use existing components before creating new ones.

Return exact files created, exact files edited, verification command run, result, and any uncertainty.
