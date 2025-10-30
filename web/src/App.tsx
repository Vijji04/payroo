import Layout from "./layout";
import Employees from "./pages/employees/employees";
import { Routes, Route } from "react-router-dom";
import TimeSheetsPage from "./pages/timesheets/timesheets";
import { PayrunInner } from "./pages/payrun/payrun";
// import { TimesheetEntries } from "./customComponents/timesheetEntries";

function App() {
  return (
    <Layout>
      <Routes>
        {/* <Route path="/" element={<>hello</>} /> */}
        <Route path="/" element={<Employees />} />
        <Route path="/timesheets" element={<TimeSheetsPage />} />
        <Route path="/payrun" element={<PayrunInner />} />
        {/* <Route path="/timesheetentries" element={<TimesheetEntries />} /> */}
      </Routes>
    </Layout>
  );
}

export default App;
