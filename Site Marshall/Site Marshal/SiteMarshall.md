# Site Marshall

## Product Definition

Site Marshall is a safety intelligence platform engineered for the construction industry. It addresses a critical, unsolved problem: the language barrier on multi-ethnic construction sites, where workers operating heavy machinery often cannot read, speak, or comprehend the language in which safety manuals, training materials, and operational protocols are written.

The platform functions as an AI-powered, multilingual training and compliance layer that sits between the worker and the machine. It enables real-time machine identification through computer vision, delivers structured safety training in the worker's native language, enforces mandatory pre-shift inspections digitally, and provides supervisory analytics for site managers.

The product is designed as a mobile-first Progressive Web Application, built to operate in the harsh, low-connectivity environments typical of construction sites. Every interface element is engineered for gloved hands, bright sunlight, and single-thumb operation.

---

## Core Intelligence Layer: Marshall AI

All artificial intelligence interactions within Site Marshall are unified under a single entity: **Marshall AI**. This is not a collection of disconnected features but a single, persistent intelligence that manifests across every surface of the application.

Marshall AI is the brand name for the platform's AI subsystem. It appears in the following contexts:

| Context | Manifestation |
|---------|---------------|
| **Voice Interaction** | When a worker holds the Push-to-Talk button, the interface displays "Marshall AI Listening..." and a real-time waveform visualizer. The status badge reads "Marshall AI Active." |
| **Machine Identification** | Marshall AI powers the computer vision pipeline that identifies heavy machinery from camera feed, with confidence scoring and bounded object detection. |
| **Training Chat** | Inside the Academy, the Marshall AI tab provides a Socratic dialogue interface where workers can ask questions about safety procedures and receive contextual, manual-derived responses. |
| **Smart Grading** | Marshall AI evaluates free-form text answers using semantic analysis rather than exact string matching, allowing workers to demonstrate understanding in their own words. |
| **Machine Hub Chat** | The primary AI chat interface on each machine's dedicated page, accessible via both voice and keyboard input, where Marshall AI responds with machine-specific safety guidance. |

Marshall AI is always referred to by its full name. It is never abbreviated, never called "the AI," and never referred to as a chatbot.

---

## Design System: Industrial Minimalism

The visual language of Site Marshall is called **Industrial Minimalism**. It draws from the aesthetics of heavy equipment dashboards, safety signage, and industrial control panels. The system prioritizes extreme legibility, tactile interaction targets, and strict chromatic discipline.

### Color Palette

The palette follows a **60-30-10 distribution rule** enforced across all screens.

| Role | Token | Hex Value | CSS Variable | Usage |
|------|-------|-----------|--------------|-------|
| **Primary Background (60%)** | App Background | `#ECF0F1` | `--color-app-bg` | Page backgrounds, card backgrounds, neutral surfaces |
| **Secondary Surface (30%)** | Matte Indigo | `#2C3E50` | `--color-matte-indigo` | Headers, navigation, primary buttons, text headings |
| **Accent (10%)** | Safety Orange | `#E67E22` | `--color-safety-orange` | Call-to-action buttons, warning badges, progress indicators |
| Structural Neutral | Slate Gray | `#BDC3C7` | `--color-slate-gray` | Borders, placeholder text, secondary labels |
| Structural Neutral | Deep Concrete | `#4F5B66` | `--color-deep-concrete` | Sidebar backgrounds, dark-mode surfaces |
| Structural Neutral | Charcoal | `#34495E` | `--color-charcoal` | Body text, card content |
| Semantic: Success | Sage Green | `#58D68D` | `--color-sage-green` | Completion indicators, online status, passed tests |
| Semantic: Danger | Rust Red | `#C0392B` | `--color-rust-red` | Critical safety alerts, SOS, failed tests, fatal-level sections |
| Semantic: Caution | Industrial Yellow | `#F1C40F` | `--color-ind-yellow` | Gamification badges, medium-risk indicators |
| Semantic: System | Electric Cyan | `#00BFA6` | `--color-electric-cyan` | Computer vision overlays, telemetry data, scanning states |

### Typography

The application uses the system font stack provided by TailwindCSS, defaulting to **Inter** on systems where it is available. All safety-critical text uses `font-black` (900 weight) to ensure maximum readability in bright outdoor conditions.

Monospace typography (`font-mono`) is used exclusively in the Computer Vision (YOLO) simulation overlay, reinforcing the technical, data-dense appearance of the scanning interface.

