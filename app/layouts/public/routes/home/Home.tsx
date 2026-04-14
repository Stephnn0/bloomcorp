import { Link } from "react-router";
import heroImg from "~/assets/hero.jpg";
import img1 from "~/assets/1.jpg";
import img2 from "~/assets/2.jpg";
import img3 from "~/assets/3.jpg";
import img4 from "~/assets/4.jpg";

const services = [
  {
    title: "Corporate Gifting Programs",
    description:
      "Set up automated flower deliveries for your entire team. We manage birthdays, work anniversaries, and milestones so you never miss an occasion. Perfect for companies of any size looking to boost employee morale.",
    image: img1,
  },
  {
    title: "Custom Event Arrangements",
    description:
      "From office celebrations to company galas, we create stunning floral arrangements tailored to your event. Premium Ecuadorian roses and tropical flowers designed to impress your guests and clients.",
    image: img2,
  },
  {
    title: "Subscription & On-Demand Delivery",
    description:
      "Choose a recurring subscription for weekly office flowers or order on-demand for special occasions. Flexible plans with transparent pay-per-order pricing and no long-term commitments.",
    image: img3,
  },
];

const occasions = [
  "Birthdays",
  "Work Anniversaries",
  "Promotions",
  "Retirements",
  "Holidays",
  "Thank You",
];

const serviceAreas = [
  "Downtown Miami",
  "Brickell",
  "Coral Gables",
  "Coconut Grove",
  "Wynwood",
  "Miami Beach",
  "South Beach",
  "Doral",
  "Aventura",
  "Kendall",
  "Hialeah",
  "Miami Lakes",
  "Key Biscayne",
  "Pinecrest",
  "Homestead",
  "North Miami",
  "North Miami Beach",
  "Miami Springs",
  "Sweetwater",
  "Westchester",
  "Midtown Miami",
  "Edgewater",
  "Little Havana",
  "Overtown",
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Beautiful flower arrangements"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Celebrate Your Team with{" "}
              <span className="text-rose-300">Beautiful Flowers</span>
            </h1>
            <p className="text-xl text-gray-200 mb-10">
              Automate employee recognition with premium flower deliveries from
              Ecuador. Birthdays, anniversaries, milestones — we handle it all
              across Miami.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-rose-600 text-white text-lg font-semibold rounded-xl hover:bg-rose-700 transition-colors shadow-lg"
              >
                Start Free Trial
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-4 bg-white/10 text-white text-lg font-semibold rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Occasions */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-gray-500 mb-6">
            PERFECT FOR EVERY OCCASION
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {occasions.map((occasion) => (
              <span
                key={occasion}
                className="px-4 py-2 bg-rose-50 text-rose-700 rounded-full text-sm font-medium"
              >
                {occasion}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From automated corporate gifting to custom event arrangements, we
              bring the beauty of Ecuadorian flowers to your workplace.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-rose-100 transition-all group"
              >
                <div className="h-52 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full-width Image */}
      <section className="w-full">
        <img
          src={img4}
          alt="Beautiful flower arrangements"
          className="w-full h-auto object-cover"
        />
      </section>

      {/* Service Areas */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Service Areas in Miami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We deliver fresh Ecuadorian flowers across the greater Miami area.
              Same-day and next-day delivery available in all listed
              neighborhoods.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {serviceAreas.map((area) => (
              <span
                key={area}
                className="px-5 py-2.5 bg-white text-gray-700 rounded-full text-sm font-medium border border-gray-200 hover:border-rose-300 hover:text-rose-600 transition-colors cursor-default"
              >
                {area}
              </span>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-8">
            Don't see your area?{" "}
            <Link to="/contact" className="text-rose-600 font-medium hover:text-rose-700">
              Contact us
            </Link>{" "}
            — we may still be able to deliver to you.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-rose-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Brighten Your Workplace?
          </h2>
          <p className="text-rose-100 text-lg mb-8">
            Join companies that use Roses to boost employee engagement and build
            a culture of recognition.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-4 bg-white text-rose-600 text-lg font-semibold rounded-xl hover:bg-rose-50 transition-colors"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
}
