import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../Home.css";

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/posts")
      .then((response) => {
        setListOfPosts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, []);

  const handlePostClick = (post) => {
    console.log("Post clicked:", post);
    navigate(`/post/${post.id}`);
  };

  return (
    <div className="post-container">
      {listOfPosts.map((post, key) => (
        <div
          className="post-box"
          key={key}
          onClick={() => handlePostClick(post)}
        >
          <div className="post-header">
            <span>{post.username}</span>
          </div>
          <div className="post-content">
            <div className="post-photo">
              <img
                src={`http://localhost:5000${post.photoUrl}`}
                alt="Post"
                className="post-image"
              />
            </div>
            <div className="post-details">
              <div className="post-text">{post.postText}</div>
              <div className="post-dare">{post.Dare.dare}</div>{" "}
              {/* Updated here */}
              <div className="post-footer">
                <div className="reactions">
                  <span className="approve">👍 {post.approvals}</span>
                  <span className="disapprove">👎 {post.disapproval}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
