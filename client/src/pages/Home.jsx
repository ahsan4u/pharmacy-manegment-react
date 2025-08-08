import { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

export default function Home() {

    useEffect(()=>{
        
    }, [])

    return (
        <div className="h-[92vh] bg-[url(/images/home-bg2.jpg)] bg-cover">
            <div className="h-[35%] flex justify-evenly pt-[1%]">
                <div className="h-full bg-[#363b3c5a] border-4 border-[#363e3f79] w-[23%] rounded-4xl flex justify-center items-center flex-col gap-y-5">
                    <p className="text-5xl font-bold text-green-500">4,320₹</p>
                    <p className="text-cyan-300 font-medium text-3xl">Today Profit</p>
                </div>

                <div className="h-full bg-[#363b3c5a] border-4 border-[#363e3f79] w-[23%] rounded-4xl flex justify-center items-center flex-col gap-y-5">
                    <p className="text-5xl font-bold text-green-500">4,320₹</p>
                    <p className="text-cyan-300 font-medium text-3xl">Monthly Profit</p>
                </div>

                <div className="h-full bg-[#363b3c5a] border-4 border-[#363e3f79] w-[23%] rounded-4xl flex justify-center items-center flex-col gap-y-5">
                    <p className="text-5xl font-bold text-green-500">4,320₹</p>
                    <p className="text-cyan-300 font-medium text-3xl">Yearly Profit</p>
                </div>

                <div className="h-full bg-[#363b3c5a] border-4 border-[#363e3f79] w-[23%] rounded-4xl flex justify-center items-center flex-col gap-y-5">
                    <p className="text-5xl font-bold text-red-500">4,320₹</p>
                    <p className="text-cyan-300 font-medium text-3xl">Pending Amount</p>
                </div>
            </div>

            <div className="h-[38%] flex justify-evenly mt-[1.2%]">
                <Link to='/add-medicine' className="h-full w-[31%] bg-[#343434bf] rounded-3xl flex justify-center items-center hover:scale-[1.02] transition-transform duration-300">
                    <p className="text-center text-5xl font-bold">Add<br />Medicines</p>
                </Link>

                <Link to='/sale' className="h-full w-[31%] bg-[#343434bf] rounded-3xl flex justify-center items-center hover:scale-[1.02] transition-transform duration-300">
                    <p className="text-center text-5xl font-bold">Generate<br />Bill</p>
                </Link>

                <Link to='/sales-book' className="h-full w-[31%] bg-[#343434bf] rounded-3xl flex justify-center items-center hover:scale-[1.02] transition-transform duration-300">
                    <p className="text-center text-4xl font-bold">Previous Amount<br />Sattlement</p>
                </Link>
            </div>

            <div className="h-[19vh] flex justify-evenly items-center mt-[1%]">
                <div className="w-[47%] h-[90%] bg-[#1b1b1bdb] border-4 border-[#262626db] rounded-3xl flex justify-between px-5 items-center">
                    <p className="text-3xl font-bold text-orange-400">Closest Expiry Medicine</p>
                    <div className="space-y-1.5">
                        <p className="text-2xl font-medium text-cyan-300">Zerodol SP</p>
                        <p>EXP: <span className="text-red-400">26-10-2024</span></p>
                        <p>QTY: <span className="text-green-300 text-lg">36</span></p>
                    </div>
                </div>

                <div className="w-[47%] h-[90%] bg-[#1b1b1bdb] border-4 border-[#262626db] rounded-3xl flex justify-between px-5 items-center">
                    <p className="text-3xl font-bold text-orange-400">Restock Medicine Alert</p>
                    <div className="space-y-2">
                        <p className="text-2xl font-medium text-cyan-300">Naproxen</p>
                        <p>QTY: <span className="text-red-400 text-lg">04</span></p>
                    </div>
                </div>
            </div>
        </div>
    )
}