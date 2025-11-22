import React, { useState } from "react";
import image2 from "./image-2.png";
import image from "./image.svg";
import rectangle2 from "./rectangle-2.png";
import vector2 from "./vector-2.svg";
import vector3 from "./vector-3.svg";
import vector4 from "./vector-4.svg";
import vector5 from "./vector-5.svg";
import vector6 from "./vector-6.svg";
import vector7 from "./vector-7.svg";
import vector8 from "./vector-8.svg";
import vector from "./vector.svg";

export const PadgeChatbot = () => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddClick = () => {
    console.log("Add button clicked");
  };

  const handleImageUpload = () => {
    console.log("Image upload clicked");
  };

  const handleVoiceInput = () => {
    console.log("Voice input clicked");
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      console.log("Sending message:", inputValue);
      setInputValue("");
    }
  };

  const handleBackClick = () => {
    console.log("Back button clicked");
  };

  return (
    <div className="bg-white overflow-hidden w-full min-w-[1280px] h-[832px] relative">
      <div className="absolute top-0 left-0 w-[1282px] h-[832px]">
        <div className="absolute top-0 left-0 w-[1280px] h-[832px] bg-white" />

        <img
          className="absolute top-[25px] left-11 w-[298px] h-[107px] object-cover"
          alt="BPJS Kesehatan Logo"
          src={rectangle2}
        />

        <h1 className="absolute top-[257px] left-[calc(50.00%_-_160px)] w-[319px] bg-[linear-gradient(144deg,rgba(7,64,141,1)_0%,rgba(105,157,98,1)_44%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Montserrat_Subrayada-Bold',Helvetica] font-bold text-transparent text-[64px] text-center tracking-[0] leading-[normal]">
          SIVERA
        </h1>
      </div>

      <div
        className="absolute w-[3.20%] h-[4.93%] top-[65.26%] left-[13.67%]"
        aria-hidden="true"
      >
        <img
          className="absolute w-full h-[37.50%] top-[59.45%] left-[-3.05%]"
          alt=""
          src={vector}
        />

        <img
          className="absolute w-[37.50%] h-[37.50%] top-[-3.05%] left-[28.20%]"
          alt=""
          src={image}
        />
      </div>

      <img
        className="absolute w-[3.98%] h-[4.81%] top-[65.62%] left-[53.91%]"
        alt=""
        src={vector2}
        aria-hidden="true"
      />

      <img
        className="absolute w-[4.45%] h-[5.17%] top-[49.76%] left-[53.44%]"
        alt=""
        src={vector3}
        aria-hidden="true"
      />

      <img
        className="absolute w-[3.67%] h-[5.65%] top-[49.28%] left-[13.67%]"
        alt=""
        src={vector4}
        aria-hidden="true"
      />

      <button
        className="absolute top-9 left-[1101px] w-[125px] h-[62px] bg-[#d9d9d9] rounded-[10px] shadow-[0px_4px_4px_#00000040] cursor-pointer hover:bg-[#c9c9c9] transition-colors"
        onClick={handleBackClick}
        aria-label="Kembali"
      >
        <span className="absolute top-[21px] left-[26px] w-[74px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#130000] text-base text-center tracking-[0] leading-[normal]">
          Kembali
        </span>
      </button>

      <img
        className="absolute top-[180px] left-[595px] w-[89px] h-[89px] aspect-[1] object-cover"
        alt="SIVERA Avatar"
        src={image2}
      />

      <div className="absolute top-[458px] left-[241px] w-[800px] h-[90px] bg-white rounded-[20px] border border-solid border-[#d9d9d9] shadow-[0px_4px_4px_4px_#00000040]">
        <label
          htmlFor="chat-input"
          className="absolute top-[-21px] left-[18px] w-[141px] [font-family:'Montserrat-Bold',Helvetica] font-bold text-[#b5b7c0] text-xs text-center tracking-[0] leading-[normal]"
        >
          Bertanya ke SIVERA
        </label>

        <button
          className="absolute top-[52px] left-[21px] w-6 h-6 aspect-[1] cursor-pointer hover:opacity-70 transition-opacity"
          onClick={handleAddClick}
          aria-label="Add attachment"
        >
          <img
            className="absolute w-[58.33%] h-[58.33%] top-[20.83%] left-[20.83%]"
            alt=""
            src={vector5}
          />
        </button>

        <input
          id="chat-input"
          type="text"
          className="absolute top-[30px] left-[60px] w-[670px] h-[30px] [font-family:'Montserrat-Bold',Helvetica] font-bold text-[#000000] text-base tracking-[0] leading-[normal] outline-none focus:outline-none"
          placeholder=""
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          aria-label="Chat input"
        />

        <button
          className="absolute top-[52px] left-[711px] w-6 h-6 aspect-[1] cursor-pointer hover:opacity-70 transition-opacity"
          onClick={handleImageUpload}
          aria-label="Upload image"
        >
          <div className="relative w-[83.33%] h-[75.00%] top-[12.50%] left-[8.33%]">
            <img
              className="absolute w-[30.00%] h-[33.33%] top-[34.72%] left-[31.25%]"
              alt=""
              src={vector6}
            />

            <img
              className="absolute w-full h-full top-[-4.17%] left-[-3.75%]"
              alt=""
              src={vector7}
            />
          </div>
        </button>

        <button
          className="absolute top-[52px] left-[752px] w-6 h-6 aspect-[1] cursor-pointer hover:opacity-70 transition-opacity"
          onClick={handleVoiceInput}
          aria-label="Voice input"
        >
          <img
            className="absolute w-[58.33%] h-[79.17%] top-[8.33%] left-[20.83%]"
            alt=""
            src={vector8}
          />
        </button>
      </div>
    </div>
  );
};
