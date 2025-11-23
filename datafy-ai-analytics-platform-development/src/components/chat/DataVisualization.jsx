import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#f97316', '#2dd4bf', '#8b5cf6', '#ef4444', '#10b981', '#f59e0b', '#6366f1', '#ec4899'];

const DataVisualization = ({ data }) => {
  if (!data || !data.data || !Array.isArray(data.data)) return null;

  const renderChart = () => {
    switch (data.chartType) {
      case 'bar':
        return (
          <BarChart data={data.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1e293b',
                border: 'none',
                borderRadius: '8px',
                color: '#f8fafc'
              }}
            />
            <Bar dataKey="value" fill="#f97316" />
          </BarChart>
        );

      case 'line':
        return (
          <LineChart data={data.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1e293b',
                border: 'none',
                borderRadius: '8px',
                color: '#f8fafc'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#f97316" 
              strokeWidth={3}
              dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data.data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1e293b',
                border: 'none',
                borderRadius: '8px',
                color: '#f8fafc'
              }}
            />
          </PieChart>
        );

      case 'scatter':
        return (
          <ScatterChart data={data.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="x" stroke="#64748b" />
            <YAxis dataKey="y" stroke="#64748b" />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1e293b',
                border: 'none',
                borderRadius: '8px',
                color: '#f8fafc'
              }}
            />
            <Scatter dataKey="value" fill="#f97316" />
          </ScatterChart>
        );

      default:
        return <div className="text-gray-500">Unsupported chart type</div>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="my-4 p-4 bg-gray-50 dark:bg-dark-700 rounded-lg border border-gray-200 dark:border-dark-600"
    >
      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
        📊 {data.title}
      </h4>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {data.xLabel && data.yLabel && (
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
          <span>{data.xLabel}</span>
          <span>{data.yLabel}</span>
        </div>
      )}

      {/* Legend for pie charts */}
      {data.chartType === 'pie' && (
        <div className="flex flex-wrap gap-2 mt-3 justify-center">
          {data.data.map((item, index) => (
            <div key={index} className="flex items-center space-x-1 text-xs">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-gray-600 dark:text-gray-300">{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default DataVisualization;