import React, { useState ,useEffect} from "react";
import "./Home.css";

function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentuser, setcurrentuser] = useState();
  const [currentUserRole, setcurrentUserRole] = useState(); 
  const searchParams = new URLSearchParams(window.location.pathname);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
   
    const value =  JSON.parse(localStorage.getItem('currentUsername'));
    const usernameVal = value[0].UserRole
    setcurrentUserRole(usernameVal)

}, []);

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
              {/* Admin role */}
             { currentUserRole === "Admin" && 
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
                <li>
                  <a href="/user_master">USER MASTER</a>
                </li>
              </ul>
              }
                 {/* manager role */}
             { currentUserRole === "Manager" && 
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
             }
            </div>
          )}
       
           {isSidebarOpen && searchParams && (
            <div>
              <button
              className="sidebar-toggle-button-open"
              onClick={toggleSidebar}
            >
              ☰ 
            </button>
            </div>
           
            
          )}
    </div>
  );
}

export default Home;
