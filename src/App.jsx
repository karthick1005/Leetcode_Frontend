import { useState } from "react";
import "./App.css";
import Problempage from "./pages/Problem/Problempage";
import { Route, Routes, useNavigate } from "react-router-dom";
import routes from "./routes/Router";
import { ToastContainer } from "react-toastify";
function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="dark">
      <Routes>
        {routes.map((routes, i) => (
          <Route key={i} path={routes.path} element={routes.element} />
        ))}
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
