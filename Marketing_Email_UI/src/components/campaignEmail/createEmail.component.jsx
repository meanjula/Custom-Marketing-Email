import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import {
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineSave,
  HiOutlineArrowLeft,
} from 'react-icons/hi';
import { FcTemplate } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { useCampaign } from '../../context/useCampaign';
import CustomersEmailOption from './customersEmailOption.component';
import TagInput from './TagInput';
import TextEditor from '../inputs/textEditor';
import './CampaignEmail.css';

const defaultValues = {
  Name: '',
  emailType: 1,
  Subject: '',
  CcEmails: [],
  Content: '',
  manual_emails: [],
};

export default function CreateEmailComponent() {
  const { state, dispatch } = useCampaign();
  const { isToEdit, isToCopy, campaignDetails, showSnackBar, showDraftSnackBar } = state;
  const navigate = useNavigate();

  const methods = useForm({ defaultValues });
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const contentValue = watch('Content');

  useEffect(() => {
    if ((isToEdit || isToCopy) && campaignDetails) {
      reset({
        ...defaultValues,
        Name: isToCopy ? `${campaignDetails.name} (Copy)` : campaignDetails.name || '',
        Subject: campaignDetails.subject || '',
        emailType: campaignDetails.emailType ?? 0,
        CcEmails: campaignDetails.CcEmails || [],
        Content: campaignDetails.Content || '',
        from_customers_email: campaignDetails.from_customers_email || [],
        manual_emails: campaignDetails.manual_emails || [],
      });
    }
  }, [isToEdit, isToCopy, campaignDetails, reset]);

  useEffect(() => {
    if (showSnackBar || showDraftSnackBar) {
      const timer = setTimeout(() => {
        dispatch({ type: 'CLOSE_SNACKBAR' });
        navigate('/campaigns');
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [showSnackBar, showDraftSnackBar, dispatch, navigate]);

  const onSubmit = (values) => {
    if (isToEdit && campaignDetails?.id && !isToCopy) {
      dispatch({ type: 'UPDATE_CAMPAIGN', payload: { ...values, id: campaignDetails.id } });
    } else {
      dispatch({ type: 'SAVE_CAMPAIGN', payload: values });
    }
  };

  const handleSaveAsDraft = () => {
    dispatch({ type: 'SAVE_CAMPAIGN_EMAIL_AS_DRAFT' });
  };

  const handleCancel = () => {
    dispatch({ type: 'RESET_FORM' });
    navigate('/campaigns');
  };

  const pageTitle = isToEdit ? 'Edit Campaign' : isToCopy ? 'Copy Campaign' : 'Create Campaign';
  const submitLabel = isToEdit ? 'Update & Send' : 'Send Campaign';

  return (
    <FormProvider {...methods}>
      {(showSnackBar || showDraftSnackBar) && (
        <div className={`snackbar ${showDraftSnackBar ? 'draft' : 'success'}`}>
          {showDraftSnackBar ? '📝 Draft saved successfully!' : '✅ Campaign sent successfully!'}
        </div>
      )}

      <div className="create-email-page">
        <div className="page-header">
          <div>
            <h1 className="page-title">{pageTitle}</h1>
            <p className="page-subtitle">
              {isToEdit
                ? 'Update your campaign details below.'
                : isToCopy
                ? 'You are creating a copy of an existing campaign.'
                : 'Fill in the details below to create and send your campaign.'}
            </p>
          </div>
          <button type="button" className="btn btn-ghost" onClick={handleCancel}>
            <HiOutlineArrowLeft /> Back to Campaigns
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-grid">
            {/* Left column — main fields */}
            <div className="form-main">

              {/* Campaign Name */}
              <div className="form-card">
                <div className="card-header">
                  <span className="card-step">1</span>
                  <h2 className="card-title">Campaign Details</h2>
                </div>
                <div className="card-body">
                  <div className="form-field">
                    <label className="form-label" htmlFor="Name">
                      Campaign Name <span className="required">*</span>
                    </label>
                    <input
                      id="Name"
                      type="text"
                      className={`form-input ${errors.Name ? 'input-error' : ''}`}
                      placeholder="e.g. Summer Sale 2025"
                      {...register('Name', { required: 'Campaign name is required' })}
                    />
                    {errors.Name && <span className="field-error">{errors.Name.message}</span>}
                  </div>

                  <div className="form-field">
                    <label className="form-label" htmlFor="Subject">
                      Email Subject <span className="required">*</span>
                    </label>
                    <input
                      id="Subject"
                      type="text"
                      className={`form-input ${errors.Subject ? 'input-error' : ''}`}
                      placeholder="e.g. Exclusive deals just for you!"
                      {...register('Subject', { required: 'Subject is required' })}
                    />
                    {errors.Subject && <span className="field-error">{errors.Subject.message}</span>}
                  </div>

                  <div className="form-field">
                    <label className="form-label">
                      CC Emails <span className="optional">(optional)</span>
                    </label>
                    <TagInput name="CcEmails" placeholder="Type a CC email and press Enter…" />
                  </div>
                </div>
              </div>

              {/* Recipients */}
              <div className="form-card">
                <div className="card-header">
                  <span className="card-step">2</span>
                  <h2 className="card-title">Recipients</h2>
                </div>
                <div className="card-body">
                  <CustomersEmailOption />
                </div>
              </div>

              {/* Content */}
              <div className="form-card">
                <div className="card-header">
                  <span className="card-step">3</span>
                  <h2 className="card-title">Email Content</h2>
                </div>
                <div className="card-body">
                  <div className="content-options">
                    <div className="content-option-header">
                      <p className="content-note">
                        Choose how to compose your email — write plain text or use the drag-and-drop
                        design builder.
                      </p>
                    </div>

                    <div className="content-tabs">
                      <button
                        type="button"
                        className={`content-tab ${!state.templateCreated ? 'active' : ''}`}
                        onClick={() => dispatch({ type: 'RESET_FORM' })}
                      >
                        <HiOutlinePencilAlt /> Rich Text Editor
                      </button>
                      <button
                        type="button"
                        className="content-tab"
                        onClick={() => navigate('/campaigns/design')}
                      >
                        <FcTemplate /> Design Builder
                        <span className="tab-badge">Coming Soon</span>
                      </button>
                    </div>

                    {!state.templateCreated ? (
                      <div className="form-field">
                        <TextEditor
                          value={contentValue || ''}
                          onChange={(html) => setValue('Content', html, { shouldDirty: true })}
                          placeholder="Write your email content here…"
                          height={420}
                        />
                        <div className="textarea-footer">
                          <span className="char-count">
                            {contentValue
                              ? contentValue.replace(/<[^>]*>/g, '').length
                              : 0} characters
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="template-saved-indicator">
                        <span className="template-icon"><FcTemplate /></span>
                        <div>
                          <p className="template-saved-text">Template design saved</p>
                          <p className="template-saved-time">{state.templateCreated}</p>
                        </div>
                        <button
                          type="button"
                          className="btn btn-danger-ghost btn-sm"
                          onClick={() => {
                            setValue('Content', '');
                            dispatch({ type: 'RESET_FORM' });
                          }}
                        >
                          <HiOutlineTrash /> Remove Design
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right column — summary */}
            <div className="form-sidebar">
              <div className="form-card summary-card">
                <div className="card-header">
                  <h2 className="card-title">Summary</h2>
                </div>
                <div className="card-body">
                  <SummaryItem label="Name" value={watch('Name') || '—'} />
                  <SummaryItem label="Subject" value={watch('Subject') || '—'} />
                  <SummaryItem
                    label="Recipients"
                    value={recipientSummary(watch('emailType'), watch('manual_emails'))}
                  />
                  <SummaryItem
                    label="CC"
                    value={(watch('CcEmails') || []).length > 0 ? `${watch('CcEmails').length} address(es)` : '—'}
                  />
                  <SummaryItem
                    label="Content"
                    value={state.templateCreated ? 'Template design' : (watch('Content') ? 'Text email' : '—')}
                  />
                </div>
              </div>

              <div className="action-buttons">
                <button type="submit" className="btn btn-primary btn-full">
                  {submitLabel}
                </button>
                <button
                  type="submit"
                  className="btn btn-secondary btn-full"
                  onClick={handleSaveAsDraft}
                >
                  <HiOutlineSave /> Save as Draft
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-full"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="summary-item">
      <span className="summary-label">{label}</span>
      <span className="summary-value">{value}</span>
    </div>
  );
}

function recipientSummary(emailType, manualEmails) {
  const type = Number(emailType ?? 1);
  if (type === 1) return 'Excel upload';
  if (type === 2) return manualEmails?.length ? `${manualEmails.length} address(es)` : '—';
  return '—';
}
