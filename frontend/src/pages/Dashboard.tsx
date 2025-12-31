import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Activity,
  Globe,
  Lock,
  TrendingUp
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

const COLORS = ['#00f2ff', '#ff003c', '#bc00ff', '#fdf500'];

interface ChartData {
  name: string;
  threats: number;
  [key: string]: any;
}

interface FeedItem {
  id: number;
  type: string;
  ip: string;
  time: string;
  severity: string;
  color: string;
}

interface PieData {
  name: string;
  value: number;
  [key: string]: any;
}

interface SeverityData {
  name: string;
  value: number;
  fill: string;
  [key: string]: any;
}

// Animation Component for Numbers
const Counter = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <>{count.toLocaleString()}</>;
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  trend?: number;
}

const StatCard = ({ title, value, icon: Icon, color, trend }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-morphism p-6 rounded-2xl border-l-4"
    style={{ borderLeftColor: color }}
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl bg-opacity-10`} style={{ backgroundColor: color }}>
        <Icon size={24} style={{ color }} />
      </div>
      {trend && (
        <span className={`text-xs font-mono ${trend > 0 ? 'text-cyber-green' : 'text-cyber-red'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div className="text-gray-400 text-sm mb-1">{title}</div>
    <div className="text-2xl font-bold font-mono tracking-tight">
      <Counter value={value} />
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    global_threats: 842931,
    active_attacks: 142,
    threats_blocked: 762102,
    networks_secured: 48
  });

  const [chartData, setChartData] = useState<ChartData[]>([
    { name: '00:00', threats: 400 },
    { name: '04:00', threats: 300 },
    { name: '08:00', threats: 600 },
    { name: '12:00', threats: 800 },
    { name: '16:00', threats: 500 },
    { name: '20:00', threats: 900 },
    { name: '23:59', threats: 700 },
  ]);

  const [pieData, setPieData] = useState<PieData[]>([
    { name: 'DDoS', value: 400 },
    { name: 'Malware', value: 300 },
    { name: 'Phishing', value: 300 },
    { name: 'SQLi', value: 200 },
  ]);

  const [feedItems, setFeedItems] = useState<FeedItem[]>([
    { id: 1, type: 'DDoS', ip: '192.168.1.101', time: '12:42:05', severity: 'CRITICAL', color: 'cyber-red' },
    { id: 2, type: 'SQL Injection', ip: '192.168.1.102', time: '12:42:15', severity: 'WARNING', color: 'cyber-yellow' },
    { id: 3, type: 'Malware', ip: '10.0.0.55', time: '12:42:30', severity: 'CRITICAL', color: 'cyber-red' },
  ]);

  const [severityData, setSeverityData] = useState<SeverityData[]>([
    { name: 'Critical', value: 45, fill: '#ff003c' },
    { name: 'High', value: 80, fill: '#ff7b00' },
    { name: 'Medium', value: 120, fill: '#fdf500' },
    { name: 'Low', value: 250, fill: '#00ff9f' },
  ]);

  useEffect(() => {
    // Stat Updates
    const statInterval = setInterval(() => {
      setStats(prev => ({
        global_threats: prev.global_threats + Math.floor(Math.random() * 10),
        active_attacks: Math.max(0, prev.active_attacks + Math.floor(Math.random() * 5 - 2)),
        threats_blocked: prev.threats_blocked + Math.floor(Math.random() * 8),
        networks_secured: prev.networks_secured
      }));
    }, 3000);

    // Timeline Chart Animations
    const chartInterval = setInterval(() => {
      setChartData(prev => prev.map(item => ({
        ...item,
        threats: Math.max(100, item.threats + Math.floor(Math.random() * 100 - 50))
      })));
    }, 2000);

    // Pie Chart Animations
    const pieInterval = setInterval(() => {
      setPieData(prev => prev.map(item => ({
        ...item,
        value: Math.max(50, item.value + Math.floor(Math.random() * 50 - 25))
      })));
    }, 4000);

    // Live Feed Updates
    const feedInterval = setInterval(() => {
      const attackTypes = ['DDoS', 'SQL Injection', 'XSS', 'Brute Force', 'Malware'];
      const severities = ['CRITICAL', 'WARNING', 'HIGH'];
      const newType = attackTypes[Math.floor(Math.random() * attackTypes.length)];
      const newSev = severities[Math.floor(Math.random() * severities.length)];
      const newItem = {
        id: Date.now(),
        type: newType,
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        time: new Date().toLocaleTimeString(),
        severity: newSev,
        color: newSev === 'CRITICAL' ? 'cyber-red' : newSev === 'HIGH' ? 'cyber-orange' : 'cyber-yellow'
      };
      setFeedItems(prev => [newItem, ...prev].slice(0, 10)); // Keep last 10
    }, 2500);

    // Severity Bar Chart Update
    const severityInterval = setInterval(() => {
      setSeverityData(prev => prev.map(item => ({
        ...item,
        value: Math.max(10, item.value + Math.floor(Math.random() * 20 - 10))
      })));
    }, 3000);

    return () => {
      clearInterval(statInterval);
      clearInterval(chartInterval);
      clearInterval(pieInterval);
      clearInterval(feedInterval);
      clearInterval(severityInterval);
    };
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tighter uppercase">Operations Dashboard</h1>
          <p className="text-gray-400">Real-time global threat intelligence monitor</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-cyber-blue font-mono mb-1">SYSTEM TIME</div>
          <div className="text-xl font-mono text-white">{new Date().toLocaleTimeString()}</div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Global Threats" value={stats.global_threats} icon={Globe} color="#00f2ff" trend={12.5} />
        <StatCard title="Active Attacks" value={stats.active_attacks} icon={Activity} color="#ff003c" trend={-4.2} />
        <StatCard title="Threats Blocked" value={stats.threats_blocked} icon={Shield} color="#00ff9f" trend={8.1} />
        <StatCard title="Networks Secured" value={stats.networks_secured} icon={Lock} color="#bc00ff" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-morphism p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <TrendingUp size={20} className="text-cyber-blue" />
              Threat Timeline (24h)
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="name" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0a0a0b', border: '1px solid #333', borderRadius: '12px' }}
                  itemStyle={{ color: '#00f2ff' }}
                />
                <Line type="monotone" dataKey="threats" stroke="#00f2ff" strokeWidth={3} dot={{ r: 4, fill: '#00f2ff' }} activeDot={{ r: 8 }} isAnimationActive={true} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="glass-morphism p-6 rounded-3xl">
          <h3 className="text-lg font-semibold text-white mb-6">Attack Type Distribution</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0a0a0b', border: '1px solid #333', borderRadius: '12px' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Live Feed */}
        <div className="glass-morphism rounded-3xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white border-opacity-5 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Live Activity Feed</h3>
            <span className="px-3 py-1 bg-cyber-red/20 text-cyber-red text-xs rounded-full animate-pulse border border-cyber-red/50 font-bold font-mono tracking-wider shadow-[0_0_10px_rgba(255,0,60,0.3)]">LIVE MONITORING</span>
          </div>
          <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto scrollbar-hide">
            <AnimatePresence initial={false}>
              {feedItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ x: -20, opacity: 0, height: 0 }}
                  animate={{ x: 0, opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-white/20 transition-all cursor-default"
                >
                  <div className={`w-2 h-2 rounded-full ${item.severity === 'CRITICAL' ? 'bg-cyber-red shadow-[0_0_8px_#ff003c]' : 'bg-cyber-yellow shadow-[0_0_8px_#fdf500]'}`}></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white mb-1">Potential {item.type} detected</div>
                    <div className="text-xs text-gray-400 font-mono uppercase tracking-tight">SOURCE: {item.ip} | TARGET: EXTERNAL GATEWAY</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono text-gray-400">{item.time}</div>
                    <div className={`text-[10px] font-bold uppercase ${item.severity === 'CRITICAL' ? 'text-cyber-red' : 'text-cyber-yellow'}`}>
                      {item.severity}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Severity Bar Chart */}
        <div className="glass-morphism p-6 rounded-3xl">
          <h3 className="text-lg font-semibold text-white mb-6">Attack Severity Levels</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="name" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#0a0a0b', border: '1px solid #333', borderRadius: '12px' }}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} isAnimationActive={true} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
