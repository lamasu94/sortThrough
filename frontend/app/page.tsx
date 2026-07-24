'use client'
import { CiLogin } from "react-icons/ci";
import { LiaSortSolid } from "react-icons/lia";
import Link from "next/link";
import { ScanLine } from "lucide-react";
import { FiBox } from "react-icons/fi";
import { TbMoneybagMove } from "react-icons/tb";
import { PiMonitorBold } from "react-icons/pi";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { BsWallet } from "react-icons/bs";
import { LuUsers } from "react-icons/lu";
import { LuLock } from "react-icons/lu";
import { VscGithubAlt } from "react-icons/vsc";
import { CiMail } from "react-icons/ci";
export default function LandingPage(){
   
    return(
        <div className="flex flex-col bg-[#FAFBFC]">
            {/*navbar */}
            <div className="flex flex-row justify-between p-3 border-b border-gray-300 bg-[#FAFBFC]">
                <div className="flex flex-row gap-x-2 p-2 items-center">
                    <LiaSortSolid  size={24} />
                    <h2 className="text-lg font-semibold text-[#152533]">sortThrough</h2>
                </div>
                <div className="flex flex-row space-x-7 p-2 ">
                    <Link className="text-gray-500 hover:text-gray-700" href="/" >About</Link>
                    <Link className="text-gray-500 hover:text-gray-700"  href="/">Features</Link>
                    <Link className="text-gray-500 hover:text-gray-700" href="/">Customers</Link>
                    <Link className="text-gray-500 hover:text-gray-700" href="/">Contact</Link>
               </div>
               <Link href="/login">
                <button className="bg-[#152533] text-[#CBDDE9] transition-all duration-300 hover:bg-gray-700  p-2 rounded-md flex flex-row gap-x-2 items-center">
                    <CiLogin /> 
                     Login to Dashboard
                </button>
                </Link>
            </div>


                {/*Hero section */}

           <div className="flex flex-row bg-[#FAFBFC] p-5 mt-16">
                {/*left side of hero */}
                
                <div className="flex flex-col p-5 mt-10 font-serif ">
                    <div className="p-5">
                    <p className= "text-7xl text-[#152533]">
                        Run your inventory,
                         sales, and finances 
                    </p>
                    <span className="text-7xl text-[#2872A1]" >— in one place.</span>
                    </div>
                    <div >
                    <p className="text-gray-500 p-5 font-serif">
                        sortThrough gives your team real-time visibility into stock levels, sales performance,
                        <br/>
                        and cash flow, with role-based dashboards so everyone sees exactly what they need
                         — nothing more.
                    </p>
                    </div>
                    <div className="flex flex-row gap-x-5 p-5 border-b border-gray-200 ">
                    <Link href="/login">
                      <button className="bg-[#152533] text-[#CBDDE9] transition-all duration-300 hover:bg-gray-700  p-2 rounded-lg flex flex-row gap-x-2 items-center">
                        <CiLogin /> 
                        Login to Dashboard
                        </button>
                     </Link>
                     <button className="text-[#152533] p-3 rounded-lg border border-gray-300 transition-all duration-300 hover:text-[#2872A1] hover:border-[#2872A1]">
                        See Features
                     </button>
                    </div>
                    <div className="p-3 text-gray-400 font-light font-serif p-5">
                        <p> · Real-Time Stock Sync · Auto-Generated Financial Reports</p>
                    </div>

                </div>


                {/*right side of hero */}

                <div className="w-full max-w-md mx-auto rounded-xl overflow-hidden shadow-lg border border-[#CBDDE9]/40 bg-white">
                {/* Top dark bar */}
                <div className="bg-[#0F1923] px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#CBDDE9]/60" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#CBDDE9]/60" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#CBDDE9]/60" />
                    </div>
                    <span className="text-[#CBDDE9] text-xs font-medium">
                        sortThrough <span className="text-[#CBDDE9]/50 font-normal">/ dashboard</span>
                    </span>
                    </div>
                    <span className="text-[#CBDDE9]/70 text-[10px] tracking-widest font-medium">LIVE</span>
                </div>

                {/* Stat grid */}
                <div className="grid grid-cols-2">
                    <div className="px-4 py-3 border-b border-r border-[#CBDDE9]/40">
                    <p className="text-[10px] tracking-wide text-[#152533]/50 font-medium uppercase">
                        Total Products
                    </p>
                    <p className="text-lg font-serif font-bold text-[#0F1923] mt-1">1,248</p>
                    <p className="text-xs text-[#2872A1] mt-0.5">+18 this week</p>
                    </div>
                    <div className="px-4 py-3 border-b border-[#CBDDE9]/40">
                    <p className="text-[10px] tracking-wide text-[#152533]/50 font-medium uppercase">
                        Today's Sales
                    </p>
                    <p className="text-lg font-serif font-bold text-[#0F1923] mt-1">$4,820</p>
                    <p className="text-xs text-[#2872A1] mt-0.5">+12.4%</p>
                    </div>
                    <div className="px-4 py-3 border-r border-[#CBDDE9]/40">
                    <p className="text-[10px] tracking-wide text-[#152533]/50 font-medium uppercase">
                        Low Stock
                    </p>
                    <p className="text-lg font-serif font-bold text-[#0F1923] mt-1">27</p>
                    <p className="text-xs text-[#2872A1] mt-0.5">needs restock</p>
                    </div>
                    <div className="px-4 py-3">
                    <p className="text-[10px] tracking-wide text-[#152533]/50 font-medium uppercase">
                        Revenue · MTD
                    </p>
                    <p className="text-lg font-serif font-bold text-[#0F1923] mt-1">$96,140</p>
                    <p className="text-xs text-[#2872A1] mt-0.5">+8.1%</p>
                    </div>
                </div>

                {/* Sales chart section */}
                <div className="px-4 pt-3 pb-2 border-t border-[#CBDDE9]/40">
                    <div className="flex items-center justify-between mb-3">
                    <p className="text-[#0F1923] text-xs font-medium">Sales · last 7 days</p>
                    <span className="text-[10px] bg-[#CBDDE9]/50 text-[#152533] px-2 py-0.5 rounded-full">
                        synced 2m ago
                    </span>
                    </div>

                    {/* Empty chart area placeholder */}
                    <div className="h-16" />

                    <div className="flex justify-between text-[10px] text-[#2872A1] font-medium border-t border-[#CBDDE9]/40 pt-2">
                    {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                        <span key={i}>{d}</span>
                    ))}
                    </div>
                </div>

                {/* Bottom SKU bar */}
                <div className="flex items-center gap-2 px-4 py-2 bg-[#CBDDE9]/20 border-t border-[#CBDDE9]/40">
                    <ScanLine className="w-3 h-3 text-[#0F1923]" strokeWidth={2} />
                    <span className="text-[10px] text-[#152533] font-medium">SKU</span>
                    <span className="text-[10px] font-mono bg-white border border-[#CBDDE9] px-1.5 py-0.5 rounded text-[#0F1923]">
                    ST-4821-BK
                    </span>
                    <span className="text-[10px] text-[#152533]/60">sold · stock auto-updated</span>
                </div>
                </div>

           </div>

           {/* Trusted by section*/}
           <div className="flex flex-col bg-[#F5F8FA] p-5 border-b border-t border-gray-200">
            <div className=" p-5">
                <h1 className="text-[#4B535A] text-center font-serif"> TRUSTED BY GROWING BUSINESSES</h1>
            </div>
                <div className="flex flex-row justify-between p-8 text-gray-400 font-serif font-light">
                <p className=" hover:text-black">NORTHGATE RETAIL</p>
                <p className=" hover:text-black">VANTAGE SUPPLY CO.</p>
                <p className=" hover:text-black">BRIGHTLINE TRADERS</p>
                <p className=" hover:text-black">MERIDIAN WHOLESALE</p>
                <p className=" hover:text-black">COASTAL MART GROUP</p>
                <p className=" hover:text-black">ALDER & CO.</p>
                </div>
           </div>

           {/*about section */}
           <div className="flex flex-col p-10 bg-[#FAFBFC]">
                <div className="flex flex-row p-16">
                    <div className=" font-serif text-[#0F1923] text-5xl">
                        <p className="text-[#2872A1] p-3 space-y-3 text-base">About</p>
                        <p>One system. Every part of your business.</p>
                    </div>
                    <div className=" text-gray-500">
                        <p>
                            Most growing businesses juggle three disconnected tools — a spreadsheet for stock,a notebook for sales,
                             and another system entirely for expenses.<br/>  Numbers drift out of sync. Nobody has the full picture.<br/>
                             <br/>
                            sortThrough replaces all three with a single platform where inventory,
                             sales, and finances are always talking to each other.
                        </p>
                    </div>
                </div>
                {/*cards*/}
                {/*main */}
                <div className="flex flex-row p-5 border border-gray-300 rounded-xl m-10">
                    {/*card*/}
                    <div className="flex flex-col p-5 border-r border-[#C3C6C8] space-y-7">
                    <div className="gap-x-5 items-center flex flex-row">
                        <div className="bg-[#0F1923] rounded-lg p-3 flex items-center justify-center">
                        <FiBox className="text-[#CBDDE9]" size={20} />
                        </div>
                        
                        
                        <p className="text-[#4B535A]">Step 1</p>
                    </div>
                    <div className="flex flex-col justify-between space-y-3">
                        <p className="font-semibold text-[#0F1923] text-xl font-serif">Track Inventory</p>
                        <p className="text-[#4B535A]">
                        Add products, manage suppliers
                        get alerted before you run out of stock.
                        </p>
                    </div>
                    </div>

                     <div className="flex flex-col p-5 border-r border-[#C3C6C8] space-y-7">
                    <div className="gap-x-5 items-center flex flex-row">
                        <div className="bg-[#0F1923] rounded-lg p-3 flex items-center justify-center">
                        <TbMoneybagMove className="text-[#CBDDE9]" size={20} />
                        </div>
                        
                        
                        <p className="text-[#4B535A]">Step 2</p>
                    </div>
                    <div className="flex flex-col justify-between space-y-3">
                        <p className="font-semibold text-[#0F1923] text-xl font-serif">Record Sales</p>
                        <p className="text-[#4B535A]">
                        Log sales in seconds, stock updates automatically, receipts print instantly.
                        </p>
                    </div>
                    </div>

                     <div className="flex flex-col p-5  space-y-7">
                    <div className="gap-x-5 items-center flex flex-row">
                        <div className="bg-[#0F1923] rounded-lg p-3 flex items-center justify-center">
                        <PiMonitorBold className="text-[#CBDDE9]" size={20} />
                        </div>
                       
                        
                        <p className="text-[#4B535A]">Step 3</p>
                    </div>
                    <div className="flex flex-col justify-between space-y-3">
                        <p className="font-semibold text-[#0F1923] text-xl font-serif">Monitor Finances</p>
                        <p className="text-[#4B535A]">
                        Every sale becomes revenue automatically — log expenses and see real profit.
                        </p>
                    </div>
                    </div>

                </div>
           </div>

           {/*Features section */}
           {/*main */}
           <div className="flex flex-col p-10 bg-[#F5F8FA] border-t border-gray-200">
                     <div className=" font-serif text-[#0F1923] p-5 space-y-5 ">
                        <p className="text-[#2872A1] p-3 space-y-3 text-base">Features</p>
                        <p className="text-5xl">Everything your team needs,<br/> nothing they don't.</p>
                        <p className="text-[#7B8186]">Role-based access means Admins, Sales Officers,
                         and Finance Officers each get tools built for their job.</p>
                    </div>
                    {/* cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 border border-[#CBDDE9] bg-white rounded-lg">
                {/* Card 1: Inventory & Product Management */}
                <div className="flex flex-col space-y-4 p-10 border-r border-b border-[#CBDDE9]">
                    <div className="flex flex-col space-y-3">
                    <div className="flex flex-row items-center gap-x-3">
                        <div className="bg-[#0F1923] rounded-lg p-3 flex items-center justify-center">
                        <FiBox className="text-[#CBDDE9]" size={20} />
                        </div>
                        <h3 className="text-[#0F1923] font-serif font-bold text-lg">
                        Inventory & Product Management
                        </h3>
                    </div>
                    <p className="text-[#7B8186]">
                        Keep full control over what you sell — and who supplies it.
                    </p>
                    </div>
                    <ul className="list-disc pl-6 marker:text-[#2872A1] space-y-2">
                    <li className="text-[#636A70]">Add, edit, and organize products by category</li>
                    <li className="text-[#636A70]">Track suppliers and contact details in one place</li>
                    <li className="text-[#636A70]">Barcode support for fast lookup</li>
                    <li className="text-[#636A70]">Low-stock alerts before you run out</li>
                    <li className="text-[#636A70]">Upload product images for easy visual identification</li>
                    </ul>
                </div>

                {/* Card 2: Sales Management */}
                <div className="flex flex-col space-y-4 p-10 border-b border-[#CBDDE9]">
                    <div className="flex flex-col space-y-3">
                    <div className="flex flex-row items-center gap-x-3">
                        <div className="bg-[#0F1923] rounded-lg p-3 flex items-center justify-center">
                        <HiOutlineShoppingCart className="text-[#CBDDE9]" size={20} />
                        </div>
                        <h3 className="text-[#0F1923] font-serif font-bold text-lg">
                        Sales Management
                        </h3>
                    </div>
                    <p className="text-[#7B8186]">From click to receipt in seconds.</p>
                    </div>
                    <ul className="list-disc pl-6 marker:text-[#2872A1] space-y-2">
                    <li className="text-[#636A70]">Create sales with multiple products in one transaction</li>
                    <li className="text-[#636A70]">Totals calculate automatically — no manual math</li>
                    <li className="text-[#636A70]">Stock deducts in real time as sales happen</li>
                    <li className="text-[#636A70]">Print or download receipts instantly (PDF)</li>
                    <li className="text-[#636A70]">Full sales history, searchable by customer or date</li>
                    </ul>
                </div>

                {/* Card 3: Finance & Reports */}
                <div className="flex flex-col space-y-4 p-10 border-r border-[#CBDDE9]">
                    <div className="flex flex-col space-y-3">
                    <div className="flex flex-row items-center gap-x-3">
                        <div className="bg-[#0F1923] rounded-lg p-3 flex items-center justify-center">
                        <BsWallet className="text-[#CBDDE9]" size={20} />
                        </div>
                        <h3 className="text-[#0F1923] font-serif font-bold text-lg">
                        Finance & Reports
                        </h3>
                    </div>
                    <p className="text-[#7B8186]">Know your numbers, not just your sales.</p>
                    </div>
                    <ul className="list-disc pl-6 marker:text-[#2872A1] space-y-2">
                    <li className="text-[#636A70]">Every sale automatically becomes tracked revenue</li>
                    <li className="text-[#636A70]">Log business expenses by category</li>
                    <li className="text-[#636A70]">See real net profit — not just gross sales</li>
                    <li className="text-[#636A70]">Daily, weekly, and monthly financial reports</li>
                    <li className="text-[#636A70]">Income vs expense trends over time</li>
                    </ul>
                </div>

                {/* Card 4: Role-Based Dashboards */}
                <div className="flex flex-col space-y-4 p-10">
                    <div className="flex flex-col space-y-3">
                    <div className="flex flex-row items-center gap-x-3">
                        <div className="bg-[#0F1923] rounded-lg p-3 flex items-center justify-center">
                        <LuUsers className="text-[#CBDDE9]" size={20} />
                        </div>
                        <h3 className="text-[#0F1923] font-serif font-bold text-lg">
                        Role-Based Dashboards
                        </h3>
                    </div>
                    <p className="text-[#7B8186]">The right access for the right person.</p>
                    </div>
                    <ul className="list-disc pl-6 marker:text-[#2872A1] space-y-2">
                    <li className="text-[#636A70]">Admin — full oversight: employees, products, suppliers, customers</li>
                    <li className="text-[#636A70]">Sales Officer — create sales, manage customers, track performance</li>
                    <li className="text-[#636A70]">Finance Officer — expenses, revenue, profit reports</li>
                    <li className="text-[#636A70]">Every login shows a dashboard built for that role</li>
                    </ul>
                </div>
                </div>
            <div className="flex flex-row items-center mt-5 p-3 space-x-3 bg-white rounded-lg">
                    <div className="bg-[#CBDDE9] rounded-lg p-3 flex items-center justify-center">
                        <LuLock className="text-[#0F1923]" size={20} />
                    </div>
                    <h3 className="text-[#0F1923] font-serif font-bold text- ">  Secure by design</h3>
                    <p className="text-[#636A70]  text-sm"> — JWT authentication, encrypted passwords, and protected routes on every page.</p>
                        

            </div>
           </div>

           {/*contact & footer */}
           <div className="flex flex-col bg-[#0F1923] p-16">
            {/*contact section */}
            <div className="flex flex-row justify-between">
                <div className="flex flex-col  space-y-3">
                    <div className="flex flex-row space-x-3 items-center">
                       <div className="bg-[#CBDDE9] rounded-lg p-2 flex items-center justify-center ">
                        <LiaSortSolid className="text-[#0F1923]" size={20} />
                        </div>
                        <h3 className="text-white font-serif font-bold  ">sortThrough</h3> 
                    </div>
                        <p className="text-[#878C91] font-serif  ">SortThrough — Inventory & Sales Management System</p>
                        <p className="text-[#878C91] font-serif  ">Built for businesses that want clarity, not chaos.</p>
                </div>

                <div className="flex flex-col  space-y-7 p-2 ">
                    <h3 className="text-gray-500">Quick Links</h3>
                    <Link className="text-[#636A70] hover:text-gray-700" href="/" >About</Link>
                    <Link className="text-[#636A70] hover:text-gray-700"  href="/">Features</Link>
                    <Link className="text-[#636A70] hover:text-gray-700" href="/">Customers</Link>
               </div>

            <div className="flex flex-col space-y-5">
                <h3 className="text-gray-500">Conatcs</h3>
                <div className="flex flex-row space-x-3 items-center">
                       <div className="bg-[#1B252E] rounded-lg p-2 flex items-center justify-center ">
                        <CiMail className="text-[#CBDDE9]" size={20} />
                        </div>
                      <Link className="text-[#636A70] hover:text-[#CBDDE9]" href="/">sortThrough@mail.com</Link>
                </div>
            
               <div className="flex flex-row space-x-3 items-center">
                       <div className="bg-[#1B252E] rounded-lg p-2 flex items-center justify-center ">
                        <VscGithubAlt className="text-[#CBDDE9]" size={20} />
                        </div>
                        <Link className="text-[#636A70] hover:text-[#CBDDE9]" href="/">Github repository</Link>
                </div>
                <form className="flex flex-col space-y-3">
                    <input className=" w-full border border-[#636A70] text-[#636A70] px-16  py-2 rounded-lg" placeholder="Name" />
                    <input className="border border-[#636A70] text-[#636A70] px-16  py-2  rounded-lg" placeholder="Email" />
                    <textarea className="border border-[#636A70] text-[#636A70] px-16  py-2  rounded-lg" placeholder="Message" />
                    <button className="bg-[#2872A1] text-white  font-semibold rounded-lg p-2 font-serif">Send Message</button>
                </form>
            </div>
            </div>
            <div className="border-t border-gray-700 mt-5 py-5  ">
                <p className="text-[#7E878F] font-light text-sm">© 2026 sortThrough. Built as part of a full-stack development training program.</p>
            </div>
            </div>
        </div>
    )
}