import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { debouncer, getPrettyDate, getRemainingDaysFromToday } from "../fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGlobalItems } from '../context';

async function fetchData(query) {
    const { data } = await axios.get(`/api/medicines?${query}`);
    return data;
}

export default function Stock() {
    const [sort, setSort] = useState('');
    const [searchType, setSearchType] = useState('name');
    const [searchInput, setSearchInput] = useState('');
    const [formData, setFormData] = useState({});
    const editeOpt_ = useRef([]);
    const formDiv_ = useRef([]);
    const setMessage = useGlobalItems();

    const delayInputFn = useMemo(() => debouncer((input) => { setSearchInput(input) }, 200));

    const { data, refetch: refetchMedicines } = useQuery({
        queryKey: ['data', sort,searchType, searchInput],
        queryFn: () => fetchData(`sort=${sort}&searchType=${searchType}&search=${searchInput}`)
    });

    function activatedite(isEdite, idx) {
        editeOpt_.current.forEach(dom => {
            dom.classList.remove('max-h-32', 'border');
            dom.classList.add('max-h-0');
        })
        if (isEdite) {
            editeOpt_.current[idx]?.classList.remove('max-h-0');
            editeOpt_.current[idx]?.classList.add('max-h-32', 'border');
        }
    }

    function isEditeFormAppear(isActive, idx) {
        setFormData(data[idx]);

        formDiv_.current.forEach(dom => {
            dom.classList.remove('h-full');
            dom.classList.add('h-0');
        })
        if (isActive) {
            formDiv_.current[idx]?.classList.remove('h-0');
            formDiv_.current[idx]?.classList.add('h-full');
        }
    }

    function setVal(e) {
        const { name, value } = e.target;
        setFormData(pre => ({ ...pre, [name]: value }));
    }

    async function updateFn() {
        try {
            const { data } = await axios.post('/api/update-medicine', formData);
            refetchMedicines();
            isEditeFormAppear(false, 0);
            setMessage(data.message);
        } catch (error) {
            setMessage(error.message);
        }
    }

    async function deleteMedicine(id) {
        const isDelete = prompt('do you really want to delete this medicine');
        if (isDelete.toLowerCase() == 'y' || isDelete.toLowerCase() == 'yes') {
            axios.post('/api/delete-medicine', { id }).then(({ data }) => {
                setMessage(data.message);
                refetchMedicines();
            }).catch(err => setMessage(err.message));
        }
    }

    return (
        <>
            <img src="/images/stock.jpg" alt="" className="fixed bottom-0 left-0 w-[100vw] h-[92vh] bg-cover" />

            <div className="flex justify-between p-2 bg-amber-900 relative z-10">
                <div>
                    <div className="bg-amber-950 border-black h-full px-2 rounded-xl overflow-hidden">
                        <select onChange={(e) => setSort(e.target.value)} name="sort" value={sort} className="h-full bg-amber-950 outline-none">
                            <option value="">Sort</option>
                            <option value="name">Name (A-Z)</option>
                            <option value="salt">Salt (A-Z)</option>
                            <option value="expiry">Newest Expiry First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-x-3">
                    <div className="bg-amber-950 border-2 border-[#48230c] rounded-full px-3 overflow-hidden">
                        <select onChange={(e) => setSearchType(e.target.value)} name="searchType" value={searchType} className="bg-amber-950 h-full outline-none">
                            <option value="name">Search by Name</option>
                            <option value="salt">Search by Salt</option>
                        </select>
                    </div>
                    <div className="flex w-96 h-10 rounded-full overflow-hidden bg-gradient-to-r from-white via-white to-[#202020]">
                        <input onChange={(e) => delayInputFn(e.target.value)} type="text" name="search" placeholder="Search here" className="pl-2 outline-none grow text-black" />
                        <button className="h-full w-[20%] bg-[#202020] flex justify-center items-center rounded-full"><img src="/icons/lens.png" alt="search" className="h-[45%] invert" /></button>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap justify-between gap-y-5 px-10 my-5">
                {
                    data?.map((item, idx) => (
                        <div onClick={(e) => {
                            if (e.target.dataset.idx) activatedite(true, e.target.dataset.idx)
                            else activatedite(false, e.target.dataset.idx)
                        }} key={idx} className="bg-[#090808] w-[30vw] shrink-0 rounded-xl p-2 border-4 border-[#1d1d1d] relative flex flex-col  overflow-hidden">

                            <div>
                                <div onClick={(e) => { if (e.target.tagName !== 'INPUT') isEditeFormAppear(false, idx) }} ref={(e) => formDiv_.current[idx] = e} className="absolute w-full h-0 top-0 left-0 bg-black z-20 flex justify-evenly items-center flex-wrap overflow-hidden transition-all duration-500">
                                    <input onChange={setVal} type="text" value={formData.name} name="name" placeholder="Name..." className="w-[47%] h-10 border rounded-md" />
                                    <input onChange={setVal} type="text" value={formData.quantity} name="quantity" placeholder="Quantity..." className="w-[47%] h-10 border rounded-md" />
                                    <input onChange={setVal} type="text" value={formData.shell} name="shell" placeholder="Shell No..." className="w-[47%] h-10 border rounded-md" />
                                    <input onChange={setVal} type="numbere" value={formData.cost} name="cost" placeholder="Cost Price..." className="w-[47%] h-10 border rounded-md" />
                                    <input onChange={setVal} type="numbere" value={formData.mrp} name="mrp" placeholder="MRP..." className="w-[47%] h-10 border rounded-md" />
                                    <input onChange={setVal} type="submit" value='Update' onClick={updateFn} className="w-[47%] h-10 bg-blue-500 font-medium rounded-md uppercase" />
                                </div>

                                <ol ref={(e) => editeOpt_.current[idx] = e} className="absolute border-slate-600 z-30 top-1 left-1 max-h-0 bg-black rounded-md overflow-hidden transition-all duration-300">
                                    <li onClick={() => isEditeFormAppear(true, idx)} className="pl-2 pr-12 py-2 hover:bg-slate-900 cursor-pointer">Edite</li>
                                    <li onClick={() => deleteMedicine(item._id)} className="pl-2 pr-12 py-2 hover:bg-red-900 cursor-pointer">Delete</li>
                                </ol>
                                <div data-idx={idx} className="absolute w-10 aspect-square bg-red-600 left-0 top-0 cursor-pointer -translate-x-[60%] -translate-y-[60%] rounded-full" />

                                <p className="font-bold text-xs text-slate-300 absolute right-2 top-1">Exp: <span className="ml-1 font-light text-green-300">{getPrettyDate(item.exp)}</span> <span className={getRemainingDaysFromToday(item.exp).toString().includes('Expire') ? 'text-red-600 font-bold text-sm' : 'font-light text-blue-200'}>[ {getRemainingDaysFromToday(item.exp)} ]</span></p>
                                <div className="relative">
                                    <p className="font-bold text-sm text-slate-300 absolute right-2 bottom-0.5">Shell: <span className="ml-1 font-light text-green-100">{item.shell}</span></p>

                                    <div className="flex gap-x-2 items-center mt-2">
                                        <p className="font-bold text-xl pantonFont tracking-wide">{item.name}</p>
                                        <img src={`/icons/${item.type}.png`} alt="" className="w-5" />
                                    </div>

                                    <div className="mt-2 space-y-0.5 tracking-wide">
                                        <p className="">Quantity: <span className="font-medium ml-1">{item.quantity}</span></p>
                                        <p className="">MRP: <span className="font-medium ml-8">{item.mrp}₹</span></p>
                                        <p className="">Type: <span className="font-medium ml-8">{item.type}</span></p>
                                    </div>
                                    <img src="/icons/medicine.png" alt="" className="w-[30%] absolute right-2 bottom-2 opacity-20" />
                                </div>
                            </div>

                            {item.salt?.length > 0 && <div className="bg-[#232323] mt-3 grow rounded-md overflow-hidden px-2 py-0.5">
                                <p className="text-xl font-bold">Active Salt</p>
                                <div className="flex flex-wrap gap-2 mt-3 mb-1.5">
                                    {item.salt.map((txt, idx) => <p key={idx} className="bg-slate-800 shrink-0 px-2 py-0.5 rounded-md text-sm text-nowrap font-light">{txt}</p>)}
                                </div>
                            </div>}
                        </div>
                    ))
                }
            </div>
        </>
    )
}