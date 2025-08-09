import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { debouncer, getDaysOff, getPrettyDate, limit } from '../fns';
import { useMemo, useState } from 'react';


export default function Sales() {
    const [filter, setFilter] = useState({ search: '', sort: '', pending: 'default' });
    const [page, setPage] = useState(1);

    const { data } = useQuery({
        queryKey: ['bills', filter, page],
        queryFn: async () => { const { data } = await axios.get(`/api/sells?page=${page}&filter=${JSON.stringify(filter)}`); return data }
    })

    const delayRunFn = useMemo(() => debouncer((input) => setFilter(pre => ({ ...pre, search: input })), 300));
    function setVal(e) {
        const { name, value } = e.target;
        if (name == 'search') return delayRunFn(value);
        setFilter(pre => ({ ...pre, [name]: value }))
    }

    return (
        <>
            <img src="/images/sales-bg.jpg" alt="" className="h-[92vh] w-full fixed bottom-0 left-0 object-cover" />

            <div className="flex justify-between p-2 bg-amber-900 relative z-10">
                <div>
                    <div className="bg-amber-950 border-black h-full px-2 rounded-xl overflow-hidden">
                        <select onChange={setVal} name="sort" className="h-full bg-amber-950 outline-none capitalize">
                            <option value="">Sort Customer</option>
                            <option value="name">Name (A-Z)</option>
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="price-high">Big amount first</option>
                            <option value="price-low">Small amount first</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-x-3">
                    <div className="bg-amber-950 border-2 border-[#48230c] rounded-full px-2 overflow-hidden">
                        <select onChange={setVal} name="pending" className="bg-amber-950 h-full outline-none">
                            <option value='default'>Filter by Status</option>
                            <option value='pending'>Pending</option>
                            <option value='settled'>Settled</option>
                        </select>
                    </div>
                    <div className="flex w-96 h-10 rounded-full overflow-hidden bg-gradient-to-r from-white via-white to-[#202020]">
                        <input onChange={setVal} type="text" name="search" placeholder="Search by name" className="pl-2 outline-none grow text-black" />
                        <button className="h-full w-[20%] bg-[#202020] flex justify-center items-center rounded-full"><img src="/icons/lens.png" alt="search" className="h-[45%] invert" /></button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-x-5 gap-y-5 px-10 my-5 relative z-20">
                {
                    data?.map((item, idx) => (
                        <Link to={`/sales/${item._id}`} key={idx} className="w-[30vw] bg-black rounded-lg overflow-hidden pb-2 border-4 border-[#1e1e1e] relative">
                            <p className={`py-2 bg-[#1e1e1e] ${item.pending ? 'text-red-600' : 'text-blue-300'} pl-2 font-bold pantonFont tracking-wider text-xl relative capitalize`}>{item.username || 'unknown'} <span className="absolute right-1 top-1 text-xs font-sans text-slate-400">{getPrettyDate(item.date)} <span className="ml-1 font-light text-green-300">[ {getDaysOff(item.date)} ]</span></span></p>

                            <div className="p-2 space-y-1 relative tracking-wider">
                                {/* <p className="">Quantity: <span className="font-medium ml-8">{item.products.length} items</span></p> */}
                                <p className="">Total Amt: <span className="font-medium ml-6">{item.totalPrice} ₹</span></p>
                                <p className="">Paid Amt: <span className="font-medium ml-6">{item.totalPrice - item.pending} ₹</span></p>
                                {!!item.pending && <p className="bg-red-900 inline-block pl-1 pr-4 py-1 rounded-md">Pending Amt: <span className="font-medium ml-2">{item.pending} ₹</span></p>}
                                <img src="/icons/book.png" alt="" className='absolute right-1/4 top-1/2 -translate-y-1/2 opacity-15 w-[23%]' />
                            </div>
                        </Link>
                    ))
                }
            </div>
 
            <div className='flex gap-x-6 justify-center relative z-40 my-10'>
                <button onClick={()=>setPage(pre=>pre-1)}  disabled={page <= 1} className={`pt-0.5 pb-2 px-10 border-2 border-slate-600 rounded-md font-bold text-2xl ${page > 1 && 'hover:bg-gray-700'}`}>{'<'}</button>
                <button onClick={()=>setPage(pre=> pre+1)} disabled={data?.length < limit} className='pt-0.5 pb-2 px-10 bg-gray-800 rounded-md font-bold text-2xl hover:bg-gray-700'>{'>'}</button>
            </div>
        </>
    )   
}