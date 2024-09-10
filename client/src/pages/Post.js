import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";
import "../Post.css";

export default function Post() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    // Obtener detalles del post
    axios.get(`http://localhost:5000/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
    });

    // Obtener comentarios del post
    axios.get(`http://localhost:5000/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, [id]);

  useEffect(() => {
    // Obtener tags del dare si postObject.Dare está definido
    if (postObject.Dare && postObject.Dare.id) {
      axios
        .get(`http://localhost:5000/dares/${postObject.Dare.id}`)
        .then((response) => {
          setTags(response.data.Tags || []);
        });
    }
  }, [postObject.Dare]);

  const handleCommentSubmit = (values, { resetForm }) => {
    axios
      .post(
        "http://localhost:5000/comments",
        { ...values, PostId: id },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then(() => {
        axios.get(`http://localhost:5000/comments/${id}`).then((response) => {
          setComments(response.data);
        });
        resetForm();
      })
      .catch((error) => {
        console.error("Error creating comment:", error);
      });
  };

  const handleDareClick = (postObject) => {
    navigate(`/dare/${postObject.Dare.id}`);
  };

  const handleTagClick = (tag) => {
    navigate(`/tag/${tag.id}`);
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
          <div
            className="post-dare"
            onClick={() => handleDareClick(postObject)}
          >
            {postObject.Dare ? postObject.Dare.dare : "No dare information"}
          </div>
          <div className="dare-description">
            {postObject.Dare && (
              <>
                <div className="description">{postObject.Dare.description}</div>
                <div className="tags-container">
                  {tags.map((tag, index) => (
                    <button
                      key={index}
                      className="tag-button"
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag.tagName}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="post-footer">
            <div className="points">
              Points: {postObject.Dare ? postObject.Dare.points : "N/A"}
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
                <p>{comment.User.username}</p>
                <p>{comment.commentBody}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
