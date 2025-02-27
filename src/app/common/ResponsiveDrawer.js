'use client';
import React, { useState, useEffect } from 'react';
import {
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Menu,
  MenuItem,
  Avatar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Menu as MenuIcon, Home, Person, Info, Logout, ChevronLeft, ChevronRight } from '@mui/icons-material';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { url } from '../../../apiEndpoint';
import PasswordIcon from '@mui/icons-material/Password';

const drawerWidth = 200;

const ResponsiveDrawer = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    Cookies.remove('authToken');
    localStorage.removeItem('username');
    setAnchorEl(null);
    router.push('/');
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleChangePassword=()=>{
    router.push('/dashboard/change-password')
  }

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  useEffect(() => {
    if (menuItems.length > 0 && menuItems[0].dashboardLink !== 'dashboard-assign') {
      const pageLink = searchParams?.get("pageLink");
      const decodedPageLink = pageLink ? atob(pageLink) : null;

      const isActive = menuItems.some(
        (item) =>
          pathname === `/dashboard/${item.dashboardLink}` ||
          decodedPageLink === item.dashboardLink
      );

      if (!isActive) {
        const firstItem = menuItems[0];
        if (firstItem.dashboardName === "Dashboard Assign") {
          router.push(`/dashboard/${firstItem.dashboardLink}`);
        } else {
          router.push(`/dashboard?pageLink=${btoa(firstItem.dashboardLink)}`);
        }
      }
    } else if (menuItems.length > 0 && menuItems[0].dashboardLink === 'dashboard-assign') {
      router.push(`/dashboard/${menuItems[0].dashboardLink}`);
    }
  }, [menuItems]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUsername = localStorage.getItem('username');
      const storedUserId = localStorage.getItem('userId');

      setUsername(storedUsername);
      setUserId(storedUserId);

      const fetchMenuItems = async () => {
        try {
          const response = await axios.get(`${url}/dashboard/userdashboard/${storedUserId}`);
          setMenuItems(response?.data);
        } catch (error) {
          console.error('Error fetching menu items:', error);
        }
      };

      if (storedUserId) {
        fetchMenuItems();
      }
    }
  }, []);

  const iconMapping = {
    home: <Home />,
    dashboardAssign: <Person />,
    dashboardInfo: <Info />,
  };

  const DrawerSidebar = (
    <Box sx={{ width: drawerWidth, flexShrink: 0, overflow: 'hidden', pt: 8 }}>
      <List>
        {menuItems?.map((item) => {
          const pageLink = searchParams?.get('pageLink');
          const decodedPageLink = pageLink ? atob(pageLink) : null;
          const isActive =
            pathname === `/dashboard/${item.dashboardLink}` ||
            decodedPageLink === item.dashboardLink;

          return (
            <ListItem
              button
              key={item.id}
              onClick={() => {
                if (item.dashboardName === "DashBoard Assign") {
                  router.push(`/dashboard/${item.dashboardLink}`);
                } else {
                  router.push(`/dashboard?pageLink=${btoa(item.dashboardLink)}`);
                }
                setMobileOpen(false);
              }}
              selected={isActive}
              sx={{
                bgcolor: isActive ? 'rgb(179, 179, 77)' : 'transparent',
                color: isActive ? 'white' : 'inherit',
                '&:hover': { bgcolor: 'rgb(153, 153, 48)' },
              }}
            >
              <ListItemIcon sx={{ color: isActive ? 'white' : 'inherit' }}>
                {iconMapping[item.icon]}
              </ListItemIcon>
              <ListItemText primary={item.dashboardName} />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', overflowX: 'hidden' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "rgb(128,128,0)",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2, display: { sm: 'block' } }}
          >
            {drawerOpen ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>

          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Shanta Asset Management Limited
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton color="inherit" onClick={handleMenuOpen} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar sx={{ bgcolor: "white", color: "rgb(128,128,0)", width: 32, height: 32 }}>
                <Person />
              </Avatar>
              <Typography variant="body1" sx={{ fontWeight: "bold", color: "white" }}>
                {username}
              </Typography>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={handleChangePassword} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PasswordIcon fontSize="small" />
                Change Password
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Logout fontSize="small" />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerOpen ? drawerWidth : 0 }, flexShrink: { sm: 0 }, transition: 'width 0.3s' }}>
        <Drawer variant="permanent" sx={{ '& .MuiDrawer-paper': { width: drawerOpen ? drawerWidth : 0, transition: 'width 0.3s' } }} open>
          {DrawerSidebar}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 8, width: { sm: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)` }, transition: 'width 0.3s' }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default ResponsiveDrawer;
