import React, { useState, useEffect } from "react";
import "./Daily_Expenditure.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import axios from "axios";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; 

const apiUrl = "http://localhost/hourly_report/Daily_Expenditure.php";

function DailyExpenditure() {
  const [startDate, setStartDate] = useState(new Date());
  const [showList, setShowList] = useState(false);
  const [Itemname, setItemname] = useState("");
  const [amount, setAmount] = useState("");
  const [dataArray, setDataArray] = useState([]);
  const [Itemnameoptions, setItemnameoptions] = useState([]);
  const formattedDate = format(startDate, "yyyy-MM-dd");
  const [filterDate, setFilterDate] = useState(); // Filter date for the table
  const [totalAmount, setTotalAmount] = useState(0);
  const [currentuser, setcurrentuser] = useState();
  

  const [Array, setArray] = useState([
      {
        Date: "",
        Itemname: "",
        Amount: "",
      },
    ]);

    const navigate = useNavigate(); // For go to login page the navigate function

  useEffect(() => {
    fetchApiData(); // Fetch expenditure data
    getUserapi(); // Fetch item list
    const value = localStorage.getItem('currentUsername');
    setcurrentuser(value)
    if(value === '' || value === null || value === undefined){
      navigate("/");
      return;
    }
  }, []);
  useEffect(() => {
    fetchApiData();
  }, [filterDate]);
  
  useEffect(() => {
    console.log("Itemnameoptions state updated:", Itemnameoptions);
  }, [Itemnameoptions]);
  
 // Filter data by selected date
 const filteredData = filterDate
 ? dataArray.filter(
     (entry) => entry.Date === format(filterDate, "yyyy-MM-dd")
   )
 : dataArray;

  // Fetch expenditure data
  const fetchApiData = () => {
    const params = filterDate
      ? `?action=getReports&filterDate=${format(filterDate, "yyyy-MM-dd")}`
      : "?action=getReports";
  
    axios
      .get(apiUrl + params)
      .then((response) => {
        setDataArray(response.data);
        const total = response.data.reduce(
          (acc, entry) => acc + parseFloat(entry.Amount || 0),
          0
        );
        setTotalAmount(total);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };
  

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
    };

    axios
      .post(apiUrl, newEntry)
      .then(() => {
        toast.success("Data submitted successfully!");
        fetchApiData();
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
        fetchApiData(); // Refresh the list after deletion
      } else {
        toast.error(response.data.error || "Failed to delete record.");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      toast.error("Failed to delete record. Please try again.");
    }
  };

  
  const handleListToggle = () => {
    setShowList(!showList);
  };    

  const handleExit = () => {
    localStorage.clear();
    navigate("/")
  };

  return (
    <div>
      <ToastContainer />
      <div className="App">
        <div className="header_font"><b>DAILY EXPENDITURE</b><div className="header_buttons">
                    <button className="icon_button user_border_radius" title={currentuser}>
                      {/* <FaUser size={20} /> */}
                      {currentuser}
                    </button>
                    <button
              className="icon_button"
              title="Logout"
              onClick={handleExit} // Add click handler
            >
                      <FaSignOutAlt size={20} />
                    </button>
                  </div></div>
        <button className="listbtn submitbutton" onClick={handleListToggle}>
          {showList ? "Back" : "Daily Expenditure List"}
        </button>

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
<div className="filter_container ">
              <label htmlFor="date-filter" style={{ marginRight: "10px" }}>
                Filter by Date:
              </label>
              <DatePicker
                selected={filterDate}
                dateFormat="yyyy-MM-dd"
                onChange={(date) => setFilterDate(date)}
                id="date-filter"
                placeholderText="Select a date"
                isClearable // Allows clearing the date filter
              />
            </div>
            <center>          <div className="table_align3">
            <table className="padding_top3">
              <thead className="table_header3">
                <tr>
                  <th>S. No</th>
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
                      <td>{entry.Date}</td>
                      <td>{entry.Itemname}</td>
                      <td>{entry.Amount}</td>
                         <td>
                         <FaTrashAlt
                          className="iconPaddig"
                          onClick={(e) => handleDelete(e, entry)}
                        />
                                            </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="center_align">No data available</td>
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
