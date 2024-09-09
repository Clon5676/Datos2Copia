import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Dares from "./pages/Dares";

function App() {
  return (
    <div className="App">
      <Router>
        <Link to="/createpost"> Create a Post </Link>
        <Link to="/"> HomePage </Link>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/createpost" exact element={<CreatePost />} />
          <Route path="/post/:id" exact element={<Post />} />
          <Route path="/dare/:id" exact element={<Dares />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
