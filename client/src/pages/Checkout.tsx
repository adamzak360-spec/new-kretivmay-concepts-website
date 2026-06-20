import { useState } from "react";
import { Link } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  ChevronRight, 
  CheckCircle, 
  ShoppingBag, 
  Truck, 
  User, 
  CreditCard,
  Package,
  MapPin,
  Info
} from "lucide-react";
import { toast } from "sonner";

type CheckoutStep = "cart" | "info" | "review" | "confirmation";

export default function Checkout() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [orderNumber, setOrderNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    region: "",
    notes: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === "cart") setStep("info");
    else if (step === "info") {
      // Basic validation
      if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.region) {
        toast.error("Please fill in all required fields");
        return;
      }
      setStep("review");
    }
  };

  const handleBack = () => {
    if (step === "info") setStep("cart");
    else if (step === "review") setStep("info");
  };

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);
    // Mock submission delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockOrderNumber = "BW-" + Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(mockOrderNumber);
    setStep("confirmation");
    setIsSubmitting(false);
    clearCart();
    toast.success("Order submitted successfully!");
  };

  const steps = [
    { id: "cart", label: "Cart", icon: ShoppingBag },
    { id: "info", label: "Details", icon: User },
    { id: "review", label: "Review", icon: Package },
    { id: "confirmation", label: "Done", icon: CheckCircle },
  ];

  if (step === "confirmation") {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
        <div className="bg-green-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-4">Thank You!</h1>
        <p className="text-xl text-slate-600 mb-8">
          Your order <span className="font-bold text-blue-600">#{orderNumber}</span> has been received and is being processed.
        </p>
        
        <Card className="text-left mb-10 border-slate-100 shadow-xl overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-100">
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-dashed border-slate-200">
                <span className="text-slate-500 font-medium">Customer</span>
                <span className="font-bold text-slate-900">{formData.fullName}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-dashed border-slate-200">
                <span className="text-slate-500 font-medium">Delivery to</span>
                <span className="font-bold text-slate-900">{formData.city}, {formData.region}</span>
              </div>
              <div className="pt-2">
                <div className="text-slate-500 font-medium mb-2">Business Details</div>
                <div className="text-sm text-slate-600 bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <p className="font-bold text-blue-900 mb-1">Blue Water Shopping Village</p>
                  <p>Malshegu, Tamale</p>
                  <p>Opposite Star Oil Filling Station</p>
                  <p>Ghana</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Link href="/services">
          <Button className="bg-blue-600 hover:bg-blue-700 h-12 px-10 text-lg font-bold rounded-xl">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Progress Stepper */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
            
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const isCompleted = steps.findIndex(x => x.id === step) > idx;
              
              return (
                <div key={s.id} className="relative z-10 flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                    isActive ? "bg-blue-600 border-blue-100 text-white scale-110" : 
                    isCompleted ? "bg-green-500 border-green-100 text-white" : 
                    "bg-white border-slate-100 text-slate-400"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`mt-2 text-xs font-bold uppercase tracking-wider ${
                    isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-slate-400"
                  }`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {step === "cart" && (
              <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="bg-white border-b border-slate-100 p-6">
                  <CardTitle className="text-2xl font-black text-slate-900">Your Shopping Cart</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {items.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-10 h-10 text-slate-300" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Your cart is empty</h3>
                      <p className="text-slate-500 mb-8">Looks like you haven't added anything yet.</p>
                      <Link href="/services">
                        <Button className="bg-blue-600 hover:bg-blue-700">Start Shopping</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {items.map((item) => (
                        <div key={item.id} className="p-6 flex gap-6 items-center">
                          <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-900 text-lg mb-1">{item.title}</h4>
                            <div className="text-blue-600 font-black mb-4">{item.price}</div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                                <button 
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="px-3 py-1 hover:bg-slate-200 transition-colors text-slate-600 font-bold"
                                >-</button>
                                <span className="px-4 py-1 font-bold text-slate-900 border-x border-slate-200">{item.quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="px-3 py-1 hover:bg-slate-200 transition-colors text-slate-600 font-bold"
                                >+</button>
                              </div>
                              <button 
                                onClick={() => removeItem(item.id)}
                                className="text-red-500 text-sm font-bold hover:text-red-700 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                          <div className="text-right hidden md:block">
                            <div className="text-sm text-slate-400 font-medium mb-1">Subtotal</div>
                            <div className="text-xl font-black text-slate-900">
                              GH₵ {(item.priceValue * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                {items.length > 0 && (
                  <CardFooter className="bg-slate-50 p-6 flex justify-between items-center">
                    <Link href="/services">
                      <a className="text-blue-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Shop
                      </a>
                    </Link>
                    <Button 
                      onClick={handleNext}
                      className="bg-blue-600 hover:bg-blue-700 h-12 px-8 font-bold rounded-xl gap-2"
                    >
                      Checkout Now
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </CardFooter>
                )}
              </Card>
            )}

            {step === "info" && (
              <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="bg-white border-b border-slate-100 p-6">
                  <CardTitle className="text-2xl font-black text-slate-900">Delivery Information</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="font-bold text-slate-700">Full Name *</Label>
                      <Input 
                        id="fullName" 
                        name="fullName" 
                        value={formData.fullName} 
                        onChange={handleInputChange}
                        placeholder="John Doe" 
                        className="h-12 rounded-xl border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-bold text-slate-700">Email Address *</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email"
                        value={formData.email} 
                        onChange={handleInputChange}
                        placeholder="john@example.com" 
                        className="h-12 rounded-xl border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-bold text-slate-700">Phone Number *</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleInputChange}
                        placeholder="+233 XX XXX XXXX" 
                        className="h-12 rounded-xl border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city" className="font-bold text-slate-700">City / Town *</Label>
                      <Input 
                        id="city" 
                        name="city" 
                        value={formData.city} 
                        onChange={handleInputChange}
                        placeholder="Tamale" 
                        className="h-12 rounded-xl border-slate-200"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="region" className="font-bold text-slate-700">Region *</Label>
                      <Input 
                        id="region" 
                        name="region" 
                        value={formData.region} 
                        onChange={handleInputChange}
                        placeholder="Northern Region" 
                        className="h-12 rounded-xl border-slate-200"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address" className="font-bold text-slate-700">Delivery Address *</Label>
                      <Input 
                        id="address" 
                        name="address" 
                        value={formData.address} 
                        onChange={handleInputChange}
                        placeholder="Street name, landmark, etc." 
                        className="h-12 rounded-xl border-slate-200"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="notes" className="font-bold text-slate-700">Delivery Notes (Optional)</Label>
                      <Textarea 
                        id="notes" 
                        name="notes" 
                        value={formData.notes} 
                        onChange={handleInputChange}
                        placeholder="Special instructions for delivery..." 
                        className="min-h-[100px] rounded-xl border-slate-200"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-slate-50 p-6 flex justify-between items-center">
                  <Button variant="ghost" onClick={handleBack} className="font-bold text-slate-600 gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Cart
                  </Button>
                  <Button 
                    onClick={handleNext}
                    className="bg-blue-600 hover:bg-blue-700 h-12 px-8 font-bold rounded-xl gap-2"
                  >
                    Review Order
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </CardFooter>
              </Card>
            )}

            {step === "review" && (
              <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="bg-white border-b border-slate-100 p-6">
                  <CardTitle className="text-2xl font-black text-slate-900">Review Your Order</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-8 bg-blue-50/50 border-b border-blue-100">
                    <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      Shipping Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-slate-500 font-medium uppercase tracking-wider text-[10px]">Recipient</div>
                        <div className="font-bold text-slate-900">{formData.fullName}</div>
                        <div className="text-slate-600">{formData.phone}</div>
                        <div className="text-slate-600">{formData.email}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 font-medium uppercase tracking-wider text-[10px]">Address</div>
                        <div className="font-bold text-slate-900">{formData.address}</div>
                        <div className="text-slate-600">{formData.city}, {formData.region}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-slate-100">
                    {items.map((item) => (
                      <div key={item.id} className="p-6 flex gap-4 items-center">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900">{item.title}</h4>
                          <div className="text-slate-500 text-sm">{item.quantity} x {item.price}</div>
                        </div>
                        <div className="text-right font-bold text-slate-900">
                          GH₵ {(item.priceValue * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="bg-slate-50 p-6 flex justify-between items-center">
                  <Button variant="ghost" onClick={handleBack} className="font-bold text-slate-600 gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Details
                  </Button>
                  <Button 
                    onClick={handleSubmitOrder}
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 h-12 px-10 font-bold rounded-xl gap-2 shadow-lg shadow-blue-200"
                  >
                    {isSubmitting ? "Processing..." : "Place Order"}
                    {!isSubmitting && <CheckCircle className="w-5 h-5" />}
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <Card className="border-none shadow-xl rounded-2xl overflow-hidden sticky top-24">
              <CardHeader className="bg-slate-900 text-white p-6">
                <CardTitle className="text-xl font-bold">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-bold">GH₵ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Fee</span>
                  <span className="text-green-600 font-bold uppercase text-xs tracking-wider">Free</span>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-end">
                    <span className="text-slate-900 font-bold">Total Amount</span>
                    <span className="text-3xl font-black text-blue-600">GH₵ {totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-6">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-800 leading-relaxed">
                      This is a <span className="font-bold">Cash on Delivery</span> order. You will pay upon receiving your items.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-8 space-y-4 px-2">
              <div className="flex items-center gap-3 text-slate-500">
                <Truck className="w-5 h-5" />
                <span className="text-sm font-medium">Reliable delivery across Ghana</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <CreditCard className="w-5 h-5" />
                <span className="text-sm font-medium">Secure Cash on Delivery</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <MapPin className="w-5 h-5" />
                <span className="text-sm font-medium">Visit us at Malshegu, Tamale</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
