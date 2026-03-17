import React from "react";

class Dashboard extends React.Component {
  render() {
    return (
      <div>
        <h2>Tổng quan</h2>
        <div className="grid">
          <div className="card top-stats">
            <div className="stat">
              <div className="small">Tổng số Container</div>
              <div className="number">0</div>
            </div>
            <div className="stat">  
              <div className="small">Đang vận chuyển</div>
              <div className="number">0</div>
            </div>
            <div className="stat">
              <div className="small">Chờ xử lý</div>
              <div className="number">0</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;