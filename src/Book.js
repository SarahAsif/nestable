import React, { useCallback, useRef } from "react";
import { useState } from "react";
import "./main.css";
import htmlToDraft from "html-to-draftjs";
import draftToHtml from "draftjs-to-html";

import { ContentState, EditorState, convertToRaw } from "draft-js";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import Modal from "react-modal";
import { Editor } from "react-draft-wysiwyg";
import SortableTree, {
  changeNodeAtPath,
} from "@nosferatu500/react-sortable-tree";

const Book = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();

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

  const [inputData, setInputData] = useState("");
  const [items, setItems] = useState([]);
  const [toggleSubmit, setToggleSubmit] = useState(true);
  const [isEditItem, setIsEditItem] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const [currentSection, setCurrentSection] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [editorState, setEditorState] = useState();
  const [currentPath, setCurrentPath] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);

  const openModal = () => {
    const item = currentNode;
    setModalItem(item);
    setCurrentSection(item);
    setModalTitle(item ? item.name : "");

    const _lsItem = localStorage.getItem(
      `content.${bookId}.${currentPath.join(".")}`
    );
    const _contentRaw = _lsItem || "";

    const _contentConverted = htmlToDraft(_contentRaw || "");

    if (_contentConverted) {
      const contentState = ContentState.createFromBlockArray(
        _contentConverted.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
      setModalIsOpen(true);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentPath([]);
    setCurrentNode(null);
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

  // const deleteItem = (id) => {
  //   const updatedItems = items.filter((item) => item.id !== id);
  //   saveItemsToLocalStorage(updatedItems);
  //   setItems(updatedItems);
  //   setInputData("");
  // };

  function getNodeKey({ treeIndex }) {
    return treeIndex;
  }

  function updateItem(item, path, newData) {
    const treeData = changeNodeAtPath({
      path,
      treeData: items,
      getNodeKey,
      newNode: {
        children: item.children,
        ...newData,
        expanded: true,
      },
    });
    console.log(newData.content);
    saveContent(path, newData.content);
    setItems(treeData);
    saveItemsToLocalStorage(items);
  }

  function saveContent(path, content) {
    localStorage.setItem(`content.${bookId}.${path.join(".")}`, content);
  }

  useEffect(() => {
    if (currentPath.length > 0) {
      openModal();
    }
  }, [currentPath]);

  const editItem = (item, path) => {
    setCurrentNode(item);
    setCurrentPath(path);
  };

  const saveChanges = () => {
    if (currentSection) {
      const updatedTitle = modalTitle; // Get the updated title
      const updatedContent = draftToHtml(
        convertToRaw(editorState.getCurrentContent())
      );

      updateItem(currentNode, currentPath, {
        name: updatedTitle,
        content: updatedContent,
      });

      saveItemsToLocalStorage(items);
      setCurrentPath([]);
      setCurrentNode(null);
      closeModal();
    }
  };

  useEffect(() => {
    const itemsFromLocalStorage = getLocalItems();
    setItems(itemsFromLocalStorage);
  }, [bookId, getLocalItems]);

  function onChange(items) {
    setItems(items);
    saveItemsToLocalStorage(items);
  }

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
              <Link to="/home">Go To Books</Link>
            </button>
          </div>
        </div>
        <div className="right">
          <SortableTree
            treeData={items}
            onChange={onChange}
            generateNodeProps={({ node, path, treeIndex }) => ({
              buttons: [
                <span
                  className="buttons"
                  onClick={() => editItem(node, path, treeIndex)}
                >
                  Edit
                </span>,
              ],
              title: node.name,
              subtitle: () => (
                <>
                  <span>{treeIndex}</span>
                  <span>::</span>
                  <span>{path.join(".")}</span>
                </>
              ),
            })}
          />
          <Modal
            ariaHideApp
            isOpen={modalIsOpen}
            onRequestClose={() => closeModal()}
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
                zIndex: 20,
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
              onEditorStateChange={(e) => setEditorState(e)}
            />
            <button onClick={saveChanges}>Save Changes</button>
          </Modal>
        </div>
      </div>
    </form>
  );
};

export default Book;
