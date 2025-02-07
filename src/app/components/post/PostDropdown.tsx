"use client";

import { usePosts } from "@/app/data/posts";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface PostDropdownProps {
  post_id: number;
}

export default function PostDropdown({ post_id }: Readonly<PostDropdownProps>) {
  const router = useRouter();
  const { deletePost } = usePosts();
  const pathname = usePathname();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = (
    event: React.MouseEvent<HTMLLIElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(null);
  };

  const handleDelete = async (event: React.MouseEvent<HTMLLIElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(null);

    deletePost(post_id);
    if (pathname.includes(`post/${post_id}`)) {
      router.back();
    }
  };

  return (
    <Box>
      <IconButton
        onClick={handleClick}
        aria-controls={openMenu ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={openMenu ? "true" : undefined}
        color="primary"
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
        disableScrollLock={true}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          Delete Post
        </MenuItem>
      </Menu>
    </Box>
  );
}
