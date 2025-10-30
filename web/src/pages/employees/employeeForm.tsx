import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { sanitizeObject } from "@/utils/sanitizeInput";

type EmployeeType = "hourly" | "salaried" | "contractor";

type EmployeeFormData = {
  firstName: string;
  lastName: string;
  type: EmployeeType;
  baseRate: number;
  superRate: number;
  bank: string;
};

function EmployeeForm() {
  const schema = z.object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(30),
    lastName: z
      .string()
      .min(2, "last name must be at least 2 characters")
      .max(30),
    type: z.enum(["hourly", "salaried", "contractor"], {
      message: "Select a valid employee type",
    }),
    baseRate: z
      .number({ message: "Base rate must be a number" })
      .min(0)
      .max(200),
    superRate: z
      .number({ message: "Super rate must be a number" })
      .min(0)
      .max(200),
    bank: z.string().min(1, "Bank name is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(schema),
  });

  const submitData = async (data: EmployeeFormData) => {
    try {
      const sanitizedData = sanitizeObject(data);
      const response = await axios.post(
        "http://localhost:8080/api/employees",
        sanitizedData
      );

      if (response.status === 201) {
        alert("Employee added successfully!");
      }
      console.log("Employee Data", data);
    } catch (error) {
      console.log("Error at", error);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(submitData)}
      className="grid grid-cols-1 sm:grid-cols-2 gap-6"
    >
      <div className="flex flex-col">
        {errors.firstName && (
          <span className="text-xs text-red-500">
            {errors.firstName.message}
          </span>
        )}
        <label>First Name</label>
        <input
          className="border rounded px-3 py-2"
          type="text"
          {...register("firstName")}
        />
      </div>
      <div className="flex flex-col">
        {errors.lastName && (
          <span className="text-xs text-red-500">
            {errors.lastName.message}
          </span>
        )}
        <label>Last Name</label>
        <input
          className="border rounded px-3 py-2"
          type="text"
          {...register("lastName")}
        />
      </div>
      <div className="flex flex-col">
        {errors.type && (
          <span className="text-xs text-red-500">{errors.type.message}</span>
        )}
        <label>Type</label>
        <select
          {...register("type")}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="">Select type</option>
          <option value="hourly">Hourly</option>
          <option value="salaried">Salaried</option>
          <option value="contractor">Contractor</option>
        </select>
      </div>
      <div className="flex flex-col">
        {" "}
        {errors.baseRate && (
          <span className="text-xs text-red-500">
            {errors.baseRate.message}
          </span>
        )}
        <label>Base Rate</label>
        <input
          type="number"
          step="any"
          className="border rounded px-3 py-2"
          {...register("baseRate", { valueAsNumber: true })}
        />
      </div>
      <div className="flex flex-col">
        {errors.superRate && (
          <span className="text-xs text-red-500">
            {errors.superRate.message}
          </span>
        )}
        <label>Super Rate</label>
        <input
          type="number"
          step="any"
          className="border rounded px-3 py-2"
          {...register("superRate", { valueAsNumber: true })}
        />
      </div>
      <div className="flex flex-col">
        {errors.bank && (
          <span className="text-xs text-red-500">{errors.bank.message}</span>
        )}
        <label>Bank</label>
        <input
          className="border rounded px-3 py-2"
          type="text"
          {...register("bank")}
        />
      </div>

      <Button type="submit" className="w-full sm:w-auto">
        Submit
      </Button>
    </form>
  );
}

export default EmployeeForm;
