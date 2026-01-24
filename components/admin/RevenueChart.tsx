'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueData {
  date: string;
  revenue: number;
  ordersCount: number;
}

interface RevenueChartProps {
  data: RevenueData[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  // Formater les données pour le graphique
  const chartData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
    revenue: item.revenue,
    orders: item.ordersCount,
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Revenus des 30 derniers jours
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            stroke="#9ca3af"
          />
          <YAxis 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            stroke="#9ca3af"
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
            formatter={(value: number | undefined) => [`${(value ?? 0).toLocaleString('fr-FR')} FC`, 'Revenus']}
          />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// 'use client';

// import React from 'react';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts';

// interface RevenueData {
//   date: string;
//   revenue: number;
//   ordersCount: number;
// }

// interface RevenueChartProps {
//   data: RevenueData[];
// }

// export default function RevenueChart({ data }: RevenueChartProps) {
//   const formattedData = data.map((item) => ({
//     ...item,
//     date: new Date(item.date).toLocaleDateString('fr-FR', {
//       day: '2-digit',
//       month: 'short',
//     }),
//   }));

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//       <h3 className="text-lg font-semibold text-gray-900 mb-4">
//         Revenus des 30 derniers jours
//       </h3>
//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={formattedData}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//           <XAxis
//             dataKey="date"
//             stroke="#9ca3af"
//             style={{ fontSize: '12px' }}
//           />
//           <YAxis
//             stroke="#9ca3af"
//             style={{ fontSize: '12px' }}
//             tickFormatter={(value) => `${value}€`}
//           />
//           <Tooltip
//             contentStyle={{
//               backgroundColor: '#fff',
//               border: '1px solid #e5e7eb',
//               borderRadius: '8px',
//               padding: '8px 12px',
//             }}
//             formatter={(value: number) => [`${value.toLocaleString('fr-FR')} FC`, 'Revenus']}
//           />
//           <Line
//             type="monotone"
//             dataKey="revenue"
//             stroke="#3b82f6"
//             strokeWidth={2}
//             dot={{ fill: '#3b82f6', r: 4 }}
//             activeDot={{ r: 6 }}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }