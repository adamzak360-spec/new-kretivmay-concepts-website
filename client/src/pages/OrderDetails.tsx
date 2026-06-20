import { useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, ArrowLeft, Package, MapPin, Calendar, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function OrderDetails() {
  const [, params] = useRoute("/account/orders/:id");
  const orderId = params?.id ? parseInt(params.id) : null;

  const { data: order, isLoading, error } = trpc.orders.byId.useQuery(orderId!, {
    enabled: !!orderId
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
        <p className="text-slate-500 mb-8">We couldn't find the order you're looking for.</p>
        <Link href="/account">
          <Button>Back to Account</Button>
        </Link>
      </div>
    );
  }

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/account">
        <a className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 mb-8 group">
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to My Account
        </a>
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
            <Badge className={statusColors[order.status as keyof typeof statusColors]}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
          <div className="flex items-center text-slate-500 gap-4">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Package className="h-4 w-4" />
              {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">Total Amount</p>
          <p className="text-3xl font-black text-blue-600">${(order.totalAmount / 100).toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {(order as any).items.map((item: any) => (
                  <div key={item.id} className="flex gap-4 p-6">
                    <div className="h-20 w-20 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg">{item.title}</h4>
                      <p className="text-slate-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${(item.price / 100).toFixed(2)}</p>
                      <p className="text-sm text-slate-500">Total: ${((item.price * item.quantity) / 100).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-slate-600">
              <p className="font-medium text-slate-900">{order.shippingAddress}</p>
              <p>{order.shippingCity}, {order.shippingState} {order.shippingZipCode}</p>
              <p>{order.shippingCountry}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span>${(order.totalAmount / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">${(order.totalAmount / 100).toFixed(2)}</span>
                </div>
              </div>
              <Badge variant="outline" className="w-full justify-center py-1 border-blue-200 text-blue-700 bg-blue-50">
                Paid via Secure Checkout
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
