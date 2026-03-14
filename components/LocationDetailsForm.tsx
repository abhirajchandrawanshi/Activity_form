"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { locationDetailsSchema, LocationDetailsFormData } from "@/lib/schemas";
import { useState, useRef } from "react";

const INDIAN_STATES = [
  "Andaman and Nicobar Islands","Andhra Pradesh","Arunachal Pradesh","Assam",
  "Bihar","Chandigarh","Chhattisgarh","Dadra and Nagar Haveli and Daman and Diu",
  "Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu and Kashmir",
  "Jharkhand","Karnataka","Kerala","Ladakh","Lakshadweep","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha",
  "Puducherry","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
];

// SVG flags as inline components for pixel-perfect rendering
const FLAGS: Record<string, React.ReactNode> = {
  IN: (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="20" height="14" rx="2" fill="white"/>
      <rect width="20" height="4.667" fill="#FF9933"/>
      <rect y="9.333" width="20" height="4.667" fill="#138808"/>
      <circle cx="10" cy="7" r="1.8" stroke="#000080" strokeWidth="0.5" fill="none"/>
      <circle cx="10" cy="7" r="0.3" fill="#000080"/>
      {[...Array(24)].map((_, i) => {
        const angle = (i * 360) / 24;
        const rad = (angle * Math.PI) / 180;
        const x2 = 10 + 1.6 * Math.sin(rad);
        const y2 = 7 - 1.6 * Math.cos(rad);
        const x1 = 10 + 1.1 * Math.sin(rad);
        const y1 = 7 - 1.1 * Math.cos(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#000080" strokeWidth="0.35"/>;
      })}
    </svg>
  ),
  US: (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="20" height="14" rx="2" fill="white"/>
      {[0,2,4,6,8,10,12].map((y, i) => (
        <rect key={i} y={y} width="20" height="1.077" fill="#B22234"/>
      ))}
      <rect width="8" height="7.538" fill="#3C3B6E"/>
    </svg>
  ),
  GB: (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="20" height="14" rx="2" fill="#012169"/>
      <path d="M0 0L20 14M20 0L0 14" stroke="white" strokeWidth="3"/>
      <path d="M0 0L20 14M20 0L0 14" stroke="#C8102E" strokeWidth="1.5"/>
      <path d="M10 0V14M0 7H20" stroke="white" strokeWidth="4"/>
      <path d="M10 0V14M0 7H20" stroke="#C8102E" strokeWidth="2.5"/>
    </svg>
  ),
  AU: (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="20" height="14" rx="2" fill="#00008B"/>
      <path d="M0 0L8 5.5M8 0L0 5.5" stroke="white" strokeWidth="2"/>
      <path d="M0 0L8 5.5M8 0L0 5.5" stroke="#C8102E" strokeWidth="1"/>
      <path d="M4 0V5.5M0 2.75H8" stroke="white" strokeWidth="2.5"/>
      <path d="M4 0V5.5M0 2.75H8" stroke="#C8102E" strokeWidth="1.5"/>
    </svg>
  ),
  CA: (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="20" height="14" rx="2" fill="white"/>
      <rect width="5" height="14" fill="#FF0000"/>
      <rect x="15" width="5" height="14" fill="#FF0000"/>
      <path d="M10 3L11 6H14L11.5 8L12.5 11L10 9L7.5 11L8.5 8L6 6H9L10 3Z" fill="#FF0000"/>
    </svg>
  ),
  SG: (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="20" height="14" rx="2" fill="white"/>
      <rect width="20" height="7" fill="#EF3340"/>
    </svg>
  ),
  AE: (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="20" height="14" rx="2" fill="white"/>
      <rect width="20" height="4.667" fill="#00732F"/>
      <rect y="9.333" width="20" height="4.667" fill="#000000"/>
      <rect width="5" height="14" fill="#FF0000"/>
    </svg>
  ),
};

const COUNTRIES: Record<string, { dialCode: string; name: string }> = {
  IN: { dialCode: "+91", name: "India" },
  US: { dialCode: "+1",  name: "United States" },
  GB: { dialCode: "+44", name: "United Kingdom" },
  AU: { dialCode: "+61", name: "Australia" },
  CA: { dialCode: "+1",  name: "Canada" },
  SG: { dialCode: "+65", name: "Singapore" },
  AE: { dialCode: "+971",name: "UAE" },
};

type PinStatus = "idle" | "loading" | "success" | "not_found" | "error";

interface Props {
  defaultValues: Partial<LocationDetailsFormData>;
  onPrevious: () => void;
  onSubmit: (data: LocationDetailsFormData) => void;
}

export default function LocationDetailsForm({ defaultValues, onPrevious, onSubmit: onFormSubmit }: Props) {
  const [selectedCountry, setSelectedCountry] = useState("IN");
  const [showDropdown, setShowDropdown] = useState(false);
  const [pinStatus, setPinStatus] = useState<PinStatus>("idle");
  const pinTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { register, handleSubmit, setValue, watch, clearErrors, formState: { errors } } =
    useForm<LocationDetailsFormData>({
      resolver: zodResolver(locationDetailsSchema),
      defaultValues: {
        addressLine1: "", addressLine2: "", zipCode: "",
        city: "", state: "", contactNumber: "", contactName: "",
        ...defaultValues,
      },
    });

  const stateVal = watch("state");
  const cityVal  = watch("city");
  const isAutofilled = pinStatus === "success";

  // PIN lookup
  const lookupPin = async (pin: string) => {
    if (!/^\d{6}$/.test(pin)) { setPinStatus("idle"); return; }
    setPinStatus("loading");
    try {
      const res  = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const json = await res.json();
      const rec  = json?.[0];
      if (rec?.Status === "Success" && rec.PostOffice?.length > 0) {
        const po = rec.PostOffice[0];
        setValue("state", po.State ?? "", { shouldValidate: true });
        setValue("city",  po.District ?? po.Block ?? "", { shouldValidate: true });
        clearErrors(["state", "city"]);
        setPinStatus("success");
      } else {
        setPinStatus("not_found");
      }
    } catch {
      setPinStatus("error");
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setValue("zipCode", val, { shouldValidate: val.length === 6 });
    if (val.length < 6) { setPinStatus("idle"); setValue("state", ""); setValue("city", ""); }
    if (pinTimer.current) clearTimeout(pinTimer.current);
    pinTimer.current = setTimeout(() => lookupPin(val), 500);
  };

  const onSubmit = (data: LocationDetailsFormData) => {
    const dialCode = COUNTRIES[selectedCountry]?.dialCode ?? "+91";
    onFormSubmit({ ...data, contactNumber: `${dialCode} ${data.contactNumber}`.trim() });
  };

  const country = COUNTRIES[selectedCountry];

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2 className="form-section-title">Location Details</h2>
      <p className="form-section-subtitle">
        Please specify the address for where the activity takes place.
      </p>

      {/* Address Line 1 */}
      <div className="form-field">
        <label className="form-label">Address Line 1 <span className="req">*</span></label>
        <input
          {...register("addressLine1")}
          type="text"
          placeholder="House number and street name"
          className={`form-input ${errors.addressLine1 ? "error" : ""}`}
        />
        {errors.addressLine1 && <span className="error-msg">{errors.addressLine1.message}</span>}
      </div>

      {/* Address Line 2 */}
      <div className="form-field">
        <label className="form-label">Address Line 2</label>
        <input
          {...register("addressLine2")}
          type="text"
          placeholder="Other information, e.g., building name, landmark, etc."
          className="form-input"
        />
      </div>

      {/* PIN Code */}
      <div className="form-field">
        <label className="form-label">PIN Code <span className="req">*</span></label>
        <div className="pin-input-wrap">
          <input
            {...register("zipCode")}
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="e.g. 452001"
            onChange={handlePinChange}
            className={`form-input ${errors.zipCode ? "error" : ""}`}
            style={{ paddingRight: "36px" }}
          />
          {/* Status icon */}
          <span className="pin-status-icon">
            {pinStatus === "loading" && (
              <svg className="spin-anim" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="#e5e7eb" strokeWidth="1.5"/>
                <path d="M8 2A6 6 0 0 1 14 8" stroke="#1a1f2e" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
            {pinStatus === "success" && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" fill="#dcfce7"/>
                <path d="M4.5 8L7 10.5L11.5 5.5" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {(pinStatus === "not_found" || pinStatus === "error") && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" fill="#fef9c3"/>
                <path d="M8 5V8.5" stroke="#a16207" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="8" cy="11" r=".75" fill="#a16207"/>
              </svg>
            )}
          </span>
        </div>
        {pinStatus === "loading"   && <span className="pin-hint loading">Looking up PIN code…</span>}
        {pinStatus === "success"   && <span className="pin-hint success">✓ City and state auto-filled — you can still edit below.</span>}
        {pinStatus === "not_found" && <span className="pin-hint warning">PIN not found — please enter city and state manually.</span>}
        {pinStatus === "error"     && <span className="pin-hint warning">Lookup failed — please enter city and state manually.</span>}
        {errors.zipCode && pinStatus === "idle" && <span className="error-msg">{errors.zipCode.message}</span>}
      </div>

      {/* City + State */}
      <div className="form-field">
        <div className="field-row">
          <div>
            <label className="form-label">City <span className="req">*</span></label>
            <input
              {...register("city")}
              type="text"
              placeholder="Your City"
              className={`form-input ${errors.city ? "error" : ""} ${isAutofilled && cityVal ? "autofilled" : ""}`}
            />
            {errors.city && <span className="error-msg">{errors.city.message}</span>}
          </div>
          <div>
            <label className="form-label">State <span className="req">*</span></label>
            <datalist id="india-states">
              {INDIAN_STATES.map((s) => <option key={s} value={s} />)}
            </datalist>
            <input
              {...register("state")}
              type="text"
              list="india-states"
              placeholder="Type or select state"
              className={`form-input ${errors.state ? "error" : ""} ${isAutofilled && stateVal ? "autofilled" : ""}`}
            />
            {errors.state && <span className="error-msg">{errors.state.message}</span>}
            {isAutofilled && stateVal && !errors.state && (
              <span className="pin-hint" style={{ color: "#9ca3af" }}>Auto-filled · tap to edit</span>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="section-divider" />

      {/* Contact Details */}
      <div className="form-field">
        <h3 className="form-section-subtitle" style={{ fontWeight: 600, color: "#1a1f2e", margin: "24px 0 4px" }}>
          Contact details
        </h3>
        <p className="form-section-subtitle" style={{ marginBottom: "16px" }}>
          Please provide contact information for this activity.
        </p>

        <div className="field-row">
          {/* Phone */}
          <div>
            <div className={`phone-input-wrapper ${errors.contactNumber ? "error" : ""}`}>
              {/* Flag + dial code selector */}
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="phone-dial-btn"
                  onClick={() => setShowDropdown((v) => !v)}
                  aria-label="Select country code"
                >
                  {/* SVG flag */}
                  <span style={{ display: "flex", alignItems: "center", lineHeight: 1 }}>
                    {FLAGS[selectedCountry]}
                  </span>
                  {/* Country code + dial code text — matches Figma "IN +91" */}
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "#1a1f2e" }}>
                    {selectedCountry}
                  </span>
                  <span style={{ fontSize: "13px", color: "#6b7280" }}>
                    {country?.dialCode}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4L6 8L10 4" stroke="#9ca3af" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Dropdown */}
                {showDropdown && (
                  <div className="phone-dial-dropdown">
                    {Object.entries(COUNTRIES).map(([code, c]) => (
                      <div
                        key={code}
                        className={`phone-dial-option ${selectedCountry === code ? "selected" : ""}`}
                        onClick={() => { setSelectedCountry(code); setShowDropdown(false); }}
                      >
                        <span style={{ display: "flex", alignItems: "center" }}>{FLAGS[code]}</span>
                        <span style={{ fontWeight: 600, fontSize: "13px" }}>{c.dialCode}</span>
                        <span style={{ fontSize: "12px", color: "#9ca3af" }}>{code}</span>
                        <span style={{ fontSize: "12px", color: "#6b7280", marginLeft: "auto" }}>{c.name}</span>
                        {selectedCountry === code && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6L5 9L10 3" stroke="#1a1f2e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <input
                type="tel"
                placeholder="Contact Number *"
                {...register("contactNumber")}
                className="phone-number-input"
              />
            </div>
            {errors.contactNumber && <span className="error-msg">{errors.contactNumber.message}</span>}
          </div>

          {/* Contact Name */}
          <div>
            <input
              {...register("contactName")}
              type="text"
              placeholder="Contact Name *"
              className={`form-input ${errors.contactName ? "error" : ""}`}
            />
            {errors.contactName && <span className="error-msg">{errors.contactName.message}</span>}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="btn-row">
        <button type="button" className="btn-secondary" onClick={onPrevious}>
          Previous
        </button>
        <button type="submit" className="btn-primary">
          Submit
        </button>
      </div>
    </form>
  );
}
