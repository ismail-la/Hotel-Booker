import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import AdminHotelTable from "@/components/dashboard/AdminHotelTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { HotelIcon, BedDouble, FileText, Users, Settings, LogOut, Search, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Form schema for adding a new hotel
const hotelFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  location: z.string().min(2, "Location is required"),
  description: z.string().min(10, "Description is required"),
  image: z.string().url("Must be a valid URL").optional(),
  rating: z.coerce.number().min(1).max(5),
  pricePerNight: z.coerce.number().min(1, "Price is required"),
  discountPercentage: z.coerce.number().min(0).max(100).optional(),
  status: z.string().optional(),
});

type HotelFormValues = z.infer<typeof hotelFormSchema>;

export default function AdminDashboardPage() {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [addHotelDialogOpen, setAddHotelDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("hotels");
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Set up form
  const form = useForm<HotelFormValues>({
    resolver: zodResolver(hotelFormSchema),
    defaultValues: {
      name: "",
      location: "",
      description: "",
      image: "",
      rating: 5,
      pricePerNight: 0,
      discountPercentage: 0,
      status: "active",
    },
  });

  // Add hotel mutation
  const addHotelMutation = useMutation({
    mutationFn: async (data: HotelFormValues) => {
      const response = await apiRequest("POST", "/api/admin/hotels", data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hotels"] });
      toast({
        title: "Hotel Added",
        description: "The new hotel has been successfully added.",
      });
      setAddHotelDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: HotelFormValues) => {
    addHotelMutation.mutate(data);
  };

  // Check if user is admin, redirect if not
  if (user && !user.isAdmin) {
    setLocation("/dashboard");
    return null;
  }

  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <section className="py-12 container mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-medium text-xl mr-4">
                <HotelIcon className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-heading font-semibold text-lg">Admin Panel</h2>
                <p className="text-sm text-neutral-600">{user?.email}</p>
              </div>
            </div>
            <nav>
              <ul className="space-y-1">
                <li>
                  <button 
                    className={`flex w-full items-center py-2 px-3 ${
                      activeTab === "hotels" 
                        ? "bg-primary bg-opacity-10 text-primary" 
                        : "text-neutral-600 hover:bg-neutral-50"
                    } rounded font-medium`}
                    onClick={() => setActiveTab("hotels")}
                  >
                    <HotelIcon className="mr-3 h-5 w-5" />
                    <span>Hotels</span>
                  </button>
                </li>
                <li>
                  <button 
                    className={`flex w-full items-center py-2 px-3 ${
                      activeTab === "rooms" 
                        ? "bg-primary bg-opacity-10 text-primary" 
                        : "text-neutral-600 hover:bg-neutral-50"
                    } rounded font-medium`}
                    onClick={() => setActiveTab("rooms")}
                  >
                    <BedDouble className="mr-3 h-5 w-5" />
                    <span>Rooms</span>
                  </button>
                </li>
                <li>
                  <button 
                    className={`flex w-full items-center py-2 px-3 ${
                      activeTab === "bookings" 
                        ? "bg-primary bg-opacity-10 text-primary" 
                        : "text-neutral-600 hover:bg-neutral-50"
                    } rounded font-medium`}
                    onClick={() => setActiveTab("bookings")}
                  >
                    <FileText className="mr-3 h-5 w-5" />
                    <span>Bookings</span>
                  </button>
                </li>
                <li>
                  <button 
                    className={`flex w-full items-center py-2 px-3 ${
                      activeTab === "users" 
                        ? "bg-primary bg-opacity-10 text-primary" 
                        : "text-neutral-600 hover:bg-neutral-50"
                    } rounded font-medium`}
                    onClick={() => setActiveTab("users")}
                  >
                    <Users className="mr-3 h-5 w-5" />
                    <span>Users</span>
                  </button>
                </li>
                <li>
                  <button 
                    className={`flex w-full items-center py-2 px-3 ${
                      activeTab === "settings" 
                        ? "bg-primary bg-opacity-10 text-primary" 
                        : "text-neutral-600 hover:bg-neutral-50"
                    } rounded font-medium`}
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings className="mr-3 h-5 w-5" />
                    <span>Settings</span>
                  </button>
                </li>
                <li>
                  <button 
                    className="flex w-full items-center py-2 px-3 text-neutral-600 hover:bg-neutral-50 rounded font-medium"
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    <span>{logoutMutation.isPending ? "Logging Out..." : "Log Out"}</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:w-3/4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="hotels">
              <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
                <h1 className="font-heading font-bold text-2xl">Hotel Management</h1>
                <Button 
                  variant="secondary" 
                  onClick={() => setAddHotelDialogOpen(true)}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Add New Hotel
                </Button>
              </div>
              
              {/* Search and Filter */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 h-4 w-4" />
                    <Input 
                      type="text" 
                      placeholder="Search hotels..." 
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Select 
                      value={locationFilter} 
                      onValueChange={setLocationFilter}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="All Locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Locations</SelectItem>
                        <SelectItem value="New York">New York</SelectItem>
                        <SelectItem value="Miami">Miami</SelectItem>
                        <SelectItem value="San Francisco">San Francisco</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select 
                      value={ratingFilter} 
                      onValueChange={setRatingFilter}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="All Ratings" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Ratings</SelectItem>
                        <SelectItem value="5">5 Star</SelectItem>
                        <SelectItem value="4">4 Star</SelectItem>
                        <SelectItem value="3">3 Star</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select 
                      value={statusFilter} 
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              {/* Hotels Table */}
              <AdminHotelTable 
                searchTerm={searchTerm}
                locationFilter={locationFilter}
                ratingFilter={ratingFilter}
                statusFilter={statusFilter}
              />
            </TabsContent>

            <TabsContent value="rooms">
              <div className="mb-6">
                <h1 className="font-heading font-bold text-2xl">Room Management</h1>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <h3 className="font-heading font-semibold text-xl mb-2">Room Management</h3>
                <p className="text-neutral-600 mb-4">
                  Room management functionality is under construction.
                </p>
                <Button>Add New Room</Button>
              </div>
            </TabsContent>

            <TabsContent value="bookings">
              <div className="mb-6">
                <h1 className="font-heading font-bold text-2xl">Booking Management</h1>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <h3 className="font-heading font-semibold text-xl mb-2">Booking Management</h3>
                <p className="text-neutral-600 mb-4">
                  Booking management functionality is under construction.
                </p>
                <Button>View All Bookings</Button>
              </div>
            </TabsContent>

            <TabsContent value="users">
              <div className="mb-6">
                <h1 className="font-heading font-bold text-2xl">User Management</h1>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <h3 className="font-heading font-semibold text-xl mb-2">User Management</h3>
                <p className="text-neutral-600 mb-4">
                  User management functionality is under construction.
                </p>
                <Button>View All Users</Button>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="mb-6">
                <h1 className="font-heading font-bold text-2xl">Admin Settings</h1>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <h3 className="font-heading font-semibold text-xl mb-2">Admin Settings</h3>
                <p className="text-neutral-600 mb-4">
                  Admin settings functionality is under construction.
                </p>
                <Button>Update Settings</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Add Hotel Dialog */}
      <Dialog open={addHotelDialogOpen} onOpenChange={setAddHotelDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Hotel</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new hotel to the system.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter hotel name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City, Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Hotel description" 
                        {...field} 
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating (1-5)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1} 
                          max={5} 
                          step={0.5} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="pricePerNight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price Per Night ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0} 
                          step={0.01} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="discountPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0} 
                          max={100} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button 
                  type="submit"
                  disabled={addHotelMutation.isPending}
                >
                  {addHotelMutation.isPending ? "Adding..." : "Add Hotel"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
