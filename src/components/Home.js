import "./Home.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { faSignOut, faUserPlus, faMoneyBillWave, faUser,faClock, faCalendarDay, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const Header = ({ title }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const searchParams = new URLSearchParams(window.location.pathname);
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(false);
  const [currentLogin, setCurrentLogin] = useState('');
  const [currentUser, setcurrentUser] = useState('');
  const [currentUsername, setcurrentUsername] = useState('')
  const [openpopup, setopenpopup] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const navigate = useNavigate();

  useEffect(() => {

    const values = localStorage.getItem('currentUsername') === 'undefined' ? 'null' : JSON.parse(localStorage.getItem('currentUsername'));
  
    if (values && values[0]) {
      setCurrentLogin(values[0].UserRole);
      if (values[0].Name) {
        setcurrentUsername(values[0].Name)

        const nameParts =  values[0].Name.charAt(0);

        setcurrentUser(nameParts);
      }
    }
 

  }, []);
  const OpenPopupcard = () => {
    setIsOpen(true)
  }
  const OpenUser = () => {
    setopenpopup(prevState => !prevState);
  }
  const handleExit = () => {
    localStorage.clear();
    navigate("/")
  };

  return (
    <div>
      <Popup open={isOpen} onClose={closeModal} contentStyle={{
        width: '385px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
      }}>
        <div >
          <h2 className="fontFam">Are you sure you want to logout?</h2>
          <div className="popup_btn">
            <button className="btn_yesclr" onClick={handleExit}>Yes</button>
            <button className="btn_noClr" onClick={closeModal}>No</button>
          </div>

        </div>
      </Popup>


      <div className="header_font">
        {/* Render content only if logged in */}

        {/* Sidebar Section */}
        {/* Fora admin */}
        {currentLogin === "Admin" && !isSidebarOpen && searchParams && (
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
                  <div className="dipsly_home">
                  <FontAwesomeIcon className="list_icon mtg_top_home" icon={faClock} />  HOURLY REPORT
                  </div>

                </a>
                <a href="/daily_report" className="active">
                <div className="dipsly_home">
                  <FontAwesomeIcon className="list_icon mtg_top_home" icon={faCalendarDay} />DAILY REPORT
                  </div>
                </a>
                <a href="/daily_expenditure" className="active">
                   <div className="dipsly_home">
                  <FontAwesomeIcon className="list_icon mtg_top_home" icon={faMoneyBillWave} />DAILY EXPENDITURE
                  </div>
                </a>
                <a href="/user_master" className="active">
                <div className="dipsly_home">
                  <FontAwesomeIcon className="list_icon mtg_top_home" icon={faUserPlus} />USER MASTER
                </div>
                </a>
              </li>

            </ul>

          </div>
        )}
        {openpopup === true && (
          <div className="menu_card ">
            <div className="menu-alignment" >

              <div className="userName ">
                <FontAwesomeIcon icon={faUser} className="color_logout mrg_rgt" />
                <div className="cls_imagecolor">{currentUsername}</div>
              </div>

              <div className="logout cursor_logout" onClick={OpenPopupcard}>
                <FontAwesomeIcon icon={faSignOut} className="color_logout mtg_top10" />
                <button className="logout_alignment" >
                  Logout
                </button>
              </div>

            </div>
          </div>
        )}

        {currentLogin !== "Admin" && !isSidebarOpen && searchParams && (
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
                <div className="dipsly_home">
                  <FontAwesomeIcon className="list_icon mtg_top_home" icon={faClock} /> HOURLY REPORT
                </div>
                </a>

                <a href="/daily_report" className="active">
                <div className="dipsly_home">
                  <FontAwesomeIcon className="list_icon mtg_top_home" icon={faCalendarDay} /> DAILY REPORT
                  </div>
                </a>

                <a href="/daily_expenditure" className="active">
                <div className="dipsly_home">
                  <FontAwesomeIcon className="list_icon mtg_top_home" icon={faMoneyBillWave} /> DAILY EXPENDITURE
                  </div>
                </a>


                {/* <a href="/registration_list?param1=searchDoctor" className="active">
                  <FontAwesomeIcon className="list_icon" icon={faSearch} /> SEARCH DOCTOR
                </a> */}

              </li>

            </ul>

          </div>
        )}



        <div className="display_flea_align">
          {/* Sidebar toggle button on the left */}

          {/* {currentLogin === "Admin" && isSidebarOpen && searchParams && ( */}
          <button
            className="sidebar-toggle-button-open"
            onClick={toggleSidebar}
          >
            ☰
          </button>
          {/* )} */}

          <div
            className="font_header">
            {title}
          </div>
          <div className="logout_style">

            <button className="icon_button" title={currentUsername} onClick={OpenUser}>
              {/* <FontAwesomeIcon icon={faSignOut} /> */}
              {currentUser}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};


export default Header;