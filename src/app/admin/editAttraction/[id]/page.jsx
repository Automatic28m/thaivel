"use client";
import React, { useState, useEffect } from "react";
import HorizontalRule from "../../../components/HorizontalRule";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

const EditAttraction = () => {
  const { id } = useParams();
  const router = useRouter();
  console.log("Current Attraction ID from URL:", id);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    coordinates: "",
    openHour: "",
    tel: "",
    igUrl: "",
    facebookUrl: "",
    tiktokUrl: "",
    googleMapsUrl: "",
    description: "",
    recommend: false,
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

  useEffect(() => {
    axios.get("/api/getCategories").then((res) => setCategories(res.data));
    axios.get("/api/locations?type=provinces").then((res) => setProvinces(res.data));
  }, []);

  useEffect(() => {
    if (!id) return;

    axios.get(`/api/attractions/getAttractionById?id=${id}`)
      .then((res) => {
        const attraction = res.data.data;
        const lat = attraction.latitude || attraction.lat || "";
        const lon = attraction.longitude || attraction.lon || "";
        const combinedCoords = (lat && lon) ? `${lat}, ${lon}` : "";

        setFormData({
          name: attraction.name || "",
          location: attraction.location || "",
          coordinates: combinedCoords,
          openHour: attraction.open_hour || "",
          tel: attraction.tel || "",
          igUrl: attraction.igUrl || "",
          facebookUrl: attraction.facebookUrl || "",
          tiktokUrl: attraction.tiktokUrl || "",
          googleMapsUrl: attraction.google_maps_url || "",
          description: attraction.description || "",
          recommend: attraction.recommend === 1,
        });

        setSelectedCategoryId(attraction.category_id || "");

        setSelectedIds({
          provinceId: attraction.province_id || "",
          districtId: attraction.district_id || "",
          subDistrictId: attraction.sub_district_id || "",
        });
      });
  }, [id]);

  useEffect(() => {
    console.table(formData);
  }, [formData]);

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
    const { name, value, type, files, checked } = e.target;

    if (type === "file") {
      setThumbnailFile(files[0]);
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    setAlbumFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalLat = "";
    let finalLon = "";

    if (formData.coordinates) {
      const parts = formData.coordinates.split(',').map(part => part.trim());

      if (parts.length === 2) {
        finalLat = parseFloat(parts[0]).toFixed(8);
        finalLon = parseFloat(parts[1]).toFixed(8);
      } else {
        alert("Invalid coordinate format. Please use 'Latitude, Longitude' (e.g., 14.0225, 100.5352)");
        return;
      }
    }

    const data = new FormData();
    data.append("id", id);
    data.append("method", "update");

    data.append("name", formData.name);
    data.append("location", formData.location);
    data.append("lat", finalLat);
    data.append("lon", finalLon);
    data.append("openHour", formData.openHour);
    data.append("tel", formData.tel);
    data.append("igUrl", formData.igUrl);
    data.append("facebookUrl", formData.facebookUrl);
    data.append("tiktokUrl", formData.tiktokUrl);
    data.append("googleMapsUrl", formData.googleMapsUrl);
    data.append("description", formData.description);

    data.append("sub_district_id", selectedIds.subDistrictId);
    data.append("category_id", selectedCategoryId);
    data.append("recommend", formData.recommend ? 1 : 0);

    if (thumbnailFile) data.append("thumbnailFile", thumbnailFile);
    albumFiles.forEach((file) => data.append("albumFiles", file));

    try {
      const response = await axios.post("/api/attractions/updateAttraction", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200 || response.status === 201) {
        alert("Success! Attraction updated in MySQL.");
        router.push("/admin/attractions");
      }
    } catch (error) {
      const sqlMessage = error.response?.data?.message || "Unknown SQL Error";
      console.error("Update failed:", error);
      alert(`Update Error: ${sqlMessage}`);
    }
  };

  return (
    <div className="bg-secondary min-h-screen py-30 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-serif text-primary">Edit Attraction</h2>
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
                className="bg-transparent border-primary p-2 outline-solid text-primary uppercase"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="opacity-60">Category</label>
            <select
              className="bg-transparent border-primary p-2 outline-solid text-primary uppercase"
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
              placeholder="e.g. 123 River Road"
              className="bg-transparent border-primary p-2 outline-solid text-primary uppercase"
            />
          </div>

          {/* 4. Unified Coordinates Row */}
          <div className="grid grid-cols-1 gap-6">
            <div className="flex flex-col space-y-2">
              <label className="opacity-60">Map Coordinates (Lat, Lon)</label>
              <input
                type="text"
                name="coordinates"
                value={formData.coordinates}
                onChange={handleChange}
                placeholder="e.g. 14.022540, 100.535216"
                className="bg-transparent border-primary p-2 outline-solid text-primary uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Province Dropdown */}
            <div className="flex flex-col space-y-2">
              <label className="opacity-60">Province</label>
              <select
                className="bg-transparent border-primary p-2 outline-solid text-primary uppercase"
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
                className="bg-transparent border-primary p-2 outline-solid text-primary uppercase disabled:opacity-30"
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
                className="bg-transparent border-primary p-2 outline-solid text-primary uppercase disabled:opacity-30"
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
                className="bg-transparent border-primary p-2 outline-solid text-primary uppercase disabled:opacity-30"
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
                className="bg-transparent border-primary p-2 outline-solid text-primary uppercase disabled:opacity-30"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="opacity-60">Instagram</label>
              <input
                type="text"
                name="igUrl"
                value={formData.igUrl}
                onChange={handleChange}
                placeholder="instagram link"
                className="bg-transparent border-primary p-2 outline-solid text-primary uppercase disabled:opacity-30"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="opacity-60">Facebook</label>
              <input
                type="text"
                name="facebookUrl"
                value={formData.facebookUrl}
                onChange={handleChange}
                placeholder="facebook link"
                className="bg-transparent border-primary p-2 outline-solid text-primary uppercase disabled:opacity-30"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="opacity-60">Tiktok</label>
              <input
                type="text"
                name="tiktokUrl"
                value={formData.tiktokUrl}
                onChange={handleChange}
                placeholder="tiktok link"
                className="bg-transparent border-primary p-2 outline-solid text-primary uppercase disabled:opacity-30"
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
                className="bg-transparent border-primary p-2 outline-solid text-primary uppercase disabled:opacity-30"
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
              className="bg-transparent border-primary p-2 outline-solid text-primary uppercase disabled:opacity-30"
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
              className="bg-transparent border-2 border-dashed border-primary/20 p-8 text-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-primary file:text-secondary hover:file:bg-primary/80 cursor-pointer"
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
              className="bg-transparent border-2 border-dashed border-primary/20 p-8 text-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-primary file:text-secondary hover:file:bg-primary/80 cursor-pointer"
            />
            <p className="text-[10px] opacity-40">
              {albumFiles.length} photos selected. These will be linked to your
              local folder.
            </p>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <input
              type="checkbox"
              name="recommend"
              id="recommend"
              checked={!!formData.recommend || false}
              onChange={handleChange}
              className="w-5 h-5 accent-primary border-primary rounded cursor-pointer"
            />
            <label htmlFor="recommend" className="cursor-pointer select-none">
              Recommend this attraction on Homepage?
            </label>
          </div>

          <button
            type="submit"
            className="w-full md:w-fit px-12 py-4 border-3 border-primary text-primary uppercase text-lg hover:bg-primary hover:text-secondary transition-all active:scale-95"
          >
            Save Attraction
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditAttraction;