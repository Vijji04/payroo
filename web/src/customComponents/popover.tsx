import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TimesheetEntries } from "./timesheetEntries";
import EmployeeForm from "@/pages/employees/employeeForm";

interface IModalProps {
  modalType: string;
  id?: string;
}

export default function Modal({ modalType, id }: IModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="px-3 py-2 sm:px-4 sm:py-2 bg-black text-white cursor-pointer rounded-md text-sm sm:text-base">
          {modalType === "timesheet" ? "View" : "Add Employee"}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {modalType === "timesheet" ? "Time Sheet" : "Employee form"}
          </DialogTitle>
          <DialogDescription>
            {modalType === "timesheet" ? (
              <TimesheetEntries employeeId={id ?? ""} />
            ) : (
              <EmployeeForm />
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
