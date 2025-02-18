import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./Daily_Report.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut, faUser ,faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import Home from './Home'
import {formatDateForDisplay,DAILY_REPORT,USER_MASTER} from '../utlis/services'



function DailyReport() {
  const [startDate, setStartDate] = useState(new Date());
  const [selectDate, setselectDate] = useState(new Date());
  const [cashAmount, setCashAmount] = useState("");
  const [reportedTo, setReportedTo] = useState("");
  const [cashHolder, setCashHolder] = useState("");
  const [gPay, setGPay] = useState("");
  const [gPayHolder, setGPayHolder] = useState("");
  const [pettyCash, setPettyCash] = useState("");
  const [reportedToOptions, setReportedToOptions] = useState([]); // State for dropdown options
  const [cashholderOptions, setCashHolderOptions] = useState([]);
  const [GPayHolderOptions, setGPayHolderOptions] = useState([]);
  const [holderCashTaken, setHolderCashTaken] = useState({});

  const [showList, setShowList] = useState(true);
  const [showsubmit, setSubmitButton] = useState(true);
  const formattedDate = format(startDate, "yyyy-MM-dd");
   const [currentRole, setcurrentRole] = useState();
  const [currentuser, setcurrentuser] = useState();
    const [branchNamelist, setbranchNamelist] = useState("");
    const [selectBranchname, setselectBranchname] = useState("");
    const [recentuser, setrecentuser] = useState();
  const [ArrayVal, setArray] = useState([
    {
      Sno: "",
      Date: "",
      Day: "",
      CashAmount: "",
      Reportedto: "",
      CashHolder: "",
      Gpay: "",
      GpayHolder: "",
      PettyCash: "",
      Total: "",
      ActualCollection: "",
      CashTaken: "",
      TotalCashinTaken: "",
    },
  ]);
   const [curretnBranchname, setcurretnBranchname] = useState();

   ///pagination
      const [currentPage, setCurrentPage] = useState(1);
      const [rowsPerPage, setrowsPerPage] = useState(5);
      const startIndex = (currentPage - 1) * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      const currentRows = ArrayVal.slice(startIndex, endIndex);
      const totalPages = ArrayVal.length > 0 ? Math.ceil(ArrayVal.length / rowsPerPage) : 0;
      const totalRecord = ArrayVal.length;





  //useeffect - render every page refresh (1st render this function)
  useEffect(() => {
    // Fetch options for the "Reported To" dropdown
    
    const value =  JSON.parse(localStorage.getItem('currentUsername'));
    setcurrentRole(value[0].UserRole)
    const usernameVal = value[0].Name
    setcurrentuser(usernameVal)
    const nameParts = usernameVal.charAt(0);
    setrecentuser(nameParts);
    setcurretnBranchname(value[0].BranchName)
    getUserapi()
    getapi(value[0].BranchName)
    getBranchName();
  }, []);


  //get the owner list via api
  const getUserapi = () => {
    axios
      .get(DAILY_REPORT + '?action=getUsers') // in this place use two api so mention it(action).
      .then((response) => {
        const options = response.data.map((user) => ({
          value: user.UserID,
          label: user.UserName,
        }));
        setReportedToOptions(options);
        setCashHolderOptions(options);
        setGPayHolderOptions(options);


      })
      .catch((error) => console.error("Error fetching users:", error));
  };
  const handleBranchChange = (e) => {
    setselectBranchname(e.target.value);
    handleselectDateval(e.target.value,selectDate)
  };
  const handleSelectDate = (value)=>{
    setselectDate(value)
    handleselectDateval(selectBranchname,value)
  }
  const getBranchName = () => {
    axios
      .get(USER_MASTER+'?action=getbranchName')
      .then((response) => {
        setbranchNamelist(response.data);
      })
      .catch((error) => console.error("Error fetching users:", error));
  };
   //get the daily report list via api
  const getapi = (Branch) => {
    axios
      .get(DAILY_REPORT + '?action=getReports') // in this place use two api so mention it(action).
      .then((response) => {
        if(Branch){
          const filterbranch = response.data.filter((item)=>item.BranchName === Branch)
          setArray(filterbranch); 
          const holderCashTaken = {};
          filterbranch.forEach((entry) => {
          if (entry.cashHolder) {
            if (!holderCashTaken[entry.cashHolder]) {
              holderCashTaken[entry.cashHolder] = 0;
            }
            holderCashTaken[entry.cashHolder] += parseFloat(entry.cashAmount || 0);
          }
        });
        // console.log("HolderCashTaken Data:", holderCashTaken);
        setHolderCashTaken(holderCashTaken);
        }
        else{
          setArray(response.data); 
          const holderCashTaken = {};
          response.data.forEach((entry) => {
          if (entry.cashHolder) {
            if (!holderCashTaken[entry.cashHolder]) {
              holderCashTaken[entry.cashHolder] = 0;
            }
            holderCashTaken[entry.cashHolder] += parseFloat(entry.cashAmount || 0);
          }
        });
        // console.log("HolderCashTaken Data:", holderCashTaken);
        setHolderCashTaken(holderCashTaken);
        }
            
              
       
      })
      .catch((error) => {
        console.error("Error fetching daily reports:", error);
        toast.error("Error fetching daily reports");
      });
  }
  const handleselectDateval = (branch,dateval) => {
    axios
    .get(DAILY_REPORT + '?action=getReports') // in this place use two api so mention it(action).
    .then((response) => {
      if(branch && !dateval){
        const filterbranch = response.data.filter((item)=>item.BranchName === branch)
        setArray(filterbranch); 
        const holderCashTaken = {};
        filterbranch.forEach((entry) => {
        if (entry.cashHolder) {
          if (!holderCashTaken[entry.cashHolder]) {
            holderCashTaken[entry.cashHolder] = 0;
          }
          holderCashTaken[entry.cashHolder] += parseFloat(entry.cashAmount || 0);
        }
        });
        // console.log("HolderCashTaken Data:", holderCashTaken);
        setHolderCashTaken(holderCashTaken);
       }
       else if(!branch && dateval){
        if(curretnBranchname){
          const filterbranch = response.data.filter((item)=>item.BranchName === curretnBranchname)
          const formattedDate = format(dateval, "yyyy-MM-dd"); // Format the selected date
          const filteredate = filterbranch.filter((item) => item.Date === formattedDate); // Filter by date
          setArray(filteredate); 
          const holderCashTaken = {};
          filteredate.forEach((entry) => {
          if (entry.cashHolder) {
            if (!holderCashTaken[entry.cashHolder]) {
              holderCashTaken[entry.cashHolder] = 0;
            }
            holderCashTaken[entry.cashHolder] += parseFloat(entry.cashAmount || 0);
          }
          });
          // console.log("HolderCashTaken Data:", holderCashTaken);
          setHolderCashTaken(holderCashTaken);
          return
        }
        const formattedDate = format(dateval, "yyyy-MM-dd"); // Format the selected date
        const filteredate = response.data.filter((item) => item.Date === formattedDate); // Filter by date
        setArray(filteredate); 
        const holderCashTaken = {};
        filteredate.forEach((entry) => {
        if (entry.cashHolder) {
          if (!holderCashTaken[entry.cashHolder]) {
            holderCashTaken[entry.cashHolder] = 0;
          }
          holderCashTaken[entry.cashHolder] += parseFloat(entry.cashAmount || 0);
        }
        });
        // console.log("HolderCashTaken Data:", holderCashTaken);
        setHolderCashTaken(holderCashTaken);
       }
       else if(!branch && !dateval){
        if(curretnBranchname){
          const filterbranch = response.data.filter((item)=>item.BranchName === curretnBranchname)
          setArray(filterbranch); 
          const holderCashTaken = {};
          filterbranch.forEach((entry) => {
          if (entry.cashHolder) {
            if (!holderCashTaken[entry.cashHolder]) {
              holderCashTaken[entry.cashHolder] = 0;
            }
            holderCashTaken[entry.cashHolder] += parseFloat(entry.cashAmount || 0);
          }
        });
        setHolderCashTaken(holderCashTaken);
        return
        }
        setArray(response.data); 
        const holderCashTaken = {};
        response.data.forEach((entry) => {
        if (entry.cashHolder) {
          if (!holderCashTaken[entry.cashHolder]) {
            holderCashTaken[entry.cashHolder] = 0;
          }
          holderCashTaken[entry.cashHolder] += parseFloat(entry.cashAmount || 0);
        }
      });
      // console.log("HolderCashTaken Data:", holderCashTaken);
      setHolderCashTaken(holderCashTaken);
       }
       else{
        const filterbranch = response.data.filter((item)=>item.BranchName === branch)
        const formattedDate = format(dateval, "yyyy-MM-dd"); // Format the selected date
        const filteredate = filterbranch.filter((item) => item.Date === formattedDate); // Filter by date
        setArray(filteredate); 
        const holderCashTaken = {};
        filteredate.forEach((entry) => {
        if (entry.cashHolder) {
          if (!holderCashTaken[entry.cashHolder]) {
            holderCashTaken[entry.cashHolder] = 0;
          }
          holderCashTaken[entry.cashHolder] += parseFloat(entry.cashAmount || 0);
        }
      });
      // console.log("HolderCashTaken Data:", holderCashTaken);
      setHolderCashTaken(holderCashTaken);
       }
     
    })
    .catch((error) => {
      console.error("Error fetching daily reports:", error);
      toast.error("Error fetching daily reports");
    });
    setCurrentPage(1);
  }
  const handleRowsPerPageChange = (e) => {
    setrowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing rows per page
  };
  const clearBranch=()=>{
    setselectBranchname("")
    handleselectDateval('',selectDate)
  }
  const clearDate=()=>{
    setselectDate(null);
    handleselectDateval(selectBranchname,'')
  }
  //get the Day based on given date
  const getDayName = (dateString) => {
    const date = new Date(dateString);

    const daysOfWeek = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];

    const dayIndex = date.getDay();

    return daysOfWeek[dayIndex];
  };
  // Check Already exiting date
  const handleDateChange = (Date) => {
    if(Date === null){
      return
    }
    const formattedDate = Date.toISOString().split('T')[0]; // Format the selected date as 'yyyy-mm-dd'

    // Check if the date already exists in the filtered data
    const filteredval = ArrayVal.filter((item) => item.Date === formattedDate);

    if (filteredval.length > 0) {
      toast.error("You have already entered a value for this " + formattedDate + '.', {
        autoClose: 500, // Set toast to auto close after 5 seconds (5000 milliseconds)
      });

      return; // Prevent the date from being set if it's already in filtered data
    }
    setStartDate(Date);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //Check input value is empty or not
    if (!cashAmount || !reportedTo || !cashHolder || !gPay || !gPayHolder || !pettyCash) {

      toast.error("Please fill in all fields!");
      return;
    }
    else {
      //if true "create" or false "update"
      if (showsubmit === true) {        //create a new record
        const duplicateDate = ArrayVal.filter((item) => item.Date === formattedDate)
        if (duplicateDate.length > 0) {         //Check Already exiting date
          toast.error("This " + formattedDate + " is already exist");
          return;
        }
        const Total = Number(cashAmount) + Number(gPay) + Number(pettyCash);
        const currentDay = getDayName(formattedDate);
        const CashTaken = Number(cashAmount) + Number(gPay);
        //new entered array
        const newarray = {
          Date: formattedDate,
          Day: currentDay,
          cashAmount: cashAmount,
          reportedTo: reportedTo,
          cashHolder: cashHolder,
          gPay: gPay,
          gPayHolder: gPayHolder,
          PettyCash: pettyCash,
          Total: Total,
          ActualCollection: 0,
          CashTaken: CashTaken,
          TotalCashinTaken: 0,
          BranchName:curretnBranchname,
          ManagerName:currentuser
        };
        //bind the new array to existing array
        const updatedData = [...ArrayVal, newarray];
        //sort the array
        const sortedData = updatedData.sort((a, b) => new Date(a.Date) - new Date(b.Date));

        //calculate the amount for passing array in api --  start
        let cumulativeCashTaken = 0;
        const processedData = sortedData.map((entry, index) => {

          const currentcashAmount = parseInt(entry.cashAmount || 0);
          const currentgPay = parseInt(entry.gPay || 0);
          const currentpettyCash = parseInt(entry.PettyCash || 0);
          const previousPettyCash = index > 0 ? parseInt(updatedData[index - 1].PettyCash || 0) : 0;

          const ActualCollection = Math.abs((currentcashAmount + currentgPay + currentpettyCash) - previousPettyCash);

          cumulativeCashTaken += parseInt(entry.CashTaken);

          return {
            ...entry,
            ActualCollection: ActualCollection.toString(), // Update cashinhand with cumulative amount
            TotalCashinTaken: cumulativeCashTaken.toString(),
          };
        });
         //calculate the amount for passing array in api --  end
        console.log(processedData)

        axios
          .post(DAILY_REPORT, processedData)
          .then((response) => {
            toast.success("Entry added successfully!");
            getapi(curretnBranchname)
            setShowList(true); // Show the report list
          })
          .catch((error) => {
            console.error("Error adding entry:", error);
            toast.error("Error adding entry");
          });
      }
      else {        //update the exist record
        const Total = Number(cashAmount) + Number(gPay) + Number(pettyCash);
        const currentDay = getDayName(formattedDate);
        const CashTaken = Number(cashAmount) + Number(gPay);
          //current update array
        let newArray1 = {
          Date: formattedDate,
          Day: currentDay,
          cashAmount: cashAmount,
          reportedTo: reportedTo,
          cashHolder: cashHolder,
          gPay: gPay,
          gPayHolder: gPayHolder,
          PettyCash: pettyCash,
          Total: Total,
          ActualCollection: 0,
          CashTaken: CashTaken,
          TotalCashinTaken: 0,
          BranchName:curretnBranchname,
        };


        const updatedData = [...ArrayVal];  // Clone the data array to avoid direct mutation
        //check if the given update array in exist or not
        const recordIndex = updatedData.findIndex((record) => record.Date === newArray1.Date);

        //if not exist then add the current update array to existing array
        if (recordIndex !== -1) {
          updatedData[recordIndex] = { ...updatedData[recordIndex], ...newArray1 };
        }
        const sortedData = updatedData.sort((a, b) => new Date(a.Date) - new Date(b.Date));

        //calculate the amount for passing array in api --  start
        let cumulativeCashTaken = 0;
        const processedData = sortedData.map((entry, index) => {


          const currentCashTaken = parseInt(entry.CashTaken || 0);
          const currentcashAmount = parseInt(entry.cashAmount || 0);
          const currentgPay = parseInt(entry.gPay || 0);
          const currentpettyCash = parseInt(entry.PettyCash || 0);

          const previousPettyCash = index > 0 ? parseInt(sortedData[index - 1].PettyCash || 0) : 0;

          const ActualCollection = Math.abs((currentcashAmount + currentgPay + currentpettyCash) - previousPettyCash);

          cumulativeCashTaken += currentCashTaken;

          // Return the updated record with recalculated values
          return {
            ...entry,
            ActualCollection: ActualCollection.toString(), // Update cashinhand with cumulative amount
            TotalCashinTaken: cumulativeCashTaken.toString(),
          };
        });
          //calculate the amount for passing array in api --  end
        console.log(processedData)
        axios
          .put(DAILY_REPORT, processedData)
          .then((response) => {
            toast.success("Entry update successfully!");
            getapi(curretnBranchname)
            setShowList(true); // Show the report list
          })
          .catch((error) => {
            console.error("Error adding entry:", error);
            toast.error("Error adding entry");
          });

      }
      setCashAmount('')
      setReportedTo()
      setCashHolder()
      setGPay()
      setGPayHolder()
      setPettyCash()
    }

  }

  const handleDelete = async (e, item) => {
    // alert(item.Date)
    try {
      const response = await axios.delete(DAILY_REPORT, {
        data: { Date: item.Date,BranchName:curretnBranchname },
      });
      if (response.status === 200) {
        toast.success("Data delete successfully!");
        getapi(curretnBranchname)
      } else if (response.data.error) {
        alert(response.data.error);
      }
      // fetchData();
    } catch (error) {
      console.error("Error deleting record:", error);
    }
    setCurrentPage(1);
  };

 
  //In this function set the current edit value in input field
  const handleUpdate = (e, item) => {
    e.preventDefault();
    setShowList(false); //open create form
    setSubmitButton(false); //set submit button
    setStartDate(item.Date);
    getDayName(item.Day);
    setCashAmount(item.cashAmount);
    setGPayHolder(item.gPayHolder);
    setReportedTo(item.reportedTo);
    setCashHolder(item.cashHolder);
    setGPay(item.gPay);
    setPettyCash(item.PettyCash);
  };

  const showlistitem = () => {
    setShowList(true); //open list form
  };
  const showback = () => {
    setShowList(false); //open list form
    setSubmitButton(true)
      setCashAmount('')
      setReportedTo()
      setCashHolder()
      setGPay()
      setGPayHolder()
      setPettyCash()
  };
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
  return (
    <div>
      <ToastContainer />
     
      <div className="scroll_container1">
       
      <Home  title="Daily Report"  />
     
        { curretnBranchname && 
        <div  className="branchname">
          <div className="branchName_style">
            {curretnBranchname}
          </div>
        </div> }
        {showList === false && (
          <button className="DR_back_btn" onClick={showlistitem}>
           Back
          </button>
        )}
       
        {showList === false && (
          <div className="card_design2 card_style_dailyReport">
            <form onSubmit={handleSubmit}>
              <div className="body_padding2">
                <DatePicker
                  selected={startDate}
                  dateFormat="dd-MM-yyyy"
                  // minDate={new Date()}
                  maxDate={new Date()}
                  onChange={handleDateChange}
                  showIcon
                />

                <div className="body3 row_align">
                  <span>Cash Amount</span>
                  <input
                    type="number"
                    className="form-input"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                  />
                </div>

                <div className="body3 row_align1">
                  <span>Reported To</span>
                  <Select
                    options={reportedToOptions} // Options for dropdown
                    value={reportedTo ? { value: reportedTo, label: reportedTo } : null} // Current value
                    onChange={(selectedOption) => setReportedTo(selectedOption.label)} // Update state on select
                    placeholder="Select a person"
                    isSearchable // Makes the dropdown searchable
                    className="form-select"
                  />
                </div>

                <div className="body3 row_align1">
                  <span>Cash Holder</span>
                  <Select
                    options={cashholderOptions} // Options for dropdown
                    value={cashHolder ? { value: cashHolder, label: cashHolder } : null} // Current value
                    onChange={(selectedOption) => setCashHolder(selectedOption.label)} // Update state on select
                    placeholder="Select a person"
                    isSearchable // Makes the dropdown searchable
                    className="form-select"
                  />
                </div>
                <div className="body3 row_align">
                  <span>G-Pay</span>
                  <input
                    type="number"
                    className="form-input2"
                    value={gPay}
                    onChange={(e) => setGPay(e.target.value)}
                  />
                </div>

                <div className="body3 row_align1">
                  <span>GPay Holder</span>
                  <Select
                    options={GPayHolderOptions} // Options for dropdown
                    value={gPayHolder ? { value: gPayHolder, label: gPayHolder } : null} // Current value
                    onChange={(selectedOption) => setGPayHolder(selectedOption.label)} // Update state on select
                    placeholder="Select a person"
                    isSearchable // Makes the dropdown searchable
                    className="form-select"
                  />
                </div>

                <div className="body2 row_align">
                  <span>Pettycash</span>
                  <input
                    type="number"
                    value={pettyCash}
                    className="form-input"
                    onChange={(e) => setPettyCash(e.target.value)}
                  />
                </div>
              </div>
              {showList === false && (
                <button type="submit" className="submitBtn submit_margin_btm">
                  {showsubmit === false ? "Update" : "Submit"}
                </button>
              )}
            </form>
          </div>
        )}

        
              {showList === true && (
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
                    <label className='head_style'>Select Date: </label>
                    <div className="fomr_row">

                    <DatePicker
                      selected={selectDate}
                      dateFormat="dd-MM-yyyy"
                      className="mrg_top10 custom-datepicker"
                      maxDate={new Date()}
                      onChange={(date) => handleSelectDate(date)}
                    />
                        <FontAwesomeIcon icon={faCircleXmark}
                      onClick={clearDate}
                       className="icon_cl color_logout"/>
                      </div>
                  </div>
                  { currentRole !== "Admin" && 
                  <button className="submitBtn" onClick={showback}>
                    Add Report
                  </button>
                    }
                </div>
        
              )}


        {showList === true && (
          <div>
            <div> </div>
            <div className="card-container2">
              {Object.entries(holderCashTaken).length > 0 ? (
                Object.entries(holderCashTaken).map(([cashHolder, total], index) => (
                  <div className="card2" key={index}>
                    <div>
                      <div className="cashtaken">CashTaken : </div>
                      <div className="cashholder">{cashHolder}</div>
                      <div className="total"> ₹ <span className="txt_wrap">{total}</span></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card2" style={{ height: '73px' }}>
                <div className="no-cards" style={{marginTop: "13%"}}><b>No record Found</b></div>
                </div>
              )}
            </div>

<div className="App scrollit_dr table_scroll">

<center>
            <table className="padding_top2">
              <thead className="table_header2">
                <tr>
                  <th>S. No</th>
                  <th>Branch Name</th>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Cash Amount</th>
                  <th>Reported To</th>
                  <th>Cash Holder</th>
                  <th>G-Pay</th>
                  <th>G-Pay Holder</th>
                  <th>Petty Cash</th>
                  <th>Total</th>
                  <th>ActualCollection</th>
                  <th>CashTaken</th>
                  <th>TotalCashinTaken</th>
                  <th>Action</th>
                </tr>
                {/* <tr></tr> */}
              </thead>
              <tbody>
                {currentRows.length > 0 && currentRows[0].Sno !== '' ? (
                  currentRows.map((item, index) => (
                    <tr key={index}>
                      {/* <td>{index + 1}</td> */}
                      <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                      <td>{item.BranchName}</td>
                      <td>{formatDateForDisplay(item.Date)}</td>
                      <td>{item.Day}</td>
                      <td>{item.cashAmount}</td>
                      <td>{item.reportedTo}</td>
                      <td>{item.cashHolder}</td>
                      <td>{item.gPay}</td>
                      <td>{item.gPayHolder}</td>
                      <td>{item.PettyCash}</td>
                      <td>{item.Total}</td>
                      <td>{Math.abs(item.ActualCollection)}</td>
                      <td>{Math.abs(item.CashTaken)}</td>
                      <td>{Math.abs(item.TotalCashinTaken)}</td>

                      <td>
                      { currentRole === "Admin" ? 
                       <button  className="btn_disable" disabled>
                        <FaEdit /> </button> :
                        <FaEdit
                          className="iconPaddig"
                          onClick={(e) => handleUpdate(e, item)}
                        />}
                           { currentRole === "Admin" ? 
                            <button  className="btn_disable" disabled>
                        <FaTrashAlt /> </button> :
                        <FaTrashAlt
                          className="iconPaddig"
                          onClick={(e) => handleDelete(e, item)}
                        /> }
                      </td>
                    </tr>


                  ))
                ) : (
                  <tr>
                    <td colSpan="15" className="center_align">No records found</td>
                  </tr>
                )}
              </tbody>
            </table>
            </center>
            
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
          </div>
        )}
       
      </div>
    </div>
  );
}
export default DailyReport;