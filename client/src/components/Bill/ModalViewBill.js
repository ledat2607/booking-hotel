import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import Bill from './Bill';
import StripePaymentModal from './StripePaymentModal';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

function ModalViewBill({ show, setShow, dataBill }) {
    const user = useSelector((state) => state.auth.user);
    console.log(user);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const handleClose = () => setShow(false);

    const handlePayment = () => {
        setShowPaymentModal(true);
    };

    const updateBillStatus = async (bookingId) => {
        try {
            const response = await axios.put('http://localhost:5000/api/booking/update-bill-status', {
                bookingId: bookingId,
            });

            if (response.data.success) {
                toast.success('Thanh toán thành công');
            } else {
                toast.error('Thanh toán thất bại');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái hóa đơn:', error.response?.data || error.message);
        }
    };

    const handlePaymentSuccess = async () => {
        setShowPaymentModal(false);

        if (dataBill && dataBill._id) {
            await updateBillStatus(dataBill._id);
        } else {
            console.error('Invalid dataBill or billId not found');
        }
    };

    return (
        <>
            <Modal size="xl" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết Hóa đơn</Modal.Title>
                </Modal.Header>
                <Modal.Body>{dataBill ? <Bill billData={dataBill} /> : <p>Không có dữ liệu hóa đơn.</p>}</Modal.Body>
                <Modal.Footer>
                    {user.isAdmin === false ? (
                        <Button
                            className="opacity-50 cursor-not-allowed"
                            onClick={handlePayment}
                            disabled={dataBill.status === 'Paid'}
                        >
                            Thanh toán
                        </Button>
                    ) : (
                        ''
                    )}
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for Stripe Payment */}
            <StripePaymentModal
                show={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onSuccess={handlePaymentSuccess}
                amount={dataBill?.totalAmount || 0}
            />
        </>
    );
}

export default ModalViewBill;
