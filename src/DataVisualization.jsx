import { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement, RadialLinearScale, Filler } from 'chart.js';
import { Bar, Line, Pie, Doughnut, Radar } from 'react-chartjs-2';
import { BarChart3, TrendingUp, PieChart, Download, Filter, ArrowLeft, AlertTriangle, Activity, Zap, RefreshCw } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Filler
);

const DataVisualization = ({ onBack }) => {
  const [chartType, setChartType] = useState('bar');
  const [comparisonType, setComparisonType] = useState('state');
  const [selectedStates, setSelectedStates] = useState(['Kerala', 'Karnataka']);
  const [selectedDistricts, setSelectedDistricts] = useState(['Kottayam', 'Ernakulam']);
  const [selectedYears, setSelectedYears] = useState([2023, 2024]);
  const [selectedMetrics, setSelectedMetrics] = useState(['rainfall']);
  const [selectedEntity, setSelectedEntity] = useState('Kerala');
  const [year, setYear] = useState(2024);
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(true);
  const [availableOptions, setAvailableOptions] = useState(null);
  const chartRef = useRef(null);

  // Backend API configuration
  const API_BASE_URL = 'http://localhost:8000';

  // Chart types with compatibility info
  const chartTypes = [
    { id: 'bar', label: 'Bar Chart', icon: BarChart3, compatible: ['state', 'district', 'yearly'] },
    { id: 'line', label: 'Line Chart', icon: TrendingUp, compatible: ['yearly'] },
    { id: 'pie', label: 'Pie Chart', icon: PieChart, compatible: ['state', 'district'] },
    { id: 'doughnut', label: 'Doughnut Chart', icon: PieChart, compatible: ['state', 'district'] },
    { id: 'radar', label: 'Radar Chart', icon: Activity, compatible: ['metric'] }
  ];

  const comparisonTypes = [
    { id: 'state', label: 'State Comparison' },
    { id: 'district', label: 'District Comparison' },
    { id: 'yearly', label: 'Yearly Trends' },
    { id: 'metric', label: 'Multi-Metric' }
  ];

  const metrics = [
    { id: 'rainfall', label: 'Rainfall', unit: 'mm' },
    { id: 'recharge', label: 'Groundwater Recharge', unit: 'ham' },
    { id: 'draft', label: 'Groundwater Draft', unit: 'ham' },
    { id: 'availability', label: 'Water Availability', unit: 'ham' },
    { id: 'groundwater', label: 'Groundwater Resources', unit: 'ham' }
  ];

  const availableYears = [2023, 2024];

  // Load available options from backend
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/visualization/options`);
        if (response.ok) {
          const options = await response.json();
          setAvailableOptions(options);
        }
      } catch (error) {
        console.error('Failed to load visualization options:', error);
      }
    };

    fetchOptions();
  }, []);

  const isCompatible = (chart, comparison) => {
    const chartInfo = chartTypes.find(c => c.id === chart);
    return chartInfo ? chartInfo.compatible.includes(comparison) : false;
  };

  // Fetch data from backend
  const generateVisualization = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const requestData = {
        chart_type: chartType,
        comparison_type: comparisonType,
        metrics: selectedMetrics,
        filters: {}
      };

      // Add appropriate parameters based on comparison type
      if (comparisonType === 'state') {
        requestData.states = selectedStates;
        requestData.filters.year = year;
      } else if (comparisonType === 'district') {
        requestData.districts = selectedDistricts;
        requestData.filters.year = year;
      } else if (comparisonType === 'yearly') {
        requestData.years = selectedYears;
        requestData.filters.entity = selectedEntity;
        requestData.filters.entity_type = 'state'; // Assuming state for now
      } else if (comparisonType === 'metric') {
        requestData.filters.entity = selectedEntity;
        requestData.filters.entity_type = 'state';
        requestData.filters.year = year;
      }

      const response = await fetch(`${API_BASE_URL}/visualize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || 'Failed to generate visualization');
      }

      if (result.error) {
        setError(result.error);
        setChartData(null);
      } else {
        setChartData({
          data: result.data,
          metadata: result.metadata,
          processing_time: result.processing_time
        });
      }

    } catch (error) {
      console.error('Visualization error:', error);
      setError(error.message || 'Failed to generate visualization. Please check your connection and try again.');
      setChartData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-generate visualization when parameters change
  useEffect(() => {
    if (selectedMetrics.length > 0) {
      const timer = setTimeout(() => {
        generateVisualization();
      }, 500); // Debounce to avoid too many requests
      return () => clearTimeout(timer);
    }
  }, [chartType, comparisonType, selectedStates, selectedDistricts, selectedYears, selectedMetrics, selectedEntity, year]);

  const handleChartTypeChange = (newChartType) => {
    setChartType(newChartType);
    if (!isCompatible(newChartType, comparisonType)) {
      const compatibleTypes = chartTypes.find(ct => ct.id === newChartType)?.compatible || [];
      if (compatibleTypes.length > 0) {
        setComparisonType(compatibleTypes[0]);
      }
    }
  };

  const handleComparisonTypeChange = (newComparisonType) => {
    setComparisonType(newComparisonType);
    if (!isCompatible(chartType, newComparisonType)) {
      const compatibleChart = chartTypes.find(ct => ct.compatible.includes(newComparisonType));
      if (compatibleChart) {
        setChartType(compatibleChart.id);
      }
    }

    // Adjust metrics selection based on comparison type
    if (newComparisonType === 'metric') {
      setSelectedMetrics(['rainfall', 'recharge']);
    } else {
      setSelectedMetrics(['rainfall']);
    }
  };

  const downloadChart = () => {
    if (chartRef.current) {
      const canvas = chartRef.current.canvas;
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `groundwater-chart-${Date.now()}.png`;
      link.href = url;
      link.click();
    }
  };

  const renderChart = () => {
    if (!chartData?.data) return null;

    const commonProps = {
      ref: chartRef,
      data: chartData.data.data,
      options: {
        ...chartData.data.options,
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
          easing: 'easeInOutCubic'
        }
      }
    };

    switch (chartType) {
      case 'bar':
        return <Bar {...commonProps} />;
      case 'line':
        return <Line {...commonProps} />;
      case 'pie':
        return <Pie {...commonProps} />;
      case 'doughnut':
        return <Doughnut {...commonProps} />;
      case 'radar':
        return <Radar {...commonProps} />;
      default:
        return <Bar {...commonProps} />;
    }
  };

  // Get available states and districts from backend options or fallback
  const getAvailableStates = () => {
    return  [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
      'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
      'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
      'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
      'Uttarakhand', 'West Bengal', 'Delhi'
    ];
  };

  const getAvailableDistricts = () => {
    return [
      'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam',
      'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta',
      'Thiruvananthapuram', 'Thrissur', 'Wayanad'
    ];
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-8xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 px-3 py-2 text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Data Visualization</h1>
                <p className="text-sm text-gray-600">Real-time Groundwater Analytics Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  showFilters 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
              <button
                onClick={generateVisualization}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              {chartData && (
                <button
                  onClick={downloadChart}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Filters */}
        {showFilters && (
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Chart Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">Chart Type</label>
                <div className="grid grid-cols-1 gap-2">
                  {chartTypes.map((type) => {
                    const IconComponent = type.icon;
                    const compatible = isCompatible(type.id, comparisonType);
                    const selected = chartType === type.id;
                    
                    return (
                      <button
                        key={type.id}
                        onClick={() => handleChartTypeChange(type.id)}
                        disabled={!compatible}
                        className={`w-full p-3 rounded-lg border text-left bg-white ${
                          selected
                            ? 'border-blue-500 bg-blue-50 text-blue-900'
                            : compatible
                            ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <IconComponent className="w-5 h-5" />
                          <span className="font-medium">{type.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comparison Type */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">Comparison Type</label>
                <select
                  value={comparisonType}
                  onChange={(e) => handleComparisonTypeChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {comparisonTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Metrics Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">Metrics</label>
                <div className="space-y-2">
                  {metrics.map((metric) => (
                    <label key={metric.id} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type={comparisonType === 'metric' ? 'checkbox' : 'radio'}
                        name="metrics"
                        value={metric.id}
                        checked={selectedMetrics.includes(metric.id)}
                        onChange={(e) => {
                          if (comparisonType === 'metric') {
                            if (e.target.checked) {
                              setSelectedMetrics([...selectedMetrics, metric.id]);
                            } else {
                              setSelectedMetrics(selectedMetrics.filter(m => m !== metric.id));
                            }
                          } else {
                            setSelectedMetrics([metric.id]);
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <span className="text-gray-900 font-medium">{metric.label}</span>
                        <span className="text-gray-500 text-sm ml-1">({metric.unit})</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Dynamic filters based on comparison type */}
              {comparisonType === 'state' && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">States</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {getAvailableStates().map((state) => (
                      <label key={state} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedStates.includes(state)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStates([...selectedStates, state]);
                            } else {
                              setSelectedStates(selectedStates.filter(s => s !== state));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{state}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {comparisonType === 'district' && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">Districts (Kerala)</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {getAvailableDistricts().map((district) => (
                      <label key={district} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedDistricts.includes(district)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDistricts([...selectedDistricts, district]);
                            } else {
                              setSelectedDistricts(selectedDistricts.filter(d => d !== district));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{district}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {comparisonType === 'yearly' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">Years</label>
                    <div className="space-y-2">
                      {availableYears.map((yr) => (
                        <label key={yr} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedYears.includes(yr)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedYears([...selectedYears, yr]);
                              } else {
                                setSelectedYears(selectedYears.filter(y => y !== yr));
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-700">{yr}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Entity</label>
                    <select
                      value={selectedEntity}
                      onChange={(e) => setSelectedEntity(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {getAvailableStates().map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {comparisonType === 'metric' && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Entity</label>
                  <select
                    value={selectedEntity}
                    onChange={(e) => setSelectedEntity(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {getAvailableStates().map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Year filter for non-yearly comparisons */}
              {comparisonType !== 'yearly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Year</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {availableYears.map((yr) => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Backend Connection Status */}
              <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-600">
                  <div className="flex items-center justify-between mb-1">
                    <span>Backend Status:</span>
                    <div className={`w-2 h-2 rounded-full ${availableOptions ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {availableOptions ? 'Connected' : 'Offline - Using fallback data'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Chart Area */}
        <div className="flex-1 flex flex-col overflow-auto">
          <div className="flex-1 p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
              {isLoading && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Fetching data from server...</p>
                    <p className="text-gray-500 text-sm mt-1">Generating visualization...</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center max-w-md">
                    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Visualization Error</h3>
                    <p className="text-gray-600 mb-4 text-sm">{error}</p>
                    <div className="space-y-2">
                      <button
                        onClick={generateVisualization}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Retry
                      </button>
                      <p className="text-xs text-gray-500">
                        Make sure the backend server is running on port 8000
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {chartData && !isLoading && !error && (
                <div className="flex-1 p-6">
                  <div className="h-full">
                    {renderChart()}
                  </div>
                </div>
              )}

              {!chartData && !isLoading && !error && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Visualize</h3>
                    <p className="text-gray-600">Configure your parameters and click refresh to fetch real data</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chart Info Panel */}
          {chartData && (
            <div className="px-6 pb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Analysis Summary</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Zap className="w-4 h-4" />
                    <span>Processed in {chartData.processing_time}s</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xs font-medium text-blue-700 uppercase mb-1">Chart Type</div>
                    <div className="text-blue-900 font-semibold capitalize">{chartType}</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xs font-medium text-green-700 uppercase mb-1">Comparison</div>
                    <div className="text-green-900 font-semibold capitalize">{comparisonType}</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-xs font-medium text-purple-700 uppercase mb-1">Metrics</div>
                    <div className="text-purple-900 font-semibold">{selectedMetrics.length}</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-xs font-medium text-orange-700 uppercase mb-1">Data Points</div>
                    <div className="text-orange-900 font-semibold">{chartData.metadata?.data_points || 0}</div>
                  </div>
                </div>

                {/* Query Info */}
                {chartData.metadata?.query_used && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <details className="cursor-pointer">
                      <summary className="text-sm font-medium text-gray-700 hover:text-gray-900">
                        Database Query Used
                      </summary>
                      <pre className="mt-2 text-xs text-gray-600 bg-white p-2 rounded border overflow-x-auto">
                        {chartData.metadata.query_used}
                      </pre>
                    </details>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;