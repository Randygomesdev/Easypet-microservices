import { Component, effect, input, signal, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ApexGrid,
  ApexTheme,
  ApexFill,
  NgApexchartsModule
} from 'ng-apexcharts';
import { WeightRecordResponse } from '../../../models/weight.model';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
  grid: ApexGrid;
  theme: ApexTheme;
  fill: ApexFill;
};

@Component({
  selector: 'app-weight-chart',
  imports: [NgApexchartsModule],
  template: `
    <div class="bg-base-100 p-3 md:p-4 rounded-2xl border border-base-300 shadow-sm">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <h3 class="text-base font-bold text-base-content/70 flex items-center gap-2">
          <span class="text-primary text-xl">📈</span> Evolução de Peso
        </h3>
        <div class="badge badge-primary badge-outline badge-sm font-medium whitespace-nowrap">
          {{ weights().length }} registros
        </div>
      </div>
      
      <div id="chart" class="min-h-[220px]">
        @if (chartOptions()) {
          <apx-chart
            [series]="chartOptions()!.series"
            [chart]="chartOptions()!.chart"
            [xaxis]="chartOptions()!.xaxis"
            [stroke]="chartOptions()!.stroke"
            [dataLabels]="chartOptions()!.dataLabels"
            [tooltip]="chartOptions()!.tooltip"
            [grid]="chartOptions()!.grid"
            [fill]="chartOptions()!.fill"
          ></apx-chart>
        }
      </div>
    </div>
  `
})
export class WeightChartComponent {
  weights = input.required<WeightRecordResponse[]>();
  chartOptions = signal<ChartOptions | null>(null);

  constructor() {
    effect(() => {
      const data = this.weights();
      if (data && data.length > 0) {
        this.updateChart(data);
      }
    });
  }

  private updateChart(data: WeightRecordResponse[]) {
    // Inverte para mostrar da data mais antiga para a mais nova no gráfico
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const weightValues = sortedData.map(w => w.weight);
    const dateLabels = sortedData.map(w => {
        const d = new Date(w.date);
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    });

    this.chartOptions.set({
      series: [
        {
          name: "Peso",
          data: weightValues
        }
      ],
      chart: {
        height: 220,
        type: "area",
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: 'inherit'
      },
      dataLabels: { enabled: false },
      stroke: {
        curve: "smooth",
        width: 3,
        colors: ['#641ae6'] // Cor primária (roxo do DaisyUI)
      },
      xaxis: {
        categories: dateLabels,
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      tooltip: {
        y: {
          formatter: (val) => `${val.toLocaleString('pt-BR')} kg`
        }
      },
      grid: {
        borderColor: "#f1f1f1",
        strokeDashArray: 4,
        padding: { left: 10, right: 10 }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.45,
          opacityTo: 0.05,
          stops: [20, 100, 100, 100]
        }
      },
      theme: { mode: 'light' }
    });
  }
}
