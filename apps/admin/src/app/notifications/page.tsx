'use client';

import * as React from 'react';
import { AdminLayout } from '../../components/admin-layout';
import { PageHeader, Button, Input } from '@cinmax/ui';
import {
  Bell,
  Send,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  ExternalLink,
  MessageSquare,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';

interface NotificationCampaign {
  id: string;
  title: string;
  message: string;
  targetGroup: string;
  deepLink: string;
  status: 'SENT' | 'SCHEDULED' | 'DRAFT';
  scheduledTime: string;
  sentCount: number;
  openRate: string;
}

export default function NotificationsManagementPage() {
  const [campaigns, setCampaigns] = React.useState<NotificationCampaign[]>([
    {
      id: 'NOTIF-101',
      title: 'Weekend Special: Buy 2 Get 1 Free on Botanical Bars!',
      message: 'Indulge in artisanal organic soap bars. Handcrafted cold-process luxury now with complimentary bar.',
      targetGroup: 'All Customers',
      deepLink: '/category/herbal-soap',
      status: 'SENT',
      scheduledTime: '18 Aug 2026, 10:00 AM',
      sentCount: 1240,
      openRate: '38.4%',
    },
    {
      id: 'NOTIF-102',
      title: 'Welcome to CINMAX! ₹100 Off Your First Ritual',
      message: 'Use code WELCOME100 on your first botanical skincare order. Free express delivery included.',
      targetGroup: 'New Customers',
      deepLink: '/shop',
      status: 'SENT',
      scheduledTime: '17 Aug 2026, 06:30 PM',
      sentCount: 310,
      openRate: '54.2%',
    },
    {
      id: 'NOTIF-103',
      title: 'Your Loyalty Points Are Waiting!',
      message: 'You have active CINMAX points ready to redeem at checkout. Treat your skin today.',
      targetGroup: 'VIP Loyalty Club',
      deepLink: '/cart',
      status: 'SCHEDULED',
      scheduledTime: '20 Aug 2026, 09:00 AM',
      sentCount: 184,
      openRate: '-',
    },
    {
      id: 'NOTIF-104',
      title: 'We Miss You: Complimentary Saffron Sample',
      message: 'Come back and discover our new Saffron & Goat Milk brightening range.',
      targetGroup: 'Inactive Customers',
      deepLink: '/product/saffron-goat-milk',
      status: 'DRAFT',
      scheduledTime: 'Not scheduled',
      sentCount: 0,
      openRate: '-',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState('');
  const [newMessage, setNewMessage] = React.useState('');
  const [newTarget, setNewTarget] = React.useState('All Customers');
  const [newDeepLink, setNewDeepLink] = React.useState('/category/herbal-soap');
  const [sendOption, setSendOption] = React.useState<'now' | 'schedule'>('now');
  const [scheduleDateTime, setScheduleDateTime] = React.useState('');

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) return;

    const newCampaign: NotificationCampaign = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      title: newTitle.trim(),
      message: newMessage.trim(),
      targetGroup: newTarget,
      deepLink: newDeepLink.trim(),
      status: sendOption === 'now' ? 'SENT' : 'SCHEDULED',
      scheduledTime: sendOption === 'now' ? 'Sent Just Now' : scheduleDateTime || 'Tomorrow, 09:00 AM',
      sentCount: sendOption === 'now' ? 1420 : 0,
      openRate: sendOption === 'now' ? 'Pending' : '-',
    };

    setCampaigns([newCampaign, ...campaigns]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewMessage('');
  };

  return (
    <AdminLayout>
      <PageHeader
        badge="Engagement & CRM"
        title="Push Notification Campaigns"
        subtitle="Broadcast promotional updates, personalized offers, and engagement alerts to mobile & web users."
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl flex items-center gap-2 font-bold shadow-md shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            + New Campaign
          </Button>
        }
      />

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 my-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Notifications Sent</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#0F172A] dark:text-white">4,890</h3>
          <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> 98.6% delivery success
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Average Open Rate</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200 dark:border-purple-800">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#0F172A] dark:text-white">42.8%</h3>
          <p className="text-[11px] font-semibold text-slate-500">+12% above industry benchmark</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Subscribed Devices</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#0F172A] dark:text-white">1,620</h3>
          <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">+185 this week</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Scheduled Campaigns</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#0F172A] dark:text-white">1 Active</h3>
          <p className="text-[11px] font-semibold text-slate-500">Next dispatch: Tomorrow</p>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 my-6">
        <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-[#0F172A] dark:text-white">Campaigns History & Queue</h3>
            <p className="text-xs text-slate-400">Track notification performance, delivery status, and click-through rates</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
              <tr>
                <th className="pb-3">Campaign / Notification</th>
                <th className="pb-3">Target Audience</th>
                <th className="pb-3">Deep Link</th>
                <th className="pb-3">Dispatch Time</th>
                <th className="pb-3">Sent / Reach</th>
                <th className="pb-3">Open Rate</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 max-w-xs pr-4">
                    <p className="font-bold text-[#0F172A] dark:text-white text-xs truncate">{c.title}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{c.message}</p>
                  </td>
                  <td className="py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      {c.targetGroup}
                    </span>
                  </td>
                  <td className="py-3.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1">
                      {c.deepLink} <ExternalLink className="w-3 h-3 text-slate-400" />
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-500 font-medium">{c.scheduledTime}</td>
                  <td className="py-3.5 font-bold text-[#0F172A] dark:text-white">{c.sentCount > 0 ? c.sentCount.toLocaleString() : '-'}</td>
                  <td className="py-3.5 font-bold text-emerald-600 dark:text-emerald-400">{c.openRate}</td>
                  <td className="py-3.5 text-right">
                    {c.status === 'SENT' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        Delivered
                      </span>
                    )}
                    {c.status === 'SCHEDULED' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        Scheduled
                      </span>
                    )}
                    {c.status === 'DRAFT' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        Draft
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Campaign Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0B132B] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-[#0F172A] dark:text-white">Create Push Notification</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                  Notification Title *
                </label>
                <Input
                  required
                  placeholder="e.g. Special Offer: Buy 2 Get 1 Free on Artisan Bars"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                  Message Body *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Enter compelling promotional copy to drive customer clicks..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                    Target Audience
                  </label>
                  <select
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold"
                  >
                    <option value="All Customers">All Customers</option>
                    <option value="New Customers">New Customers</option>
                    <option value="Existing Customers">Existing Customers</option>
                    <option value="Inactive Customers">Inactive Customers</option>
                    <option value="VIP Loyalty Club">VIP Loyalty Club</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                    Destination URL / Deep Link
                  </label>
                  <Input
                    placeholder="/category/herbal-soap"
                    value={newDeepLink}
                    onChange={(e) => setNewDeepLink(e.target.value)}
                  />
                </div>
              </div>

              {/* Delivery Timing */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Dispatch Schedule
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="dispatch"
                      checked={sendOption === 'now'}
                      onChange={() => setSendOption('now')}
                    />
                    <span>Send Immediately</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="dispatch"
                      checked={sendOption === 'schedule'}
                      onChange={() => setSendOption('schedule')}
                    />
                    <span>Schedule For Later</span>
                  </label>
                </div>

                {sendOption === 'schedule' && (
                  <Input
                    type="datetime-local"
                    value={scheduleDateTime}
                    onChange={(e) => setScheduleDateTime(e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" className="rounded-xl flex items-center gap-2 font-bold shadow-md shadow-blue-500/20">
                  <Send className="w-4 h-4" />
                  {sendOption === 'now' ? 'Broadcast Now' : 'Schedule Campaign'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
