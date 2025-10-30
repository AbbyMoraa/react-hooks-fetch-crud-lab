import React, { useState, useEffect } from "react";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";
import AdminNavBar from "./AdminNavBar";

function App() {
  const [page, setPage] = useState("List");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then((r) => r.json())
      .then(setQuestions);
  }, []);

  function onAddQuestion(formData) {
    const newQuestion = {
      prompt: formData.prompt,
      answers: [formData.answer1, formData.answer2, formData.answer3, formData.answer4],
      correctIndex: parseInt(formData.correctIndex, 10),
    };
    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQuestion),
    })
      .then((r) => r.json())
      .then((data) => setQuestions((prev) => [...prev, data]));
  }

  function onDeleteQuestion(id) {
    fetch(`http://localhost:4000/questions/${id}`, { method: "DELETE" })
      .then(() => setQuestions((prev) => prev.filter((q) => q.id !== id)));
  }

  function onUpdateQuestion(id, updatedQuestion) {
    // Optimistic update for immediate DOM change
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updatedQuestion } : q))
    );
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedQuestion),
    });
  }

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ? (
        <QuestionForm onAddQuestion={onAddQuestion} />
      ) : (
        <QuestionList
          questions={questions}
          onDeleteQuestion={onDeleteQuestion}
          onUpdateQuestion={onUpdateQuestion}
        />
      )}
    </main>
  );
}

export default App;