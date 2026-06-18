import { useState, useMemo } from "react";
import { useRoute, Link } from "wouter";
import { ArrowLeft, ShoppingCart, CheckCircle, Info, Star, Package, ShieldCheck } from "lucide-react";
import { FALLBACK_PRODUCTS, SHOP_CATEGORIES } from "@/lib/fallbacks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProductDetail() {
  const [, params] = useRoute("/shop/:slug");
  const slug = params?.slug;

  const product = useMemo(() => {
    return FALLBACK_PRODUCTS.find((p) => p.slug === slug);
  }, [slug]);

  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
        <p className="text-slate-600 mb-8">The product you are looking for does not exist or has been removed.</p>
        <Link href="/services">
          <Button className="bg-blue-600 hover:bg-blue-700">Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const category = SHOP_CATEGORIES.find(c => c.slug === product.category);

  return (
    <div className="w-full bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/">
            <a className="hover:text-blue-600">Home</a>
          </Link>
          <span>/</span>
          <Link href="/services">
            <a className="hover:text-blue-600">Shop</a>
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium truncate">{product.title}</span>
        </nav>

        <Link href="/services">
          <a className="inline-flex items-center gap-2 text-blue-600 font-semibold mb-8 hover:gap-3 transition-all">
            <ArrowLeft className="w-5 h-5" />
            Back to Shop
          </a>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Product Gallery Placeholder */}
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-slate-100 border border-slate-100 shadow-sm">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
                  <Package className="w-8 h-8 opacity-20" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-6">
              <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-none mb-4 px-4 py-1">
                {category?.name}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
                {product.title}
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1 text-yellow-400">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="text-slate-400 text-sm">(4.8 / 5.0 based on 24 reviews)</span>
              </div>
              <div className="text-4xl font-black text-blue-600 mb-6">
                {product.price}
              </div>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                {product.description}
              </p>
            </div>

            <div className="space-y-6 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-slate-50 transition-colors text-slate-600 font-bold"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 font-bold text-slate-900 border-x border-slate-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-slate-50 transition-colors text-slate-600 font-bold"
                  >
                    +
                  </button>
                </div>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 h-12 text-lg font-bold gap-2 rounded-xl shadow-lg shadow-blue-200">
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="text-sm font-bold text-slate-900">In Stock</div>
                    <div className="text-xs text-slate-500">Ready for pickup</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <ShieldCheck className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="text-sm font-bold text-slate-900">Authentic</div>
                    <div className="text-xs text-slate-500">100% Quality Guaranteed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-20">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b border-slate-100 bg-transparent h-auto p-0 mb-8">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-8 py-4 font-bold text-slate-500 data-[state=active]:text-blue-600"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-8 py-4 font-bold text-slate-500 data-[state=active]:text-blue-600"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-8 py-4 font-bold text-slate-500 data-[state=active]:text-blue-600"
              >
                Reviews
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-0">
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 leading-relaxed text-lg">
                  {product.fullDescription}
                </p>
              </div>
            </TabsContent>
            <TabsContent value="specifications" className="mt-0">
              <div className="bg-slate-50 rounded-2xl p-8">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                  {product.specifications.map((spec, index) => {
                    const [key, value] = spec.split(": ");
                    return (
                      <div key={index} className="flex justify-between py-3 border-b border-slate-200">
                        <dt className="font-bold text-slate-500">{key}</dt>
                        <dd className="text-slate-900 font-medium">{value}</dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-0">
              <div className="text-center py-12 bg-slate-50 rounded-2xl">
                <Info className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-slate-900 mb-2">Customer Reviews</h4>
                <p className="text-slate-500">Real customer reviews will appear here soon.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products Section */}
        <section className="py-20 border-t border-slate-100">
          <h2 className="text-3xl font-bold mb-12 text-slate-900">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {FALLBACK_PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4).map((related) => (
              <Link key={related.id} href={`/shop/${related.slug}`}>
                <a className="group">
                  <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="aspect-square bg-slate-100 overflow-hidden">
                      <img
                        src={related.imageUrl}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {related.title}
                      </h3>
                      <div className="text-blue-600 font-black mt-2">{related.price}</div>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
