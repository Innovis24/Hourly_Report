export const  formatDateForDisplay = (dateString) => {
    if (!dateString) return "N/A"; // Return "N/A" if DOB is empty
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`; // Convert to "dd-mm-yyyy"
  };