import * as XLSX from 'xlsx';

export const exportToExcel = (data: any[]) => {
   const wsheet = XLSX.utils.json_to_sheet(data);
   const wbook = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(wbook, wsheet, 'Users');
   XLSX.writeFile(wbook, 'users.xlsx');
};

export const exportToCSV = (data: User[]) => {
   const wsheet = XLSX.utils.json_to_sheet(data);
   const csv = XLSX.utils.sheet_to_csv(wsheet);
   const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
   const link = document.createElement('a');
   link.href = URL.createObjectURL(blob);
   link.setAttribute('download', 'users.csv');
   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);
};
