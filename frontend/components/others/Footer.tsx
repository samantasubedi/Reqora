import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className="border-t bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Resource Management
              </h2>
              <p className="mt-3 text-sm text-gray-600">
                Streamline resource allocation, monitor availability, and manage
                employee requests from a single platform.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-black">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black">
                    Resources
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black">
                    Requests
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black">
                    Employees
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Support</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Help Center</li>
                <li>Documentation</li>
                <li>Contact Admin</li>
                <li>Report Issue</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">System</h3>

              <div className="space-y-3 text-sm text-gray-600">
                <div>
                  <p>Version</p>
                  <p className="font-medium text-gray-900">v1.0.0</p>
                </div>

                <div>
                  <p>Status</p>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    <span>Operational</span>
                  </div>
                </div>

                <div>
                  <p>Last Updated</p>
                  <p className="font-medium text-gray-900">June 2026</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t pt-5 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
            <p>© 2026 Resource Management System. All rights reserved.</p>

            <div className="flex gap-4 mt-3 md:mt-0">
              <a href="#" className="hover:text-black">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-black">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
