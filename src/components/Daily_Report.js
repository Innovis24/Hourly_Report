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
import Popup from 'reactjs-popup';
import { useNavigate } from "react-router-dom"; 

const apiUrl = "http://localhost/hourly_report/Daily_Report_api.php";
const user_api = "http://localhost/hourly_report/User_Master.php";

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
  const [wholeArray, setwholeArray] = useState([]);
  const [holderCashTaken, setHolderCashTaken] = useState({});

  const [showList, setShowList] = useState(true);
  const [showsubmit, setSubmitButton] = useState(true);
  const formattedDate = format(startDate, "yyyy-MM-dd");
  const [Total, setTotal] = useState("");
  const [openpopup, setopenpopup] = useState();
   const [currentRole, setcurrentRole] = useState();
  const [currentuser, setcurrentuser] = useState();
    const [branchNamelist, setbranchNamelist] = useState("");
    const [selectBranchname, setselectBranchname] = useState("");
    const [recentuser, setrecentuser] = useState();
  const [Array, setArray] = useState([
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
 const [isOpen, setIsOpen] = useState(false);
   const [curretnBranchname, setcurretnBranchname] = useState();
  const closeModal = () => setIsOpen(false);
  const navigate = useNavigate(); // For go to login page the navigate function

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
      .get(apiUrl + '?action=getUsers') // in this place use two api so mention it(action).
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
      .get(user_api+'?action=getbranchName')
      .then((response) => {
        setbranchNamelist(response.data);
      })
      .catch((error) => console.error("Error fetching users:", error));
  };
   //get the daily report list via api
  const getapi = (Branch) => {
    axios
      .get(apiUrl + '?action=getReports') // in this place use two api so mention it(action).
      .then((response) => {
        setwholeArray(response.data)
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
    .get(apiUrl + '?action=getReports') // in this place use two api so mention it(action).
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
  }

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
    const filteredval = Array.filter((item) => item.Date === formattedDate);

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
        const duplicateDate = Array.filter((item) => item.Date === formattedDate)
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
        const updatedData = [...Array, newarray];
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
          .post(apiUrl, processedData)
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


        const updatedData = [...Array];  // Clone the data array to avoid direct mutation
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
          .put(apiUrl, processedData)
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
      const response = await axios.delete(apiUrl, {
        data: { Date: item.Date,BranchName:curretnBranchname },
      });
      if (response.status == 200) {
        toast.success("Data delete successfully!");
        getapi(curretnBranchname)
      } else if (response.data.error) {
        alert(response.data.error);
      }
      // fetchData();
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  //once delete ,update ,add then call this fetchdata to update the list screen
  //In fetch data call Get api 
  // const fetchData = async () => {
  //   try {
  //     axios
  //       .get(apiUrl)
  //       .then((response) => {
  //         const formattedDate = format(startDate, "yyyy-MM-dd"); // Format the selected date
  //         const filtered = response.data.filter((item) => item.Date === formattedDate); // Filter by date
  //         setFilteredData(filtered);

  //       })
  //       .catch((error) => console.error("Error fetching users:", error));

  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

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
  const handleExit = () => {
    localStorage.clear();
    navigate("/")
  };
  const OpenUser=()=>{
    setopenpopup(!openpopup);
  }
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
      <div className="App2">
        <div className="header_font2"><b>DAILY REPORT</b><div className="header_buttons">
            <button className="icon_button user_border_radius" type="submit"   title={currentuser} onClick={OpenUser}>
              {/* <FaUser size={20} /> */}
              {recentuser}
            </button>
            {/* <button
              className="icon_button"
              title="Logout" type="submit" 
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
        {showList === false && (
          <button className="listbtn submitbutton" onClick={showlistitem}>
            DailyReport List
          </button>
        )}

        {showList === false && (
          <div className="card_design2 card_style_dailyReport">
            <form onSubmit={handleSubmit}>
              <div className="body_padding2">
                <DatePicker
                  selected={startDate}
                  dateFormat="yyyy-MM-dd"
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
                <button type="submit" className="submitbutton submit_margin_btm">
                  {showsubmit === false ? "Update" : "Submit"}
                </button>
              )}
            </form>
          </div>
        )}

        
              {showList === true && (
                <div className={currentRole ==='Admin' ? "form-container mrg_tp20" : "form-container"}>
                  {/* // <div className="form-container"> */}
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
                      dateFormat="yyyy-MM-dd"
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
                  <button className="back_btn_DR" onClick={showback}>
                    Back
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
                {Array.length > 0 && Array[0].Sno !== '' ? (
                  Array.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.BranchName}</td>
                      <td>{item.Date}</td>
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
            </div>
          </div>
        )}
       
      </div>
    </div>
  );
}
export default DailyReport;