import * as XLSX from 'xlsx';
import type { User } from '../features/users/usersSlice';

export const exportToExcel = (data: User[]): void => {
   try {
      const wsheet = XLSX.utils.json_to_sheet(data);
      const wbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wbook, wsheet, 'Users');
      XLSX.writeFile(wbook, 'users.xlsx');
   } catch (error) {
      console.error('Failed to export Excel:', error);
      throw new Error('Failed to export Excel file');
   }
};

export const exportToCSV = (data: User[]): void => {
   try {
      const wsheet = XLSX.utils.json_to_sheet(data);
      const csv = XLSX.utils.sheet_to_csv(wsheet);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.href = url;
      link.setAttribute('download', 'users.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
   } catch (error) {
      console.error('Failed to export CSV:', error);
      throw new Error('Failed to export CSV file');
   }
};
