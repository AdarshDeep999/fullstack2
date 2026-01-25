import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <div className="container mt-4">
      <h2 className="text-center">Bootstrap UI Demo</h2>
      <div className="card p-3 mt-3">
        <input className="form-control" placeholder="Enter name" />
      <button className="btn btn-primary mt-3">Submit</button>
      </div>
    </div>
  );
}

export default App