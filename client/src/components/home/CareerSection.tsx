import Image from "next/image";
import { Button } from "../ui/button";

export default function CareerSection() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#202230] flex flex-col md:flex-row rounded-xl overflow-hidden">
          <div className="md:w-1/2 p-10 space-y-6 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-semibold text-white leading-tight">
              Reimagine your career in the AI era
            </h1>

            <p className="text-gray-300 text-base leading-relaxed">
              Future-proof your skills with Personal Plan. Get access to a
              variety of fresh content from real-world experts.
            </p>

            <ul className="grid grid-cols-2 gap-3 text-sm text-gray-200">
              <li>• Learn AI and more</li>
              <li>• Prep for a certification</li>
              <li>• Advance your career</li>
              <li>• Practice with courses</li>
            </ul>

            <div>
              <Button className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-md font-medium">
                Start your Career
              </Button>
            </div>
          </div>

          <div className="md:w-1/2 relative min-h-[300px]">
            <Image
              src="/ai-career@1x.webp"
              alt="career image"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
