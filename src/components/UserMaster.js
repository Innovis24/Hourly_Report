import React, { useState, useEffect } from "react";
import Popup from 'reactjs-popup';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom"; 
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./UserMaster.css";


const apiUrl = "http://localhost/hourly_report/Login.php";
function UserMaster() {
    const [currentuser, setcurrentuser] = useState();
    const [currentuserName, setcurrentuserName] = useState();
    const [openpopup, setopenpopup] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const closeModal = () => setIsOpen(false);
    const [Array, setArray] = useState([]);
    const navigate = useNavigate(); // For go to login page the navigate function

    useEffect(() => {
        getapi()
        const value =  JSON.parse(localStorage.getItem('currentUsername'));
        const usernameVal = value[0].UserName
        setcurrentuser(usernameVal)
        const nameParts = usernameVal.charAt(0);

        setcurrentuserName(nameParts);
    }, []);

    const getapi = () => {
        axios
          .get(apiUrl) // in this place use two api so mention it(action).
          .then((response) => {
            setArray(response.data);
          })
          .catch((error) => {
            console.error("Error fetching daily reports:", error);
            toast.error("Error fetching daily reports");
          });
      }
    const OpenUser = () => {
        setopenpopup(!openpopup);
    }
    const OpenPopupcard = () => {
        setIsOpen(true)
    }
  const handleExit = () => {
    // Redirect to the login page
    localStorage.clear();
      navigate("/")
   
  };



    return (
        <div>

            {/* POPUP FOR SIDE CARD */}
            {openpopup && (
                <div className="menu_card ">
                    <div className="userName ">
                        <FontAwesomeIcon icon={faUser} className="color_logout mrg_rgt" />
                        <div className="cls_imagecolor">{currentuser}</div>
                    </div>

                    <div className="logout_btn cursor_logout" onClick={OpenPopupcard}>
                        <FontAwesomeIcon icon={faSignOut} className="mrg_lft_card color_logout" />
                        <button className="logout_alignment" >
                            Logout
                        </button>
                    </div>
                </div>
            )}
            {/* LOGOUT POPUP */}
            <Popup open={isOpen} onClose={closeModal} contentStyle={{
                width: '385px',
                padding: '20px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                background: 'white'
            }}>
                <div >
                    <h2 className="fontFam">Are you sure you want to logout?</h2>
                    <div className="popup_btn">
                        <button className="btn_yesclr" onClick={handleExit}>Yes</button>
                        <button className="btn_noClr" onClick={closeModal}>No</button>
                    </div>

                </div>
            </Popup>


            <div className="App">
                <div className="header_font"><b>USER MASTER</b>
                    <div className="header_buttons">
                        <button className="icon_button user_border_radius" type="submit" title={currentuser} onClick={OpenUser}>
                            {/* <FaUser size={20} /> */}
                            {currentuserName}
                        </button>
                    </div>
                </div>
                <div className="App scrollit_UM table_scroll">

<center>
            <table className="padding_top3">
              <thead className="table_header3">
                <tr>
                  <th>S.No</th>
                  <th>User name</th>
                  <th>User Role</th>
                  <th>Branch name</th>
                  <th>Action</th>
                </tr>
                {/* <tr></tr> */}
              </thead>
              <tbody>
                {Array.length > 0 && Array[0].Sno !== '' ? (
                  Array.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.UserName}</td>
                      <td>{item.UserRole}</td>
                      <td>{item.BranchName ? item.BranchName : '-'}</td>

                      <td>

                        {/* <FaEdit
                          className="iconPaddig"
                          onClick={(e) => handleUpdate(e, item)}
                        />
                        <FaTrashAlt
                          className="iconPaddig"
                          onClick={(e) => handleDelete(e, item)}
                        /> */}
                      </td>
                    </tr>


                  ))
                ) : (
                  <tr>
                    <td colSpan="14" className="center_align">No records found</td>
                  </tr>
                )}
              </tbody>
            </table>
            </center>
            </div>
            </div>
        </div>
    )
}

export default UserMaster;