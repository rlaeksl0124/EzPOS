import React, {useEffect, useState} from "react";
import MenuList from "../Category/MenuList";
import "./orderDetail.css"; // CSS 파일 연결
import PaymentPage from "../Pay/PaymentPage";
import { useOrderDetail } from "../../hooks/useOrderDetail";
import QuantityInput from "./QuantityInput";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;


const OrderDetail = ({ orderNo, menus, tableNo, fetchOrder }) => {
    const {orderDetails, setOrderDetails, fetchOrderDetails, addOrderDetail, delOrderDetail} = useOrderDetail(); // 주문 상세 데이터

    const [isPaymentPage, setIsPaymentPage] = useState(false); // 결제 페이지 여부
    const [updatedQuantities, setUpdatedQuantities] = useState({});
    const navigate = useNavigate();

    const totalAmount = orderDetails.reduce((acc, item) => {
        const quantity = updatedQuantities[item.ordDetailNo] || item.quantity;
        return acc + quantity * item.unitPrice;
    },0);
    // 주문번호가 변경되면 주문상세 데이터 가져오기
    useEffect(() => {
        const loadData = async () => {
            if(!tableNo || !orderNo) return;
            try {
                await fetchOrder(tableNo); // 테이블 데이터 가져오기
                await fetchOrderDetails(orderNo); // 주문 상세 데이터 가져오기
            } catch (error) {
                console.error("데이터 가져오기 실패:", error);
            }
        };
    
        loadData();
        
    }, [orderNo, tableNo]);

    // 수량변경시 상태에 저장
    const quantityChange = (orderDetailNo, newQuantity) => {
        setUpdatedQuantities((prev) => ({
            ...prev,
            [orderDetailNo]: newQuantity,
        }));
    }

    

    const handleUpdateQuantity = async () => {
        try {
            const updatedOrderITems = orderDetails.map((detail) => ({
                menuId: detail.menuId,
                quantity: updatedQuantities[detail.ordDetailNo] ?? detail.quantity
            }))

            console.log("Before orderDetails=====",orderDetails)
            console.log("Before updatedQuantities====", updatedQuantities)

            await axios.post(`${BASE_URL}/order/${orderNo}/ordDetails`, updatedOrderITems);

            await fetchOrderDetails(orderNo);

            console.log("After updatedQuantities====", updatedQuantities)
            // 상태 초기화
            setUpdatedQuantities({});
            navigate(-1);
        } catch (error) {
            console.error("수량 업데이트 중 오류 발생:", error);
        }
    };


    const handlePaymentClick = () => {
        setIsPaymentPage(true); //결제페이지로 전환
        navigate("/pay", { state: { orderDetails, totalAmount } }); // 상태 전달
    };


    return (
        <div className="order-detail-container">
            {isPaymentPage ? (
                <PaymentPage totalAmount={totalAmount} orderDetails={orderDetails} />
            ) : (
                <>
                    {/* 좌측: 메뉴 리스트 */}
                    <div className="menu-list-section">
                        <MenuList menus={menus} onAddToOrder={(menu) => addOrderDetail(menu.menuId, menu.menuName, menu.menuPrice)} />
                    </div>
                    {/* 주문 상세 리스트 */}
                    <div className="order-detail-section">
                        <h2>주문 목록</h2>
                        {orderDetails.length === 0 ? (
                            <p>주문이 없습니다</p>
                        ) : (
                            <div className="order-items">
                                {orderDetails.map((detail, idx) => (
                                    <div key={detail.ordDetailNo ?? `${detail.menuId}-${idx}`} className="payment-order-item">


                                        <div className="order-main">
                                            <div className="payment-orderdetail-continer">
                                                <p>{detail.menuName}</p>


                                                <QuantityInput
                                                    quantity={updatedQuantities[detail.ordDetailNo] ?? detail.quantity}
                                                    onClick={(newQuantity) => quantityChange(detail.ordDetailNo, newQuantity)}
                                                />

                                                <div className="payment-price-container">
                                                    <p>{(detail.unitPrice * (updatedQuantities[detail.ordDetailNo] || detail.quantity)).toLocaleString()}</p>
                                                </div>

                                                <button
                                                    className="delete-button"
                                                    onClick={() => delOrderDetail(detail.ordDetailNo)}
                                                ><FontAwesomeIcon icon={faXmark} size="1x"/></button>
                                            </div>


                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="order-footer">
                            {/* 하단 주문 버튼 */}
                            <button className="confirm-button" onClick={handleUpdateQuantity}>
                                주문
                            </button>

                            {/* 하단 결제 버튼 */}
                            <button className="confirm-button" onClick={handlePaymentClick}>
                                {totalAmount.toLocaleString()}원 결제
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default OrderDetail;
