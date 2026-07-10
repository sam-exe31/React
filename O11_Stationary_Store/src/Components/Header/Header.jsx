import React from "react"
import {Link} from "react-router-dom"

export default function Header(){

  return (
    <>
    <header className="">
        
      {/* --- LOGO & BRANDING --- */}
      {/* CHALLENGE 3: Add Tailwind classes to make the logo and name sit side-by-side (flex) with a small horizontal gap (gap-3) and centered vertically. */}
      <div className="_________________________________">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {/* CHALLENGE 4: What is the missing standard HTML attribute used for accessibility and when an image fails to load? */}
              <img src="/logo.png" _________="Stationary Store Logo" className="w-full h-full object-cover" />
          </div>
          {/* CHALLENGE 5: Style the store name text to be bold (font-bold) and extra large (text-xl). */}
          <h1 className="_______________________">The Inkwell</h1>
      </div>

      {/* --- NAVIGATION LINKS --- */}
      {/* CHALLENGE 6: Make this nav a flex container, add a gap of 6 between links, hide it on mobile screens, but display it as flex on medium (md) screens and up. */}
      <nav className="________________________________________________________">
          {/* CHALLENGE 7: Use the routing component you imported in Challenge 1 to link to the home route ("/"). */}
          <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Home
          </Link>

          <Link to="/category" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Category
          </Link>

          <Link to="/settings" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Settings
          </Link>
          
          {/* CHALLENGE 8: Style this login button! Give it a blue background, white text, horizontal padding of 4, vertical padding of 2, rounded corners, and a darker blue hover effect. */}
          <button className="________________________________________________________">
              Login
          </button>
      </nav>

    </header>
    </>
  )
};

