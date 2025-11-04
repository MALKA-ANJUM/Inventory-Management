import { useEffect, useState } from 'react';

/**
 * ProductModal props:
 * - product: existing product object or null
 * - onClose: () => void
 * - onSave: async (payload) => void
 *
 * Notes:
 * - This component builds payload:
 *   { name, stock_quantity, status, variants: [{ id?, name, price, stock_quantity }] }
 * - Backend should accept nested variants (create/update). If your backend expects separate endpoints,
 *   adapt saving logic accordingly.
 */

export default function ProductModal({ product, onClose, onSave }) {
  const [name, setName] = useState('');
  const [stockQuantity, setStockQuantity] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [variants, setVariants] = useState([{ name: '', price: '', stock_quantity: 0 }]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setStockQuantity(product.stock_quantity ?? 0);
      setIsActive(product.status ?? true);
      // Normalize variants: map backend keys (name, price, stock_quantity, id if present)
      setVariants((product.variants && product.variants.length) ?
        product.variants.map(v => ({
          id: v.id,
          name: v.name ?? '',
          price: v.price ?? '',
          stock_quantity: v.stock_quantity ?? 0
        })) : [{ name: '', price: '', stock_quantity: 0 }]);
    } else {
      setName('');
      setStockQuantity(0);
      setIsActive(true);
      setVariants([{ name: '', price: '', stock_quantity: 0 }]);
    }
  }, [product]);

  const changeVariant = (idx, key, value) => {
    const copy = [...variants];
    copy[idx][key] = value;
    setVariants(copy);
  };

  const addVariant = () => setVariants([...variants, { name: '', price: '', stock_quantity: 0 }]);
  const removeVariant = idx => setVariants(variants.filter((_,i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Build payload that backend expects
      const payload = {
        name: name.trim(),
        stock_quantity: Number(stockQuantity) || 0,
        status: !!isActive,
        variants: variants.map(v => ({
          // include id if editing existing variant (backend can use it to update/delete)
          ...(v.id ? { id: v.id } : {}),
          name: (v.name || '').trim(),
          price: parseFloat(v.price) || 0,
          stock_quantity: Number(v.stock_quantity) || 0,
        })),
      };

      await onSave(payload);
    } catch (err) {
      console.error('Modal save error', err);
      alert(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{product ? 'Edit Product' : 'Add Product'}</h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Product Name</label>
                <input className="form-control" value={name} onChange={e=>setName(e.target.value)} required />
              </div>

              <div className="row gx-2">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Stock Quantity</label>
                  <input type="number" className="form-control" value={stockQuantity} onChange={e=>setStockQuantity(e.target.value)} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={isActive ? '1' : '0'} onChange={e=>setIsActive(e.target.value==='1')}>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
              </div>

              <hr />

              <label className="form-label">Variants</label>
              {variants.map((v, idx) => (
                <div className="d-flex gap-2 mb-2" key={idx}>
                  <input className="form-control" placeholder="Name (e.g. RED)" value={v.name} onChange={e=>changeVariant(idx, 'name', e.target.value)} required />
                  <input className="form-control" placeholder="Price" type="number" step="0.01" value={v.price} onChange={e=>changeVariant(idx, 'price', e.target.value)} required />
                  <input className="form-control" placeholder="Stock qty" type="number" value={v.stock_quantity} onChange={e=>changeVariant(idx, 'stock_quantity', e.target.value)} required />
                  {variants.length > 1 && <button type="button" className="btn btn-danger" onClick={()=>removeVariant(idx)}>×</button>}
                </div>
              ))}

              <button type="button" className="btn btn-outline-primary btn-sm" onClick={addVariant}>+ Add Variant</button>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
              <button type="submit" className="btn btn-success" disabled={saving}>
                {saving ? (product ? 'Updating...' : 'Saving...') : (product ? 'Update' : 'Save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
