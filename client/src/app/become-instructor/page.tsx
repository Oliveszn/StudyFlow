import { BookOpen, DollarSign, Users } from "lucide-react";

export default function BecomeInstructorPage() {
  return (
    <main className="min-h-screen">
      <section className="h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl md:text-6xl font-semibold md:font-bold text-gray-900 mb-6">
            Come teach with us
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Become an instructor and change lives — including your own
          </p>
          <button className="bg-main hover:bg-main-foreground text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
            Get Started
          </button>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
            So many reasons to start
          </h2>

          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1 text-center items-center">
              <div className="flex justify-center items-center mb-4">
                <BookOpen className="w-12 h-12 text-main" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Teach your way
              </h3>
              <p className="text-gray-600 text-lg">
                Publish the course you want, in the way you want, and always
                have control of your own content.
              </p>
            </div>

            <div className="flex-1 text-center items-center">
              <div className="flex justify-center items-center mb-4">
                <Users className="w-12 h-12 text-main" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Inspire learners
              </h3>
              <p className="text-gray-600 text-lg">
                Teach what you know and help learners explore their interests,
                gain new skills, and advance their careers.
              </p>
            </div>

            <div className="flex-1 text-center items-center">
              <div className="flex justify-center items-center mb-4">
                <DollarSign className="w-12 h-12 text-main" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Get rewarded
              </h3>
              <p className="text-gray-600 text-lg">
                Expand your professional network, build your expertise, and earn
                money on each paid enrollment.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Become an instructor today
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Join one of the world's largest online learning marketplaces.
          </p>
          <button className="bg-main hover:bg-main-foreground text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
            Get Started
          </button>
        </div>
      </section>
    </main>
  );
}
