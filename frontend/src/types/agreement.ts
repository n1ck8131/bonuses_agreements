export enum AgreementStatus {
  READY_FOR_CALCULATION = "READY_FOR_CALCULATION",
  CALCULATED = "CALCULATED",
  DELETED = "DELETED",
}

export interface RefSupplier {
  code: string;
  name: string;
}

export interface RefAgreementType {
  code: string;
  name: string;
  grid: "PERCENT" | "FIX";
}

export interface AgreementCreate {
  valid_from: string;
  valid_to: string;
  supplier_code: string;
  agreement_type_code: string;
  condition_value: number;
}

export interface Agreement {
  id: string;
  valid_from: string;
  valid_to: string;
  supplier_code: string;
  supplier_name: string;
  agreement_type_code: string;
  agreement_type_name: string;
  agreement_type_grid: "PERCENT" | "FIX";
  condition_value: number;
  status: AgreementStatus;
  created_at: string;
  updated_at: string;
}
