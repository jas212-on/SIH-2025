import { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement, RadialLinearScale, Filler } from 'chart.js';
import { Bar, Line, Pie, Doughnut, Radar } from 'react-chartjs-2';
import { FaChartBar, FaChartLine, FaChartPie, FaChartArea, FaSpinner, FaDownload, FaFilter, FaRandom, FaArrowLeft } from 'react-icons/fa';
import { MdRadar } from 'react-icons/md';
import './DataVisualization.css';

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
  const [selectedYears, setSelectedYears] = useState([2022, 2023, 2024]);
  const [selectedMetrics, setSelectedMetrics] = useState(['rainfall']);
  const [selectedEntity, setSelectedEntity] = useState('Kerala');
  const [entityType, setEntityType] = useState('state');
  const [year, setYear] = useState(2024);
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visualizationOptions, setVisualizationOptions] = useState(null);
  const [showFilters, setShowFilters] = useState(true);
  const chartRef = useRef(null);

  // Fetch visualization options on component mount
  useEffect(() => {
    fetch('http://localhost:8000/visualization/options')
      .then(response => response.json())
      .then(data => setVisualizationOptions(data))
      .catch(err => console.error('Failed to load visualization options:', err));
  }, []);

  // Chart type configurations
  const chartTypes = [
    { id: 'bar', label: 'Bar Chart', icon: FaChartBar, description: 'Compare values across categories' },
    { id: 'line', label: 'Line Chart', icon: FaChartLine, description: 'Show trends over time' },
    { id: 'pie', label: 'Pie Chart', icon: FaChartPie, description: 'Show proportional distribution' },
    { id: 'doughnut', label: 'Doughnut', icon: FaChartPie, description: 'Modern pie chart with center space' },
    { id: 'radar', label: 'Radar Chart', icon: MdRadar, description: 'Multi-metric comparison' }
  ];

  const comparisonTypes = [
    { id: 'state', label: 'State Comparison', description: 'Compare metrics across different states' },
    { id: 'district', label: 'District Comparison', description: 'Compare metrics across districts' },
    { id: 'yearly', label: 'Yearly Trends', description: 'Show trends over multiple years' },
    { id: 'metric', label: 'Multi-Metric', description: 'Compare multiple metrics for one entity' }
  ];

  const metrics = [
    { id: 'rainfall', label: 'Rainfall', unit: 'mm', color: '#3b82f6' },
    { id: 'recharge', label: 'Groundwater Recharge', unit: 'ham', color: '#10b981' },
    { id: 'draft', label: 'Groundwater Draft', unit: 'ham', color: '#f59e0b' },
    { id: 'availability', label: 'Water Availability', unit: 'ham', color: '#8b5cf6' },
    { id: 'groundwater', label: 'Groundwater Resources', unit: 'ham', color: '#06b6d4' }
  ];

  // Generate visualization based on current selections
  const generateVisualization = async () => {
    if (!visualizationOptions) return;

    setIsLoading(true);
    setError(null);

    try {
      const requestBody = {
        chart_type: chartType,
        comparison_type: comparisonType,
        states: comparisonType === 'state' ? selectedStates : null,
        districts: comparisonType === 'district' ? selectedDistricts : null,
        years: comparisonType === 'yearly' ? selectedYears : null,
        metrics: selectedMetrics,
        filters: {
          year: comparisonType !== 'yearly' ? year : null,
          entity: comparisonType === 'yearly' || comparisonType === 'metric' ? selectedEntity : null,
          entity_type: comparisonType === 'yearly' || comparisonType === 'metric' ? entityType : null,
          state: comparisonType === 'district' ? 'Kerala' : null
        }
      };

      const response = await fetch('http://localhost:8000/visualize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const result = await response.json();
      
      if (result.error) {
        setError(result.error);
      } else {
        setChartData(result.data);
      }
    } catch (err) {
      setError('Failed to generate visualization: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-generate visualization when selections change
  useEffect(() => {
    if (visualizationOptions && selectedMetrics.length > 0) {
      const timer = setTimeout(() => {
        generateVisualization();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [chartType, comparisonType, selectedStates, selectedDistricts, selectedYears, selectedMetrics, selectedEntity, entityType, year, visualizationOptions]);

  // Quick preset configurations
  const applyPreset = (preset) => {
    switch (preset) {
      case 'state_rainfall':
        setChartType('bar');
        setComparisonType('state');
        setSelectedStates(['Kerala', 'Karnataka', 'Tamil Nadu', 'Andhra Pradesh']);
        setSelectedMetrics(['rainfall']);
        break;
      case 'yearly_trends':
        setChartType('line');
        setComparisonType('yearly');
        setSelectedYears([2020, 2021, 2022, 2023, 2024]);
        setSelectedMetrics(['rainfall']);
        setSelectedEntity('Kerala');
        break;
      case 'multi_metric':
        setChartType('radar');
        setComparisonType('metric');
        setSelectedMetrics(['rainfall', 'recharge', 'draft', 'availability']);
        setSelectedEntity('Kerala');
        break;
      case 'district_comparison':
        setChartType('doughnut');
        setComparisonType('district');
        setSelectedDistricts(['Kottayam', 'Ernakulam', 'Thrissur', 'Palakkad']);
        setSelectedMetrics(['groundwater']);
        break;
    }
  };

  // Download chart as image
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

  // Render chart component based on type
  const renderChart = () => {
    if (!chartData) return null;

    const commonProps = {
      ref: chartRef,
      data: chartData.data,
      options: {
        ...chartData.options,
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1500,
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

  if (!visualizationOptions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading visualization options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <FaArrowLeft />
                <span>Back to Chat</span>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Data Visualization</h1>
                <p className="text-gray-600">Interactive groundwater data analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  showFilters 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaFilter />
                <span>Filters</span>
              </button>
              {chartData && (
                <button
                  onClick={downloadChart}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <FaDownload />
                  <span>Download</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with controls */}
          {showFilters && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                {/* Quick Presets */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Presets</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => applyPreset('state_rainfall')}
                      className="p-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                    >
                      State Rainfall
                    </button>
                    <button
                      onClick={() => applyPreset('yearly_trends')}
                      className="p-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
                    >
                      Yearly Trends
                    </button>
                    <button
                      onClick={() => applyPreset('multi_metric')}
                      className="p-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm"
                    >
                      Multi-Metric
                    </button>
                    <button
                      onClick={() => applyPreset('district_comparison')}
                      className="p-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors text-sm"
                    >
                      Districts
                    </button>
                  </div>
                </div>

                {/* Chart Type Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Chart Type</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {chartTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setChartType(type.id)}
                          className={`p-3 rounded-lg border-2 transition-all text-left ${
                            chartType === type.id
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <IconComponent className="text-lg" />
                            <div>
                              <div className="font-medium">{type.label}</div>
                              <div className="text-xs text-gray-500">{type.description}</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Comparison Type */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Comparison Type</h3>
                  <select
                    value={comparisonType}
                    onChange={(e) => setComparisonType(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Metrics</h3>
                  <div className="space-y-2">
                    {metrics.map((metric) => (
                      <label key={metric.id} className="flex items-center space-x-2 cursor-pointer">
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
                        <span className="text-gray-700">{metric.label}</span>
                        <span className="text-xs text-gray-500">({metric.unit})</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Dynamic filters based on comparison type */}
                {comparisonType === 'state' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">States</h3>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {visualizationOptions.sample_states.map((state) => (
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
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Districts (Kerala)</h3>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {visualizationOptions.sample_districts.Kerala.map((district) => (
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
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Years</h3>
                    <div className="space-y-2">
                      {visualizationOptions.available_years.map((yr) => (
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
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Entity</label>
                      <select
                        value={selectedEntity}
                        onChange={(e) => setSelectedEntity(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        {visualizationOptions.sample_states.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {comparisonType === 'metric' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Entity</h3>
                    <select
                      value={selectedEntity}
                      onChange={(e) => setSelectedEntity(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {visualizationOptions.sample_states.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Year filter for non-yearly comparisons */}
                {comparisonType !== 'yearly' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                    <select
                      value={year}
                      onChange={(e) => setYear(parseInt(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {visualizationOptions.available_years.map((yr) => (
                        <option key={yr} value={yr}>{yr}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Main chart area */}
          <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
            <div className="bg-white rounded-xl shadow-lg p-6">
              {isLoading && (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-600">Generating visualization...</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center text-red-600">
                    <div className="text-6xl mb-4">⚠️</div>
                    <p className="text-lg font-semibold mb-2">Visualization Error</p>
                    <p className="text-sm">{error}</p>
                    <button
                      onClick={generateVisualization}
                      className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}

              {chartData && !isLoading && !error && (
                <div className="h-96 relative">
                  {renderChart()}
                </div>
              )}

              {!chartData && !isLoading && !error && (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center text-gray-500">
                    <FaChartBar className="text-6xl mx-auto mb-4" />
                    <p className="text-lg">Select your parameters and chart type to visualize groundwater data</p>
                  </div>
                </div>
              )}
            </div>

            {/* Chart info panel */}
            {chartData && (
              <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Chart Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="font-semibold text-blue-700">Chart Type</div>
                    <div className="text-blue-600 capitalize">{chartType}</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="font-semibold text-green-700">Comparison</div>
                    <div className="text-green-600 capitalize">{comparisonType}</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="font-semibold text-purple-700">Metrics</div>
                    <div className="text-purple-600">{selectedMetrics.length}</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="font-semibold text-orange-700">Data Points</div>
                    <div className="text-orange-600">{chartData.data?.labels?.length || 0}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;