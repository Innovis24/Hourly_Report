// Hourly_Report.js
import React, { useState, useEffect } from "react";
import "./Hourly_Report.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import {  FaEdit, FaTrashAlt } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark  } from '@fortawesome/free-solid-svg-icons';
import Home from "./Home";
import {formatDateForDisplay,HOUR_REPORT,USER_MASTER} from '../utlis/services';


function HourlyReport() {
  const [startDate, setStartDate] = useState(new Date());
  const [selectDateDD,setselectDateDD] = useState(new Date())
  const [startTime, setstartTime] = useState("24");
  const [startTimeText, setstartTimeText] = useState("");
  const [Pettycash, setPettyCash] = useState("");
  const [AmountTaken, setAmountTaken] = useState("");
  const [Sales, setSales] = useState("");
  const [currentID, setID] = useState("");
  const [Showlist, setShowlist] = useState(true);
  const [showsubmit, setSubmitButton] = useState(true);
  const [currentRole, setcurrentRole] = useState();
  const [RecentCashinHand, setRecentCashinHand] = useState("");
  const formattedDate = format(startDate, "yyyy-MM-dd");
  const getIDFormat = format(startDate, "yyyyMMdd");
  const [filteredData, setFilteredData] = useState([]);
  const [todayFilterData, settodayFilterData] = useState([]);
  const [branchNamelist, setbranchNamelist] = useState("");
  const [selectBranchname, setselectBranchname] = useState("");
 const [currentuser, setcurrentuser] = useState();
   const [recentuser, setrecentuser] = useState();
   const [rowsPerPage, setrowsPerPage] = useState(5);
   const [curretnBranchname, setcurretnBranchname] = useState();
  const [ArrayVal, setArray] = useState([
    {
      ID: "",
      id: "",
      start_time: "",
      petty_cash: "",
      amount_taken: "",
      Sales: "",
      totalamount: "",
      cashin_hand: "",
    },
  ]);
  
  ///pagination
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = filteredData.slice(startIndex, endIndex);
  const totalPages = filteredData.length > 0 ? Math.ceil(filteredData.length / rowsPerPage) : 0;
  const totalRecord = filteredData.length;


  useEffect(() => {
    // Update filtered data state
   
    const value =  JSON.parse(localStorage.getItem('currentUsername'));
    
    const username = value[0].Name
    setcurrentRole(value[0].UserRole)
    setcurrentuser(username)
    const nameParts = username.charAt(0);
    setrecentuser(nameParts);
    setcurretnBranchname(value[0].BranchName)
   
    getapi(value[0].BranchName);
    getBranchName();
    gettodayApi(value[0].BranchName)
  }, []);

  const Time = [
    { value: "24", text: "" },
    { value: "0", text: "12:00 AM" },
    { value: "1", text: "1:00 AM" },
    { value: "2", text: "2:00 AM" },
    { value: "3", text: "3:00 AM" },
    { value: "4", text: "4:00 AM" },
    { value: "5", text: "5:00 AM" },
    { value: "6", text: "6:00 AM" },
    { value: "7", text: "7:00 AM" },
    { value: "8", text: "8:00 AM" },
    { value: "9", text: "9:00 AM" },
    { value: "10", text: "10:00 AM" },
    { value: "11", text: "11:00 AM" },
    { value: "12", text: "12:00 PM" },
    { value: "13", text: "1:00 PM" },
    { value: "14", text: "2:00 PM" },
    { value: "15", text: "3:00 PM" },
    { value: "16", text: "4:00 PM" },
    { value: "17", text: "5:00 PM" },
    { value: "18", text: "6:00 PM" },
    { value: "19", text: "7:00 PM" },
    { value: "20", text: "8:00 PM" },
    { value: "21", text: "9:00 PM" },
    { value: "22", text: "10:00 PM" },
    { value: "23", text: "11:00 PM" },
  ];

  const handleBranchChange = (e) => {
    setselectBranchname(e.target.value);
    handleselectDateval(e.target.value,selectDateDD)
  };
  const getapi = (Branch) => {
    axios
      .get(HOUR_REPORT)
      .then((response) => {
        if(Branch){
          const filterbranch = response.data.filter((item)=>item.BranchName === Branch)

          setArray(filterbranch);
          setFilteredData(filterbranch)
        }
        else{
          setArray(response.data);
          setFilteredData(response.data)
        }
      })
      .catch((error) => console.error("Error fetching users:", error));
  };

  const handleselectDateval = (branch,dateval) => {
    axios
    .get(HOUR_REPORT + '?action=getReports') // in this place use two api so mention it(action).
    .then((response) => {
      if(branch && !dateval){
        const filterbranch = response.data.filter((item)=>item.BranchName === branch)
        setFilteredData(filterbranch); 
       }
       else if(!branch && dateval){
        if(curretnBranchname){
          const filterbranch = response.data.filter((item)=>item.BranchName === curretnBranchname)
          const formattedDate = format(dateval, "yyyy-MM-dd"); // Format the selected date
          const filteredate = filterbranch.filter((item) => item.Date === formattedDate); // Filter by date
          setFilteredData(filteredate); 
          return
        }
        const formattedDate = format(dateval, "yyyy-MM-dd"); // Format the selected date
        const filteredate = response.data.filter((item) => item.Date === formattedDate); // Filter by date
        setFilteredData(filteredate); 
       }
       else if(!branch && !dateval){
        if(curretnBranchname){
          const filterbranch = response.data.filter((item)=>item.BranchName === curretnBranchname)
          setFilteredData(filterbranch); 
        return
        }
        setFilteredData(response.data); 
       }
       else{
        const filterbranch = response.data.filter((item)=>item.BranchName === branch)
        const formattedDate = format(dateval, "yyyy-MM-dd"); // Format the selected date
        const filteredate = filterbranch.filter((item) => item.Date === formattedDate); // Filter by date
        setFilteredData(filteredate); 
       
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

  const getBranchName = () => {
    axios
      .get(USER_MASTER+'?action=getbranchName')
      .then((response) => {
        setbranchNamelist(response.data);
      })
      .catch((error) => console.error("Error fetching users:", error));
  };
  const clearBranch=()=>{
    setselectBranchname("");
    handleselectDateval('',selectDateDD)
  }

  const clearDate = () =>{
    setselectDateDD(null)
    handleselectDateval(selectBranchname,'')  
  }
 
    const gettodayApi=(valuebn)=>{
      // settodayFilterData
      axios
      .get(HOUR_REPORT)
      .then((response) => {
      
          const filterbranch = response.data.filter((item)=>item.BranchName === valuebn)

          const formattedDate = format(new Date(), "yyyy-MM-dd"); // Format the selected date
          const filtered = filterbranch.filter((item) => item.Date === formattedDate); // Filter by date
          settodayFilterData(filtered)
        
      })
      .catch((error) => console.error("Error fetching users:", error));
    } 

   
    const usedTimes = todayFilterData.map((item) => item.endtime);
  
    // Filter out used times from the Time array
    const filteredTime = Time.filter(
      (option) => !usedTimes.includes(option.text)
    );
  
    let tempTime = []
    let SortedTime = []
     if(showsubmit === false){
      
      const updatedTime = Time.filter((item)=>item.text === startTimeText)
      tempTime = [...filteredTime,...updatedTime]
      SortedTime = tempTime.sort((a, b) => {
        const timeA = a.value;
        const timeB = b.value;
        return timeA - timeB;
      });
  
     }
    
  
    const options = showsubmit === false ? SortedTime.map((option) => {
      return <option value={option.value}>{option.text}</option>;
    }) : filteredTime.map((option) => {
      return <option value={option.value}>{option.text}</option>;
    });
 
  const handlesetstartTime = (event) => {
    const selectedIndex = event.target.selectedIndex;
    const selectedText = event.target.options[selectedIndex].text;
    setstartTimeText(selectedText);
    setstartTime(event.target.value);
  };
  // ID
  const generateID = () => {
    const timeStr = startTimeText;

    const convertTime = (timeStr) => {
      const [time, modifier] = timeStr.split(" ");
      let [hours, minutes] = time.split(":");
      if (hours === "12") {
        hours = "00";
      }
      if (modifier === "PM") {
        hours = parseInt(hours, 10) + 12;
      }
      return `${hours}${minutes}`;
    };
    const convertedTime = convertTime(timeStr);
    return convertedTime;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      startTime === "" ||
      Pettycash === "" ||
      AmountTaken === "" ||
      startDate === "" ||
      startDate === null
    ) {
      notify();
      return;
    } else {
      if (showsubmit === true) {
        const tempID = generateID();
        const getIDx = String(tempID).length === 3 ? 0 + tempID : tempID;
        const IDvalue = getIDFormat + getIDx;

        const newarray = {
          sno: "",
          Date: formattedDate,
          ID: Number(IDvalue),
          endtime: startTimeText,
          pettycash: Pettycash,
          amounttaken: AmountTaken,
          Sales: 0,
          totalamount: 0,
          cashinhand: 0,
          BranchName:curretnBranchname,
          ManagerName:currentuser
        };
        //when you entered unorder data also calculated
        const updatedData = [...filteredData, newarray];
        const sortedData = updatedData.sort((a, b) => {
          const timeA = a.ID;
          const timeB = b.ID;
          return timeA - timeB;
        });

        let cumulativeAmount = 0;
        
        const processedData = sortedData.map((entry, index) => {
          cumulativeAmount += parseInt(entry.amounttaken); // Add current entry's amounttaken
          const previousAmountTaken =
            index > 0 ? parseInt(sortedData[index - 1].amounttaken || 0) : 0;
          const totalAmount =
            previousAmountTaken +
            parseInt(entry.amounttaken || 0) +
            parseInt(entry.pettycash || 0);

          const currentPettyCash = parseInt(entry.pettycash || 0);
          const currentAmountTaken = parseInt(entry.amounttaken || 0);
          const previousPettyCash =
            index > 0 ? parseInt(sortedData[index - 1].pettycash || 0) : 0;
          // Calculate sales
          const sales =
            currentPettyCash + currentAmountTaken - previousPettyCash;
          const salesVal = Math.abs(sales);
          return {
            ...entry,
            totalamount: totalAmount.toString(),
            cashinhand: cumulativeAmount.toString(), // Update cashinhand with cumulative amount
            Sales: salesVal.toString(),
          };
        });

        axios
          .post(HOUR_REPORT, processedData)
          .then((response) => {
            // alert(response.data.message);
            toast.success("Entry added successfully!");
            // setShowlist(true);
          // setSubmitButton(true);
            getapi(curretnBranchname);
            gettodayApi(curretnBranchname);
          })
          .catch((error) => console.error("Error adding user:", error));
      } else {

        const tempID = generateID();
        const getIDx = String(tempID).length === 3 ? 0 + tempID : tempID;
        const IDvalue = getIDFormat + getIDx;
       
        let  newArray1 = {
          sno: "",
          Date: formattedDate,
          ID: (IDvalue),
          endtime: startTimeText,
          pettycash: Pettycash,
          amounttaken: AmountTaken,
          Sales: 0,
          totalamount: 0,
          cashinhand: 0,
          BranchName:curretnBranchname
        };
        

        const updatedData = [...filteredData];  // Clone the data array to avoid direct mutation
        const recordIndex = updatedData.findIndex((record) => record.ID === newArray1.ID);
        
        // Update the record values
        if (recordIndex !== -1) {
          updatedData[recordIndex] = { ...updatedData[recordIndex], ...newArray1 };
        }

        let cumulativeAmount = 0;  // This will track the total `cashinhand` value for all records up to the current one

        const processedData = updatedData.map((entry, index) => {
          // Calculate totalAmount for current record
          const previousAmountTaken = 
          index > 0 ? parseInt(updatedData[index - 1].amounttaken || 0) : 0;
          const currentPettyCash = parseInt(entry.pettycash || 0);
          const currentAmountTaken = parseInt(entry.amounttaken || 0);
          const totalAmount = previousAmountTaken + currentPettyCash + currentAmountTaken;
        
          // Calculate sales for the current record
          const previousPettyCash = index > 0 ? parseInt(updatedData[index - 1].pettycash || 0) : 0;
          const sales = Math.abs(currentPettyCash + currentAmountTaken - previousPettyCash);
        
          // Update cashinhand with cumulative amount taken
          cumulativeAmount += currentAmountTaken;
        
          // Return the updated record with recalculated values
          return {
            ...entry,
            totalamount: totalAmount.toString(),
            cashinhand: cumulativeAmount.toString(),
            Sales: sales.toString(),
          };
        });
        axios
        .put(HOUR_REPORT, processedData)
        .then((response) => {
          toast.success("Entry update successfully!");
          setShowlist(true);
          setSubmitButton(true);
          gettodayApi(curretnBranchname);
          getapi(curretnBranchname);  // Optional: refresh the data
          handleselectDateval(selectBranchname,selectDateDD)
        })
        .catch((error) => console.error("Error updating data:", error));        

      }
    }
    setPettyCash("");
    setAmountTaken("");
    setstartTime("24");
    setCurrentPage(1)
  };

  const handleDelete = async (e, item) => {
    try {
      const response = await axios.delete(HOUR_REPORT, {
        data: { Date : item.Date,
          ID: item.ID,
          BranchName:curretnBranchname
        },
         // Send the record ID as payload
      });

      if (response.data.message) {
        alert(response.data.message);
      } else if (response.data.error) {
        alert(response.data.error);
      }

      // Fetch updated data after deletion
      getapi(curretnBranchname);
    } catch (error) {
      console.error("Error deleting record:", error);
    }
    setCurrentPage(1)
  };


  const handleUpdate = (e, item) => {
    e.preventDefault();
    setShowlist(false); //open create form
    setSubmitButton(false); //set submit button

    const getTime = Time.filter((u) => u.text === item.endtime);
    setstartTime(getTime[0].value);
    setstartTimeText(getTime[0].text);
    setPettyCash(item.pettycash);
    setAmountTaken(item.amounttaken);
    setSales(item.Sales);
    setID(item.ID);
    //get recent update amountFaken for update calculate cash in hand
    setRecentCashinHand(item.amounttaken);
  };

  const showlistitem = () => {
    setPettyCash("");
    setAmountTaken("");
    setstartTime("24");
    setSubmitButton(true)
    setShowlist(true); //open list form
  };
  const listformShow = (event) => {
    
    setShowlist(false); //open list form
    gettodayApi(curretnBranchname)
  };

  const handleSelectDate = (date)=>{

    setselectDateDD(date)
    handleselectDateval(selectBranchname,date)
  }
  const handleRowsPerPageChange = (e) => {
    setrowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing rows per page
  };
  const notify = () => toast.error("Please fill all details");

  const handleSetTime = ()=>{
    const nowDate = new Date()
    setStartDate(nowDate)
    
  }

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

  
  return (
    <div>
      <ToastContainer />
      <div className="scroll-container">
 
       
       <Home  title="Hourly Report"  />
       { curretnBranchname && 
        <div  className="branchname">
          <div className="branchName_style">
            {curretnBranchname}
          </div>
        </div> }
        {Showlist === false && (
        <div className="dipaly_flex_back">
        <button type="button"  className="submitBtn submit_margin_btm"  onClick={showlistitem}>
                   Back
                  </button>
        </div>
        )}
       
        {/* create form start */}
        {Showlist === false && (
          <div className="card_design">
            <form >
            
              <div className="body_padding">
             
                <div >
                  <DatePicker
                    showIcon
                    selected={startDate}
                    dateFormat="dd-MM-yyyy"
                    minDate={new Date()}
                    maxDate={new Date()}
                    onChange={handleSetTime}
                    // onChange={(date) => setStartDate(date)}
                  />
                </div>
                <div className="row_align">
                  <label className="txt_transform">End Time </label>

                  <select
                    style={{
                      background: "white",
                      border: "1px solid black",
                      borderRadius: 5,
                      marginBottom: 10,
                    }}
                    value={startTime}
                    className="form-input time_wt"
                    onChange={handlesetstartTime}
                  >
                    {options}
                  </select>
                </div>

                <div className="body2 row_align">
                  <span>
                    <span>Petty Cash</span>
                  </span>
                  <input
                    type="number"
                    value={Pettycash}
                    className="form-input"
                    onChange={(e) => setPettyCash(e.target.value)}
                  />
                </div>
                <div className="body3 row_align">
                  <span>Amount Taken </span>
                  <input
                    type="number"
                    className="form-input"
                    value={AmountTaken}
                    onChange={(e) => setAmountTaken(e.target.value)}
                  />
                </div>
              </div>
              {Showlist === false && (
                <div>
                  <button type="submit" className="submitBtn submit_margin_btm upd_btn" onClick={handleSubmit}>
                    {showsubmit === false ? "Update" : "Submit"}
                  </button>
                  
                </div>
        )}
            </form>
               {/* form end */}
        
          </div>
        )}
       
     
      
     
      {Showlist === true && (
        <div className={currentRole ==='Admin' ? "form-container mrg_tp20" : "form-container"}>
          {/* // <div className="form-container"> */}

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
            <label className='head_style mrg_top10DH'>Select Date: </label>
            <div className="fomr_row">
            <DatePicker
              selected={selectDateDD}
              dateFormat="dd-MM-yyyy"
              className="mrg_top10 custom-datepicker"
              maxDate={new Date()}
              onChange={handleSelectDate}
            />
             <FontAwesomeIcon icon={faCircleXmark}
                                  onClick={clearDate}
                                   className="icon_cl color_logout"/>
              </div>
          </div>
          { currentRole !== "Admin" && 
          <button className="submitBtn"  onClick={listformShow}>
            Add Report
          </button>
            }
      
        </div>

      )}
   
      {/* lisst screen start */}

      {Showlist === true && (
        <form className="marginleft">
         
       
          <div className="App scrollit_HR table_scroll">
            <center>
            <table className="padding_top">
              <thead className="table_header">
                <tr>
                  <th className="HeadingPaddig">Sno.</th>
                  <th className="HeadingPaddig">ID</th>
                  <th className="HeadingPaddig">Branch</th>
                  <th className="HeadingPaddig">Date</th>
                  <th className="HeadingPaddig">Time</th>
                  <th className="HeadingPaddig">Petty Cash</th>
                  <th className="HeadingPaddig">Amount Taken</th>
                  <th className="HeadingPaddig">Sales</th>
                  <th className="HeadingPaddig">Total Amount</th>
                  <th className="HeadingPaddig">Cash in Hand</th>

                  <th>Action</th>
                  {/* <th className="HeadingPaddig">Total Cash</th> */}
                </tr>
              </thead>

              <tbody className="list">
                {currentRows.length > 0 ? (
                  currentRows.map((item, index) => (
                    <tr key={index}>
                      {/* <td>{index + 1}</td> */}
                      <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                      <td>{item.ID}</td>
                      <td>{item.BranchName}</td>
                      <td>{formatDateForDisplay(item.Date)}</td>
                      <td>{item.endtime}</td>
                      <td>{item.pettycash}</td>
                      <td>{item.amounttaken}</td>
                      <td>{Math.abs(item.Sales)}</td>
                      <td>{Math.abs(item.totalamount)}</td>
                      <td>{Math.abs(item.cashinhand)}</td>
                      <td>
                    
                      <div>
                      { currentRole === "Admin" ?
                        <button  className="btn_disable" disabled>
                        <FaEdit
                        />
                       </button> :
                      
                      <FaEdit
                       className="iconPaddig"
                        
                       onClick={(e) => handleUpdate(e, item)}
                     />
                        }
                         { currentRole === "Admin" ?
                        <button className="btn_disable" disabled>
                        <FaTrashAlt
                        />
                        </button> :
                         <FaTrashAlt
                         className="iconPaddig"
                         onClick={(e) => handleDelete(e, item)}
                       />
                         }
                      </div>
                      
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="center_align">
                      No records available for the chosen date.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            </center>
            
          </div>
          
          <div className="tbale_postion_stick">
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
          
        </form>
      )}
    </div>
    </div>
  );
}

export default HourlyReport;
