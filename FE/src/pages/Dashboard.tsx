import React from "react";
import api from "../services/api";

interface DashboardState {
  totalContainers: number;
  inTransit: number;
  pending: number;
  revenue: number;
}

class Dashboard extends React.Component<{}, DashboardState> {
  state: DashboardState = {
    totalContainers: 0,
    inTransit: 0,
    pending: 0,
    revenue: 0
  };

  componentDidMount() {
    this.fetchStats();
  }

  fetchStats = async () => {
    try {
      const [containersRes, financeRes] = await Promise.all([
        api.get('/containers'),
        api.get('/finance')
      ]);

      const containers = containersRes.data.data || [];
      const finances = financeRes.data.data || [];

      const inTransit = containers.filter((c: any) => c.Status === 'in_transit').length;
      const pending = containers.filter((c: any) => c.Status === 'empty').length;
      const totalRevenue = finances.reduce((sum: number, f: any) => sum + (f.Total || 0), 0);

      this.setState({
        totalContainers: containers.length,
        inTransit,
        pending,
        revenue: totalRevenue
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  render() {
    const { totalContainers, inTransit, pending, revenue } = this.state;

    return (
      <div>
        <h2>Tổng quan</h2>
        <div className="top-stats">
          <div className="stat">
            <div className="stat-title small">Tổng số Container</div>
            <div className="stat-value number">{totalContainers}</div>
          </div>
          <div className="stat">
            <div className="stat-title small">Đang vận chuyển</div>
            <div className="stat-value number">{inTransit}</div>
          </div>
          <div className="stat">
            <div className="stat-title small">Chờ xử lý</div>
            <div className="stat-value number">{pending}</div>
          </div>
          <div className="stat">
            <div className="stat-title small">Doanh thu</div>
            <div className="stat-value number">{revenue.toLocaleString('vi-VN')} VNĐ</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
