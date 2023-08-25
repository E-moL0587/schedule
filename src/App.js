import React, { useState, useEffect } from "react";
import { collection, addDoc, deleteDoc, doc, query, where, onSnapshot } from "firebase/firestore";
import db from "./firebase";
import "./App.css";

function App() {
  const [schedules, setSchedules] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [time, setTime] = useState("00:00");
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedDate, setSelectedDate] = useState("2023-09-09");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "schedules"), where("date", "==", selectedDate)),
      (snapshot) => {
        const scheduleData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const sortedSchedules = scheduleData.sort((a, b) => {
          const timeA = a.time.split(":").map(Number);
          const timeB = b.time.split(":").map(Number);
          if (timeA[0] !== timeB[0]) {
            return timeA[0] - timeB[0];
          } else {
            return timeA[1] - timeB[1];
          }
        });
        setSchedules(sortedSchedules);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title && content) {
      await addDoc(collection(db, "schedules"), {
        title,
        date: selectedDate,
        time,
        content
      });

      setTitle("");
      setContent("");
      setTime("00:00");
    }
  };

  const handleDelete = async (scheduleId) => {
    await deleteDoc(doc(db, "schedules", scheduleId));
    setSelectedSchedule(null); // 削除後に内容表示をリセット
  };

  const handleScheduleClick = (schedule) => {
    setSelectedSchedule(schedule);
  };

  return (
    <div className="App">
      <h1>長野旅行スケジュール</h1>
      <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
        <option value="2023-09-09">9月9日</option>
        <option value="2023-09-10">9月10日</option>
      </select>
      <select value={time} onChange={(e) => setTime(e.target.value)}>
        {Array.from({ length: 48 }, (_, index) => {
          const hours = Math.floor(index / 2);
          const minutes = index % 2 === 0 ? "00" : "30";
          const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes}`;
          return <option key={index} value={formattedTime}>{formattedTime}</option>;
        })}
      </select>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="タイトル名"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <textarea
          placeholder="内容"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">加える</button>
      </form>
      <h2>{selectedDate}のスケジュール</h2>
      <ul>
        {schedules.map(schedule => (
          <li
            key={schedule.id}
            onClick={() => handleScheduleClick(schedule)}
          >
            {schedule.time} - {schedule.title}
            <button onClick={() => handleDelete(schedule.id)}>削除する</button>
          </li>
        ))}
      </ul>
      {selectedSchedule && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedSchedule.title}</h3>
            <p>時間: {selectedSchedule.time}</p>
            <p>内容: {selectedSchedule.content}</p>
            <button onClick={() => setSelectedSchedule(null)}>閉じる</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
