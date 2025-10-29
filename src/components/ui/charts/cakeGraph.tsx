import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';

interface RouteData {
  lugar_origen: string;
  lugar_destino: string;
  total_venta: number | null;
  total_pedidos: number;
}

interface RoutesPieChartProps {
  data: RouteData[];
  className?: string;
}

const CakeChart: React.FC<RoutesPieChartProps> = ({ data, className = '' }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    const chart = echarts.init(chartRef.current);

    const chartData = data
      .filter(route => route.total_venta !== null && route.total_venta > 0)
      .map((route, index) => ({
        name: `${route.lugar_origen} → ${route.lugar_destino}`,
        value: route.total_venta || 0,
        pedidos: route.total_pedidos,
        itemStyle: {
          color: [
            '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444',
            '#f97316', '#06b6d4', '#84cc16', '#ec4899', '#6366f1'
          ][index]
        }
      }));

    const option = {
      title: {
        text: '📊 Mejores Rutas',
        left: 'center',
        textStyle: {
          color: '#1f2937',
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const percent = params.percent;
          return `
            <div style="padding: 8px;">
              <strong>${params.name}</strong><br/>
              💰 $${params.value.toLocaleString()}<br/>
              📦 ${params.data.pedidos} pedidos<br/>
              📈 ${percent}% del total
            </div>
          `;
        }
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: 'center',
        textStyle: {
          color: '#6b7280'
        },
        pageTextStyle: {
          color: '#374151'
        }
      },
      series: [
        {
          name: 'Ventas',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['40%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 18,
              fontWeight: 'bold',
              formatter: '{b}\n{c}'
            }
          },
          labelLine: {
            show: false
          },
          data: chartData
        }
      ],
      animation: true,
      animationDuration: 1000
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className={`bg-white p-6 ${className}`}>
        <div className="text-center text-gray-500 py-8">
          <div className="text-4xl mb-2">📊</div>
          <p>No hay datos de rutas disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`shadow-sm mt-5 ${className}`}>
      <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
    </div>
  );
};

export default CakeChart;