"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  activityDetailsSchema,
  ActivityDetailsFormData,
  CATEGORIES,
  ACTIVITY_TYPES,
  LOCATION_TYPES,
} from "@/lib/schemas";
import { useEffect } from "react";

interface ActivityDetailsFormProps {
  defaultValues: Partial<ActivityDetailsFormData>;
  onNext: (data: ActivityDetailsFormData) => void;
}

export default function ActivityDetailsForm({ defaultValues, onNext }: ActivityDetailsFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ActivityDetailsFormData>({
    resolver: zodResolver(activityDetailsSchema),
    defaultValues: {
      activityName: "",
      category: undefined,
      customCategory: "",
      description: "",
      activityType: undefined,
      locationType: undefined,
      minMembers: "",
      maxMembers: "",
      ...defaultValues,
    },
  });

  const selectedCategory = watch("category");

  useEffect(() => {
    if (selectedCategory !== "Other") {
      setValue("customCategory", "");
    }
  }, [selectedCategory, setValue]);

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate>
      <h2 className="form-section-title">Activity Details</h2>

      {/* ── Activity Name ── */}
      <div className="form-field" style={{ marginTop: "20px" }}>
        <label className="form-label">
          Activity Name <span className="req">*</span>
        </label>
        <input
          {...register("activityName")}
          type="text"
          placeholder="Eg. Cooking class in Palo Alto."
          className={`form-input ${errors.activityName ? "error" : ""}`}
        />
        {errors.activityName && (
          <span className="error-msg">{errors.activityName.message}</span>
        )}
      </div>

      {/* ── Category ── */}
      <div className="form-field">
        <label className="form-label">
          Select the best category to describe your activity <span className="req">*</span>
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "2px" }}>
          {CATEGORIES.map((cat) => (
            <label key={cat} className="radio-option">
              <input
                {...register("category")}
                type="radio"
                value={cat}
                className="custom-radio"
              />
              <span className="radio-option-label">{cat}</span>
            </label>
          ))}
        </div>
        {errors.category && (
          <span className="error-msg">{errors.category.message}</span>
        )}
        {selectedCategory === "Other" && (
          <div style={{ marginTop: "10px" }}>
            <input
              {...register("customCategory")}
              type="text"
              placeholder="Specify the category"
              className={`form-input ${errors.customCategory ? "error" : ""}`}
            />
            {errors.customCategory && (
              <span className="error-msg">{errors.customCategory.message}</span>
            )}
          </div>
        )}
      </div>

      {/* ── Description ── */}
      <div className="form-field">
        <label className="form-label">
          About the Activity <span className="req">*</span>
        </label>
        <textarea
          {...register("description")}
          placeholder="Activity Description"
          className={`form-input ${errors.description ? "error" : ""}`}
        />
        {errors.description && (
          <span className="error-msg">{errors.description.message}</span>
        )}
      </div>

      {/* ── Activity Type ── */}
      <div className="form-field">
        <label className="form-label">
          Please select the activity type <span className="req">*</span>
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "2px" }}>
          {ACTIVITY_TYPES.map((type) => (
            <label key={type} className="radio-option">
              <input
                {...register("activityType")}
                type="radio"
                value={type}
                className="custom-radio"
              />
              <span className="radio-option-label">{type}</span>
            </label>
          ))}
        </div>
        {errors.activityType && (
          <span className="error-msg">{errors.activityType.message}</span>
        )}
      </div>

      {/* ── Location Type ── */}
      <div className="form-field">
        <label className="form-label">
          Please select the type of location <span className="req">*</span>
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "2px" }}>
          {LOCATION_TYPES.map((type) => (
            <label key={type} className="radio-option">
              <input
                {...register("locationType")}
                type="radio"
                value={type}
                className="custom-radio"
              />
              <span className="radio-option-label">{type}</span>
            </label>
          ))}
        </div>
        {errors.locationType && (
          <span className="error-msg">{errors.locationType.message}</span>
        )}
      </div>

      {/* ── Members ── */}
      <div className="form-field">
        <label className="form-label">
          How many members can take part in the activity? <span className="req">*</span>
        </label>
        <div className="field-row">
          <div>
            <input
              {...register("minMembers")}
              type="number"
              min="1"
              placeholder="Minimum Members"
              className={`form-input ${errors.minMembers ? "error" : ""}`}
            />
            {errors.minMembers && (
              <span className="error-msg">{errors.minMembers.message}</span>
            )}
          </div>
          <div>
            <input
              {...register("maxMembers")}
              type="number"
              min="1"
              placeholder="Maximum Members"
              className={`form-input ${errors.maxMembers ? "error" : ""}`}
            />
            {errors.maxMembers && (
              <span className="error-msg">{errors.maxMembers.message}</span>
            )}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ marginTop: "24px" }}>
        <button type="submit" className="btn-primary">
          Save and Continue
        </button>
      </div>
    </form>
  );
}
