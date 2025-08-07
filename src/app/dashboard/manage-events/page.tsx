import Dashboard from "../components/DashboardLayout";
import AttendanceList from "./components/AttendanceList";
import EventListTable from "./components/EventListTable";
import SeatList from "./components/SeatList";

function ManageEvents() {
  return (
    <section>
      <Dashboard>
        <div className="lg:h-[40%]">
          <EventListTable></EventListTable>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-5 ">
          <AttendanceList></AttendanceList>
          <SeatList></SeatList>
        </div>
      </Dashboard>
    </section>
  );
}

export default ManageEvents;
