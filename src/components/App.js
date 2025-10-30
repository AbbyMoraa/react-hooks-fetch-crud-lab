import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [page, setPage] = useState("List");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    
    fetch("http://localhost:4000/questions")
      .then((r) => r.json())
      .then((data) => {
        setQuestions(data);
      })
      .catch((err) => {
        console.error("Failed to fetch questions:", err);
      });
  }, []);

  
  function handleAddQuestion(newQuestion) {
    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQuestion),
    })
      .then((r) => r.json())
      .then((created) => {
        setQuestions((prev) => [...prev, created]);
        setPage("List");
      })
      .catch((err) => {
        console.error("Failed to add question:", err);
      });
  }

  function handleDeleteQuestion(id) {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "DELETE",
    })
      .then((r) => {
        if (r.ok) {
          setQuestions((prev) => prev.filter((q) => q.id !== id));
        }
      })
      .catch((err) => {
        console.error("Failed to delete question:", err);
      });
  }

   function handleUpdateQuestion(id, patchedFields) {
    let previous;
    setQuestions((prev) => {
      previous = prev;
      return prev.map((q) => (q.id === id ? { ...q, ...patchedFields } : q));
    });

    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patchedFields),
    })
      .then((r) => r.json())
      .then((updated) => {
        setQuestions((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
      })
      .catch((err) => {
        console.error("Failed to update question:", err);
        setQuestions(previous);
      });
  }

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ? (
        <QuestionForm onAddQuestion={handleAddQuestion} />
      ) : (
        <QuestionList
          questions={questions}
          onDeleteQuestion={handleDeleteQuestion}
          onUpdateQuestion={handleUpdateQuestion}
        />
      )}
    </main>
  );
}

export default App;