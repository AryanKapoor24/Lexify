export default function FeatureCard({ icon, title, description, iconColor = "blue" }) {
  const colorClasses = {
    blue: "bg-blue-100 dark:bg-blue-900 text-blue-600",
    green: "bg-green-100 dark:bg-green-900 text-green-600",
    purple: "bg-purple-100 dark:bg-purple-900 text-purple-600",
    orange: "bg-orange-100 dark:bg-orange-900 text-orange-600",
    red: "bg-red-100 dark:bg-red-900 text-red-600",
    indigo: "bg-indigo-100 dark:bg-indigo-900 text-indigo-600",
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      <div className={`w-12 h-12 ${colorClasses[iconColor]} rounded-lg flex items-center justify-center mb-6`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">
        {description}
      </p>
    </div>
  );
}
