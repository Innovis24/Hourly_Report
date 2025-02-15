import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./UserMaster.css";
import Home from './Home'


const apiUrl = "http://localhost/hourly_report/Login.php";
function UserMaster() {
    const [currentuser, setcurrentuser] = useState();
    const [currentuserName, setcurrentuserName] = useState();
    const [Array, setArray] = useState([]);
    const navigate = useNavigate(); // For go to login page the navigate function

    useEffect(() => {
        getapi()
        const value =  JSON.parse(localStorage.getItem('currentUsername'));
        const usernameVal = value[0].Name
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
 

    return (
        <div>

            <div className="App">
               <Home  title="User Master"  />
                <div className="App scrollit_UM table_scroll">

<center>
            <table className="padding_top3">
              <thead className="table_header3">
                <tr>
                  <th>S.No</th>
                  <th>User name</th>
                  <th>User Role</th>
                  <th>Branch name</th>
                  {/* <th>Action</th> */}
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

                      {/* <td> */}

                        {/* <FaEdit
                          className="iconPaddig"
                          onClick={(e) => handleUpdate(e, item)}
                        />
                        <FaTrashAlt
                          className="iconPaddig"
                          onClick={(e) => handleDelete(e, item)}
                        /> */}
                      {/* </td> */}
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