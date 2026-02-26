# Design Document: Minimalist Professional UI Polish

**Date**: 2026-02-22
**Status**: Finalized
**Topic**: UI/UX Polishing for Language Coach

## Overview

Transform the current functional chat into a premium, minimalist platform using a professional design language inspired by tools like Linear and Stripe.

## 1. Visual Language

- **Color Palette**:
  - Pure White (#FFFFFF) backgrounds.
  - Slate (900, 500, 200) for text and borders.
  - Emerald 600 (#059669) as the primary brand accent.
- **Typography**: Inter (Geometric Sans-serif) for maximum legibility.
- **Shapes**: Minimal rounding (rounded-xl) rather than overly rounded circles to maintain a professional feel.
- **Shadows**: Soft, multi-layered "ambient" shadows for depth on cards and inputs.

## 2. Component Architecture

- **AppHeader**:
  - 1px bottom border (Slate-200).
  - Subtle language flags with mono-style secondary text.
- **Message Bubbles**:
  - User: Dark (Slate-900) with white text, positioned on the right.
  - Coach: White with Slate-200 border, Slate-800 text, positioned on the left.
- **Chat Input**:
  - Centered floating bar.
  - Ring-2 focus state on Emerald-500.

## 3. Interactions & Motion

- **Entry**: Messages will stagger in with a subtle fade-up animation (20px vertical offset) using `framer-motion`.
- **Loading**: A discrete typing indicator (dots) rather than full-page loaders.
- **Hover States**: Interactive elements will have subtle background shifts (Slate-50) rather than heavy color changes.

## 4. Error Handling

- Clean, non-intrusive toast notifications or inline text for API errors, matching the Slate/Emerald palette.

---
*Approved by User on 2026-02-22*
