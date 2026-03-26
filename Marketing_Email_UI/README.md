# MailCraft — Custom Marketing Email

A Mailchimp-inspired campaign email builder built with React + Vite. Create, manage, and send custom marketing emails with a clean dashboard UI.

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 8 | Build tool & dev server |
| react-router-dom | 7 | Client-side routing |
| react-hook-form | 7 | Form state management |
| TinyMCE + @tinymce/tinymce-react | 7 | Rich text editor with image upload |
| React Context + useReducer | — | App state (no Redux) |

---

## Getting Started

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
- Stats cards — Total, Sent, and Draft counts
- Search by campaign name or subject
- Filter by status (All / Draft / Sent)
- Sortable columns — click any header to sort asc/desc
- **Draft campaigns** — Edit (pencil) + Delete buttons
- **Sent campaigns** — Copy (duplicate) button; delete disabled
- Inline delete confirmation row
- Empty state with call-to-action

### Create / Edit Form (`/campaigns/create`)

**Step 1 — Campaign Details**
- Campaign Name (required)
- Email Subject (required)
- CC Emails — tag input, validates format, add with Enter or comma

**Step 2 — Recipients** (3-mode toggle)
- **From Customers** — searchable multi-select dropdown
- **Upload Excel** — `.xlsx / .xls / .csv` file upload area
- **Enter Manually** — tag email input

**Step 3 — Email Content**
- TinyMCE rich text editor — bold, italic, headings, lists, links, text/background colour, alignment, blockquote, HR, source view, fullscreen
- Image support — upload from device (embedded as base64) or insert by URL, with caption
- Character count (strips HTML tags)
- Design Builder tab — placeholder for the drag-and-drop template builder (coming soon)

**Sidebar**
- Live summary panel showing current field values

**Actions**
- Send Campaign — saves with `status: 1` (sent)
- Save as Draft — saves with `status: 0` (draft)
- Cancel — resets form and returns to dashboard
- Success snackbar with auto-redirect

---

## Project Structure

```
src/
├── context/
│   ├── campaignContextInstance.js        # React context object
│   ├── CampaignContext.jsx               # CampaignProvider component + reducer
│   └── useCampaign.js                    # useCampaign() hook
├── data/
│   └── fakeData.js                       # Fake campaigns + customers (swap for API later)
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
│       ├── createEmail.component.jsx     # Create/edit form page
│       ├── customersEmailOption.component.jsx  # Recipient selector (3 modes)
│       ├── TagInput.jsx                  # Reusable tag/chip email input
│       └── CampaignEmail.css             # All campaign styles
├── containers/
│   └── campaignEmail/
│       ├── EmailListContainer.jsx
│       └── campaignEmail.container.jsx
└── App.jsx                               # Router + provider setup
```

---

## State Shape (`CampaignContext`)

```js
{
  campaigns: [],              // All campaigns (fake data or API)
  campaignDetails: null,      // Campaign loaded for edit/copy
  isToEdit: false,
  isToCopy: false,
  isToDelete: false,
  isToDeleteEmailId: null,
  showSnackBar: false,        // Send success notification
  showDraftSnackBar: false,   // Draft saved notification
  template_content: '',       // Saved HTML from design builder
  templateCreated: null,      // Timestamp of saved design
  templateValues: null,       // Widget array (drag-and-drop)
  droppedElements: null,
}
```

---

## Roadmap

- [x] Campaign dashboard (list, search, filter, sort)
- [x] Create / Edit / Copy / Draft campaign flows
- [x] Recipient selector (customers, Excel upload, manual entry)
- [x] TinyMCE rich text editor with image upload
- [ ] Drag-and-drop email template builder
- [ ] API integration (replace fake data)
- [ ] Email preview overlay
- [ ] Social icon widget support
