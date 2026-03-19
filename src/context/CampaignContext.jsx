import { createContext, useContext, useReducer } from 'react';
import { fakeCampaigns } from '../data/fakeData';

const initialState = {
  campaigns: fakeCampaigns,
  campaignDetails: null,
  isToEdit: false,
  isToCopy: false,
  isToDelete: false,
  isToDeleteEmailId: null,
  showSnackBar: false,
  showFailSnackBar: false,
  showDraftSnackBar: false,
  template_content: '',
  templateCreated: null,
  templateValues: null,
  droppedElements: null,
  noTemplateValues: false,
};

function campaignReducer(state, action) {
  switch (action.type) {
    case 'SET_CAMPAIGNS':
      return { ...state, campaigns: action.payload };

    case 'EDIT_CAMPAIGN': {
      const campaign = state.campaigns.find((c) => c.id === action.payload);
      return { ...state, campaignDetails: campaign, isToEdit: true, isToCopy: false };
    }

    case 'COPY_CAMPAIGN': {
      const campaign = state.campaigns.find((c) => c.id === action.payload);
      return { ...state, campaignDetails: { ...campaign, id: null }, isToCopy: true, isToEdit: false };
    }

    case 'SAVE_CAMPAIGN': {
      const newCampaign = {
        ...action.payload,
        id: Date.now(),
        created: new Date().toISOString(),
        status: action.payload.status ?? 1,
      };
      return {
        ...state,
        campaigns: [newCampaign, ...state.campaigns],
        showSnackBar: true,
        campaignDetails: null,
        isToEdit: false,
        isToCopy: false,
      };
    }

    case 'SAVE_DRAFT': {
      const draftCampaign = {
        ...action.payload,
        id: Date.now(),
        created: new Date().toISOString(),
        status: 0,
      };
      return {
        ...state,
        campaigns: [draftCampaign, ...state.campaigns],
        showDraftSnackBar: true,
        campaignDetails: null,
        isToEdit: false,
        isToCopy: false,
      };
    }

    case 'UPDATE_CAMPAIGN': {
      const updated = state.campaigns.map((c) =>
        c.id === action.payload.id ? { ...c, ...action.payload } : c
      );
      return {
        ...state,
        campaigns: updated,
        showSnackBar: true,
        campaignDetails: null,
        isToEdit: false,
      };
    }

    case 'WARN_DELETE':
      return { ...state, isToDelete: true, isToDeleteEmailId: action.payload };

    case 'CANCEL_DELETE':
      return { ...state, isToDelete: false, isToDeleteEmailId: null };

    case 'REMOVE_CAMPAIGN':
      return {
        ...state,
        campaigns: state.campaigns.filter((c) => c.id !== action.payload),
        isToDelete: false,
        isToDeleteEmailId: null,
      };

    case 'CLOSE_SNACKBAR':
      return { ...state, showSnackBar: false, showFailSnackBar: false, showDraftSnackBar: false };

    case 'RESET_FORM':
      return {
        ...state,
        campaignDetails: null,
        isToEdit: false,
        isToCopy: false,
        template_content: '',
        templateCreated: null,
        templateValues: null,
        droppedElements: null,
      };

    default:
      return state;
  }
}

const CampaignContext = createContext(null);

export function CampaignProvider({ children }) {
  const [state, dispatch] = useReducer(campaignReducer, initialState);
  return (
    <CampaignContext.Provider value={{ state, dispatch }}>
      {children}
    </CampaignContext.Provider>
  );
}

export function useCampaign() {
  const ctx = useContext(CampaignContext);
  if (!ctx) throw new Error('useCampaign must be used inside CampaignProvider');
  return ctx;
}
