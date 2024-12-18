import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; // Đảm bảo Chart.js được import

import { REACT_APP_BASE_URL } from '../../../../constant';
import './DashBoard.scss';

function Dashboard() {
    const [duLieuPhong, setDuLieuPhong] = useState([]);
    const [bookingDaThanhToan, setBookingDaThanhToan] = useState([]);
    const [phongDaThanhToan, setPhongDaThanhToan] = useState([]);
    const [topUsers, setTopUsers] = useState([]);

    // Lấy dữ liệu booking từ API
    useEffect(() => {
        axios
            .get(`${REACT_APP_BASE_URL}booking/all`)
            .then((res) => {
                const bookings = res.data.bookings;

                // Lọc các booking có trạng thái 'Paid'
                const daThanhToan = bookings.filter((booking) => booking.status === 'Paid');
                setBookingDaThanhToan(daThanhToan);
            })
            .catch((err) => console.log(err));
    }, []);

    // Lấy dữ liệu phòng từ API
    useEffect(() => {
        axios
            .get(`${REACT_APP_BASE_URL}rooms/all`)
            .then((res) => setDuLieuPhong(res.data.data))
            .catch((err) => console.log(err));
    }, []);

    // Lấy dữ liệu người dùng từ API và tính toán top 3 người dùng chi tiêu cao nhất
    useEffect(() => {
        axios
            .get(`${REACT_APP_BASE_URL}user/all`)
            .then((res) => {
                const users = res.data.users;

                // Giả sử mỗi booking có userId và số tiền đã thanh toán
                const userSpendings = users.map((user) => {
                    const totalSpent = bookingDaThanhToan
                        .filter((booking) => booking.user._id === user._id)
                        .reduce((sum, booking) => sum + parseInt(booking.totalAmount), 0);

                    return { ...user, totalSpent };
                });

                // Sắp xếp và lấy top 3 người dùng
                const sortedUsers = userSpendings.sort((a, b) => b.totalSpent - a.totalSpent);
                setTopUsers(sortedUsers.slice(0, 3));
            })
            .catch((err) => console.log(err));
    }, [bookingDaThanhToan]);

    // Kết nối dữ liệu phòng và booking đã thanh toán
    useEffect(() => {
        if (bookingDaThanhToan.length > 0 && duLieuPhong.length > 0) {
            const danhSachPhongDaThanhToan = duLieuPhong
                .filter((phong) => bookingDaThanhToan.some((booking) => booking.roomId === phong.id))
                .map((phong) => {
                    const tongDoanhThu = phong.price * (phong.currentBookings?.length || 0);
                    return { ...phong, tongDoanhThu };
                });

            setPhongDaThanhToan(danhSachPhongDaThanhToan);
        }
    }, [bookingDaThanhToan, duLieuPhong]);

    // Chuẩn bị dữ liệu cho biểu đồ
    const chartData = {
        labels: phongDaThanhToan.map((phong) => phong.roomNumber), // Lấy số phòng làm nhãn
        datasets: [
            {
                label: 'Tổng Doanh Thu (VND)',
                data: phongDaThanhToan.map((phong) => phong.tongDoanhThu), // Dữ liệu doanh thu cho mỗi phòng
                fill: false,
                borderColor: '#42A5F5', // Màu đường
                tension: 0.1,
                borderWidth: 2,
                pointBackgroundColor: '#42A5F5', // Màu điểm
            },
        ],
    };

    return (
        <div className="thong-ke-doanh-thu">
            <h2 className="title">Thống Kê Doanh Thu</h2>

            {/* Widget Top 3 Người Dùng */}
            <div className="top-users-widget">
                <h3>Top 3 Người Dùng Chi Tiêu Cao Nhất</h3>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Vị Trí</th>
                            <th>Tên Người Dùng</th>
                            <th>Email</th>
                            <th>Tổng Chi Tiêu (VND)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topUsers.map((user, index) => (
                            <tr key={user._id} className={`top-${index + 1}`}>
                                <td>{index + 1}</td>
                                <td>{user.Name}</td>
                                <td>{user.email}</td>
                                <td>{user.totalSpent.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Hiển thị bảng phòng */}
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Số Phòng</th>
                        <th>Loại Phòng</th>
                        <th>Giá (VND)</th>
                        <th>Số Lượt Đặt</th>
                        <th>Tổng Doanh Thu (VND)</th>
                    </tr>
                </thead>
                <tbody>
                    {phongDaThanhToan.map((phong) => (
                        <tr key={phong._id}>
                            <td>{phong.roomNumber}</td>
                            <td>{phong.type || 'Không xác định'}</td>
                            <td>{phong.price.toLocaleString()}</td>
                            <td>{phong.currentBookings.length}</td>
                            <td>{phong.tongDoanhThu.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Biểu đồ */}
            <div className="chart-container">
                <h3>Biểu Đồ Doanh Thu Các Phòng</h3>
                <Line data={chartData} />
            </div>
        </div>
    );
}

export default Dashboard;
