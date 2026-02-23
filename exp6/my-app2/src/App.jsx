import { useState } from "react";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

 const validateEmail = (email) => {
  const emailRegex =
    /^[a-zA-Z0-9]+@[a-zA-Z0-9-]+\.(com|in|org|net|edu|gov|co|io)$/;
  return emailRegex.test(email);
};



  const validatePassword = (password) => {
    const passwordRegex =
      /^[A-Z](?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{4,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!validateEmail(email)) {
      newErrors.email =
        "Enter valid email (must contain @ and valid domain like .com, .in)";
    }

    if (!validatePassword(password)) {
      newErrors.password =
        "Password must start with capital, contain 1 number, 1 special character and be at least 5 characters long.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert(
        ` Form Submitted Successfully!\n\nEmail: ${email}\nPassword: ${password}`
      );

      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Client-Side Form Validation</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email ID</label>
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default App;