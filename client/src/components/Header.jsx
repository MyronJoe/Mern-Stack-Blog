import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';

function Header() {
    const path = useLocation().pathname;
    const dispatch = useDispatch()

    const {theme} = useSelector(state => state.theme)

    const { currentUser } = useSelector(state => state.user)

    return (
        <Navbar className='border-b-2'>
            <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
                <span className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-1 px-2 text-white rounded-md'>Kamtech</span>Blog
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

                <Button className='w-12 h-10 ' color='gray' pill onClick={() => dispatch(toggleTheme())}>
                    {theme === 'light' ? <FaMoon className='text-md mt-[0.12rem]' /> : <FaSun className='text-md mt-[0.12rem]'/>}
                </Button>

                {
                    currentUser ? (
                        <Dropdown
                            arrowIcon={false}
                            inline
                            label={
                                <Avatar alt='user' img={currentUser.profilePicture} rounded />
                            }
                        >
                            <Dropdown.Header>
                                <span className='block text-sm'>@{currentUser.username}</span>
                                <span className='block text-sm font-medium truncate'>
                                    {currentUser.email}
                                </span>
                            </Dropdown.Header>
                            <Link to={'/dashboard?tab=profile'}>
                                <Dropdown.Item>Profile</Dropdown.Item>
                            </Link>
                            <Dropdown.Divider />
                            <Dropdown.Item >Sign out</Dropdown.Item>
                        </Dropdown>
                    ) : (
                        <Link to='/sign-in' className='hidden md:inline'>
                            <Button gradientDuoTone='purpleToBlue' outline className=''>
                                Sign In
                            </Button>
                        </Link>

                    )
                }


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

                {
                    !currentUser &&

                    <Navbar.Link as={'div'} active={path === "/sign-in"} >
                        <Link to='/sign-in' className='md:hidden inline'>
                            Sign In
                        </Link>
                    </Navbar.Link>
                }

            </Navbar.Collapse>


        </Navbar>
    )
}

export default Header