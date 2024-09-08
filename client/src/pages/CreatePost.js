import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

export default function CreatePost() {
  const initialValues = {
    dare: "",
    postText: "",
    username: "",
    approvals: 0,
    disapproval: 0,
    photo: null, // For the file input
  };

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    dare: Yup.string().required("Dare is required"),
    postText: Yup.string().required("Post Text is required"),
    username: Yup.string().required("Username is required"),
    approvals: Yup.number().min(0, "Approvals cannot be negative"),
    disapproval: Yup.number().min(0, "Disapprovals cannot be negative"),
    photo: Yup.mixed().required("A photo is required"),
  });

  // Handling form submission
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
    <div className="createPostPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ setFieldValue }) => (
          <Form>
            <div>
              <label>Dare: </label>
              <Field name="dare" placeholder="Enter a dare" />
              <ErrorMessage name="dare" component="div" />
            </div>

            <div>
              <label>Post Text: </label>
              <Field
                name="postText"
                placeholder="Me costó mucho este desafio!"
              />
              <ErrorMessage name="postText" component="div" />
            </div>

            <div>
              <label>Username: </label>
              <Field name="username" placeholder="Your username" />
              <ErrorMessage name="username" component="div" />
            </div>

            <div>
              <label>Approvals: </label>
              <Field name="approvals" type="number" />
              <ErrorMessage name="approvals" component="div" />
            </div>

            <div>
              <label>Disapprovals: </label>
              <Field name="disapproval" type="number" />
              <ErrorMessage name="disapproval" component="div" />
            </div>

            <div>
              <label>Photo: </label>
              <input
                type="file"
                name="photo"
                onChange={(event) => {
                  setFieldValue("photo", event.target.files[0]);
                }}
              />
              <ErrorMessage name="photo" component="div" />
            </div>

            <button type="submit">Create Post</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
