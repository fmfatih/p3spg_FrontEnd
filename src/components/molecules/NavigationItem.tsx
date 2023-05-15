/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { SVGProps, useState } from 'react';
import { Link, Stack, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useLocation, Link as LinkRouter, useNavigate } from 'react-router-dom';

type INavItem = {
  text: string;
  url: string;
};

interface IconProps {
  colors: {
    main: string;
    dark: string;
  }
}

type NavigationItemProps = {
  Icon: (props: SVGProps<SVGSVGElement> & IconProps) => JSX.Element;
  title: string;
  url: string;
  navItems?: Array<INavItem>;
}

export const NavigationItem = ({ navItems, title, url, Icon }: NavigationItemProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isExpanded = location.pathname.includes(url);

  const [isHover, setIsHover] = useState(false);

   const handleMouseEnter = () => {
      setIsHover(true);
   };
   const handleMouseLeave = () => {
      setIsHover(false);
   };

  return (
    <>
      {navItems?.length ? (
        <Accordion disableGutters defaultExpanded={isExpanded} sx={{ backgroundColor: 'none', boxShadow: '0', border: 0 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon color={isExpanded ? 'primary' : undefined}/>}
            sx={{ padding: 0, margin: 0, border: 0 }}>
            <Stack spacing={2} alignItems="center" direction="row">
              <Icon colors={isExpanded ? {
                dark: '#0c9fdc',
                main: '#85cfed'
              } : {
                dark: '#41414d',
                main: '#c0c0c7'
              }} />
              <Typography color={isExpanded ? 'primary' : 'text.subtle'} variant='body2'>{title}</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: '0 0 0 30px', margin: 0, border: 0 }}>
            {navItems.map((navItem) => {
              const isActive = navItem.url === location.pathname
              const handleClick = () => {
                navigate(`/${navItem.url}`, {
                  state: {}
                })
              }

              return (
                <a onClick={handleClick} style={{ cursor: 'pointer'   }}>
                  <Stack my={1} spacing={2} alignItems="center" direction="row" >
                    <Typography color={isActive ? 'primary' : 'text.subtle'}  variant='body2'>{navItem.text}</Typography>
                  </Stack>
                </a>
              )
            })}
          </AccordionDetails>
        </Accordion>
      ) : (
        <Link href={`/${url}`} underline="none">
          <Stack my={2} spacing={2} alignItems="center" direction="row" >
            <Icon colors= {location.pathname === url ? {
                dark: '#0c9fdc',
                main: '#85cfed'
              } : {
                dark: '#41414d',
                main: '#c0c0c7'
              }}/>
            <Typography color={location.pathname === url ? 'primary' : 'text.subtle'} variant='body2' >{title}</Typography>
          </Stack>
        </Link>
      )}
    </>
  )
}