import React from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Containers from "./pages/Containers";
import Partners from "./pages/Partners";

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
          {this.state.activeSection === "partners" && <Partners />}
        </main>
      </div>
    );
  }
}

export default App;