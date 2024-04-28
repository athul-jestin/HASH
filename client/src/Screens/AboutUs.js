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
                Welcome to our HASH
              </h3>
              <div className="mt-3 text-sm leading-8 text-text">
                <p>
                  At HASH, we want to entertain the world. Whatever your
                  taste, and no matter where you live, we give you access to
                  videos . Our members control what they want to watch,
                  when they want it, with no ads, in one simple subscription.
                  We’re streaming in more than 30 languages and 190 countries,
                  because great stories can come from anywhere and be loved
                  everywhere. We are the world’s biggest fans of entertainment,
                  and we’re always looking to help you find your next favorite
                  story.
                </p>
                <p>
                  At HASH, we have an amazing and unique employee culture.
                  Find out first-hand what it’s really like to work here, and to
                  learn more about our company values.
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
    contact: "info@HAsh.com",
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
