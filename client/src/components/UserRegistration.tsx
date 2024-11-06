import { useState } from "react";
import axios from "axios";

const UserRegistration = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNum: "",
    password: "",
    photos: [] as File[],
  });

  const [errors, setErrors] = useState<any>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target;
    console.log(name, value, files);
    if (name === "photos") {
      if (files) {
        setFormData({ ...formData, [name]: Array.from(files) });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("firstName", formData.firstName);
    formDataToSubmit.append("lastName", formData.lastName);
    formDataToSubmit.append("phoneNum", formData.phoneNum);
    formDataToSubmit.append("email", formData.email);
    formDataToSubmit.append("password", formData.password);

    formData.photos.forEach((photo) => {
      formDataToSubmit.append("photos", photo);
    });

    try {
      const response = await axios.post(
        "http://localhost:5001/api/register/",
        formDataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response", response.data);
    } catch (error) {
      // Checking if it's an Axios error
      if (axios.isAxiosError(error)) {
        console.error("Axios error message:", error.message);
        console.error("Axios error code:", error.code);
        console.error("Axios error config:", error.config);
        console.error("Axios error request:", error.request);
        console.error("Axios error response:", error.response);

        // If there is a response from the server, log the status and data
        if (error.response) {
          console.error("Status code:", error.response.status);
          console.error("Error response data:", error.response.data);
          console.error("Error response headers:", error.response.headers);
        }
      } else {
        console.error("Non-Axios error:", error);
      }
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>First Name:</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Last Name :</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Email :</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Password :</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Phone Num:</label>
        <input
          type="tel"
          name="phoneNum"
          value={formData.phoneNum}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Upload Photos:</label>
        <input type="file" name="photos" multiple onChange={handleChange} />
      </div>
      <div>
        <button type="submit">Register</button>
      </div>
    </form>
  );
};

export default UserRegistration;
