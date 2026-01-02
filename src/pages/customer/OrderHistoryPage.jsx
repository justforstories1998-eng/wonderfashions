import React, { useState, useEffect } from 'react';
import { Search, Package, Calendar, MapPin, ShoppingBag } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { MiniHero } from '../../components/customer/Hero';
import Button from '../../components/common/Button';

const OrderHistoryPage = () => {
  const [email, setEmail] = useState('');
  const [foundOrders, setFoundOrders] = useState(null);
  const { getOrders } = useOrders();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const all = getOrders(); 
    const results = all.filter(o => o.customerEmail.toLowerCase().trim() === email.toLowerCase().trim());
    setFoundOrders(results);
  };

  return (
    <div className="min-h-screen bg-secondary-50 pb-20 font-sans">
      <MiniHero title="Track Your Order" subtitle="Enter your email to view your royal collection history" />
      
      <div className="container-custom max-w-4xl mt-12">
        <form onSubmit={handleSearch} className="bg-white p-8 rounded-2xl shadow-xl border border-secondary-200 mb-10">
            <label className="block text-[10px] font-black text-primary-900 mb-4 uppercase tracking-[0.2em]">Registered Email Address</label>
            <div className="flex flex-col md:flex-row gap-4">
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                  className="input-royal flex-1 border-2" 
                  placeholder="e.g. maharani@email.com" 
                />
                <Button type="submit" variant="primary" icon={Search} className="px-10 py-4">Search Orders</Button>
            </div>
        </form>

        {foundOrders && (
            <div className="space-y-6 animate-fade-in">
                {foundOrders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-secondary-300">
                        <ShoppingBag size={64} className="mx-auto text-secondary-200 mb-6" />
                        <h3 className="text-2xl font-display font-bold text-secondary-900">No History Found</h3>
                        <p className="text-secondary-500 mt-2 max-w-xs mx-auto">We couldn't find any orders associated with this email address.</p>
                        <Button onClick={() => window.location.href='/shop'} variant="outline" className="mt-8">Start Shopping</Button>
                    </div>
                ) : (
                    foundOrders.map(order => (
                        <div key={order.id} className="bg-white p-8 rounded-3xl shadow-lg border border-secondary-100 flex flex-col md:flex-row justify-between gap-8 transition-all hover:border-[#C5A059]">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black bg-primary-800 text-white px-3 py-1 rounded-full tracking-widest uppercase">Order #{order.id}</span>
                                    <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest">{order.country} catalog</span>
                                </div>
                                <h3 className="font-display font-bold text-2xl text-primary-950">{order.customerName}</h3>
                                <div className="flex flex-wrap items-center gap-6 text-xs text-secondary-500 font-medium">
                                    <span className="flex items-center gap-2"><Calendar size={16} className="text-[#C5A059]"/> {new Date(order.createdAt).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-2"><MapPin size={16} className="text-[#C5A059]"/> {order.shippingAddress.city}</span>
                                </div>
                            </div>
                            <div className="text-left md:text-right flex flex-col justify-between items-start md:items-end">
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-secondary-100 text-secondary-700'}`}>
                                    {order.status}
                                </div>
                                <p className="text-4xl font-display font-bold text-primary-900 mt-4">
                                    {order.country === 'india' ? '₹' : '£'}{order.total.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;