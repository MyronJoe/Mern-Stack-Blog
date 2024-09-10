import { Button, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon } from 'react-icons/fa';

function Header() {
    const path = useLocation().pathname;

    return (
        <Navbar className='border-b-2'>
            <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
                <span className='bg-blue-900 py-1 px-2 text-white rounded-md'>Kamtech</span>Blog
            </Link>


            <form>
                <TextInput
                    type='text'
                    placeholder='Search...'
                    rightIcon={AiOutlineSearch}
                    className='hidden lg:inline'
                />
            </form>

            <Button className='w-12 h-10 lg:hidden' color='gray' pill>
                <AiOutlineSearch className='text-lg' />
            </Button>


            <div className="flex gap-2 content-center md:order-2">

                <Button className='w-12 h-10 ' color='gray' pill>
                    <FaMoon className='text-md mt-[0.12rem]' />
                </Button>

                <Link to='/sign-in' className='hidden md:inline'>
                    <Button gradientDuoTone='purpleToBlue' outline className=''>
                        Sign In
                    </Button>
                </Link>

                <Navbar.Toggle />
            </div>

            <Navbar.Collapse>

                <Navbar.Link as={'div'} active={path === "/"}>
                    <Link to='/'>
                        Home
                    </Link>
                </Navbar.Link>


                <Navbar.Link as={'div'} active={path === "/about"}>
                    <Link to='/about'>
                        About
                    </Link>
                </Navbar.Link>

                <Navbar.Link as={'div'} active={path === "/projects"}>
                    <Link to='/projects'>
                        Projects
                    </Link>
                </Navbar.Link>

                <Navbar.Link as={'div'} active={path === "/sign-in"} >
                    <Link to='/sign-in' className='md:hidden inline'>
                        Sign In
                    </Link>
                </Navbar.Link>

            </Navbar.Collapse>


        </Navbar>
    )
}

export default Header