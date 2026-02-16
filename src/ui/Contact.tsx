import FeedbackForm from "@/components/contact/feedback";
import HomeMap from "./HomeMap";

export default function Contact() {
  return (
    <div className="w-full min-h-screen  pb-8">
      {/* Header Section */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
            सम्पर्क र सुझाब
          </h1>
          <div className="w-44 h-1 bg-blue-600 mx-auto"></div>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
          <p className="text-gray-700 leading-relaxed text-lg text-center">
            यदि तपाईंलाई हरिपुर नगरपालिकाको डिजिटल प्रोफ़ाइलसँग सम्बन्धित कुनै
            जानकारी, गुनासो, सुझाव वा सेवाहरूको आवश्यकता छ भने हामीलाई सम्पर्क
            गर्न सक्नुहुन्छ। हामी तपाईंको आवाजलाई सम्मानपूर्वक सुन्ने र आवश्यक
            सहयोग पुर्‍याउने प्रतिबद्धता जनाउँछौं।
          </p>
        </div>

        {/* Contact Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[600px] mb-16">
          {/* Left Side - Map and Contact Info */}
          <div className="flex flex-col h-full min-h-[600px]">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-5 border-b border-gray-200 pb-2">
                सम्पर्क जानकारी
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">इमेल</p>
                    <p className="font-semibold text-gray-900">
                      info@haripurmun.gov.np
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">फोन</p>
                    <p className="font-semibold text-gray-900">+1234567890</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Section - Takes remaining space */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
              <div className="h-full">
                <HomeMap />
              </div>
            </div>
          </div>

          {/* Right Side - Feedback Form */}
          <div className="h-full min-h-[600px]">
            <div className=" h-full">
              <FeedbackForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
