declare module "react-plotly.js" {
    import { Component } from "react";
    import Plotly from "plotly.js";
  
    export interface PlotParams {
      data: Partial<Plotly.PlotData>[];
      layout?: Partial<Plotly.Layout>;
      config?: Partial<Plotly.Config>;
      style?: React.CSSProperties;
    }
  
    export default class Plot extends Component<PlotParams> {}
  }
  