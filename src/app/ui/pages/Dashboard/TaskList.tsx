import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../../../redux/configuration/auth.service';
import { addTask, deleteTask, setTasks, Task, updateTask } from '../../../redux/slices/task';
import { RootState, store } from '../../../redux/store';

const TaskList: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const tasks = useSelector((state: RootState) => state.tasks);
  const dispatch = useDispatch();

  // For new task inputs
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  // For editing tasks
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDesc, setEditingDesc] = useState('');

  useEffect(() => {
    const loadTasks = async () => {
      if (!user.uniqueId || tasks.length > 0) return; // <-- Avoid re-fetching
      const result: Task[] = await authService.handleGetTasks(user.uniqueId);
      dispatch(setTasks(result));
    };

    loadTasks();
  }, [user.uniqueId, dispatch, tasks.length]);

  // const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

  const createTask = async () => {
    if (!title.trim()) return;

    const now = new Date().toISOString();

    const newTask: Task = {
      id: crypto.randomUUID(),  // generate unique id here
      title: title.trim(),
      desc: desc.trim(),
      completed: false,
      dateCreated: now,
      dateModified: now,
    };

    console.log(newTask);

    await authService.handleCreateTask(user.uniqueId, newTask);

    setTitle('');
    setDesc('');
  };


  const handleUpdateTask = async () => {
    if (!editingTaskId || !editingTitle.trim()) return;

    const now = new Date().toISOString();

    const updates: Partial<Task> = {
      title: editingTitle.trim(),
      desc: editingDesc.trim(),
      dateModified: now,
    };

    await authService.handleUpdateTask(user.uniqueId, editingTaskId, updates);

    // No need to dispatch updateTask here since the service already updates the store
    setEditingTaskId(null);
    setEditingTitle('');
    setEditingDesc('');
  };

  const deleteTask = async (taskId: string) => {
    try {
      await authService.handleDeleteTask(user.uniqueId, taskId);
      // No need to dispatch(deleteTask(taskId)) since handleDeleteTask already dispatches setTasks
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  return (
    <div style={{ padding: '2rem', background: '#121212', color: '#fff' }}>
      <h2>Your Tasks</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: '1rem 0' }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={inputStyle}
        />
        <textarea
          placeholder="Description"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          style={{ ...inputStyle, height: '80px' }}
        />
        <button
          onClick={createTask}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            background: '#4CAF50',
            color: '#fff',
            alignSelf: 'flex-start',
          }}
        >
          Add Task
        </button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map((task: Task) => (
          <li
            key={task.id}
            style={{
              background: '#1e1e1e',
              padding: '12px 16px',
              marginBottom: '10px',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            {editingTaskId === task.id ? (
              <>
                <input
                  type="text"
                  value={editingTitle}
                  onChange={e => setEditingTitle(e.target.value)}
                  style={{
                    padding: '8px',
                    background: '#2a2a2a',
                    color: '#fff',
                    border: '1px solid #444',
                    borderRadius: '6px',
                    width: '100%',
                  }}
                />
                <textarea
                  value={editingDesc}
                  onChange={e => setEditingDesc(e.target.value)}
                  style={{
                    padding: '8px',
                    background: '#2a2a2a',
                    color: '#fff',
                    border: '1px solid #444',
                    borderRadius: '6px',
                    width: '100%',
                    height: '60px',
                  }}
                />
                <div>
                  <button
                    onClick={handleUpdateTask}
                    style={{
                      background: '#2196F3',
                      color: '#fff',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      marginRight: '8px',
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingTaskId(null)}
                    style={{
                      background: '#777',
                      color: '#fff',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <strong>{task.title}</strong>
                </div>
                <div>{task.desc}</div>
                <div style={{ marginTop: '8px' }}>
                  <button
                    onClick={() => {
                      setEditingTaskId(task.id);
                      setEditingTitle(task.title);
                      setEditingDesc(task.desc);
                    }}
                    style={{
                      marginRight: '8px',
                      background: '#FF9800',
                      color: '#fff',
                      border: 'none',
                      padding: '6px 10px',
                      borderRadius: '6px',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    style={{
                      background: '#f44336',
                      color: '#fff',
                      border: 'none',
                      padding: '6px 10px',
                      borderRadius: '6px',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;

const inputStyle = {
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #444',
  background: '#222',
  color: '#fff',
  width: '100%',
};