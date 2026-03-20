import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import './TextEditor.css';

const TOOLBAR =
  'undo redo | styles | bold italic underline strikethrough | ' +
  'forecolor backcolor | alignleft aligncenter alignright alignjustify | ' +
  'bullist numlist outdent indent | link image media | ' +
  'blockquote hr removeformat | fullscreen code';

const PLUGINS = [
  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
  'insertdatetime', 'media', 'table', 'wordcount', 'emoticons',
];

/**
 * TinyMCE-based rich text editor integrated with react-hook-form.
 *
 * Props:
 *  value       — controlled HTML string
 *  onChange    — called with the new HTML string on every edit
 *  placeholder — placeholder text shown when the editor is empty
 *  height      — editor height in px (default 400)
 *  disabled    — read-only mode
 */
export default function TextEditor({
  value = '',
  onChange,
  placeholder = 'Write your email content here…',
  height = 400,
  disabled = false,
}) {
  const editorRef = useRef(null);

  const handleImageUpload = (blobInfo) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blobInfo.blob());
    });

  return (
    <div className={`tinymce-wrapper ${disabled ? 'tinymce-disabled' : ''}`}>
      <Editor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        licenseKey="gpl"
        onInit={(_, editor) => { editorRef.current = editor; }}
        value={value}
        onEditorChange={(content) => onChange?.(content)}
        disabled={disabled}
        init={{
          height,
          menubar: true,
          plugins: PLUGINS,
          toolbar: TOOLBAR,
          placeholder,
          branding: false,
          promotion: false,
          resize: true,
          skin: 'oxide',
          content_css: 'default',

          /* Image settings */
          image_advtab: true,
          image_caption: true,
          image_uploadtab: true,
          automatic_uploads: true,
          images_upload_handler: handleImageUpload,
          file_picker_types: 'image',
          file_picker_callback: (callback) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = () => {
              const file = input.files[0];
              const reader = new FileReader();
              reader.onload = () => callback(reader.result, { title: file.name });
              reader.readAsDataURL(file);
            };
            input.click();
          },

          /* Style & formatting */
          style_formats: [
            { title: 'Headings', items: [
              { title: 'Heading 1', format: 'h1' },
              { title: 'Heading 2', format: 'h2' },
              { title: 'Heading 3', format: 'h3' },
            ]},
            { title: 'Inline', items: [
              { title: 'Bold', format: 'bold' },
              { title: 'Italic', format: 'italic' },
              { title: 'Underline', format: 'underline' },
              { title: 'Code', format: 'code' },
            ]},
            { title: 'Blocks', items: [
              { title: 'Paragraph', format: 'p' },
              { title: 'Blockquote', format: 'blockquote' },
              { title: 'Pre', format: 'pre' },
            ]},
          ],

          content_style: `
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              font-size: 15px;
              line-height: 1.6;
              color: #222;
              padding: 12px 16px;
            }
            img { max-width: 100%; height: auto; }
            a { color: #007C89; }
          `,
        }}
      />
    </div>
  );
}
