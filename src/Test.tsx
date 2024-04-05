import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

interface Data {
  id: number;
  name: string;
  email: string;
  // Add more properties as needed
}


const Test: React.FC = () => {
  const [openDrawer, setOpenDrawer] = useState(true);

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  // Sample data, replace with your actual data
  const data: Data[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    // Add more data objects as needed
  ];

  return (
    <div>
      <Drawer
        variant="persistent"
        anchor="left"
        open={openDrawer}
      >
        <List>
          <ListItem button onClick={handleDrawerClose}>
            <ListItemText>Close Drawer</ListItemText>
          </ListItem>
          {/* Add more items as needed */}
        </List>
      </Drawer>
      <div>
        <button onClick={handleDrawerOpen}>Open Drawer</button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                {/* Add more headers as needed */}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  {/* Add more cells as needed */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Test;
