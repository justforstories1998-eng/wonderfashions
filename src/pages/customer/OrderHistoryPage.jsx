import React, { useState } from 'react';
import { Search, Package, Calendar, MapPin } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { MiniHero } from '../../components/customer/Hero';
import Button from '../../components/common/Button';

const OrderHistoryPage = () => {
  const [email, setEmail] = useState('');
  const [foundOrders, setFoundOrders] = useState(null);
  const { getOrders } = useOrders();

  const handleSearch = (e) => {
    e.preventDefault();
    const all = getOrders(); // Combined UK + India
    const results = all.filter(o => o.customerEmail.toLowerCase() === email.toLowerCase());
    setFoundOrders(results);
  };

  return (
    <div className="min-h-screen bg-secondary-50 pb-20">
      <MiniHero title="My Order History" subtitle="Track your royal collections" />
      <div className="container-custom max-w-4xl mt-12">
        
        <form onSubmit={handleSearch} className="bg-white p-8 rounded-2xl shadow-sm border border-secondary-200 mb-8">
            <label className="block text-sm font-bold text-primary-900 mb-2 uppercase tracking-wide">Enter Email Used for Checkout</label>
            <div className="flex gap-4">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input flex-1" placeholder="yourname@email.com" />
                <Button type="submit" icon={Search}>View Orders</Button>
            </div>
        </form>

        {foundOrders && (
            <div className="space-y-6 animate-fade-in">
                {foundOrders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
                        <Package size={48} className="mx-auto text-secondary-300 mb-4" />
                        <p className="text-secondary-500">No orders found for this email address.</p>
                    </div>
                ) : (
                    foundOrders.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-secondary-100 flex flex-col md:flex-row justify-between gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold bg-primary-100 text-primary-800 px-2 py-0.5 rounded">#{order.id}</span>
                                    <span className="text-xs font-medium text-secondary-500">{order.country.toUpperCase()} Order</span>
                                </div>
                                <h3 className="font-display font-bold text-xl">{order.customerName}</h3>
                                <div className="flex items-center gap-4 text-xs text-secondary-500">
                                    <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(order.createdAt).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1"><MapPin size={14}/> {order.shippingAddress.city}</span>
                                </div>
                            </div>
                            <div className="text-right flex flex-col justify-between items-end">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {order.status}
                                </span>
                                <p className="text-2xl font-bold text-primary-900 mt-2">{order.country === 'india' ? '₹' : '£'}{order.total.toFixed(2)}</p>
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