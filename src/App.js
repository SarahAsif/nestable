import React from "react";
import { Routes, Route } from "react-router-dom";
import MainBook from "./MainBook";
import Book from "./Book";
import Auth from "./Auth";

function App() {
  return (
    <Routes>
      <Route path="/home" element={<MainBook />} />
      <Route path="/book/:bookId" element={<Book />} />
      <Route index element={<Auth />} />
    </Routes>
  );
}

export default App;
