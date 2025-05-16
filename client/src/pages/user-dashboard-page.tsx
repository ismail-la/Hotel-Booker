import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import BookingCard from "@/components/dashboard/BookingCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, UserCog, Heart, CreditCard, LogOut, Search } from "lucide-react";

export default function UserDashboardPage() {
  const { user, logoutMutation } = useAuth();
  const [bookingFilter, setBookingFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("bookings");

  // Fetch user bookings
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["/api/bookings"],
  });

  // Filter bookings
  const filteredBookings = bookings?.filter((booking: any) => {
    // First filter by status if needed
    if (bookingFilter !== "all") {
      if (bookingFilter === "upcoming" && booking.status !== "confirmed") return false;
      if (bookingFilter === "past" && booking.status !== "completed") return false;
      if (bookingFilter === "cancelled" && booking.status !== "cancelled") return false;
    }
    
    // Then filter by search query if present
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      return (
        booking.hotel?.name.toLowerCase().includes(query) ||
        booking.hotel?.location.toLowerCase().includes(query) ||
        `BK-${booking.id.toString().padStart(7, '0')}`.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (!user) return "";
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    return user.username.charAt(0).toUpperCase();
  };

  return (
    <section className="py-12 container mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <div className="flex items-center mb-6">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarFallback className="bg-primary text-white">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-heading font-semibold text-lg">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user?.username}
                </h2>
                <p className="text-sm text-neutral-600">{user?.email}</p>
              </div>
            </div>
            <nav>
              <ul className="space-y-1">
                <li>
                  <button 
                    className={`flex w-full items-center py-2 px-3 ${
                      activeTab === "bookings" 
                        ? "bg-primary bg-opacity-10 text-primary" 
                        : "text-neutral-600 hover:bg-neutral-50"
                    } rounded font-medium`}
                    onClick={() => setActiveTab("bookings")}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5">
                      <path d="M9 14L4 9L9 4M4 9H14.5C16.9853 9 19 11.0147 19 13.5C19 15.9853 16.9853 18 14.5 18H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>My Bookings</span>
                  </button>
                </li>
                <li>
                  <button 
                    className={`flex w-full items-center py-2 px-3 ${
                      activeTab === "profile" 
                        ? "bg-primary bg-opacity-10 text-primary" 
                        : "text-neutral-600 hover:bg-neutral-50"
                    } rounded font-medium`}
                    onClick={() => setActiveTab("profile")}
                  >
                    <UserCog className="mr-3 h-5 w-5" />
                    <span>Profile Settings</span>
                  </button>
                </li>
                <li>
                  <button 
                    className={`flex w-full items-center py-2 px-3 ${
                      activeTab === "saved" 
                        ? "bg-primary bg-opacity-10 text-primary" 
                        : "text-neutral-600 hover:bg-neutral-50"
                    } rounded font-medium`}
                    onClick={() => setActiveTab("saved")}
                  >
                    <Heart className="mr-3 h-5 w-5" />
                    <span>Saved Hotels</span>
                  </button>
                </li>
                <li>
                  <button 
                    className={`flex w-full items-center py-2 px-3 ${
                      activeTab === "payment" 
                        ? "bg-primary bg-opacity-10 text-primary" 
                        : "text-neutral-600 hover:bg-neutral-50"
                    } rounded font-medium`}
                    onClick={() => setActiveTab("payment")}
                  >
                    <CreditCard className="mr-3 h-5 w-5" />
                    <span>Payment Methods</span>
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
            <TabsContent value="bookings">
              <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
                <h1 className="font-heading font-bold text-2xl">My Bookings</h1>
                <div className="flex gap-4 items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input 
                      placeholder="Search bookings..." 
                      className="pl-10 w-[200px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select 
                    value={bookingFilter} 
                    onValueChange={setBookingFilter}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="All Bookings" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Bookings</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="past">Past</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Bookings List */}
              <div className="space-y-6">
                {isLoading ? (
                  // Loading skeletons
                  Array(3).fill(0).map((_, index) => (
                    <Skeleton key={index} className="h-56 w-full" />
                  ))
                ) : filteredBookings?.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <h3 className="font-heading font-semibold text-xl mb-2">No bookings found</h3>
                    <p className="text-neutral-600 mb-6">
                      {bookingFilter !== "all" 
                        ? `You don't have any ${bookingFilter} bookings yet.` 
                        : searchQuery 
                          ? "No bookings match your search." 
                          : "You haven't made any bookings yet."}
                    </p>
                    <Button>Browse Hotels</Button>
                  </div>
                ) : (
                  filteredBookings?.map((booking: any) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="profile">
              <div className="mb-6">
                <h1 className="font-heading font-bold text-2xl">Profile Settings</h1>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="font-heading font-semibold text-lg mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">First Name</label>
                    <Input defaultValue={user?.firstName || ""} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Last Name</label>
                    <Input defaultValue={user?.lastName || ""} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                    <Input defaultValue={user?.email || ""} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Username</label>
                    <Input defaultValue={user?.username || ""} disabled />
                  </div>
                </div>
                <div className="mt-8">
                  <h2 className="font-heading font-semibold text-lg mb-4">Change Password</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Current Password</label>
                      <Input type="password" />
                    </div>
                    <div></div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">New Password</label>
                      <Input type="password" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Confirm New Password</label>
                      <Input type="password" />
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="saved">
              <div className="mb-6">
                <h1 className="font-heading font-bold text-2xl">Saved Hotels</h1>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <h3 className="font-heading font-semibold text-xl mb-2">No saved hotels</h3>
                <p className="text-neutral-600 mb-6">
                  You haven't saved any hotels to your favorites yet.
                </p>
                <Button>Browse Hotels</Button>
              </div>
            </TabsContent>

            <TabsContent value="payment">
              <div className="mb-6">
                <h1 className="font-heading font-bold text-2xl">Payment Methods</h1>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <h3 className="font-heading font-semibold text-xl mb-2">No payment methods</h3>
                <p className="text-neutral-600 mb-6">
                  You haven't added any payment methods yet.
                </p>
                <Button>Add Payment Method</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
