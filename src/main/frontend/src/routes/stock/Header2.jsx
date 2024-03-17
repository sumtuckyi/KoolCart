import * as React from 'react';
import PropTypes from 'prop-types';
import { AppBar, Avatar, Button, Grid, IconButton, Link, Box } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Clock from '../../component/Clock';

const lightColor = 'rgba(255, 255, 255, 0.7)';
const darkColor = 'rgba(58, 61, 76, 1)';

function Header2(props) {
  const { onDrawerToggle } = props;

  return (
    <React.Fragment>

    <Grid container sx={{ backgroundColor: '#3a3d4c' }}>
      <Grid item xs={12}>
        <Grid container sx={{ ml: 2 }}>
          <Grid item xs={6} sx={{ color: '#FFFFFF' }}>
            <Grid sx={{ display: { sm: 'none', xs: 'block' } }} item>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={onDrawerToggle}
                edge="start"
              >
                <MenuIcon />
              </IconButton>
            </Grid>
            <Clock />
          </Grid>
          <Grid item xs={6} sx={{  display: 'flex', justifyContent:'center', alignItems: 'center'}}>
            <Link
                href="/testdb"
                variant="body2"
                sx={{
                  textDecoration: 'none',
                  color: lightColor,
                  '&:hover': { color: 'common.white', },
                }}
                rel="noopener noreferrer"
              >
                      <Box sx={{ backgroundColor: '#289AFF',
                                 boxShadow: 1,
                                 borderRadius: 1,
                                 textAlign: 'center',
                                 width: '150%',
                                 height: '150%',
                                }}>
                        + 제품수기 입력
                      </Box>
              </Link>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
      
      {/* <AppBar
        component="div"
        color="primary"
        position="static"
        elevation={0}
        sx={{ zIndex: 0 }}
      >
        <Toolbar>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs>
              <Typography color="inherit" variant="h5" component="h1">
                Authentication
              </Typography>
            </Grid>
            <Grid item>
              <Button
                sx={{ borderColor: lightColor }}
                variant="outlined"
                color="inherit"
                size="small"
              >
                Web setup
              </Button>
            </Grid>
            <Grid item>
              <Tooltip title="Help">
                <IconButton color="inherit">
                  <HelpIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar> */}

      <AppBar component="div" position="static" elevation={0} sx={{ zIndex: 0 }}>
        <Tabs value={0} textColor="inherit">
          <Tab label="ㄱ-ㄴ" />
          <Tab label="유통기한" />
          <Tab label="최신순" />
        </Tabs>
      </AppBar>
      
    </React.Fragment>
  );
}

Header.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired,
};

export default Header2;
