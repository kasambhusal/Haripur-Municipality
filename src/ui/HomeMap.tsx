export default function HomeMap() {
  return (
    <div className="w-full h-full">
      <iframe
        className="w-full h-full rounded-lg"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4449.227250596904!2d85.56782852188203!3d27.018807207174504!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ec80ce299a16a9%3A0x140495ce891d2495!2sHaripur%20municipality!5e1!3m2!1sen!2snp!4v1750137981844!5m2!1sen!2snp"
        style={{ border: 0, minHeight: "500px" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
