export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("ru-RU");
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString("ru-RU");
};

export const formatCondition = (agreement: {
  scale_grid: string;
  condition_value: number;
}): string => {
  if (agreement.scale_grid === "PERCENT") {
    return `${agreement.condition_value}%`;
  }
  return `${agreement.condition_value} руб.`;
};
