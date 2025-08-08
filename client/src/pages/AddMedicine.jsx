import axios from "axios"
import { useEffect, useRef, useState } from "react"

export default function AddMedicine() {
    const [message, setMessage] = useState('');
    const [ingradients, setIngradients] = useState([]);
    const [saltInput, setSaltInput] = useState('');

    const formDom_ = useRef();
    const [formData, setFormData] = useState({ name: '', company: '', type: '', tabletsPerSheet: '', shell: '', cost: '', mrp: '', mfg: '', exp: '', quantity: '' });
    useEffect(() => { if (message) setTimeout(() => setMessage(''), 3000) }, [message]);

    function setVal(e) {
        e.target.classList.remove('border-red-500');
        const { name, value } = e.target;
        setFormData(preVal => ({ ...preVal, [name]: value }));
        console.log(formData);
    }

    async function submitFormFn(e) {
        console.log(e.target.tagName)
        if (['name', 'cost', 'mrp', 'exp', 'quantity'].some(key => !formData[key])) {
            const inputs = formDom_.current.querySelectorAll('input, select');
            inputs.forEach(input => { if (!formData[input.name]) input.classList.add('border-red-500') });
            setMessage('All input with (*) should not empty !');
            return;
        }

        axios.post('/api/add-medicine', { ...formData, ingradients }).then(({ data }) => {
            setMessage(data.message);
        }).catch(err => {
            setMessage(err.message);
        });
    }

    return (
        <div className="h-[92vh] bg-[url(/images/bg-form.jpg)] bg-cover flex justify-end items-center">
            {message && <p className={`text-center absolute top-[10vh] left-2 px-2 py-2 rounded-md max-w-96 ${message.includes('Successfull') ? 'bg-green-700' : 'bg-red-600'}`}>{message}</p>}

            <div ref={formDom_} className="flex flex-col gap-y-5 mr-5 w-[40%] px-2 -mt-5 relative">
                <p className="text-center text-4xl font-bold text-cyan-300 border-b-2 border-cyan-700 pb-2 px-7 mb-5 rounded-b-2xl">Add Medicine to Database</p>

                <div className="flex justify-between flex-wrap gap-y-5">
                    <input onChange={setVal} value={formData.name} type="text" name="name" spellCheck="false" placeholder="Name*..." autoComplete="off" className="border w-[49%] h-12 pl-2 rounded-lg block" />
                    <input onChange={setVal} value={formData.company} type="text" name="company" spellCheck="false" placeholder="Company Name..." autoComplete="off" className="border w-[49%] h-12 pl-2 rounded-lg block" />

                    <select onChange={setVal} name="type" value={formData.type} className={`border ${['tab', 'cap'].some((a) => a == formData.type) ? 'w-[49%]' : 'w-full'} h-12 pl-2 rounded-lg block bg-black`}>
                        <option disabled value=''>Med. Type</option>
                        <option value="tab">Tablet</option>
                        <option value="cap">Capsule</option>
                        <option value="syp">Syrup</option>
                        <option value="inj">Injection</option>
                        <option value="other">Other</option>
                    </select>
                    {['tab', 'cap'].some((a) => a == formData.type) && <input onChange={setVal} value={formData.tabletsPerSheet} type="number" name="tabletsPerSheet" spellCheck="false" placeholder="Tablets per Sheet" autoComplete="off" className="border w-[49%] h-12 pl-2 rounded-lg block" />}

                    {formData.type !== 'other' &&
                    <div className="border rounded-lg w-full">
                        <div>
                            <div className="flex gap-3 items-center mx-2 overflow-x-auto">
                                {[...ingradients].reverse().map((txt, idx) => <div key={idx} className="flex gap-x-2 mt-2 items-center bg-slate-800 shrink-0 px-2 py-1 rounded-md"><img onClick={() => setIngradients(ingradients.filter(item => item != txt))} src="/icons/trash.png" className="h-4 cursor-pointer" /><p className="text-nowrap font-light">{txt}</p></div>)}
                            </div>
                        </div>
                        <input onChange={(e) => setSaltInput(e.target.value)} onKeyUp={(e) => { if (e.key == 'Enter') { setIngradients((pre) => ([...pre, saltInput])); setSaltInput('') } }} type="text" value={saltInput} name="" placeholder="Active Salts" id="" className="h-12 w-full" />
                    </div>}

                    <input onChange={setVal} value={formData.quantity} type="number" name="quantity" spellCheck="false" placeholder="Quantity*..." autoComplete="off" className="border w-[49%] h-12 pl-2 rounded-lg block" />
                    <input onChange={setVal} value={formData.shell} type="text" name="shell" spellCheck="false" placeholder="Shell No." autoComplete="off" className="border w-[49%] h-12 pl-2 rounded-lg block" />

                    <input onChange={setVal} value={formData.cost} type="text" name="cost" spellCheck="false" placeholder="Cost Price*..." autoComplete="off" className="border w-[49%] h-12 pl-2 rounded-lg block" />
                    <input onChange={setVal} value={formData.mrp} type="text" name="mrp" spellCheck="false" placeholder="MRP*..." autoComplete="off" className="border w-[49%] h-12 pl-2 rounded-lg block" />

                    {/* <div className="font-bold text-slate-200 border py-2 w-[49%] pl-2 rounded-lg">
                        <label htmlFor="mfg">MFG: <input onChange={setVal} value={formData.mfg} type="date" name="mfg" id="mfg" className="font-normal text-white ml-2 outline-none" /></label>
                    </div> */}

                    <div className="font-bold text-slate-200 border py-2 w-full pl-2 rounded-lg">
                        <label htmlFor="exp" className="flex">EXP*: <input onChange={setVal} value={formData.exp} type="date" name="exp" id="exp" className="grow font-normal text-white ml-2 outline-none" /></label>
                    </div>
                </div>

                <button onClick={submitFormFn} className="h-12 text-lg bg-blue-800 text-white rounded-md font-medium">Submit</button>
            </div>
        </div>
    )
}




// add Volume in form, Med should be also search by there volume like mg, li, kg
// add new page to show expire med. and new page for less quantity to make new order
// add med type with db like [tab: tablet, inj: injection, syp: syrup] also add there icon
