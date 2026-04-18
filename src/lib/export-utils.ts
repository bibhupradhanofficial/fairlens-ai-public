import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { AuditResult } from '@/types/audit';

export function exportAuditPDF(result: AuditResult) {
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Bias Audit Report', 20, y);
  y += 12;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, y);
  y += 15;

  // Summary
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('AI Summary', 20, y);
  y += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const summaryLines = doc.splitTextToSize(result.summary, 170);
  doc.text(summaryLines, 20, y);
  y += summaryLines.length * 5 + 10;

  // Fairness Metrics Table
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Fairness Metrics', 20, y);
  y += 5;

  autoTable(doc, {
    startY: y,
    head: [['Metric', 'Value', 'Threshold', 'Status']],
    body: result.fairnessMetrics.map((m) => [
      m.name,
      m.value.toFixed(3),
      m.threshold.toFixed(3),
      m.status.toUpperCase(),
    ]),
    theme: 'striped',
    headStyles: { fillColor: [66, 99, 235] },
  });

  // Recommendations
  y = (doc as any).lastAutoTable.finalY + 15;
  if (y > 260) {
    doc.addPage();
    y = 20;
  }

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Recommendations', 20, y);
  y += 8;

  result.recommendations.forEach((rec) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`• ${rec.title} [${rec.impact.toUpperCase()}]`, 20, y);
    y += 6;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(rec.description, 165);
    doc.text(lines, 25, y);
    y += lines.length * 4 + 6;
  });

  doc.save('bias-audit-report.pdf');
}

export function exportMetricsCSV(result: AuditResult) {
  const headers = ['Metric', 'Value', 'Threshold', 'Status', 'Description'];
  const rows = result.fairnessMetrics.map((m) => [
    m.name,
    m.value.toString(),
    m.threshold.toString(),
    m.status,
    `"${m.description}"`,
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'fairness-metrics.csv';
  a.click();
  URL.revokeObjectURL(url);
}
