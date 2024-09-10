import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "../styles/CreatePostStyle.css"; // Import your CSS file

export default function CreatePost() {
  const [dares, setDares] = useState([]);

  useEffect(() => {
    // Fetch random dares when component mounts
    axios
      .get("http://localhost:5000/dares/random")
      .then((response) => {
        setDares(response.data);
      })
      .catch((error) => {
        console.error("Error fetching dares:", error);
      });
  }, []);

  const initialValues = {
    DareId: "", // Changed from 'dare' to 'DareId'
    postText: "",
    username: "",
    approvals: 0,
    disapproval: 0,
    photo: null, // For the file input
  };

  const validationSchema = Yup.object().shape({
    DareId: Yup.string().required("Dare is required"), // Changed from 'dare' to 'DareId'
    postText: Yup.string().required("Post Text is required"),
    username: Yup.string().required("Username is required"),
    approvals: Yup.number().min(0, "Approvals cannot be negative"),
    disapproval: Yup.number().min(0, "Disapprovals cannot be negative"),
    photo: Yup.mixed().required("A photo is required"),
  });

  const onSubmit = (data, { resetForm }) => {
    const formData = new FormData(); // FormData for handling file uploads
    for (let key in data) {
      formData.append(key, data[key]); // Append all fields, including 'photo'
    }

    axios
      .post("http://localhost:5000/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      })
      .then((response) => {
        console.log("Post created:", response.data);
        resetForm();
      })
      .catch((error) => {
        console.error("Error creating post:", error);
      });
  };

  return (
    <div className="create-post-container">
      <h2>Create a New Post</h2>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ setFieldValue }) => (
          <Form className="create-post-form">
            <div className="form-group">
              <label htmlFor="DareId">Dare:</label>
              <Field as="select" name="DareId" className="form-field">
                <option value="">Select a dare</option>
                {dares.map((dare) => (
                  <option key={dare.id} value={dare.id}>
                    {dare.dare}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="DareId"
                component="div"
                className="error-message"
              />
            </div>

            <div className="form-group">
              <label htmlFor="postText">Post Text:</label>
              <Field
                name="postText"
                placeholder="Me costó mucho este desafio!"
                className="form-field"
              />
              <ErrorMessage
                name="postText"
                component="div"
                className="error-message"
              />
            </div>

            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <Field
                name="username"
                placeholder="Your username"
                className="form-field"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="error-message"
              />
            </div>

            <div className="form-group">
              <label htmlFor="approvals">Approvals:</label>
              <Field name="approvals" type="number" className="form-field" />
              <ErrorMessage
                name="approvals"
                component="div"
                className="error-message"
              />
            </div>

            <div className="form-group">
              <label htmlFor="disapproval">Disapprovals:</label>
              <Field name="disapproval" type="number" className="form-field" />
              <ErrorMessage
                name="disapproval"
                component="div"
                className="error-message"
              />
            </div>

            <div className="form-group">
              <label htmlFor="photo">Photo:</label>
              <input
                type="file"
                name="photo"
                className="form-field"
                onChange={(event) => {
                  setFieldValue("photo", event.target.files[0]);
                }}
              />
              <ErrorMessage
                name="photo"
                component="div"
                className="error-message"
              />
            </div>

            <button type="submit" className="submit-button">
              Create Post
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
