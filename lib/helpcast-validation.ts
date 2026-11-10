export const sectors = [
  ["retail", "FMCG / Retail"], ["healthcare", "Healthcare / Pharmaceuticals"],
  ["technology", "Technology"], ["real-estate", "Real Estate"],
  ["manufacturing", "Manufacturing"], ["finance", "Financial Services"],
  ["professional", "Professional Services"], ["other", "Other"]
] as const;

export type ApplicationValues = {
  full_name: string; company_name: string; position: string; industry: string;
  phone: string; email: string; introduction: string; consent: boolean;
};
export type FieldErrors = Partial<Record<keyof ApplicationValues, string>>;
export const blankApplication: ApplicationValues = {
  full_name: "", company_name: "", position: "", industry: "", phone: "", email: "", introduction: "", consent: false
};

export function validateApplication(data: unknown): FieldErrors {
  const input = (data && typeof data === "object" ? data : {}) as Record<string, unknown>;
  const errors: FieldErrors = {};
  for (const key of ["full_name", "company_name", "position", "introduction"] as const) {
    const value = input[key];
    if (typeof value !== "string" || !value.trim()) errors[key] = "This field is required.";
    else if (value.length > (key === "introduction" ? 4000 : 200)) errors[key] = key === "introduction" ? "Please use no more than 4000 characters." : "Please use no more than 200 characters.";
  }
  if (!sectors.some(([value]) => value === input.industry)) errors.industry = "Please choose an industry.";
  const phone = typeof input.phone === "string" ? input.phone.replace(/[٠-٩]/g, c => String(c.charCodeAt(0) - 1632)).replace(/[۰-۹]/g, c => String(c.charCodeAt(0) - 1776)).replace(/[\s().-]/g, "") : "";
  if (!phone || (typeof input.phone === "string" && input.phone.length > 60) || !/^(?:0[1-9]\d{8,10}|\+[1-9]\d{7,14}|00[1-9]\d{7,14}|964[1-9]\d{8,9})$/.test(phone)) errors.phone = "Enter a valid Iraqi or international phone number.";
  if (typeof input.email !== "string" || (input.email.trim() && (input.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())))) errors.email = "Enter a valid email address.";
  if (input.consent !== true) errors.consent = "Please agree to the privacy policy before submitting.";
  return errors;
}
