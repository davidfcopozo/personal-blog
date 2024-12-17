import React from "react";
import { Github, Twitter, Linkedin, Globe } from "lucide-react";

export function AuthorPanel() {
  return (
    <aside className="w-full lg:w-72 p-6 bg-muted shadow-sm rounded-lg shadow-sm">
      <div className="flex flex-col items-center text-center">
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt="Author"
          className="w-24 h-24 rounded-full object-cover mb-4"
        />
        <h2 className="text-xl font-semibold text-foreground">John Doe</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Senior Software Engineer
        </p>
        <p className="text-sm text-muted-foreground mt-4 mb-6">
          Passionate about building great user experiences and sharing knowledge
          with the developer community.
        </p>

        <div className="flex gap-4 mb-6">
          {[Twitter, Github, Linkedin, Globe].map((Icon, index) => (
            <a
              key={index}
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>

        <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Follow
        </button>
      </div>
    </aside>
  );
}
