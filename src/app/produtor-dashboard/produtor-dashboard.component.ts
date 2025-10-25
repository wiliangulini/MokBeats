import { Component } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexPlotOptions,
  ApexResponsive,
  ApexStroke,
  ApexTheme,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis
} from 'ng-apexcharts';

type HeatmapOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  colors: string[];
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  tooltip: ApexTooltip;
};

type BarOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  fill: ApexFill;
  colors: string[];
  tooltip: ApexTooltip;
  grid: ApexGrid;
  responsive: ApexResponsive[];
};

type ColumnOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  fill: ApexFill;
  colors: string[];
  grid: ApexGrid;
  tooltip: ApexTooltip;
};

type LineOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  fill: ApexFill;
  markers: ApexMarkers;
  grid: ApexGrid;
  colors: string[];
  tooltip: ApexTooltip;
  theme: ApexTheme;
};

interface DashboardCard {
  label: string;
  value: string;
  icon: string;
  helper: string;
  trend: string;
  trendPositive: boolean;
}

interface TrackRow {
  title: string;
  purchases: number;
  revenue: string;
  mainOrigin: string;
  likes: number;
}

@Component({
  selector: 'app-produtor-dashboard',
  templateUrl: './produtor-dashboard.component.html',
  styleUrls: ['./produtor-dashboard.component.scss']
})
export class ProdutorDashboardComponent {
  readonly greeting = 'Olá, Produtor!';
  readonly reportDate = new Date();

  activeRange: '7d' | '30d' | '12m' = '30d';

  readonly cards: DashboardCard[] = [
    {
      label: 'Vendas totais',
      value: '8.542',
      icon: 'assets/icons/shopping-bag.svg',
      helper: 'Comparado ao último mês',
      trend: '+12%',
      trendPositive: true
    },
    {
      label: 'Valor total em vendas',
      value: 'R$ 126.340,00',
      icon: 'assets/icons/money-stack.svg',
      helper: 'Desde o início do mês',
      trend: '+9%',
      trendPositive: true
    },
    {
      label: 'Curtidas acumuladas',
      value: '22.481',
      icon: 'assets/icons/heart-pulse.svg',
      helper: 'Interações nas principais plataformas',
      trend: '+8%',
      trendPositive: true
    },
    {
      label: 'Ticket médio',
      value: 'R$ 14,80',
      icon: 'assets/icons/ticket-average.svg',
      helper: 'Valor médio por compra',
      trend: '-2%',
      trendPositive: false
    }
  ];

  readonly originBreakdown = [
    { region: 'Brasil', percentage: 38, total: '3.250', platform: 'Spotify' },
    { region: 'Estados Unidos', percentage: 24, total: '2.010', platform: 'Apple Music' },
    { region: 'Reino Unido', percentage: 18, total: '1.520', platform: 'Beatport' },
    { region: 'Alemanha', percentage: 12, total: '980', platform: 'YouTube Music' }
  ];

  readonly tracks: TrackRow[] = [
    { title: 'Aurora Skyline', purchases: 934, revenue: 'R$ 18.640,00', mainOrigin: 'Spotify', likes: 2401 },
    { title: 'Neon Boulevard', purchases: 812, revenue: 'R$ 15.980,00', mainOrigin: 'Apple Music', likes: 1987 },
    { title: 'Eclipse Lofi', purchases: 678, revenue: 'R$ 11.420,00', mainOrigin: 'YouTube Music', likes: 1644 },
    { title: 'Sunset Drive', purchases: 542, revenue: 'R$ 9.870,00', mainOrigin: 'Beatport', likes: 1208 },
    { title: 'Nightcall Deluxe', purchases: 418, revenue: 'R$ 8.310,00', mainOrigin: 'Spotify', likes: 972 }
  ];

