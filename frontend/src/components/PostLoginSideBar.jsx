import React from "react";
import { Link } from "react-router-dom";

function PostLoginSideBar() {
  return (
    <>
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span class="sr-only">Open sidebar</span>
        <svg
          class="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clip-rule="evenodd"
            fill-rule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="default-sidebar"
        class="relative top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 shadow-2xl"
        aria-label="Sidebar"
      >
        <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul class="space-y-2">
            <li className="font-semibold mb-4 p-2 text-gray-900 rounded-lg dark:text-white">
              AIVA
            </li>
            <li>
              <Link
                to="/assignments"
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
                <span class="ms-3">Assignment</span>
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 1920 1920"
                >
                  <path
                    d="M959.342 1355.283c4.287.007 20.897.18 45.834 4.517l-3.388 55.341c-1.13 29.365-25.976 53.083-55.34 53.083-65.507 0-110.683 19.2-141.177 57.6-68.895 88.094-45.177 263.153-30.495 324.14 4.518 16.942 0 35.013-10.164 48.566-11.294 13.553-27.106 21.458-44.047 21.458h-212.33c-31.623 0-56.47-24.847-56.47-56.47v-508.235Zm627.82-1324.044c11.633-23.492 37.61-35.576 63.473-29.816 25.525 6.099 43.483 28.8 43.483 55.002V570.42C1822.87 596.623 1920 710.693 1920 847.013c0 136.32-97.13 250.504-225.882 276.706v513.883c0 26.202-17.958 49.016-43.483 55.002a57.279 57.279 0 0 1-12.988 1.468c-21.12 0-40.772-11.746-50.485-31.172C1379.238 1247.164 964.18 1242.307 960 1242.307H395.294c-155.746 0-282.353-126.607-282.353-282.352v-56.471h-56.47C25.299 903.484 0 878.298 0 847.014c0-31.172 25.299-56.471 56.47-56.471h56.471v-56.47c0-155.634 126.607-282.354 282.353-282.354h564.593c16.941-.113 420.48-7.002 627.275-420.48Z"
                    fillRule="evenodd"
                  />
                </svg>
                <span class="flex-1 ms-3 whitespace-nowrap">Announcements</span>
                {/* <span class="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                  Pro
                </span> */}
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  class="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                >
                  <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                </svg>
                <span class="flex-1 ms-3 whitespace-nowrap">Attendance</span>
                {/* <span class="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                  Pro
                </span> */}
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 97.496 97.496"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M91.873,61.746H62.336v13.406c0,4.686-3.812,8.5-8.5,8.5H43.66c-4.687,0-8.5-3.814-8.5-8.5V61.746H5.623 c-1.104,0-2,0.895-2,2v31.75c0,1.104,0.896,2,2,2h86.25c1.104,0,2-0.896,2-2v-31.75C93.873,62.641,92.977,61.746,91.873,61.746z" />
                  <path d="M27.57,36.373c0.375,0.375,0.884,0.586,1.414,0.586c0.53,0,1.039-0.211,1.414-0.586L41.66,25.111v50.045 c0,1.105,0.896,2,2,2h10.176c1.104,0,2-0.895,2-2V25.111l11.262,11.262c0.781,0.781,2.049,0.781,2.828,0l6.598-6.598 c0.375-0.375,0.586-0.885,0.586-1.414c0-0.531-0.211-1.039-0.586-1.414L50.161,0.586C49.786,0.211,49.277,0,48.747,0 c-0.53,0-1.039,0.211-1.414,0.586l-26.36,26.361c-0.781,0.781-0.781,2.047,0,2.828L27.57,36.373z" />
                </svg>
                <span class="flex-1 ms-3 whitespace-nowrap">
                  Upload Schedule
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1920 1920"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M735.385 336.094c218.24 0 395.977 177.624 395.977 395.976v113.137c0 121.96-56.568 229.78-143.57 302.526 94.13 13.916 187.354 34.959 278.315 64.6 122.414 39.825 204.664 155.676 204.664 288.159v200.364l-26.814 16.63c-148.434 92.32-392.017 202.515-708.572 202.515-174.795 0-439.76-35.186-708.685-202.514L0 1700.856v-189.39c0-140.629 89.264-263.042 221.973-304.79 85.418-26.7 172.533-46.498 260.327-59.509-86.55-72.746-142.891-180.339-142.891-301.96V732.07c0-218.352 177.623-395.976 395.976-395.976ZM1183.405 0c218.24 0 395.976 177.624 395.976 395.977v113.136c0 121.96-56.568 229.893-143.57 302.526 94.13 13.916 187.241 35.072 278.316 64.6 122.413 40.051 204.663 155.79 204.663 288.272v200.364l-26.7 16.631c-77.612 48.31-181.81 101.03-308.183 140.742v-21.723c0-181.696-113.589-340.766-282.727-395.75a1720.133 1720.133 0 0 0-111.553-32.244c35.751-69.805 54.871-147.416 54.871-227.29V732.104c0-250.483-182.036-457.975-420.414-500.175C886.762 95.487 1023.656 0 1183.404 0Z"
                    fillRule="evenodd"
                  />
                </svg>
                <span class="flex-1 ms-3 whitespace-nowrap">
                  Registered Users
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}

export default PostLoginSideBar;
