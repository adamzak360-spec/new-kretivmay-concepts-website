import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, User, Package, MapPin, LogOut } from "lucide-react";
import { useLocation, Link } from "wouter";

export default function Account() {
  const { user, isLoading, logout } = useAuth();
  const [, setLocation] = useLocation();
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: (user as any)?.phone || "",
    address: (user as any)?.address || "",
    city: (user as any)?.city || "",
    state: (user as any)?.state || "",
    zipCode: (user as any)?.zipCode || "",
    country: (user as any)?.country || "",
  });

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

  if (!user) {
    setLocation("/auth");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(formData);
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Account</h1>
          <p className="text-slate-500">Welcome back, {user.name}</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="text-red-600 border-red-200 hover:bg-red-50">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>

      <Tabs defaultValue="profile" className="w-full">
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

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your profile details and contact info.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={formData.phone} 
                      onChange={(e) => setFormData({...formData, phone: e.target.value})} 
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
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="space-y-1">
                        <p className="font-bold">Order #{order.orderNumber}</p>
                        <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right space-y-1">
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
                  <p className="text-slate-500">You haven't placed any orders yet.</p>
                  <Link href="/services">
                    <Button variant="link" className="text-blue-600 mt-2">Start Shopping</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addresses">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Addresses</CardTitle>
              <CardDescription>Manage your saved shipping locations.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input 
                    id="address" 
                    value={formData.address} 
                    onChange={(e) => setFormData({...formData, address: e.target.value})} 
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city" 
                      value={formData.city} 
                      onChange={(e) => setFormData({...formData, city: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input 
                      id="state" 
                      value={formData.state} 
                      onChange={(e) => setFormData({...formData, state: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">Zip/Postal Code</Label>
                    <Input 
                      id="zip" 
                      value={formData.zipCode} 
                      onChange={(e) => setFormData({...formData, zipCode: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input 
                      id="country" 
                      value={formData.country} 
                      onChange={(e) => setFormData({...formData, country: e.target.value})} 
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
