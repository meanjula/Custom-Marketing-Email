import { createSlice } from '@reduxjs/toolkit';
import { fakeCampaigns } from '../data/fakeData';

const initialState = {
  campaigns: fakeCampaigns,
  campaignDetails: null,
  isToEdit: false,
  isToCopy: false,
  isSaveNotificationEmailAsDraft: false,
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

const campaignSlice = createSlice({
  name: 'campaign',
  initialState,
  reducers: {
    setCampaigns(state, action) {
      state.campaigns = action.payload;
    },

    editCampaign(state, action) {
      const campaign = state.campaigns.find((c) => c.id === action.payload);
      state.campaignDetails = campaign ?? null;
      state.isToEdit = true;
      state.isToCopy = false;
    },

    copyCampaign(state, action) {
      const campaign = state.campaigns.find((c) => c.id === action.payload);
      state.campaignDetails = campaign ? { ...campaign, id: null } : null;
      state.isToCopy = true;
      state.isToEdit = false;
    },

    saveCampaignEmailAsDraft(state) {
      state.isSaveNotificationEmailAsDraft = true;
    },

    saveCampaign(state, action) {
      const { Name, Subject, ...rest } = action.payload;
      const isDraft = state.isSaveNotificationEmailAsDraft;
      const newCampaign = {
        ...rest,
        name: Name || '',
        subject: Subject || '',
        id: Date.now(),
        created: new Date().toISOString(),
        status: isDraft ? 0 : 1,
      };
      state.campaigns = [newCampaign, ...state.campaigns];
      state.showSnackBar = !isDraft;
      state.showDraftSnackBar = isDraft;
      state.isSaveNotificationEmailAsDraft = false;
      state.campaignDetails = null;
      state.isToEdit = false;
      state.isToCopy = false;
    },

    updateCampaign(state, action) {
      const { Name, Subject, ...rest } = action.payload;
      const isDraft = state.isSaveNotificationEmailAsDraft;
      state.campaigns = state.campaigns.map((c) =>
        c.id === rest.id
          ? { ...c, ...rest, name: Name || c.name, subject: Subject || c.subject, status: isDraft ? 0 : 1 }
          : c
      );
      state.showSnackBar = !isDraft;
      state.showDraftSnackBar = isDraft;
      state.isSaveNotificationEmailAsDraft = false;
      state.campaignDetails = null;
      state.isToEdit = false;
    },

    warnDelete(state, action) {
      state.isToDelete = true;
      state.isToDeleteEmailId = action.payload;
    },

    cancelDelete(state) {
      state.isToDelete = false;
      state.isToDeleteEmailId = null;
    },

    removeCampaign(state, action) {
      state.campaigns = state.campaigns.filter((c) => c.id !== action.payload);
      state.isToDelete = false;
      state.isToDeleteEmailId = null;
    },

    closeSnackbar(state) {
      state.showSnackBar = false;
      state.showFailSnackBar = false;
      state.showDraftSnackBar = false;
      state.isSaveNotificationEmailAsDraft = false;
    },

    resetForm(state) {
      state.campaignDetails = null;
      state.isToEdit = false;
      state.isToCopy = false;
      state.isSaveNotificationEmailAsDraft = false;
      state.template_content = '';
      state.templateCreated = null;
      state.templateValues = null;
      state.droppedElements = null;
    },
  },
});

export const {
  setCampaigns,
  editCampaign,
  copyCampaign,
  saveCampaignEmailAsDraft,
  saveCampaign,
  updateCampaign,
  warnDelete,
  cancelDelete,
  removeCampaign,
  closeSnackbar,
  resetForm,
} = campaignSlice.actions;

export default campaignSlice.reducer;
