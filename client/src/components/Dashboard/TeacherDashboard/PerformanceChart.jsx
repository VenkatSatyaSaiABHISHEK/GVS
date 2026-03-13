import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const PerformanceChart = ({ data }) => {
  const defaultChartData = [
    { month: 'Jan', applications: 12, interviews: 8, hired: 3 },
    { month: 'Feb', applications: 15, interviews: 10, hired: 4 },
    { month: 'Mar', applications: 18, interviews: 12, hired: 5 },
    { month: 'Apr', applications: 22, interviews: 15, hired: 6 },
    { month: 'May', applications: 25, interviews: 18, hired: 8 },
    { month: 'Jun', applications: 28, interviews: 20, hired: 9 },
  ];

  const normalizeChartData = (input) => {
    if (Array.isArray(input)) return input;

    if (input && typeof input === 'object') {
      if (Array.isArray(input.chartData)) {
        return input.chartData;
      }

      if (Array.isArray(input.labels) && Array.isArray(input.values)) {
        return input.labels.map((label, index) => ({
          month: label,
          applications: Number(input.values[index] ?? 0),
          interviews: 0,
          hired: 0,
        }));
      }
    }

    return defaultChartData;
  };

  const chartData = normalizeChartData(data).map((item, index) => ({
    month: item?.month || item?.week || `P${index + 1}`,
    applications: Number(item?.applications ?? 0),
    interviews: Number(item?.interviews ?? 0),
    hired: Number(item?.hired ?? item?.classes ?? 0),
  }));

  const currentMonth = chartData[chartData.length - 1];
  const previousMonth = chartData[chartData.length - 2];
  
  const applicationsTrend = currentMonth?.applications > previousMonth?.applications;
  const interviewsTrend = currentMonth?.interviews > previousMonth?.interviews;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Performance Overview</h3>
          <p className="text-sm text-gray-500">Your teaching career progress</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Applications</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Interviews</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Hired</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Applications This Month</p>
              <p className="text-2xl font-bold text-gray-800">{currentMonth?.applications || 0}</p>
            </div>
            <div className={`flex items-center space-x-1 ${applicationsTrend ? 'text-green-600' : 'text-red-600'}`}>
              {applicationsTrend ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="text-sm font-medium">
                {Math.abs(((currentMonth?.applications || 0) - (previousMonth?.applications || 0)) / (previousMonth?.applications || 1) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Interviews This Month</p>
              <p className="text-2xl font-bold text-gray-800">{currentMonth?.interviews || 0}</p>
            </div>
            <div className={`flex items-center space-x-1 ${interviewsTrend ? 'text-green-600' : 'text-red-600'}`}>
              {interviewsTrend ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="text-sm font-medium">
                {Math.abs(((currentMonth?.interviews || 0) - (previousMonth?.interviews || 0)) / (previousMonth?.interviews || 1) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="applications" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="interviews" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="hired" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;