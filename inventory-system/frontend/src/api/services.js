import api from './axios';

// --- Products ---
export const getAllProducts = async (params) => {
    const response = await api.get('/products', { params });
    return response.data;
};

export const getProductById = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};

export const createProduct = async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
};

// --- Inventory ---
export const getAllInventory = async () => {
    const response = await api.get('/inventory');
    return response.data;
};

export const updateStock = async (productId, change) => {
    // Note: Backend endpoint is /api/inventory/update/{productId}?change=X
    const response = await api.post(`/inventory/update/${productId}`, null, {
        params: { change }
    });
    return response.data;
};

// --- Analytics ---
export const getDashboardMetrics = async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
};

// --- Currency ---
export const convertCurrency = async (amount, to = 'USD') => {
    const response = await api.get('/currency/convert', {
        params: { amount, to }
    });
    return response.data;
};
