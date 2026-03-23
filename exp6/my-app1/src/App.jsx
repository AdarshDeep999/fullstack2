import { useState } from "react";
import "./App.css";

function App() {

  const initialState = {
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    address: "",
    state: "",
    skills: []
  };

  const [formData, setFormData] = useState(initialState);

  // ✅ today's date (prevents future DOB)
  const today = new Date().toISOString().split("T")[0];

  // input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // checkbox change
  const handleSkillChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setFormData({
        ...formData,
        skills: [...formData.skills, value]
      });
    } else {
      setFormData({
        ...formData,
        skills: formData.skills.filter(
          (skill) => skill !== value
        )
      });
    }
  };

  // submit
  const handleSubmit = (e) => {
    e.preventDefault();

    alert(`
First Name: ${formData.firstName}
Last Name: ${formData.lastName}
DOB: ${formData.dob}
Gender: ${formData.gender}
Address: ${formData.address}
State: ${formData.state}
Skills: ${formData.skills.join(", ")}
    `);
  };

  // cancel/reset
  const handleCancel = () => {
    setFormData(initialState);
  };

  return (
    <div className="container">

      <form className="form-card" onSubmit={handleSubmit}>
        <h2>User Registration</h2>

        {/* First Name */}
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        {/* Last Name */}
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        {/* ✅ DOB (Future dates disabled) */}
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          max={today}
          required
        />

        {/* Gender */}
        <div className="group">
          <label>Gender</label>

          <div className="options">
            <label>
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={formData.gender === "Male"}
                onChange={handleChange}
                required
              />
              Male
            </label>

            <label>
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={formData.gender === "Female"}
                onChange={handleChange}
              />
              Female
            </label>

            <label>
              <input
                type="radio"
                name="gender"
                value="Other"
                checked={formData.gender === "Other"}
                onChange={handleChange}
              />
              Other
            </label>
          </div>
        </div>

        {/* Address */}
        <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        {/* State */}
        <select
          name="state"
          value={formData.state}
          onChange={handleChange}
          required
        >
          <option value="">Select State</option>
          <option>Maharashtra</option>
          <option>Delhi</option>
          <option>Karnataka</option>
          <option>Gujarat</option>
        </select>

        {/* Skills */}
        <div className="group">
          <label>Skills</label>

          <div className="options">
            {["JavaScript", "React", "Python", "C++"].map(skill => (
              <label key={skill}>
                <input
                  type="checkbox"
                  value={skill}
                  checked={formData.skills.includes(skill)}
                  onChange={handleSkillChange}
                />
                {skill}
              </label>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="btn-group">
          <button type="submit" className="submit">
            Submit
          </button>

          <button
            type="button"
            className="cancel"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
}

export default App;