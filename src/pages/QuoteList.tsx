import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axios } from "../services/axios";
import moment from "moment";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface Quote {
  id: string;
  text: string;
  mediaUrl: string;
  username: string;
  created_at: string;
}

const QuoteList: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [token] = useLocalStorage<string | null>("authToken", null);

  useEffect(() => {
    if (hasMore && token) {
      fetchQuotes();
    }
  }, [page, token]);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/getQuotes?limit=10&offset=${page * 10}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (data?.data.length === 0) {
        setHasMore(false);
      } else {
        setQuotes((prevQuotes) => [...prevQuotes, ...data?.data]);
      }
    } catch (err) {
      console.error("Error fetching quotes:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(page + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-center text-indigo-600 mb-8">
        Quotes Gallery
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {quotes.map((quote) => (
          <div
            key={quote.id}
            className="relative bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300"
          >
            <div className="relative h-64">
              <img
                src={quote.mediaUrl}
                alt="Quote"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <p className="text-white text-lg font-semibold text-center p-4">
                  {quote.text}
                </p>
              </div>
            </div>

            <div className="p-4 flex justify-between">
              <p className="text-sm font-medium text-gray-700">
                By: {quote.username}
              </p>
              <p className="text-sm text-gray-500">
                {moment(quote.created_at).format("MMM DD, YYYY")}
              </p>
            </div>
          </div>
        ))}
      </div>

      {hasMore && !loading && (
        <button
          onClick={loadMore}
          className="mt-8 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out"
        >
          Load More
        </button>
      )}

      <Link
        to="/create-quote"
        className="fixed bottom-8 right-8 bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 transition transform hover:rotate-45 duration-300"
      >
        <span className="text-xl font-bold">+</span>
      </Link>

      {loading && <p className="text-center text-gray-600">Loading...</p>}
    </div>
  );
};

export default QuoteList;
