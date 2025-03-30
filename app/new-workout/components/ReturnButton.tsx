"use client";
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { useRouter } from "next/navigation";

interface ReturnButtonProps {
    destination?: string
}

export default function ReturnButton({ destination = '/' }: ReturnButtonProps) {
    const router = useRouter()
    return <IconButton aria-label="delete" onClick={() => router.push(destination)} sx={{ paddingRight: 0 }}>
        <CloseIcon />
    </IconButton>
}