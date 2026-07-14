import { useState } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

  const [item, setItem] = useState({ description: "", label: "", date: "", time: "", estimated_time: "" });
  const [error, setError] = useState(false);
  const [error, setError] = useState(false);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item.description || !item.date || !item.time) {
      setError(true);
      return;
    }

    let nowDate = Date.now();
    let dueDate = new Date(item.date + " " + item.time);
    let daysDiff = (dueDate.getTime() - nowDate) / (1000 * 3600 * 24);
    const sendItem = { 
      ...item, 
      status, 
      estimated_time: item.estimated_time ? parseInt(item.estimated_time) : 0,
      spent_time: 0
    };

    const sendItem = { ...item, status };

    try {
      const response = await fetch('http://127.0.0.1:8000/item/create', {
        method: 'POST',
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Token ${authToken}`,
        },
        body: JSON.stringify(sendItem) 
      });

      if (response.status === 200) {
        addnewtask(sendItem);
        onHide();
      } else {
        alert("There was an error creating the task.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="apple-modal-overlay">
      <div className="apple-modal glass-panel">
        <div className="modal-header">
          <h2>New Task</h2>
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
          <div className="form-row">
            <div className="form-group">
              <label>Label</label>
              <input 
                className="apple-input" 
                value={item.label}
                onChange={(e) => setItem({...item, label: e.target.value})}
                placeholder="e.g. Work, Personal"
              />
            </div>
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
          </div>
              <label>Time</label>
              <input 
                type="time"
                className="apple-input" 
                value={item.time}
                onChange={(e) => setItem({...item, time: e.target.value})}
              />
            </div>
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

          {error && <div className="error-text">Please fill in title, date, and time.</div>}

          <div className="modal-actions">
            <button type="button" className="text-btn" onClick={onHide}>Cancel</button>
            <button type="submit" className="apple-btn">Add Task</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTask;