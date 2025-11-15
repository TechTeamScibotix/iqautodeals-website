'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { X, Upload, ImageIcon } from 'lucide-react';

export default function EditCarPage() {
  const router = useRouter();
  const params = useParams();
  const carId = params.carId as string;

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingCar, setFetchingCar] = useState(true);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    vin: '',
    mileage: 0,
    color: '',
    transmission: 'Automatic',
    salePrice: 0,
    description: '',
    city: '',
    state: 'GA',
    latitude: 33.7490,
    longitude: -84.3880,
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsed = JSON.parse(userData);
    setUser(parsed);

    // Fetch car data
    fetchCarData(parsed.id);
  }, [router, carId]);

  const fetchCarData = async (dealerId: string) => {
    try {
      const response = await fetch(`/api/dealer/cars/${carId}?dealerId=${dealerId}`);
      if (!response.ok) {
        alert('Failed to load car data');
        router.push('/dealer');
        return;
      }

      const car = await response.json();

      // Pre-fill form data
      setFormData({
        make: car.make,
        model: car.model,
        year: car.year,
        vin: car.vin,
        mileage: car.mileage,
        color: car.color,
        transmission: car.transmission,
        salePrice: car.salePrice,
        description: car.description,
        city: car.city,
        state: car.state,
        latitude: car.latitude,
        longitude: car.longitude,
      });

      // Pre-fill photos
      try {
        const photos = JSON.parse(car.photos || '[]');
        setPhotoUrls(photos);
      } catch (e) {
        console.error('Failed to parse photos:', e);
      }
    } catch (error) {
      console.error('Error fetching car:', error);
      alert('Error loading car data');
      router.push('/dealer');
    } finally {
      setFetchingCar(false);
    }
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const maxImages = 15;
    const remainingSlots = maxImages - photoUrls.length;

    if (remainingSlots === 0) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    setUploadingImages(true);

    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Upload failed');
        const data = await response.json();
        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setPhotoUrls((prev) => [...prev, ...uploadedUrls]);
    } catch (error) {
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setPhotoUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (photoUrls.length === 0) {
      alert('Please upload at least one photo of the vehicle');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/dealer/cars/${carId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          photos: JSON.stringify(photoUrls),
        }),
      });

      if (response.ok) {
        alert('Car updated successfully!');
        router.push('/dealer');
      } else {
        alert('Failed to update car');
      }
    } catch (error) {
      alert('Error updating car');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingCar) {
    return <div className="min-h-screen flex items-center justify-center">Loading car data...</div>;
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dealer" className="text-primary hover:underline">← Back to Dashboard</Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">Edit Car Listing</h1>
        <p className="text-gray-600 mb-8">Update vehicle information and photos</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Make *</label>
              <input
                type="text"
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Model *</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Year *</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                min="1990"
                max={new Date().getFullYear() + 1}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Mileage *</label>
              <input
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Color *</label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">VIN *</label>
              <input
                type="text"
                value={formData.vin}
                onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                maxLength={17}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Transmission *</label>
              <select
                value={formData.transmission}
                onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option>Automatic</option>
                <option>Manual</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sale Price ($) *</label>
            <input
              type="number"
              value={formData.salePrice}
              onChange={(e) => setFormData({ ...formData, salePrice: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              min="0"
              step="100"
              required
            />
            <p className="text-sm text-gray-500 mt-1">This price will be hidden from customers until they make a deal</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              rows={4}
              required
            />
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Vehicle Photos * (Max 15 images)
            </label>
            <div className="space-y-4">
              {/* Upload Button */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition">
                <input
                  type="file"
                  id="image-upload"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                  disabled={uploadingImages || photoUrls.length >= 15}
                />
                <label
                  htmlFor="image-upload"
                  className={`cursor-pointer flex flex-col items-center ${
                    uploadingImages || photoUrls.length >= 15 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-700">
                    {uploadingImages ? 'Uploading...' : 'Click to upload photos'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, WebP up to 10MB each ({photoUrls.length}/15)
                  </p>
                </label>
              </div>

              {/* Image Previews */}
              {photoUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {photoUrls.map((url, index) => (
                    <div key={url} className="relative group aspect-square">
                      <Image
                        src={url}
                        alt={`Car photo ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                          Main Photo
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">City *</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">State *</label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value="GA">GA</option>
                <option value="FL">FL</option>
                <option value="AL">AL</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Updating Car...' : 'Update Car Listing'}
          </button>
        </form>
      </div>
    </div>
  );
}
