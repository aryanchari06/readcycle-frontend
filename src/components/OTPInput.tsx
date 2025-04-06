"use client";

import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const OTPInput = ({ onOTPSubmit }: { onOTPSubmit: (otp: string) => void }) => {
  const [otpValue, setOtpValue] = useState("");
  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 md:w-[30vw] self-start mt-0">
      <h2 className="text-xl font-semibold text-[#5D4037] text-center">
        🔐 Enter Your OTP
      </h2>
      <p className="text-sm text-gray-600 text-center mt-2">
        You will receive an OTP on your registered email after confirming your
        purchase.
      </p>
      <div className="mt-4">
        <Input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D4037] transition-all"
          onChange={(e) => {
            setOtpValue(e.currentTarget.value);
          }}
          placeholder="Enter OTP"
          maxLength={6}
        />
        {
          otpValue.length !== 6 && otpValue.length !== 0 && <p className="text-red-600 text-sm mt-2">OTP must have 6 digits!</p>
        }
        <Button
          className="w-full mt-4 bg-[#5D4037] text-white font-semibold py-2 rounded-md hover:bg-[#4D4037] transition-all duration-200"
          onClick={() => onOTPSubmit(otpValue)}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default OTPInput;
