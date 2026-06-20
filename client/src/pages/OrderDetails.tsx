import { useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, ArrowLeft, Package, MapPin, Calendar, CreditCard, CheckCircle, Clock, Truck, AlertCircle } from "lucide-react";
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
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    processing: "bg-blue-100 text-blue-800 border-blue-200",
    shipped: "bg-purple-100 text-purple-800 border-purple-200",
    delivered: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };

  const statusIcons = {
    pending: <Clock className="h-4 w-4" />,
    processing: <Package className="h-4 w-4" />,
    shipped: <Truck className="h-4 w-4" />,
    delivered: <CheckCircle className="h-4 w-4" />,
    cancelled: <AlertCircle className="h-4 w-4" />,
  };

  const statusMessages = {
    pending: "Your order is waiting to be processed",
    processing: "Your order is being prepared for shipment",
    shipped: "Your order is on its way",
    delivered: "Your order has been delivered",
    cancelled: "Your order has been cancelled",
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
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
            <Badge className={`${statusColors[order.status as keyof typeof statusColors]} border flex items-center gap-1`}>
              {statusIcons[order.status as keyof typeof statusIcons]}
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
          <div className="flex items-center text-slate-500 gap-4 flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
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

      {/* Status Message */}
      <Card className="mb-8 border-l-4 border-l-blue-600 bg-blue-50">
        <CardContent className="pt-6">
          <p className="text-sm text-slate-700">
            {statusMessages[order.status as keyof typeof statusMessages]}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>Items included in this order</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {(order as any).items && (order as any).items.length > 0 ? (
                  (order as any).items.map((item: any) => (
                    <div key={item.id} className="flex gap-4 p-6 hover:bg-slate-50 transition-colors">
                      <div className="h-24 w-24 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span>Qty: <span className="font-medium">{item.quantity}</span></span>
                          <span>Unit Price: <span className="font-medium">${(item.price / 100).toFixed(2)}</span></span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-lg">${((item.price * item.quantity) / 100).toFixed(2)}</p>
                        <p className="text-xs text-slate-500 mt-1">Total</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-slate-500">
                    No items in this order
                  </div>
                )}
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
            <CardContent className="space-y-2 text-slate-600">
              {order.shippingAddress ? (
                <>
                  <p className="font-medium text-slate-900">{order.shippingAddress}</p>
                  <p>{order.shippingCity}{order.shippingState ? ', ' + order.shippingState : ''} {order.shippingZipCode}</p>
                  {order.shippingCountry && <p>{order.shippingCountry}</p>}
                </>
              ) : (
                <p className="text-slate-500">No shipping address provided</p>
              )}
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
                  <span className="font-medium">${(order.totalAmount / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Tax</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-blue-600">${(order.totalAmount / 100).toFixed(2)}</span>
                </div>
              </div>
              <Badge variant="outline" className="w-full justify-center py-2 border-blue-200 text-blue-700 bg-blue-50 text-xs font-medium">
                ✓ Paid via Secure Checkout
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-slate-600 mb-4">
                If you have any questions about this order, please contact our support team.
              </p>
              <Link href="/contact">
                <Button variant="outline" className="w-full">Contact Support</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
