import { Link, NavLink } from "react-router-dom";

export default function Header() {

    return (
        <div className="h-[8vh] flex justify-between items-center pl-3 pr-5 bg-[#111217] sticky top-0 z-50">
            <div>
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