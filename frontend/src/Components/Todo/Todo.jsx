import { useState, useEffect, useCallback } from 'react';
import Task from '../Task/Task.jsx';
import AddTask from '../AddTask/AddTask.jsx';
import NavbarAbove from '../Navbar/Navbar.jsx';
import Archive from '../Archive/Archive.jsx';
import { Search, Plus } from 'lucide-react';
import './Todo.css';

function Todo({ isDark, authToken, changeLogin }) {
  const [showAdd, setShowAdd] = useState(false);
  const [todoItems, setTodoItems] = useState([]);
  const [completedTodo, setCompletedTodo] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [username, setUsername] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsername = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/user/getinfo/`, {
        method: 'POST',
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Token ${authToken}`,
        }
      });
      if (response.status === 401) {
        changeLogin(null);
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setUsername(data.username || data.email || data.first_name || "User");
      }
    } catch (err) {
      console.error(err);
    }
  }, [authToken]);

  const updateData = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/item/get_all`, {
        method: 'POST',
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Token ${authToken}`,
        }
      });
      
      if (response.status === 401) {
        changeLogin(null);
        return;
      }
      
      if (!response.ok) return;

      const data = await response.json();

      let OGdata = [];
      let todoData = [];
      let completed = [];
      let keyId = 1;

      data.forEach(item => {
        let newData = {
          key: keyId++, 
          id: item.id,
          description: item.description,
          status: item.status,
          label: item.label,
          date: item.due_date_time.slice(0,10),
          time: item.due_date_time.slice(11,16),
          estimated_time: item.estimated_time,
          spent_time: item.spent_time
        };
        OGdata.push(newData);
        OGdata.push(newData);
        if (newData.status !== 'Completed') {
          if (daysDiff < 0) newData.status = "Overdue";
          else if (daysDiff <= 2) newData.status = "Pending";
          else newData.status = "Ongoing";
          todoData.push(newData);
        } else {
          completed.push(newData);
        }
      });

      setOriginalData(OGdata);
      setTodoItems(todoData.sort((a,b) => new Date(a.date) - new Date(b.date)));
      setCompletedTodo(completed);
    } catch (err) {
      console.error(err);
    }
  }, [authToken]);

  useEffect(() => {
    fetchUsername();
    updateData();
  }, [fetchUsername, updateData]);

  const toggleAddTask = () => setShowAdd(!showAdd);

  const completedTask = async (id, date, time) => {
    const item = todoItems.find(i => i.id.toString() === id.toString());
    if (item) {
      const updateItem = { ...item, status: "Completed", date, time };
      try {
        await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/item/update`, {
          method: 'POST',
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Token ${authToken}`,
          },
          body: JSON.stringify(updateItem) 
        });
        updateData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const removeItem = async (id) => {
    const item = originalData.find(i => i.id.toString() === id.toString());
    if (item) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/item/delete`, {
          method: 'POST',
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Token ${authToken}`,
          },
          body: JSON.stringify(item) 
        });
        updateData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredItems = todoItems.filter(item => 
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="todo-dashboard">
      <NavbarAbove 
        toggleModal={toggleAddTask}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="todo-content-wrapper">
        <div className="todo-header-section glass-panel">
          <div className="todo-header-top">
            <h2>My Tasks</h2>
            <button className="apple-btn add-btn" onClick={toggleAddTask}>
              <Plus size={18} /> New Task
            </button>
          </div>
          
          <div className="search-bar">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              className="apple-input" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="todo-lists-container">
          <div className="todo-main-list glass-panel">
            <h3 className="list-title">Upcoming</h3>
            {filteredItems.length !== 0 ? (
              <div className="task-list">
                {filteredItems.map(item => (
                  <Task
                    key={item.key}
                    id={item.id}
                    desc={item.description}
                    status={item.status}
                    label={item.label}
                    date={item.date}
                    time={item.time}
                    estimated_time={item.estimated_time}
                    spent_time={item.spent_time}
                    isDark={isDark}
                    authToken={authToken}
                    updateData={updateData}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>All done for now. Enjoy your day!</p>
              </div>
            )}
          </div>

          <div className="todo-archive-sidebar">
            <Archive 
              doneItems={completedTodo}
              removeItem={removeItem}
              isDark={isDark}
            />
          </div>
        </div>
      </div>

      {showAdd && (
        <AddTask 
          show={showAdd}
          onHide={toggleAddTask}
          addnewtask={updateData}
          isDark={isDark}
          authToken={authToken}
        />
      )}
    </div>
  );
}

export default Todo;