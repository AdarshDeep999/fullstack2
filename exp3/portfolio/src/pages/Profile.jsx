import profilePic from "../assets/profile.jpg";

function Profile() {
  return (
    <div style={styles.container}>
      <img src={profilePic} alt="Profile" style={styles.image} />
      <h1>Adarsh Deep</h1>
      <p>Web Developer | Student</p>
      <p>Chandigarh University</p>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "40px",
  },
  image: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    objectFit: "cover",
  },
};

export default Profile;
