import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import { Checkbox, FormControl, FormControlLabel, FormLabel, Menu, MenuItem, Radio, RadioGroup, Typography } from '@mui/material';
import { FilterAlt, LocalOffer, Settings, SwapVert, ThumbUp,  } from '@mui/icons-material';
import { useState} from "react";
import Order from './Order'

function SideBar (){
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const [selectedValue, setSelectedValue] = useState(0);
  
  const handleChange = () => {
    setSelectedValue(selectedValue+ 1);
    alert(selectedValue);
  };

  const label = { slotProps: { input: { 'aria-label': 'Checkbox demo' } } };

  return (
    <>
        <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
            >
            <MenuIcon onClick={toggleDrawer(true)} />
        </IconButton>
    
      <Drawer open={open}  onClose={toggleDrawer(false)}>
        <Box sx={{color: 'text.primary'}}>
          <Typography
            fontWeight={'bold'} 
            variant="h6"
            noWrap
            component="div"
            justifyContent="center"
            sx={{ display: 'flex', mt : 1, fontSize: 20}}>
              Group 3
          </Typography>
          <Typography
            fontWeight={'bold'} 
            variant="h6"
            noWrap
            component="div"
            justifyContent="center"
            sx={{ display: 'flex', fontSize: 30}}>
              Product Catalog
          </Typography>

        <Divider />

        </Box>
        <Box sx={{ width: 300, mt : 1}} role="presentation" >
          <List>
          <ListItem sx={{bgcolor: 'warning.main'}} >
              <ListItemIcon>
                  <FilterAlt />
              </ListItemIcon>
              <ListItemText primary={'Search Filter'}/>
          </ListItem>

          <Divider />

          <ListItem  sx={{ mt: 1 }}>
              <ListItemIcon>
                  <ThumbUp />
              </ListItemIcon>
              <ListItemText primary={'Sort Rating'} />
          </ListItem>
          <Order name = 'Highest' view = 'sb'/>

          <ListItem  sx={{ mt: 1 }}>
              <ListItemIcon>
                  <SwapVert />
              </ListItemIcon>
              <ListItemText primary={'Sort Price'} />
          </ListItem>
          <Order name = 'Ascending'  view = 'sb'/>
          <Order name = 'Descending'  view = 'sb'/>


          <ListItem disablePadding sx={{ mt: 1 }}>
            <ListItemButton>
              <ListItemIcon>
                  <LocalOffer />
              </ListItemIcon>
              <ListItemText primary={'Huge Sale'} />
            </ListItemButton>
          </ListItem>
      </List>

      <Divider />

      <List sx={{ mt: 1 }}>
        {['Messages', 'Settings'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <MailIcon /> : <Settings />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
        </Box>
      </Drawer>
    </>
  );
}

export default SideBar

