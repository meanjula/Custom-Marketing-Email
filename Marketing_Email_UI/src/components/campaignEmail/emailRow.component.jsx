import { useNavigate } from 'react-router-dom';
import { HiOutlinePencil, HiOutlineDocumentDuplicate, HiOutlineTrash } from 'react-icons/hi';
import { useCampaign } from '../../context/useCampaign';

const STATUS_LABEL = { 0: 'Draft', 1: 'Sent' };
const STATUS_CLASS = { 0: 'badge-draft', 1: 'badge-sent' };

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(dateStr));
}

export default function EmailRow({ campaign }) {
  const { dispatch, state } = useCampaign();
  const navigate = useNavigate();
  const { id, name, subject, status, created } = campaign;

  const confirmingDelete = state.isToDelete && state.isToDeleteEmailId === id;

  const handleEdit = () => {
    dispatch({ type: 'EDIT_CAMPAIGN', payload: id });
    navigate('/campaigns/create');
  };

  const handleCopy = () => {
    dispatch({ type: 'COPY_CAMPAIGN', payload: id });
    navigate('/campaigns/create');
  };

  const handleWarnDelete = () => dispatch({ type: 'WARN_DELETE', payload: id });
  const handleCancelDelete = () => dispatch({ type: 'CANCEL_DELETE' });
  const handleConfirmDelete = () => dispatch({ type: 'REMOVE_CAMPAIGN', payload: id });

  return (
    <>
      <tr className={`table-row ${confirmingDelete ? 'row-danger' : ''}`}>
        <td className="td">
          <span className="campaign-name">{name}</span>
        </td>
        <td className="td">
          <span className="campaign-subject">{subject}</span>
        </td>
        <td className="td">
          <span className={`badge ${STATUS_CLASS[status]}`}>
            {STATUS_LABEL[status]}
          </span>
        </td>
        <td className="td td-date">{formatDate(created)}</td>
        <td className="td td-actions">
          {status === 0 ? (
            <button className="action-btn edit-btn" title="Edit" onClick={handleEdit}>
              <HiOutlinePencil />
            </button>
          ) : (
            <button className="action-btn copy-btn" title="Copy" onClick={handleCopy}>
              <HiOutlineDocumentDuplicate />
            </button>
          )}
          <button
            className="action-btn delete-btn"
            title="Delete"
            onClick={handleWarnDelete}
            style={status === 1 ? { opacity: 0.4, pointerEvents: 'none' } : {}}
          >
            <HiOutlineTrash />
          </button>
        </td>
      </tr>

      {confirmingDelete && (
        <tr className="confirm-row">
          <td colSpan={5}>
            <div className="confirm-delete">
              <span>Are you sure you want to delete <strong>{name}</strong>?</span>
              <div className="confirm-actions">
                <button className="btn btn-danger btn-sm" onClick={handleConfirmDelete}>
                  Yes, Delete
                </button>
                <button className="btn btn-ghost btn-sm" onClick={handleCancelDelete}>
                  Cancel
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
