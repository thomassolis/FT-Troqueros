import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

type EChartsOption = echarts.EChartsOption;

interface BarChartProps {
  data?: number[];
  labels?: string[];
  title?: string;
  height?: number | string;
  width?: number | string;
  graphData?:[{
    peticiones: number,
    nombreDeCliente: string,
  }]
}

const BarChart: React.FC<BarChartProps> = ({
  graphData,
  data = graphData?.map(x => x.peticiones),
  labels = graphData?.map(x => x.nombreDeCliente),
  height = 400,
  width = '100%'
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);  
  useEffect(() => {
    if (chartRef.current) {
      // Inicializar el gráfico
      chartInstance.current = echarts.init(chartRef.current);
      
      const option: EChartsOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: labels,
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              rotate: 45,  // Esto rota las etiquetas 45 grados
              interval: 0,  // Asegura que no se omitan etiquetas, incluso si son largas
              margin: 10, // Ajusta el espacio entre las etiquetas y el eje X
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Movimientos',
            type: 'bar',
            barWidth: '60%',
            data: data
          }
        ]
      };


      chartInstance.current.setOption(option);
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, [data, labels]);

  // Redimensionar el gráfico cuando cambie el tamaño del contenedor
  useEffect(() => {
    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div 
      ref={chartRef} 
      style={{ 
        height: typeof height === 'number' ? `${height}px` : height,
        width: typeof width === 'number' ? `${width}px` : width
      }} 
    />
  );
};

export default BarChart;