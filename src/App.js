import './App.css';
import Login from './components/Login';
import Home from "./components/Home";
import HourlyReport from './components/Hourly_Report';
import DailyReport from "./components/Daily_Report";
import DailyExpenditure from "./components/Daily_Expenditure";
import UserMaster from "./components/UserMaster";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
// import ForgetPassword from './components/ForgetPassword' 

function App() {
  return (
    <div className="App">
      <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/hourly_report" element={<HourlyReport />} />
        <Route path="/daily_report" element={<DailyReport />} />
        <Route path="/user_master" element={<UserMaster />} />
        {/* <Route path="/forget_password" element={<ForgetPassword />} /> */}
        <Route path="/daily_expenditure" element={<DailyExpenditure />} />
      </Routes>
      </Router>
    </div>
  );
}




export default App;
