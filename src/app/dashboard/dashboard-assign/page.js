'use client'
import { Box, Button, Checkbox, CircularProgress, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';
import {  url } from '../../../../apiEndpoint';
const page = () => {

  const [options, setOptions] = useState([]); // API data
  const [selectedValue, setSelectedValue] = useState(''); // Selected dropdown value
  const [loading, setLoading] = useState(true); // Loading state
  const [dashboardInfo, setDashboardInfo] = useState([]); // Full dashboard info
  const [userDashboard, setUserDashboard] = useState([]); // User-specific dashboard info
  const [checkedItems, setCheckedItems] = useState([]);
  const [changes, setChanges] = useState([]); // Track all additions and removals

  useEffect(()=>{
    fetchData2()
  },[selectedValue])
  const handleSelectChange=(e)=>{
    setSelectedValue(e.target.value)
    setCheckedItems([])
  }
  const fetchData2=async()=>{
    if(selectedValue){
      try {
        const response = await axios.get(`${url}/dashboard/userdashboard/${selectedValue}`); // Replace with your API endpoint
  
        const checkedArr=response.data.map(e=>e.dashboardId)
        setCheckedItems(checkedArr);
      } catch (error) {
  
      }
    }

  }  
  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${url}/auth/users`); // Replace with your API endpoint
        setOptions(response?.data?.data); // Assuming response.data is an array of objects
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleCheckboxChange = (id) => {
    const isChecked = checkedItems.includes(id);

    if (isChecked) {
      // If already selected and now unchecked
      setCheckedItems((prev) => prev.filter((item) => item !== id)); // Remove from checked list
      setChanges((prev) => {
        const existingChange = prev.find((change) => change.id === id);
        if (existingChange?.action === 'add') {
          // If previously marked as 'add', remove from changes
          return prev.filter((change) => change.id !== id);
        }
        // Mark for removal
        return [...prev, { id, action: 'remove' }];
      });
    } else {
      // If unchecked and now selected
      setCheckedItems((prev) => [...prev, id]); // Add to checked list
      setChanges((prev) => {
        const existingChange = prev.find((change) => change.id === id);
        if (existingChange?.action === 'remove') {
          // If previously marked as 'remove', remove from changes
          return prev.filter((change) => change.id !== id);
        }
        // Mark for addition
        return [...prev, { id, action: 'add' }];
      });
    }
  };
  const handleSaveChanges = async () => {

    const addRequests = changes.filter((change) => change.action === 'add');
    const removeRequests = changes.filter((change) => change.action === 'remove');
 
    try {

      // Replace with your batch API endpoint
     const response= await axios.post(`${url}/dashboard/updatePermissions/${selectedValue}`, {
        add: addRequests.map((change) => change.id),
        remove: removeRequests.map((change) => change.id),
      });

      // Clear changes after saving
      setChanges([]);
      setSelectedValue("");
      setCheckedItems([]);
        toast.success('Permission updated successful!');
      
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  // Fetch all dashboard info and user-specific dashboard info
  useEffect(() => {
    const fetchDashboardInfo = async () => {
      try {

        const dashboardResponse = await axios.get(`${url}/dashboard/dashboardLink`) // Fetch all dashboards
        
        setDashboardInfo(dashboardResponse.data);
       // setUserDashboard(userResponse.data.map((item) => item.id)); // Extract IDs
      } catch (error) {
        console.error('Error fetching dashboard info:', error);
      }
    };

    fetchDashboardInfo();
  }, []);

  return (
<Box>
{loading ? (
        <CircularProgress />
      ) : (
        <>
          <FormControl sx={{width:300}}>
          <InputLabel id="dropdown-label">User</InputLabel>
          <Select
            labelId="dropdown-label"
            name="user"
            value={selectedValue}
            onChange={handleSelectChange}
            label="Options"
          >
            {options?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.username}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormGroup
  sx={{
    display: 'flex',
    flexDirection: 'row', // Arrange items in a row
    // flexWrap: 'wrap', // Allow items to wrap if they don't fit
    gap: 2, // Add spacing between checkboxes
  }}
>
{dashboardInfo?.map((item) => (
    <FormControlLabel
      key={item.id}
      control={
        <Checkbox
          checked={checkedItems.includes(item.id)}
          onChange={(e) => handleCheckboxChange(item.id, e.target.checked)}
        />
      }
      label={item.name}
    />
  ))}
</FormGroup>
<Button 
  variant="contained" 
  onClick={handleSaveChanges}
  sx={{ 
    backgroundColor: 'rgb(128,128,0)', 
    '&:hover': { backgroundColor: 'rgb(100,100,0)' } // Darker shade on hover
  }}
>
  Save
</Button>
        </>

      )}
    </Box>
  );
}
export default page