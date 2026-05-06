import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { campaignApi } from '../services/campaignApi';

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchCampaigns = createAsyncThunk(
  'campaign/fetchAll',
  async () => await campaignApi.getAll()
);

export const createCampaign = createAsyncThunk(
  'campaign/create',
  async (formValues, { getState, rejectWithValue }) => {
    const { isSaveNotificationEmailAsDraft } = getState().campaign;
    const { Name, Subject, Content, CcEmails, manual_emails, ...rest } = formValues;
    console.log(Content)
    try {
      return await campaignApi.create({
        ...rest,
        name: Name || '',
        subject: Subject || '',
        content: Content || '',
        ccEmails: CcEmails ?? [],
        manual_emails: manual_emails ?? [],
        status: isSaveNotificationEmailAsDraft ? 0 : 1,
      });
    } catch (err) {
      return rejectWithValue({ message: err.message, errors: err.errors });
    }
  }
);

export const updateCampaignAsync = createAsyncThunk(
  'campaign/update',
  async (formValues, { getState, rejectWithValue }) => {
    const { isSaveNotificationEmailAsDraft } = getState().campaign;
    const { Name, Subject, Content, CcEmails, manual_emails, id, ...rest } = formValues;
    try {
      return await campaignApi.update(id, {
        ...rest,
        name: Name || '',
        subject: Subject || '',
        content: Content || '',
        ccEmails: CcEmails ?? [],
        manual_emails: manual_emails ?? [],
        status: isSaveNotificationEmailAsDraft ? 0 : 1,
      });
    } catch (err) {
      return rejectWithValue({ message: err.message, errors: err.errors });
    }
  }
);

export const deleteCampaign = createAsyncThunk(
  'campaign/delete',
  async (id) => {
    await campaignApi.remove(id);
    return id;
  }
);

export const sendCampaign = createAsyncThunk(
  'campaign/send',
  async (id, { rejectWithValue }) => {
    try {
      return await campaignApi.send(id);
    } catch (err) {
      return rejectWithValue({ message: err.message });
    }
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
  validationErrors: null,
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
      state.validationErrors = null;
    },

    clearValidationErrors(state) {
      state.validationErrors = null;
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
        state.error = action.payload?.message ?? action.error.message;
        state.validationErrors = action.payload?.errors ?? null;
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
        state.error = action.payload?.message ?? action.error.message;
        state.validationErrors = action.payload?.errors ?? null;
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
  clearValidationErrors,
  resetForm,
} = campaignSlice.actions;

export default campaignSlice.reducer;
