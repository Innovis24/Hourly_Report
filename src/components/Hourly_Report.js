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
import { faSignOut, faUser  } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom"; 
import Popup from 'reactjs-popup';

const apiUrl = "http://localhost/hourly_report/hourly_api.php";

function HourlyReport() {
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setstartTime] = useState("24");
  const [startTimeText, setstartTimeText] = useState("");
  const [Pettycash, setPettyCash] = useState("");
  const [AmountTaken, setAmountTaken] = useState("");
  const [Sales, setSales] = useState("");
  const [todayEntries, settodayEntries] = useState("");
  const [totalAmount, settotalAmount] = useState("");
  const [currentID, setID] = useState("");
  const [newID, setnewID] = useState("");
  const [Showlist, setShowlist] = useState(false);
  const [showsubmit, setSubmitButton] = useState(true);
  const [RecentCashinHand, setRecentCashinHand] = useState("");
  const formattedDate = format(startDate, "yyyy-MM-dd");
  const getIDFormat = format(startDate, "yyyyMMdd");
  const [getRecentCash, setRecentCash] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
 const [currentuser, setcurrentuser] = useState();
   const [currentuserName, setcurrentuserName] = useState();
   const [openpopup, setopenpopup] = useState();
  const [Array, setArray] = useState([
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
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(false);
  const navigate = useNavigate(); // For go to login page the navigate function

  useEffect(() => {
    // Update filtered data state
    getapi();
    const value = localStorage.getItem('currentUsername');
    setcurrentuser(value)
    const nameParts = value.charAt(0);
   
    setcurrentuserName(nameParts);
  }, []);


  useEffect(() => {
    // Update filtered data state
    setTimeout(() => {
    const formattedDate = format(startDate, "yyyy-MM-dd"); // Format the selected date
    const filtered = Array.filter((item) => item.Date === formattedDate); // Filter by date
    setFilteredData(filtered);
  }, 500);
   
 }, [startDate, Array]);

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


  const getapi = () => {
    axios
      .get(apiUrl)
      .then((response) => {
        setArray(response.data);
      })
      .catch((error) => console.error("Error fetching users:", error));
  };

  const OpenUser=()=>{
    setopenpopup(!openpopup);
  }
  const OpenPopupcard = () => {
    setIsOpen(true)
  }
  const handleDateChange = (date) => {
    setStartDate(date);
    getapi()
  };

  const usedTimes = filteredData.map((item) => item.endtime);

  // Filter out used times from the Time array
  const filteredTime = Time.filter(
    (option) => !usedTimes.includes(option.text)
  );

  let tempTime = []
  let SortedTime = []
   if(showsubmit === false){
    
    const updatedTime = Time.filter((item)=>item.text == startTimeText)
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
          .post(apiUrl, processedData)
          .then((response) => {
            // alert(response.data.message);
            getapi();
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
        .put(apiUrl, processedData)
        .then((response) => {
          console.log(response.data.message);
          getapi();  // Optional: refresh the data
        })
        .catch((error) => console.error("Error updating data:", error));        

      }
    }
    setPettyCash("");
    setAmountTaken("");
    setstartTime("24");
  };

  const handleDelete = async (e, item) => {
    try {
      const response = await axios.delete(apiUrl, {
        data: { Date : item.Date,
          ID: item.ID},
         // Send the record ID as payload
      });

      if (response.data.message) {
        alert(response.data.message);
      } else if (response.data.error) {
        alert(response.data.error);
      }

      // Fetch updated data after deletion
      fetchData();
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const fetchData = async () => {
    try {
      axios
      .get(apiUrl)
      .then((response) => {
        const formattedDate = format(startDate, "yyyy-MM-dd"); // Format the selected date
        const filtered = response.data.filter((item) => item.Date === formattedDate); // Filter by date
        setFilteredData(filtered);
       
      })
      .catch((error) => console.error("Error fetching users:", error));
     
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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
    
    setShowlist(true); //open list form
  };

  const notify = () => toast.error("Please fill all details");


  const handleExit = () => {
    // Redirect to the login page
    localStorage.clear();
      navigate("/")
   
  };

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
        <div className="header_font"><b>HOURLY REPORT</b>  <div className="header_buttons">
        <button className="icon_button user_border_radius" type="submit"   title={currentuser} onClick={OpenUser}>
              {/* <FaUser size={20} /> */}
              {currentuserName}
            </button>
    {/* <button
              className="icon_button"
              title="Logout"
              onClick={handleExit} // Add click handler
            >
      <FaSignOutAlt size={20} />
    </button> */}
  </div></div>
     
        {/* report list button */}
        {Showlist === false && (
          <button className="listbtn submitbutton" onClick={showlistitem}>
            Hourly report list
          </button>
        )}

        {/* create form start */}
        {Showlist === false && (
          <div className="card_design">
            <form onSubmit={handleSubmit}>
              <div className="body_padding">
                <div >
                  <DatePicker
                    showIcon
                    selected={startDate}
                    dateFormat="yyyy-MM-dd"
                    minDate={new Date()}
                    maxDate={new Date()}
                    onChange={(date) => handleDateChange(date)}
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
          <button type="submit" className="submitbutton submit_margin_btm" onClick={handleSubmit}>
            {showsubmit === false ? "Update" : "Submit"}
          </button>
        )}
            </form>
               {/* form end */}
        
          </div>
        )}

     
      </div>

      {/* lisst screen start */}

      {Showlist === true && (
        <form className="marginleft">
          <button className="listbtn submitbutton" onClick={showlistitem}>
            Back
          </button>
          <div >
            <label htmlFor="date-picker">Select Date: </label>
            <DatePicker
              selected={startDate}
              dateFormat="yyyy-MM-dd"
              maxDate={new Date()}
              onChange={(date) => setStartDate(date)}
              id="date-picker"
            />
          </div>
          <div className="App scrollit table_scroll">
            <center>
            <table className="padding_top">
              <thead className="table_header">
                <tr>
                  <th className="HeadingPaddig">Sno.</th>
                  <th className="HeadingPaddig">ID</th>
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
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.ID}</td>
                      <td>{item.Date}</td>
                      <td>{item.endtime}</td>
                      <td>{item.pettycash}</td>
                      <td>{item.amounttaken}</td>
                      <td>{Math.abs(item.Sales)}</td>
                      <td>{Math.abs(item.totalamount)}</td>
                      <td>{Math.abs(item.cashinhand)}</td>
                      <td>
                        <FaEdit
                          className="iconPaddig"
                          onClick={(e) => handleUpdate(e, item)}
                        />
                        <FaTrashAlt
                          className="iconPaddig"
                          onClick={(e) => handleDelete(e, item)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="center_align">
                      No records available for the chosen date.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            </center>
          </div>
        </form>
      )}
    </div>
  );
}

export default HourlyReport;