### Spacing and Interaction Targets

All interactive elements maintain a minimum touch target of **44 x 44 pixels** (per WCAG 2.1 AA guidelines). Primary action buttons use a minimum height of **56 pixels** (`h-14`) with `rounded-2xl` corners. The Push-to-Talk button uses an **80 x 80 pixel** circular target (`w-20 h-20`).

---

## Technology Stack

### Runtime and Bundling

| Component | Technology | Version |
|-----------|-----------|---------|
| Language | JavaScript (JSX) | ES2022 |
| Framework | React | 19.2.0 |
| Bundler | Vite | 7.3.1 |
| Module System | ES Modules | Native |

### Styling and Layout

| Component | Technology | Version |
|-----------|-----------|---------|
| CSS Framework | TailwindCSS | 4.2.0 |
| TailwindCSS Vite Plugin | @tailwindcss/vite | 4.2.0 |
| PostCSS | postcss | 8.5.6 |
| Autoprefixer | autoprefixer | 10.4.24 |

### Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| `react-router-dom` | 7.13.0 | Client-side routing with nested layouts and parameterized routes |
| `framer-motion` | 12.34.3 | Physics-based animations, gesture handling, AnimatePresence transitions |
| `lucide-react` | 0.575.0 | Icon system (250+ icons used across all screens) |
| `country-flag-icons` | 1.6.13 | ISO 3166-1 alpha-2 country flag SVGs for the language selector |

### Development Tooling

| Tool | Version | Purpose |
|------|---------|---------|
| ESLint | 9.39.1 | Static analysis and code quality |
| eslint-plugin-react-hooks | 7.0.1 | React Hooks linting rules |
| eslint-plugin-react-refresh | 0.4.24 | Fast Refresh boundary validation |
| @vitejs/plugin-react | 5.1.1 | React JSX transform and Fast Refresh |

---

## Project Architecture

### Directory Structure

```
Site Marshal/
  index.html                          Application entry point (single-page app shell)
  package.json                        Dependency manifest and script definitions
  vite.config.js                      Vite bundler configuration
  eslint.config.js                    ESLint rule definitions
  postcss.config.js                   PostCSS plugin chain
  SiteMarshall.md                     This document
  src/
    main.jsx                          React DOM root mount point
    App.jsx                           Top-level route definitions and provider wrappers
    App.css                           Global utility classes (3D transforms, scrollbar hiding, safe-area padding)
    index.css                         TailwindCSS import and design token definitions (@theme block)
    assets/
      react.svg                       Default Vite asset (unused in production)
    context/
      AppContext.jsx                   Global application state (language, worker ID, active machine, sidebar, translations)
    data/
      mockData.js                     Structured mock data for machines, units, sections, learn cards, languages, and worker registry
    components/
      EmergencySOS.jsx                Emergency SOS component (currently disabled, retained for future integration)
      EnvironmentalWidget.jsx         Environmental hazard monitoring grid (temperature, noise, wind, UV)
      OfflineIndicator.jsx            Connectivity status badge (online/offline)
      ProtectedRoute.jsx              Authentication route guard (redirects to login if no worker ID)
      Layout/
        Header.jsx                    Top navigation bar with branding, offline indicator, and worker ID badge
        MainLayout.jsx                Root layout wrapper (Header + Sidebar + Outlet)
        Sidebar.jsx                   Fleet Drawer with machine list, progress bars, gamification badges
      UI/
        Keypad.jsx                    Numeric input keypad for Worker ID entry
    screens/
      LoginHub.jsx                    Entry screen: Worker ID input + Language selection dropdown
      CommandDashboard.jsx            Dual-action hub: Identify Machine (camera) + Push-to-Speak (Marshall AI)
      YoloSimulation.jsx             Computer Vision scanning simulation with telemetry overlays and proximity alert
      MachineHub.jsx                  Machine-specific AI chat with Push-to-Talk, keyboard input, and environmental widget
      Academy.jsx                     Structured training: collapsible Units, Sections, 4 study modes
      PreShiftChecklist.jsx           Mandatory pre-operation inspection with machine-type-specific items
      SupervisorDashboard.jsx         Analytics: KPI cards, per-worker compliance tracker, fleet heatmap, language risk matrix
      Settings.jsx                    User preferences and configuration toggles
```

---

## File Reference

### Entry and Configuration

