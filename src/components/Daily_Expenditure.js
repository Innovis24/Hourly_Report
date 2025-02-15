import React, { useState, useEffect } from "react";
import "./Daily_Expenditure.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { FaTrashAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut, faUser,faCircleXmark  } from '@fortawesome/free-solid-svg-icons';
import Popup from 'reactjs-popup';
const apiUrl = "http://localhost/hourly_report/Daily_Expenditure.php";
const user_api = "http://localhost/hourly_report/User_Master.php";

function DailyExpenditure() {
  const [startDate, setStartDate] = useState(new Date());
  const [showList, setShowList] = useState(true);
  const [Itemname, setItemname] = useState("");
  const [amount, setAmount] = useState("");
  const [dataArray, setDataArray] = useState([]);
  const [Itemnameoptions, setItemnameoptions] = useState([]);
  const formattedDate = format(startDate, "yyyy-MM-dd");
  const [filterDate, setFilterDate] = useState(); // Filter date for the table
  const [totalAmount, setTotalAmount] = useState(0);
  const [currentuser, setcurrentuser] = useState();
  const [currentRole, setcurrentRole] = useState();
  const [openpopup, setopenpopup] = useState();
  const [curretnBranchname, setcurretnBranchname] = useState();
  const [selectBranchname, setselectBranchname] = useState("");
  const [recentuser, setrecentuser] = useState();
  const [branchNamelist, setbranchNamelist] = useState("");
 
const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(false);
    const navigate = useNavigate(); // For go to login page the navigate function
    const OpenUser=()=>{
      setopenpopup(!openpopup);
    }
  
  useEffect(() => {
    getBranchName();
    const value =  JSON.parse(localStorage.getItem('currentUsername'));
    const usernameVal = value[0].Name
    setcurrentuser(usernameVal)
    const nameParts = usernameVal.charAt(0);
    setcurrentRole(value[0].UserRole)
    setrecentuser(nameParts);
    setcurretnBranchname(value[0].BranchName);
    
    fetchApiData(value[0].BranchName); // Fetch expenditure data
    getUserapi(); // Fetch item list
  }, []);
  

  // Fetch expenditure data
  const fetchApiData = (branchval) => {
    const params = filterDate
      ? `?action=getReports&filterDate=${format(filterDate, "yyyy-MM-dd")}`
      : "?action=getReports";
  
    axios
      .get(apiUrl + params)
      .then((response) => {
        if(branchval){
          const filterbranch = response.data.filter((item)=>item.BranchName === branchval)
          setDataArray(filterbranch);
          const total = totalval(filterbranch)
          setTotalAmount(total);
        }
        else{
          setDataArray(response.data);
          const total = totalval(response.data)
          setTotalAmount(total);
        }
        
      })
      .catch((error) => console.error("Error fetching data:", error));
  };
  const totalval=(totalVal)=>{
    const total = totalVal.reduce(
      (acc, entry) => acc + parseFloat(entry.Amount || 0),
      0
    );
    return total;
  }
  const getBranchName = () => {
    axios
      .get(user_api+'?action=getbranchName')
      .then((response) => {
        setbranchNamelist(response.data);
      })
      .catch((error) => console.error("Error fetching users:", error));
  };
  const clearDate=()=>{
    setFilterDate(null);
    handleselectDateval(selectBranchname,'')
  }
  const clearBranch=()=>{
       setselectBranchname("")
    handleselectDateval('',filterDate)
  }
  const handleBranchChange = (e) => {
    setselectBranchname(e.target.value);
    handleselectDateval(e.target.value,filterDate)
  };
  const handleSelectDate = (value)=>{
    setFilterDate(value)
    handleselectDateval(selectBranchname,value)
  }
  // Fetch item list
  const getUserapi = () => {
    axios
      .get(apiUrl + '?action=getitemlist') // Fetch item list from API
      .then((response) => {
        const options = response.data.map((item) => ({
          value: item.Itemname, // Value for the dropdown
          label: item.Itemname, // Label displayed in the dropdown
        }));
        setItemnameoptions(options); // Set the formatted options to state
      })
      .catch((error) => {
        console.error("Error fetching item list:", error);
        toast.error("Failed to load item list!");
      });
  };
  
 
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formattedDate || !Itemname || !amount || formattedDate === "1970-01-01") {
      toast.error("Please fill in all fields!");
      return;
    }

    const newEntry = {
      Date: formattedDate,
      Itemname: Itemname,
      Amount: amount,
      BranchName:curretnBranchname,
      ManagerName:currentuser
    };

    axios
      .post(apiUrl, newEntry)
      .then(() => {
        toast.success("Data submitted successfully!");
        fetchApiData(curretnBranchname);
        setItemname("");
        setAmount("");
        setStartDate(new Date());
      })
      .catch((error) => {
        console.error("Failed to submit data:", error);
        toast.error("Failed to submit data. Please try again.");
      });
  };


   // Handle delete operation
   const handleDelete = async (e, item) => {
    try {
      const response = await axios.delete(apiUrl, {
        data: { Sno: Number(item.Sno )}, // Send the Sno for deletion
      });
  
      if (response.status === 200) {
        toast.success("Record deleted successfully!");
        fetchApiData(curretnBranchname); // Refresh the list after deletion
      } else {
        toast.error(response.data.error || "Failed to delete record.");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      toast.error("Failed to delete record. Please try again.");
    }
  };

  const handleselectDateval = (branch,dateval) => {
    axios
    .get(apiUrl + '?action=getReports') // in this place use two api so mention it(action).
    .then((response) => {
      if(branch && !dateval){
        const filterbranch = response.data.filter((item)=>item.BranchName === branch)
        setDataArray(filterbranch); 
        const total = totalval(filterbranch)
        setTotalAmount(total);
       }
       else if(!branch && dateval){
        if(curretnBranchname){
          const filterbranch = response.data.filter((item)=>item.BranchName === curretnBranchname)
          const formattedDate = format(dateval, "yyyy-MM-dd"); // Format the selected date
          const filteredate = filterbranch.filter((item) => item.Date === formattedDate); // Filter by date
          setDataArray(filteredate); 
          const total = totalval(filteredate)
          setTotalAmount(total);
          return
        }
        const formattedDate = format(dateval, "yyyy-MM-dd"); // Format the selected date
        const filteredate = response.data.filter((item) => item.Date === formattedDate); // Filter by date
        setDataArray(filteredate); 
        const total = totalval(filteredate)
        setTotalAmount(total);
       }
       else if(!branch && !dateval){
        if(curretnBranchname){
          const filterbranch = response.data.filter((item)=>item.BranchName === curretnBranchname)
          setDataArray(filterbranch); 
          const total = totalval(filterbranch)
          setTotalAmount(total);
        return
        }
        setDataArray(response.data); 
        const total = totalval(response.data)
        setTotalAmount(total);
       }
       else{
        const filterbranch = response.data.filter((item)=>item.BranchName === branch)
        const formattedDate = format(dateval, "yyyy-MM-dd"); // Format the selected date
        const filteredate = filterbranch.filter((item) => item.Date === formattedDate); // Filter by date
        setDataArray(filteredate); 
        const total = totalval(filteredate)
        setTotalAmount(total);
       }
     
    })
    .catch((error) => {
      console.error("Error fetching daily reports:", error);
      toast.error("Error fetching daily reports");
    });
  }
  
  const handleListToggle = () => {
    setShowList(!showList);
  };    

  const handleExit = () => {
    localStorage.clear();
    navigate("/")
  };
  const OpenPopupcard = () => {
    setIsOpen(true)
  }
  return (
    <div>
      <ToastContainer />
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

                {openpopup && (
                <div className="menu_card ">
                   <div className="userName ">
                    <FontAwesomeIcon icon={faUser} className="color_logout mrg_rgt"/>
                    <div className="cls_imagecolor">{currentuser}</div>
                   </div>
                 
                   <div className="logout_btn cursor_logout" onClick={OpenPopupcard}>
                          <FontAwesomeIcon icon={faSignOut} className="mrg_lft_card color_logout"/>
                          <button className="logout_alignment" >
                            Logout
                          </button>
                        </div>
                </div>
              )}
      <div className="App">
        <div className="header_font"><b>DAILY EXPENDITURE</b>
        <div className="header_buttons">
        <button className="icon_button user_border_radius" type="submit"   title={currentuser} onClick={OpenUser}>
              {/* <FaUser size={20} /> */}
              {recentuser}
            </button>
                    {/* <button
              className="icon_button"
              title="Logout"
              onClick={handleExit} // Add click handler
            >
                      <FaSignOutAlt size={20} />
                    </button> */}
                  </div></div>
                 
                  { curretnBranchname && 
        <div  className="branchname">
          <div className="branchName_style">
            {curretnBranchname}
          </div>
        </div> }

        {showList && (
        <div className={currentRole ==='Admin' ? "form-container mrg_tp20" : "form-container"}>
           { currentRole === "Admin" && 
                              <div className="form-group mrg_bmt10pf">
                              <div className='head_style'>Branch Name : </div>
                              <div className="fomr_row">
                              <select
                                  className="branch_style"
                                  value={selectBranchname} // Bind state value
                                  onChange={handleBranchChange} // Update state when the user selects a branch
                                >
                               
                                  <option value="" disabled>Select Branch</option>
                                  {/* Map through the branches array and create an option for each */}
                                  {branchNamelist && branchNamelist.map((branch) => (
                                    <option key={branch.Sno} value={branch.Branchname}>
                                      {branch.Branchname}
                                    </option>
                                  ))}
                                </select>
                                <FontAwesomeIcon icon={faCircleXmark}
                                onClick={clearBranch}
                                 className="icon_cl color_logout"/>
                              </div>
                             
                              
                                
                            </div>
                        }
          <div className="form-group">
                      <label htmlFor="date-filter"  className='head_style'>Select Date: </label>
                      <div className="fomr_row">
                      <DatePicker
                        selected={filterDate}
                        dateFormat="yyyy-MM-dd"
                        className="mrg_top10 custom-datepicker"
                        maxDate={new Date()}
                        id="date-filter"
                        placeholderText="Select a date"
                        onChange={(date) => handleSelectDate(date)}
                      />
                      <FontAwesomeIcon icon={faCircleXmark}
                                            onClick={clearDate}
                                             className="icon_cl color_logout"/>
                      </div>
                     
                    </div>
                    { currentRole !== "Admin" && 
                <button className="back_btn" onClick={handleListToggle}>
                  Back
                </button>
                  }
                </div>
                )
      
        }

         {!showList &&
        <button className="listbtn submitbutton" onClick={handleListToggle}>
         Daily Expenditure List
        </button>
        }
  

        {!showList && (
          <div className="card_design3">
            <form onSubmit={handleSubmit}>
              <div className="body_padding3">
                <label htmlFor="date-picker" style={{ marginRight: "10px" }}>
                  Select Date:
                </label>
                <div>
                <DatePicker
                  selected={startDate}
                  dateFormat="yyyy-MM-dd"
                  maxDate={new Date()}
                  onChange={(date) => setStartDate(date)}
                  id="date-picker"
                />
                </div>
             
                <div className="body3 row_align1  itemname_align">
                  <span>Item Name</span>
                  <Select
                  options={Itemnameoptions} // Options for dropdown
                  value={Itemname ? { value: Itemname, label: Itemname } : null} // Current selected value
                  onChange={(selectedOption) => setItemname(selectedOption.value)} // Update state when an option is selected
                  placeholder="Select an item"
                  isSearchable // Makes the dropdown searchable
                  className="form-select" // Add any custom styles
                />

                </div>
                
                <div className="body3 row_align">
                  <span>Amount</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="amount_align"
                  />
                </div>
              </div>
              <button className="submitbutton submit_margin_btm" type="submit">
                Submit
              </button>
            </form>
          </div>
        )}

        {showList && (
          <div className="table_container3">   
           <center><div className="card3">
           <div className="cashtaken">Total Expenditure</div>
           <div className="total">₹ {totalAmount.toFixed(2)} </div>{/* Format to 2 decimal places */}
              </div></center>

            <center>         
               <div className="table_align3  scrollit_de table_scroll">
            <table className="padding_top3">
              <thead className="table_header3">
                <tr>
                  <th>S. No</th> 
                  <th>Branch Name</th>
                  <th>Date</th>
                  <th>Item Name</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dataArray.length > 0 ? (
                  dataArray.map((entry, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{entry.BranchName}</td>
                      <td>{entry.Date}</td>
                      <td>{entry.Itemname}</td>
                      <td>{entry.Amount}</td>
                         <td>
                         { currentRole === "Admin" ?
                         <button className="btn_disable">
                              <FaTrashAlt />
                         </button>
                          : 
                        <FaTrashAlt
                        className="iconPaddig"
                        onClick={(e) => handleDelete(e, entry)} />
                      }
                                            </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="center_align">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
            </div>
            </center>
          </div>
        )}

      

      </div>
 </div>
  )
}

export default DailyExpenditure;
