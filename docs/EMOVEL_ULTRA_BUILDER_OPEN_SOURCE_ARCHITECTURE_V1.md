# EMOVEL Ultra Builder — Open-Source Architecture v1

Status: OFFICIAL ARCHITECTURE DOCUMENT  
Rol: definește stack-ul open-source-first pentru EMOVEL Ultra Builder AI-Native.

---

## 1. Decizie arhitecturală principală

EMOVEL Ultra Builder nu este o colecție de tool-uri.

EMOVEL este orchestratorul.

Tool-urile open-source sunt componente controlate în sistem.

Core-ul Builder-ului nu este GrapesJS.

Core-ul Builder-ului este:

- Puck Editor
- EMOVEL Component Registry v1.1
- Page Schema
- Validation Gate
- Next.js / React / TypeScript output

---

## 2. Core Builder UI

### Core

- Puck Editor
- EMOVEL Component Registry v1.1
- SectionSurface
- Page Schema validation
- Registry Manifest generat din TypeScript

### Regula critică

AI-ul nu scrie JSX direct.

AI-ul produce doar Page Schema.

Page Schema este validată înainte să ajungă în canvas.

---

## 3. Module secundare Builder

### GrapesJS

Rol:
- HTML templates
- email templates
- simple landing templates

GrapesJS nu este core-ul EMOVEL Builder.

### Editor.js

Rol:
- block-based content editing
- rich content sections
- editorial content blocks

---

## 4. Agent Developer Layer

### OpenHands

Rol:
- agent care poate lucra cu cod
- terminal
- fișiere
- repo
- refactor
- verificare
- execuție controlată

OpenHands este tratat ca agent layer, nu ca UI Builder.

---

## 5. AI Model Layer

### Local

- Ollama
- Llama
- Mistral
- Qwen

### Cloud opțional

- OpenRouter

Regulă:
OpenRouter este gateway cloud opțional, nu componentă open-source core.

---

## 6. 3D Layer

### Core 3D

- Three.js
- React Three Fiber
- Drei

### Opțional

- Spline Runtime

Regulă:
Spline Runtime este opțional pentru scene/exporturi compatibile, nu dependență core.

---

## 7. Backend & Services

Stack posibil:

- Payload CMS
- Directus
- Node / TypeScript APIs
- self-hosted services unde este posibil

Backend-ul trebuie să rămână modular și fără vendor lock-in structural.

---

## 8. Mobile Native

Stack posibil:

- Expo + React Native
- CapacitorJS
- Flutter doar dacă produsul cere aplicație mobilă dedicată

---

## 9. Flux Ultra Builder

1. Prompt
2. EMOVEL Orchestrator
3. Page Schema
4. Validation Gate
5. Puck Visual Builder
6. EMOVEL Component Registry
7. Asset Validation
8. Export
9. Deploy
10. Publicare web / mobile

---

## 10. Ce este exclus din core

- Cursor
- platforme închise ca sursă de adevăr
- AI cu UI blocat ca dependență principală
- generare UI liberă fără Registry
- placeholder assets
- export fără validare
- vendor lock-in structural

---

## 11. Regula finală

EMOVEL Ultra Builder trebuie să fie:

- AI-native
- registry-driven
- open-source-first
- premium
- validat
- exportabil
- scalabil
- fără improvizație vizuală
