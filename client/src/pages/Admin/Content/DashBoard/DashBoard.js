import { useState } from 'react';

import DateRangePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { createReportByMonthYear, getAllRoomTypes } from '../../../../services/apiServices';
import './DashBoard.scss';

function DashBoard() {
    const [dataReport, setDataReport] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);

    const fetchReportByMonthYear = async ({ month, year }) => {
        setIsLoading(true);
        try {
            // Fetch báo cáo doanh thu
            const res = await createReportByMonthYear({ month, year });
            const typeRes = await getAllRoomTypes();

            if (res?.data?.success && typeRes?.data?.success) {
                const reportData = res.data.data;
                const roomTypes = typeRes.data.data;

                // Gắn tên loại phòng vào báo cáo doanh thu
                const reportByRoomType = reportData.reportByRoomType.map((item) => {
                    const roomType = roomTypes.find((type) => type._id === item.roomType);
                    return {
                        ...item,
                        roomTypeName: roomType?.typeOfRooms || 'Unknown',
                    };
                });

                setDataReport(reportByRoomType);
            }
        } catch (error) {
            console.error('Error fetching report:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateReport = () => {
        const month = startDate.getUTCMonth() + 1; // Lấy tháng
        const year = startDate.getUTCFullYear(); // Lấy năm
        fetchReportByMonthYear({ month, year });
    };

    return (
        <div className="admin-dashboard-container">
            <div className="admin-dashboard-content mt-4">
                <h3 className="mb-3">Thống kê doanh thu theo loại phòng</h3>

                <div className="revenue-month-picker">
                    <label className="form-label">Chọn tháng:</label>
                    <DateRangePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                    />
                </div>
                <button className="btn btn-primary mt-3" onClick={handleCreateReport} disabled={isLoading}>
                    {isLoading ? 'Đang xử lý...' : 'Thống kê'}
                </button>

                <hr />
                <div>
                    {!isLoading && dataReport.length > 0 && (
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Loại phòng</th>
                                    <th>Số lượt thuê</th>
                                    <th>Doanh thu</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataReport.map((item) => (
                                    <tr key={item.roomType}>
                                        <td>{item.roomTypeName}</td>
                                        <td>{item.totalRentals}</td>
                                        <td>{item.totalRevenue.toLocaleString()} VND</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {isLoading && <p>Đang tải dữ liệu...</p>}
                </div>
            </div>
        </div>
    );
}

export default DashBoard;
