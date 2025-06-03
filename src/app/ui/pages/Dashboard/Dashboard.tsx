// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
//   const tasksRef = collection(db, 'users', auth.currentUser!.uid, 'tasks');

  useEffect(() => {
    // const q = query(tasksRef);
    // const unsub = onSnapshot(q, snapshot => {
    //   setTasks(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Task[]);
    // });
    // return unsub;
  }, []);

  const addTask = async () => {
    if (!newTask.trim()) return;
    // await addDoc(tasksRef, { title: newTask, completed: false });
    setNewTask('');
  };

  const toggleComplete = async (task: Task) => {
    // const taskDoc = doc(tasksRef, task.id);
    // await updateDoc(taskDoc, { completed: !task.completed });
  };

  const deleteTask = async (taskId: string) => {
    // await deleteDoc(doc(tasksRef, taskId));
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={() => {}}>Logout</button>
      <input
        placeholder="New Task"
        value={newTask}
        onChange={e => setNewTask(e.target.value)}
      />
      <button onClick={addTask}>Add</button>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <input type="checkbox" checked={task.completed} onChange={() => toggleComplete(task)} />
            {task.title}
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;