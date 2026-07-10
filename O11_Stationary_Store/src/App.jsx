
import './App.css'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { Home ,Footer,Header } from './Components/index';

const Layout=()=>{

    return(<>
        <Header/>
        <main className='flex-grow'>
          <Outlet/>
        </main>
        <Footer/>
    </>)
}



const Setting = () => <h3>This is the About Page.</h3>;
const Category = () => <h3>Get in touch on the Contact Page.</h3>;
  const router=createBrowserRouter([
    {
      path:"/",
      element:<Layout/>,
      children:[
        {
          path:'/',
          element:<Home/>
        },
        {
          path:'/category',
          element:<Category/>
        },
        {
          path:'/setting',
          element:<Setting/>
        }
      ]
    }
  ]);

function App() {

  
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
