import React from 'react';
import { Box,  Grid, Typography, Link, Divider } from '@mui/material';  // Import Grid2 as Grid
import { Facebook, Twitter, LinkedIn, Instagram } from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: 'background.default', color: 'text.primary', pb: 4 }}>
      <Grid container spacing={4} className='px-5' justifyContent="center">
        {/* About Section */}
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            About Us
          </Typography>
          <Typography variant="body2">
            Welcome to the leading source of Forex news, providing up-to-date information on currency pairs, market trends, and economic events.
          </Typography>
        </Grid>

        {/* Quick Links Section */}
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Quick Links
          </Typography>
          <Box>
            <Link href="/" color="inherit" variant="body2" display="block" sx={{ mb: 1 }}>
              About
            </Link>
            <Link href="/" color="inherit" variant="body2" display="block" sx={{ mb: 1 }}>
              Forex News
            </Link>
            <Link href="/" color="inherit" variant="body2" display="block" sx={{ mb: 1 }}>
              Contact Us
            </Link>
            <Link href="/" color="inherit" variant="body2" display="block">
              Privacy Policy
            </Link>
          </Box>
        </Grid>

        {/* Follow Us Section */}
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Follow Us
          </Typography>
          <Box display="flex" justifyContent="space-evenly" sx={{ maxWidth: 180 }}>
            <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Twitter sx={{ color: 'text.secondary', '&:hover': { color: '#1DA1F2' } }} />
            </Link>
            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <Facebook sx={{ color: 'text.secondary', '&:hover': { color: '#1877F2' } }} />
            </Link>
            <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <LinkedIn sx={{ color: 'text.secondary', '&:hover': { color: '#0077B5' } }} />
            </Link>
            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Instagram sx={{ color: 'text.secondary', '&:hover': { color: '#E1306C' } }} />
            </Link>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />
      <Typography variant="body2" color="text.secondary" align="center">
        &copy; 2024 Forex News. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
