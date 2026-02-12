export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("ru-RU");
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString("ru-RU");
};

export const formatCondition = (agreement: {
  agreement_type_grid: string;
  condition_value: number;
}): string => {
  if (agreement.agreement_type_grid === "PERCENT") {
    return `${agreement.condition_value}%`;
  }
  return `${agreement.condition_value} руб.`;
};
