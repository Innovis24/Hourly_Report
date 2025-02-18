import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./UserMaster.css";
import Home from './Home';
import {LOGIN_PHP} from '../utlis/services';

function UserMaster() {
    const [Array, setArray] = useState([]);
  
    useEffect(() => {
        getapi()
        // const value =  JSON.parse(localStorage.getItem('currentUsername'));
       
    }, []);

    const getapi = () => {
        axios
          .get(LOGIN_PHP) // in this place use two api so mention it(action).
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

<div className="scroll-container">
               <Home  title="User Master"  />
                <div className="App scrollit_UM table_scroll">

<center>
            <table className="padding_top3">
              <thead className="table_header3">
                <tr>
                  <th>S.No</th>
                  <th>Name</th>
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
                      <td>{item.Name}</td>
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