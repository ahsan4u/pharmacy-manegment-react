import { useParams } from "react-router-dom"
import { useGlobalItems } from "../context";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { priceAfterDiscount } from "../fns";
import { useEffect, useRef, useState } from "react";

export default function EachBill() {
    const { id } = useParams();
    const [pending, setPending] = useState(0);
    const [isEdite, setEdite] = useState(false);
    const setMessage = useGlobalItems();
    const pendingInput_ = useRef();

    const { data: bill } = useQuery({
        queryKey: ['bill'],
        queryFn: async () => axios.get(`/api/bill?_id=${id}`).then(({ data }) => data).catch(err => setMessage(err.message))
    })
    useEffect(() => { setPending(bill?.pending || 0) }, [bill]);

    async function submitPendingFn() {
        if (isEdite) {
            axios.post('/api/update-bill', {id, pending}).then(({data})=>setMessage(data.message)).catch(err=>setMessage(err.message)).finally(()=>setEdite(false));
        } else {
            setEdite(true);
            setTimeout(()=>pendingInput_.current.focus(), 0);
       }
    }

    return (
        <>
            <img src="/images/each-sale.jpg" alt="" className="fixed bottom-0 left-0 w-[100vw] h-[92vh] bg-cover" />

            <div className="flex justify-center items-center relative z-10">
                <div className="bg-[#1b1b1b] w-[70vw] mt-10 rounded-md overflow-hidden">
                    <div className="bg-[#121212] h-12 flex items-center justify-between">
                        <p className="pantonFont tracking-wider text-xl ml-2 capitalize">{bill?.username || 'unknown'}</p>

                        <div className="h-full">
                            <p className="text-sm font-bold tracking-wider mr-1.5 mt-1">Order Date: <span className="font-light ml-1.5">12 / 04 / 2025</span></p>
                        </div>
                    </div>

                    <table className="w-full font-normal">
                        <thead>
                            <tr className="bg-[#212327] h-10">
                                <th colSpan="2">Name</th>
                                <th>MRP</th>
                                <th>QTY</th>
                                <th>Discount</th>
                                <th colSpan="2">Amount</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                bill?.products?.map((item, idx) => (
                                    <tr key={idx} className="text-center align-middle h-10">
                                        <td colSpan="2">{item.name}</td>
                                        <td>{item.mrp} ₹</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.discount}%</td>
                                        <td colSpan="2">{priceAfterDiscount(item.mrp, item.discount)} ₹</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <div className="w-full flex justify-between items-center bg-[#12121b] h-12 px-1.5">
                        <div className="h-[80%] flex gap-x-1 items-center">
                            <span className="font-medium tracking-wider">TOTAL</span>
                            <p className="w-40 bg-[#393939] rounded-md h-full flex items-center justify-center" >{bill?.totalPrice} ₹ </p>
                        </div>
                        <div className="h-[80%]">
                            <span className="font-medium tracking-wider">PENDING</span>
                            <input onChange={(e) => setPending(e.target.value)} ref={pendingInput_} type="number" name="Pending" id="" disabled={!isEdite} value={pending} className="w-40 bg-[#393939] rounded-md h-full ml-2 text-center outline-none" />
                        </div>
                        <button onClick={submitPendingFn} className="w-40 bg-blue-400 text-black font-bold rounded-md h-[80%] text-center">{isEdite ? 'Submit' : 'Settle Amount'}</button>
                    </div>
                </div>
            </div>
        </>
    )
}