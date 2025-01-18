import React, { useState } from "react";
import "./Home.css";

function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const searchParams = new URLSearchParams(window.location.pathname);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };



  return (
    <div className="home-container">
      {/* Render content only if logged in */}
     
          {/* Sidebar Section */}
          {!isSidebarOpen && searchParams &&  (
            <div className="sidebar">
              <button className="sidebar-toggle-button" onClick={toggleSidebar}>
                ✖
              </button>
              <div className="sidebar-header">
                <h3>Tea Shop</h3>
              </div>
              <ul className="sidebar-menu">
                <li>
                  <a href="/hourly_report" className="active">
                    HOURLY REPORT
                  </a>
                </li>
                <li>
                  <a href="/daily_report">DAILY REPORT</a>
                </li>
                <li>
                  <a href="/daily_expenditure">DAILY EXPENDITURE</a>
                </li>
              </ul>
            </div>
          )}
           {isSidebarOpen && searchParams && (
            <button
              className="sidebar-toggle-button-open"
              onClick={toggleSidebar}
            >
              ☰
            </button>
          )}
    </div>
  );
}

export default Home;
