export type SymbolDataItem = {
  date: Date;
  close: number;
  high: number;
  low: number;
  open: number;
  volume: number;
}


// export type IndicatorDataModel = {
//   indicator: string;
//   indicator_data: IndicatorModel[]
// }

// export type IndicatorDataMap = {
//   [key: string]: IndicatorDataModel
// }

// export type IndicatorDataMapModel = {
//   data_map: IndicatorDataMap
// }



// Define the IndicatorModel type
export type IndicatorModel = {
    date: number;                    // equivalent of int
    close: number;                   // equivalent of float
    high: number;                    // equivalent of float
    low: number;                     // equivalent of float
    open: number;                    // equivalent of float
    indicator: { [key: string]: number }; // equivalent of Dict[str, float]
    volume: number;                  // equivalent of int
};

// Define the IndicatorDataModel type
export type IndicatorDataModel = {
    indicator: string;               // equivalent of str
    indicator_data: IndicatorModel[]; // equivalent of List[IndicatorModel]
};

// Define the IndicatorDataMapModel type
export type IndicatorDataMapModel = {
    data_map: { [key: string]: IndicatorDataModel }; // equivalent of Dict[str, IndicatorDataModel]
};