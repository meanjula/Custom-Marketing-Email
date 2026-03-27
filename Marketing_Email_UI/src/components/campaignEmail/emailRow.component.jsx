import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlinePencil, HiOutlineDocumentDuplicate, HiOutlineTrash } from 'react-icons/hi';
import { editCampaign, copyCampaign, warnDelete, cancelDelete, removeCampaign } from '../../store/campaignSlice';

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
  const dispatch = useDispatch();
  const { isToDelete, isToDeleteEmailId } = useSelector((state) => state.campaign);
  const navigate = useNavigate();
  const { id, name, subject, status, created } = campaign;

  const confirmingDelete = isToDelete && isToDeleteEmailId === id;

  const handleEdit = () => {
    dispatch(editCampaign(id));
    navigate('/campaigns/create');
  };

  const handleCopy = () => {
    dispatch(copyCampaign(id));
    navigate('/campaigns/create');
  };

  const handleWarnDelete = () => dispatch(warnDelete(id));
  const handleCancelDelete = () => dispatch(cancelDelete());
  const handleConfirmDelete = () => dispatch(removeCampaign(id));

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
