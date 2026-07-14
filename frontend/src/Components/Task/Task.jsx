import { useState, useEffect } from 'react';
import EditTask from '../EditTask/EditTask.jsx';
import { Trash2, Edit3, CheckCircle, Circle, Play, Pause, Clock } from 'lucide-react';
import './Task.css';

/*eslint no-extend-native: ["error", { "exceptions": ["Date"] }]*/
Date.prototype.yyyymmdd = function() {
    let mm = this.getMonth() + 1;
    let dd = this.getDate();
    return [this.getFullYear(), (mm>9 ? '' : '0') + mm, (dd>9 ? '' : '0') + dd].join('-');
};

function Task({ id, desc, status, label, date, time, estimated_time, spent_time, comp, completedTask, removeItem, isDark, authToken, updateData }) {
    const [checked, setChecked] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    
    // Timer state
    const [timerRunning, setTimerRunning] = useState(false);
    const [currentSpent, setCurrentSpent] = useState(spent_time || 0);

    useEffect(() => {
        if (comp === 'Archive') {
            setChecked(true);
            setDisabled(true);
        }
    }, [comp]);

    useEffect(() => {
        let interval = null;
        if (timerRunning) {
            interval = setInterval(() => {
                setCurrentSpent(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timerRunning]);

    const syncSpentTime = async (newSpentTime) => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/item/update`, {
                method: 'POST',
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Token ${authToken}`,
                },
                body: JSON.stringify({
                    id,
                    description: desc,
                    status,
                    label,
                    date,
                    time,
                    estimated_time,
                    spent_time: newSpentTime
                }) 
            });
        } catch (err) {
            console.error(err);
        }
    };

    const toggleTimer = () => {
        if (disabled) return;
        if (timerRunning) {
            // Pausing
            setTimerRunning(false);
            syncSpentTime(currentSpent);
        } else {
            // Starting
            setTimerRunning(true);
        }
    };

    const handleCheck = () => {
        if (disabled) return;
        setChecked(true);
        if (timerRunning) {
            setTimerRunning(false);
        }
        let nowDate = new Date();
        let nowTime = (nowDate.getHours() + ":" + nowDate.getMinutes()).toString();
        // Sync final time before completing
        syncSpentTime(currentSpent);
        completedTask(id, nowDate.yyyymmdd().toString(), nowTime);
    };

    const toggleEdit = () => setShowEdit(!showEdit);
    const handleDelete = () => removeItem(id);

    const getStatusBadge = () => {
        let nowDate = Date.now();
        let dueDate = new Date(date + " " + time);
        let daysDiff = (dueDate.getTime() - nowDate) / (1000 * 3600 * 24);

        if (status === 'Ongoing') return <span className="badge badge-ongoing">{status}</span>;
        if (status === 'Pending') return <span className={`badge ${daysDiff <= 1 ? 'badge-danger' : 'badge-warning'}`}>{status}</span>;
        if (status === 'Completed') return <span className="badge badge-success">{status}</span>;
        if (status === 'Overdue') return <span className="badge badge-secondary">{status}</span>;
        return <span className="badge">{status}</span>;
    };

    const formatTime = (totalSeconds) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const estSeconds = (estimated_time || 0) * 60;
    const isExceeded = estSeconds > 0 && currentSpent > estSeconds;
    const timerColorClass = isExceeded ? 'timer-exceeded' : (timerRunning ? 'timer-running' : 'timer-idle');

    return (
        <>
            <div className={`apple-task-item ${checked ? 'completed' : ''}`}>
                <button className="task-check-btn" onClick={handleCheck} disabled={disabled}>
                    {checked ? <CheckCircle className="icon-checked" /> : <Circle className="icon-unchecked" />}
                </button>
                
                <div className="task-content">
                    <div className="task-title">{desc}</div>
                    <div className="task-meta">
                        {getStatusBadge()}
                        {label && <span className="task-label">{label}</span>}
                        <span className="task-datetime">{date} {time && time.slice(0,5)}</span>
                        
                        {estimated_time > 0 && (
                            <span className={`task-timer ${timerColorClass}`}>
                                <Clock size={12} style={{marginRight: '4px'}} />
                                {formatTime(currentSpent)} / {estimated_time}m
                                {isExceeded && ` (+${formatTime(currentSpent - estSeconds)})`}
                            </span>
                        )}
                    </div>
                </div>

                <div className="task-actions">
                    {estimated_time > 0 && comp !== 'Archive' && (
                        <button className={`icon-btn ${timerRunning ? 'active-timer-btn' : ''}`} onClick={toggleTimer}>
                            {timerRunning ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                        </button>
                    )}
                    {comp !== 'Archive' && (
                        <button className="icon-btn" onClick={toggleEdit}>
                            <Edit3 size={18} />
                        </button>
                    )}
                    <button className="icon-btn delete" onClick={handleDelete}>
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {showEdit && (
                <EditTask 
                    show={showEdit}
                    onHide={toggleEdit}
                    isDark={isDark}
                    authToken={authToken}
                    editTask={{ id, description: desc, status, label, date, time, estimated_time }}
                    updateData={updateData}
                />
            )}
        </>
    );
}

export default Task;