import React from "react";
import "../../css/salesummary/sidebar.css";

function Sidebar() {
    
    
    return (
        <div className="sidebar">
            <ul>
                <li className="active">매출 현황</li>
                <li>매출 달력</li>
                <li>상품 분석</li>
            </ul>
            <button>엑셀 다운로드</button>
            <button>의견 보내기</button>
        </div>
    )
}

export default Sidebar; 