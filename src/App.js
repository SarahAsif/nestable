import React from "react";
import { Routes, Route } from "react-router-dom";
import MainBook from "./MainBook";
import Book from "./Book";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainBook />} />
      <Route path="/book/:bookId" element={<Book />} />
    </Routes>
  );
}

export default App;
