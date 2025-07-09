import { type PropsWithChildren } from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

import "ag-grid-community/styles/ag-theme-balham.css";

ModuleRegistry.registerModules([AllCommunityModule]);

const AppLayout = ({ children }: PropsWithChildren) => {
  return <div>{children}</div>;
};

export default AppLayout;
