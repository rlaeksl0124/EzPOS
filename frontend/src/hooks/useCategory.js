import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const useCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    //데어터 불러오
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/category`);
            setCategories(res.data);
            // console.log(formattedCategories);
            console.log(res.data);
        } catch (err) {
            console.error("Failed to fetch categories: ", err);
            setError(err);
            } finally {
            setLoading(false);
        }
    };

     // 카테고리 추가
    const addCategory = async (newCategoryName) => {
        try {
            await axios.post(`${BASE_URL}/category`, { categoryname: newCategoryName });
            fetchCategories(); // 새 데이터 반영
        } catch (error) {
            console.error("Failed to add new category:", error);
        }
    };

    // 카테고리 삭제
    const deleteCategory = async (categoryId) => {
        try {
            await axios.post(`${BASE_URL}/deletecategory`, { category_id: categoryId });
            fetchCategories(); // 삭제 후 업데이트
        } catch (error) {
            console.error("Failed to delete category:", error);
        }
    };

    // 카테고리 수정
    const updateCategory = async (updatedCategory) => {
        try {
            await axios.post(`${BASE_URL}/updatecategory`, updatedCategory);
            fetchCategories(); // 수정 후 업데이트
        } catch (error) {
            console.error("Failed to update category:", error);
        }
    };

    // 사용 여부 토글
    const toggleVisibility = async (categoryId, isVisible) => {
        try {
            await axios.post(`${BASE_URL}/category/toggle-visibility`, {
                categoryId,
                isVisible,
            });
            setCategories((prevCategories) =>
                prevCategories.map((category) =>
                    category.categoryId === categoryId
                        ? { ...category, isVisible }
                        : category
                )
            );
        } catch (error) {
            console.error("Failed to toggle visibility:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);
    
    return { categories, setCategories, fetchCategories, addCategory, deleteCategory, updateCategory, toggleVisibility, loading, error };
};



        
export default useCategory;

