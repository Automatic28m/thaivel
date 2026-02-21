"use client";
import React, { useState, useEffect } from "react";
import HorizontalRule from "../../../components/HorizontalRule";
import axios from "axios";
import { useParams, useRouter } from "next/navigation"; // Added for routing

const EditAttraction = () => {
  const { id } = useParams(); // Get ID from URL
  const router = useRouter();
  console.log("Current Attraction ID from URL:", id);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    openHour: "",
    tel: "",
    igUrl: "",
    facebookUrl: "",
    tiktokUrl: "",
    googleMapsUrl: "",
    description: "",
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [albumFiles, setAlbumFiles] = useState([]);
  
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subDistricts, setSubDistricts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedIds, setSelectedIds] = useState({
    provinceId: "",
    districtId: "",
    subDistrictId: "",
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  // 1. Fetch Categories & Provinces (Same as AttractionForm)
  useEffect(() => {
    axios.get("/api/getCategories").then((res) => setCategories(res.data));
    axios.get("/api/locations?type=provinces").then((res) => setProvinces(res.data));
  }, []);

  // 2. NEW: Fetch existing data for editing
  useEffect(() => {
    if (!id) return;
    
    axios.get(`/api/attractions/getAttractionById?id=${id}`)
      .then((res) => {
        const attraction = res.data.data; // Targeting the object from your SQL result
        
        setFormData({
          name: attraction.name || "",
          location: attraction.location || "",
          openHour: attraction.open_hour || "",
          tel: attraction.tel || "",
          igUrl: attraction.igUrl || "",
          facebookUrl: attraction.facebookUrl || "",
          tiktokUrl: attraction.tiktokUrl || "",
          googleMapsUrl: attraction.google_maps_url || "",
          description: attraction.description || "",
        });

        setSelectedCategoryId(attraction.category_id || "");
        
        // Setting the province ID triggers the cascade effects below
        setSelectedIds({
          provinceId: attraction.province_id,
          districtId: attraction.district_id,
          subDistrictId: attraction.sub_district_id,
        });
      });
  }, [id]);

  useEffect(() => {
    console.table(formData);
  })

  // 3. Location Cascades (District & Sub-district logic remains identical)
  useEffect(() => {
    if (selectedIds.provinceId) {
      axios.get(`/api/locations?type=districts&parentId=${selectedIds.provinceId}`)
        .then((res) => setDistricts(res.data));
    }
  }, [selectedIds.provinceId]);

  useEffect(() => {
    if (selectedIds.districtId) {
      axios.get(`/api/locations?type=sub_districts&parentId=${selectedIds.districtId}`)
        .then((res) => setSubDistricts(res.data));
    }
  }, [selectedIds.districtId]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setThumbnailFile(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    setAlbumFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("id", id); // Send ID so backend knows WHICH record to update
    data.append("method", "update"); // Flag for your SQL logic
    
    // Append text fields
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    data.append("sub_district_id", selectedIds.subDistrictId);
    data.append("category_id", selectedCategoryId);

    // Only append files if the user selected NEW ones
    if (thumbnailFile) data.append("thumbnailFile", thumbnailFile);
    albumFiles.forEach((file) => data.append("albumFiles", file));

    try {
      const response = await axios.post("/api/attractions/insertAttraction", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200 || response.status === 201) {
        alert("Success! Attraction updated in MySQL.");
        router.push("/admin/attractions"); // Redirect back to management table
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("Check console for error details.");
    }
  };

return (
    <div className="bg-secondary min-h-screen py-30 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-serif text-primary">Add New Attraction</h2>
        <HorizontalRule borderColor="border-primary" />

        <form onSubmit={handleSubmit} className="mt-10 space-y-6 uppercase">
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <label className="">Attraction Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. BAAN THONG KRUB"
                className="bg-transparen border-primary p-2 outline-solid text-primary  uppercase"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="opacity-60">Category</label>
            <select
              className="bg-transparen border-primary p-2 outline-solid text-primary  uppercase"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="opacity-60">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder=""
              className="bg-transparen border-primary p-2 outline-solid text-primary  uppercase"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Province Dropdown */}
            <div className="flex flex-col space-y-2">
              <label className="opacity-60">Province</label>
              <select
                className="bg-transparen border-primary p-2 outline-solid text-primary  uppercase"
                value={selectedIds.provinceId}
                onChange={(e) =>
                  setSelectedIds((prev) => ({
                    ...prev,
                    provinceId: e.target.value,
                  }))
                }
              >
                <option value="">Select Province</option>
                {provinces.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name_en}
                  </option>
                ))}
              </select>
            </div>

            {/* Amphure Dropdown */}
            <div className="flex flex-col space-y-2">
              <label className="opacity-60">District (Amphure)</label>
              <select
                disabled={!districts.length}
                className="bg-transparen border-primary p-2 outline-solid text-primary  uppercase disabled:opacity-30"
                value={selectedIds.districtId}
                onChange={(e) =>
                  setSelectedIds((prev) => ({
                    ...prev,
                    districtId: e.target.value,
                  }))
                }
              >
                <option value="">Select District</option>
                {districts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name_en}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub-District Dropdown */}
            <div className="flex flex-col space-y-2">
              <label className="opacity-60">Sub-District (Tambon)</label>
              <select
                disabled={!subDistricts.length}
                className="bg-transparen border-primary p-2 outline-solid text-primary  uppercase disabled:opacity-30"
                value={selectedIds.subDistrictId}
                onChange={(e) =>
                  setSelectedIds((prev) => ({
                    ...prev,
                    subDistrictId: e.target.value,
                  }))
                }
              >
                <option value="">Select Sub-District</option>
                {subDistricts.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name_en}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact & Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col space-y-2">
              <label className="opacity-60">Opening Hours</label>
              <input
                type="text"
                name="openHour"
                value={formData.openHour}
                onChange={handleChange}
                placeholder="e.g. wed-sun 10:00-17:00"
                className="bg-transparen border-primary p-2 outline-solid text-primary  uppercase disabled:opacity-30"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="opacity-60">Telephone</label>
              <input
                type="text"
                name="tel"
                value={formData.tel}
                onChange={handleChange}
                placeholder="062XXXXXXX"
                className="bg-transparen border-primary p-2 outline-solid text-primary  uppercase disabled:opacity-30"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="opacity-60">Instagram</label>
              <input
                type="text"
                name="ig"
                value={formData.igUrl}
                onChange={handleChange}
                placeholder="instagram link"
                className="bg-transparen border-primary p-2 outline-solid text-primary  uppercase disabled:opacity-30"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="opacity-60">Facebook</label>
              <input
                type="text"
                name="facebook"
                value={formData.facebookUrl}
                onChange={handleChange}
                placeholder="facebook link"
                className="bg-transparen border-primary p-2 outline-solid text-primary  uppercase disabled:opacity-30"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="opacity-60">Tiktok</label>
              <input
                type="text"
                name="Tiktok"
                value={formData.tiktokUrl}
                onChange={handleChange}
                placeholder="tiktok link"
                className="bg-transparen border-primary p-2 outline-solid text-primary  uppercase disabled:opacity-30"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="opacity-60">Google Maps Link</label>
              <input
                type="url"
                name="googleMapsUrl"
                value={formData.googleMapsUrl}
                onChange={handleChange}
                placeholder="google maps link"
                className="bg-transparen border-primary p-2 outline-solid text-primary  uppercase disabled:opacity-30"
              />
            </div>
          </div>

          {/* Detailed Description */}
          <div className="flex flex-col space-y-2 pt-4">
            <label className="opacity-60">
              Description (Nostalgic Journey)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              placeholder="Describe the serene atmosphere and slow-life ambiance..."
              className="bg-transparen border-primary p-2 outline-solid text-primary  uppercase disabled:opacity-30"
            />
          </div>

          <div className="flex flex-col space-y-2 pt-4">
            <label className="opacity-60">
              Thumbnail image (Select single Image)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="bg-transparent border-2 border-dashed border-primary/20 p-8 text-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file: file:bg-primary file:text-secondary hover:file:bg-primary/80 cursor-pointer"
            />
            <p className="text-[10px] opacity-40">
              {thumbnailFile ? (
                <span>Selected</span>
              ) : (
                <span>Not Selected</span>
              )}
            </p>
          </div>

          <div className="flex flex-col space-y-2 pt-4">
            <label className="opacity-60">
              Photo Album (Select Multiple Images)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="bg-transparent border-2 border-dashed border-primary/20 p-8 text-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file: file:bg-primary file:text-secondary hover:file:bg-primary/80 cursor-pointer"
            />
            <p className="text-[10px] opacity-40">
              {albumFiles.length} photos selected. These will be linked to your
              local folder.
            </p>
          </div>

          <button
            type="submit"
            className="w-full md:w-fit px-12 py-4 border-3 border-primary text-primary  uppercase text-lg hover:bg-primary hover:text-secondary transition-all active:scale-95"
          >
            Save Attraction
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditAttraction;
