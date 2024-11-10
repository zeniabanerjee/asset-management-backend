import { z } from "zod";
import { regex } from "../constants/regEx";
import { isValidPhoneNumber } from "libphonenumber-js";

export const employeeValidator = z.object({
  employeeName: z.string({
    required_error: "Name is required!",
    invalid_type_error: "Employee Name will be in a string format!",
  }),
  employeeTeam: z.string({
    required_error: "Team is required!",
    invalid_type_error: "Employee Team will be in a string format!",
  }),
  employeeEmail: z
    .string({
      required_error: "Email is required!",
      invalid_type_error: "Employee Email will be in a string format!",
    })
    .email()
    .refine((value) => regex.emailFormat.test(value), {
      message: "Invalid email format!",
    }),
  employeeStatus: z
    .string({
      invalid_type_error: "Employee Status will be in a string format!",
    })
    .optional(),
  employeePhone: z
    .string({
      required_error: "Phone is required!",
      invalid_type_error: "Employee Phone will be in a string format!",
    })
    .refine(
      (value) => {
        if (!isValidPhoneNumber(value, "IN")) {
          return false;
        }
        if (value.startsWith("+") && !value.startsWith("+91")) {
          return false;
        }
        return true;
      },
      { message: "Please provide a valid phone number" }
    ),
});
