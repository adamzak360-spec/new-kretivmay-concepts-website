import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { ImageUpload } from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { 
  Upload, 
  Image as ImageIcon, 
  Save, 
  RefreshCw, 
  Trash2, 
  ExternalLink,
  Info
} from "lucide-react";

export default function AdminMedia() {
  const [uploading, setUploading] = useState(false);
  const [siteInfo, setSiteInfo] = useState({
    siteName: "Kretivmay Concepts",
    contactEmail: "info@kretivmay.com",
    phoneNumber: "+234...",
    address: "",
  });

  const utils = trpc.useUtils();
  
  // For now, we'll fetch portfolio items as a way to "manage" media
  const { data: mediaItems, isLoading: loadingMedia } = trpc.portfolio.list.useQuery();
  const deleteMedia = trpc.portfolio.delete.useMutation({
    onSuccess: () => {
      toast.success("Item deleted successfully");
      utils.portfolio.list.invalidate();
    },
    onError: (error) => {
      toast.error("Failed to delete item: " + error.message);
    }
  });

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Upload failed");
    }

    return await response.json();
  };

  const onUploadSuccess = (result: any) => {
    toast.success("File uploaded successfully!");
    // You could automatically create a portfolio item here or just refresh a list
    utils.portfolio.list.invalidate();
  };

  const handleSaveInfo = () => {
    toast.success("Site information updated (simulated)");
    // In a real app, you'd call a tRPC mutation here
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Media & Content Manager</h1>
          <p className="text-slate-500 mt-2">A centralized place to handle your uploads and site information.</p>
        </div>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" /> Upload
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Library
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Info className="w-4 h-4" /> Site Info
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload New Media</CardTitle>
                <CardDescription>
                  Upload images or videos to use across your website. 
                  Supported formats: JPG, PNG, GIF, WEBP, MP4.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-w-xl mx-auto py-8">
                  <ImageUpload 
                    onUpload={handleUpload}
                    onSuccess={onUploadSuccess}
                    label="Drag & Drop your file here"
                    maxSize={20}
                  />
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-3">
                  <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <p className="font-semibold mb-1">Upload Tip:</p>
                    <p>For the best performance, try to keep images under 2MB and videos under 10MB. 
                       The system will automatically process and store them safely.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="library">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Media Library</CardTitle>
                  <CardDescription>View and manage your uploaded files.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => utils.portfolio.list.invalidate()}>
                  <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                </Button>
              </CardHeader>
              <CardContent>
                {loadingMedia ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="aspect-square bg-slate-100 animate-pulse rounded-lg" />
                    ))}
                  </div>
                ) : mediaItems && mediaItems.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {mediaItems.map((item: any) => (
                      <div key={item.id} className="group relative aspect-square bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button size="icon" variant="secondary" className="h-8 w-8" asChild>
                            <a href={item.imageUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                          <Button 
                            size="icon" 
                            variant="destructive" 
                            className="h-8 w-8"
                            onClick={() => {
                              if(confirm("Are you sure you want to delete this item?")) {
                                deleteMedia.mutate({ id: item.id });
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-white/90 backdrop-blur-sm text-[10px] truncate font-medium">
                          {item.title}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ImageIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-500">No media found in your library.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>Update your website's contact details and global settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Business Name</Label>
                    <Input 
                      id="siteName" 
                      value={siteInfo.siteName} 
                      onChange={(e) => setSiteInfo({...siteInfo, siteName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Contact Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={siteInfo.contactEmail} 
                      onChange={(e) => setSiteInfo({...siteInfo, contactEmail: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={siteInfo.phoneNumber} 
                      onChange={(e) => setSiteInfo({...siteInfo, phoneNumber: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Business Address</Label>
                    <Input 
                      id="address" 
                      value={siteInfo.address} 
                      onChange={(e) => setSiteInfo({...siteInfo, address: e.target.value})}
                    />
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <Button onClick={handleSaveInfo} className="flex items-center gap-2">
                    <Save className="w-4 h-4" /> Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
