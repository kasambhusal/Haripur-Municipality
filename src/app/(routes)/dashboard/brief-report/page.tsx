// app/dashboard/report/page.tsx

export default function page() {
  return (
    // The outer container takes up the full height of the dashboard area
    <div className="flex flex-col h-[calc(100vh-4rem)] ">
      

      {/* PDF Container - Keeps the PDF constrained so it doesn't break the UI */}
      <div className="flex-1 w-full bg-gray-100 rounded-lg shadow-sm overflow-hidden border border-gray-200">
        
        {/* The actual PDF Embed */}
        <iframe
          src="/report/brief-report.pdf" // The #toolbar=0 hides the top menu for a cleaner look (optional)
          className="w-full h-full"
          title="Financial Report PDF"
        />
        
        {/* Note: You can also use <object data="/reports/sample-report.pdf" type="application/pdf" className="w-full h-full" /> */}
      </div>
      
    </div>
  );
}