import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { fakeCustomers } from '../../data/fakeData';
import './CampaignEmail.css';

const customerOptions = fakeCustomers
  .filter((c) => c.person_to_contact_email !== null)
  .map((c) => ({ value: c.person_to_contact_email, label: `${c.name} <${c.person_to_contact_email}>` }));

function TagInput({ name, placeholder }) {
  const { setValue, watch } = useFormContext();
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

function CustomerMultiSelect({ name }) {
  const { setValue, watch } = useFormContext();
  const selected = watch(name) || [];
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = customerOptions.filter(
    (o) => o.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (val) => {
    if (selected.includes(val)) {
      setValue(name, selected.filter((v) => v !== val));
    } else {
      setValue(name, [...selected, val]);
    }
  };

  const selectedLabels = selected.map(
    (v) => customerOptions.find((o) => o.value === v)?.label || v
  );

  return (
    <div className="multi-select-wrapper">
      <div className="multi-select-display" onClick={() => setOpen((p) => !p)}>
        {selected.length === 0 ? (
          <span className="multi-select-placeholder">Select recipients…</span>
        ) : (
          <div className="multi-select-tags">
            {selectedLabels.map((label, i) => (
              <span key={i} className="tag">
                {label}
                <button
                  type="button"
                  className="tag-remove"
                  onClick={(e) => { e.stopPropagation(); toggle(selected[i]); }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        <span className="multi-select-arrow">{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <div className="multi-select-dropdown">
          <input
            type="text"
            className="multi-select-search"
            placeholder="Search customers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="multi-select-options">
            {filtered.length === 0 ? (
              <div className="multi-select-empty">No customers found</div>
            ) : (
              filtered.map((opt) => (
                <label key={opt.value} className="multi-select-option">
                  <input
                    type="checkbox"
                    checked={selected.includes(opt.value)}
                    onChange={() => toggle(opt.value)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomersEmailOption() {
  const { watch, register } = useFormContext();
  const emailType = Number(watch('emailType') ?? 0);

  return (
    <div className="recipients-section">
      <div className="recipient-type-tabs">
        <label className={`type-tab ${emailType === 0 ? 'active' : ''}`}>
          <input type="radio" value={0} {...register('emailType', { valueAsNumber: true })} />
          <span className="type-tab-icon">👥</span>
          <span>From Customers</span>
        </label>
        <label className={`type-tab ${emailType === 1 ? 'active' : ''}`}>
          <input type="radio" value={1} {...register('emailType', { valueAsNumber: true })} />
          <span className="type-tab-icon">📄</span>
          <span>Upload Excel</span>
        </label>
        <label className={`type-tab ${emailType === 2 ? 'active' : ''}`}>
          <input type="radio" value={2} {...register('emailType', { valueAsNumber: true })} />
          <span className="type-tab-icon">✏️</span>
          <span>Enter Manually</span>
        </label>
      </div>

      <div className="recipient-input-area">
        {emailType === 0 && (
          <div className="form-field">
            <label className="form-label">Select Customer Recipients</label>
            <CustomerMultiSelect name="from_customers_email" />
          </div>
        )}
        {emailType === 1 && (
          <div className="form-field">
            <label className="form-label">Upload Excel File</label>
            <div className="file-upload-area">
              <input type="file" accept=".xlsx,.xls,.csv" className="file-input" id="excel-upload" />
              <label htmlFor="excel-upload" className="file-upload-label">
                <span className="file-upload-icon">📁</span>
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
          </div>
        )}
      </div>
    </div>
  );
}
