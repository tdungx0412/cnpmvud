import React from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Containers from "./pages/Containers";
import Cargo from "./pages/Cargo";
import Transport from "./pages/Transport";
import Finance from "./pages/Finance";
import Contracts from "./pages/Contracts";
import Invoices from "./pages/Invoices";
import Partners from "./pages/Partners";
import Staff from "./pages/Staff";

interface AppState {
  activeSection: string;
}

class App extends React.Component<{}, AppState> {
  state: AppState = {
    activeSection: "dashboard"
  };

  changeSection = (section: string) => {
    this.setState({ activeSection: section });
  };

  render() {
    return (
      <div className="app">
        <Sidebar
          activeSection={this.state.activeSection}
          onChange={this.changeSection}
        />
        <main className="content">
          {this.state.activeSection === "dashboard" && <Dashboard />}
          {this.state.activeSection === "containers" && <Containers />}
          {this.state.activeSection === "cargo" && <Cargo />}
          {this.state.activeSection === "transport" && <Transport />}
          {this.state.activeSection === "finance" && <Finance />}
          {this.state.activeSection === "contracts" && <Contracts />}
          {this.state.activeSection === "invoices" && <Invoices />}
          {this.state.activeSection === "partners" && <Partners />}
          {this.state.activeSection === "staff" && <Staff />}
        </main>
      </div>
    );
  }
}

export default App;