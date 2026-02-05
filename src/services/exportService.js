// Export Service - Handles CSV, Excel, and PDF exports
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Helper to trigger file download
const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Get timestamp for filenames
const getTimestamp = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

// Format stock data for export
const formatStockForExport = (stock) => ({
  Ticker: stock.ticker || '',
  Name: stock.name || '',
  Sector: stock.sector || '',
  Price: stock.price ? `$${stock.price}` : 'N/A',
  'Market Cap ($B)': stock.marketCap || 'N/A',
  'P/E Ratio': stock.peRatio || 'N/A',
  'Forward P/E': stock.forwardPE || 'N/A',
  'Revenue Growth (%)': stock.revenueGrowth ? `${stock.revenueGrowth}%` : 'N/A',
  Score: stock.score || 'N/A',
  'Analyst Rating': stock.analystRating || 'N/A',
  'Price Target': stock.priceTarget ? `$${stock.priceTarget}` : 'N/A',
  'Upside (%)': stock.upside ? `${stock.upside}%` : 'N/A',
  'AI Revenue (%)': stock.aiRevenue ? `${stock.aiRevenue}%` : 'N/A',
  'Next Earnings': stock.nextEarningsDate || 'N/A'
});

// ==================== CSV EXPORT ====================

export const exportToCSV = (stocks, filename = 'ai-stocks') => {
  try {
    const formattedData = stocks.map(formatStockForExport);
    const csv = Papa.unparse(formattedData);
    downloadFile(csv, `${filename}-${getTimestamp()}.csv`, 'text/csv;charset=utf-8;');
    return { success: true };
  } catch (error) {
    console.error('CSV Export Error:', error);
    return { success: false, error: error.message };
  }
};

// ==================== EXCEL EXPORT ====================

export const exportToExcel = (stocks, filename = 'ai-stocks-report') => {
  try {
    const workbook = XLSX.utils.book_new();

    // Sheet 1: Summary
    const summaryData = stocks.map(stock => ({
      Ticker: stock.ticker,
      Name: stock.name,
      Sector: stock.sector,
      Price: stock.price,
      'Market Cap ($B)': stock.marketCap,
      Score: stock.score,
      'Analyst Rating': stock.analystRating,
      'Upside (%)': stock.upside
    }));
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Sheet 2: Financials
    const financialsData = stocks.map(stock => ({
      Ticker: stock.ticker,
      Name: stock.name,
      'P/E Ratio': stock.peRatio,
      'Forward P/E': stock.forwardPE,
      'Revenue Growth (%)': stock.revenueGrowth,
      'Price Target': stock.priceTarget,
      'Current Price': stock.price,
      'Implied Upside (%)': stock.upside
    }));
    const financialsSheet = XLSX.utils.json_to_sheet(financialsData);
    XLSX.utils.book_append_sheet(workbook, financialsSheet, 'Financials');

    // Sheet 3: AI Metrics
    const aiMetricsData = stocks.map(stock => ({
      Ticker: stock.ticker,
      Name: stock.name,
      Sector: stock.sector,
      'AI Revenue (%)': stock.aiRevenue || 'N/A',
      'HBM Exposure': stock.hbmExposure ? 'Yes' : 'No',
      Score: stock.score,
      Opportunity: stock.opportunity || '',
      Risk: stock.risk || ''
    }));
    const aiMetricsSheet = XLSX.utils.json_to_sheet(aiMetricsData);
    XLSX.utils.book_append_sheet(workbook, aiMetricsSheet, 'AI Metrics');

    // Write file
    XLSX.writeFile(workbook, `${filename}-${getTimestamp()}.xlsx`);
    return { success: true };
  } catch (error) {
    console.error('Excel Export Error:', error);
    return { success: false, error: error.message };
  }
};

// ==================== PDF EXPORT ====================

