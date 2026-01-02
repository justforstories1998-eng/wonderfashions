import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, color = 'primary', loading = false }) => {
  
  if (loading) {
    return <div className="h-32 bg-white rounded-2xl animate-pulse border border-gray-100"></div>;
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 transition-all hover:shadow-xl group">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{title}</p>
          <h3 className="text-3xl font-display font-bold text-[#4A0404]">{value}</h3>
        </div>
        <div className="bg-[#FDFCF0] p-3 rounded-xl border border-[#C5A059]/20 text-[#C5A059] group-hover:scale-110 transition-transform">
          <Icon size={24} strokeWidth={1.5} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded flex items-center">
            <ArrowUpRight size={10} className="mr-1"/> 12%
        </span>
        <span className="text-[10px] text-gray-400 uppercase font-medium">Growth this month</span>
      </div>
    </div>
  );
};

export default StatsCard;