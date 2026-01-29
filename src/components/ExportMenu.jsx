import React, { useState, useRef, useEffect } from 'react';
import { Download, FileText, Sheet, File, ChevronDown, Check, Loader2 } from 'lucide-react';
import { exportToCSV, exportToExcel, exportDataToPDF } from '../services/exportService';

const ExportMenu = ({ stocks, filename = 'ai-stocks', title = 'Export Data' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [exporting, setExporting] = useState(null);
  const [success, setSuccess] = useState(null);
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = async (format) => {
    if (!stocks || stocks.length === 0) {
      alert('No data to export');
      return;
    }

    setExporting(format);
    setSuccess(null);

    try {
      let result;

      switch (format) {
        case 'csv':
          result = exportToCSV(stocks, filename);
          break;
        case 'excel':
          result = exportToExcel(stocks, filename);
          break;
        case 'pdf':
          result = exportDataToPDF(stocks, filename, { title });
          break;
        default:
          throw new Error('Unknown format');
      }

      if (result.success) {
        setSuccess(format);
        setTimeout(() => {
          setSuccess(null);
          setIsOpen(false);
        }, 1500);
      } else {
        alert(`Export failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert(`Export failed: ${error.message}`);
    } finally {
      setExporting(null);
    }
  };

  const exportOptions = [
    {
      format: 'csv',
      label: 'Export as CSV',
      description: 'Comma-separated values',
      icon: FileText,
      color: 'text-emerald-400'
    },
    {
      format: 'excel',
      label: 'Export as Excel',
      description: 'Multi-sheet workbook',
      icon: Sheet,
      color: 'text-green-400'
    },
    {
      format: 'pdf',
      label: 'Export as PDF',
      description: 'Formatted report',
      icon: File,
      color: 'text-red-400'
    }
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-lg text-slate-300 hover:text-white transition-colors text-sm"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Export</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-slate-700/50 rounded-xl shadow-xl shadow-black/50 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-slate-700/50">
            <p className="text-sm font-medium text-white">Export Options</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {stocks?.length || 0} stocks selected
            </p>
          </div>

          <div className="p-2">
            {exportOptions.map((option) => {
              const Icon = option.icon;
              const isExporting = exporting === option.format;
              const isSuccess = success === option.format;

              return (
                <button
                  key={option.format}
                  onClick={() => handleExport(option.format)}
                  disabled={isExporting}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800/50 transition-colors text-left group disabled:opacity-50"
                >
                  <div className={`p-1.5 rounded-lg bg-slate-800 group-hover:bg-slate-700 transition-colors`}>
                    {isExporting ? (
                      <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                    ) : isSuccess ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Icon className={`w-4 h-4 ${option.color}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">{option.label}</p>
                    <p className="text-xs text-slate-500">{option.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="px-4 py-2 border-t border-slate-700/50 bg-slate-800/30">
            <p className="text-xs text-slate-500">
              Files include all visible metrics
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportMenu;