#### `main.jsx`
The React DOM root mount point. Renders the top-level `<App />` component into the `#root` element defined in `index.html`. Imports `index.css` for TailwindCSS initialization and `App.css` for global utility classes.

#### `App.jsx`
Defines the application's route tree using `react-router-dom`. Wraps all routes in the `AppProvider` context and `BrowserRouter`. All authenticated routes are wrapped in `<ProtectedRoute>`, which redirects unauthenticated users to the login screen. The `<MainLayout>` component provides the persistent Header and Sidebar.

#### `App.css`
Contains global utility CSS classes not expressible through TailwindCSS alone. Includes: `perspective-1000` and `preserve-3d` for 3D flashcard transforms, `backface-hidden` for card flip mechanics, `hide-scrollbar` for horizontal tab scrolling, `safe-area-pb` for iOS safe area insets, and `animate-spin-slow` for the YOLO crosshair rotation.

#### `index.css`
The TailwindCSS configuration file. Imports the framework via `@import "tailwindcss"` and defines all custom color tokens within a `@theme` block. Sets the base body background and text color in a `@layer base` rule. This is the single source of truth for the entire color system.

---

### Context

#### `AppContext.jsx`
The global state provider using React Context. Manages the following state:

| State | Type | Purpose |
|-------|------|---------|
| `workerId` | `string \| null` | The authenticated worker's numeric ID |
| `language` | `string` | Active language code (e.g., `en`, `tr`, `ar`) |
| `activeMachineId` | `string \| null` | Currently selected machine from the fleet |
| `sidebarOpen` | `boolean` | Fleet Drawer visibility toggle |

Also contains the `translations` dictionary mapping language codes to UI string translations for 21 supported languages, and exposes a `t(key)` helper function for runtime localization.

---

### Data

#### `mockData.js`
The structured mock dataset representing the fleet of construction machines. Contains three exported datasets:

**`languages`** -- An array of 21 language objects, each with `code`, `name`, `native` (native script), and `flag` (ISO country code) fields. Used by the language selector dropdown and the global context.

**`machineDB`** -- The fleet of construction machines. Each machine contains:

- **Machine-level fields**: `id`, `model`, `type`, `image` (Unsplash URL), `manualUrl`, `confidence` (CV detection score), `trainingProgress` (0-100).
- **Units**: Named training modules (e.g., "Pre-Operation Safety Checks"). Each unit has `completed` (boolean), `progress` (0-100), and an array of Sections.
- **Sections**: Individual training topics (e.g., "Emergency Shut-Down Procedures"). Each section has `criticality` (`rust-red`, `safety-orange`, or `sage-green`), `completed`, `progress`, `content` (full manual excerpt), `summary` (digestible summary), `qChatContext` (Marshall AI prompt context), and `learnCards` (array of question/answer flashcard pairs).

| Machine | Type | Units | Sections | Topics Covered |
|---------|------|-------|----------|----------------|
| Caterpillar 320 | Excavator | 3 | 8 | Pre-op checks, excavation ops, load handling |
| Komatsu PC210 | Excavator | 3 | 7 | Hydraulic safety, boom/arm ops, environmental awareness |
| Liebherr LTM 11200-9.1 | Mobile Crane | 3 | 8 | Outrigger deployment, wind/weather limits, rigging/lift planning |

**`workerRegistry`** -- An array of worker objects for the Supervisor Dashboard. Each worker contains:

| Field | Type | Purpose |
|-------|------|---------|
| `id` | `string` | Worker ID (e.g., "W-4821") |
| `name` | `string` | Full name |
| `language` | `string` | Language code |
| `assignedMachines` | `string[]` | Machine IDs the worker is assigned to |
| `preShiftCompleted` | `object` | Per-machine pre-shift inspection status (boolean values) |
| `completedSections` | `string[]` | Completed sections in `machineId:sectionId` format |
| `totalSections` | `number` | Total sections across all assigned machines |
| `lastActive` | `string` | Timestamp of last activity |

Currently contains 6 workers across 4 languages (Turkish, Polish, Arabic, Ukrainian, Indonesian, Portuguese).

---

### Components

#### `EmergencySOS.jsx`
An emergency SOS component with a hold-to-trigger mechanism and broadcast overlay. Currently disabled (not rendered in the layout) but retained in the codebase for future integration. When active, it displays a floating button that requires a 2-second hold to trigger, with a conic gradient progress ring and full-screen broadcast alert.

