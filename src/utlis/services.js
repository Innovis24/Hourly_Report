



// Local
export const DAILY_EXP = "http://localhost/hourly_report/Daily_Expenditure.php";
export const DAILY_REPORT = "http://localhost/hourly_report/Daily_Report_api.php";
export const HOUR_REPORT = "http://localhost/hourly_report/hourly_api.php";
export const LOGIN_PHP = "http://localhost/hourly_report/Login.php";
export const USER_MASTER = "http://localhost/hourly_report/User_Master.php";

export const  formatDateForDisplay = (dateString) => {
    if (!dateString) return "N/A"; // Return "N/A" if DOB is empty
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`; // Convert to "dd-mm-yyyy"
  };