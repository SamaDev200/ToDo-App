import { useState } from 'react';
import { X } from 'lucide-react';
import '../AddTask/Modal.css';

function EditTask({ show, onHide, updateData, authToken, editTask }) {
  const [item, setItem] = useState({ 
    id: editTask.id,
    description: editTask.description, 
    label: editTask.label, 
    date: editTask.date, 
    time: editTask.time.slice(0,5),
    status: editTask.status,
    estimated_time: editTask.estimated_time || ""
  });
  
  const [error, setError] = useState(false);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item.description || !item.date || !item.time) {
      setError(true);
      return;
    }

    const updateItem = { 
      ...item, 
      status: item.status,
      estimated_time: item.estimated_time ? parseInt(item.estimated_time) : 0
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/item/update', {
        method: 'POST',
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Token ${authToken}`,
        },
        body: JSON.stringify(updateItem) 
      });

      if (response.status === 200) {
        updateData(updateItem);
        onHide();
      } else {
        alert("There was an error updating the task.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="apple-modal-overlay">
      <div className="apple-modal glass-panel">
        <div className="modal-header">
          <h2>Edit Task</h2>
          <button className="icon-btn" onClick={onHide}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="apple-form">
          <div className="form-group">
            <label>Title</label>
            <input 
              className="apple-input" 
              value={item.description}
              onChange={(e) => setItem({...item, description: e.target.value})}
              placeholder="What needs to be done?"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input 
                type="date"
                className="apple-input" 
                value={item.date}
                onChange={(e) => setItem({...item, date: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input 
                type="time"
                className="apple-input" 
                value={item.time}
                onChange={(e) => setItem({...item, time: e.target.value})}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Estimated Time (min)</label>
              <input 
                type="number"
                min="0"
                className="apple-input" 
                value={item.estimated_time}
                onChange={(e) => setItem({...item, estimated_time: e.target.value})}
                placeholder="e.g. 30"
              />
            </div>
            <div className="form-group">
              <label>Label</label>
              <input 
                className="apple-input" 
                value={item.label}
                onChange={(e) => setItem({...item, label: e.target.value})}
                placeholder="e.g. Work, Personal"
              />
            </div>
          </div>

          {error && <div className="error-text">Please fill in title, date, and time.</div>}

          <div className="modal-actions">
            <button type="button" className="text-btn" onClick={onHide}>Cancel</button>
            <button type="submit" className="apple-btn">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTask;