import React from "react";
import {
  FaCashRegister,
  FaClipboardList,
  FaChartLine,
  FaShoppingCart,
  FaShoppingBag,
  FaUser,
} from "react-icons/fa";

function CircularProgress({ percentage, color }) {
  const radius = 30;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + " " + circumference}
        style={{ strokeDashoffset }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        className="transition-all duration-500"
      />
    </svg>
  );
}

function Dashboard() {
  return (
    <div className="flex-1 p-8 bg-gray-900 text-gray-300 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <input
          type="text"
          placeholder="mm / dd / yyyy"
          className="bg-gray-800 text-white rounded-md px-3 py-1 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-2xl p-6 flex items-center space-x-6">
          <div className="bg-indigo-500 rounded-full p-3">
            <FaCashRegister className="text-white text-xl" />
          </div>
          <div>
            <div className="font-semibold text-white">Sales</div>
            <div className="text-3xl font-bold">$15,078</div>
            <div className="text-sm text-gray-400">Last 24 Hours</div>
          </div>
          <div className="ml-auto">
            <CircularProgress percentage={81} color="#818cf8" />
            <div className="text-indigo-400 text-sm text-center mt-1">81%</div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 flex items-center space-x-6">
          <div className="bg-pink-500 rounded-full p-3">
            <FaClipboardList className="text-white text-xl" />
          </div>
          <div>
            <div className="font-semibold text-white">Expenses</div>
            <div className="text-3xl font-bold">$8,234</div>
            <div className="text-sm text-gray-400">Last 24 Hours</div>
          </div>
          <div className="ml-auto">
            <CircularProgress percentage={62} color="#818cf8" />
            <div className="text-indigo-400 text-sm text-center mt-1">62%</div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 flex items-center space-x-6">
          <div className="bg-green-400 rounded-full p-3">
            <FaChartLine className="text-white text-xl" />
          </div>
          <div>
            <div className="font-semibold text-white">Income</div>
            <div className="text-3xl font-bold">$6,844</div>
            <div className="text-sm text-gray-400">Last 24 Hours</div>
          </div>
          <div className="ml-auto">
            <CircularProgress percentage={73} color="#818cf8" />
            <div className="text-indigo-400 text-sm text-center mt-1">73%</div>
          </div>
        </div>
      </div>

      <div className="flex space-x-6">
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-4">Recent orders</h2>
          <div className="bg-gray-800 rounded-2xl p-6">
            <table className="w-full text-left text-gray-300">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-2 font-semibold">Product Name</th>
                  <th className="py-2 font-semibold">Product Number</th>
                  <th className="py-2 font-semibold">Payment</th>
                  <th className="py-2 font-semibold">Status</th>
                  <th className="py-2 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700">
                  <td className="py-2">Keycult PCB 60</td>
                  <td className="py-2">34512</td>
                  <td className="py-2">Due</td>
                  <td className="py-2">Pending</td>
                  <td className="py-2 text-indigo-500 cursor-pointer">Details</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-2">KBDFans 80 RGB</td>
                  <td className="py-2">23455</td>
                  <td className="py-2">Refunded</td>
                  <td className="py-2">Declined</td>
                  <td className="py-2 text-indigo-500 cursor-pointer">Details</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-2">Plated Steelcaps</td>
                  <td className="py-2">11001</td>
                  <td className="py-2">Due</td>
                  <td className="py-2">Pending</td>
                  <td className="py-2 text-indigo-500 cursor-pointer">Details</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-2">Aviator Cable 2m</td>
                  <td className="py-2">56756</td>
                  <td className="py-2">Paid</td>
                  <td className="py-2">Delivered</td>
                  <td className="py-2 text-indigo-500 cursor-pointer">Details</td>
                </tr>
                <tr>
                  <td className="py-2">Keychron Q3 QMK Custom</td>
                  <td className="py-2">49305</td>
                  <td className="py-2">Paid</td>
                  <td className="py-2">Delivered</td>
                  <td className="py-2 text-indigo-500 cursor-pointer">Details</td>
                </tr>
              </tbody>
            </table>
            <div className="text-indigo-500 text-center mt-4 cursor-pointer">Show All</div>
          </div>
        </div>

        <div className="w-80 space-y-6">
          <div className="bg-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Trending</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <img
                  src="https://i.pravatar.cc/40?img=1"
                  alt="Winston Smith"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div>
                    <span className="font-bold text-white">Winston Smith</span>{" "}
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Aliquid.
                  </div>
                  <div className="text-xs text-gray-400">12 Minutes Ago</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <img
                  src="https://i.pravatar.cc/40?img=2"
                  alt="Anna Mons"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div>
                    <span className="font-bold text-white">Anna Mons</span> Recieved
                    the kbd60!
                  </div>
                  <div className="text-xs text-gray-400">23 Minutes Ago</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <img
                  src="https://i.pravatar.cc/40?img=3"
                  alt="Rose Namajunas"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div>
                    <span className="font-bold text-white">Rose Namajunas</span> Ronda
                    is lame.
                  </div>
                  <div className="text-xs text-gray-400">35 Minutes Ago</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-bold mb-4">Sales analytics</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 bg-gray-700 rounded-lg p-3">
                <div className="bg-indigo-500 p-3 rounded-full">
                  <FaShoppingCart className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-white uppercase">
                    Online Orders
                  </div>
                  <div className="text-xs text-gray-400">Last 24 Hours</div>
                </div>
                <div className="text-green-500 font-bold text-sm">+27%</div>
                <div className="font-bold">2349</div>
              </div>
              <div className="flex items-center space-x-4 bg-gray-700 rounded-lg p-3">
                <div className="bg-pink-500 p-3 rounded-full">
                  <FaShoppingBag className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-white uppercase">
                    Over The Counter
                  </div>
                  <div className="text-xs text-gray-400">Last 24 Hours</div>
                </div>
                <div className="text-red-500 font-bold text-sm">-11%</div>
                <div className="font-bold">-987</div>
              </div>
              <div className="flex items-center space-x-4 bg-gray-700 rounded-lg p-3">
                <div className="bg-green-400 p-3 rounded-full">
                  <FaUser className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-white uppercase">
                    New Customers
                  </div>
                  <div className="text-xs text-gray-400">Last 24 Hours</div>
                </div>
                <div className="text-green-500 font-bold text-sm">+4%</div>
                <div className="font-bold">787</div>
              </div>
            </div>
          </div>

          <button className="w-full border-2 border-dashed border-indigo-500 rounded-2xl py-3 text-indigo-500 font-semibold hover:bg-indigo-600 hover:text-white transition">
            + Add Product
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
