import React from "react";
import { useRecoilState } from "recoil";
import Link from "next/link";
import { useRouter } from "next/router";
import { userAtom } from "@/Store/Atoms/UserAtom";

const Header = () => {
  const router = useRouter()
  const [user, setUser] = useRecoilState(userAtom);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser("");
    router.push("/login");
  };

  return (
    <div>
      <header>
        <nav className="bg-gray-600 border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
          <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <a href="/" className="flex items-center">
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="mr-3 h-6 sm:h-9"
                alt="Flowbite Logo"
              />
              <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                Chat App
              </span>
            </a>
            <div
              className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
              id="mobile-menu-2"
            >
              <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                <li>
                  <Link
                    href="/register"
                    className="block py-2 pr-4 pl-3 cursor-pointer text-white border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-gray-400 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    Register
                  </Link>
                </li>
                {user && user?.name ? (
                  <>
                    <li>
                      <a
                        onClick={logout}
                        className="block py-2 pr-4 pl-3 cursor-pointer text-white border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-gray-400 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                      >
                        Logout
                      </a>
                    </li>
                    <li>
                      <a
                        className="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:p-0 dark:text-white"
                        aria-current="page"
                      >
                        {user && user?.name && `Hi ${user?.name}`}
                      </a>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link
                      href="/login"
                      className="block py-2 pr-4 pl-3 cursor-pointer text-white border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-gray-400 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                    >
                      Login
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header;
