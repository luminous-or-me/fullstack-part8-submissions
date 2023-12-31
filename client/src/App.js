import Authors from "./components/Authors";
import Books from "./components/Books";
import Recommendations from "./components/Recommendations";
import EditBirthYear from "./components/EditBirthYear";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import { Route, Routes, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useApolloClient } from "@apollo/client";
import { useSubscription } from "@apollo/client";
import { ALL_BOOKS, BOOK_ADDED } from "./queries";
import { updateBooks } from "./util";

const App = () => {
  const [token, setToken] = useState(null);
  const client = useApolloClient();

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      console.log("Data received");

      const addedBook = data.data.bookAdded;

      updateBooks(client.cache, ALL_BOOKS, addedBook);

      window.alert(`Book "${data.data.bookAdded.title}" added!`);
    },
  });

  useEffect(() => {
    const userToken = localStorage.getItem("user-token");

    if (userToken) setToken(userToken);
  }, []);

  const handleLogout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  return (
    <div>
      <div>
        <Link to="/authors">
          <button>Authors</button>
        </Link>
        <Link to="/">
          <button>Books</button>
        </Link>
        {token && (
          <>
            <Link to="/add">
              <button>Add book</button>
            </Link>
            <Link to="/edit">
              <button>Edit Birthyear</button>
            </Link>
            <Link to="recommend">
              <button>Recommendations</button>
            </Link>
          </>
        )}
        {token ? (
          <button onClick={handleLogout}>log out</button>
        ) : (
          <Link to="/login">
            <button>Log in</button>
          </Link>
        )}
      </div>

      <Routes>
        <Route path="/" element={<Books />} />
        <Route path="/login" element={<LoginForm setToken={setToken} />} />
        <Route path="/authors" element={<Authors />} />
        <Route path="/add" element={<NewBook />} />
        <Route path="/edit" element={<EditBirthYear />} />
        <Route path="/recommend" element={<Recommendations />} />
      </Routes>
    </div>
  );
};

export default App;
