import React from "react";
import "stockflux-components";
import Components from "stockflux-components";
import SecuritiesTable from "./components/SecuritiesTable";

import "./App.css";

export default () => {
  return (
    <div>
      <Components.Titlebar />
      <SecuritiesTable />
    </div>
  );
};
