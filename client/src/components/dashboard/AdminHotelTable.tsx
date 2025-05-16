import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Hotel } from "@shared/schema";
import { Eye, Pencil, Trash, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "wouter";

interface AdminHotelTableProps {
  searchTerm: string;
  locationFilter: string;
  ratingFilter: string;
  statusFilter: string;
}

export default function AdminHotelTable({
  searchTerm,
  locationFilter,
  ratingFilter,
  statusFilter,
}: AdminHotelTableProps) {
  const { toast } = useToast();
  const [, navigate] = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    image: "",
    rating: 0,
    pricePerNight: 0,
    discountPercentage: 0,
    status: "active",
  });

  // Fetch hotels
  const { data: hotels, isLoading } = useQuery<Hotel[]>({
    queryKey: ["/api/hotels"],
  });

  // Delete hotel mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/hotels/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hotels"] });
      toast({
        title: "Hotel deleted",
        description: "The hotel has been successfully deleted.",
      });
      setDeleteDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete hotel",
        variant: "destructive",
      });
    },
  });

  // Update hotel mutation
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<Hotel>;
    }) => {
      await apiRequest("PUT", `/api/admin/hotels/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hotels"] });
      toast({
        title: "Hotel updated",
        description: "The hotel has been successfully updated.",
      });
      setEditDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update hotel",
        variant: "destructive",
      });
    },
  });

  // Handle opening delete dialog
  const openDeleteDialog = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setDeleteDialogOpen(true);
  };

  // Handle opening edit dialog
  const openEditDialog = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setFormData({
      name: hotel.name,
      location: hotel.location,
      description: hotel.description,
      image: hotel.image || "",
      rating: hotel.rating,
      pricePerNight: hotel.pricePerNight,
      discountPercentage: hotel.discountPercentage || 0,
      status: hotel.status || "active",
    });
    setEditDialogOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "rating" || name === "pricePerNight" || name === "discountPercentage"
        ? parseFloat(value)
        : value,
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedHotel) return;
    
    updateMutation.mutate({
      id: selectedHotel.id,
      data: formData,
    });
  };

  // Handle deleting a hotel
  const handleDelete = () => {
    if (!selectedHotel) return;
    deleteMutation.mutate(selectedHotel.id);
  };

  // Filter the hotels based on search term and filters
  const filteredHotels = hotels?.filter((hotel) => {
    // Search term filter
    const matchesSearchTerm = searchTerm
      ? hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    // Location filter
    const matchesLocation = locationFilter
      ? hotel.location.toLowerCase().includes(locationFilter.toLowerCase())
      : true;

    // Rating filter
    const matchesRating = ratingFilter
      ? hotel.rating === parseInt(ratingFilter)
      : true;

    // Status filter
    const matchesStatus = statusFilter
      ? hotel.status === statusFilter
      : true;

    return matchesSearchTerm && matchesLocation && matchesRating && matchesStatus;
  });

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex text-yellow-400 text-xs">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? "fill-current" : ""}`}
          />
        ))}
      </div>
    );
  };

  // View hotel details
  const viewHotelDetails = (hotelId: number) => {
    navigate(`/hotels/${hotelId}`);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Hotel</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHotels?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-neutral-500">
                      No hotels found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredHotels?.map((hotel) => (
                    <TableRow key={hotel.id}>
                      <TableCell className="text-sm text-neutral-500">
                        HTL-{hotel.id.toString().padStart(3, '0')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <img 
                            className="h-10 w-10 rounded-md object-cover mr-3" 
                            src={hotel.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945"} 
                            alt={hotel.name}
                          />
                          <div>
                            <div className="text-sm font-medium text-neutral-900">{hotel.name}</div>
                            <div className="text-xs text-neutral-500">{hotel.rating}-star</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-neutral-500">{hotel.location}</TableCell>
                      <TableCell>{renderStars(hotel.rating)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {hotel.discountPercentage > 0 && (
                            <span className="text-xs text-neutral-500 line-through mr-1">${hotel.pricePerNight}</span>
                          )}
                          <span className="font-semibold">${(hotel.pricePerNight * (1 - (hotel.discountPercentage || 0) / 100)).toFixed(2)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          hotel.status === "active" 
                            ? "bg-green-100 text-green-800" 
                            : hotel.status === "maintenance"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-neutral-100 text-neutral-800"
                        }`}>
                          {hotel.status || "Active"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewHotelDetails(hotel.id)}
                          className="text-neutral-500 hover:text-neutral-700"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(hotel)}
                          className="text-primary hover:text-primary-dark"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(hotel)}
                          className="text-error hover:text-error-dark"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
        
        {filteredHotels && filteredHotels.length > 0 && (
          <div className="px-6 py-4 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-neutral-500">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredHotels.length}</span> of{" "}
                <span className="font-medium">{hotels?.length}</span> results
              </div>
              {/* Pagination would go here if needed */}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Hotel</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the hotel "{selectedHotel?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Hotel Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Hotel</DialogTitle>
            <DialogDescription>
              Update the details for {selectedHotel?.name}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Hotel Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <Input
                    id="rating"
                    name="rating"
                    type="number"
                    min="1"
                    max="5"
                    step="0.5"
                    value={formData.rating}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pricePerNight">Price Per Night ($)</Label>
                  <Input
                    id="pricePerNight"
                    name="pricePerNight"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.pricePerNight}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="discountPercentage">Discount (%)</Label>
                  <Input
                    id="discountPercentage"
                    name="discountPercentage"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discountPercentage}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="active">Active</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
