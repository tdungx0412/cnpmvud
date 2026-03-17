import React from "react";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Containers from "./pages/Containers";
import Cargo from "./pages/Cargo";
import Transport from "./pages/Transport";
import Finance from "./pages/Finance";


class App extends React.Component {
  state = {
    activeSection: "dashboard"
  };

  changeSection = (section: string) => {
    this.setState({ activeSection: section });
  };

  render() {
    return (
      <div className="app">
        <div className="main-layout">
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
          </main>
        </div>
      </div>
    );
  }
}

export default App;