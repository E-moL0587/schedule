import React, { useState, useEffect } from "react";
import { collection, addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import db from "./firebase";
import "./App.css";

function App() {
  const [schedules, setSchedules] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "schedules"), (snapshot) => {
      const scheduleData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSchedules(scheduleData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title && date) {
      await addDoc(collection(db, "schedules"), {
        title,
        date
      });

      setTitle("");
      setDate("");
    }
  };

  const handleDelete = async (scheduleId) => {
    await deleteDoc(doc(db, "schedules", scheduleId));
  };

  return (
    <div className="App">
      <h1>Schedule App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      <h2>Schedule List</h2>
      <ul>
        {schedules.map(schedule => (
          <li key={schedule.id}>
            {schedule.title} - {schedule.date}
            <button onClick={() => handleDelete(schedule.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