#### `EnvironmentalWidget.jsx`
A 4-column grid displaying simulated real-time environmental data: Temperature, Noise Level (dB), Wind Speed (km/h), and UV Index. Each metric has a defined OSHA threshold. When a value approaches or exceeds its threshold, the tile's border and icon shift to Safety Orange as a visual warning. Integrated into the Machine Hub screen below the hero image.

#### `OfflineIndicator.jsx`
A compact badge component that displays the current connectivity status. Renders a green `Wifi` icon with "Online" text, or an orange `WifiOff` icon with "Offline" text. Integrated into the Header component, visible when a worker is logged in. Validates the platform's claim of edge-native, offline-first architecture.

#### `ProtectedRoute.jsx`
A route guard component. Checks for the presence of a `workerId` in the global context. If no worker ID exists (i.e., the user is not authenticated), the component redirects to the root path (`/`) using React Router's `<Navigate>` component with `replace` to prevent back-button loops.

#### `Layout/Header.jsx`
The persistent top navigation bar. Displays the "Site Marshall" brand name, the `OfflineIndicator` badge, the worker's ID badge (with `UserCircle` icon), and a Home navigation button. Uses `sticky top-0 z-40` positioning to remain visible during scroll. Background is Matte Indigo; text is App Background.

#### `Layout/MainLayout.jsx`
The root layout wrapper rendered at the top of the route tree. Uses `h-screen` with `overflow-hidden` to establish the viewport height constraint that enables proper scrolling in child screens. Composes the `Header` and `Sidebar` components around React Router's `<Outlet>`, which renders the active screen.

#### `Layout/Sidebar.jsx`
The Fleet Drawer, a slide-in navigation panel from the left edge containing the list of assigned machines. Each machine entry displays the model name, type, and a training progress bar with percentage. Below the machine list, an "Earned Certifications" section displays gold badges for any Unit that has been fully completed. The drawer is toggled by the hamburger menu in the Header and closes with a tap on the overlay or the close button.

#### `UI/Keypad.jsx`
A numeric input keypad used on the Login Hub for Worker ID entry. Renders a 3-column grid of buttons (1-9, Delete, 0, Enter) using Framer Motion for press animations. The Delete button uses a `Delete` icon from Lucide. The grid follows a calculator-style layout optimized for single-thumb input.

---

### Screens

#### `LoginHub.jsx`
The entry point of the application. Contains two functional blocks:

1. **Worker ID Input**: A numeric display field paired with the `Keypad` component. The worker enters their assigned numeric ID. Upon pressing Enter, the ID is stored in the global context and the user is routed to the Command Dashboard.
2. **Language Selection**: A full-width dropdown button that opens a scrollable list of 21 supported languages. Each entry renders the corresponding country flag (via `country-flag-icons`) alongside the language name in its native script and the English translation. Selecting a language updates the global context and applies translations immediately.

#### `CommandDashboard.jsx`
The primary control panel after login. Splits the viewport into three sections:

1. **Identify Machine** (top half): A large touch target with a camera icon. Tapping navigates to the YOLO Computer Vision simulation.
2. **Push-to-Speak** (bottom half): A press-and-hold voice input interface. While held, the display reads "Marshall AI Listening..." with a waveform visualizer animating in real-time. A badge in the top-right corner reads "Marshall AI Active." Releasing the button simulates a voice query submission.
3. **Supervisor Analytics** (bottom bar): A navigation button leading to the Supervisor Dashboard.

#### `YoloSimulation.jsx`
A realistic computer vision detection simulation styled after actual YOLOv8 object detection output. The interface deliberately avoids sci-fi aesthetics in favor of the clean, utilitarian look of real machine learning inference tools. Features:

- **Camera feed**: A full-bleed construction site photograph with subtle brightness and saturation adjustments, simulating a live camera input. A radial vignette provides natural depth.
- **Status bar**: A minimal top bar showing detection state (pulsing cyan dot during detection, solid green when complete), model version (`MARSHALL CV v3.1`), frame count, and frame rate.
- **Primary bounding box**: A solid 2-pixel cyan border around the detected excavator with a filled label tag showing `excavator 94%` in the standard YOLO format (class name + confidence percentage, dark text on colored background).
- **Multi-class secondary detections**: Progressive appearance of additional detected objects (person, hardhat, cone, truck), each with its own color-coded bounding box and label tag, simulating real multi-class detection output.
- **Scanning sweep**: A subtle white horizontal line sweeps vertically during the detection phase, disappearing once detection completes.
- **Model metadata**: Bottom-left overlay showing inference parameters (`yolov8x-construction`, `conf_threshold: 0.50`, `nms_iou: 0.45`, `classes: 12`).
- **Proximity alert**: An understated warning overlay displaying "person detected in swing radius -- 2.3m" with measured typography when a human is detected near the machine.
- **Results panel**: A clean dark panel that slides up from the bottom, listing matched machines with thumbnail images, model names, types, confidence bars, and percentage scores. Tapping a match navigates to the Machine Hub.

