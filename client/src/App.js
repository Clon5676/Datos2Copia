import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";

function App() {
  return (
    <div className="App">
      <Router>
        <Link to="/createpost"> Create a Post </Link>
        <Link to="/"> HomePage </Link>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/createpost" exact element={<CreatePost />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
