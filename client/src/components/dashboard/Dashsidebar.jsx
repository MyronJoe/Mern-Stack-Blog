import { useEffect, useState } from 'react'
import { Sidebar } from 'flowbite-react'
import { HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiUser, HiAnnotation, HiChartPie } from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom'
import { signoutSuccess } from '../../redux/user/userSlice'
import { useDispatch, useSelector } from 'react-redux'

export default function Dashsidebar() {

    const location = useLocation()
    const [tab, setTab] = useState();
    const dispatch = useDispatch()

    const { currentUser } = useSelector(state => state.user)

    //helps to search the url to get the current tab and update the tab state.
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const tabFromURL = urlParams.get('tab')

        if (tabFromURL) {
            setTab(tabFromURL)
        }
    }, [location.search])

    const handleSignout = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: 'POST'
            })

            const data = await res.json()

            if (!res.ok) {
                console.log(data.message)
            } else {
                dispatch(signoutSuccess())
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup className='flex flex-col gap-1'>

                    {currentUser && currentUser.isAdmin && (
                        <Link to='/dashboard?tab=dash'>
                            <Sidebar.Item
                                active={tab === 'dash' || !tab}
                                icon={HiChartPie}
                                as='div'
                            >
                                Dashboard
                            </Sidebar.Item>
                        </Link>
                    )}

                    <Link to='/dashboard?tab=profile' >
                        <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? 'Admin' : 'User'} labelColor='dark' as='div'>
                            Profile
                        </Sidebar.Item>
                    </Link>

                    {
                        currentUser.isAdmin &&

                        <Link to='/dashboard?tab=posts' >
                            <Sidebar.Item active={tab === 'posts'} icon={HiDocumentText} labelColor='dark' as='div'>
                                Posts
                            </Sidebar.Item>
                        </Link>
                    }

                    {
                        currentUser.isAdmin &&

                        <Link to='/dashboard?tab=users' >
                            <Sidebar.Item active={tab === 'users'} icon={HiOutlineUserGroup} labelColor='dark' as='div'>
                                Users
                            </Sidebar.Item>
                        </Link>
                    }

                    {
                        currentUser.isAdmin &&

                        <Link to='/dashboard?tab=comments' >
                            <Sidebar.Item active={tab === 'comments'} icon={HiAnnotation} labelColor='dark' as='div'>
                                Comments
                            </Sidebar.Item>
                        </Link>
                    }

                    {
                        currentUser.isAdmin &&

                        <Link to='/dashboard?tab=categories' >
                            <Sidebar.Item active={tab === 'categories'} icon={HiAnnotation} labelColor='dark' as='div'>
                                Categories
                            </Sidebar.Item>
                        </Link>
                    }

                    <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer" onClick={handleSignout}>
                        Sign Out
                    </Sidebar.Item>

                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}
