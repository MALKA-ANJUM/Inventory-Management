import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import ProductModal from '../components/ProductModal';

export default function Products() {
	const [products, setProducts] = useState([]);
	const [page, setPage] = useState(1);
	const [lastPage, setLastPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [editProduct, setEditProduct] = useState(null);
	const [error, setError] = useState('');

	const fetchProducts = async (p = 1) => {
		setLoading(true);
		setError('');
		try {
			const res = await axiosClient.get('/products', { params: { page: p, per_page: 10 }});
			// Laravel paginator returns res.data.data, res.data.current_page, res.data.last_page
			const payload = res.data;
			setProducts(payload.data || []);
			setPage(payload.current_page || p);
			setLastPage(payload.last_page || 1);
		} catch (err) {
			console.error('Fetch products error', err);
			setError(err.response?.data?.message || 'Could not load products');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => { fetchProducts(page); }, [page]);

	const openAdd = () => { setEditProduct(null); setShowModal(true); };
	const openEdit = (product) => { setEditProduct(product); setShowModal(true); };

	const handleDelete = async (id) => {
		if (!confirm('Delete this product?')) return;
		try {
		await axiosClient.delete(`/products/${id}`);
		// if deletion empties the page, go back one page
		if (products.length === 1 && page > 1) setPage(page - 1);
		else fetchProducts(page);
		} catch (err) {
		console.error('Delete error', err);
		alert(err.response?.data?.message || 'Delete failed');
		}
	};

	const handleSave = async (formData) => {
		try {
		if (editProduct) {
			// edit: PUT
			await axiosClient.put(`/products/${editProduct.id}`, formData);
		} else {
			// create: POST
			await axiosClient.post('/products', formData);
		}
		setShowModal(false);
		setEditProduct(null);
		// After save, reload current page (or go to first page to show new item)
		fetchProducts(page);
		} catch (err) {
		console.error('Save error', err);
		// If backend returns validation errors, show them
		const msg = err.response?.data?.message || 'Save failed';
		alert(msg);
		}
	};

	return (
		<div className="container mt-5">
		<div className="d-flex justify-content-between align-items-center mb-3">
			<h3 className="fw-bold">Products</h3>
			<div>
			<button className="btn btn-success me-2" onClick={openAdd}>+ Add Product</button>
			</div>
		</div>

		{error && <div className="alert alert-danger">{error}</div>}

		<div className="table-responsive">
			<table className="table table-striped table-bordered align-middle">
			<thead className="table-success">
				<tr>
				<th>Name</th>
				<th>Quatity</th>
				<th>Stock Status</th>
				<th>Variants (Price)</th>
				<th>Status</th>
				<th style={{width:160}}>Actions</th>
				</tr>
			</thead>
			<tbody>
				{loading ? (
				<tr><td colSpan="5" className="text-center">Loading...</td></tr>
				) : products.length ? (
				products.map(p => (
					<tr key={p.id}>
					<td>{p.name}</td>
					<td>{p.stock_quantity}</td>
					<td>{(p.variants?.reduce((s,v)=>s + (v.stock_quantity||0), 0) > 0 || (p.stock_quantity||0) > 0) ? 'In Stock' : 'Out of Stock'}</td>
					<td>
						{p.variants?.map((v, i) => (
						<div key={i}>{v.name} - ${parseFloat(v.price).toFixed(2)} {v.stock_quantity != null && `(${v.stock_quantity})`}</div>
						))}
					</td>
					<td>{p.status == 1 ? 'Active' : 'Inactive'}</td>
					<td>
						<button className="btn btn-sm btn-primary me-2" onClick={() => openEdit(p)}>Edit</button>
						<button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
					</td>
					</tr>
				))
				) : (
				<tr><td colSpan="6" className="text-center">No products found</td></tr>
				)}
			</tbody>
			</table>
		</div>

		{/* Pagination */}
		<div className="d-flex justify-content-between align-items-center">
			<div>Page {page} of {lastPage}</div>
			<div>
			<button className="btn btn-sm btn-outline-secondary me-2" disabled={page<=1} onClick={()=>setPage(prev=>Math.max(1, prev-1))}>Prev</button>
			<button className="btn btn-sm btn-outline-secondary" disabled={page>=lastPage} onClick={()=>setPage(prev=>prev+1)}>Next</button>
			</div>
		</div>

		{/* Modal */}
		{showModal && (
			<ProductModal
			product={editProduct}
			onClose={() => { setShowModal(false); setEditProduct(null); }}
			onSave={handleSave}
			/>
		)}
		</div>
	);
}
