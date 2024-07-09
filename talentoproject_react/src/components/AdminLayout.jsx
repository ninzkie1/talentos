import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useStateContext } from "../context/contextprovider";

export default function AdminLayout() {
  const { user, token, setToken } = useStateContext();
  const [open, setOpen] = React.useState(0);
  const navigate = useNavigate(); // Hook for programmatic navigation

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  const onLogout = (ev) => {
    ev.preventDefault();
    setToken(null);
  };

  const navigateToUsers = () => {
    // Programmatic navigation to /users
    navigate("/users");
  };

  const navigateToReports = () => {
    // Programmatic navigation to /reports
    navigate("/reports");
  };

  if (!token) {
    return <Navigate to='login' />;
  }

  return (
    <div className="flex min-h-full">
      <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 bg-gray-200">
        <div className="mb-2 p-4">
          <Typography variant="h5" color="blue-gray">
            Sidebar
          </Typography>
        </div>
        <List>
          <Accordion
            open={open === 1}
            icon={
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`mx-auto h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""}`}
              />
            }
          >
            <ListItem className="p-0" selected={open === 1}>
              <AccordionHeader onClick={() => handleOpen(1)} className={`border-b-0 p-3 ${open === 1 ? 'bg-black text-white' : 'hover:bg-gray-300'}`}>
                <ListItemPrefix>
                  <PresentationChartBarIcon className="h-5 w-5" />
                </ListItemPrefix>
                <Typography color="blue-gray" className="mr-auto font-normal">
                  Dashboard
                </Typography>
              </AccordionHeader>
            </ListItem>
            {open === 1 && (
              <AccordionBody className="py-1">
                <List className="p-0">
                  <ListItem onClick={navigateToReports}>
                    <ListItemPrefix>
                      <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                    </ListItemPrefix>
                    Reporting
                  </ListItem>
                </List>
              </AccordionBody>
            )}
          </Accordion>
          <Accordion
            open={open === 2}
            icon={
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`mx-auto h-4 w-4 transition-transform ${open === 2 ? "rotate-180" : ""}`}
              />
            }
          >
            <ListItem className="p-0" selected={open === 2}>
              <AccordionHeader onClick={() => handleOpen(2)} className={`border-b-0 p-3 ${open === 2 ? 'bg-black text-white' : 'hover:bg-gray-300'}`}>
                <ListItemPrefix>
                  <ShoppingBagIcon className="h-5 w-5" />
                </ListItemPrefix>
                <Typography color="blue-gray" className="mr-auto font-normal">
                  Bookings
                </Typography>
              </AccordionHeader>
            </ListItem>
            {open === 2 && (
              <AccordionBody className="py-1">
                <List className="p-0">
                  <ListItem>
                    <ListItemPrefix>
                      <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                    </ListItemPrefix>
                    Orders
                  </ListItem>
                  <ListItem>
                    <ListItemPrefix>
                      <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                    </ListItemPrefix>
                    Products
                  </ListItem>
                </List>
              </AccordionBody>
            )}
          </Accordion>
          <ListItem className={`p-3 ${open === 3 ? 'bg-black text-white' : 'hover:bg-gray-300'}`} onClick={navigateToUsers}>
            <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5" />
            </ListItemPrefix>
            Users
          </ListItem>
          <ListItem onClick={onLogout} className="hover:bg-gray-300">
            <ListItemPrefix>
              <PowerIcon className="h-5 w-5" />
            </ListItemPrefix>
            Log Out
          </ListItem>
        </List>
      </Card>
      <div className="flex-1">
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{/* Your content */}</div>
        </main>
        <Outlet />
      </div>
    </div>
  );
}
