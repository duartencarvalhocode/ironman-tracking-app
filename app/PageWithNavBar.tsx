"use client"
import AddIcon from '@mui/icons-material/Add';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HomeIcon from '@mui/icons-material/Home';
import { Paper } from '@mui/material';
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Link from "next/link";
import { ReactNode } from "react";

interface PageWithNavBarProps {
    path: string
    children: ReactNode
}

export default function PageWithNavBar({ path, children }: PageWithNavBarProps) {
    return <Box>
        <Box>
            <Paper square sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: '0 16px' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {children}
                </LocalizationProvider>
            </Paper>
        </Box>
        <BottomNavigation sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, overflow: 'none' }} value={path}>
            <BottomNavigationAction
                label="Feed"
                value="/"
                icon={<HomeIcon />}
                component={Link}
                href="/"
            />
            <BottomNavigationAction
                label="New activity"
                value="/new-workout"
                icon={<AddIcon />}
                component={Link}
                href="/new-workout"
            />
            <BottomNavigationAction
                label="Your activities"
                value="/your-activities"
                icon={<AssessmentIcon />}
                component={Link}
                href="/your-activities"
            />
        </BottomNavigation>
    </Box>
}