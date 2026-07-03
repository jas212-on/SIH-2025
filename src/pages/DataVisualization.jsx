import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement, RadialLinearScale, Filler } from 'chart.js';
import { Bar, Line, Pie, Doughnut, Radar } from 'react-chartjs-2';
import { BarChart3, TrendingUp, PieChart, Download, Filter, ArrowLeft, AlertTriangle, Activity, Zap, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import StatusIndicator from '../components/common/StatusIndicator';
import WaveDivider from '../components/home/WaveDivider';

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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const goBack = onBack || (() => navigate('/chat'));
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
  const chartRef = useRef(null);


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

      const result = await api.visualize(requestData);

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
    <div className="h-screen bg-ink-50 dark:bg-ink-950 flex flex-col">
      {/* Header — matches chat.jsx / MapPage.jsx gradient bar */}
      <header className="relative bg-gradient-to-r from-brand-700 via-brand-600 to-brand-700 shadow-card z-30 shrink-0">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={goBack}
              title={t('backToChat')}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition shrink-0"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={() => navigate('/')}
              title="Jalmitra home"
              className="flex items-center gap-3 min-w-0 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-black ring-1 ring-white/10 flex items-center justify-center shrink-0 p-1.5">
                <img src="/logo.png" alt="Jalmitra" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <h1 className="font-display text-lg sm:text-xl font-bold text-white leading-tight tracking-tight truncate">
                  {t('pages.visualization.title')}
                </h1>
                <p className="text-[11px] text-white/70 truncate hidden sm:block">{t('pages.visualization.subtitle')}</p>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition ${
                showFilters ? 'bg-white text-brand-700' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Filter size={14} />
              <span className="hidden sm:inline">Filters</span>
            </button>
            <button
              onClick={generateVisualization}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-white/10 hover:bg-white/20 text-white transition disabled:opacity-50"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            {chartData && (
              <button
                onClick={downloadChart}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition"
              >
                <Download size={14} />
                <span className="hidden sm:inline">Export</span>
              </button>
            )}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white">
              <StatusIndicator className="text-white" />
            </div>
          </div>
        </div>
        {/* Subtle flowing border accent, matching the landing page's section dividers */}
        <WaveDivider
          position="bottom"
          fillClassName="fill-ink-50 dark:fill-ink-950"
          duration={26}
          className="!h-3 opacity-60"
        />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Filters */}
        {showFilters && (
          <div className="w-80 bg-white dark:bg-ink-900 border-r border-ink-100 dark:border-ink-800 flex flex-col shrink-0">
            <div className="p-6 space-y-6 overflow-y-auto scrollbar-thin">
              {/* Chart Type Selection */}
              <div>
                <label className="block text-sm font-medium text-ink-900 dark:text-ink-100 mb-3">Chart Type</label>
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
                        className={`w-full p-3 rounded-xl border text-left transition ${
                          selected
                            ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-900 dark:text-brand-300'
                            : compatible
                            ? 'border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 hover:border-brand-300 dark:hover:border-brand-600 hover:bg-ink-50 dark:hover:bg-ink-700'
                            : 'border-ink-100 dark:border-ink-800 bg-ink-50 dark:bg-ink-800/50 text-ink-400 dark:text-ink-600 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className="w-5 h-5 shrink-0" />
                          <span className="font-medium text-sm">{type.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comparison Type */}
              <div>
                <label className="block text-sm font-medium text-ink-900 dark:text-ink-100 mb-3">Comparison Type</label>
                <select
                  value={comparisonType}
                  onChange={(e) => handleComparisonTypeChange(e.target.value)}
                  className="w-full p-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-800 dark:text-ink-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
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
                <label className="block text-sm font-medium text-ink-900 dark:text-ink-100 mb-3">Metrics</label>
                <div className="space-y-2">
                  {metrics.map((metric) => (
                    <label key={metric.id} className="flex items-center gap-3 cursor-pointer">
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
                        className="rounded border-ink-300 dark:border-ink-600 text-brand-600 focus:ring-brand-500"
                      />
                      <div className="flex-1">
                        <span className="text-ink-900 dark:text-ink-100 font-medium text-sm">{metric.label}</span>
                        <span className="text-ink-500 dark:text-ink-400 text-xs ml-1">({metric.unit})</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Dynamic filters based on comparison type */}
              {comparisonType === 'state' && (
                <div>
                  <label className="block text-sm font-medium text-ink-900 dark:text-ink-100 mb-3">States</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin border border-ink-200 dark:border-ink-700 rounded-xl p-3">
                    {getAvailableStates().map((state) => (
                      <label key={state} className="flex items-center gap-2 cursor-pointer">
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
                          className="rounded border-ink-300 dark:border-ink-600 text-brand-600 focus:ring-brand-500"
                        />
                        <span className="text-ink-700 dark:text-ink-300 text-sm">{state}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {comparisonType === 'district' && (
                <div>
                  <label className="block text-sm font-medium text-ink-900 dark:text-ink-100 mb-3">Districts (Kerala)</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin border border-ink-200 dark:border-ink-700 rounded-xl p-3">
                    {getAvailableDistricts().map((district) => (
                      <label key={district} className="flex items-center gap-2 cursor-pointer">
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
                          className="rounded border-ink-300 dark:border-ink-600 text-brand-600 focus:ring-brand-500"
                        />
                        <span className="text-ink-700 dark:text-ink-300 text-sm">{district}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {comparisonType === 'yearly' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ink-900 dark:text-ink-100 mb-3">Years</label>
                    <div className="space-y-2">
                      {availableYears.map((yr) => (
                        <label key={yr} className="flex items-center gap-2 cursor-pointer">
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
                            className="rounded border-ink-300 dark:border-ink-600 text-brand-600 focus:ring-brand-500"
                          />
                          <span className="text-ink-700 dark:text-ink-300 text-sm">{yr}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-900 dark:text-ink-100 mb-2">Entity</label>
                    <select
                      value={selectedEntity}
                      onChange={(e) => setSelectedEntity(e.target.value)}
                      className="w-full p-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-800 dark:text-ink-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
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
                  <label className="block text-sm font-medium text-ink-900 dark:text-ink-100 mb-2">Entity</label>
                  <select
                    value={selectedEntity}
                    onChange={(e) => setSelectedEntity(e.target.value)}
                    className="w-full p-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-800 dark:text-ink-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
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
                  <label className="block text-sm font-medium text-ink-900 dark:text-ink-100 mb-2">Year</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    className="w-full p-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-800 dark:text-ink-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {availableYears.map((yr) => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Chart Area */}
        <div className="flex-1 flex flex-col overflow-auto scrollbar-thin">
          <div className="flex-1 p-6">
            <div className="bg-white dark:bg-ink-900 rounded-2xl shadow-soft border border-ink-100 dark:border-ink-800 h-full flex flex-col">
              {isLoading && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-ink-600 dark:text-ink-300 font-medium">Fetching data from server...</p>
                    <p className="text-ink-400 dark:text-ink-500 text-sm mt-1">Generating visualization...</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center max-w-md px-4">
                    <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-ink-900 dark:text-white mb-2">Visualization Error</h3>
                    <p className="text-ink-600 dark:text-ink-300 mb-4 text-sm">{error}</p>
                    <div className="space-y-2">
                      <button
                        onClick={generateVisualization}
                        className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-semibold transition-colors"
                      >
                        Retry
                      </button>
                      <p className="text-xs text-ink-400 dark:text-ink-500">
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
                    <BarChart3 className="w-20 h-20 text-ink-300 dark:text-ink-700 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-ink-900 dark:text-white mb-2">Ready to Visualize</h3>
                    <p className="text-ink-500 dark:text-ink-400">Configure your parameters and click refresh to fetch real data</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chart Info Panel */}
          {chartData && (
            <div className="px-6 pb-6">
              <div className="bg-white dark:bg-ink-900 rounded-2xl shadow-soft border border-ink-100 dark:border-ink-800 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-ink-900 dark:text-white">Analysis Summary</h3>
                  <div className="flex items-center gap-2 text-sm text-ink-500 dark:text-ink-400">
                    <Zap className="w-4 h-4" />
                    <span>Processed in {chartData.processing_time}s</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl">
                    <div className="text-xs font-medium text-brand-700 dark:text-brand-400 uppercase mb-1">Chart Type</div>
                    <div className="text-brand-900 dark:text-brand-200 font-semibold capitalize">{chartType}</div>
                  </div>
                  <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                    <div className="text-xs font-medium text-emerald-700 dark:text-emerald-400 uppercase mb-1">Comparison</div>
                    <div className="text-emerald-900 dark:text-emerald-200 font-semibold capitalize">{comparisonType}</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <div className="text-xs font-medium text-purple-700 dark:text-purple-400 uppercase mb-1">Metrics</div>
                    <div className="text-purple-900 dark:text-purple-200 font-semibold">{selectedMetrics.length}</div>
                  </div>
                  <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                    <div className="text-xs font-medium text-amber-700 dark:text-amber-400 uppercase mb-1">Data Points</div>
                    <div className="text-amber-900 dark:text-amber-200 font-semibold">{chartData.metadata?.data_points || 0}</div>
                  </div>
                </div>

                {/* Query Info */}
                {chartData.metadata?.query_used && (
                  <div className="mt-4 p-3 bg-ink-50 dark:bg-ink-800/60 rounded-xl">
                    <details className="cursor-pointer">
                      <summary className="text-sm font-medium text-ink-700 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white">
                        Database Query Used
                      </summary>
                      <pre className="mt-2 text-xs text-ink-600 dark:text-ink-300 bg-white dark:bg-ink-900 p-2 rounded-lg border border-ink-100 dark:border-ink-700 overflow-x-auto">
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
