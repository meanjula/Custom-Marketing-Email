import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { HiOutlineDocument, HiOutlinePencilAlt, HiOutlineUpload } from 'react-icons/hi';
import './CampaignEmail.css';

function TagInput({ name, placeholder }) {
  const { setValue, watch, clearErrors } = useFormContext();
  const tags = watch(name) || [];
  const [inputVal, setInputVal] = useState('');
  const [error, setError] = useState('');

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const addTag = (val) => {
    const trimmed = val.trim();
    if (!trimmed) return;
    if (!isValidEmail(trimmed)) { setError('Enter a valid email address'); return; }
    if (tags.includes(trimmed)) { setError('Email already added'); return; }
    setValue(name, [...tags, trimmed]);
    clearErrors(name);
    setInputVal('');
    setError('');
  };

  const removeTag = (tag) => setValue(name, tags.filter((t) => t !== tag));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputVal);
    } else if (e.key === 'Backspace' && !inputVal && tags.length) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="tag-input-wrapper">
      <div className="tag-input-box">
        {tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
            <button type="button" className="tag-remove" onClick={() => removeTag(tag)}>×</button>
          </span>
        ))}
        <input
          type="text"
          className="tag-raw-input"
          placeholder={tags.length === 0 ? placeholder : ''}
          value={inputVal}
          onChange={(e) => { setInputVal(e.target.value); setError(''); }}
          onKeyDown={handleKeyDown}
          onBlur={() => addTag(inputVal)}
        />
      </div>
      {error && <span className="field-error">{error}</span>}
      <p className="field-hint">Press Enter or comma to add an email</p>
    </div>
  );
}

export default function CustomersEmailOption() {
  const { watch, register, formState: { errors } } = useFormContext();
  const emailType = Number(watch('emailType') ?? 1);

  return (
    <div className="recipients-section">
      <div className="recipient-type-tabs">
        <label className={`type-tab ${emailType === 1 ? 'active' : ''}`}>
          <input type="radio" value={1} {...register('emailType', { valueAsNumber: true })} />
          <span className="type-tab-icon"><HiOutlineDocument /></span>
          <span>Upload Excel</span>
        </label>
        <label className={`type-tab ${emailType === 2 ? 'active' : ''}`}>
          <input type="radio" value={2} {...register('emailType', { valueAsNumber: true })} />
          <span className="type-tab-icon"><HiOutlinePencilAlt /></span>
          <span>Enter Manually</span>
        </label>
      </div>

      <div className="recipient-input-area">
        {emailType === 1 && (
          <div className="form-field">
            <label className="form-label">Upload Excel File</label>
            <div className="file-upload-area">
              <input type="file" accept=".xlsx,.xls,.csv" className="file-input" id="excel-upload" />
              <label htmlFor="excel-upload" className="file-upload-label">
                <span className="file-upload-icon"><HiOutlineUpload /></span>
                <span className="file-upload-text">Click to upload or drag & drop</span>
                <span className="file-upload-hint">.xlsx, .xls, .csv supported</span>
              </label>
            </div>
          </div>
        )}
        {emailType === 2 && (
          <div className="form-field">
            <label className="form-label">Enter Email Addresses</label>
            <TagInput name="manual_emails" placeholder="Type an email and press Enter…" />
            {errors.manual_emails && (
              <span className="field-error">{errors.manual_emails.message}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
