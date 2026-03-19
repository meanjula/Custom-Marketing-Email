import { useReducer } from 'react';
import { fakeCampaigns } from '../data/fakeData';
import { CampaignContext } from './campaignContextInstance';

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
      const { Name, Subject, ...rest } = action.payload;
      const newCampaign = {
        ...rest,
        name: Name || '',
        subject: Subject || '',
        id: Date.now(),
        created: new Date().toISOString(),
        status: 1,
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
      const { Name, Subject, ...rest } = action.payload;
      const draftCampaign = {
        ...rest,
        name: Name || '',
        subject: Subject || '',
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
      const { Name, Subject, ...rest } = action.payload;
      const updated = state.campaigns.map((c) =>
        c.id === rest.id
          ? { ...c, ...rest, name: Name || c.name, subject: Subject || c.subject }
          : c
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

export function CampaignProvider({ children }) {
  const [state, dispatch] = useReducer(campaignReducer, initialState);
  return (
    <CampaignContext.Provider value={{ state, dispatch }}>
      {children}
    </CampaignContext.Provider>
  );
}
