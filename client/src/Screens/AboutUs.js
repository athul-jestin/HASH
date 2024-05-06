import React from "react";
import { FiPhoneCall, FiMapPin, FiMail } from "react-icons/fi";
import Head from "../Components/Head";
import Layout from "./../Layout/Layout";

function AboutUs() {
  return (
    <Layout>
      <div className="min-height-screen container mx-auto px-2 my-6">
        <Head title="About Us" />
        <div className="xl:py-20 py-10 px-4">
          <div className="grid grid-flow-row xl:grid-cols-2 gap-4 xl:gap-16 items-center">
            <div>
              <h3 className="text-xl lg:text-3xl mb-4 font-semibold">
                Welcome to The HASH
              </h3>
              <div className="mt-3 text-sm leading-8 text-text">
                <p>
                Step into the world of entertainment with us!
                At Hash, we're all about bringing joy and excitement to your screens.
                Our passionate team of streamers is here to make you laugh, gasp, and maybe even shed a tear or two.
                From thrilling gaming adventures to creative endeavors and everything in between, we've got something for everyone.
                So grab your popcorn, kick back, and join our community as we embark on a journey full of fun and surprises.
                Welcome to the magic of streaming, welcome to HASH!
                </p>
              </div>
            </div>
            <img
              src="/images/about2.jpg"
              alt="aboutus"
              className="w-full xl:block hidden h-header rounded-lg object-cover"
            />
          </div>
        </div>
        <div className="grid mg:grid-cols-2 gap-6 lg:my-20 my-10 lg:grid-cols-3 xl:gap-8">
          {ContactData.map((item) => (
            <div
              key={item.id}
              className="border border-border flex-colo p-10 bg-dry rounded-lg text-center"
            >
              <span className="flex-colo w-20 h-20 mb-4 rounded-full bg-main text-subMain text-2xl">
                <item.icon />
              </span>
              <h5 className="text-xl font-semibold mb-2">{item.title}</h5>
              <p className="mb-0 text-sm text-text leading-7">
                {item.info}
                <a href={`mailto:${item.contact}`} className="text-blue-600">
                  {item.contact}
                </a>{" "}
                
              </p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

const ContactData = [
  {
    id: 1,
    title: "Email Us",
    info: "",
    icon: FiMail,
    contact: "info@hash.com",
  },
  {
    id: 2,
    title: "Call Us",
    info: "",
    icon: FiPhoneCall,
    contact: "+91 8547289376",
  },
  {
    id: 3,
    title: "Location",
    info: "",
    icon: FiMapPin,
    contact: "Jyothi Engineering College, Thrissur, Kerala, India",
  },
];

export default AboutUs;
