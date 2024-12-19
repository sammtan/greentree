import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface TreeReportFormProps {
    treeId: string;
    onReportSubmit: (report: string) => void;
}

export function TreeReportForm({ treeId, onReportSubmit }: TreeReportFormProps) {
    const [report, setReport] = useState('');

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
            <Button type="submit">Submit Report</Button>
        </form>
    );
}