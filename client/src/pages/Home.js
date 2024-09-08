import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Home.css";

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/posts")
      .then((response) => {
        console.log(response.data);
        setListOfPosts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, []);

  return (
    <div className="post-container">
      {listOfPosts.map((post, key) => (
        <div className="post-box" key={key}>
          <div className="post-header">
            <span>{post.username}</span>
          </div>
          <div className="post-content">
            <div className="post-photo">
              <img
                src={`http://localhost:5000${post.photoUrl}`}
                alt="Post"
                className="post-image"
              />{" "}
            </div>
            <div className="post-details">
              <div className="post-text">{post.postText}</div>
              <div className="post-dare">{post.dare}</div>
              <div className="post-footer">
                <div className="points">
                  Points: {post.approvals - post.disapproval}
                </div>
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
