import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";
import "../Post.css";

export default function Post() {
  const { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
    });

    axios.get(`http://localhost:5000/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, [id]);

  const handleCommentSubmit = (values, { resetForm }) => {
    axios
      .post("http://localhost:5000/comments", { ...values, PostId: id })
      .then(() => {
        // Fetch comments again to include the new one
        axios.get(`http://localhost:5000/comments/${id}`).then((response) => {
          setComments(response.data);
        });
        resetForm();
      })
      .catch((error) => {
        console.error("Error creating comment:", error);
      });
  };

  return (
    <div className="post-page">
      <div className="post-content">
        <div className="post-details">
          <div className="post-header">
            <span>{postObject.username}</span>
          </div>
          <div className="post-photo">
            <img
              src={`http://localhost:5000${postObject.photoUrl}`}
              alt="Post"
              className="post-image"
            />
          </div>
          <div className="post-text">{postObject.postText}</div>
          <div className="post-dare">{postObject.dare}</div>
          <div className="post-footer">
            <div className="points">
              Points: {postObject.approvals - postObject.disapproval}
            </div>
            <div className="reactions">
              <span className="approve">👍 {postObject.approvals}</span>
              <span className="disapprove">👎 {postObject.disapproval}</span>
            </div>
          </div>
        </div>
        <div className="comment-section">
          <h2>Comments</h2>
          <Formik
            initialValues={{ commentBody: "" }}
            onSubmit={handleCommentSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="comment-form">
                  <Field
                    as="textarea"
                    name="commentBody"
                    placeholder="Add a comment..."
                    className="comment-input"
                  />
                  <ErrorMessage
                    name="commentBody"
                    component="div"
                    className="error-message"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="submit-button"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
          <div className="comments-list">
            {comments.map((comment, index) => (
              <div key={index} className="comment-item">
                <p>{comment.commentBody}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
