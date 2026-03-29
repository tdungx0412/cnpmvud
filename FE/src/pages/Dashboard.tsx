import React from "react";

class Dashboard extends React.Component {
  render() {
    return (
      <div>
        <h2>Tổng quan</h2>
        <div className="top-stats">
          <div className="stat">
            <div className="stat-title small">Tổng số Container</div>
            <div className="stat-value number">8</div>
          </div>
          <div className="stat">
            <div className="stat-title small">Đang vận chuyển</div>
            <div className="stat-value number">2</div>
          </div>
          <div className="stat">
            <div className="stat-title small">Chờ xử lý</div>
            <div className="stat-value number">3</div>
          </div>
          <div className="stat">
            <div className="stat-title small">Doanh thu</div>
            <div className="stat-value number">141.580.000 VNĐ</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;