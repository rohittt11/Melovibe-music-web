import React from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import MeloVibe from "../assets/images/MeloVibe.png";

function Support() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-purple-300 overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors mb-4 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 w-fit"
          aria-label="Go back"
        >
          <Icon icon="mdi:arrow-left" fontSize={22} />
          <span className="text-sm font-semibold">Back</span>
        </button>

        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-white">
            Melovibe Music Support
          </h1>

          <p className="mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed">
            Welcome to Melovibe Music Support! We're here to assist you with any
            questions or issues you may have regarding our platform. Below are
            some common topics and solutions to help you get started.
          </p>

          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-white">
              Frequently Asked Questions (FAQs)
            </h2>

            <div className="mb-4 text-left sm:text-center">
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">
                Account & Registration
              </h3>
              <p className="text-sm sm:text-base leading-relaxed">
                <strong>How do I create an account on Melovibe?</strong>
                <br />
                Getting started is super easy! Just log in at the start of the
                Melovibe to create your account. And hey, once you're in, you
                won't have to keep logging in every time you visit. We've got
                your back!
              </p>
            </div>

            {/* Add other FAQ sections as needed */}
          </div>

          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-white">
              Contact Us
            </h2>
            <p className="font-bold mb-4 text-sm sm:text-base leading-relaxed break-words">
              If you have any other questions, concerns, or feedback, please
              don't hesitate to reach out to us. You can contact our support
              team via email at{" "}
              <a
                href="mailto:support@melovibe.com"
                className="text-white underline"
              >
                support@melovibe.com
              </a>
              , and we'll get back to you as soon as possible.
            </p>
          </div>

          <p className="text-xs sm:text-sm text-white">
            Thank you for choosing Melovibe Music!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Support;
