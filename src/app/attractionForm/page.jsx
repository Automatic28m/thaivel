"use client";
import React, { useState, useEffect } from "react";
import HorizontalRule from "../components/HorizontalRule";
import axios from "axios";

const AttractionForm = () => {
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

  const [albumFiles, setAlbumFiles] = useState([]);
  const handleFileChange = (e) => {
    setAlbumFiles(Array.from(e.target.files));
  };

  const [provinces, setProvinces] = useState([]);
  const [amphures, setAmphures] = useState([]);
  const [subDistricts, setSubDistricts] = useState([]);

  const [selectedIds, setSelectedIds] = useState({
    provinceId: "",
    amphureId: "",
    subDistrictId: "",
  });

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  useEffect(() => {
    axios
      .get("/api/getCategories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Category fetch failed:", err));
  }, []);

  useEffect(() => {
    axios
      .get("/api/locations?type=provinces")
      .then((res) => setProvinces(res.data))
      .catch((err) => console.error("Province fetch failed:", err));
  }, []);

  useEffect(() => {
    if (selectedIds.provinceId) {
      axios
        .get(`/api/locations?type=amphures&parentId=${selectedIds.provinceId}`)
        .then((res) => {
          setAmphures(res.data);
          setSubDistricts([]);
          setSelectedIds((prev) => ({
            ...prev,
            amphureId: "",
            subDistrictId: "",
          }));
        });
    }
  }, [selectedIds.provinceId]);

  // Fetch Sub-districts when Amphure changes
  useEffect(() => {
    if (selectedIds.amphureId) {
      axios
        .get(
          `/api/locations?type=sub_districts&parentId=${selectedIds.amphureId}`,
        )
        .then((res) => {
          setSubDistricts(res.data);
          setSelectedIds((prev) => ({ ...prev, subDistrictId: "" }));
        });
    }
  }, [selectedIds.amphureId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedIds.subDistrictId) {
      alert("Please select a Province, District, and Sub-district.");
      return;
    }

    const namePrefix = formData.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with dashes
      .replace(/[^\w-]/g, ""); // Remove special characters

    const albumFileNames = albumFiles.map(
      (_, index) => `/images/attractions/${namePrefix}-${index + 1}.jpg`,
    );

    const payload = {
      method: 'insert',
      name: formData.name,
      sub_district_id: selectedIds.subDistrictId,
      location: formData.location,
      openHour: formData.openHour,
      tel: formData.tel,
      igUrl: formData.ig,
      facebookUrl: formData.facebook,
      tiktokUrl: formData.tiktokUrl,
      googleMapsUrl: formData.googleMapsUrl,
      description: formData.description,
      category_id: selectedCategoryId,
      thumbnail: `/images/attractions/${namePrefix}-thumbnail.jpg`,
      albumFiles: albumFileNames,
    };
    console.table(payload);

    try {
      const response = await axios.post("/api/attractions", payload);

      if (response.status === 201) {
        alert("Success! Attraction added to MySQL database. 🌱");

        // Reset form data
        setFormData({
          name: "",
          location: "",
          openHour: "",
          tel: "",
          ig: "",
          facebook: "",
          googleMapsUrl: "",
          description: "",
        });

        // FIX: Corrected casing for the setter function
        setSelectedIds({ provinceId: "", amphureId: "", subDistrictId: "" });
        setSelectedCategoryId("");
        setAlbumFiles([]);
      }
    } catch (error) {
      // Improved error logging for debugging connection issues
      const errorMessage =
        error.response?.data?.error || "Connection to API failed";
      console.error("Submission Error:", error);
      alert(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="">
          Add New Attraction
        </h2>
        <HorizontalRule borderColor="border-primary" />

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6 uppercase"
        >
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
                className="bg-transparent border-b-2 border-gray-800 p-2 outline-none w-full"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="opacity-60">Category</label>
            <select
              className="bg-transparent border-b-2 border-primary p-2 outline-none text-primary  uppercase"
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
              placeholder="PACHANIYOM, TAMBON BANG PROK, PATHUM THANI"
              className="bg-transparent border-b-2 border-primary p-2 focus:border-primary outline-none transition-colors text-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Province Dropdown */}
            <div className="flex flex-col space-y-2">
              <label className="opacity-60">Province</label>
              <select
                className="bg-transparent border-b-2 border-primary p-2 outline-none text-primary"
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
                disabled={!amphures.length}
                className="bg-transparent border-b-2 border-primary p-2 outline-none text-primary disabled:opacity-30"
                onChange={(e) =>
                  setSelectedIds((prev) => ({
                    ...prev,
                    amphureId: e.target.value,
                  }))
                }
              >
                <option value="">Select District</option>
                {amphures.map((a) => (
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
                className="bg-transparent border-b-2 border-primary p-2 outline-none text-primary disabled:opacity-30"
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
                placeholder="wed-sun 10:00-17:00"
                className="bg-transparent border-b-2 border-primary p-2 focus:border-primary outline-none transition-colors text-primary"
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
                className="bg-transparent border-b-2 border-primary p-2 focus:border-primary outline-none transition-colors text-primary"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="opacity-60">Instagram</label>
              <input
                type="text"
                name="ig"
                value={formData.ig}
                onChange={handleChange}
                placeholder="instagram link"
                className="bg-transparent border-b-2 border-primary p-2 focus:border-primary outline-none transition-colors text-primary"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="opacity-60">Facebook</label>
              <input
                type="text"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                placeholder="facebook link"
                className="bg-transparent border-b-2 border-primary p-2 focus:border-primary outline-none transition-colors text-primary"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="opacity-60">Tiktok</label>
              <input
                type="text"
                name="Tiktok"
                value={formData.fiktok}
                onChange={handleChange}
                placeholder="facebook link"
                className="bg-transparent border-b-2 border-primary p-2 focus:border-primary outline-none transition-colors text-primary"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="opacity-60">Google Maps Link</label>
              <input
                type="url"
                name="googleMapsUrl"
                value={formData.googleMapsUrl}
                onChange={handleChange}
                placeholder="https://maps.app..."
                className="bg-transparent border-b-2 border-primary p-2 focus:border-primary outline-none transition-colors text-primary"
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
              className="bg-transparent border-2 border-primary/20 p-4 focus:border-primary outline-none transition-colors text-primary lowercase first-letter:uppercase leading-relaxed"
            />
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

export default AttractionForm;
