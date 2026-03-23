import { AppBar, Toolbar, Typography, Button, TextField, Card, CardContent, Container } from "@mui/material";

function App() {
  return (
    <>
      {/* App Bar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Student Portal
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Student Information
            </Typography>

            <TextField
              fullWidth
              label="Name"
              margin="normal"
            />

            <TextField
              fullWidth
              label="Email"
              type = "Email"
              margin="normal"
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Submit
            </Button>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default App;
