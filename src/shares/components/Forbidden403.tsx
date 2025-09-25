import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldOff } from "lucide-react";

const Forbidden403: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-red-100 p-6 rounded-full mb-6 shadow-md"
      >
        <ShieldOff className="w-16 h-16 text-red-500" />
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-5xl font-bold text-gray-800 mb-4"
      >
        403
      </motion.h1>

      {/* Subtitle */}
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-2xl font-semibold text-gray-600 mb-3"
      >
        Forbidden Access
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-gray-500 text-center max-w-md mb-8"
      >
        Oops! You don’t have permission to access this page. Please check your account role or
        contact the administrator for help.
      </motion.p>

      {/* Button actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex space-x-4"
      >
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200"
        >
          Go Back
        </button>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md"
        >
          Go to Dashboard
        </button>
      </motion.div>
    </div>
  );
};

export default Forbidden403;
