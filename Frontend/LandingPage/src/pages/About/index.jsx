const About = () => {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">About React Micro</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            React Micro is an enterprise-grade microfrontend platform that enables 
            organizations to build scalable, maintainable web applications using 
            modern architecture patterns.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Architecture</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>Module Federation for true micro-frontend deployment</li>
            <li>BFF (Backend For Frontend) pattern for optimized API interactions</li>
            <li>Event-driven microservices with Kafka messaging</li>
            <li>PostgreSQL databases with per-service isolation</li>
            <li>AWS ECS for container orchestration</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {technologies.map((tech, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                <span className="font-medium">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const technologies = [
  'React 18',
  'Redux Toolkit',
  'Tailwind CSS',
  'Node.js 24',
  'Express.js',
  'PostgreSQL',
  'Kafka',
  'Terraform',
];

export default About;
