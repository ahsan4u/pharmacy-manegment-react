import axios from "axios"
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { debouncer, getPrettyDate, getRemainingDaysFromToday, priceAfterDiscount } from "../fns";
import { useGlobalItems } from "../context";

async function searchFn(input) {
    try {
        const { data } = await axios.get(`/api/search?${input}`);
        return data;
    } catch (err) {
        console.log(err.message);
    }

}

export default function Bill() {
    const setMessage = useGlobalItems();
    const [username, setUsername] = useState('');
    const [paidAmt, setPaidAmt] = useState(0);
    const [inputTxt, setInputTxt] = useState('');
    const [items, setItems] = useState([]);
    const [suggests, setSuggests] = useState([]);
    const [lookupData, setLookupData] = useState({});
    const lookup_ = useRef();
    const [suggestIdx, setSuggestIdx] = useState(0);
    const suggests_ = useRef([]);
    const suggestIdx_ = useRef(0);
    let totalPrice = items.reduce((a, b) => a + (Math.ceil(priceAfterDiscount(b.mrp, b.discount) * b.quantity)), 0);
    if (isNaN(totalPrice)) totalPrice = null;
    useEffect(() => { setPaidAmt(totalPrice) }, [items]);

    useEffect(() => { suggests_.current = suggests; suggestIdx_.current = suggestIdx }, [suggests, suggestIdx]);
    useEffect(() => {
        const keyFn = (e) => {
            if (e.key === 'ArrowUp')   return setSuggestIdx(prev => prev > 0 && prev - 1);
            if (e.key === 'ArrowDown') return setSuggestIdx(prev => prev < suggests_.current.length-1 ? prev + 1 : suggests_.current.length-1);
            if (e.key === 'Enter') {
                setItems(prev => [suggests_.current[suggestIdx_.current], ...prev]);
                setInputTxt(''); setSuggests([]); setSuggestIdx(0);
                lookup_.current.classList.remove('left-3');
                lookup_.current.classList.add('-left-[150%]');
                return;
            }
        };

        document.addEventListener('keydown', keyFn);
        return () => document.removeEventListener('keydown', keyFn);
    }, []);

    function setVal(idx, name, value) {
        if (name.includes('discount') && value > 100 || value < 0) return;
        if (name.includes('quantity') && value > 5000) return;

        setItems(prev => {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], [name]: value };
            return updated;
        });
    }

    const delaySearch = useMemo(() => debouncer(async (txt) => {
        setSuggestIdx(0);
        searchFn(`input=${txt}`).then(data => setSuggests(data)).catch(err => console.log(err.message));
    }, 200), []);

    function SuggestStripEvents(e, idx, data) {
        if (e.target.dataset.type) {
            lookup_.current.classList.remove('-left-[150%]');
            lookup_.current.classList.add('left-3');
            setLookupData(data);
            return;
        }

        lookup_.current.classList.remove('left-3');
        lookup_.current.classList.add('-left-[150%]');
        setItems(prev => [...prev, suggests[idx]]); setInputTxt(''); setSuggests([]); setSuggestIdx(0)
    }


    useEffect(() => { inputTxt ? delaySearch(inputTxt) : setSuggests([]); }, [inputTxt]);

    async function submitListFn() {
        let pending = totalPrice - paidAmt;
        if(paidAmt > totalPrice) return setMessage('paid amount should not be greater than total');
        if(paidAmt < 0) return setMessage('Paid amount should not be less than 0');
        if(items.length <= 0) return;
        axios.post('/api/add-bill', { username, items, totalPrice, pending }).then((({ data }) => {
            setMessage(data.message);
            setItems([]); setPaidAmt(0); setUsername('');
        })).catch(err => setMessage(err.message));
    }

    return (
        <div className="flex justify-end">
            <img src="/images/saleBg.png" alt="" className="fixed bottom-0 left-0 w-[100vw] h-[92vh] bg-cover" />

            {/* medicine data Lookup */}
            <div ref={lookup_} className="absolute top-20 -left-[150%] w-[30vw] bg-[#121212] rounded-xl p-2 transition-all duration-500">
                <div className="relative">
                    <p className="font-bold text-xs text-slate-300 absolute right-2 top-0.5">Exp: <span className="ml-1 font-light text-green-300">{getPrettyDate(lookupData.exp)}</span> <span className="font-light text-yellow-200">[ {getRemainingDaysFromToday(lookupData.exp)} ]</span></p>
                    <p className="font-bold text-sm text-slate-300 absolute right-2 bottom-0.5">Shell: <span className="ml-1 font-light text-green-100">{lookupData.shell}</span></p>

                    <div className="flex gap-x-2 items-center -mt-1">
                        <p className="font-bold text-xl pantonFont tracking-wide">{lookupData.name}</p>
                        <img src={`/icons/${lookupData.type}.png`} alt="" className="w-5" />
                    </div>
                    {/* <p className="text-slate-400 -mt-0.5">{lookupData.salt}</p> */}

                    <div className="mt-2 space-y-0.5 tracking-wide">
                        {/* <p className="">Quantity: <span className="font-medium ml-1">{lookupData.quantity}</span></p> */}
                        <p className="">MRP: <span className="font-medium ml-8">{lookupData.mrp}₹</span></p>
                        <p className="">Type: <span className="font-medium ml-8">{lookupData.type}</span></p>
                    </div>
                    <img src="/icons/medicine.png" alt="" className="w-[30%] absolute right-2 bottom-2 opacity-20" />
                </div>

                {lookupData.salt && <div className="bg-[#232323] mt-6 rounded-md overflow-hidden px-2 py-0.5">
                    <p className="text-xl font-bold">Active Salt</p>
                    <div className="flex flex-wrap gap-2 mt-3 mb-1.5">
                        {lookupData.salt.map((txt, idx) => <p key={idx} className="bg-slate-800 shrink-0 px-2 py-0.5 rounded-md text-sm text-nowrap font-light">{txt}</p>)}
                    </div>
                </div>}
            </div>

            <div className="mr-5 w-[58%] mt-5 relative z-10">
                <div className="mt-2.5 h-11 text-lg rounded-t-3xl bg-[#242424] flex justify-between items-center">
                    <input style={{ paddingLeft: '15px' }} onChange={(e) => setUsername(e.target.value)} value={username} type="text" spellCheck="false" autoComplete="off" placeholder="Name..." className="bg-[#151819] outline-none w-[30%] font-medium ml-1 mr-3 h-[85%] rounded-[24px_8px_8px_8px]" />

                    <div className="bg-[#151819] h-[85%] grow pr-1 mr-1 flex items-center rounded-[30px_30px_8px_30px] relative">
                        <div className={`absolute z-40 w-full bg-[#424141] top-[112%] rounded-xl ${suggests?.length != 0 && 'p-3'} `}>
                            {
                                suggests?.map((item, idx) => (
                                    <div onClick={(e) => SuggestStripEvents(e, idx, item)} key={idx} className={`flex justify-between items-center   border-[#5f5e5e] ${idx == 0 ? 'pb-2 border-b-2' : idx == suggests.length - 1 ? 'pt-2 border-t-1' : 'py-2 border-b-2'} group`}>
                                        <div className="grow overflow-hidden">
                                            <div className="flex items-center gap-x-2">
                                                <img src={`/icons/${item.type}.png`} onError={(e)=>{e.target.src = '/icons/med-default.png'; e.target.onerror = null }} alt="" className="h-5" />
                                                <div className="mr-2 overflow-hidden w-full">
                                                    <p className={`text-sm tracking-wide truncate group-hover:font-medium group-hover:text-yellow-300 ${idx == suggestIdx ? 'text-cyan-300 font-medium' : 'text-white font-light'}`}>{item.name}</p>
                                                    <p className="text-xs font-light truncate space-x-2">{item.salt.map((item, i)=><span key={i}>{item}</span>)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <img data-type='details' src="/icons/notepad.png" alt="" className="h-5 cursor-pointer" />
                                    </div>
                                ))
                            }
                        </div>
                        <input onChange={(e) => setInputTxt(e.target.value)} type="text" value={inputTxt} spellCheck="false" name="search" placeholder="Search Medicines . . ." autoComplete="off" className="h-full grow outline-none ml-3" />
                        <button className="bg-white text-black w-24 h-[85%] rounded-[30px] rounded-br-xl">Search</button>
                    </div>
                </div>

                <div className="bg-[#282828] min-h-[30vh] text-center">
                    <div className="bg-[#282828] ">
                        <div className="w-full py-1 bg-[#121212] grid grid-cols-[30fr_10fr_10fr_10fr_10fr] items-center font-bold">
                            <h2>Name</h2>
                            <h2>MRP</h2>
                            <h2 className="text-green-300">QTY</h2>
                            <h2 className="text-green-300">Discount</h2>
                            <h2>Amount</h2>
                        </div>

                        <div className="overflow-y-scroll max-h-[68vh] py-1">
                            <div className="grid grid-cols-[30fr_10fr_10fr_10fr_10fr] gap-2.5 items-center font-light text-sm">
                                {
                                    items?.map((item, idx) => (
                                        <Fragment key={item._id}>
                                            <div className="even:bg-[#00000018] odd:bg-[#00000034] py-1 text-start flex flex-col justify-center pl-2 rounded-r-md group relative overflow-hidden">
                                                <span className="font-extralight text-[8px] absolute right-0.5 top-4 group-hover:hidden">{item.weight}</span>
                                                <div className="flex justify-between">
                                                    <p className="font-medium font-serif tracking-wide truncate mr-3 cursor-default">{item.name}</p>
                                                    <img src={`/icons/${item.type}.png`} alt="" className="h-3 mr-1 group-hover:hidden" />
                                                    <img onClick={() => setItems(prev => prev.filter((_, i) => i != idx))} src="/icons/trash.png" alt="" className="h-3.5 mr-1 hidden group-hover:block cursor-pointer brightness-125" />
                                                </div>
                                                <p className="text-xs font-light tracking-wide text-slate-300 mr-2 truncate cursor-default">{item.salt}</p>
                                            </div>
                                            <p className="cursor-default">{item.mrp} ₹</p>
                                            <input onChange={(e) => setVal(idx, 'quantity', e.target.value)} type="number" name='quantity' id='quantity' value={item.quantity} className="w-full hover:bg-[#0000003f] rounded-md outline-none text-center py-1 " />
                                            <label htmlFor={`discount${idx}`} className="flex items-center justify-center gap-x-0.5 hover:bg-[#0000003f] rounded-md"><input onChange={(e) => setVal(idx, 'discount', e.target.value)} type="number" name={`discount${idx}`} id={`discount${idx}`} value={item.discount} className="w-7 outline-none text-right py-1 " /> %</label>
                                            <p className="cursor-default">{(priceAfterDiscount(item.mrp, item.discount) || 0) * item.quantity} ₹</p>
                                        </Fragment>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between pl-4 w-full bg-[# ] h-12 rounded-b-xl">
                    <p className="flex gap-x-2 h-full items-center text-lg cursor-default">Total <span className="h-[70%] w-28 rounded-md bg-[#272d39] flex items-center justify-center">{totalPrice} ₹</span></p>
                    <label htmlFor="paid" className="flex gap-x-2 h-full items-center cursor-default">Paid
                        <input onChange={(e) => setPaidAmt(e.target.value)} type="number" name="paid" value={paidAmt} id="paid" autoComplete="off" className="h-[70%] w-28 rounded-md bg-[#272d39] block text-center" />
                    </label>
                    <button onClick={submitListFn} className="bg-red-600 h-[77%] w-28 rounded-md mr-1 font-medium">Submit</button>
                </div>
            </div>
        </div>
    )
}