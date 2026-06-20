import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, User, Package, MapPin, LogOut, Mail, Phone, MapIcon, Calendar } from "lucide-react";

export default function Account() {
  const { user, isLoading, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("profile");

  // Parse tab from URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const tab = params.get('tab');
    if (tab && ['profile', 'orders', 'addresses'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location]);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [addressFormData, setAddressFormData] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: (user as any).phone || "",
        address: (user as any).address || "",
        city: (user as any).city || "",
        state: (user as any).state || "",
        zipCode: (user as any).zipCode || "",
        country: (user as any).country || "",
      });
      setAddressFormData({
        address: (user as any).address || "",
        city: (user as any).city || "",
        state: (user as any).state || "",
        zipCode: (user as any).zipCode || "",
        country: (user as any).country || "",
      });
    }
  }, [user]);

  const updateProfile = trpc.auth.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
    }
  });

  const { data: orders, isLoading: isLoadingOrders } = trpc.orders.list.useQuery(undefined, {
    enabled: !!user
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isLoading && !user) {
    setLocation("/auth");
    return null;
  }

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Name and email are required");
      return;
    }
    updateProfile.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    });
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressFormData.address || !addressFormData.city) {
      toast.error("Address and city are required");
      return;
    }
    updateProfile.mutate(addressFormData);
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const recentOrders = orders?.slice(0, 3) || [];
  const totalSpent = orders?.reduce((sum, order) => sum + order.totalAmount, 0) || 0;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Account</h1>
          <p className="text-slate-500">Welcome back, {user?.name || "User"}</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="text-red-600 border-red-200 hover:bg-red-50">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>

      {/* Dashboard Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Member Since</p>
                <p className="text-lg font-bold">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Orders</p>
                <p className="text-lg font-bold">{orders?.length || 0}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Spent</p>
                <p className="text-lg font-bold">${(totalSpent / 100).toFixed(2)}</p>
              </div>
              <User className="h-8 w-8 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Orders</span>
          </TabsTrigger>
          <TabsTrigger value="addresses" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Addresses</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your profile details and contact info.</CardDescription>
            </CardHeader>
            <form onSubmit={handleProfileSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={formData.phone} 
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
                <Button type="submit" disabled={updateProfile.isPending}>
                  {updateProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </CardContent>
            </form>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>View and track your past orders.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingOrders ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
                </div>
              ) : orders && orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold">Order #{order.orderNumber}</p>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-slate-100 text-slate-800'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()} • {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}</p>
                      </div>
                      <div className="text-right space-y-1 w-full sm:w-auto">
                        <p className="font-bold">${(order.totalAmount / 100).toFixed(2)}</p>
                        <Link href={`/account/orders/${order.id}`}>
                          <a className="text-sm text-blue-600 hover:underline">View Details</a>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-500 mb-4">You haven't placed any orders yet.</p>
                  <Link href="/services">
                    <Button variant="outline">Start Shopping</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Addresses Tab */}
        <TabsContent value="addresses">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Address</CardTitle>
              <CardDescription>Manage your shipping location.</CardDescription>
            </CardHeader>
            <form onSubmit={handleAddressSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input 
                    id="address" 
                    value={addressFormData.address} 
                    onChange={(e) => setAddressFormData({...addressFormData, address: e.target.value})}
                    placeholder="123 Main Street"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city" 
                      value={addressFormData.city} 
                      onChange={(e) => setAddressFormData({...addressFormData, city: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input 
                      id="state" 
                      value={addressFormData.state} 
                      onChange={(e) => setAddressFormData({...addressFormData, state: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">Zip/Postal Code</Label>
                    <Input 
                      id="zip" 
                      value={addressFormData.zipCode} 
                      onChange={(e) => setAddressFormData({...addressFormData, zipCode: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input 
                      id="country" 
                      value={addressFormData.country} 
                      onChange={(e) => setAddressFormData({...addressFormData, country: e.target.value})}
                    />
                  </div>
                </div>
                <Button type="submit" disabled={updateProfile.isPending}>
                  {updateProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Address
                </Button>
              </CardContent>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
