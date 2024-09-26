import React, { useEffect, useState } from "react";
import axiosClient from "../axiosClient"; // Adjust the import path as necessary
import { useOutletContext } from "react-router-dom";
import { useStateContext } from "../context/contextprovider";
import { Modal, TextField, Button, Rating } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import profile from "../assets/john.jpg"; // Import the cover image

export default function Portfolio() {
  const { isSidebarOpen } = useOutletContext();
  const { user, setUser } = useStateContext();
  const [performer, setPerformer] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    location: "",
    description: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.id) {
      axiosClient
        .get(`/performer/${user.id}`)
        .then((response) => {
          const { portfolio, user } = response.data;
          setPerformer(response.data);
          setFormData({
            name: user.name || "",
            category: portfolio?.category || "",
            location: portfolio?.location || "",
            description: portfolio?.description || "",
          });
        })
        .catch((error) => {
          setError(error.message || "Error fetching performer profile");
          console.error("Error fetching performer profile:", error);
        });
    }
  }, [user]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    setEditOpen(false);
    // Add save logic to update the profile data in your backend here
    toast.success("Profile updated successfully!");
  };

  if (!performer) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className={`flex h-screen bg-gray-100 transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "ml-[20rem]" : "ml-5"
      }`}
    >
      <ToastContainer />
      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Profile</h1>
        </header>

        <section>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="relative">
              <img
                src={profile} // Use the imported cover image here
                alt="Cover Photo"
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-0 left-6 transform translate-y-1/2">
                <img
                  src={
                    performer?.image_profile
                      ? `http://127.0.0.1:8000/storage/${performer.image_profile}`
                      : "https://via.placeholder.com/150"
                  }
                  alt="Profile Photo"
                  width={100}
                  height={100}
                  className="rounded-full border-4 border-white"
                />
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{formData.name}</h2>
                  <p className="text-sm text-gray-500">{formData.category}</p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <span className="material-icons text-sm mr-1">
                      location_on
                    </span>
                    {formData.location}
                  </p>
                  <p className="flex items-center mt-2">
                    <Rating
                      value={4.9}
                      readOnly
                      precision={0.1}
                      className="text-yellow-500"
                    />
                    <span className="ml-2 text-gray-600">(4.9/5, 26 reviews)</span>
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditOpen(true)}
                    className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                  >
                    Edit
                  </button>
                  <button className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600">
                    Post Photo/Video
                  </button>
                </div>
              </div>

              <div className="mt-6 border-t border-b border-gray-200">
                <nav className="flex space-x-4 text-center">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`py-4 text-gray-700 font-semibold ${
                      activeTab === "overview"
                        ? "border-b-2 border-indigo-600"
                        : "hover:border-b-2 hover:border-indigo-600"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className={`py-4 text-gray-700 font-semibold ${
                      activeTab === "reviews"
                        ? "border-b-2 border-indigo-600"
                        : "hover:border-b-2 hover:border-indigo-600"
                    }`}
                  >
                    Reviews
                  </button>
                  <button
                    onClick={() => setActiveTab("media")}
                    className={`py-4 text-gray-700 font-semibold ${
                      activeTab === "media"
                        ? "border-b-2 border-indigo-600"
                        : "hover:border-b-2 hover:border-indigo-600"
                    }`}
                  >
                    Photos & Videos
                  </button>
                </nav>
              </div>

              <div className="mt-6">
                {activeTab === "overview" && (
                  <div>
                    <h3 className="font-semibold text-lg">About {formData.name}</h3>
                    <p className="text-gray-600">{formData.description}</p>

                    <h4 className="font-semibold mt-4">Experience</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      <li>5 years of experience performing at weddings and corporate events.</li>
                      <li>Regular performer at the annual Classical Music Festival.</li>
                      <li>Guest artist with the City Symphony Orchestra.</li>
                    </ul>

                    <h4 className="font-semibold mt-4">Skills</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      <li>Classical Vocal Techniques</li>
                      <li>Music Theory and Composition</li>
                      <li>Piano Accompaniment</li>
                      <li>Stage Presence and Performance Art</li>
                    </ul>

                    <h4 className="font-semibold mt-4">Notable Performances</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      <li>Soloist at the Gala Concert in 2023</li>
                      <li>Featured artist at the Grand Opera House</li>
                      <li>Performed for local charities, raising funds through music</li>
                    </ul>

                    <h4 className="font-semibold mt-4">Testimonials</h4>
                    <p className="text-gray-600">
                      "Tony's performances are enchanting, and his voice captivates the audience. A true artist!" - Event Organizer
                    </p>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div>
                    <h3 className="font-semibold text-lg">Reviews</h3>
                    <div className="mt-4">
                      <div className="border-b pb-4 mb-4 flex">
                        <img
                          src="/robin.png"
                          alt="Nico Robin"
                          width={40}
                          height={40}
                          className="rounded-full mr-3 object-cover"
                        />
                        <div>
                          <p className="font-semibold">Nico Robin</p>
                          <Rating value={5} readOnly precision={0.5} className="text-yellow-500" />
                          <p className="text-gray-600">
                            "Tony's voice is absolutely mesmerizing! He performed at my wedding, and everyone was blown away by his talent."
                          </p>
                          <button className="text-indigo-600 mt-2">Reply</button>
                        </div>
                      </div>
                      <div className="border-b pb-4 mb-4 flex">
                        <img
                          src="/carrot3.png"
                          alt="Usopp"
                          width={40}
                          height={40}
                          className="rounded-full mr-3 object-cover"
                        />
                        <div>
                          <p className="font-semibold">Usopp</p>
                          <Rating value={4.5} readOnly precision={0.5} className="text-yellow-500" />
                          <p className="text-gray-600">
                            "A truly memorable performance! He was the highlight of the evening."
                          </p>
                          <button className="text-indigo-600 mt-2">Reply</button>
                        </div>
                      </div>
                      <div className="border-b pb-4 mb-4 flex">
                        <img
                          src="/law.png"
                          alt="Trafalgar Law"
                          width={40}
                          height={40}
                          className="rounded-full mr-3 object-cover"
                        />
                        <div>
                          <p className="font-semibold">Trafalgar Law</p>
                          <Rating value={4.7} readOnly precision={0.5} className="text-yellow-500" />
                          <p className="text-gray-600">
                            "His music speaks to the soul! An incredible artist with a lot of passion."
                          </p>
                          <button className="text-indigo-600 mt-2">Reply</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "media" && (
                  <div>
                    <h3 className="font-semibold text-lg">Photos & Videos</h3>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <img src="/performance1.jpg" alt="Performance" className="w-full h-40 object-cover rounded-lg" />
                      <img src="/performance2.jpg" alt="Performance" className="w-full h-40 object-cover rounded-lg" />
                      <img src="/performance3.jpg" alt="Performance" className="w-full h-40 object-cover rounded-lg" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Edit Profile Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} className="flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl mb-4">Edit Profile</h2>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
          <div className="flex justify-end mt-4">
            <Button variant="outlined" onClick={() => setEditOpen(false)} className="mr-2">
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
