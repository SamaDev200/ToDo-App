import Task from '../Task/Task.jsx';
import './Archive.css';

function Archive({ doneItems, removeItem, isDark }) {
  return (
    <div className="archive-container glass-panel">
      <h3 className="list-title">Completed</h3>
      
      {doneItems.length !== 0 ? (
          {doneItems.map(item => (
              desc={item.description}
              status={item.status}
              label={item.label}
              date={item.date}
              time={item.time}
              estimated_time={item.estimated_time}
              spent_time={item.spent_time}
              comp="Archive"
              time={item.time}
              comp="Archive"
              removeItem={removeItem}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>Complete tasks to see them here.</p>
        </div>
      )}
    </div>
  );
}

export default Archive;