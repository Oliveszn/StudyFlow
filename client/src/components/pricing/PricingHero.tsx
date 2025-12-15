"use client";
import { heroConfig, plans } from "@/config/pricing";
import { ArrowRight, ChevronDown, CircleCheck, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PricingHero() {
  const { title, description } = heroConfig;
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index: any) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <section className="">
      <div className="flex flex-col items-center justify-center mb-10 lg:mb-16">
        <h1 className="text-[clamp(2.0rem,calc(2.0rem+(4.6-2.0)*((100vw-36rem)/(144-36))),4.6rem)] font-semibold leading-normal text-text-primary whitespace-nowrap text-center">
          {title}
        </h1>
        <p className="font-medium text-text-primary font-extralight text-center text-[clamp(0.8rem,calc(0.8rem+(1.2-0.8)*((100vw-36rem)/(144-36))),1.2rem)]">
          {description}
        </p>
      </div>

      <div className="hidden lg:flex gap-6 items-start">
        {plans.map((plan) => (
          <div
            className="w-3/4 bg-background shadow-lg border border-gray-300 border-t-10 border-t-main rounded-md px-6 py-3"
            key={plan.title}
          >
            <header className="bg-gray -mx-6 -my-3">
              <div className="p-4 mb-4">
                <h4 className="font-semibold text-lg">{plan.title}</h4>
                <p className="text-xs text-gray-600">{plan.subTitle}</p>
                <p className="flex items-center text-sm text-gray-600 my-3">
                  <User className="mr-2 size-3" />
                  {plan.people}
                </p>
              </div>
            </header>
            <div className="my-8">
              <p className="font-semibold text-base mb-3">{plan.price}</p>
              <p className="text-gray-500 mb-3">{plan.billing}</p>
              <Link
                href={plan.cta.href}
                className="bg-main text-lg text-background font-semibold leading-tight text-center border-none rounded-md cursor-pointer inline-flex whitespace-nowrap py-3 px-6 flex items-center justify-center w-full my-2"
              >
                {plan.cta.text} <ArrowRight className="text-background ml-3" />
              </Link>
              <ul>
                {plan.benefits.map((benefit, index) => (
                  <li
                    className="flex items-center gap-3 my-2 text-sm font-extralight"
                    key={index}
                  >
                    <CircleCheck className="size-3 text-green-500 " /> {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile View  */}
      <div className="lg:hidden space-y-4">
        {plans.map((plan, index) => (
          <div
            key={plan.title}
            className="bg-white shadow-lg border border-gray-300 rounded-md overflow-hidden"
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-1">{plan.title}</h4>
                <p className="text-xs text-gray-600 mb-2">{plan.subTitle}</p>
                <p className="flex items-center text-sm text-gray-600">
                  <User className="mr-2 size-3" />
                  {plan.people}
                </p>
              </div>
              <ChevronDown
                className={`size-5 text-gray-600 transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? "max-h-[1000px]" : "max-h-0"
              }`}
            >
              <div className="px-4 pb-4 border-t border-gray-200">
                <div className="mt-4">
                  <p className="font-semibold text-base mb-2">{plan.price}</p>
                  <p className="text-gray-500 mb-4">{plan.billing}</p>
                  <a
                    href={plan.cta.href}
                    className="bg-main text-base text-background font-semibold leading-tight text-center border-none rounded-md cursor-pointer inline-flex whitespace-nowrap py-3 px-6 items-center justify-center w-full my-2 transition-colors"
                  >
                    {plan.cta.text} <ArrowRight className="text-white ml-3" />
                  </a>
                  <ul className="mt-4">
                    {plan.benefits.map((benefit, benefitIndex) => (
                      <li
                        className="flex items-center gap-3 my-2 text-sm font-extralight"
                        key={benefitIndex}
                      >
                        <CircleCheck className="size-3 text-green-500 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
