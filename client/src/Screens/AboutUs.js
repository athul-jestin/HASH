import React from "react";
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
      </div>
    </Layout>
  );
}

export default AboutUs;
