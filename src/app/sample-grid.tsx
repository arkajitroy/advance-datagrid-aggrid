import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { colorSchemeDarkBlue, themeQuartz, type ColDef } from "ag-grid-community";

type Car = {
  make: string;
  model: string;
  price: number;
  electric: boolean;
};

const themeDarkBlue = themeQuartz.withPart(colorSchemeDarkBlue);

function SampleGrid() {
  const [rowData] = useState<Car[]>([
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    { make: "Mercedes", model: "EQA", price: 48890, electric: true },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
  ]);

  const [colDefs] = useState<ColDef<Car>[]>([
    { field: "make" },
    { field: "model" },
    { field: "price" },
    { field: "electric" },
  ]);

  const defaultColDef: ColDef = {
    flex: 1,
    sortable: true,
    filter: true,
  };

  return (
    <div style={{ height: "500px", width: "60%", boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
      <AgGridReact<Car>
        theme={themeDarkBlue}
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
      />
    </div>
  );
}

export default SampleGrid;
