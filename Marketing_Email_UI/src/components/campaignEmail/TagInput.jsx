import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

export default function TagInput({ name, placeholder }) {
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
