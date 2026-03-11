import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Plus, 
  Printer, 
  Download, 
  Trash2, 
  ChevronRight, 
  ArrowLeft,
  Calendar,
  User,
  FileText,
  Hash,
  CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';
import { cn, COMPANIES, numberToWords, type Company, type VoucherData } from './types';

export default function App() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [vouchers, setVouchers] = useState<(VoucherData & { id: string; companyId: string })[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [viewingVoucher, setViewingVoucher] = useState<(VoucherData & { id: string; companyId: string }) | null>(null);

  const printRef = useRef<HTMLDivElement>(null);

  const getNextVoucherNo = () => {
    if (!selectedCompany) return "1001";
    const companyVouchers = vouchers.filter(v => v.companyId === selectedCompany.id);
    if (companyVouchers.length === 0) return "1001";
    
    const nos = companyVouchers.map(v => parseInt(v.voucherNo)).filter(n => !isNaN(n));
    if (nos.length === 0) return "1001";
    
    return (Math.max(...nos) + 1).toString();
  };

  const handleCreateVoucher = (data: VoucherData) => {
    if (!selectedCompany) return;
    const newVoucher = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      companyId: selectedCompany.id,
    };
    setVouchers([newVoucher, ...vouchers]);
    setIsCreating(false);
    setViewingVoucher(newVoucher);
  };

  const handleDeleteVoucher = (id: string) => {
    setVouchers(vouchers.filter(v => v.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={cn(
      "min-h-screen bg-zinc-50 text-zinc-900 font-sans",
      viewingVoucher && "has-viewing-voucher"
    )}>
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-10 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold", selectedCompany ? selectedCompany.primaryColor : "bg-purple-700")}>
              AED
            </div>
            <h1 className="text-xl font-bold tracking-tight">Petty Cash Pro</h1>
          </div>
          
          {selectedCompany && (
            <button 
              onClick={() => setSelectedCompany(null)}
              className="text-sm font-medium text-zinc-500 hover:text-zinc-900 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft size={16} />
              Switch Company
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {!selectedCompany ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Select a Company</h2>
                <p className="text-zinc-500">Choose the organization you want to manage petty cash for.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {COMPANIES.map((company) => (
                  <button
                    key={company.id}
                    onClick={() => setSelectedCompany(company)}
                    className="group relative bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all text-left overflow-hidden"
                  >
                    <div className={cn("absolute top-0 left-0 w-full h-1.5", company.primaryColor)} />
                    <img 
                      src={company.logo} 
                      alt={company.name}
                      className="max-w-[120px] max-h-[60px] w-auto h-auto mb-6 object-contain bg-zinc-50 rounded-lg p-1"
                      referrerPolicy="no-referrer"
                    />
                    <h3 className={cn("text-xl font-bold mb-2 transition-colors", `group-hover:${company.accentColor}`)}>{company.name}</h3>
                    <p className="text-sm text-zinc-500 mb-6 line-clamp-2">{company.address}</p>
                    <div className="flex items-center text-sm font-semibold text-zinc-900">
                      Manage Vouchers
                      <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8 print:hidden"
            >
              {/* Company Banner */}
              <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <img 
                    src={selectedCompany.logo} 
                    alt={selectedCompany.name}
                    className="max-w-[140px] max-h-[70px] w-auto h-auto object-contain bg-zinc-50 rounded-lg p-1"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h2 className="text-2xl font-bold">{selectedCompany.name}</h2>
                    <p className="text-zinc-500 text-sm">{selectedCompany.email} • {selectedCompany.phone}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCreating(true)}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]",
                    selectedCompany.primaryColor
                  )}
                >
                  <Plus size={20} />
                  New Voucher
                </button>
              </div>

              {/* Vouchers List */}
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden print-content">
                <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between print:border-b-4 print:border-zinc-900 print:pb-6 print:mb-6">
                  <div className="flex flex-col">
                    <h3 className="font-bold text-lg print:text-3xl print:uppercase print:tracking-tight">Recent Vouchers</h3>
                    <p className="hidden print:block text-xs text-zinc-500 mt-1 uppercase tracking-widest font-bold">
                      {selectedCompany.name} • Petty Cash Summary Report
                    </p>
                  </div>
                  <div className="flex items-center gap-3 print:hidden">
                    <button 
                      onClick={() => window.print()}
                      className="text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-zinc-600 transition-colors"
                    >
                      <Printer size={14} />
                      Print List
                    </button>
                    <span className="text-xs font-medium px-2 py-1 bg-zinc-100 rounded-full text-zinc-500">
                      {vouchers.filter(v => v.companyId === selectedCompany.id).length} Total
                    </span>
                  </div>
                </div>
                
                <div className="divide-y divide-zinc-100 print:divide-y-2 print:divide-zinc-900">
                  {vouchers.filter(v => v.companyId === selectedCompany.id).length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-300">
                        <FileText size={32} />
                      </div>
                      <p className="text-zinc-500">No vouchers found for this company.</p>
                      <button 
                        onClick={() => setIsCreating(true)}
                        className={cn("mt-4 text-sm font-semibold hover:underline", selectedCompany.accentColor)}
                      >
                        Create your first voucher
                      </button>
                    </div>
                  ) : (
                    vouchers
                      .filter(v => v.companyId === selectedCompany.id)
                      .map((voucher) => (
                        <div 
                          key={voucher.id} 
                          className="px-6 py-4 flex items-center justify-between hover:bg-zinc-50 transition-colors group cursor-pointer print:px-0 print:py-4"
                          onClick={() => setViewingVoucher(voucher)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500 font-mono text-xs print:border print:border-zinc-900 print:bg-white print:text-zinc-900">
                              #{voucher.voucherNo}
                            </div>
                            <div>
                              <div className="font-semibold print:text-lg">{voucher.paidTo}</div>
                              <div className="text-xs text-zinc-500 print:text-zinc-900 print:font-medium">
                                {format(new Date(voucher.date), 'MMM dd, yyyy')} • {voucher.description}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <div className="font-bold text-lg print:text-xl">AED {voucher.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                              <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold print:text-zinc-900">{voucher.accountCode}</div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setViewingVoucher(voucher);
                                  setTimeout(() => window.print(), 100);
                                }}
                                className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-zinc-200 text-zinc-500 flex items-center gap-1 text-xs font-bold"
                              >
                                <Printer size={18} />
                                Print
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteVoucher(voucher.id);
                                }}
                                className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Create Voucher Modal */}
      <AnimatePresence>
        {isCreating && selectedCompany && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreating(false)}
              className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className={cn("h-2 w-full", selectedCompany.primaryColor)} />
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold">New Petty Cash Voucher</h3>
                  <button 
                    onClick={() => setIsCreating(false)}
                    className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                  >
                    <Plus size={24} className="rotate-45" />
                  </button>
                </div>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleCreateVoucher({
                      voucherNo: formData.get('voucherNo') as string,
                      date: formData.get('date') as string,
                      paidTo: formData.get('paidTo') as string,
                      description: formData.get('description') as string,
                      amount: parseFloat(formData.get('amount') as string),
                      accountCode: formData.get('accountCode') as string,
                      approvedBy: formData.get('approvedBy') as string,
                      receivedBy: formData.get('receivedBy') as string,
                    });
                  }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                        <Hash size={12} /> Voucher No
                      </label>
                      <input 
                        required 
                        readOnly
                        name="voucherNo"
                        defaultValue={getNextVoucherNo()}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-500 cursor-not-allowed outline-none transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                        <Calendar size={12} /> Date
                      </label>
                      <input 
                        required 
                        type="date" 
                        name="date"
                        defaultValue={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                      <User size={12} /> Paid To
                    </label>
                    <input 
                      required 
                      name="paidTo"
                      placeholder="Name of recipient"
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                      <FileText size={12} /> Description
                    </label>
                    <textarea 
                      required 
                      name="description"
                      placeholder="Purpose of payment"
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-500 focus:border-transparent outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                        Amount (AED)
                      </label>
                      <input 
                        required 
                        type="number" 
                        step="0.01" 
                        name="amount"
                        placeholder="0.00"
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-500 focus:border-transparent outline-none transition-all font-bold text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                        <Building2 size={12} /> Account Code
                      </label>
                      <input 
                        required 
                        name="accountCode"
                        placeholder="e.g. OFFICE-EXP"
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-500 focus:border-transparent outline-none transition-all uppercase"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-100">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Approved By</label>
                      <input 
                        required 
                        name="approvedBy"
                        className="w-full px-4 py-2 rounded-lg border border-zinc-200 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Received By</label>
                      <input 
                        required 
                        name="receivedBy"
                        className="w-full px-4 py-2 rounded-lg border border-zinc-200 text-sm"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className={cn(
                      "w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99]",
                      selectedCompany.primaryColor
                    )}
                  >
                    Generate Voucher
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View/Print Voucher Modal */}
      <AnimatePresence>
        {viewingVoucher && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingVoucher(null)}
              className="fixed inset-0 bg-zinc-900/60 backdrop-blur-md print:hidden"
            />
            
            <div className="relative w-full max-w-4xl my-8">
              <div className="flex justify-end gap-3 mb-4 print:hidden">
                <button 
                  onClick={handlePrint}
                  className="bg-white text-zinc-900 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-xl hover:bg-zinc-50 transition-all"
                >
                  <Printer size={20} />
                  Print Voucher
                </button>
                <button 
                  onClick={() => setViewingVoucher(null)}
                  className="bg-zinc-800 text-white p-2.5 rounded-xl shadow-xl hover:bg-zinc-700 transition-all"
                >
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              {/* Printable Voucher */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "bg-white p-12 shadow-2xl rounded-sm border border-zinc-200 mx-auto print:shadow-none print:border-none print:p-0 print:m-0",
                  COMPANIES.find(c => c.id === viewingVoucher.companyId)?.fontFamily
                )}
                id="printable-voucher"
              >
                {(() => {
                  const company = COMPANIES.find(c => c.id === viewingVoucher.companyId)!;
                  return (
                    <div className="space-y-10 print:space-y-8">
                      {/* Voucher Header */}
                      <div className="flex justify-between items-start border-b-4 border-zinc-900 pb-8">
                        <div className="flex gap-8 items-center">
                          <img 
                            src={company.logo} 
                            alt={company.name}
                            className="max-w-[180px] max-h-[90px] w-auto h-auto object-contain"
                            referrerPolicy="no-referrer"
                          />
                          <div className="border-l-2 border-zinc-200 pl-8">
                            <h2 className="text-3xl font-black uppercase tracking-tighter mb-1 leading-none">{company.name}</h2>
                            <p className="text-xs text-zinc-600 max-w-xs leading-tight font-bold">{company.address}</p>
                            <p className="text-xs text-zinc-600 mt-1 font-bold">{company.phone} • {company.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-5xl font-black uppercase tracking-[0.1em] text-zinc-900 mb-4">Voucher</div>
                          <div className="inline-flex flex-col items-end">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Number</span>
                              <span className="text-2xl font-black px-3 py-1 bg-zinc-900 text-white min-w-[120px] text-center">{viewingVoucher.voucherNo}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Date</span>
                              <span className="text-lg font-bold border-b-2 border-zinc-900 min-w-[120px] text-center">{format(new Date(viewingVoucher.date), 'dd / MM / yyyy')}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Voucher Body */}
                      <div className="space-y-8">
                        <div className="flex items-end gap-6 border-b-2 border-zinc-200 pb-3">
                          <span className="text-sm font-black uppercase tracking-widest text-zinc-400 min-w-[100px]">Paid To</span>
                          <span className="text-2xl font-bold flex-grow text-zinc-900">{viewingVoucher.paidTo}</span>
                        </div>

                        <div className="flex items-start gap-6 border-b-2 border-zinc-200 pb-3 min-h-[100px]">
                          <span className="text-sm font-black uppercase tracking-widest text-zinc-400 min-w-[100px] mt-2">Description</span>
                          <span className="text-xl leading-relaxed text-zinc-800 font-medium">{viewingVoucher.description}</span>
                        </div>

                        <div className="grid grid-cols-12 gap-8">
                          <div className="col-span-8 flex flex-col justify-end">
                            <div className="flex items-end gap-6 border-b-2 border-zinc-200 pb-3">
                              <span className="text-sm font-black uppercase tracking-widest text-zinc-400 min-w-[100px]">In Words</span>
                              <span className="text-lg italic font-bold text-zinc-900 capitalize">
                                {numberToWords(viewingVoucher.amount)}
                              </span>
                            </div>
                          </div>
                          <div className="col-span-4">
                            <div className="bg-zinc-50 border-4 border-zinc-900 p-6 flex flex-col items-center justify-center relative overflow-hidden">
                              <div className="absolute top-0 left-0 w-full h-1 bg-zinc-900" />
                              <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-900" />
                              <span className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400 mb-2">Total Amount</span>
                              <div className="flex items-baseline gap-3">
                                <span className="text-xl font-black text-zinc-900">AED</span>
                                <span className="text-4xl font-black text-zinc-900">
                                  {viewingVoucher.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Voucher Footer */}
                      <div className="grid grid-cols-4 gap-8 pt-12">
                        <div className="space-y-4">
                          <div className="h-16 border-2 border-zinc-200 rounded-lg flex items-center justify-center bg-zinc-50/50">
                            <span className="text-lg font-bold text-zinc-900">{viewingVoucher.accountCode}</span>
                          </div>
                          <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Account Code</p>
                        </div>
                        <div className="space-y-4">
                          <div className="h-16 border-b-2 border-zinc-900 flex items-end justify-center pb-2">
                            <span className="text-sm font-bold text-zinc-400 italic">Authorized Signature</span>
                          </div>
                          <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900">Approved By</p>
                        </div>
                        <div className="space-y-4">
                          <div className="h-16 border-b-2 border-zinc-900 flex items-end justify-center pb-2">
                            <span className="text-sm font-bold text-zinc-400 italic">Receiver's Signature</span>
                          </div>
                          <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900">Received By</p>
                        </div>
                        <div className="space-y-4 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 rounded-xl p-4">
                          <div className="w-16 h-16 border-2 border-zinc-100 rounded-full flex items-center justify-center">
                            <span className="text-[8px] text-zinc-300 font-black text-center leading-tight">OFFICIAL<br/>STAMP</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-8 flex justify-between items-center text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] border-t border-zinc-100">
                        <div className="flex items-center gap-4">
                          <span>Petty Cash Pro System</span>
                          <span className="w-1 h-1 bg-zinc-200 rounded-full" />
                          <span>{new Date().toLocaleString()}</span>
                        </div>
                        <div className="px-3 py-1 border border-zinc-200 rounded-full">
                          Original Document
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Print Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          
          body * {
            visibility: hidden;
          }
          
          /* Print Voucher Mode */
          .has-viewing-voucher #printable-voucher, 
          .has-viewing-voucher #printable-voucher * {
            visibility: visible !important;
          }
          .has-viewing-voucher #printable-voucher {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            border: none;
            box-shadow: none;
          }

          /* Print List Mode */
          div:not(.has-viewing-voucher) .print-content,
          div:not(.has-viewing-voucher) .print-content * {
            visibility: visible !important;
          }
          div:not(.has-viewing-voucher) .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none;
            box-shadow: none;
          }
          
          /* Hide interactive elements in list print */
          .print-content button, 
          .print-content .print\:hidden {
            display: none !important;
          }

          @page {
            size: A4;
            margin: 1.5cm;
          }
          
          .print\:hidden {
            display: none !important;
          }
          
          /* Force high contrast for printing */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}} />
    </div>
  );
}
