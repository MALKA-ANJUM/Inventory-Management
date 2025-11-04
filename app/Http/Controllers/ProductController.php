<?php
// app/Http/Controllers/ProductController.php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::where('user_id', auth()->id())->paginate(10);
        return response()->json($products);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'stock_quantity' => 'required|integer|min:0',
            'status' => 'boolean'
        ]);

        $validated['user_id'] = auth()->id();

        $product = Product::create($validated);

        return response()->json($product, 201);
    }

        public function update(Request $request, $id)
    {
        $product = Product::where('id', $id)
                          ->where('user_id', auth()->id())
                          ->firstOrFail();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'stock_quantity' => 'sometimes|integer|min:0',
            'status' => 'boolean'
        ]);

        $product->update($validated);

        return response()->json($product);
    }

    // 👇 Delete only your own product
    public function destroy($id)
    {
        $product = Product::where('id', $id)
                          ->where('user_id', auth()->id())
                          ->firstOrFail();

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }
}
