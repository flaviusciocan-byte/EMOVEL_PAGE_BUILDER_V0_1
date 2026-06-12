# EMOVEL Component Registry v1.1 — AI-Native Builder Spec

Status: SPEC OFICIAL. Înlocuiește Registry v1.

Scop: registrul devine sursa unică de adevăr pentru EMOVEL Builder AI-Native.

Principiu absolut: zero placeholder, zero generic, zero improvizație.

---

## 0. Shared Layer

Declarat o singură dată, la nivel de registru. Nicio componentă nu redeclară aceste props.

| Prop | Valori | Default | Regulă |
|---|---|---|---|
| universe | noir / ivory / nordic / terra / mono | moștenit din pagină | Componenta NU poate suprascrie paleta — doar tokens derivați prin deriveTheme() |
| surface | base / elevated / inverted / cinematic | base | Implementat prin SectionSurface existent |
| motion | none / subtle / cinematic | subtle | Builder canvas = static, export = full motion |
| spacing | compact / standard / generous | standard | Mapat pe scala de spacing din token system |
| anchorId | string | auto-generat | Navigație internă și deep-linking |
| aiLock | string[] | [] | Props pe care AI-ul NU are voie să le modifice |

### Empty-state policy global

O componentă fără asset real nu randează placeholder.

În Builder:
- slot vizibil marcat MISSING ASSET
- componenta blocată la export

La export:
- build error explicit
- niciodată degradare silențioasă

---

## 1. Components 01–10

01. HeroSection  
02. TrustStrip  
03. FeatureGrid  
04. ProductShowcase  
05. PricingSection  
06. FAQSection  
07. CTASection  
08. DashboardPreview  
09. WorkflowTimeline  
10. ThreeDShowcase  

### Mapare pe cod existent

- HeroSection adoptă Hero existent.
- FeatureGrid folosește CardSection ca implementare.
- surface folosește SectionSurface existent.

---

## 2. Components 11–16

11. NavigationBar  
12. FooterSection  
13. TestimonialSection  
14. EditorialSection  
15. GalleryShowcase  
16. LeadCapture  

---

## 3. AI-Native Layer

### Registry Manifest

Fișier viitor:
registry.manifest.json

Regulă:
- generat din TypeScript
- niciodată scris manual
- TypeScript este sursa de adevăr

### AI Contract

Props pot fi:

- generative: AI-ul poate genera sau rescrie
- locked: AI-ul nu atinge
- asset: AI-ul selectează doar asset-uri reale din bibliotecă

### Composer Pipeline

Intent
→ Page Schema
→ Validation Gate
→ Render

AI-ul nu scrie JSX direct. AI-ul produce doar Page Schema validată.

---

## 4. Validation Gate

verify-export.mts trebuie extins cu:

- empty-state policy respectată
- zero placeholder în export
- toate culorile provin din tokens
- Imperial Cold Gold exact #D4AF37
- contrast WCAG AAA prin deriveTheme()
- asset-uri reale validate
- aiLock respectat

---

## 5. Schema Versioning

Fiecare Page Schema salvată poartă registryVersion.

Migrările între versiuni sunt explicite.

Niciodată breaking silent.

---

## 6. Ordine oficială de execuție

1. Shared Layer + SectionSurface integration
2. Maparea componentelor 01–10 pe componente existente
3. NavigationBar + FooterSection
4. Empty-state policy + verify-export extension
5. Registry Manifest generat din TypeScript
6. Components 13–16
7. Composer: Intent → Page Schema → Validation Gate → Render

Composer nu blochează prima vânzare.

Pașii 1–4 servesc direct landing-ul Cinematic Codex.

---

## 7. Visual Reference

Referință vizuală oficială:

EMOVEL Ultra Builder UI v1

Direcție:
- dark luxury
- black / charcoal dominant
- ivory typography
- controlled gold accents
- electric blue only as micro-signal
- left registry panel
- center cinematic canvas
- right inspector panel
- bottom AI intent / validation strip
- no generic SaaS look
- no Canva-like UI
- no playful colors
- no placeholders

---

## 8. Technical Principle

EMOVEL Ultra Builder nu este un builder generic.

AI-ul compune din componente aprobate.

Registry-ul este sursa de adevăr.

Exportul este validat.

Asset-urile lipsă blochează exportul.

Designul rămâne premium, controlat și imposibil de degradat accidental.
