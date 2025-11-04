<?php
// app/Http/Controllers/ProductController.php
namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function index()
    {
        // Load variants too
        $products = Product::with('variants')
            ->where('user_id', auth()->id())
            ->paginate(10);

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'stock_quantity' => 'required|integer|min:0',
            'status' => 'boolean',
            'variants' => 'array',
            'variants.*.name' => 'required|string|max:255',
            'variants.*.price' => 'required|numeric|min:0',
            'variants.*.stock_quantity' => 'required|integer|min:0',
        ]);

        DB::beginTransaction();
        try {
            $validated['user_id'] = auth()->id();

            $product = Product::create($validated);

            if (!empty($validated['variants'])) {
                foreach ($validated['variants'] as $variantData) {
                    $variantData['product_id'] = $product->id;
                    ProductVariant::create($variantData);
                }
            }

            DB::commit();
            return response()->json($product->load('variants'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $product = Product::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $validated = $request->validate([
            'name' => 'string|max:255',
            'stock_quantity' => 'integer|min:0',
            'status' => 'boolean',
            'variants' => 'array',
            'variants.*.id' => 'nullable|integer|exists:product_variants,id',
            'variants.*.name' => 'required|string|max:255',
            'variants.*.price' => 'required|numeric|min:0',
            'variants.*.stock_quantity' => 'required|integer|min:0',
        ]);

        DB::beginTransaction();
        try {
            $product->update($validated);

            // Update or create variants
            if (!empty($validated['variants'])) {
                $existingVariantIds = $product->variants()->pluck('id')->toArray();
                $newVariantIds = [];

                foreach ($validated['variants'] as $variantData) {
                    if (isset($variantData['id'])) {
                        // Update existing variant
                        $variant = ProductVariant::where('id', $variantData['id'])
                            ->where('product_id', $product->id)
                            ->first();
                        if ($variant) {
                            $variant->update($variantData);
                            $newVariantIds[] = $variant->id;
                        }
                    } else {
                        // Create new variant
                        $variantData['product_id'] = $product->id;
                        $newVariant = ProductVariant::create($variantData);
                        $newVariantIds[] = $newVariant->id;
                    }
                }

                // Delete variants not in the updated list
                $toDelete = array_diff($existingVariantIds, $newVariantIds);
                if (!empty($toDelete)) {
                    ProductVariant::whereIn('id', $toDelete)->delete();
                }
            }

            DB::commit();
            return response()->json($product->load('variants'));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $product = Product::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }
}
