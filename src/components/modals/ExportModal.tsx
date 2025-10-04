import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, Lock, Download } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

const ExportModal = ({ isOpen, onClose, content }: ExportModalProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportTxt = () => {
    try {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mergenta-export-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Exported to TXT');
    } catch (error) {
      console.error('TXT export error:', error);
      toast.error('Failed to export TXT');
    }
  };

  const handleExportGoogleDocs = async () => {
    setIsExporting(true);
    try {
      const { data, error } = await supabase.functions.invoke('export-google', {
        body: {
          content,
          exportType: 'docs',
          fileName: `mergenta-export-${Date.now()}`,
        },
      });

      if (error) throw error;

      if (data.exportUrl) {
        window.open(data.exportUrl, '_blank');
        toast.success('Exported to Google Docs');
      } else {
        toast.success(data.message || 'Export successful');
      }
    } catch (error: any) {
      console.error('Google Docs export error:', error);
      toast.error(error.message || 'Failed to export to Google Docs');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportGoogleSheets = async () => {
    setIsExporting(true);
    try {
      const { data, error } = await supabase.functions.invoke('export-google', {
        body: {
          content,
          exportType: 'sheets',
          fileName: `mergenta-export-${Date.now()}`,
        },
      });

      if (error) throw error;

      if (data.exportUrl) {
        window.open(data.exportUrl, '_blank');
        toast.success('Exported to Google Sheets');
      } else {
        toast.success(data.message || 'Export successful');
      }
    } catch (error: any) {
      console.error('Google Sheets export error:', error);
      toast.error(error.message || 'Failed to export to Google Sheets');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCloudConvertExport = () => {
    toast.info('CloudConvert integration coming soon');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Export Content</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {/* TXT Export */}
          <Button
            onClick={handleExportTxt}
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-4"
          >
            <Download className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Plain Text (.txt)</div>
              <div className="text-xs text-muted-foreground">Download as text file</div>
            </div>
          </Button>

          {/* Google Docs Export */}
          <Button
            onClick={handleExportGoogleDocs}
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-4"
            disabled={isExporting}
          >
            <FileText className="h-5 w-5 text-blue-600" />
            <div className="text-left">
              <div className="font-semibold">Google Docs</div>
              <div className="text-xs text-muted-foreground">Export to Google Drive</div>
            </div>
          </Button>

          {/* Google Sheets Export */}
          <Button
            onClick={handleExportGoogleSheets}
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-4"
            disabled={isExporting}
          >
            <FileSpreadsheet className="h-5 w-5 text-green-600" />
            <div className="text-left">
              <div className="font-semibold">Google Sheets</div>
              <div className="text-xs text-muted-foreground">Export as spreadsheet</div>
            </div>
          </Button>

          {/* CloudConvert - Coming Soon */}
          <Button
            onClick={handleCloudConvertExport}
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-4 opacity-60"
            disabled
          >
            <Lock className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">CloudConvert</div>
              <div className="text-xs text-muted-foreground">PDF, DOCX, XLSX - Coming soon</div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal;
