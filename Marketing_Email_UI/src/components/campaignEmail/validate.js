const isValidEmail = (email) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

export function campaignEmailValidate(values) {
  const errors = {};

  if (!values.Name?.trim()) errors.Name = 'Campaign name is required';
  if (!values.Subject?.trim()) errors.Subject = 'Email subject is required';

  if (!values.Content?.replace(/<[^>]*>/g, '').trim()) {
    errors.Content = 'Email content is required';
  }

  const emailType = Number(values.emailType ?? 1);

  if (emailType === 0 && !values.from_customers_email?.length) {
    errors.from_customers_email = 'At least one recipient must be selected';
  }

  if (emailType === 2) {
    if (!values.manual_emails?.length) {
      errors.manual_emails = 'At least one recipient email is required';
    } else {
      const invalid = values.manual_emails.filter((e) => !isValidEmail(e));
      if (invalid.length > 0) {
        errors.manual_emails = `Invalid email address: ${invalid.join(', ')}`;
      }
    }
  }

  if (values.CcEmails?.length) {
    const invalid = values.CcEmails.filter((e) => !isValidEmail(e));
    if (invalid.length > 0) {
      errors.CcEmails = `Invalid CC email address: ${invalid.join(', ')}`;
    }
  }

  return { values, errors };
}
