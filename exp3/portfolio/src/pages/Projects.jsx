function Projects() {
  return (
    <div style={styles.container}>
      <h1>Projects</h1>

      <ul>
        <li>
          <h3>Vidify: Video Generation Project</h3>
          <p>Built a generative AI tool to generate short videos from text using TTS,
image generation, and video editing.</p>
        </li>

        <li>
          <h3>LinkedIn Content Automationt</h3>
          <p>Building an automated tool that finds trending topics and drafts concise
LinkedIn posts using templates and LLMs safely.</p>
        </li>
      </ul>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
  },
};

export default Projects;
