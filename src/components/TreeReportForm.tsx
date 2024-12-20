import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface TreeReportFormProps {
  treeId: string;
  username: string; // Add this
  onReportSubmit: (report: string) => void;
}

export function TreeReportForm({ treeId, username, onReportSubmit }: TreeReportFormProps) {
  const [report, setReport] = useState('');

  if (!username) {
    return (
      <div className="text-center text-muted-foreground">
        Please sign in to report issues
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (report.trim()) {
      onReportSubmit(report);
      setReport('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Describe the issue with this tree..."
        value={report}
        onChange={(e) => setReport(e.target.value)}
        required
      />
      <Button type="submit" className="w-full">Submit Report</Button>
    </form>
  );
}
