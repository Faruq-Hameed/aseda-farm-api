import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly apiKey: string;
  private readonly from: string;

  constructor(private config: ConfigService) {
    this.apiKey = this.config.get('RESEND_API_KEY') || '';
    this.from = this.config.get('EMAIL_FROM') || 'ASEDA Farm <notifications@asedafarm.ng>';
  }

  private async send(to: string, subject: string, html: string) {
    if (!this.apiKey) return;
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: this.from, to, subject, html }),
    });
  }

  async sendTaskReminder(params: {
    to: string;
    taskTitle: string;
    taskCategory: string;
    dueDate: string;
    batchName: string;
    product?: string;
    quantity?: string;
    description?: string;
    daysUntilDue: number;
  }) {
    const { daysUntilDue, taskTitle } = params;
    const subject = `${daysUntilDue === 0 ? '🚨 DUE TODAY' : daysUntilDue < 0 ? '⛔ OVERDUE' : `⏰ Due in ${daysUntilDue} days`}: ${taskTitle} — ASEDA Farm`;
    await this.send(params.to, subject, this.taskHtml(params));
  }

  async sendDailyDigest(params: {
    to: string;
    todaysTasks: any[];
    overdueTasks: any[];
    upcomingTasks: any[];
    date: string;
  }) {
    await this.send(
      params.to,
      `🌿 ASEDA Farm Daily Digest — ${params.date}`,
      this.digestHtml(params),
    );
  }

  private taskHtml(p: any): string {
    const banner = p.daysUntilDue < 0 ? '#B71C1C' : p.daysUntilDue === 0 ? '#E65100' : '#F57F17';
    const status = p.daysUntilDue < 0 ? `⛔ OVERDUE by ${Math.abs(p.daysUntilDue)} days` : p.daysUntilDue === 0 ? '🚨 DUE TODAY' : `⏰ Due in ${p.daysUntilDue} days`;
    return `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:20px;">
<div style="max-width:600px;margin:0 auto;background:white;border-radius:8px;overflow:hidden;">
<div style="background:#1B5E20;padding:24px;text-align:center;"><h1 style="color:white;margin:0;">🌿 ASEDA Farm</h1><p style="color:#A5D6A7;margin:4px 0 0;">Adesiyan Village, Olojuoro Road, Ibadan</p></div>
<div style="background:${banner};padding:12px;text-align:center;"><p style="color:white;margin:0;font-weight:bold;">${status}</p></div>
<div style="padding:24px;"><h2 style="color:#1B5E20;">${p.taskTitle}</h2>
<table style="width:100%;border-collapse:collapse;">
<tr><td style="padding:8px;background:#f9f9f9;font-weight:bold;border:1px solid #e0e0e0;">Batch</td><td style="padding:8px;border:1px solid #e0e0e0;">${p.batchName}</td></tr>
<tr><td style="padding:8px;background:#f9f9f9;font-weight:bold;border:1px solid #e0e0e0;">Due Date</td><td style="padding:8px;border:1px solid #e0e0e0;">${p.dueDate}</td></tr>
${p.product ? `<tr><td style="padding:8px;background:#f9f9f9;font-weight:bold;border:1px solid #e0e0e0;">Product</td><td style="padding:8px;border:1px solid #e0e0e0;">${p.product}</td></tr>` : ''}
${p.quantity ? `<tr><td style="padding:8px;background:#f9f9f9;font-weight:bold;border:1px solid #e0e0e0;">Quantity</td><td style="padding:8px;border:1px solid #e0e0e0;">${p.quantity}</td></tr>` : ''}
</table>
${p.description ? `<div style="background:#E8F5E9;border-left:4px solid #1B5E20;padding:12px;margin-top:16px;">${p.description}</div>` : ''}
</div>
<div style="background:#f5f5f5;padding:16px;text-align:center;border-top:1px solid #e0e0e0;"><p style="color:#666;font-size:12px;margin:0;">ASEDA Farm Management System | Ibadan, Oyo State</p></div>
</div></body></html>`;
  }

  private digestHtml(p: any): string {
    const row = (t: any) => `<tr><td style="padding:8px;border:1px solid #e0e0e0;">${t.title}</td><td style="padding:8px;border:1px solid #e0e0e0;">${t.batch?.name || '—'}</td></tr>`;
    return `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:20px;">
<div style="max-width:600px;margin:0 auto;background:white;border-radius:8px;overflow:hidden;">
<div style="background:#1B5E20;padding:24px;text-align:center;"><h1 style="color:white;margin:0;">🌿 ASEDA Farm Daily Digest</h1><p style="color:#A5D6A7;margin:4px 0 0;">${p.date}</p></div>
<div style="padding:24px;">
${p.overdueTasks.length > 0 ? `<h3 style="color:#B71C1C;">⛔ Overdue (${p.overdueTasks.length})</h3><table style="width:100%;border-collapse:collapse;margin-bottom:16px;"><thead><tr style="background:#ffebee;"><th style="padding:8px;border:1px solid #e0e0e0;text-align:left;">Task</th><th style="padding:8px;border:1px solid #e0e0e0;text-align:left;">Batch</th></tr></thead><tbody>${p.overdueTasks.map(row).join('')}</tbody></table>` : ''}
${p.todaysTasks.length > 0 ? `<h3 style="color:#E65100;">🚨 Due Today (${p.todaysTasks.length})</h3><table style="width:100%;border-collapse:collapse;margin-bottom:16px;"><thead><tr style="background:#fff3e0;"><th style="padding:8px;border:1px solid #e0e0e0;text-align:left;">Task</th><th style="padding:8px;border:1px solid #e0e0e0;text-align:left;">Batch</th></tr></thead><tbody>${p.todaysTasks.map(row).join('')}</tbody></table>` : ''}
${p.upcomingTasks.length > 0 ? `<h3 style="color:#1B5E20;">⏰ Upcoming (${p.upcomingTasks.length})</h3><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#E8F5E9;"><th style="padding:8px;border:1px solid #e0e0e0;text-align:left;">Task</th><th style="padding:8px;border:1px solid #e0e0e0;text-align:left;">Batch</th></tr></thead><tbody>${p.upcomingTasks.map(row).join('')}</tbody></table>` : ''}
${p.todaysTasks.length === 0 && p.overdueTasks.length === 0 && p.upcomingTasks.length === 0 ? '<p style="color:#2E7D32;">✅ No urgent tasks today. Farm is on track!</p>' : ''}
</div>
<div style="background:#f5f5f5;padding:16px;text-align:center;"><p style="color:#666;font-size:12px;margin:0;">ASEDA Farm Management System | Ibadan, Oyo State</p></div>
</div></body></html>`;
  }
}
