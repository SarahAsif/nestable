import React from "react";
import { useState } from "react";
import "./main.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const getLocalItmes = () => {
  let list = localStorage.getItem("lists");
  console.log(list);

  if (list) {
    return JSON.parse(localStorage.getItem("lists"));
  } else {
    return [];
  }
};

const MainBook = () => {
  const something = (event) => {
    if (event.keyCode === 13) {
      console.log("enter");
    }
  };
  const navigate = useNavigate();
  const handleBookItemClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };
  //Usestate lines
  const [inputData, setInputData] = useState("");
  const [items, setItems] = useState(getLocalItmes());
  const [toggleSubmit, setToggleSubmit] = useState(true);
  const [isEditItem, setIsEditItem] = useState(null);
  //functions
  const addItem = () => {
    if (!inputData) {
      alert("plzz fill data");
    } else if (inputData && !toggleSubmit) {
      setItems(
        items.map((elem) => {
          if (elem.id === isEditItem) {
            return { ...elem, name: inputData };
          }
          return elem;
        })
      );
      setToggleSubmit(true);
      something(true);
      setInputData("");

      setIsEditItem(null);
    } else {
      const allInputData = {
        id: new Date().getTime().toString(),
        name: inputData,
      };
      setItems([...items, allInputData]);
      setInputData("");
    }
  };
  const deleteItem = (index) => {
    const updateditems = items.filter((elem) => {
      return index !== elem.id;
    });

    setItems(updateditems);
    setInputData("");
  };

  const editItem = (id) => {
    let newEditItem = items.find((elem) => {
      return elem.id === id;
    });
    console.log(newEditItem);

    setToggleSubmit(false);

    setInputData(newEditItem.name);

    setIsEditItem(id);
  };
  useEffect(() => {
    localStorage.setItem("lists", JSON.stringify(items));
  }, [items]);

  return (
    <form>
      <div className="main">
        <div className="left">
          <div className="parent">
            <div className="svg">
              <h1> Books</h1>
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
          </div>
        </div>
        <div className="right">
          <div className="container">
            {items.map((elem) => {
              return (
                <div key={elem.id} className="bacha">
                  <span
                    className="bookSingle"
                    onClick={() => handleBookItemClick(elem.id)}
                  >
                    <span className="bookName">Book Name:</span>
                    {elem.name}
                  </span>
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      onClick={() => editItem(elem.id)}
                    >
                      <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12H20A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4V2M18.78,3C18.61,3 18.43,3.07 18.3,3.2L17.08,4.41L19.58,6.91L20.8,5.7C21.06,5.44 21.06,5 20.8,4.75L19.25,3.2C19.12,3.07 18.95,3 18.78,3M16.37,5.12L9,12.5V15H11.5L18.87,7.62L16.37,5.12Z" />
                    </svg>
                    <svg
                      onClick={() => deleteItem(elem.id)}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C17.5 2 22 6.5 22 12S17.5 22 12 22 2 17.5 2 12 6.5 2 12 2M12 4C10.1 4 8.4 4.6 7.1 5.7L18.3 16.9C19.3 15.5 20 13.8 20 12C20 7.6 16.4 4 12 4M16.9 18.3L5.7 7.1C4.6 8.4 4 10.1 4 12C4 16.4 7.6 20 12 20C13.9 20 15.6 19.4 16.9 18.3Z" />
                    </svg>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </form>
  );
};

export default MainBook;
