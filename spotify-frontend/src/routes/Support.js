import React from "react";
import MeloVibe from "../assets/images/MeloVibe.png";

function Support() {
  return (
    <div className="w-full h-full bg-purple-300">
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-white">
          Melovibe Music Support
        </h1>
        <p className="mb-8">
          Welcome to Melovibe Music Support! We're here to assist you with any
          questions or issues you may have regarding our platform. Below are
          some common topics and solutions to help you get started.
        </p>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4  text-white">
            Frequently Asked Questions (FAQs)
          </h2>

          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2  text-white">
              Account & Registration
            </h3>
            <p>
              <strong>How do I create an account on Melovibe?</strong>
              <br />
              Getting started is super easy! Just log in at start of the
              Melovibe to create your account. And hey, once you're in, you
              won't have to keep logging in every time you visit. We've got your
              back!
            </p>
          </div>

          {/* Add other FAQ sections as needed */}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4  text-white">Contact Us</h2>
          <p className="font-bold mb-4">
            If you have any other questions, concerns, or feedback, please don't
            hesitate to reach out to us. You can contact our support team via
            email at{" "}
            <a href="mailto: support@melovibe.com " className="text-white">
              support@melovibe.com
            </a>
            , and we'll get back to you as soon as possible.
          </p>
        </div>

        <p className="text-sm text-white">
          Thank you for choosing Melovibe Music!
        </p>
      </div>
    </div>
  );
}

export default Support;