export const exportToPDF = async (element, filename = 'ai-stocks-report', options = {}) => {
  try {
    const {
      title = 'AI Infrastructure Investment Report',
      orientation = 'portrait',
      includeDate = true
    } = options;

    // Capture element as canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#0f172a' // Dark background
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Add title
    pdf.setFontSize(18);
    pdf.setTextColor(255, 255, 255);
    pdf.setFillColor(15, 23, 42); // Dark background
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    pdf.text(title, 10, 15);

    // Add date
    if (includeDate) {
      pdf.setFontSize(10);
      pdf.setTextColor(148, 163, 184);
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 10, 22);
    }

    // Calculate image dimensions to fit page
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add image (may span multiple pages)
    let yPosition = 30;
    const maxImgHeight = pageHeight - 40;

    if (imgHeight <= maxImgHeight) {
      pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, imgHeight);
    } else {
      // Multi-page handling
      let remainingHeight = imgHeight;
      let sourceY = 0;

      while (remainingHeight > 0) {
        const sliceHeight = Math.min(maxImgHeight, remainingHeight);
        const sliceRatio = sliceHeight / imgHeight;

        pdf.addImage(
          imgData,
          'PNG',
          10,
          yPosition,
          imgWidth,
          sliceHeight,
          undefined,
          'FAST',
          0
        );

        remainingHeight -= sliceHeight;
        sourceY += sliceHeight;

        if (remainingHeight > 0) {
          pdf.addPage();
          pdf.setFillColor(15, 23, 42);
          pdf.rect(0, 0, pageWidth, pageHeight, 'F');
          yPosition = 10;
        }
      }
    }

    // Add footer
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);
      pdf.text(
        `Page ${i} of ${pageCount} | AI Research Dashboard`,
        pageWidth / 2,
        pageHeight - 5,
        { align: 'center' }
      );
    }

    pdf.save(`${filename}-${getTimestamp()}.pdf`);
    return { success: true };
  } catch (error) {
    console.error('PDF Export Error:', error);
    return { success: false, error: error.message };
  }
};

// Export simple data table as PDF (without element capture)
export const exportDataToPDF = (stocks, filename = 'ai-stocks-report', options = {}) => {
  try {
    const {
      title = 'AI Infrastructure Investment Report',
      subtitle = ''
    } = options;

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Header
    pdf.setFillColor(15, 23, 42);
    pdf.rect(0, 0, pageWidth, 25, 'F');
    pdf.setFontSize(16);
    pdf.setTextColor(255, 255, 255);
    pdf.text(title, 10, 12);

    if (subtitle) {
      pdf.setFontSize(10);
      pdf.setTextColor(148, 163, 184);
      pdf.text(subtitle, 10, 19);
    }

    // Date
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 50, 12);

    // Table headers
    const headers = ['Ticker', 'Name', 'Sector', 'Price', 'P/E', 'Growth', 'Score', 'Rating', 'Upside'];
    const colWidths = [20, 45, 35, 20, 20, 20, 15, 30, 20];

    let y = 35;
    let x = 10;

    // Header row
    pdf.setFillColor(30, 41, 59);
    pdf.rect(10, y - 5, pageWidth - 20, 8, 'F');
    pdf.setFontSize(9);
    pdf.setTextColor(255, 255, 255);

    headers.forEach((header, i) => {
      pdf.text(header, x, y);
      x += colWidths[i];
    });

    y += 8;

    // Data rows
    pdf.setFontSize(8);
    stocks.forEach((stock, rowIndex) => {
      if (y > pageHeight - 15) {
        pdf.addPage();
        y = 20;
      }

      // Alternate row colors
      if (rowIndex % 2 === 0) {
        pdf.setFillColor(15, 23, 42);
      } else {
        pdf.setFillColor(30, 41, 59);
      }
      pdf.rect(10, y - 4, pageWidth - 20, 7, 'F');

      x = 10;
      const row = [
        stock.ticker,
        (stock.name || '').substring(0, 20),
        (stock.sector || '').substring(0, 15),
        stock.price ? `$${stock.price}` : 'N/A',
        stock.forwardPE || 'N/A',
        stock.revenueGrowth ? `${stock.revenueGrowth}%` : 'N/A',
        stock.score || 'N/A',
        (stock.analystRating || '').substring(0, 12),
        stock.upside ? `${stock.upside}%` : 'N/A'
      ];

      pdf.setTextColor(226, 232, 240);
      row.forEach((cell, i) => {
        pdf.text(String(cell), x, y);
        x += colWidths[i];
      });

      y += 7;
    });

    // Footer
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);
      pdf.text(
        `Page ${i} of ${pageCount} | AI Research Dashboard | ${stocks.length} stocks`,
        pageWidth / 2,
        pageHeight - 5,
        { align: 'center' }
      );
    }

    pdf.save(`${filename}-${getTimestamp()}.pdf`);
    return { success: true };
  } catch (error) {
    console.error('PDF Export Error:', error);
    return { success: false, error: error.message };
  }
};

// ==================== COMBINED EXPORT ====================

export const exportStocks = async (stocks, format, options = {}) => {
  const { filename = 'ai-stocks', element = null } = options;

  switch (format.toLowerCase()) {
    case 'csv':
      return exportToCSV(stocks, filename);
    case 'excel':
    case 'xlsx':
      return exportToExcel(stocks, filename);
    case 'pdf':
      if (element) {
        return exportToPDF(element, filename, options);
      }
      return exportDataToPDF(stocks, filename, options);
    default:
      return { success: false, error: `Unknown format: ${format}` };
  }
};

export default {
  exportToCSV,
  exportToExcel,
  exportToPDF,
  exportDataToPDF,
  exportStocks
};
