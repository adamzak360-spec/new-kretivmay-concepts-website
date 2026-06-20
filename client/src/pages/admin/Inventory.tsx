import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Package, Search, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function AdminInventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stockAdjustment, setStockAdjustment] = useState<Record<number, number>>({});
  
  // Fetch products
  const { data: products = [], refetch: refetchProducts } = trpc.admin.products.list.useQuery();

  // Update mutation
  const updateMutation = trpc.admin.products.update.useMutation({
    onSuccess: () => {
      toast.success("Inventory updated successfully!");
      setStockAdjustment({});
      refetchProducts();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleStockChange = (productId: number, currentStock: number, adjustment: number) => {
    const newStock = Math.max(0, currentStock + adjustment);
    updateMutation.mutate({
      id: productId,
      stock: newStock,
    });
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = products.filter(p => p.stock <= 5);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-slate-600 mt-1">Monitor and adjust stock levels across your catalog</p>
        </div>

        {/* Inventory Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total Items in Stock</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">
              {products.reduce((acc, p) => acc + p.stock, 0)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Low Stock Alerts</p>
            <div className="flex items-center gap-2 mt-1">
              <p className={`text-3xl font-bold ${lowStockItems.length > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                {lowStockItems.length}
              </p>
              {lowStockItems.length > 0 && <AlertTriangle className="w-6 h-6 text-red-600" />}
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Out of Stock</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">
              {products.filter(p => p.stock === 0).length}
            </p>
          </div>
        </div>

        {/* Inventory List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Stock Control</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 w-full md:w-64"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 font-semibold text-sm text-slate-900">Product</th>
                    <th className="px-6 py-4 font-semibold text-sm text-slate-900">Current Stock</th>
                    <th className="px-6 py-4 font-semibold text-sm text-slate-900">Status</th>
                    <th className="px-6 py-4 font-semibold text-sm text-slate-900">Last Updated</th>
                    <th className="px-6 py-4 font-semibold text-sm text-slate-900 text-right">Quick Adjust</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        No products found.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-slate-100 overflow-hidden flex-shrink-0">
                              {product.imageUrl ? (
                                <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <Package className="w-4 h-4 text-slate-300 m-2" />
                              )}
                            </div>
                            <span className="font-medium text-slate-900">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-bold ${product.stock <= 5 ? 'text-red-600' : 'text-slate-900'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {product.stock === 0 ? (
                            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">Out of Stock</span>
                          ) : product.stock <= 5 ? (
                            <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">Low Stock</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">In Stock</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {new Date(product.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleStockChange(product.id, product.stock, -1)}
                              disabled={product.stock === 0 || updateMutation.isPending}
                            >
                              <ArrowDownRight className="w-4 h-4 text-red-600" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleStockChange(product.id, product.stock, 1)}
                              disabled={updateMutation.isPending}
                            >
                              <ArrowUpRight className="w-4 h-4 text-green-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
