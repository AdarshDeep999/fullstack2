import React, { Suspense, lazy } from "react";

const Dashboard = lazy(() => import("./Components/dashboard"));

function App() {
  return (
    <div>
      <Suspense fallback={<h2>Loading Dashboard...</h2>}>
        <Dashboard />
      </Suspense>
    </div>
  );
}

export default App;