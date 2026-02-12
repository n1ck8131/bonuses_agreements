import { AgreementStatus } from "../types/agreement";

export const statusConfig: Record<
  AgreementStatus,
  { label: string; color: "success" | "default" | "error" }
> = {
  [AgreementStatus.READY_FOR_CALCULATION]: { label: "Готово к расчёту", color: "success" },
  [AgreementStatus.CALCULATED]: { label: "Рассчитано", color: "default" },
  [AgreementStatus.DELETED]: { label: "Удалено", color: "error" },
};
