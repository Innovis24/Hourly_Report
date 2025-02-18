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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut, faUser,faCircleXmark  } from '@fortawesome/free-solid-svg-icons';
import Home from './Home';
import {formatDateForDisplay} from '../utlis/services';

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
  const [curretnBranchname, setcurretnBranchname] = useState();
  const [selectBranchname, setselectBranchname] = useState("");
  const [recentuser, setrecentuser] = useState();
  const [branchNamelist, setbranchNamelist] = useState("");

   ///pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setrowsPerPage] = useState(5);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentRows = dataArray.slice(startIndex, endIndex);
    const totalPages = dataArray.length > 0 ? Math.ceil(dataArray.length / rowsPerPage) : 0;
    const totalRecord = dataArray.length;


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
    setCurrentPage(1);
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
    setCurrentPage(1);
  }
  const goToPage = (page,e) => {
    e.preventDefault();
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const generatePagination = () => {
    const pages = [];
    const maxPagesToShow = 5; // Adjust how many pages are visible at once

    if (totalPages <= maxPagesToShow) {
      // Show all pages if totalPages is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1); // Always show first page

      if (currentPage > 3) {
        pages.push("..."); // Ellipsis before the middle pages
      }

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("..."); // Ellipsis after the middle pages
      }

      pages.push(totalPages); // Always show last page
    }

    return pages;
  };
  const handleListToggle = () => {
    setShowList(!showList);
  };    
  const handleRowsPerPageChange = (e) => {
    setrowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing rows per page
  };
 
  return (
    <div>
      <ToastContainer />
      <div className="scroll_container1">
      <Home  title="Daily Expenditure"  />
                 
                  { curretnBranchname && 
                  <div  className="branchname">
                    <div className="branchName_style">
                      {curretnBranchname}
                    </div>
                  </div> 
                  }

        {showList === false && (
                <div className="dipaly_flex_back">
                   <button className="submitBtn submit_margin_btm" onClick={handleListToggle}>
                Back
              </button>
                </div>
                )}

        {showList && (
        <div className={currentRole ==='Admin' ? "form-container mrg_tp20" : "form-container mrg_bmt1"}>
              <div className="form-group">          
          <div className='head_style'>items per page : </div>
          <select
          className="item_style"
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          >
            <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>

          </select>
          </div>
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
                        dateFormat="dd-MM-yyyy"
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
                <button className="submitBtn" onClick={handleListToggle}>
                  Add Expenditure
                </button>
                  }
                </div>
                )
      
        }

  

        {!showList && (
          <div className="card_design3">
            <form onSubmit={handleSubmit}>
              <div className="body_padding3">
                <label htmlFor="date-picker" style={{ marginRight: "10px" }}>
                  <b>Select Date:</b>
                </label>
                <div>
                <DatePicker
                  selected={startDate}
                  dateFormat="dd-MM-yyyy"
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
              <div >
              <button className="submitBtn submit_margin_btm" type="submit">
                Submit
              </button>
             
              </div>
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
                {currentRows  && currentRows.length > 0 ? (
                  currentRows.map((entry, index) => (
                    <tr key={index}>
                      {/* <td>{index + 1}</td> */}
                      <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                      <td>{entry.BranchName}</td>
                      <td>{formatDateForDisplay(entry.Date)}</td>
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
            
          <div className="sticky_footer">
          {totalPages > 1 && (
          <button onClick={(event) => goToPage(currentPage - 1,event)} disabled={currentPage === 1} className="pagination_style_reg">
            Previous
          </button>
           )}
            {totalPages > 1 && (
              <div>
                   {generatePagination().map((page, index) =>
              page === "..." ? (
                <span key={index} className="pagination-ellipsis">...</span>
              ) : (
                <button
                  key={index}
                  onClick={(event) => goToPage(page, event)}
                  className={`pagination-button ${currentPage === page ? "active" : ""}`}
                >
                  {page}
                </button>
              )
            )}
              </div>
             )}
          {totalPages > 1 && (
          <button onClick={(event) => goToPage(currentPage + 1,event)} disabled={currentPage === totalPages} className="pagination_style_reg">
            Next
          </button>
          )}
           <div className="total_style">
            <div className="total_alignment">
           Total records : 
            </div>
            <div>
              {totalRecord}
            </div>
          </div>
        </div>
         
            </div>
            </center>
           
          </div>
        )}

      

      </div>
 </div>
  )
}

export default DailyExpenditure;
