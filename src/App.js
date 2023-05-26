import Home from "./component/home";
import SignIn from "./component/SignIn";
import { Routes, Route } from "react-router-dom";
import Call from "./component/call";
import { reciveToken } from "./store/auth";
import { useLayoutEffect } from "react";
import { useDispatch } from "react-redux";

import Meeting from "./component/meeting";
function App() {
  const dispatch = useDispatch();
  useLayoutEffect(() => dispatch(reciveToken()));
  document.title = "Rining";

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/call" element={<Call />} />
        <Route path="/meeting" element={<Meeting />} />
      </Routes>
    </div>
  );
}

export default App;