#### `MachineHub.jsx`
The dedicated AI interaction page for a specific machine. Composed of four layers:

1. **Header**: Back button, centered "MARSHALL AI" label, and two action buttons side by side: "PRE-SHIFT" (navigates to checklist) and "THE ACADEMY" (navigates to training).
2. **Hero Image**: A parallax background image of the machine with a gradient fade and animated split-text rendering of the machine model name.
3. **Environmental Widget**: A 4-tile grid displaying Temperature, Noise Level, Wind Speed, and UV Index with threshold warnings.
4. **Chat Interface**: A scrollable conversation thread. Empty state shows a Microphone icon with the text "I am Marshall AI. Press and hold the microphone, or open the keyboard, to ask me about this machine." Chat bubbles distinguish between user messages (dark, right-aligned) and Marshall AI responses (white, left-aligned, bordered).
5. **Bottom Controls**: A keyboard toggle (bottom-left) that slides up a text input field, and a large Push-to-Talk button (bottom-right) with a pulsing scale animation when active.

#### `Academy.jsx`
The structured training environment. Operates in two views:

**Overview View**: Displays a list of Units as collapsible accordion headers. Each Unit shows its title, a completion checkmark (if 100%), and a progress bar. Tapping a Unit toggles its expansion, revealing its child Sections. Each Section card displays:
- The section ID and title
- A criticality badge ("CRITICAL" in red, "WARNING" in orange, "STANDARD" in green)
- A progress percentage
- A content preview (2 lines, clamped)
- A left-side colored border matching its criticality level

**Study View**: Activated by tapping a Section. Provides four tabbed study modes:
- **Summary**: A formatted card with the section's quick summary and full manual excerpt.
- **Marshall AI**: A Socratic dialogue interface where the worker can ask questions. Marshall AI responds with contextual information derived from the section's `qChatContext` field, then prompts the worker with a follow-up question.
- **Learn**: A flashcard deck with 3D flip animation (using CSS `preserve-3d` and `backface-visibility`). Front shows the question, back shows the answer. A "Next Card" button advances through the deck.
- **Test**: A Smart Grading interface where Marshall AI poses a question and the worker types a free-form response. Marshall AI evaluates semantic meaning (simulated) and returns a pass/fail result with animated feedback.

#### `PreShiftChecklist.jsx`
A mandatory pre-operation inspection screen. Accessed via the "PRE-SHIFT" button on the Machine Hub. Displays a list of inspection items specific to the machine's type:

- **Excavator items**: Engine oil, hydraulic fluid, coolant levels, tracks and undercarriage, mirrors and cameras, fire extinguisher, seat belt, horn and backup alarm, hydraulic leaks, PPE.
- **Mobile Crane items**: Outrigger pads and timber mats, load chart, wind speed, overhead power lines, rigging and slings, boom and jib, anti-two-block device, ground conditions, fire extinguisher, PPE.

Each item is a large toggle button. Items are categorized as either critical (red circle, "CRITICAL -- MANDATORY" label) or standard (gray circle). A progress bar and count update in real-time. A warning banner displays when critical items remain unchecked. The submit button is disabled until all items are verified. Upon completion, the worker is routed to the Machine Hub.

#### `SupervisorDashboard.jsx`
An analytics dashboard for site supervisors and safety managers. Data is driven by the `workerRegistry` and `machineDB` datasets. Contains four sections:

1. **KPI Cards**: Three metric tiles showing total Active Workers, Fleet Training Average (computed from machine data), and Languages Represented (computed from worker data).
2. **Worker Compliance Tracker**: An expandable accordion list of every registered worker. Each row displays the worker's name, ID, language, and overall training completion percentage. Expanding a worker reveals:
   - **Pre-Shift Inspection Status**: Per-machine badges showing whether each assigned machine's pre-shift checklist has been signed off (green checkmark or red cross).
   - **Completed Sections**: A line-by-line list of every training section the worker has completed, with the section title and parent machine name.
   - **Last Active**: Timestamp of the worker's most recent activity.
