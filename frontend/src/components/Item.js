import React, { useState, useEffect } from 'react';
import axios from "axios";
import ItemHeader from './ItemHead';
import ItemList from './ItemList';
import ItemModal from './ItemModal';
import useItem from '../hooks/useItem'; // useItem 훅 사용
import useCategory from '../hooks/useCategory'; // useCategory 훅 사용

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Item() {
    const [itemModalOpen, setItemModalOpen] = useState(false);
    const { items, setItems, loading: itemLoading, error: itemError } = useItem(); // useItem 훅 사용
    const { categories, loading: categoryLoading, error: categoryError } = useCategory(); // useCategory 훅 사용
    const [ selectedCategory, setSelectedCategory ] = useState(null);

    // //모든 메뉴 가져오기
    // const fetchItems = async () => {
    //     try {
    //         const response = await axios.get(`${BASE_URL}/menu`);
    //         console.log('Fetched items:', response.data);
    
    //         // 서버 응답 데이터 변환 (필요 시)
    //         const formattedItems = response.data.map((item) => ({
    //             menuId: item.menuId,
    //             menuname: item.menuName || "Unnamed Item", price : item.menuPrice || "Unnamed Item"
    //         }));
    //         setItems(response.data); // 변환된 데이터로 상태 설정
    //     } catch (error) {
    //         console.error('Failed to fetch items:', error);
    //     }
    // };
    
    // useEffect(() => {
    //     fetchItems();
    // }, []);


    //선택된 카테고리에 따라 메뉴반환
    const filteredItems = selectedCategory ? items.filter((item) => String(item.categoryId) === String(selectedCategory)) : items;


    // 새로운 아이템 추가
    const handleAddItem = async (newItem) => {
        try {
            // categoryId만 전달
            const formattedItem = {
                ...newItem,
                categoryId: newItem.categoryId, // 선택된 카테고리 ID만 전달
            };
    
            const response = await axios.post(`${BASE_URL}/menu`, formattedItem);
            const newItemData = response.data;
            setItems([...items, newItemData]);
        } catch (error) {
            console.error('Failed to add new item:', error);
        }
    };
    

    // 아이템 삭제
    const handleDeleteItem = async (menuId) => {
        try {
            await axios.post(`${BASE_URL}/deletemenu`, { menuId: menuId });
            setItems(items.filter((item) => item.menuId !== menuId));
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    };

    // 아이템 수정
    const handleUpdateItem = async (updatedItem) => {
        try {
            const response = await axios.post(`${BASE_URL}/updateitem`, updatedItem);

            const updatedItemData = response.data;
            setItems(
                items.map((item) =>
                    item.menuId === updatedItemData.menuId ? updatedItemData : item
                )
            );
        } catch (error) {
            console.error('Failed to update item:', error);
        }
    };

    return (
        <div className="item-management">
            <ItemHeader onAddItem={() => setItemModalOpen(true)} />
            <ItemList 
                categories={categories}
                items={filteredItems} // 필터링된 데이터 전달 
                onDelete={handleDeleteItem} // 삭제 핸들러 전달
                onCategorySelect={setSelectedCategory} // 카테고리 선택 핸들러 전달
                selectedCategory={selectedCategory} // 선택된 카테고리 전달 
            />
            <ItemModal
                isOpen={itemModalOpen}
                onClose={() => setItemModalOpen(false)}
                onSave={handleAddItem}
                onUpdate={handleUpdateItem}
                items={items}
                categories={categories} // useCategory 훅으로 가져온 데이터를 전달
            />
            {itemLoading && <p>Loading items...</p>}
            {itemError && <p>Error loading items: {itemError.message}</p>}
            {categoryLoading && <p>Loading categories...</p>}
            {categoryError && <p>Error loading categories: {categoryError.message}</p>}
        </div>
    );
}

export default Item;