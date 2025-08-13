import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    return (
        <div className="h-[8vh] flex justify-between items-center pl-3 pr-5 bg-[#111217] sticky top-0 z-50">
            <div className={`flex h-full items-center gap-x-3 ${location.pathname == "/"? '-translate-x-[10%]': '-translate-x-0'} transition-transform duration-500`}>
                <img onClick={() => navigate(-1)} src="/icons/angle.png" alt="" className="h-[70%] invert bg-slate-200 rounded-md p-2 cursor-pointer"/>
                <Link to='/' className="logo-font text-5xl ">Guardian Pharmacy</Link>
            </div>

            <nav>
                <ul className="flex gap-x-5 text-xl font-bold ubuntu italic">
                    <li className="hover:text-red-600 transition-colors duration-300"><NavLink className={({isActive})=>`${isActive? 'text-violet-300':'text-white'} py-3`} to="/">Dashboard</NavLink></li>
                    <li className="hover:text-red-600 transition-colors duration-300"><NavLink className={({isActive})=>`${isActive? 'text-violet-300':'text-white'} py-3`} to="/sale">Sale</NavLink></li>
                    <li className="hover:text-red-600 transition-colors duration-300"><NavLink className={({isActive})=>`${isActive? 'text-violet-300':'text-white'} py-3`} to="/add-medicine">Add Medicine</NavLink></li>
                    <li className="hover:text-red-600 transition-colors duration-300"><NavLink className={({isActive})=>`${isActive? 'text-violet-300':'text-white'} py-3`} to="/stock">Stocks</NavLink></li>
                    <li className="hover:text-red-600 transition-colors duration-300"><NavLink className={({isActive})=>`${isActive? 'text-violet-300':'text-white'} py-3`} to="/sales-book">Sells Book</NavLink></li>
                </ul>
            </nav>
        </div>
    )
}