'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { X, Upload, ImageIcon, Sparkles, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';

// All 50 US states
const US_STATES = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' },
];

export default function AddCarPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [generatingSEO, setGeneratingSEO] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);
  const [dealerLocation, setDealerLocation] = useState<{ city: string; state: string } | null>(null);
  const [callForPrice, setCallForPrice] = useState(false);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    vin: '',
    mileage: 0,
    color: '',
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    salePrice: 0,
    description: '',
    city: '',
    state: '',
    latitude: 33.7490,
    longitude: -84.3880,
    trim: '',
    engine: '',
    drivetrain: '',
    bodyType: '',
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsed = JSON.parse(userData);
    setUser(parsed);

    // Fetch dealer profile to get their location
    const fetchDealerProfile = async () => {
      try {
        const response = await fetch(`/api/dealer/profile?dealerId=${parsed.effectiveDealerId || parsed.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            // Store dealer location for SEO generation
            if (data.user.city && data.user.state) {
              setDealerLocation({ city: data.user.city, state: data.user.state });
            }
            // Update form with dealer's city and state
            setFormData(prev => ({
              ...prev,
              city: data.user.city || prev.city,
              state: data.user.state || prev.state,
            }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch dealer profile:', error);
      }
    };

    fetchDealerProfile();
  }, [router]);

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const maxImages = 15;
    const remainingSlots = maxImages - photoUrls.length;

    if (remainingSlots === 0) {
      setUploadError(`Maximum ${maxImages} images allowed`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    setUploadingImages(true);
    setUploadError(null);

    const successfulUrls: string[] = [];
    const errors: string[] = [];

    // Upload one at a time for better error handling
    for (const file of filesToUpload) {
      try {
        // Validate file size client-side first
        if (file.size > 10 * 1024 * 1024) {
          errors.push(`${file.name}: File too large (max 10MB)`);
          continue;
        }

        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          errors.push(`${file.name}: ${errorData.error || 'Upload failed'}`);
          continue;
        }

        const data = await response.json();
        if (data.url) {
          successfulUrls.push(data.url);
        }
      } catch (error) {
        errors.push(`${file.name}: Network error - please check your connection`);
      }
    }

    // Add successful uploads
    if (successfulUrls.length > 0) {
      setPhotoUrls((prev) => [...prev, ...successfulUrls]);
    }

    // Show errors if any
    if (errors.length > 0) {
      setUploadError(`Some uploads failed:\n${errors.join('\n')}`);
    }

    setUploadingImages(false);
  };

  const removeImage = (index: number) => {
    setPhotoUrls((prev) => prev.filter((_, i) => i !== index));
    setUploadError(null);
  };

  // Move image up in the list
  const moveImageUp = (index: number) => {
    if (index === 0) return;
    setPhotoUrls((prev) => {
      const newUrls = [...prev];
      [newUrls[index - 1], newUrls[index]] = [newUrls[index], newUrls[index - 1]];
      return newUrls;
    });
  };

  // Move image down in the list
  const moveImageDown = (index: number) => {
    if (index === photoUrls.length - 1) return;
    setPhotoUrls((prev) => {
      const newUrls = [...prev];
      [newUrls[index], newUrls[index + 1]] = [newUrls[index + 1], newUrls[index]];
      return newUrls;
    });
  };

  // Set image as main (move to first position)
  const setAsMainImage = (index: number) => {
    if (index === 0) return;
    setPhotoUrls((prev) => {
      const newUrls = [...prev];
      const [movedUrl] = newUrls.splice(index, 1);
      newUrls.unshift(movedUrl);
      return newUrls;
    });
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragOverIndex.current = index;
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    setPhotoUrls((prev) => {
      const newUrls = [...prev];
      const [draggedUrl] = newUrls.splice(draggedIndex, 1);
      newUrls.splice(dropIndex, 0, draggedUrl);
      return newUrls;
    });
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    dragOverIndex.current = null;
  };

  const handleGenerateSEO = async () => {
    if (!formData.make || !formData.model || !formData.year) {
      alert('Please fill in Make, Model, and Year before generating SEO description');
      return;
    }

    // Always prefer dealer's location for SEO since that's where the car is located
    const seoCity = dealerLocation?.city || formData.city || '';
    const seoState = dealerLocation?.state || formData.state || '';

    setGeneratingSEO(true);
    try {
      const response = await fetch('/api/generate-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          make: formData.make,
          model: formData.model,
          year: formData.year,
          mileage: formData.mileage,
          color: formData.color,
          transmission: formData.transmission,
          salePrice: formData.salePrice,
          city: seoCity,
          state: seoState,
          vin: formData.vin,
          trim: formData.trim,
          engine: formData.engine,
          drivetrain: formData.drivetrain,
          bodyType: formData.bodyType,
          fuelType: formData.fuelType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate description');
      }

      const data = await response.json();
      setFormData({ ...formData, description: data.description });

      // Show uniqueness feedback
      if (data.uniqueness && !data.uniqueness.isUnique) {
        alert(`Note: This description was regenerated ${data.uniqueness.attempts} times to ensure uniqueness. Final result passed quality check.`);
      }
    } catch (error) {
      alert('Failed to generate SEO description. Please try again.');
    } finally {
      setGeneratingSEO(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (photoUrls.length === 0) {
      alert('Please upload at least one photo of the vehicle');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/dealer/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          dealerId: user.effectiveDealerId || user.id,
          photos: JSON.stringify(photoUrls),
        }),
      });

      if (response.ok) {
        alert('Car listed successfully!');
        router.push('/dealer');
      } else {
        alert('Failed to add car');
      }
    } catch (error) {
      alert('Error adding car');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dealer" className="text-primary hover:underline">← Back to Dashboard</Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">Add New Car</h1>
        <p className="text-gray-600 mb-8">List your vehicle - Free during 90-day trial!</p>

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
            <div>
              <label className="block text-sm font-medium mb-2">Fuel Type *</label>
              <select
                value={formData.fuelType}
                onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option>Gasoline</option>
                <option>Diesel</option>
                <option>Electric</option>
                <option>Hybrid</option>
                <option>Flex Fuel</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sale Price ($){!callForPrice && ' *'}</label>
            <input
              type="number"
              value={callForPrice ? '' : formData.salePrice || ''}
              onChange={(e) => setFormData({ ...formData, salePrice: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-gray-500"
              min="0"
              step="1"
              required={!callForPrice}
              disabled={callForPrice}
              placeholder={callForPrice ? 'Call For Price' : 'Enter sale price'}
            />
            <label className="flex items-center gap-2 mt-3 cursor-pointer">
              <input
                type="checkbox"
                checked={callForPrice}
                onChange={(e) => {
                  setCallForPrice(e.target.checked);
                  if (e.target.checked) {
                    setFormData({ ...formData, salePrice: 0 });
                  }
                }}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm text-gray-700">Display &quot;Call For Price&quot; instead of a price</span>
            </label>
            <p className="text-sm text-gray-500 mt-1">
              {callForPrice
                ? 'Customers will see "Call For Price" on this listing'
                : 'This price will be hidden from customers until they make a deal'}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">Description *</label>
              <button
                type="button"
                onClick={handleGenerateSEO}
                disabled={generatingSEO}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-4 h-4" />
                {generatingSEO ? 'Generating...' : 'Agentix SEO'}
              </button>
            </div>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              rows={4}
              required
              placeholder="Enter description manually or click 'Agentix SEO' to auto-generate an optimized description"
            />
            <p className="text-xs text-gray-500 mt-1">Agentix SEO generates search-optimized descriptions to help your listing rank higher</p>
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Vehicle Photos * (Max 15 images)
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Drag images to reorder. The first image will be the main photo shown in listings.
            </p>
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

              {/* Upload Error Message */}
              {uploadError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm whitespace-pre-line">
                  {uploadError}
                </div>
              )}

              {/* Image Previews with Drag & Drop */}
              {photoUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {photoUrls.map((url, index) => (
                    <div
                      key={url}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`relative group aspect-square cursor-grab active:cursor-grabbing ${
                        draggedIndex === index ? 'opacity-50 ring-2 ring-primary' : ''
                      }`}
                    >
                      <Image
                        src={url}
                        alt={`Car photo ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />

                      {/* Drag handle indicator */}
                      <div className="absolute top-2 left-2 bg-black/50 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition">
                        <GripVertical className="w-4 h-4" />
                      </div>

                      {/* Control buttons */}
                      <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          title="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => moveImageUp(index)}
                            className="bg-gray-700 text-white p-1 rounded-full hover:bg-gray-800"
                            title="Move up"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                        )}
                        {index < photoUrls.length - 1 && (
                          <button
                            type="button"
                            onClick={() => moveImageDown(index)}
                            className="bg-gray-700 text-white p-1 rounded-full hover:bg-gray-800"
                            title="Move down"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Main photo badge and Set as Main button */}
                      {index === 0 ? (
                        <div className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded font-medium">
                          Main Photo
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setAsMainImage(index)}
                          className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition hover:bg-black"
                        >
                          Set as Main
                        </button>
                      )}

                      {/* Position indicator */}
                      <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
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
                {US_STATES.map((state) => (
                  <option key={state.code} value={state.code}>
                    {state.code} - {state.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <p className="font-semibold mb-2 text-green-800">90-Day Free Trial Active!</p>
            <p className="text-sm text-gray-700">List unlimited vehicles free during your trial. Packages available: Silver, Gold, Platinum.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Adding Car...' : 'List Car (Free)'}
          </button>
        </form>
      </div>
    </div>
  );
}
