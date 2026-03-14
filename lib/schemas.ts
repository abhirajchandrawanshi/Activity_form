import { z } from "zod";

export const CATEGORIES = [
  "Adventure & Games",
  "Creative Expression",
  "Food & Drink",
  "Learning & Development",
  "Sports and Fitness",
  "Volunteering",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const ACTIVITY_TYPES = ["Indoor", "Outdoor", "Virtual"] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export const LOCATION_TYPES = ["Provider Location", "User Location"] as const;
export type LocationType = (typeof LOCATION_TYPES)[number];

export const activityDetailsSchema = z
  .object({
    activityName: z
      .string()
      .min(1, "Activity name is required")
      .max(200, "Activity name must be less than 200 characters"),
    category: z.enum(CATEGORIES, {
      required_error: "Please select a category",
    }),
    customCategory: z.string().optional(),
    description: z
      .string()
      .min(1, "Activity description is required")
      .max(2000, "Description must be less than 2000 characters"),
    activityType: z.enum(ACTIVITY_TYPES, {
      required_error: "Please select an activity type",
    }),
    locationType: z.enum(LOCATION_TYPES, {
      required_error: "Please select a location type",
    }),
    minMembers: z
      .string()
      .min(1, "Minimum members is required")
      .refine(
        (val) => !isNaN(Number(val)) && Number(val) >= 1,
        "Minimum members must be a positive number"
      ),
    maxMembers: z
      .string()
      .min(1, "Maximum members is required")
      .refine(
        (val) => !isNaN(Number(val)) && Number(val) >= 1,
        "Maximum members must be a positive number"
      ),
  })
  .refine(
    (data) => {
      if (data.category === "Other" && (!data.customCategory || data.customCategory.trim() === "")) {
        return false;
      }
      return true;
    },
    {
      message: "Please specify the category",
      path: ["customCategory"],
    }
  )
  .refine(
    (data) => {
      if (data.minMembers && data.maxMembers) {
        return Number(data.maxMembers) >= Number(data.minMembers);
      }
      return true;
    },
    {
      message: "Maximum members must be greater than or equal to minimum members",
      path: ["maxMembers"],
    }
  );

export const locationDetailsSchema = z.object({
  addressLine1: z
    .string()
    .min(1, "Address Line 1 is required"),
  addressLine2: z.string().optional(),
  zipCode: z
    .string()
    .min(1, "PIN code is required")
    .regex(/^\d{6}$/, "Please enter a valid 6-digit PIN code"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  contactNumber: z
    .string()
    .min(1, "Contact number is required")
    .min(7, "Please enter a valid contact number"),
  contactName: z.string().min(1, "Contact name is required"),
});

export type ActivityDetailsFormData = z.infer<typeof activityDetailsSchema>;
export type LocationDetailsFormData = z.infer<typeof locationDetailsSchema>;

export type FullFormData = ActivityDetailsFormData & LocationDetailsFormData;
