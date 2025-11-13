// Path: frontend/src/utils/exportUtils.js
export const exportPDF = () => {
  const blob = new Blob(["SJD Report PDF Export"], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "report.pdf";
  link.click();
};

export const exportExcel = () => {
  const blob = new Blob(["SJD Report Excel Export"], { type: "application/vnd.ms-excel" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "report.xls";
  link.click();
};
