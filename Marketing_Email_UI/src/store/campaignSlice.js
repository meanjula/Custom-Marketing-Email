import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { campaignApi } from '../services/campaignApi';

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchCampaigns = createAsyncThunk(
  'campaign/fetchAll',
  async () => await campaignApi.getAll()
);

export const createCampaign = createAsyncThunk(
  'campaign/create',
  async (formValues, { getState }) => {
    const { isSaveNotificationEmailAsDraft } = getState().campaign;
    const { Name, Subject, ...rest } = formValues;
    return await campaignApi.create({
      ...rest,
      name: Name || '',
      subject: Subject || '',
      status: isSaveNotificationEmailAsDraft ? 0 : 1,
    });
  }
);

export const updateCampaignAsync = createAsyncThunk(
  'campaign/update',
  async (formValues, { getState }) => {
    const { isSaveNotificationEmailAsDraft } = getState().campaign;
    const { Name, Subject, id, ...rest } = formValues;
    return await campaignApi.update(id, {
      ...rest,
      name: Name || '',
      subject: Subject || '',
      status: isSaveNotificationEmailAsDraft ? 0 : 1,
    });
  }
);

export const deleteCampaign = createAsyncThunk(
  'campaign/delete',
  async (id) => {
    await campaignApi.remove(id);
    return id;
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  campaigns: [],
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
  loading: false,
  error: null,
};

const campaignSlice = createSlice({
  name: 'campaign',
  initialState,
  reducers: {
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

    warnDelete(state, action) {
      state.isToDelete = true;
      state.isToDeleteEmailId = action.payload;
    },

    cancelDelete(state) {
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

  extraReducers: (builder) => {
    // fetchCampaigns
    builder
      .addCase(fetchCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload;
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // createCampaign
    builder
      .addCase(createCampaign.fulfilled, (state, action) => {
        const isDraft = action.payload.status === 0;
        state.campaigns = [action.payload, ...state.campaigns];
        state.showSnackBar = !isDraft;
        state.showDraftSnackBar = isDraft;
        state.isSaveNotificationEmailAsDraft = false;
        state.campaignDetails = null;
        state.isToEdit = false;
        state.isToCopy = false;
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.showFailSnackBar = true;
        state.error = action.error.message;
      });

    // updateCampaignAsync
    builder
      .addCase(updateCampaignAsync.fulfilled, (state, action) => {
        const isDraft = action.payload.status === 0;
        state.campaigns = state.campaigns.map((c) =>
          c.id === action.payload.id ? action.payload : c
        );
        state.showSnackBar = !isDraft;
        state.showDraftSnackBar = isDraft;
        state.isSaveNotificationEmailAsDraft = false;
        state.campaignDetails = null;
        state.isToEdit = false;
      })
      .addCase(updateCampaignAsync.rejected, (state, action) => {
        state.showFailSnackBar = true;
        state.error = action.error.message;
      });

    // deleteCampaign
    builder
      .addCase(deleteCampaign.fulfilled, (state, action) => {
        state.campaigns = state.campaigns.filter((c) => c.id !== action.payload);
        state.isToDelete = false;
        state.isToDeleteEmailId = null;
      })
      .addCase(deleteCampaign.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const {
  editCampaign,
  copyCampaign,
  saveCampaignEmailAsDraft,
  warnDelete,
  cancelDelete,
  closeSnackbar,
  resetForm,
} = campaignSlice.actions;

export default campaignSlice.reducer;