  readonly heatmapOptions: HeatmapOptions = {
    series: [
      {
        name: 'Brasil',
        data: [45, 38, 22, 18]
      },
      {
        name: 'Estados Unidos',
        data: [33, 28, 24, 19]
      },
      {
        name: 'Reino Unido',
        data: [28, 24, 18, 12]
      },
      {
        name: 'Alemanha',
        data: [24, 20, 16, 9]
      }
    ],
    chart: {
      type: 'heatmap',
      toolbar: { show: false },
      height: 320
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#0f172a'],
        fontSize: '12px',
        fontWeight: 600
      }
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.45,
        radius: 12,
        useFillColorAsStroke: true,
        colorScale: {
          ranges: [
            { from: 0, to: 15, color: '#a855f7' },
            { from: 16, to: 30, color: '#7c3aed' },
            { from: 31, to: 45, color: '#5b21b6' }
          ]
        }
      }
    },
    colors: ['#7c3aed'],
    xaxis: {
      categories: ['Spotify', 'Apple Music', 'Beatport', 'YouTube Music'],
      labels: {
        style: {
          colors: '#e0e7ff',
          fontWeight: 500
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#e0e7ff',
          fontWeight: 500
        }
      }
    },
    grid: {
      borderColor: 'rgba(148, 163, 184, 0.15)'
    },
    tooltip: {
      theme: 'dark'
    }
  };

  readonly genreOptions: BarOptions = {
    series: [
      {
        name: 'Esta semana',
        data: [42, 36, 28, 24, 18]
      },
      {
        name: 'Mês atual',
        data: [78, 64, 52, 41, 27]
      }
    ],
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: { show: false },
      height: 320
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 12,
        barHeight: '55%'
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 1,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Trap', 'Lo-fi', 'Drill', 'EDM', 'Afrobeat'],
      labels: {
        style: {
          colors: '#cbd5f5'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#e0e7ff',
          fontWeight: 500
        }
      }
    },
    legend: {
      labels: {
        colors: '#e0e7ff'
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        type: 'horizontal',
        opacityFrom: 0.95,
        opacityTo: 0.8,
        stops: [0, 50, 100]
      }
    },
    colors: ['#7C3AED', '#14B8A6'],
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val: number) => `${val} vendas`
      }
    },
    grid: {
      borderColor: 'rgba(148, 163, 184, 0.15)'
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '55%'
            }
          }
        }
      }
    ]
  };

  readonly revenueOptions: ColumnOptions = {
    series: [
      {
        name: 'Receita',
        data: [18640, 15980, 11420, 9870, 8310]
      }
    ],
    chart: {
      type: 'bar',
      toolbar: { show: false },
      height: 320
    },
    plotOptions: {
      bar: {
        columnWidth: '40%',
        borderRadius: 14
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: ['Aurora Skyline', 'Neon Boulevard', 'Eclipse Lofi', 'Sunset Drive', 'Nightcall Deluxe'],
      labels: {
        rotate: -20,
        style: {
          colors: '#cbd5f5',
          fontWeight: 500
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#e0e7ff'
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        gradientToColors: ['#14B8A6'],
        stops: [0, 100]
      }
    },
    colors: ['#7C3AED'],
    grid: {
      borderColor: 'rgba(148, 163, 184, 0.15)'
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
      }
    }
  };

  readonly engagementOptions: LineOptions = {
    series: [
      {
        name: 'Curtidas',
        data: [210, 260, 320, 420, 460, 540, 620, 680, 750, 820, 870, 920]
      },
      {
        name: 'Compras',
        data: [120, 150, 200, 240, 300, 360, 420, 460, 510, 580, 640, 700]
      }
    ],
    chart: {
      type: 'line',
      toolbar: { show: false },
      height: 320
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: [4, 4]
    },
    xaxis: {
      categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      labels: {
        style: {
          colors: '#cbd5f5'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#e0e7ff'
        }
      }
    },
    legend: {
      labels: {
        colors: '#e0e7ff'
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 80, 100]
      }
    },
    markers: {
      size: 6,
      colors: ['#7C3AED', '#14B8A6'],
      strokeColors: '#1e1e2a',
      strokeWidth: 3
    },
    grid: {
      borderColor: 'rgba(148, 163, 184, 0.15)'
    },
    colors: ['#F472B6', '#14B8A6'],
    tooltip: {
      theme: 'dark'
    },
    theme: {
      mode: 'dark'
    }
  };

  setRange(range: '7d' | '30d' | '12m'): void {
    this.activeRange = range;
  }
}
