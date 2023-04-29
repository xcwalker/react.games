import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

// pages
import { Game_Monopoly, Game_New_Monopoly } from "./pages/monopoly";

// CSS - Default
import "./style/defaults/variables.css"
import "./style/defaults/page-setup.css"
import "./style/defaults/transitions.css"

function App() {

  return <>
    <Router>
      <ScrollToTop />
      <Toaster
        reverseOrder={true}
      />
      {/* Games */}
      <Routes>
        <Route path="game">
          <Route index />
          <Route path="monopoly">
            <Route index element={<Game_New_Monopoly />} />
            <Route path=":gameID" element={<Game_Monopoly />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  </>
}

export default App

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
};

Number.prototype.addLeadingZero = function () {
  var num = this.toString();
  while (num.length < 2) num = "0" + num;
  return num;
};