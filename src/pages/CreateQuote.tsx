import React, { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import { axios } from "../services/axios";
import Axios from "axios";

const CreateQuote: React.FC = () => {
  const [quoteText, setQuoteText] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [token] = useLocalStorage<string | null>("authToken", null);
  const navigate = useNavigate();

  // Handle image file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  // Handle file upload to get mediaUrl
  const uploadFile = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const { data } = await Axios.post(
        "https://crafto.app/crafto/v1.0/media/assignment/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMediaUrl(data[0]?.url);
    } catch (err) {
      console.error("File upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission to create a quote
  const handleSubmit = async () => {
    if (!quoteText || !mediaUrl) {
      alert("Please provide quote text and upload an image.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "/postQuote",
        {
          text: quoteText,
          mediaUrl: mediaUrl,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.status === 200) {
        alert("Quote created successfully!");
        navigate("/quotes"); // Navigate to the Quote List page after submission
      }
    } catch (err: any) {
      alert(`Error creating quote: ${err?.response?.data?.error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-indigo-600 mb-6">
        Create a Quote
      </h1>

      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
        <textarea
          className="w-full h-24 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
          placeholder="Enter your quote..."
          value={quoteText}
          onChange={(e) => setQuoteText(e.target.value)}
        />
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            id="upload-image"
          />
          {file && (
            <p className="text-gray-700 mt-2">
              Selected file: <span className="font-semibold">{file.name}</span>
            </p>
          )}
        </div>
        <button
          onClick={uploadFile}
          disabled={loading || !file}
          className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-lg mb-4 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
          }`}
        >
          {loading ? "Uploading..." : "Upload Image"}
        </button>
        {mediaUrl && (
          <div className="mb-4">
            <p className="text-gray-700">Image Uploaded:</p>
            <img
              src={mediaUrl}
              alt="Uploaded"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}
        <button
          onClick={handleSubmit}
          disabled={loading || !quoteText || !mediaUrl}
          className={`w-full bg-green-600 text-white py-2 px-4 rounded-lg ${
            loading || !quoteText || !mediaUrl
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-green-700"
          }`}
        >
          {loading ? "Submitting..." : "Create Quote"}
        </button>
      </div>
    </div>
  );
};

export default CreateQuote;
