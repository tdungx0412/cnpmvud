import React from "react";

interface Props {
  activeSection: string;
  onChange: (section: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
}

const menuItems: MenuItem[] = [
  { id: "dashboard", label: "Tổng quan" },
  { id: "containers", label: "Quản lý Container" },
  { id: "partners", label: "Khách hàng & Đối tác" },
];

class Sidebar extends React.Component<Props> {
  render() {
    return (
      <aside className="sidebar">
        <div className="brand">🚛 Container Logistics</div>
        <nav className="nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-button ${this.props.activeSection === item.id ? "active" : ""}`}
              onClick={() => this.props.onChange(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    );
  }
}

export default Sidebar;