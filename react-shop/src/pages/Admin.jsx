import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";
import Dashboard from "../components/admin/Dashboard";
import ProductList from "../components/admin/product/List";
import CategoryList from "../components/admin/category/List";
import OrderList from "../components/admin/order/List";

function Admin() {
  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-300">
      {/* Sidebar - Không cần props */}
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />
        
        {/* Main Content - Routes nội bộ KHÔNG BỊ RELOAD */}
        <div className="p-6 flex-1 overflow-y-auto">
          <Routes>
            {/* Route chính xác cho Dashboard */}
            <Route index element={<Dashboard />} />
            
            {/* Routes cho các trang khác */}
            <Route path="products" element={<ProductList />} />
            <Route path="categories" element={<CategoryList />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="messages" element={
              <div className="text-white text-2xl p-8">Messages (Coming Soon)</div>
            } />
            <Route path="history" element={
              <div className="text-white text-2xl p-8">History (Coming Soon)</div>
            } />
            <Route path="communities" element={
              <div className="text-white text-2xl p-8">Communities (Coming Soon)</div>
            } />
            <Route path="settings" element={
              <div className="text-white text-2xl p-8">Settings (Coming Soon)</div>
            } />
            <Route path="support" element={
              <div className="text-white text-2xl p-8">Support (Coming Soon)</div>
            } />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Admin;