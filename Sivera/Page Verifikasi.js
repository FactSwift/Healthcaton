import React from "react";
import image from "./image.svg";
import rectangle2 from "./rectangle-2.png";
import vector2 from "./vector-2.svg";
import vector3 from "./vector-3.svg";
import vector4 from "./vector-4.svg";
import vector from "./vector.svg";

export const PadgeVerifikasi = () => {
  const verificationOptions = [
    {
      id: 1,
      title: "Unggah KTP",
      icon: vector2,
      iconStyles: "w-[3.67%] h-[5.65%] top-[49.28%] left-[13.67%]",
      buttonStyles: "top-[393px] left-36",
      textStyles: "top-[422px] left-[242px] w-[178px]",
      ariaLabel: "Unggah KTP untuk verifikasi",
    },
    {
      id: 2,
      title: "Verifikasi dengan Kamera",
      icon: image,
      iconStyles: "w-[4.45%] h-[5.17%] top-[49.76%] left-[53.44%]",
      buttonStyles: "top-[393px] left-[662px]",
      textStyles: "top-[422px] left-[763px] w-[296px] whitespace-nowrap",
      ariaLabel: "Verifikasi menggunakan kamera",
    },
    {
      id: 3,
      title: "Unggah KTP dan Selfie",
      icon: null,
      iconGroup: { vector3, vector4 },
      iconStyles: "w-[3.20%] h-[4.93%] top-[65.26%] left-[13.67%]",
      buttonStyles: "top-[524px] left-36 w-[473px] h-[81px]",
      textStyles: "top-[552px] left-[242px] w-[301px]",
      ariaLabel: "Unggah KTP dan foto selfie",
    },
    {
      id: 4,
      title: "Input Hasil ke Sistem",
      icon: vector,
      iconStyles: "w-[3.98%] h-[4.81%] top-[65.62%] left-[53.91%]",
      buttonStyles: "top-[524px] left-[662px] w-[473px] h-[81px]",
      textStyles: "top-[551px] left-[763px] w-[246px] whitespace-nowrap",
      ariaLabel: "Input hasil verifikasi ke sistem",
    },
  ];

  const handleVerificationClick = (optionId) => {
    console.log(`Verification option ${optionId} clicked`);
  };

  const handleBackClick = () => {
    console.log("Back button clicked");
  };

  return (
    <main className="bg-white overflow-hidden w-full min-w-[1280px] h-[832px] relative">
      <div className="absolute top-0 left-0 w-[1282px] h-[832px]">
        <div className="absolute top-0 left-0 w-[1280px] h-[832px] bg-white" />

        <img
          className="absolute top-[25px] left-11 w-[298px] h-[107px] object-cover"
          alt="Logo BPJS Kesehatan"
          src={rectangle2}
        />

        <h1 className="absolute top-[262px] left-[calc(50.00%_-_395px)] w-[788px] bg-[linear-gradient(144deg,rgba(7,64,141,1)_0%,rgba(105,157,98,1)_44%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Montserrat-Bold',Helvetica] font-bold text-transparent text-[64px] text-center tracking-[0] leading-[normal]">
          Verifikasi data bpjs
        </h1>
      </div>

      {verificationOptions.map((option) => (
        <React.Fragment key={option.id}>
          <button
            className={`absolute ${option.buttonStyles} w-[467px] h-20 bg-[#07408d] rounded-[10px] shadow-[0px_4px_4px_#00000040] transition-all duration-200 hover:bg-[#0a4fa3] hover:shadow-[0px_6px_6px_#00000060] active:scale-[0.98] cursor-pointer`}
            onClick={() => handleVerificationClick(option.id)}
            aria-label={option.ariaLabel}
            type="button"
          />

          {option.iconGroup ? (
            <div
              className={`absolute ${option.iconStyles} pointer-events-none`}
              aria-hidden="true"
            >
              <img
                className="absolute w-full h-[37.50%] top-[59.45%] left-[-3.05%]"
                alt=""
                src={option.iconGroup.vector3}
              />
              <img
                className="absolute w-[37.50%] h-[37.50%] top-[-3.05%] left-[28.20%]"
                alt=""
                src={option.iconGroup.vector4}
              />
            </div>
          ) : (
            <img
              className={`absolute ${option.iconStyles} pointer-events-none`}
              alt=""
              src={option.icon}
              aria-hidden="true"
            />
          )}

          <span
            className={`absolute ${option.textStyles} [font-family:'Montserrat-Bold',Helvetica] font-bold text-white text-xl tracking-[0] leading-[normal] pointer-events-none`}
          >
            {option.title}
          </span>
        </React.Fragment>
      ))}

      <button
        className="absolute top-9 left-[1101px] w-[125px] h-[62px] bg-[#d9d9d9] rounded-[10px] shadow-[0px_4px_4px_#00000040] transition-all duration-200 hover:bg-[#c5c5c5] hover:shadow-[0px_6px_6px_#00000060] active:scale-[0.98] cursor-pointer"
        onClick={handleBackClick}
        aria-label="Kembali ke halaman sebelumnya"
        type="button"
      >
        <span className="absolute top-[57px] left-[1127px] w-[74px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#130000] text-base text-center tracking-[0] leading-[normal] pointer-events-none">
          Kembali
        </span>
      </button>
    </main>
  );
};
