import React from "react";

function QuestionList({ questions, onDeleteQuestion, onUpdateQuestion}) {
  return (
    <section>
      <h1>Quiz Questions</h1>

      <ul>
        {questions.map((question) => (
          <li key={question.id}>
            <p>{question.prompt}</p>
            <select
              aria-label="Correct Answer"
              value={question.correctIndex}
              onChange={(e) =>
                onUpdateQuestion(question.id, {
                  correctIndex: parseInt(e.target.value, 10)
                })
              }
            >
              {question.answers.map((answer, index) => (
                <option key={index} value={index}>
                  {answer}
                </option>
              ))}
            </select>
            <button onClick={() => onDeleteQuestion(question.id)}>
              Delete Question
            </button>
          </li>
        ))}</ul>
    </section>
  );
}

export default QuestionList;
