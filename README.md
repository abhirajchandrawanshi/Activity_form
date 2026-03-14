# Mammothzy Activity Form

A multi-step activity creation form built with Next.js 14, TypeScript, React Hook Form, and Zod.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Form Handling**: React Hook Form + Zod validation
- **Styling**: Tailwind CSS
- **Font**: DM Sans (Google Fonts)

## UI Highlights

- Pixel-aligned layout based on the provided Figma design
- Sidebar step navigation (Activity Details → Location Details)
- Custom radio buttons styled with Tailwind
- Country flag + dial code selector for phone input
- Responsive layout for desktop and mobile
- Clean form UI with consistent spacing and typography
  
## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open {https://activity-form-mauve.vercel.app/} in your browser.

## Features

### Multi-Step Form
- **Step 1 – Activity Details**: Activity name, category (with "Other" option), description, activity type, location type, member count
- **Step 2 – Location Details**: Address, ZIP code, city/state, contact information with country dial code selector

### Validation
- All required fields validated before proceeding to next step
- Zod schemas enforce field types, formats, and business rules
- Error messages displayed inline under each field
- Cross-field validation (e.g., max members ≥ min members, custom category required when "Other" selected)

### Form State Persistence
- Data persists when navigating back from Step 2 to Step 1
- All previously entered values are pre-filled

### Submission
- On successful submit: logs all form data to the browser console
- Displays a success modal
- Resets all form state to initial empty values

## Project Structure

```
mammothzy-form/
├── app/
│   ├── globals.css          # Global styles + custom form element styles
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main page: orchestrates tabs + form state
├── components/
│   ├── ActivityDetailsForm.tsx   # Step 1 form
│   ├── LocationDetailsForm.tsx   # Step 2 form
│   ├── MammothzyLogo.tsx         # SVG logo component
│   └── SuccessModal.tsx          # Submission success modal
├── lib/
│   └── schemas.ts           # Zod validation schemas + TypeScript types
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Form Data Structure

After successful submission, the following data is logged to the console:

```typescript
{
  // Activity Details
  activityName: string;
  category: "Adventure & Games" | "Creative Expression" | "Food & Drink" | 
            "Learning & Development" | "Sports and Fitness" | "Volunteering" | "Other";
  customCategory?: string;        // Only if category === "Other"
  description: string;
  activityType: "Indoor" | "Outdoor" | "Virtual";
  locationType: "Provider Location" | "User Location";
  minMembers?: string;
  maxMembers?: string;

  // Location Details
  addressLine1: string;
  addressLine2?: string;
  zipCode: string;
  city: string;
  state: string;
  contactNumber: string;          // Includes country dial code
  contactName?: string;
}
```
