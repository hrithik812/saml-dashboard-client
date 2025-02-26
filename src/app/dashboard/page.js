'use client';
import React, { useEffect, useState } from 'react';
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
const Home = () => {
  const searchParams = useSearchParams();
  const dashboardLink = searchParams.get('pageLink');
  
   
  // useEffect(() => {
  //   if (dashboardLink) {
  //     console.log('Dashboard Link:', dashboardLink);
  //     // You can perform additional actions here, such as embedding the dashboard
  //   }
  // }, [dashboardLink]);

  return (
     <>
     <div>
      {dashboardLink ? (
        <iframe
          src={atob(dashboardLink)}
          style={{ width: '100%', height: '80vh', border: 'none' }}
        ></iframe>
      ) : (
        <p>No dashboard selected.</p>
      )}
    </div>
     </>
  );
};

export default Home;
