'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { usePhukien } from "./context/PhukienContext";
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { cal_Status } from "@/lib/utils";
export default function PrimarySearchAppBar() {
    const pathname = usePathname(); // Lấy đường dẫn hiện tại
    const router = useRouter();

    const [STATUS_ADMIN, setStatusAdmin] = useState(5);
    const { getItemsByQuery } = usePhukien();

    const [searchText, setSearchText] = useState("");
    const handleSearchChange = (event) => {
        setSearchText(event.target.value); // Cập nhật state khi người dùng nhập

    };
    const handleKeyDown = async (event) => {
        if (event.key === "Enter") {
            getItemsByQuery(pathname, searchText)


        }
    };
    

    // const STATUS_ADMIN = (typeof window) == undefined ? 5:cal_Status(localStorage.getItem("userStatus"))
    useEffect(() => {
        if (typeof window !== "undefined") {
            const userStatus = localStorage.getItem("userStatus");
            if (userStatus !== null) {
                setStatusAdmin(cal_Status(userStatus));
            }
        }
    }, []);

    // let pages = [
    //     {
    //         typeLink: 'sanpham',
    //         nameLink: "Sản Phẩm"
    //     },
    //     {
    //         typeLink: 'vatlieu',
    //         nameLink: "Vật Liệu"
    //     },
    //     {
    //         typeLink: 'phukien',
    //         nameLink: "Phụ Kiện"
    //     },
    //     {
    //         typeLink: 'larkUser',
    //         nameLink: "lark User"
    //     },
    //     {
    //         typeLink: 'partnerShip',
    //         nameLink: "partnerShip"
    //     }
    //     ,
    //     {
    //         typeLink: 'editUsers',
    //         nameLink: "tài khoản đăng nhập"
    //     }];

    let pages = [
        {
            typeLink: 'sanpham',
            nameLink: "Sản Phẩm"
        },
        STATUS_ADMIN != 4 && {
            typeLink: 'vatlieu',
            nameLink: "Vật Liệu"
        },
        STATUS_ADMIN != 4 && {
            typeLink: 'phukien',
            nameLink: "Phụ Kiện"
        },
        STATUS_ADMIN == 1 && {
            typeLink: 'larkUser',
            nameLink: "lark User"
        },
        STATUS_ADMIN == 1 && {
            typeLink: 'partnerShip',
            nameLink: "partnerShip"
        }
        ,
        STATUS_ADMIN == 1 && {
            typeLink: 'editUsers',
            nameLink: "tài khoản đăng nhập"
        }];

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "GET", credentials: "include" });
        localStorage.removeItem("userStatus");
        // Xóa cookie trên trình duyệt (tránh bị cache)
        document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

        router.push("/login");
    };
    pages = pages.filter(item => item !== false)
    console.log(pages);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                        Hehe
                    </Typography>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                            value={searchText} // Gắn state vào input
                            onChange={handleSearchChange} // Hàm xử lý khi giá trị thay đổi
                            onKeyDown={handleKeyDown} // Xử lý khi nhấn Enter
                        />
                    </Search>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((itemkk, key) => (
                            <Link className='linkfv' href={"/" + itemkk.typeLink} key={key} passHref onClick={() => getItemsByQuery("/" + itemkk.typeLink, "activeItemsToDedault")} >
                                <Button className={(pathname == ("/" + itemkk.typeLink)) ? "activenavc" : "noactivenavc"}


                                    sx={{ my: 2, color: 'white', display: 'block', textTransform: 'none' }}
                                >
                                    {itemkk.nameLink}
                                </Button>
                            </Link>
                        ))}
                    </Box>
                    <Button className={"vsdvdsvdsvds"} onClick={handleLogout}
                        sx={{ my: 2, color: 'white', display: 'block', textTransform: 'none' }}
                    >
                        Đăng xuất
                    </Button>

                </Toolbar>
            </AppBar>

        </Box >
    );
}







const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));
