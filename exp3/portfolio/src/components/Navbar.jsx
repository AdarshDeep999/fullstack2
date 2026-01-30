import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={styles.nav}>
      <Link style={styles.logo} to="/">Adarsh Deep</Link>
      {/* We add a specific style to 'Profile' to push it and others right */}
      <Link style={styles.pushRight} to="/">Profile</Link>
      <Link style={styles.link} to="/projects">Projects</Link>
      <Link style={styles.link} to="/skills">Skills</Link>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    alignItems: "center", // Keeps items centered vertically
    gap: "20px",
    padding: "15px",
    backgroundColor: "#222",
  },
  logo: {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
  },
  pushRight: {
    marginLeft: "auto", // This is the "magic" property
    color: "white",
    textDecoration: "none",
  },
  link: {
    color: "white",
    textDecoration: "none",
  }
};

export default Navbar;