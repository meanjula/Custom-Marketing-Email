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
- **Enter Manually** — tag email input

**Step 3 — Email Content**
- TinyMCE rich text editor — bold, italic, headings, lists, links, colours, alignment, source view, fullscreen
- Image support — upload from device or insert by URL
- Character count (strips HTML tags)
- Design Builder tab — placeholder (coming soon)

**Sidebar**
- Live summary panel showing current field values

**Actions**
- Send Campaign — saves with `status: 1`
- Save as Draft — saves with `status: 0`
- Cancel — resets form and returns to dashboard
- Success snackbar with auto-redirect

---

## Project Structure

```
src/
├── store/
│   ├── index.js                          # Redux store (configureStore)
│   └── campaignSlice.js                  # Slice — reducers + async thunks
├── services/
│   └── campaignApi.js                    # Fetch wrapper for backend API
├── data/
│   └── fakeData.js                       # Seed data (customers only, campaigns from API)
├── components/
│   ├── layout/
│   │   ├── Header.jsx / Header.css
│   │   └── Layout.jsx / Layout.css
│   ├── inputs/
│   │   ├── textEditor.jsx                # TinyMCE rich text editor (self-hosted)
│   │   └── TextEditor.css
│   └── campaignEmail/
│       ├── emailList.component.jsx       # Dashboard table
│       ├── emailRow.component.jsx        # Single campaign row
│       ├── createEmail.component.jsx     # Create/edit/copy form page
│       ├── customersEmailOption.component.jsx  # Recipient selector
│       ├── TagInput.jsx                  # Reusable tag/chip email input
│       └── CampaignEmail.css             # All campaign styles
├── containers/
│   └── campaignEmail/
│       ├── EmailListContainer.jsx
│       └── campaignEmail.container.jsx
├── context/                              # Legacy — no longer used
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
  showFailSnackBar: false,
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

## Roadmap

- [x] Campaign dashboard (list, search, filter, sort)
- [x] Create / Edit / Copy / Draft campaign flows
- [x] Recipient selector (Excel upload, manual entry)
- [x] TinyMCE rich text editor with image upload
- [x] Redux Toolkit state management
- [x] API integration (backend connected)
- [ ] Drag-and-drop email template builder
- [ ] Email preview overlay
- [ ] Authentication
