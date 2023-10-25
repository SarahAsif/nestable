import React, { useCallback } from "react";
import { useState } from "react";
import "./main.css";
import { ContentState, EditorState } from "draft-js";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import Nestable from "react-nestable";
import Modal from "react-modal";
import { Editor } from "react-draft-wysiwyg";

const Book = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const editorStateKey = `editorState_${bookId}`;

  const getLocalItems = useCallback(() => {
    try {
      const book = localStorage.getItem(bookId);
      if (book) {
        const allItems = JSON.parse(book);
        return allItems;
      }
    } catch (error) {
      console.error("Error retrieving data from localStorage:", error);
    }
    return [];
  }, [bookId]);
  const saveItemsToLocalStorage = (items) => {
    localStorage.setItem(bookId, JSON.stringify(items));
  };

  const getEditorStateFromLocalStorage = () => {
    try {
      const editorStateData = localStorage.getItem(editorStateKey);
      if (editorStateData) {
        return EditorState.createWithContent(
          ContentState.createFromText(JSON.parse(editorStateData))
        );
      }
    } catch (error) {
      console.error("Error retrieving editor state from localStorage:", error);
    }
    return EditorState.createEmpty();
  };

  const saveEditorStateToLocalStorage = (editorState) => {
    const contentState = editorState.getCurrentContent();
    const editorStateData = JSON.stringify(contentState.getPlainText());
    localStorage.setItem(editorStateKey, editorStateData);
  };
  const something = (event) => {
    if (event.keyCode === 13) {
      console.log("enter");
    }
  };
  const handleBookItemClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };
  //Usestate lines
  const [inputData, setInputData] = useState("");
  const [items, setItems] = useState([]);
  const [toggleSubmit, setToggleSubmit] = useState(true);
  const [isEditItem, setIsEditItem] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const [currentSection, setCurrentSection] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [editorState, setEditorState] = useState(
    getEditorStateFromLocalStorage()
  );
  const [editedText, setEditedText] = useState("");
  const [editedTitle, setEditedTitle] = useState("");

  const openModal = (item, path) => {
    setModalItem(item);
    setCurrentSection(item);
    setModalTitle(item ? item.name : "");

    // Set the initial content of the Editor
    const contentState = item
      ? ContentState.createFromText(item.content || "") // Use item.content
      : ContentState.createFromText("");
    const editorState = EditorState.createWithContent(contentState);
    setEditorState(editorState);

    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };

  //functions
  const addItem = (event) => {
    event.preventDefault();
    if (!inputData) {
      alert("Please fill data");
    } else {
      const newItem = {
        id: isEditItem || new Date().getTime().toString(),
        name: inputData,
      };

      // Update the local items
      const updatedItems = isEditItem
        ? items.map((item) => (item.id === isEditItem ? newItem : item))
        : [...items, newItem];

      // Save the items to local storage
      saveItemsToLocalStorage(updatedItems);

      setItems(updatedItems);
      setToggleSubmit(true);
      setInputData("");
      setIsEditItem(null);
    }
  };

  const deleteItem = (id) => {
    const updatedItems = items.filter((item) => item.id !== id);

    // Save the items to local storage
    saveItemsToLocalStorage(updatedItems);

    setItems(updatedItems);
    setInputData("");
  };
  const editItem = (item) => {
    openModal(item);
  };

  const saveChanges = () => {
    if (currentSection) {
      const updatedTitle = modalTitle; // Get the updated title
      const updatedContent = editorState.getCurrentContent().getPlainText();

      const updatedItems = items.map((item) =>
        item.id === currentSection.id
          ? { ...item, name: updatedTitle, content: updatedContent }
          : item
      );

      saveItemsToLocalStorage(updatedItems);

      setItems(updatedItems);
      closeModal();
    }
  };

  const renderItem = ({ item, depth, index, handler }) => (
    <div key={item.id} className="bacha">
      <span className="bookSingle">
        {currentSection && item.id === currentSection.id
          ? modalTitle
          : item.name}
      </span>
      <span>{index}</span>
      <span>{depth}</span>
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          onClick={() => editItem(item)}
        >
          edit
          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12H20A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4V2M18.78,3C18.61,3 18.43,3.07 18.3,3.2L17.08,4.41L19.58,6.91L20.8,5.7C21.06,5.44 21.06,5 20.8,4.75L19.25,3.2C19.12,3.07 18.95,3 18.78,3M16.37,5.12L9,12.5V15H11.5L18.87,7.62L16.37,5.12Z" />
        </svg>
        <svg
          onClick={() => deleteItem(item.id)}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C17.5 2 22 6.5 22 12S17.5 22 12 22 2 17.5 2 12 6.5 2 12 2M12 4C10.1 4 8.4 4.6 7.1 5.7L18.3 16.9C19.3 15.5 20 13.8 20 12C20 7.6 16.4 4 12 4M16.9 18.3L5.7 7.1C4.6 8.4 4 10.1 4 12C4 16.4 7.6 20 12 20C13.9 20 15.6 19.4 16.9 18.3Z" />
        </svg>
      </span>
    </div>
  );

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  function onItemChange(args) {
    console.log(args);
    saveItemsToLocalStorage(args.items);
    setItems(args.items);
  }

  useEffect(() => {
    const itemsFromLocalStorage = getLocalItems();
    setItems(itemsFromLocalStorage);
    console.log(bookId);
  }, [bookId, getLocalItems]);

  return (
    <form>
      <div className="main">
        <div className="left">
          <div className="parent">
            <div className="svg">
              <h1> Sections</h1>
            </div>
            <input
              placeholder="Add Items"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
            />
          </div>
          <div className="child">
            {toggleSubmit ? (
              <button onClick={addItem}>Add</button>
            ) : (
              <button onClick={addItem}>Edit</button>
            )}

            <button>
              <Link to="/">Go To Books</Link>
            </button>
          </div>
        </div>
        <div className="right">
          <Nestable
            items={items}
            renderItem={renderItem}
            onChange={onItemChange}
          />
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            contentLabel="Edit Item Modal"
            style={{
              content: {
                width: "60%",
                margin: "auto",
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "20px",
                backgroundColor: "white",
              },
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
              },
            }}
          >
            {modalItem && (
              <input
                type="text"
                placeholder="Title"
                value={modalTitle}
                onChange={(e) => setModalTitle(e.target.value)}
              />
            )}
            <Editor
              editorState={editorState}
              onEditorStateChange={onEditorStateChange}
            />
            <button onClick={saveChanges}>Save Changes</button>
          </Modal>
        </div>
      </div>
    </form>
  );
};

export default Book;
