"use client";
import Image from "next/image";

const Hero2 = () => {
  return (
    <section className="w-full py-8 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Left Side - Map */}
          <div className="w-full flex flex-col">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-full">
              {/* Header */}
              <div className="bg-[#002c58] px-6 lg:px-8 py-4 lg:py-6 flex-shrink-0">
                <h1 className="text-xl lg:text-3xl font-bold text-white text-center">
                  स्रोत नक्सा
                </h1>
              </div>

              {/* Content */}
              <div className="flex-1 p-4 lg:p-6 flex items-center justify-center">
                <div className="relative w-full h-full min-h-[300px] lg:min-h-[400px]">
                  <Image
                    src="/assets/images/haripur_map.jpg"
                    alt="हरिपुर नगरपालिकाको नक्सा"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Municipality Information */}
          <div className="w-full flex flex-col">
            <div className="bg-[#f0f8ff] rounded-2xl shadow-xl overflow-hidden flex flex-col h-full">
              {/* Header */}
              <div className="bg-[#002c58] px-6 lg:px-8 py-4 lg:py-6 flex-shrink-0">
                <h1 className="text-xl lg:text-3xl font-bold text-white text-center">
                  संक्षिप्त परिचय
                </h1>
              </div>

              {/* Content */}
              <div className="px-6 lg:px-8 py-6 lg:py-8 flex-1 flex flex-col justify-center">
                <div className="prose prose-sm lg:prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p className="text-sm lg:text-lg mb-4 lg:mb-6 text-justify">
                    हरिपुर नगरपालिका सर्लाही जिल्लामा अवस्थित एक महत्वपूर्ण
                    स्थानीय तह हो, जसको स्थापना वि.सं. २०७३ मा भएको हो। कुल ९
                    वटा वडा रहेको यस नगरपालिकाको क्षेत्रफल ६६.८६ वर्ग कि.मि. मा
                    फैलिएको छ। यहाँको भौगोलिक बनावट समथर छ र कृषिको लागि उपयुक्त
                    मानिन्छ।
                  </p>

                  <p className="text-sm lg:text-lg mb-4 lg:mb-6 text-justify">
                    यस नगरपालिकाको पूर्वमा ईश्वरपुर, लालबन्दी नगरपालिका र
                    चन्द्रनगर गाउँपालिका, पश्चिममा बागमती नगरपालिका, उत्तरमा
                    हरिवन नगरपालिका तथा दक्षिणमा कविलासी र बरहथवा नगरपालिकाहरू
                    रहेका छन्। यहाँको सीमाना र सञ्जालले यसलाई व्यापार र आवागमनको
                    दृष्टिले पनि सशक्त बनाएको छ।
                  </p>
                  <p className="text-sm lg:text-lg mb-4 lg:mb-6 text-justify">
                    हरिपुर नगरपालिकामा विभिन्न जातजाति र धर्मका मानिसहरू बसोबास
                    गर्दै आएका छन्। सामाजिक सद्भाव, आपसी मेलमिलाप र सांस्कृतिक
                    विविधता यहाँको पहिचान हो। चाडपर्व, भाषा, रितिरिवाजको
                    बहुलताले यो नगरपालिका सांस्कृतिक दृष्टिले पनि समृद्ध छ।
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero2;
