# MailCraft — Custom Marketing Email

A Mailchimp-inspired campaign email builder built with React + Vite. Create, manage, and send custom marketing emails with a clean dashboard UI.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 8 | Build tool & dev server |
| Redux Toolkit | Global state management |
| react-redux | Redux bindings for React |
| react-router-dom 7 | Client-side routing |
| react-hook-form 7 | Form state management |
| react-icons | Icon library (Heroicons, Flat Color) |
| TinyMCE + @tinymce/tinymce-react | Rich text editor |

---

## Getting Started

> Make sure the backend server is running first — see `Marketing_Email_Backend/README.md`

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`

---

## Pages & Routes

| Route | Description |
|---|---|
| `/` | Redirects to `/campaigns` |
| `/campaigns` | Campaign dashboard (list view) |
| `/campaigns/create` | Create new campaign |
| `/campaigns/edit/:id` | Edit existing draft campaign |

---

## Features

### Campaign Dashboard (`/campaigns`)
- Fetches campaigns from the backend API on mount
- Stats cards — Total, Sent, and Draft counts
- Search by campaign name or subject
- Filter by status (All / Draft / Sent)
- Sortable columns — click any header to sort asc/desc
- **Draft campaigns** — Edit (pencil) + Delete buttons
- **Sent campaigns** — Copy (duplicate) button; delete disabled
- Inline delete confirmation row
- Loading and error states

### Create / Edit / Copy Form (`/campaigns/create`)

**Step 1 — Campaign Details**
- Campaign Name (required)
- Email Subject (required)
- CC Emails — tag input, validates email format, add with Enter or comma

**Step 2 — Recipients**
- **Upload Excel** — `.xlsx / .xls / .csv` file upload area
- **Enter Manually** — tag email input with format validation

**Step 3 — Email Content**
- TinyMCE rich text editor — bold, italic, headings, lists, links, colours, alignment, source view, fullscreen
- Image support — upload from device or insert by URL
- Character count (strips HTML tags)
- Design Builder tab — placeholder (coming soon)

**Sidebar**
- Live summary panel showing current field values

**Actions**
- Send Campaign — validates all required fields, saves with `status: 1`
- Save as Draft — bypasses validation, saves with `status: 0`
- Cancel — resets form and returns to dashboard
- Success snackbar with auto-redirect

### Validation (`validate.js`)
- Runs on Send only — draft bypasses all checks
- Required: Name, Subject, Content (strips HTML before checking)
- Recipients: `emailType 2` requires at least one manual email; `emailType 0` requires at least one customer selected
- Email format validated with `/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i`
- Inline field errors shown below each input
- Errors clear automatically as you type / add tags

---

## Project Structure

```
src/
├── store/
│   ├── index.js                          # Redux store (configureStore)
│   └── campaignSlice.js                  # Slice — reducers + async thunks
├── services/
│   └── campaignApi.js                    # Fetch wrapper for backend API
├── components/
│   ├── layout/
│   │   ├── Header.jsx / Header.css
│   │   └── Layout.jsx / Layout.css
│   ├── inputs/
│   │   ├── textEditor.jsx                # TinyMCE rich text editor (Cloud)
│   │   └── TextEditor.css
│   └── campaignEmail/
│       ├── emailList.component.jsx       # Dashboard table
│       ├── emailRow.component.jsx        # Single campaign row
│       ├── createEmail.component.jsx     # Create/edit/copy form page
│       ├── customersEmailOption.component.jsx  # Recipient selector
│       ├── TagInput.jsx                  # Reusable tag/chip email input
│       ├── validate.js                   # Campaign form validation logic
│       └── CampaignEmail.css             # All campaign styles
├── containers/
│   └── campaignEmail/
│       ├── EmailListContainer.jsx
│       └── campaignEmail.container.jsx
└── App.jsx                               # Router setup
```

---

## Redux State Shape (`state.campaign`)

```js
{
  campaigns: [],              // Loaded from API
  campaignDetails: null,      // Campaign loaded for edit/copy
  isToEdit: false,
  isToCopy: false,
  isSaveNotificationEmailAsDraft: false,
  isToDelete: false,
  isToDeleteEmailId: null,
  showSnackBar: false,
  showDraftSnackBar: false,
  loading: false,             // API fetch in progress
  error: null,                // API error message
  template_content: '',
  templateCreated: null,
  templateValues: null,
  droppedElements: null,
}
```

## Async Thunks (`store/campaignSlice.js`)

| Thunk | Method | Endpoint |
|---|---|---|
| `fetchCampaigns` | GET | `/api/campaigns` |
| `createCampaign` | POST | `/api/campaigns` |
| `updateCampaignAsync` | PUT | `/api/campaigns/:id` |
| `deleteCampaign` | DELETE | `/api/campaigns/:id` |

---

## Step-by-Step Build Process

### Step 1 — Initialise the project
Scaffolded with Vite using the React template:
```bash
npm create vite@latest Marketing_Email_UI -- --template react
npm install
```

### Step 2 — Install dependencies
```bash
npm install react-router-dom react-hook-form
npm install @tinymce/tinymce-react tinymce
npm install react-icons
npm install @reduxjs/toolkit react-redux
```

### Step 3 — Set up routing (`App.jsx`)
- Wrapped the app with `BrowserRouter`
- Defined four routes: `/`, `/campaigns`, `/campaigns/create`, `/campaigns/edit/:id`
- Added `Layout` component wrapping all routes for shared header/nav

### Step 4 — Build the campaign dashboard (`emailList.component.jsx`)
- Rendered campaigns in a sortable table
- Added search (by name/subject) and status filter
- Added stat cards — Total, Sent, Draft counts
- Each row rendered by `emailRow.component.jsx`

### Step 5 — Build the create/edit form (`createEmail.component.jsx`)
- Used `react-hook-form` with `FormProvider` for shared form context
- Three-section layout: Campaign Details, Recipients, Email Content
- Live summary sidebar using `watch()`
- Send and Save as Draft actions
- Edit/copy mode hydrates form from existing campaign data via `reset()`
- TinyMCE given a `key` prop tied to `campaignDetails?.id` so it remounts with correct content on edit/copy

### Step 6 — Build recipient selector (`customersEmailOption.component.jsx`)
- Two modes: Excel file upload and manual email entry
- Manual entry uses `TagInput` — reusable chip input with email format validation
- Mode controlled by `emailType` radio field
- `clearErrors` called on tag add so form errors clear as user types

### Step 7 — Add TinyMCE rich text editor (`textEditor.jsx`)
- Integrated `@tinymce/tinymce-react` as a controlled component
- Plugins: lists, link, image, code, fullscreen, table, media, and more
- Image upload handler converts files to base64
- Initially self-hosted from `public/tinymce/`, later switched to TinyMCE Cloud
- API key stored in `.env` as `VITE_TINYMCE_API_KEY`

### Step 8 — Add icons with react-icons
- Replaced all emoji icons with `react-icons` (Heroicons + Flat Color)
- Edit → `HiOutlinePencil`, Copy → `HiOutlineDocumentDuplicate`, Delete → `HiOutlineTrash`
- Save → `HiOutlineSave`, Back → `HiOutlineArrowLeft`, Design → `FcTemplate`
- Per-button hover colours added to CSS (blue/green/red)

### Step 9 — Migrate state to Redux Toolkit
- Replaced React Context + `useReducer` with Redux Toolkit `createSlice`
- Created `src/store/campaignSlice.js` with all reducers and action creators
- Created `src/store/index.js` with `configureStore`
- Wrapped app with `<Provider store={store}>` in `main.jsx`
- Removed `CampaignProvider` from `App.jsx`
- Updated all components from `useCampaign()` to `useDispatch` + `useSelector`

### Step 10 — Connect to the backend API
- Created `src/services/campaignApi.js` — a `fetch` wrapper with error handling
- Replaced sync Redux reducers with `createAsyncThunk` actions:
  - `fetchCampaigns` — GET all campaigns on mount
  - `createCampaign` — POST new campaign
  - `updateCampaignAsync` — PUT update existing campaign
  - `deleteCampaign` — DELETE campaign
- Added `loading` and `error` state fields
- `emailList` dispatches `fetchCampaigns()` on mount and shows loading/error states
- `campaigns` state starts empty and is populated from the API
- `createEmail` dispatches `createCampaign` or `updateCampaignAsync` on form submit
- `emailRow` dispatches `deleteCampaign` on confirm delete
- Thunks explicitly map PascalCase form fields (`Name`, `Subject`, `Content`, `CcEmails`) to API-expected casing

### Step 11 — Frontend validation (`validate.js`)
- Extracted all validation logic into `campaignEmailValidate(values)` in `validate.js`
- Returns `{ values, errors }` — errors is an object keyed by field name
- `onSubmit` calls `campaignEmailValidate`, sets errors via `setError`, and returns early if invalid
- Save as Draft uses `type="button"` and calls `getValues()` directly — skips all validation
- `dispatchSave` helper shared between send and draft to avoid duplication
- Content error clears on TinyMCE `onChange`; recipient errors clear on tag add

---

## Roadmap

- [x] Campaign dashboard (list, search, filter, sort)
- [x] Create / Edit / Copy / Draft campaign flows
- [x] Recipient selector (Excel upload, manual entry)
- [x] TinyMCE rich text editor with image upload
- [x] Redux Toolkit state management
- [x] API integration (backend connected)
- [x] Frontend validation with inline field errors
- [ ] Excel file parsing — extract emails from uploaded file
- [ ] Drag-and-drop email template builder
- [ ] Email preview overlay
- [ ] Authentication