3. **Fleet Completion Heatmap**: A vertical list of all machines with animated progress bars, color-coded by completion percentage (green above 70%, orange 40-70%, red below 40%).
4. **Language Risk Matrix**: A table cross-referencing languages against worker count, average training completion, and a computed risk level (critical, high, medium, low) with color-coded badges. Risk levels are computed dynamically from worker data rather than hardcoded.

#### `Settings.jsx`
A preferences screen with toggle controls for application behavior. Accessible from the Sidebar's "Settings and Profile" button. Contains mock toggles for notification preferences, language settings, and display options.

---

## Supported Languages

Site Marshall supports 21 languages, each with a mapped country flag for the language selection dropdown:

| Language | Native Name | Country Code |
|----------|-------------|-------------|
| English | English | GB |
| Turkish | Turkce | TR |
| Arabic | (Arabic script) | SA |
| Polish | Polski | PL |
| Romanian | Romana | RO |
| Portuguese | Portugues | BR |
| Spanish | Espanol | ES |
| French | Francais | FR |
| German | Deutsch | DE |
| Italian | Italiano | IT |
| Dutch | Nederlands | NL |
| Greek | (Greek script) | GR |
| Hungarian | Magyar | HU |
| Czech | Cestina | CZ |
| Bulgarian | (Cyrillic script) | BG |
| Ukrainian | (Cyrillic script) | UA |
| Serbian | (Cyrillic script) | RS |
| Hindi | (Devanagari script) | IN |
| Bengali | (Bengali script) | BD |
| Urdu | (Arabic script) | PK |
| Indonesian | Bahasa Indonesia | ID |

---

## Route Map

| Path | Screen | Auth Required | Description |
|------|--------|---------------|-------------|
| `/` | LoginHub | No | Worker ID entry and language selection |
| `/dashboard` | CommandDashboard | Yes | Identify Machine and Push-to-Speak |
| `/identify` | YoloSimulation | Yes | Computer Vision machine scanner |
| `/machine/:id/checklist` | PreShiftChecklist | Yes | Machine-specific pre-shift inspection |
| `/machine/:id` | MachineHub | Yes | Marshall AI chat and machine details |
| `/machine/:id/academy` | Academy | Yes | Structured training modules |
| `/supervisor` | SupervisorDashboard | Yes | Site-wide analytics and compliance |
| `/settings` | Settings | Yes | User preferences |

---

## Safety Criticality Classification

Training sections are classified into three severity tiers, each mapped to a specific color token and label:

| Tier | Token | Hex | Label | Usage |
|------|-------|-----|-------|-------|
| Fatal | `rust-red` | `#C0392B` | CRITICAL | Procedures where non-compliance directly risks death or permanent injury |
| Hazardous | `safety-orange` | `#E67E22` | WARNING | Procedures where non-compliance risks significant injury or equipment damage |
| Operational | `sage-green` | `#58D68D` | STANDARD | General operational procedures and best practices |

---

## Build and Execution

### Development Server

```bash
npm run dev
```

Starts the Vite development server with Hot Module Replacement. Default port is `5173` (increments if occupied).

### Production Build

```bash
npm run build
```

Produces an optimized production bundle in the `dist/` directory. Output includes a single CSS file and a single JavaScript chunk.

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally for testing.

### Lint

```bash
npm run lint
```

Runs ESLint across the entire source tree.

---

## Regulatory Context

Site Marshall is designed with awareness of the following regulatory frameworks:

- **ISO 12100:2010** -- Safety of machinery: General principles for design, risk assessment, and risk reduction
- **OSHA 1926** -- Safety and Health Regulations for Construction (United States)
- **CDM 2015** -- Construction (Design and Management) Regulations (United Kingdom)
- **ILO Convention 167** -- Safety and Health in Construction Convention

The Pre-Shift Checklist feature directly supports digital compliance with pre-operation inspection requirements mandated by these frameworks. The Supervisor Dashboard provides the audit trail data necessary for regulatory reporting.

---

*Site Marshall is a product prototype. Marshall AI interactions are simulated. No actual machine learning inference, speech recognition, or natural language processing occurs in this frontend build. The architecture is designed to accept these capabilities as backend integrations when deployed to production.*
